'use strict';

import { buildResponseFunctions } from './util';

// Console log types
const logTypes = ['log', 'error', 'warn'];

// Declare class
class ServiceCommon {
  // Constructor
  constructor() {
    // Bind methods
    ['log', 'destroyConnection', 'executeInitialFunctions'].forEach((func) => {
      this[func] = this[func].bind(this);
    });

    // Return instance
    return this;
  }

  // Show message in log
  log(message, type, override = false) {
    // Write to log file
    if (typeof this.writeToLogFile === 'function') {
      this.writeToLogFile(message);
    }
    if ((this.settings.verbose || override) && logTypes.includes(type)) {
      /* eslint-disable no-console */
      console[type](message);
    }
  }

  // Bind listners to server
  executeInitialFunctions(opsProp, container = 'options') {
    // Is it a service
    const isService = process.env.service === 'true';

    // Initialise operation scope
    const operationScope = {
      request: this.request,
      requestChain: this.requestChain,
      sendRequest: this.sendRequest,
      destroyConnection: this.destroyConnection,
      operations: this[opsProp]
    };

    // Build helper methods
    const helperMethods = buildResponseFunctions(void 0, {}, operationScope);

    return new Promise((resolve, reject) => {
      try {
        this[container].runOnStart
          .filter((func) => {
            if (typeof this[opsProp][func] === 'function') {
              return true;
            }
            this.log(
              `This not a valid function: ${
                func || 'undefined or empty string'
              }. Check that its been added to the ${
                isService
                  ? 'object of functions in your operations path'
                  : 'coreOperations object when you initialised Risen.JS'
              }`,
              'warn'
            );
            return false;
          })
          .forEach((func) => {
            if (Object.prototype.hasOwnProperty.call(this[opsProp], func)) {
              this.log(`Executing the run on start function: ${func}`, 'log');
              this[opsProp][func](helperMethods);
            } else {
              reject(
                Error(
                  `The function ${func} has not been defined in this service!`
                )
              );
            }
          });
        return resolve();
      } catch (e) {
        this.log(e, 'error');
        return reject(Error(e));
      }
    });
  }

  // Force Close Connection
  destroyConnection(socket, id) {
    if (Object.prototype.hasOwnProperty.call(socket, 'conn')) {
      socket.conn.destroy();
      return this.log(`[${id}] Connection successfully closed`, 'log');
    }
    return this.log(
      `[${id}] Connection object untouched. invalid object...`,
      'log'
    );
  }
}

// EXPORTS
export default ServiceCommon;
