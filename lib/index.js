'use strict';

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
        'initiateMicroServerConnection',
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
            (error, stdout, stderr) => {
              // Reset error status
              if (error || stderr) {
                this.microServerData[name].error = true;
              }
              // Show log
              handleStdOnData(name, 'event', `Micro service - ${name}: Process has exited!`);
            }
          );
        };
        // Process text
        const processStdio = (name, type, data) =>
          (
            `[Child process: ${type}] Micro service - ${name}: ${
              typeof data === 'object' ? JSON.stringify(data, null, 2) : data
            }` || ''
          ).trim();
        // Handle stdio
        const handleStdOnData = (name, type, data) => {
          // Build text
          const logOutput = processStdio(`${name}/port:${port}`, type, data);
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
        // Initialise connection to the service
        this.initConnectionToService(name, port, (...args) => callback(...args));
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

  // FUNCTION: Connect To Server & Return Object (API gateway only!)
  initiateMicroServerConnection(port, callback) {
    // Get Variables
    let _connectionAttempts = 0;
    // Invoke Network Interface
    const _portSpeaker = this.invokeSpeakerPersistent(port);
    // Check Socket Is Ready & Execute
    const startMicroServiceConnection = () => {
      // Check If Socket Initialized Then Continue...
      if (Object.values(_portSpeaker.sockets).length === 0) {
        // Wait & Retry (including timeout)
        if (_connectionAttempts <= this.settings.microServiceConnectionTimeout) {
          // Try Again...
          setTimeout(() => {
            startMicroServiceConnection();
            return _connectionAttempts++;
          }, 10);
        } else {
          // Return Error Object
          _portSpeaker.error = 'Socket initialization timeout...';
          // Notification
          this.log(`Socket initialization timeout. PORT: ${portMicroServer}`, 'log');
        }
      } else {
        // Send Data To Destination
        this.log(`Service core successfully initialized socket on port: ${port}`, 'log');
        // Return Object Speaker
        return callback(_portSpeaker);
      }
    };
    // Check Connection & Start
    return startMicroServiceConnection();
  }

  // FUNCTION: Initiate a connection to a microservice
  initConnectionToService(name, port, callback) {
    // Initiate micro service connection
    return this.initiateMicroServerConnection(port, socket => {
      // Show status
      if (socket.hasOwnProperty('error')) {
        this.log('Unable to connect to service - ${name}. Retrying...', 'log');
        // Set status
        this.microServerData[name].status = false;
        // Retry
        return setTimeout(() => initConnectionToService(name, port, callback), this.settings.connectionTimeout);
      }
      this.log('Connected to service, ready for client connections!');
      // Set status
      this.microServerData[name].status = true;
      // Store Socket Object
      this.microServerData[name].socket = socket;
      // Callback
      return callback(true, socket);
    });
  }

  // FUNCTION : Handles Error(s) In Communication/Messages
  processComError(data, message, id) {
    // Get Parameters
    const _data = data;
    const _foreignSocket = message;
    // Check Empty Data
    if (!_data) {
      // Create Response Object
      const responseObject = new ResponseBodyObject();
      // Build Response Object [status - transport]
      responseObject.status.transport = {
        code: 2001,
        message: 'No data recieved',
      };
      // Build Response Object [status - transport]
      responseObject.status.command = {
        code: 200,
        message: 'Command not executed, tansport failure  or no data recieved!',
      };
      // Build Response Object [ResBody - Error Details]
      responseObject.resultBody.errData = {
        entity: 'Service core',
        action: 'Request error handling',
        errorType: 'ERROR',
        originalData: _data,
      };
      // Notification
      this.log(`No data received. MORE INFO: ${responseObject}`, 'log');
      // Send Response
      return _foreignSocket.reply(responseObject);
    }
    // Return
    return void 0;
  }

  // FUNCTION: Communicate With MicroServer
  microServerCommunication(recData, foreignSocket, localSocket, conId) {
    // Check Socket Readiness...
    return localSocket.status === 0
      ? 'connectionNotReady'
      : localSocket.socket.request('MICRO_COM_REQUEST', recData, res => {
          // Send Micro Service Response To Source
          foreignSocket.reply(res);
          // Close Socket If Keep Alive Not Set
          recData.keepAlive === false && foreignSocket.conn.destroy();
          // Show message in console
          recData.keepAlive === false
            ? this.log(`[${conId}] Service core has closed the connection!`, 'log')
            : this.log(
                `[${conId}] Service core has not closed this connection, this socket can be reused or manually closed via socket.conn.destroy()`,
                'log'
              );
          // Return
          return 'connectionReady';
        });
  }

  // Check connection
  checkConnection(recData, foreignSock, localSock, conId, conAttempts) {
    // Perform action
    const _connectionInstance = this.microServerCommunication(recData, foreignSock, localSock, conId);
    // Check Connection, Execute Or Timeout...
    if (_connectionInstance === 'connectionNotReady') {
      if (conAttempts > this.settings.microServiceConnectionAttempts) {
        // Notification
        this.log('Service connection initiation attempts, maximum reached');
        // Create Response Object
        const responseObject = new ResponseBodyObject();
        // Build Response Object [status - transport]
        responseObject.status.transport = {
          code: 2002,
          message: 'Service connection initiation attempts, maximum reached',
        };
        // Build Response Object [status - transport]
        responseObject.status.command = {
          code: 200,
          message: 'Command not executed, tansport failure!',
        };
        // Build Response Object [ResBody - Error Details]
        responseObject.resultBody.errData = {
          entity: 'Service core',
          action: 'Service redirection',
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
      setTimeout(() => this.checkConnection(recData, foreignSock, localSock, conId, conAttempts), 10);
    } else {
      // Console log
      return this.log(`[${conId}] Local socket connection handed over successfully!`);
    }
  }

  // FUNCTION : Process Communication Request
  processComRequest(data, message, id) {
    // Service Connection Attempt Count...
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
      this.log(`Request received but destination unknown. MORE INFO: ${_data.destination}`);
      // Create Response Object
      const responseObject = new ResponseBodyObject();
      // Build Response Object [status - transport]
      responseObject.status.transport = {
        code: 2005,
        message: 'Request recieved but destination unknown!',
      };
      // Build Response Object [status - transport]
      responseObject.status.command = {
        code: 200,
        message: 'Command not executed, transport failure!',
      };
      // Build Response Object [ResBody - Error Details]
      responseObject.resultBody.errData = {
        entity: 'Service core',
        action: 'Service redirection',
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
