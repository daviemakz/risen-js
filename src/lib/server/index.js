'use strict';

import 'core-js';
import 'regenerator-runtime';

// Load NPM Required
import isPortFree from 'is-port-free';
import isRunning from 'is-running';

// Load network components
import { createListener } from '../net';

// Loading libraries
import ServiceCommon from '../common';

// Load Templates
import ResponseBodyObject from '../template/response';

// Load base methods
import { echoData, redirectFailed, noDataRecieved } from './baseMethods';

// Standard functions
const standardFunctions = [
  { name: 'echoData', func: echoData },
  { name: 'noDataRecieved', func: noDataRecieved },
  { name: 'redirectFailed', func: redirectFailed }
];

// Process management
const processManagement = () => {
  if (!isRunning(process.env.parentPid)) {
    setTimeout(() => process.exit(), 1000);
  }
};

// Declare class
class MicroServer extends ServiceCommon {
  // Constructor
  constructor() {
    // Call super()
    super();
    // Connection tracking number
    this.conId = 0;
    // Set interface object
    this.interface = void 0;
    this.connectionIndex = {};
    // Save operations object
    this.operations = {};
    // Assign settings
    this.settings = JSON.parse(process.env.settings);
    // Assign options
    this.options = JSON.parse(process.env.options);
    // Assign service information
    this.serviceInfo = JSON.parse(process.env.serviceInfo);

    // Set verbose to enviromental variable
    process.env.verbose = this.settings.verbose;
    // Bind methods
    [
      'processRequest',
      'assignProcessListers',
      'assignOperations',
      'bindService',
      'initServer'
    ].forEach(func => {
      this[func] = this[func].bind(this);
    });

    // Start process management
    setInterval(processManagement, 1000);

    // Initalise Micro service
    (async () => {
      try {
        await this.assignOperations();
        await this.assignProcessListers();
        await this.initServer();
        await this.bindService();
        await this.executeInitialFunctions('operations');
        return void 0;
      } catch (e) {
        throw new Error(e);
      }
    })();

    // Return the instance
    return this;
  }

  // Assign process functions
  assignOperations() {
    return new Promise(resolve => {
      // Operation scope
      const operationScope = {
        sendRequest: this.sendRequest,
        destroyConnection: this.destroyConnection,
        operations: this.operations,
        localStorage: {}
      };
      // Assigned operations to service
      Object.entries(require(process.env.operations)).forEach(([name, op]) => {
        this.operations[name] = op.bind(operationScope);
      });
      // Assign standard functions
      standardFunctions.forEach(({ name, func }) => {
        this.operations[name] = func.bind(operationScope);
      });
      // Resolve promise
      return resolve();
    });
  }

  // Assign process listners
  assignProcessListers() {
    return new Promise(resolve => {
      // onExit
      process.on('exit', code => {
        // Invoke Template(s)
        const responseObject = new ResponseBodyObject();
        // Build Response Object [status - transport]
        responseObject.status.transport = {
          code: 2006,
          message: `Micro service process exited unexpectedly. CODE: ${code}`
        };
        // Build Response Object [status - transport]
        responseObject.status.command = {
          code: 200,
          message: 'Command not executed, transport failure'
        };
        // Build Response Object [ResBody - Error Details]
        responseObject.resultBody.errData = {
          entity: 'Unknown error',
          action: `Micro service process exited unexpectedly. CODE: ${code}`,
          errorType: 'ERROR',
          originalData: null
        };
        // Close Each Instance Of Connection
        Object.values(this.connectionIndex).forEach(socket => {
          // Reply To message
          socket.reply(responseObject);
          // Close Socket
          socket.conn.destroy();
        });
      });
      // Resolve the promise
      return resolve();
    });
  }

  // Initialise Micro service
  initServer() {
    // Return
    return new Promise((resolve, reject) =>
      isPortFree(parseInt(process.env.port, 10))
        .then(() => {
          this.log(
            `Starting service on port: ${parseInt(process.env.port, 10)}`,
            'log'
          );
          // Initialise interface
          this.interface = createListener(parseInt(process.env.port, 10));
          // Check the status of the gateway
          if (!this.interface) {
            // Console Log
            this.log('Unable to start Micro service!', 'log');
            // Return
            return reject(Error('Unable to start Micro service!'));
          }
          // Console Log
          this.log('Service started successfully!', 'log');
          // Return
          return resolve(true);
        })
        .catch(e => {
          this.log(e, 'error');
          this.log(
            `Service port "${parseInt(
              process.env.port,
              10
            )}" not free or unknown error has occurred. MORE INFO: ${JSON.stringify(
              e,
              null,
              2
            )}`,
            'error'
          );
          // Reject
          return reject(
            Error(
              `Service port "${parseInt(
                process.env.port,
                10
              )}" not free or unknown error has occurred. MORE INFO: ${JSON.stringify(
                e,
                null,
                2
              )}`
            )
          );
        })
    );
  }

  // Bind listners to server
  bindService() {
    return new Promise(resolve => {
      // Socket Communication Request
      this.interface.on('SERVICE_REQUEST', (socket, data) => {
        // Confirm Connection
        this.log(`[${this.conId}] Micro service connection request received`);
        // Add To Connection Index
        this.connectionIndex = {
          [this.conId]: socket
        };
        // Process Communication Request
        if (data) {
          this.processRequest(socket, data);
        } else {
          this.noDataRecieved(socket, data);
        }
        // Process Connection
        this.log(`[${this.conId}] Micro service connection request processed!`);
        this.conId += 1;
        // Return
        return void 0;
      });

      // Socket Communication Request
      this.interface.on('SERVICE_KILL', socket => {
        // Invoke Template(s)
        const responseObject = new ResponseBodyObject();
        // Confirm Connection
        this.log(`[${this.conId}] Micro service connection request received`);
        // Add To Connection Index
        this.connectionIndex = {
          [this.conId]: socket
        };
        // Process Connection
        this.log(
          `[${this.conId}] Micro service connection request processed, kill command recieved!`
        );
        // Return
        this.conId += 1;
        // Build Response Object [status - transport]
        responseObject.status.transport = {
          code: 1000,
          message: 'Micro service process has exited!'
        };
        // Build Response Object [status - transport]
        responseObject.status.command = {
          code: 100,
          message: 'Command completed successfully'
        };
        // Build Response Object [ResBody - Error Details]
        responseObject.resultBody.errData = {};
        // Reply to socket
        socket.reply(responseObject);
        // Process kill
        return process.exit();
      });

      // Resolve promise
      return resolve();
    });
  }

  // Process internal request
  processRequest(socket, requestObj) {
    // Get Parameters
    const commandData = requestObj.data;
    // Get Destination
    const { funcName } = commandData;
    // Direct Request To Correct Function
    return Object.prototype.hasOwnProperty.call(this.operations, funcName)
      ? this.operations[funcName](socket, commandData)
      : this.redirectFailed(socket, requestObj);
  }
}

// Start the micro service instance
/* eslint-disable-next-line */
new MicroServer();
