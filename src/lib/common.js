'use strict';

// Load network components
import { createSpeaker } from './net';

// Load Templates
import ResponseBodyObject from './template/response';

// Console log types
const logTypes = ['log', 'error', 'warn'];

// Declare class
class ServiceCommon {
  // Constructor
  constructor() {
    // Bind methods
    [
      'log',
      'sendRequest',
      'destroyConnection',
      'executeInitialFunctions'
    ].forEach((func) => {
      this[func] = this[func].bind(this);
    });
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
    return new Promise((resolve, reject) => {
      try {
        this[container].runOnStart
          .filter((func) => {
            if (typeof func === 'function') {
              return true;
            }
            this.log(
              `This not a valid function: ${
                func || 'undefined or empty string'
              }`,
              'warn'
            );
            return false;
          })
          .forEach((func) =>
            Object.prototype.hasOwnProperty.call(this[opsProp], func)
              ? this[opsProp][func]()
              : reject(
                  Error(
                    `The function ${func} has not been defined in this service!`
                  )
                )
          );
        return resolve();
      } catch (e) {
        return reject(Error(e));
      }
    });
  }

  // FUNCTION : Send Data To API Server (micro service only!)
  sendRequest(
    data,
    destination,
    keepAlive,
    options = { port: this.settings.apiGatewayPort, connectionId: this.conId },
    socket = void 0,
    callback
  ) {
    // Get Variables
    let connectionAttempts = 0;
    // Invoke Network Interface
    const portEmitter = socket || createSpeaker(options.port);
    // Build message Body
    const resBody = {
      data,
      destination,
      callback,
      keepAlive
    };
    // Check Socket Is Ready & Execute
    const sendToSocket = () => {
      // Check If Socket Initialized Then Continue...
      if (Object.values(portEmitter.sockets).length === 0) {
        // Wait & Retry (including timeout)
        if (connectionAttempts <= this.settings.connectionTimeout) {
          // Wait For Socket & Try Again...
          this.log('Service core socket has not yet initialized...', 'log');
          return setTimeout(() => {
            sendToSocket();
            connectionAttempts += 1;
            return void 0;
          }, 1);
        }
        // Notification
        this.log(
          `Unable to connect to service core. MORE INFO: ${resBody.destination}`,
          'log'
        );
        // Create Response Object
        const responseObject = new ResponseBodyObject();
        // Build Response Object [status - transport]
        responseObject.status.transport = {
          code: 2003,
          message: 'Unable to connect to service core'
        };
        // Build Response Object [status - transport]
        responseObject.status.command = {
          code: 200,
          message: 'Command not executed, tansport failure!'
        };
        // Build Response Object [resBody - Error Details]
        responseObject.resultBody.errData = {
          entity: 'Client request',
          action: 'Connect to service core',
          errorType: 'ERROR',
          originalData: resBody
        };
        // Timeout
        this.log('Socket initialization timeout...', 'log');
        // Callback
        if (typeof resBody.callback === 'function') {
          return resBody.callback(responseObject, resBody, portEmitter);
        }
        return void 0;
      }

      // Send Data To Destination
      this.log('Socket initialized. sending data...', 'log');

      // Com request
      return portEmitter.request('COM_REQUEST', resBody, (requestData) => {
        // Response Validation
        if (Object.prototype.hasOwnProperty.call(requestData, 'error')) {
          // Notification
          this.log(
            `Unable to connect to service. MORE INFO: ${resBody.destination}`,
            'log'
          );

          // Create Response Object
          const responseObject = new ResponseBodyObject();

          // Build Response Object [status - transport]
          responseObject.status.transport = {
            code: 2004,
            message: `Unable to connect to service: ${resBody.destination}`
          };
          // Build Response Object [status - transport]
          responseObject.status.command = {
            code: 200,
            message: 'Command not executed, tansport failure!'
          };
          // Build Response Object [resBody - Error Details]
          responseObject.resultBody.errData = {
            entity: 'Client request',
            action: `Connect to service: ${resBody.destination}`,
            errorType: 'ERROR',
            originalData: resBody
          };
          // Console Log
          this.log(`Unable to transmit data to: ${resBody.destination}`, 'log');

          // Callback
          if (typeof resBody.callback === 'function') {
            resBody.callback(responseObject, resBody, portEmitter);
          }
        } else {
          // Get existing service status
          const serviceExists =
            Object.prototype.hasOwnProperty.call(
              this.serviceInfo,
              resBody.destination
            ) ||
            (process.env.service
              ? false
              : resBody.destination === 'serviceCore');

          // Console Log
          if (serviceExists) {
            this.log(
              `[${options.connectionId}] ${
                process.env.service ? 'Micro service' : 'Service core'
              } has processed request for service: ${resBody.destination}`,
              'log'
            );
          } else {
            this.log(
              `[${options.connectionId}] ${
                process.env.service ? 'Micro service' : 'Service core'
              }Service core was unable to find the service: ${
                resBody.destination
              }`,
              'log'
            );
          }

          // Callback
          if (typeof resBody.callback === 'function') {
            resBody.callback(
              requestData,
              resBody,
              serviceExists ? portEmitter : void 0
            );
          }
        }
      });
    };
    // Check Connection & Start
    return sendToSocket();
  }

  // Force Close Connection
  destroyConnection(socket, id) {
    // Check Object & Destroy
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
