'use strict';

// Load runtime
require('./lib/runtime');

// Load NPM modules
const isPortFree = require('is-port-free');
const path = require('path');
const fs = require('fs');

// Load core libraries
const ServicesCore = require('./lib');

// Load package.json
const packageJson = require('./package.json');

// Declare class
class MicroServiceFramework extends ServicesCore {
  constructor(options) {
    // Super
    super(options);
    // Connection tracking number
    this.conId = 0;
    // Store server externalInterfaces, these are the socket objects which allow external communication
    this.externalInterfaces = {};
    this.microServerInfo = {};
    // Bind methods
    ['startServer', 'initGateway', 'bindGateway'].forEach(
      func => (this[func] = this[func].bind(this))
    );
  }

  // FUNCTION: Start server failed
  startServerFailed() {
    return setTimeout(() => process.exit(), 0);
  }

  // FUNCTION: Start the server
  startServer() {
    return (async () => {
      try {
        await this.initGateway();
        await this.bindGateway();
        await this.startMicroServices();
      } catch (e) {
        throw new Error(e);
      }
    })();
  }

  // FUNCTION: Add micro service to the instance
  defineService(name, operations) {
    // Variables
    const resolvedPath = path.resolve(operations) + '.js';
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
      case this.microServerInfo.hasOwnProperty(name): {
        throw new Error(`The microservice ${name} has already been defined.`);
      }
      default: {
        return (this.microServerInfo[name] = resolvedPath) && true;
      }
    }
  }

  // FUNCTION: Initialise api gateway
  initGateway() {
    // Initial message
    this.log(`Micro Service Framework: ${packageJson.version}`, 'log');
    // Return
    return new Promise((resolve, reject) =>
      // Check that api gateway is free
      isPortFree(this.settings.apiGatewayPort)
        .then(() => {
          this.log('Starting API Gateway', 'log');
          // Initialise interface, invoke port listener
          this.externalInterfaces.apiGateway = this.invokeListener(
            this.settings.apiGatewayPort
          );
          // Check the status of the gateway
          return !this.externalInterfaces.apiGateway
            ? this.log('ERROR: Unable to start gateway, exiting! ', 'log') ||
                reject(false)
            : this.log('API Gateway Started!', 'log') || resolve(true);
        })
        .catch(e => {
          this.log(
            `ERROR: Gateway port not free or unknown error has occurred. INFO: ${JSON.stringify(
              e,
              null,
              2
            )}`,
            'log'
          );
          return reject(false);
        })
    );
  }

  // FUNCTION: Bind api gateway event listners
  bindGateway() {
    return new Promise((resolve, reject) => {
      // Socket Communication Request
      this.externalInterfaces.apiGateway.on('COM_REQUEST', (message, data) => {
        // Confirm Connection
        this.log(`[${this.conId}] Connection Request Recieved`, 'log');
        // Process Communication Request
        data
          ? this.processComRequest(data, message, this.conId)
          : this.processComError(data, message, this.conId);
        // Process Connection
        this.log(`[${this.conId}] Connection Request Processed`);
        // Increment
        return this.conId++;
      });
      // Socket Communication Close
      this.externalInterfaces.apiGateway.on('COM_CLOSE', message => {
        // Connection Close Requested
        this.log(`[${this.conId}] Connection Close Requested`);
        // Destroy Socket (Close Connection)
        message.conn.destroy();
        // Connection Closed
        this.log(`[${this.conId}] Connection Successfully Closed`);
        // Increment
        return this.conId++;
      });
      // Socket Communication Kill Process
      this.externalInterfaces.apiGateway.on('KILL', message => process.exit());
    });
  }

  // FUNCTION: Bind api gateway event listners
  startMicroServices() {
    return new Promise((resolve, reject) => {
      if (Object.keys(this.microServerInfo)) {
        Promise.all(
          Object.keys(this.microServerInfo).map(name => {
            new Promise((resolve, reject) => {
              this.initService(name, result => {
                result === true
                  ? resolve()
                  : reject(
                      `Unable to start microservice! MORE INFO: ${JSON.stringify(
                        result,
                        null,
                        2
                      )}`
                    );
              });
            });
          })
        )
          .then(() => resolve())
          .catch(e => reject(e));
      } else {
        reject('No microservices defined!');
      }
    });
  }
}

// Exports
module.exports = {
  MicroServicesFramework: options => new MicroServiceFramework(options),
  CommandBodyObject: require('./lib/template/command.js'),
  ResponseBodyObject: require('./lib/template/response.js'),
};
