'use strict';

// Load runtime
require('./lib/runtime');

// Load NPM modules
const isPortFree = require('is-port-free');
const path = require('path');
const fs = require('fs');
const {shuffle} = require('lodash');

// Load classes
const LocalDatabase = require('./lib/db');
const ServiceCore = require('./lib');

// Load package.json
const packageJson = require('./package.json');

// Load core operations
const serviceCoreOperations = require('./lib/core');

// Load templates
const commandBodyObject = require('./lib/template/command.js');
const responseBodyObject = require('./lib/template/response.js');

// Load network components
const {
  createListener,
  createSpeaker,
  createSpeakerReconnector,
} = require('./lib/net');

// Microservice options
const defaultServiceOptions = {
  loadBalancing: 'roundRobin',
  runOnStart: [],
  instances: 1,
};

// Instance options
const defaultInstanceOptions = {
  mode: 'server',
  databaseName: '_defaultDatabase',
  verbose: true,
  maxBuffer: 50, // in megabytes
  logPath: void 0,
  restartTimeout: 50,
  connectionTimeout: 1000,
  microServiceConnectionTimeout: 10000,
  microServiceConnectionAttempts: 1000,
  apiGatewayPort: 8080,
  portRangeStart: 1024,
  portRangeFinish: 65535,
  coreOperations: {},
  runOnStart: [],
};

// Declare class
class MicroServiceFramework extends ServiceCore {
  constructor(options) {
    // Super
    super(options);
    // Connection tracking number
    this.conId = 0;
    // Declare settings
    this.settings = Object.assign(defaultInstanceOptions, options);
    // Initialise database
    this.db = {};
    this.settings.databaseNames.forEach((table) => {
      this.db[table] = new LocalDatabase({
        databaseName: table,
      }).db;
    });
    // Set process env settings
    process.env.settings = this.settings;
    process.env.exitedProcessPorts = [];
    // Store server external interfaces
    this.externalInterfaces = {};
    // Service process
    this.coreOperations = {};
    this.serviceInfo = {};
    this.serviceOptions = {};
    this.serviceData = {};
    // Define port tracking array
    this.inUsePorts = [];
    // Bind methods
    [
      'assignCoreFunctions',
      'startServerFailed',
      'startServer',
      'initGateway',
      'bindGateway',
    ].forEach((func) => (this[func] = this[func].bind(this)));
  }

  // FUNCTION: Start server failed
  startServerFailed() {
    return setTimeout(() => process.exit(), 0);
  }

  // FUNCTION: Start the server
  startServer() {
    return (async () => {
      try {
        if (['client', 'server'].includes(this.settings.mode)) {
          if (this.settings.mode === 'server') {
            await this.assignCoreFunctions();
            await this.initGateway();
            await this.bindGateway();
            await this.startServices();
            await this.executeInitialFunctions('coreOperations', 'settings');
          } else {
            this.log(`Micro Service Framework: ${packageJson.version}`, 'log');
            this.log(`Running in client mode...`, 'log');
          }
        } else {
          throw new Error(
            `Unsupported mode detected. Valid options are 'server' or 'client'`
          );
        }
      } catch (e) {
        throw new Error(e);
      }
    })();
  }

  // FUNCTION: Assign core functions
  assignCoreFunctions() {
    return new Promise((resolve, reject) => {
      // Assign operations
      Object.entries(
        Object.assign({}, serviceCoreOperations, this.settings.coreOperations)
      ).forEach(([name, func]) => {
        this.coreOperations[name] = func.bind(this);
      });
      // Resolve promise
      resolve();
    });
  }

  // FUNCTION: Add micro service to the instance
  defineService(name, operations, options) {
    // Variables
    const resolvedPath = `${path.resolve(operations)}.js`;
    // Check that the server doesnt already exist
    switch (true) {
    case typeof name === 'undefined': {
      throw new Error(`The name of the microservice is not defined! ${name}`);
    }
    case typeof operations === 'undefined' || !fs.existsSync(resolvedPath): {
      throw new Error(
        `The operations path of the microservice is not defined or cannot be found! PATH: ${resolvedPath}`
      );
    }
    case typeof require(resolvedPath) !== 'object' ||
        !Object.keys(require(resolvedPath)).length: {
      throw new Error(
        `No operations found. Expecting an exported object with atleast one key! PATH: ${resolvedPath}`
      );
    }
    case this.serviceInfo.hasOwnProperty(name): {
      throw new Error(`The microservice ${name} has already been defined.`);
    }
    default: {
      // Set options
      this.serviceOptions[name] = Object.assign(
        {},
        defaultServiceOptions,
        options
      );
      // Set information
      this.serviceInfo[name] = resolvedPath;
      // Return
      return true;
    }
    }
  }

  // FUNCTION: Initialise api gateway
  initGateway() {
    // Initial message
    this.log(`Micro Service Framework: ${packageJson.version}`, 'log');
    // Return
    return new Promise((resolve, reject) => {
      // Check that api gateway is free
      isPortFree(this.settings.apiGatewayPort)
        .then(() => {
          this.log('Starting service core', 'log');
          // Initialise interface, invoke port listener
          this.externalInterfaces.apiGateway = this.invokeListener(
            this.settings.apiGatewayPort
          );
          // Check the status of the gateway
          return !this.externalInterfaces.apiGateway
            ? this.log('Unable to start gateway, exiting!', 'error') ||
                reject(Error('Unable to start gateway, exiting!'))
            : this.log('Service core started!', 'log') || resolve(true);
        })
        .catch((e) => {
          this.log(
            `Gateway port not free or unknown error has occurred. INFO: ${JSON.stringify(
              e,
              null,
              2
            )}`,
            'log'
          );
          return reject(
            Error(
              `Gateway port not free or unknown error has occurred. INFO: ${JSON.stringify(
                e,
                null,
                2
              )}`
            )
          );
        });
    });
  }

  // FUNCTION: Bind api gateway event listners
  bindGateway() {
    return new Promise((resolve, reject) => {
      // Socket Communication Request
      this.externalInterfaces.apiGateway.on('COM_REQUEST', (message, data) => {
        // Confirm Connection
        this.log(
          `[${this.conId}] Service core connection request recieved`,
          'log'
        );
        // Process Communication Request
        data
          ? this.processComRequest(data, message, this.conId)
          : this.processComError(data, message, this.conId);
        // Process Connection
        this.log(`[${this.conId}] Service core connection request processed`);
        // Increment
        return this.conId++;
      });
      // Socket Communication Close
      this.externalInterfaces.apiGateway.on('COM_CLOSE', (message) => {
        // Connection Close Requested
        this.log(`[${this.conId}] Service core connection close requested`);
        // Destroy Socket (Close Connection)
        message.conn.destroy();
        // Connection Closed
        this.log(`[${this.conId}] Service core connection successfully closed`);
        // Increment
        return this.conId++;
      });
      // Socket Communication Kill Process
      this.externalInterfaces.apiGateway.on('KILL', (message) => {
        process.exit();
      });
      // Resolve promise
      return resolve();
    });
  }

  // FUNCTION: Bind api gateway event listners
  startServices(serviceInfo = void 0, customInstances = void 0) {
    // Variables
    const servicesInfo = serviceInfo || this.serviceInfo;
    // Return
    return new Promise((resolve, reject) => {
      if (Object.keys(servicesInfo)) {
        Promise.all(
          shuffle(
            Object.keys(servicesInfo).reduce((acc, serviceName) => {
              // Instance count
              let instances =
                customInstances || this.serviceOptions[serviceName].instances;
              // Define process list
              const processList = [];
              // Build instances
              while (instances > 0) {
                // Push instance
                processList.push(serviceName);
                // Deincrement instances
                --instances;
              }
              // Return
              return acc.concat(...processList);
            }, [])
          ).map(
            (name) =>
              new Promise((resolveLocal, rejectLocal) => {
                this.initService(name, (result) => {
                  result === true
                    ? resolveLocal(true)
                    : rejectLocal(
                      Error(
                        `Unable to start microservice! MORE INFO: ${JSON.stringify(
                          result,
                          null,
                          2
                        )}`
                      )
                    );
                });
              })
          )
        )
          .then(() => resolve())
          .catch((e) => reject(e));
      } else {
        reject(Error('No microservices defined!'));
      }
    });
  }
}

// Exports
module.exports = {
  MicroServiceFramework: (options) => new MicroServiceFramework(options),
  CommandBodyObject: commandBodyObject,
  ResponseBodyObject: responseBodyObject,
  createListener,
  createSpeaker,
  createSpeakerReconnector,
};
