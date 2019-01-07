'use strict';

// Load NPM Required
const isRunning = require('is-running');
const isPortFree = require('is-port-free');

// Loading libraries
const MicroServiceCommon = require('./../common');

// Load Templates
const ResponseBodyObject = require('./../template/response');

// Declare class
class MicroServer extends MicroServiceCommon {
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
    // Standard functions
    this.standardFunctions = ['echoData'];
    // Bind methods
    [
      'noDataRecieved',
      'echoData',
      'redirectFailed',
      'processRequest',
      'assignProcessListers',
      'assignOperations',
      'processManagement',
      'bindService',
      'executeInitialFunctions',
      'initServer',
    ].forEach(func => (this[func] = this[func].bind(this)));
    // Start process management
    setInterval(this.processManagement, 1000);
    // Initalise Micro service
    return (
      (async () => {
        try {
          await this.assignOperations();
          await this.assignProcessListers();
          await this.initServer();
          await this.bindService();
          await this.executeInitialFunctions();
        } catch (e) {
          console.error(e);
          process.exit();
        }
      })() || this
    );
  }

  // FUNCTION: Assign process functions
  assignOperations() {
    return new Promise(resolve => {
      // Operation scope
      const _operationScope = {
        sendRequest: this.sendRequest,
        destroyConnection: this.destroyConnection,
      };
      // Assigned operations to service
      Object.entries(require(process.env.operations)).forEach(
        ([name, op]) => (this.operations[name] = op.bind(_operationScope))
      );
      // Assign standard functions
      this.standardFunctions.forEach(
        func => (this.operations[func] = this[func].bind(_operationScope))
      );
      // Resolve promise
      return resolve();
    });
  }

  // FUNCTION: Assign process listners
  assignProcessListers() {
    return new Promise((resolve, reject) => {
      // onExit
      process.on('exit', code => {
        // Invoke Template(s)
        const _resObject = new ResponseBodyObject();
        // Build Response Object [status - transport]
        _resObject.status.transport = {
          code: 2006,
          message: `Micro service process exited unexpectedly. CODE: ${code}`,
        };
        // Build Response Object [status - transport]
        _resObject.status.command = {
          code: 200,
          message: 'Command not executed, transport failure',
        };
        // Build Response Object [ResBody - Error Details]
        _resObject.resultBody.errData = {
          entity: 'Unknown error',
          action: `Micro service process exited unexpectedly. CODE: ${code}`,
          errorType: 'ERROR',
          originalData: null,
        };
        // Close Each Instance Of Connection
        Object.values(this.connectionIndex).forEach(socket => {
          // Reply To message
          socket.reply(_resObject);
          // Close Socket
          socket.conn.destroy();
        });
      });
      // Resolve the promise
      resolve();
    });
  }

  // FUNCTION: Process management
  processManagement() {
    return (
      !isRunning(process.env.parentPid) &&
      setTimeout(() => process.exit(), 1000)
    );
  }

  // FUNCTION: Initialise Micro service
  initServer() {
    // Return
    return new Promise((resolve, reject) => {
      // Check that API gateway is free
      isPortFree(parseInt(process.env.port, 10))
        .then(() => {
          this.log(
            `Starting service on port: ${parseInt(process.env.port, 10)}`,
            'log'
          );
          // Initialise interface
          this.interface = this.invokeListener(parseInt(process.env.port, 10));
          // Check the status of the gateway
          if (!this.interface) {
            // Console Log
            this.log('Unable to start Micro service!', 'log');
            // Return
            return reject(Error('Unable to start Micro service!'));
          } else {
            // Console Log
            this.log('Service started successfully!', 'log');
            // Return
            return resolve(true);
          }
        })
        .catch(e => {
          console.error(e);
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
        });
    });
  }

  // FUNCTION: Bind listners to server
  executeInitialFunctions() {
    return new Promise((resolve, reject) => {
      // Check the functions which are to be executed on startup
      this.options.runOnStart.forEach(func =>
        this.operations.hasOwnProperty(func)
          ? this.operations[func]()
          : reject(
              Error(
                `The function ${func} has not been defined in this service!`
              )
            )
      );
      // Resolve promise
      return resolve();
    });
  }

  // FUNCTION: Bind listners to server
  bindService() {
    return new Promise((resolve, reject) => {
      // Socket Communication Request
      this.interface.on('MICRO_COM_REQUEST', (socket, data) => {
        // Confirm Connection
        this.log(`[${this.conId}] Micro service connection request received`);
        // Add To Connection Index
        this.connectionIndex = {
          [this.conId]: socket,
        };
        // Process Communication Request
        data ? this.processRequest(socket, data) : noDataRecieved(socket, data);
        // Process Connection
        this.log(`[${this.conId}] Micro service connection request processed!`);
        // Return
        return this.conId++;
      });
      // Resolve promise
      return resolve();
    });
  }

  // FUNCTION: Process internal request
  processRequest(socket, data) {
    // Get Parameters
    const _recievedData = data;
    const _commandData = data.data;
    const _socket = socket;
    // Get Destination
    const _funcName = _commandData.funcName;
    // Direct Request To Correct Function
    return this.operations.hasOwnProperty(_funcName)
      ? this.operations[_funcName](_socket, _commandData)
      : this.redirectFailed(_socket, _recievedData);
  }

  // FUNCTION: Echo Recieved Data (Debug Purposes)
  echoData(socket, data) {
    // Invoke Template(s)
    const _resObject = new ResponseBodyObject();
    // Get Parameters
    const _recievedData = data;
    const _socket = socket;
    // Build Response Object [status - transport]
    _resObject.status.transport.responseSource = process.env.name;
    // Build Response Object [ResBody - command Details]
    _resObject.resultBody.resData = _recievedData;
    // Respond To Source
    return _socket.reply(_resObject);
  }

  // FUNCTION: Failed To Find Route
  redirectFailed(socket, data) {
    // Invoke Template(s)
    const _resObject = new ResponseBodyObject();
    // Get Parameters
    const _recievedData = data;
    const _socket = socket;
    // Build Response Object [status - transport]
    _resObject.status.transport.responseSource = process.env.name;
    // Build Response Object [status - command]
    _resObject.status.command = {
      code: 202,
      message: 'Command not executed, internal redirection failure',
    };
    // Build Response Object [ResBody - command Details]
    _resObject.resultBody.errData = {
      entity: `Micro service: ${process.env.name}`,
      action: 'Internal micro service redirection failed',
      errorType: 'ERROR',
      originalData: _recievedData.body,
    };
    // Respond To Source
    return _socket.reply(_resObject);
  }

  // FUNCTION: No Data Recieved From Socket
  noDataRecieved(socket, data) {
    // Invoke Template(s)
    const _resObject = new ResponseBodyObject();
    const _recievedData = data;
    const _socket = socket;
    // Build Response Object [status - transport]
    _resObject.status.transport.responseSource = process.env.name;
    // Build Response Object [status - command]
    _resObject.status.command = {
      code: 202,
      message: 'Command not executed, no data recieved by service',
    };
    // Build Response Object [ResBody - command Details]
    _resObject.resultBody.errData = {
      entity: `Micro service: ${process.env.name}`,
      action: 'No data received from connection',
      errorType: 'ERROR',
      originalData: _recievedData.body,
    };
    return _socket.reply(_resObject);
  }
}

// Start the micro service instance
new MicroServer();
