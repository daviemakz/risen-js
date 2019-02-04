'use strict';

// Load runtime
require('./lib/runtime');

// Load NPM modules
const isPortFree = require('is-port-free');
const path = require('path');
const fs = require('fs');
const { shuffle } = require('lodash');
const https = require('https');
const http = require('http');
const helmet = require('helmet');
const express = require('express');

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
  createSpeakerReconnector
} = require('./lib/net');

// Microservice options
const defaultServiceOptions = {
  loadBalancing: 'roundRobin',
  runOnStart: [],
  instances: 1
};

// HTTPS options
const buildSecureOptions = ssl => {
  try {
    return typeof ssl === 'object'
      ? Object.entries(
          Object.assign(
            {},
            {
              key: void 0,
              cert: void 0,
              ca: void 0
            },
            ssl
          )
        )
          .map(([optionKey, filePath]) => ({
            [optionKey]: fs.readFileSync(filePath)
          }))
          .reduce((acc, x) => Object.assign(acc, x), {})
      : ssl;
  } catch (e) {
    throw new Error(e);
  }
};

// HTTP options
const buildHttpOptions = options => ({
  port: 80,
  ssl: buildSecureOptions(options.ssl),
  harden: true,
  harden: true,
  beforeStart: express => express,
  middlewares: [],
  static: [],
  routes: []
});

/*

options.http = {
  port: 80,
  ssl: {
    key: 'encryption/private.key',
    cert: 'encryption/private.crt',
    ca: 'encryption/private.ca',
  } || false,
  harden: true,
  beforeStart: (express) => express,
  middlewares: [],
  static: [],
  routes: [
    {
      method: 'GET',
      uri: '/',
      handler: (request, response, instance) => res.send('Hello World')
    }
  ]
}

*/

// Instance options
const defaultInstanceOptions = {
  mode: 'server',
  http: false,
  databaseNames: ['_defaultTable'],
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
  runOnStart: []
};

// Declare class
class MicroServiceFramework extends ServiceCore {
  constructor(options) {
    // Super
    super(options);
    // Connection tracking number
    this.conId = 0;
    // Declare settings
    this.settings = Object.assign(
      defaultInstanceOptions,
      options,
      Array.isArray(options.http) && options.http.length
        ? options.http.map(httpSettings => buildHttpOptions(httpSettings))
        : false
    );
    // External HTTP(s) properties
    this.httpsServer = [];
    this.httpServer = [];
    // Initialise database
    this.db = {};
    this.settings.databaseNames.forEach(table => {
      this.db[table] = new LocalDatabase({
        databaseName: table
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
      'hardenServer',
      'startHttpServer'
    ].forEach(func => (this[func] = this[func].bind(this)));
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
            await this.startHttpServer();
            await this.executeInitialFunctions('coreOperations', 'settings');
          } else {
            this.log(`Micro Service Framework: ${packageJson.version}`, 'log');
            this.log(`Running in client mode...`, 'log');
          }
        } else {
          throw new Error(
            `Unsupported mode detected. Valid options are 'server' or 'client'`
          );
          process.exit();
        }
      } catch (e) {
        throw new Error(e);
        process.exit();
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
        .catch(e => {
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
      this.externalInterfaces.apiGateway.on('COM_CLOSE', message => {
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
      this.externalInterfaces.apiGateway.on('KILL', message => {
        process.exit();
      });
      // Resolve promise
      return resolve();
    });
  }

  // FUNCTION: Start http instances
  startHttpServer() {
    // Return promise
    return Array.isArray(this.settings.http)
      ? Promise.all(
          this.settings.http.map(
            httpSettings =>
              new Promise((resolve, reject) => {
                try {
                  // Check if the HTTP server should be started or not
                  if (this.settings.http) {
                    // Build express instance
                    const expressApp = express();
                    // Allow access to the express instance
                    this.settings.http.beforeStart(expressApp);
                    // Assign static path resources if defined
                    this.settings.http.static.forEach(path =>
                      expressApp.use(express.static(path))
                    );
                    // Harden http server if hardening is defined
                    this.settings.http.harden && this.hardenServer();
                    // Apply middlewares to express
                    this.settings.http.middlewares.forEach(middleware =>
                      expressApp.use(middleware)
                    );
                    // Assign routes
                    this.settings.http.routes
                      .filter(route => {
                        if (
                          ['put', 'post', 'get', 'delete', 'patch'].includes(
                            route.method.toLowerCase()
                          )
                        ) {
                          return true;
                        } else {
                          console.warn(
                            `This route has an unknown method, skipping: ${JSON.stringify(
                              route,
                              null,
                              2
                            )}`
                          );
                          return false;
                        }
                      })
                      .forEach(route =>
                        expressApp[route.method](route.uri, (req, res) =>
                          route.handler(req, res, {
                            sendRequest: this.sendRequest
                          })
                        )
                      );
                    // Start HTTP(s) server
                    if (this.settings.http.ssl) {
                      return (
                        this.httpsServer.push(
                          https.createServer(this.settings.http.ssl, expressApp)
                        ) && resolve()
                      );
                    } else {
                      return (
                        this.httpServer.push(http.createServer(expressApp)) &&
                        resolve()
                      );
                    }
                  } else {
                    return resolve();
                  }
                } catch (e) {
                  return reject(Error(e));
                }
              })
          )
        )
      : new Promise(resolve => {
          this.log('No HTTP(s) servers defined. Starting services only...');
          resolve();
        });
  }

  // FUNCTION: Harden HTTP server
  hardenServer(expressApp) {
    /*
      This hardening follows the guidance in this file:
      https://expressjs.com/en/advanced/best-practice-security.html
      This may be enhanced in the future
    */
    // Apply helmet
    return expressApp.use(helmet());
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
            name =>
              new Promise((resolveLocal, rejectLocal) => {
                this.initService(name, result => {
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
          .catch(e => reject(e));
      } else {
        reject(Error('No microservices defined!'));
      }
    });
  }
}

// Exports
module.exports = {
  MicroServiceFramework: options => new MicroServiceFramework(options),
  CommandBodyObject: commandBodyObject,
  ResponseBodyObject: responseBodyObject,
  createListener,
  createSpeaker,
  createSpeakerReconnector
};
