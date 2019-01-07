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
    // Bind methods
    return (
      [
        'addServerToTracking',
        'removeServerFromTracking',
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

  // FUNCTION: Get the index of the instance via port & name
  getProcessIndex(name, port) {
    return this.serviceData[name].port.indexOf(port);
  }

  // FUNCTION: Add new server to tracking object. This contains all the information for microservices
  addServerToTracking(name, port) {
    // Assign port to used list
    !this.inUsePorts.includes(port) && this.inUsePorts.push(port);
    // Check that the server doesnt already exist
    if (this.serviceData.hasOwnProperty(name)) {
      return (
        (this.serviceData[name] = Object.assign({}, this.serviceData[name], {
          socket: this.serviceData[name].socket.concat(void 0), // void 0
          port: this.serviceData[name].port.concat(port),
          process: this.serviceData[name].process.concat(void 0),
          connectionCount: this.serviceData[name].connectionCount.concat(0),
        })) && true
      );
    }
    // Add the server to the tracking
    return (
      (this.serviceData[name] = {
        socket: [void 0], // void 0
        status: false,
        error: false,
        port: [port],
        connectionCount: [0],
        process: [void 0],
      }) && true
    );
  }

  // FUNCTION: Removes the service from the tracking object
  removeServerFromTracking(name, port) {
    // Get index of name and port
    const socketIndex = this.serviceData[name].port.indexOf(port);
    // Remove port from used port list
    this.inUsePorts = this.inUsePorts.filter(usedPort => usedPort !== port);
    // Remove tracking information for service
    if (socketIndex > -1) {
      this.serviceData[name].socket.splice(socketIndex, 1);
      this.serviceData[name].port.splice(socketIndex, 1);
      this.serviceData[name].process.splice(socketIndex, 1);
      this.serviceData[name].connectionCount.splice(socketIndex, 1);
    }
    // Return
    return void 0;
  }

  // FUNCTION: Initiate a connection to a microservice
  initService(name, callback) {
    // Define port
    let port = void 0;
    // Get a free port
    const findAFreePort = () => {
      return new Promise(resolve =>
        getFreePort(
          this.settings.portRangeStart,
          this.settings.portRangeFinish,
          (err, freePort) => resolve(freePort)
        )
      );
    };
    // Build micro service wrapper
    const microServiceWrapper = () => {
      return new Promise(resolve => {
        const ensurePortFree = async () => {
          // Find a free port and assign above scope
          port = await findAFreePort();
          // Check if the port has been marked as inuse
          if (this.inUsePorts.includes(port)) {
            return setTimeout(ensurePortFree, 50);
          } else {
            // Check that the retrieving a port was successful
            this.addServerToTracking(name, port);
            // Reset error status
            this.serviceData[name].error = false;
            // Assign process to instance
            this.serviceData[name].process[
              this.getProcessIndex(name, port)
            ] = exec(
              `node ${__dirname}/server/index.js`,
              {
                maxBuffer: 1024 * this.settings.maxBuffer,
                env: {
                  parentPid: process.pid,
                  name,
                  port,
                  service: true,
                  operations: this.serviceInfo[name],
                  settings: JSON.stringify(this.settings),
                  options: JSON.stringify(this.serviceOptions[name]),
                  serviceInfo: JSON.stringify(this.serviceInfo),
                },
              },
              (error, stdout, stderr) => {
                // Remove service from tracking
                this.removeServerFromTracking(name, port);
                // Reset error status
                if (error || stderr) {
                  this.serviceData[name].error = true;
                }
                // Show log
                handleOnData(
                  name,
                  'event',
                  `Micro service - ${name}: Process has exited!`
                );
              }
            );
            // Resolve
            return resolve(callback(true));
          }
        };
        // Return
        return ensurePortFree();
      });
    };
    // Process text
    const processStdio = (name, type, data) => {
      return (
        `[Child process: ${type}] Micro service - ${name}: ${
          typeof data === 'object' ? JSON.stringify(data, null, 2) : data
        }` || ''
      ).trim();
    };
    // Handle stdio
    const handleOnData = (name, type, data) => {
      // Build text
      const logOutput = processStdio(`${name}/port:${port}`, type, data);
      // Write to log
      this.writeToLogFile(logOutput);
      // Show in parent console
      this.log(logOutput, 'log');
    };
    // Service exit handler assigner
    const assignEventHandlers = () => {
      return new Promise(resolve => {
        // Assign to standard streams
        ['stdout', 'stderr'].forEach(event =>
          this.serviceData[name].process[this.getProcessIndex(name, port)][
            event
          ].on('data', data => handleOnData(name, event, data))
        );
        // onExit
        ['exit'].forEach(event =>
          this.serviceData[name].process[this.getProcessIndex(name, port)].on(
            event,
            restartService
          )
        );
        // Resolve
        resolve();
      });
    };
    // Service starter wrapper
    const startService = async callback => {
      // Initialise service
      await microServiceWrapper();
      // Assign process event handler
      await assignEventHandlers();
      // Start checking for connection
      await new Promise((resolve, reject) => {
        this.initConnectionToService(name, port, (...args) => {
          callback(...args);
          resolve();
        });
      });
    };
    // Service restarter wrapper
    const restartService = () => {
      return setTimeout(
        () => startService(callback),
        this.settings.restartTimeout
      );
    };
    // Start service initially
    startService(callback);
  }

  // FUNCTION: Write output to log file
  writeToLogFile(contents) {
    return (
      this.settings.logPath &&
      makeDirectory(dirname(path), err => {
        // Throw error if failed to write to log file
        err &&
          this.log(`Unable to write to log file. MORE INFO: ${err}`, 'warn');
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
        if (
          _connectionAttempts <= this.settings.microServiceConnectionTimeout
        ) {
          // Try Again...
          setTimeout(() => {
            startMicroServiceConnection();
            return _connectionAttempts++;
          }, 10);
        } else {
          // Return Error Object
          _portSpeaker.error = 'Socket initialization timeout...';
          // Notification
          this.log(
            `Socket initialization timeout. PORT: ${portMicroServer}`,
            'log'
          );
        }
      } else {
        // Send Data To Destination
        this.log(
          `Service core successfully initialized socket on port: ${port}`,
          'log'
        );
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
        this.serviceData[name].status = false;
        // Retry
        return setTimeout(
          () => initConnectionToService(name, port, callback),
          this.settings.connectionTimeout
        );
      }
      this.log('Connected to service, ready for client connections!');
      // Set status
      this.serviceData[name].status = true;
      // Store Socket Object
      this.serviceData[name].socket[this.getProcessIndex(name, port)] = socket;
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
    if (localSocket.status === 0) {
      return 'connectionNotReady';
    } else {
      // Get socket information
      const [socket, index] = this.getMicroServiceSocket(
        recData.destination,
        localSocket.socket
      );
      // Add to connection count for socket
      ++this.serviceData[recData.destination].connectionCount[index];
      // Send to socket
      socket.request('MICRO_COM_REQUEST', recData, res => {
        // Send Micro Service Response To Source
        foreignSocket.reply(res);
        // Close Socket If Keep Alive Not Set
        recData.keepAlive === false && foreignSocket.conn.destroy();
        // Show message in console
        recData.keepAlive === false
          ? this.log(
              `[${conId}] Service core has closed the connection!`,
              'log'
            )
          : this.log(
              `[${conId}] Service core has not closed this connection, this socket can be reused or manually closed via socket.conn.destroy()`,
              'log'
            );
        // Return
        return 'connectionReady';
      });
    }
  }

  // Check connection
  checkConnection(recData, foreignSock, localSock, conId, _connectionAttempts) {
    // Perform action
    const _connectionInstance = this.microServerCommunication(
      recData,
      foreignSock,
      localSock,
      conId
    );
    // Check Connection, Execute Or Timeout...
    if (_connectionInstance === 'connectionNotReady') {
      if (_connectionAttempts > this.settings.microServiceConnectionAttempts) {
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
      _connectionAttempts++;
      // Wait & Try Again...
      setTimeout(
        () =>
          this.checkConnection(
            recData,
            foreignSock,
            localSock,
            conId,
            _connectionAttempts
          ),
        10
      );
    } else {
      // Console log
      return this.log(
        `[${conId}] Local socket connection handed over successfully!`
      );
    }
  }

  // FUNCTION: Get socket depending on queue type
  getMicroServiceSocket(name, socketList) {
    // Random scheduling default..
    const randomScheduling = () => {
      // Queuing: random
      const socketIndex = Math.floor(Math.random() * socketList.length);
      // Return
      return [socketList[socketIndex], socketIndex];
    };
    // Get socket for service
    switch (true) {
      case typeof this.serviceOptions[name].loadBalancing === 'function': {
        // Must return [socket, index]
        return this.serviceOptions[name].loadBalancing(socketList);
      }
      case this.serviceOptions[name].loadBalancing === 'roundRobin': {
        // Queuing: random
        const socketIndex = this.serviceData[name].connectionCount.indexOf(
          Math.min(...this.serviceData[name].connectionCount)
        );
        // Queuing: roundRobin
        return [socketList[socketIndex], socketIndex];
      }
      case this.serviceOptions[name].loadBalancing === 'random': {
        return randomScheduling();
      }
      default: {
        console.warn(
          `Load balancing strategy for ${name} is incorrect. Defaulting to "random" strategy...`
        );
        return randomScheduling();
      }
    }
  }

  // FUNCTION : Process Communication Request
  processComRequest(data, message, id) {
    // Service Connection Attempt Count...
    const _connectionAttempts = 0;
    // Get Parameters
    const _data = data;
    const _connectionId = id;
    const _foreignSocket = message;
    // Process Request [Redirection]
    if (this.serviceData.hasOwnProperty(_data.destination)) {
      // Get server data
      const _localSocket = this.serviceData[_data.destination];
      // Check Connection & Send Data
      this.checkConnection(
        _data,
        _foreignSocket,
        _localSocket,
        _connectionId,
        _connectionAttempts
      );
    } else {
      // Notification
      this.log(
        `Request received but destination unknown. MORE INFO: ${
          _data.destination
        }`
      );
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
