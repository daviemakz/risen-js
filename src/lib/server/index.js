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
import ResponseBody from '../template/response';

// Load base methods
import { echoData, redirectFailed, noDataRecieved } from './baseMethods';
import { requestOperations } from '../core/request';
import { buildResponseFunctions } from '../util';

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
      'assignRequestFunctions',
      'assignProcessListeners',
      'assignFunctions',
      'processRequest',
      'bindService',
      'initServer'
    ].forEach((func) => {
      this[func] = this[func].bind(this);
    });

    // Start process management
    setInterval(processManagement, 1000);

    // Initalise micro service
    (async () => {
      try {
        await this.assignRequestFunctions();
        await this.assignFunctions();
        await this.assignProcessListeners();
        await this.initServer();
        await this.bindService();
        await this.executeInitialFunctions('operations');
        return void 0;
      } catch (e) {
        throw new Error(e);
      }
    })();

    // Operation scope
    this.operationScope = {
      request: this.request,
      requestChain: this.requestChain,
      sendRequest: this.sendRequest,
      destroyConnection: this.destroyConnection,
      operations: this.operations,
      localStorage: {}
    };

    // Return the instance
    return this;
  }

  // Assign process functions
  assignRequestFunctions() {
    return new Promise((resolve) => {
      // Assign request operations
      Object.entries({
        ...requestOperations
      }).forEach(([name, func]) => {
        this[name] = func.bind(this);
      });
      // Resolve promise
      return resolve();
    });
  }

  // Assign process functions
  assignFunctions() {
    return new Promise((resolve) => {
      // Assigned operations to service
      Object.entries(require(process.env.operations)).forEach(([name, op]) => {
        this.operations[name] = op.bind(this.operationScope);
      });
      // Assign standard functions
      standardFunctions.forEach(({ name, func }) => {
        this.operations[name] = func.bind(this.operationScope);
      });
      // Resolve promise
      return resolve();
    });
  }

  // Assign process listners
  assignProcessListeners() {
    return new Promise((resolve) => {
      // onExit
      process.on('exit', (code) => {
        // Invoke Template(s)
        const responseObject = new ResponseBody();
        // Build Response Object [status - transport]
        responseObject.setTransportStatus({
          code: 5006,
          message: `Micro service process exited unexpectedly. CODE: ${code}`
        });
        // Build Response Object [status - transport]
        responseObject.setCommandStatus({
          code: 500,
          message: 'Command not executed, transport failure'
        });
        // Build Response Object [ResBody - Error Details]
        responseObject.setErrData({
          entity: 'Unknown error',
          action: `Micro service process exited unexpectedly. CODE: ${code}`,
          originalData: null
        });
        // Close Each Instance Of Connection
        Object.values(this.connectionIndex).forEach((serviceCoreSocket) => {
          // Reply To message
          serviceCoreSocket.reply(responseObject);
          // Close serviceCoreSocket
          serviceCoreSocket.conn.destroy();
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
            // Console log
            this.log('Unable to start micro service!', 'log');
            // Return
            return reject(Error('Unable to start micro service!'));
          }
          // Console log
          this.log('Service started successfully!', 'log');
          // Return
          return resolve(true);
        })
        .catch((e) => {
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
    return new Promise((resolve) => {
      // Socket Communication Request
      this.interface.on('SERVICE_REQUEST', (serviceCoreSocket, data) => {
        // Confirm Connection
        this.log(`[${this.conId}] Micro service connection request received`);
        // Add To Connection Index
        this.connectionIndex = {
          [this.conId]: serviceCoreSocket
        };
        // Process Communication Request
        if (data) {
          this.processRequest(serviceCoreSocket, data);
        } else {
          this.operations.noDataRecieved(serviceCoreSocket, data);
        }
        // Process Connection
        this.log(`[${this.conId}] Micro service connection request processed!`);
        this.conId += 1;
        // Return
        return void 0;
      });

      // Socket Communication Request
      this.interface.on('SERVICE_KILL', (serviceCoreSocket) => {
        // Invoke Template(s)
        const responseObject = new ResponseBody();
        // Confirm Connection
        this.log(`[${this.conId}] Micro service connection request received`);
        // Add To Connection Index
        this.connectionIndex = {
          [this.conId]: serviceCoreSocket
        };
        // Process Connection
        this.log(
          `[${this.conId}] Micro service connection request processed, kill command recieved!`
        );
        // Return
        this.conId += 1;

        // Build Response Object [status - transport]
        responseObject.setTransportStatus({
          code: 2000,
          message: 'Micro service process has exited!'
        });
        // Build Response Object [status - transport]
        responseObject.setCommandStatus({
          code: 200,
          message: 'Command completed successfully'
        });
        // Reply to socket
        serviceCoreSocket.reply(responseObject);
        // Process kill
        return process.exit();
      });

      // Resolve promise
      return resolve();
    });
  }

  // Process internal request
  processRequest(serviceCoreSocket, command) {
    // Get Parameters
    const { data } = command;
    // Get Destination
    const { functionName } = data;
    // Build methods
    const helperMethods = buildResponseFunctions(
      serviceCoreSocket,
      command,
      this.operationScope
    );
    // Direct Request To Correct Function
    return Object.prototype.hasOwnProperty.call(this.operations, functionName)
      ? this.operations[functionName](helperMethods)
      : this.operations.redirectFailed(helperMethods);
  }
}

// Start the micro service instance
/* eslint-disable-next-line */
new MicroServer();
