'use strict';

// Load runtime
require('./lib/runtime');

// Load NPM modules
const isPortFree = require('is-port-free');

// Load core libs
const microServiceCore = require('./lib');
const packageJson = require('./package.json');

// Declare class
class MicroServiceFramework extends microServiceCore {
  constructor(options) {
    // Super
    super(options);
    // Store server interfaces
    this.interfaces = {};
    // Bind methods
    ['startServer', 'log', 'initGateway', 'bindGateway'].forEach(
      func => (this[func] = this[func].bind(this))
    );
  }

  // FUNCTION: Show message in log
  log(message, type) {
    return (
      this.settings.verbose && ['log', 'error', 'warn'] &&
      console[type](message)
    );
  }

  // FUNCTION: Start server failed
  startServerFailed() {
    return setTimeout(() => process.exit(), 0);
  }

  // FUNCTION: Start the server
  startServer() {
    return (async () => {
      await this.initGateway();
      await this.bindGateway();
      // Start all registered micro server processes (automatically ready for connections)
    })();
  }

  // FUNCTION: Initialise API Gateway
  initGateway() {
    // Initial message
    this.log('Micro Service Framework: ' + packageJson.version, 'log');
    // Return
    return new Promise((resolve, reject) =>
      // Check that API gateway is free
      isPortFree(this.settings.apiGatewayPort)
        .then(() => {
          this.log('Starting API Gateway', 'log');
          // Initialise interface
          this.interfaces.apiGateway = this.invokeListener(
            this.settings.apiGatewayPort
          );
          // Check the status of the gateway
          if (!this.interfaces.apiGateway) {
            // Console Log
            this.log('ERROR: Unable To Start Server, Exiting..! ', 'log');
            // Return
            return reject(false);
          } else {
            // Console Log
            this.log('API gateway started!', 'log');
            // Return
            return resolve(true);
          }
        })
        .catch(e => {
          this.log(
            'ERROR: API Gateway Port Not Free Or Unknown Error Has Occurred. INFO: ' +
              JSON.stringify(e, null, 2),
            'log'
          );
          // Reject
          return reject(false);
        })
    );
  }

  // FUNCTION: Bind API gateway event listners
  bindGateway() {
    return new Promise((resolve, reject) => {
      // Socket Communication Request
      this.interfaces.apiGateway.on('COM_REQUEST', (message, data) => {
        // Confirm Connection
        this.log('[' + this.conId + '] Connection Request Recieved', 'log');
        // Process Communication Request
        data
          ? this.processComRequest(data, message, this.conId)
          : this.processComError(data, message, this.conId);
        // Process Connection
        this.log('[' + this.conId + '] Connection Request Processed');
        // Increment
        return this.conId++;
      });
      // Socket Communication Close
      this.interfaces.apiGateway.on('COM_CLOSE', message => {
        // Connection Close Requested
        this.log('[' + this.conId + '] Connection Close Requested');
        // Destroy Socket (Close Connection)
        message.conn.destroy();
        // Connection Closed
        this.log('[' + this.conId + '] Connection Successfully Closed');
        // Increment
        return this.conId++;
      });
      //// Socket Communication Kill Process
      this.interfaces.apiGateway.on('KILL', message => process.exit());
    });
  }
}

// Exports
module.exports = options => new MicroServiceFramework(options);
