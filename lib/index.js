// Load NPM Modules
const getFreePort = require('find-free-port');
const makeDirectory = require('mkdirp');
const fs = require('fs');
const { exec } = require('child_process');
const { dirname } = require('path');

// Load Templates
const ResponseBodyObject = require('./template/response');

// Load libs
const MSCommon = require('./common');

// Load class
class ServiceCore extends MSCommon {
  // Constructor
  constructor(options) {
    // Allow access to 'this'
    super(options);
    // Invoke server tracking object
    this.microServerData = {};
    // Bind methods
    return (
      [
        'addServerToTracking',
        'initService',
        'initConnectionToService',
        'processComError',
        'microServerCommunication',
        'checkConnection',
        'processComRequest',
      ].forEach(func => (this[func] = this[func].bind(this))) || this
    );
  }

  // FUNCTION: Add new server to tracking object. This contains all the information for microservices
  addServerToTracking(name, port) {
    // Check that the server doesnt already exist
    if (this.microServerData.hasOwnProperty(name)) {
      return false;
    }
    // Add the server to the tracking
    return (
      (this.microServerData[name] = {
        socket: void 0,
        status: false,
        error: false,
        port,
        funcs: {},
        process: void 0,
      }) && true
    );
  }

  // FUNCTION: Initiate a connection to a microservice
  initService(name, callback) {
    // Find a free port
    return getFreePort(this.settings.portRangeStart, this.settings.portRangeFinish, (err, port) => {
      // Check that the retrieving a port was successful
      if (!err) {
        // Add service to tracking
        this.addServerToTracking(name, port);
        // Build micro service wrapper
        const microServiceWrapper = () => {
          // Reset error status
          this.microServerData[name].error = false;
          // Assign process to instance
          this.microServerData[name].process = exec(
            `node ${__dirname}/server/index.js`,
            {
              maxBuffer: 1024 * this.settings.maxBuffer,
              env: {
                parentPid: process.pid,
                name,
                port,
                operations: this.microServerInfo[name],
                settings: JSON.stringify(this.settings),
              },
            },
            (error, stdout, stderr) => handleStdOnData(name, 'event', `Micro Service - ${name}: Process has exited!`)
          );
        };

        // Process text
        const processStdio = (name, type, data) =>
          (
            `[${type}] Micro Service - ${name}: ${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}` ||
            ''
          ).trim();

        // Handle stdio
        const handleStdOnData = (name, type, data) => {
          // Build text
          const logOutput = processStdio(name, type, data);
          // Write to log
          this.writeToLogFile(logOutput);
          // Show in parent console
          this.log(logOutput, 'log');
        };

        // Service exit handler assigner
        const assignEventHandlers = () => {
          // Assign to standard streams
          ['stdout', 'stderr'].forEach(event =>
            this.microServerData[name].process[event].on('data', data => handleStdOnData(name, event, data))
          );
          // onExit
          return ['exit'].forEach(event => this.microServerData[name].process.on(event, restartService));
        };

        // Service starter wrapper
        const startServiceProcess = () => {
          // Initialise service
          microServiceWrapper();
          // Assign process event handler
          assignEventHandlers();
          // Return nothing
          return void 0;
        };

        // Service restarter wrapper
        const restartService = () => setTimeout(startServiceProcess, this.settings.restartTimeout);

        // Start service initially
        startServiceProcess();

        // Initialise connection
        /*
            - API gateway starts the connection with the micro service
            - Saves the socket in "microServerData"
        */
      } else {
        callback(err, null);
      }
    });
  }

  // FUNCTION: Write output to log file
  writeToLogFile(contents) {
    return (
      this.settings.logPath &&
      makeDirectory(dirname(path), err => {
        // Throw error if failed to write to log file
        err && this.log(`Unable to write to log file. MORE INFO: ${err}`, 'warn');
        // Write the file
        fs.writeFile(this.settings.logPath, contents, () => void 0);
      })
    );
  }

  // FUNCTION: Initiate a connection to a microservice
  initConnectionToService(name, port, callback) {
    // Initiate micro service connection
    return this.initiateMicroServerConnection(port, socket => {
      // Show status
      if (socket.hasOwnProperty('error')) {
        this.log('ERROR: Unable To Connect To Micro Server. Retrying...', 'log');
        // Set status
        this.microServerData[name].status = false;
        // Retry
        return setTimeout(() => initConnectionToService(name, callback), 0);
      }
      this.log('NOTICE: Connected To Micro Server. Ready For Client Connections!');
      // Set status
      this.microServerData[name].status = true;
      // Store Socket Object
      this.microServerData[name].socket = socket;
      // Callback
      return callback(null, conn);
    });
  }

  // FUNCTION : Handles Error(s) In Communication/Messages
  processComError(data, message, id) {
    // Get Parameters
    const _data = data;
    const _connectionId = id;
    const _foreignSocket = message;
    // Check Empty Data
    if (!_data) {
      // Create Response Object
      const responseObject = new ResponseBodyObject();
      // Build Response Object [status - transport]
      responseObject.status.transport = {
        code: 2001,
        message: 'No Data Recieved',
      };
      // Build Response Object [status - transport]
      responseObject.status.command = {
        code: 200,
        message: 'Command Not Executed - Transport Failiure / No Data Recieved',
      };
      // Build Response Object [ResBody - Error Details]
      responseObject.resultBody.errData = {
        entity: 'Main API Gateway Server',
        action: 'Message Error Handling',
        errorType: 'ERROR',
        originalData: _data,
      };
      // Notification
      this.log(`ERROR: No Data Recieved. MORE INFO: ${responseObject}`, 'log');
      // Send Response
      return _foreignSocket.reply(responseObject);
    }
    // Return
    return void 0;
  }

  // FUNCTION: Communicate With MicroServer
  microServerCommunication(recData, foreignSocket, localSocket) {
    // Check Socket Readiness...
    return localSocket.status == 0
      ? 'connectionNotReady'
      : localSocket.Socket.request('MICRO_COM_REQUEST', recData, res => {
          // Send Micro Service Response To Source
          foreignSocket.reply(res);
          // Close Socket If Keep Alive Not Set
          recData.keepAlive === false && foreignSocket.conn.destroy();
          // Return
          return 'connectionReady';
        });
  }

  // Check connection
  checkConnection(recData, foreignSock, localSock, conId, conAttempts) {
    // Perform action
    const _connectionInstance = this.microServerCommunication(recData, foreignSock, localSock);
    // Check Connection, Execute Or Timeout...
    if (_connectionInstance === 'connectionNotReady') {
      if (conAttempts > this.settings.microServiceConnectionAttempts) {
        // Notification
        this.log('ERROR: Micro Server Connection Initiation Attempts - Maximum Reached');
        // Create Response Object
        const responseObject = new ResponseBodyObject();
        // Build Response Object [status - transport]
        responseObject.status.transport = {
          code: 2002,
          message: 'Micro Server Connection Initiation Attempts - Maximum Reached',
        };
        // Build Response Object [status - transport]
        responseObject.status.command = {
          code: 201,
          message: 'Command Not Executed - transport Failiure',
        };
        // Build Response Object [ResBody - Error Details]
        responseObject.resultBody.errData = {
          entity: 'Main API Gateway Server',
          action: 'Micro Server Redirection',
          errorType: 'ERROR',
          originalData: _data,
        };
        // Send Response Back To Source
        foreignSock.reply(responseObject);
        // Close Socket
        return foreignSock.conn.destroy();
      }
      // Increment Connection Attempts
      conAttempts++;
      // Wait & Try Again...
      setTimeout(() => this.checkConnection(recData, foreignSock, localSock, conId), 10);
    } else {
      // Console log
      return this.log(`[${conId}] Local Socket Connection Handed Over Successfully!`);
    }
  }

  // FUNCTION : Process Communication Request
  processComRequest(data, message, id) {
    // Micro Server Connection Attempt Count...
    const conAttempts = 0;
    // Get Parameters
    const _data = data;
    const _connectionId = id;
    const _foreignSocket = message;
    // Process Request [Redirection]
    if (this.microServerData.hasOwnProperty(_data.destination)) {
      // Get server data
      const _localSocket = this.microServerData[_data.destination];
      // Check Connection & Send Data
      this.checkConnection(_data, _foreignSocket, _localSocket, _connectionId, conAttempts);
    } else {
      // Notification
      this.log(`ERROR: Request Recieved But Destination Unknown. MORE INFO: ${_data.destination}`);
      // Create Response Object
      const responseObject = new ResponseBodyObject();
      // Build Response Object [status - transport]
      responseObject.status.transport = {
        code: 2005,
        message: 'Request Recieved But Destination Unknown',
      };
      // Build Response Object [status - transport]
      responseObject.status.command = {
        code: 201,
        message: 'Command Not Executed - transport Failiure',
      };
      // Build Response Object [ResBody - Error Details]
      responseObject.resultBody.errData = {
        entity: 'Main API Gateway Server',
        action: 'Micro Server Redirection',
        errorType: 'ERROR',
        originalData: _data,
      };
      // Reply
      _foreignSocket.reply(responseObject);
      // Close Socket
      return _foreignSocket.conn.destroy();
    }
  }
}

// EXPORTS
module.exports = ServiceCore;
