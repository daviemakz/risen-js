'use strict';

import 'core-js';
import 'regenerator-runtime';

// Load NPM Required
import isPortFree from 'is-port-free';
import isRunning from 'is-running';

// Load network components
import { createListener, createSpeakerReconnector } from '../net';

// Loading libraries
import ServiceCommon from '../common';

// Load Templates
import ResponseBody from '../template/response';

// Load base methods
import { echoData, redirectFailed, noDataRecieved } from './baseMethods';
import { requestOperations } from '../core/request';
import { parseAddress } from '../util';
import { eventList } from '../../options';

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
    this.listnerInterface = void 0;
    this.speakerInterface = void 0;
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
      'initListener',
      'initSpeaker'
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
        await this.initListener();
        await this.initSpeaker();
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

    // Parse the addres
    this.microServerAddress = parseAddress(process.env.port);

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
        // Support loading ESM transpiled modules
        if (name === 'default' && typeof op === 'object') {
          Object.entries(op).forEach(([nameEsm, opEsm]) => {
            this.operations[nameEsm] = opEsm.bind(this.operationScope);
          });
        } else {
          this.operations[name] = op.bind(this.operationScope);
        }
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
    const handleError = (code) => {
      // Invoke Template(s)
      const responseObject = new ResponseBody();
      // Set the response source
      responseObject.setResponseSource();
      // Set transport status
      responseObject.setTransportStatus({
        code: 5006,
        message: `Micro service process exited unexpectedly. CODE: ${code}`
      });
      // Set command status
      responseObject.setCommandStatus({
        code: 500,
        message: 'Command not executed, transport failure'
      });
      // Set error data
      responseObject.setErrData({
        entity: 'Unknown error',
        action: `Micro service process exited unexpectedly. CODE: ${code}`,
        originalData: null
      });
      // Close all open connections
      Object.values(this.connectionIndex).forEach((serviceCoreSocket) => {
        // Reply To message
        serviceCoreSocket.reply(responseObject);
        // Close serviceCoreSocket
        serviceCoreSocket.conn.destroy();
      });
    };
    return new Promise((resolve) => {
      eventList.forEach((event) => {
        process.on(event, handleError);
      });
      // onExit
      process.on('exit', handleError);
      // Resolve the promise
      return resolve();
    });
  }

  // Initialise micro service listner port
  initListener() {
    // Generic function to initialise the connection
    const startConnection = (resolve, reject) => {
      this.log(
        `Starting service on address: ${this.microServerAddress}`,
        'log'
      );
      // Initialise interface
      this.listnerInterface = createListener(this.microServerAddress);
      // Check the status of the gateway
      if (!this.listnerInterface) {
        // Console log
        this.log('Unable to start micro service!', 'log');
        // Return
        return reject(Error('Unable to start micro service!'));
      }
      // Console log
      this.log('Service started successfully!', 'log');
      // Return
      return resolve(true);
    };
    // Return
    return new Promise((resolve, reject) => {
      if (typeof this.microServerAddress === 'number') {
        isPortFree(this.microServerAddress)
          .then(startConnection(resolve, reject))
          .catch((e) => {
            this.log(e, 'error');

            this.log(
              `Service port "${
                this.microServerAddress
              }" not free or unknown error has occurred. MORE INFO: ${JSON.stringify(
                e,
                null,
                2
              )}`,
              'error'
            );

            // Reject
            return reject(
              Error(
                `Service port "${
                  this.microServerAddress
                }" not free or unknown error has occurred. MORE INFO: ${JSON.stringify(
                  e,
                  null,
                  2
                )}`
              )
            );
          });
      } else {
        startConnection(resolve, reject);
      }
    });
  }

  // Initialise speaker micro service
  initSpeaker() {
    // Return
    return new Promise((resolve) => {
      this.log(
        `Connecting to service core on address: ${parseAddress(
          this.settings.address
        )}`,
        'log'
      );
      // Initialise interface
      this.speakerInterface = createSpeakerReconnector(
        parseAddress(this.settings.address)
      );
      // Check the status of the gateway
      if (!this.speakerInterface) {
        // Console log
        this.log(
          'Unable to connect to service core! Process will attempt to connect manually next time!',
          'log'
        );
      }

      // Return
      return resolve(true);
    });
  }

  // Bind listners to server
  bindService() {
    return new Promise((resolve) => {
      // Socket Communication Request
      this.listnerInterface.on('SERVICE_REQUEST', (serviceCoreSocket, data) => {
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
      this.listnerInterface.on('SERVICE_KILL', (serviceCoreSocket) => {
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
        // Set the response source
        responseObject.setResponseSource();
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
        // Remove speaker socket
        if (this?.speakerInterface) {
          this?.speakerInterface?.conn.destroy();
        }
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
    const helperMethods = this.buildResponseFunctions(
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
