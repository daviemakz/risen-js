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
    // Assign settings
    this.settings = JSON.parse(process.env.settings);
    // Bind methods
    [
      'noDataRecieved',
      'echoData',
      'redirectFailed',
      'processInternalRequest',
      'assignProcessListers',
      'processManagement',
      'bindService',
      'initServer',
    ].forEach(func => (this[func] = this[func].bind(this)));
    // Start process management
    setInterval(this.processManagement, 1000);
    // Initalise micro server
    return (
      (async () => {
        try {
          await this.assignProcessListers();
          await this.initServer();
          await this.bindService();
        } catch (e) {
          throw new Error(e);
        }
      })() || this
    );
  }

  // FUNCTION: Assign process functions
  assignOperations() {
    return new Promise((resolve, reject) =>
      Object.entries(require(process.env.operations)).forEach(([name, op]) => (this[name] = op))
    );
  }

  // FUNCTION: Assign process listners
  assignProcessListers() {
    return new Promise((resolve, reject) => {
      // onExit
      process.on('exit', code => {
        // Invoke Template(s)
        const resObject = new ResponseBodyObject();
        // Build Response Object [status - transport]
        resObject.status.transport = {
          code: 2006,
          message: `Micro Server Process Exited Unexpectedly. EXIT CODE: ${code}`,
        };
        // Build Response Object [status - transport]
        resObject.status.command = {
          code: 200,
          message: 'Command Not Executed - transport Failiure',
        };
        // Build Response Object [ResBody - Error Details]
        resObject.resultBody.errData = {
          entity: 'Unknown Error',
          action: `Micro Server Process Exited Unexpectedly EXIT CODE: ${code}`,
          errorType: 'ERROR',
          originalData: null,
        };
        // Close Each Instance Of Connection
        Object.values(this.connectionIndex).forEach(socket => {
          // Reply To message
          socket.reply(resObject);
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
    return !isRunning(process.env.parentPid) && setTimeout(() => process.exit(), 1000);
  }

  // FUNCTION: Initialise micro server
  initServer() {
    // Return
    return new Promise((resolve, reject) => {
      // Check that API gateway is free
      isPortFree(parseInt(process.env.port, 10))
        .then(() => {
          this.log(`Starting service`, 'log');
          // Initialise interface
          this.interface = this.invokeListener(parseInt(process.env.port, 10));
          // Check the status of the gateway
          if (!this.interface) {
            // Console Log
            this.log('Unable to start micro server! ', 'log');
            // Return
            return reject(false);
          } else {
            // Console Log
            this.log('Service started!', 'log');
            // Return
            return resolve(true);
          }
        })
        .catch(e => {
          this.log(
            `Service port "${parseInt(
              process.env.port,
              10
            )}" not free or unknown error has occurred. MORE INFO: ${JSON.stringify(e, null, 2)}`,
            'log'
          );
          // Reject
          return reject(false);
        });
    });
  }

  // FUNCTION: Bind listners to server
  bindService() {
    return new Promise((resolve, reject) => {
      // Socket Communication Request
      this.interface.on('MICRO_COM_REQUEST', (socket, data) => {
        // Confirm Connection
        this.log(`[${conId}] connection request recieved`);
        // Add To Connection Index
        this.connectionIndex = {
          conId: socket,
        };
        // Process Communication Request
        data ? this.processInternalRequest(socket, data) : noDataRecieved(socket, data);
        // Process Connection
        this.log(`[${conId}] connection request processed!`);
        // Return
        return conId++;
      });
      // Resolve promise
      return resolve();
    });
  }

  // FUNCTION: Process internal request
  processInternalRequest(socket, data) {
    // Get Parameters
    const _recievedData = data;
    const _commandData = data.data;
    const _socket = socket;
    // Get Destination
    const route = _commandData.commandType.funcName;
    // Direct Request To Correct Function
    return this.hasOwnProperty(route)
      ? this[route](_socket, _commandData)
      : this.redirectFailed(_socket, _recievedData);
  }

  // FUNCTION: Echo Recieved Data (Debug Purposes)
  echoData(socket, data) {
    // Invoke Template(s)
    const resObject = new ResponseBodyObject();
    // Get Parameters
    const _recievedData = data;
    const _socket = socket;
    // Build Response Object [status - transport]
    resObject.status.transport.responseSource = process.env.name;
    // Build Response Object [ResBody - command Details]
    resObject.resultBody.resData = _recievedData;
    resObject.resultBody.resData.commandBody.serverData = this;
    // Respond To Source
    return _socket.reply(resObject);
  }

  // FUNCTION: Failed To Find Route
  redirectFailed(socket, data) {
    // Invoke Template(s)
    const resObject = new ResponseBodyObject();
    // Get Parameters
    const _recievedData = data;
    const _socket = socket;
    // Build Response Object [status - transport]
    resObject.status.transport.responseSource = process.env.name;
    // Build Response Object [status - command]
    resObject.status.command = {
      code: 202,
      message: 'Command Not Executed - Internal Redirection Failed',
    };
    // Build Response Object [ResBody - command Details]
    resObject.resultBody.errData = {
      entity: `Micro Server: ${process.env.name}`,
      action: 'Internal Micro Server Redirection Failed',
      errorType: 'ERROR',
      originalData: _recievedData.commandBody,
    };
    // Respond To Source
    return _socket.reply(resObject);
  }

  // FUNCTION: No Data Recieved From Socket
  noDataRecieved(socket, data) {
    // Invoke Template(s)
    const resObject = new ResponseBodyObject();
    const _recievedData = data;
    const _socket = socket;
    // Build Response Object [status - transport]
    resObject.status.transport.responseSource = process.env.name;
    // Build Response Object [status - command]
    resObject.status.command = {
      code: 203,
      message: 'Command Not Executed - No Data Recieved In Micro Server',
    };
    // Build Response Object [ResBody - command Details]
    resObject.resultBody.errData = {
      entity: `Micro Server: ${process.env.name}`,
      action: 'No Data Recieved From Connection',
      errorType: 'ERROR',
      originalData: _recievedData.commandBody,
    };
    return _socket.reply(resObject);
  }
}

// Start the micro service instance
new MicroServer();
