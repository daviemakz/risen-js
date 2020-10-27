'use strict';

// Load NPM Modules
import mkdirp from 'mkdirp';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream } from 'fs';
import { exec } from 'child_process';
import { dirname } from 'path';

// Load Templates
import ResponseBody from './template/response';

// Load network components
import { createSpeakerReconnector } from './net';

// Load utils
import {
  findAFreePort,
  buildResponseFunctions,
  handleOnData,
  randomScheduling,
  handleReplyToSocket
} from './util';

// Load libs
import ServiceCommon from './common';

// Define variables
const coreName = 'serviceCore';

// Load class
class ServiceCore extends ServiceCommon {
  // Constructor
  constructor(options) {
    // Allow access to 'this'
    super(options);

    // Assign instance name
    process.env.name = coreName;

    // Bind methods
    [
      'addServerToTracking',
      'checkConnection',
      'databaseOperation',
      'destinationUnknown',
      'functionUnknown',
      'getMicroServiceSocket',
      'initConnectionToService',
      'initService',
      'initiateMicroServerConnection',
      'microServerCommunication',
      'processComError',
      'processComRequest',
      'removeServerFromTracking',
      'resolveMicroServiceSocket'
    ].forEach((func) => {
      this[func] = this[func].bind(this);
    });

    // Return instance
    return this;
  }

  // Process a database operation
  databaseOperation(table, method, args, callback) {
    return setImmediate(() => {
      try {
        return Object.prototype.hasOwnProperty.call(this.db, table)
          ? callback(true, this.db[table][method](...args), null)
          : callback(
              false,
              void 0,
              new Error(`The table ${table} does not exist!`)
            );
      } catch (e) {
        return callback(false, void 0, e);
      }
    });
  }

  // Get the index of the instance via port & name
  getProcessIndex(name, port) {
    return this.serviceData[name].port.indexOf(port);
  }

  // Add new server to tracking object. This contains all the information for microservices
  addServerToTracking(name, port, instanceId) {
    // Assign port to used list
    if (!this.inUsePorts.includes(port)) {
      this.inUsePorts.push(port);
    }
    // Clean out exited port if its there
    process.env.exitedProcessPorts = (typeof process.env.exitedProcessPorts ===
    'string'
      ? process.env.exitedProcessPorts.split(',')
      : process.env.exitedProcessPorts
    )
      .map((port) => parseInt(port, 10))
      .filter((exitedPort) => typeof port === 'number' && exitedPort !== port);

    // Check that the server doesnt already exist
    if (Object.prototype.hasOwnProperty.call(this.serviceData, name)) {
      this.serviceData[name] = {
        ...this.serviceData[name],
        socketList: this.serviceData[name].socketList.concat(void 0),
        port: this.serviceData[name].port.concat(port),
        instanceId: this.serviceData[name].instanceId.concat(instanceId),
        process: this.serviceData[name].process.concat(void 0),
        connectionCount: this.serviceData[name].connectionCount.concat(0)
      };
      return true;
    }

    // Add the server to the tracking
    this.serviceData[name] = {
      instanceId: [instanceId],
      socketList: [void 0],
      status: false,
      error: false,
      port: [port],
      connectionCount: [0],
      process: [void 0]
    };

    // Return
    return true;
  }

  // Removes the service from the tracking object
  removeServerFromTracking(name, port) {
    // Get index by name and port
    const socketIndex = this.serviceData[name].port.indexOf(port);
    // Remove port from used port list
    this.inUsePorts = this.inUsePorts.filter((usedPort) => usedPort !== port);

    // Remove tracking information for service
    if (socketIndex > -1) {
      // Remove service tracking information
      this.serviceData[name].instanceId.splice(socketIndex, 1);
      this.serviceData[name].socketList.splice(socketIndex, 1);
      this.serviceData[name].port.splice(socketIndex, 1);
      this.serviceData[name].process.splice(socketIndex, 1);
      this.serviceData[name].connectionCount.splice(socketIndex, 1);
    }

    // Return
    return void 0;
  }

  // Initiate a connection to a microservice
  initService(name, callback) {
    // Define port
    let port = void 0;
    const instanceId = uuidv4();

    // Build micro service wrapper
    const microServiceWrapper = () => {
      return new Promise((resolve, reject) => {
        const initialiseOnFreePort = async () => {
          try {
            // Find a free port and assign above scope
            port = await findAFreePort(this);
            // Check if the port has been marked as inuse
            if (this.inUsePorts.includes(port)) {
              return setTimeout(initialiseOnFreePort, 50);
            }
            // Check that the retrieving a port was successful
            this.addServerToTracking(name, port, instanceId);
            // Reset error status
            this.serviceData[name].error = false;
            // Assign process to instance
            this.serviceData[name].process[
              this.getProcessIndex(name, port)
            ] = exec(
              `${process.execPath} ${__dirname}/server/entry.js`,
              {
                maxBuffer: 1024 * this.settings.maxBuffer,
                env: {
                  parentPid: process.pid,
                  verbose: process.env.verbose,
                  name,
                  instanceId,
                  port,
                  service: true,
                  operations: this.serviceInfo[name],
                  settings: JSON.stringify(this.settings),
                  options: JSON.stringify(this.serviceOptions[name]),
                  serviceInfo: JSON.stringify(this.serviceInfo)
                }
              },
              (error, stdout, stderr) => {
                // Remove service from tracking
                this.removeServerFromTracking(name, port);
                // Reset error status
                if (error || stderr) {
                  this.serviceData[name].error = true;
                }
                // Show log
                handleOnData(this, port, instanceId)(
                  name,
                  'event',
                  `Micro service - ${name}: Process has exited!`
                );
              }
            );
            // Resolve
            return resolve(callback(true));
          } catch (e) {
            return reject(Error(e));
          }
        };
        // Return
        return initialiseOnFreePort();
      });
    };

    // Service starter wrapper
    const startService = async (callback) => {
      try {
        // Initialise service
        await microServiceWrapper();

        // Assign process event handler
        await new Promise((resolve) => {
          // Assign to standard streams
          ['stdout', 'stderr'].forEach((event) =>
            this.serviceData[name].process[this.getProcessIndex(name, port)][
              event
            ].on('data', (data) =>
              handleOnData(this, port, instanceId)(name, event, data)
            )
          );

          // onExit
          ['exit'].forEach((event) =>
            this.serviceData[name].process[this.getProcessIndex(name, port)].on(
              event,
              () => {
                // Restart service
                setTimeout(() => {
                  if (
                    !process.env.exitedProcessPorts
                      .split(',')
                      .map((port) => parseInt(port, 10))
                      .includes(port)
                  ) {
                    startService(callback);
                  }
                }, this.settings.restartTimeout);
              }
            )
          );

          // Resolve
          resolve();
        });

        // Start checking for connection
        await new Promise((resolve) => {
          this.initConnectionToService(name, port, (...args) => {
            callback(...args);
            resolve();
          });
        });
      } catch (e) {
        throw new Error(e);
      }
    };

    // Start service initially
    startService(callback);
  }

  // Write output to log file
  writeToLogFile(contents) {
    if (this.settings.logPath) {
      return mkdirp(dirname(this.settings.logPath))
        .then(() => {
          // Check that a writable stream is open and create one if not
          if (!this.logFileStream) {
            this.logFileStream = createWriteStream(this.settings.logPath, {
              flags: 'a'
            });
          }
          // Write the file
          return this.logFileStream.write(`${contents}\n`);
        })
        .catch((error) => {
          // Throw error if failed to write to log file
          if (error) {
            this.log(
              `Unable to write to log file. MORE INFO: ${error}`,
              'warn'
            );
          }
        });
    }
    return void 0;
  }

  // Connect To Server & Return Object (API gateway only!)
  initiateMicroServerConnection(port, callback) {
    // Get Variables
    let connectionAttempts = 0;
    const { msConnectionTimeout } = this.settings;
    // Invoke the port emitter
    const portEmitter = createSpeakerReconnector(port);
    // Check Socket Is Ready & Execute
    const startMicroServiceConnection = () => {
      // Check If Socket Initialized Then Continue...
      if (Object.values(portEmitter.sockets).length === 0) {
        // Wait & Retry (including timeout)
        if (connectionAttempts <= msConnectionTimeout) {
          // Try Again...
          return setTimeout(() => {
            startMicroServiceConnection();
            connectionAttempts += 1;
          }, 10);
        }
        // Return Error Object
        portEmitter.error = 'Socket initialization timeout...';
        // Notification
        return this.log(`Socket initialization timeout. PORT: ${port}`, 'log');
      }
      // Send Data To Destination
      this.log(
        `Service core successfully initialized socket on port: ${port}`,
        'log'
      );
      // Return Object Speaker
      return callback(portEmitter);
    };
    // Check Connection & Start
    return startMicroServiceConnection();
  }

  // Initiate a connection to a microservice
  initConnectionToService(name, port, callback) {
    // Initiate micro service connection
    return this.initiateMicroServerConnection(port, (socket) => {
      // Show status
      if (Object.prototype.hasOwnProperty.call(socket, 'error')) {
        this.log(`Unable to connect to service - ${name}. Retrying...`, 'log');
        // Set status
        this.serviceData[name].status = false;
        // Retry
        return setTimeout(
          () => this.initConnectionToService(name, port, callback),
          this.settings.connectionTimeout
        );
      }
      this.log(
        `Service core has successfully connected to micro service: ${port}`
      );
      // Set status
      this.serviceData[name].status = true;
      // Store Socket Object
      this.serviceData[name].socketList[
        this.getProcessIndex(name, port)
      ] = socket;
      // Callback
      return callback(true, socket);
    });
  }

  // Handles Error(s) In Communication/Messages
  processComError(command, clientSocket) {
    // Check Empty Data
    if (!command) {
      // Create Response Object
      const responseObject = new ResponseBody();
      // Build Response Object [status - transport]
      responseObject.setTransportStatus({
        code: 5001,
        message: 'No data received'
      });
      // Build Response Object [status - transport]
      responseObject.setCommandStatus({
        code: 500,
        message: 'Command not executed, tansport failure  or no data recieved!'
      });
      // Build Response Object [ResBody - Error Details]
      responseObject.setErrData({
        entity: 'Service core',
        action: 'Request error handling',
        originalData: command
      });
      // Notification
      this.log(`No data received. MORE INFO: ${responseObject}`, 'log');
      // Send Response
      return clientSocket.reply(responseObject);
    }
    // Return
    return void 0;
  }

  // Communicate With MicroServer
  async microServerCommunication(
    recData,
    clientSocket,
    microServiceInfo,
    conId
  ) {
    // Check Socket Readiness...
    if (microServiceInfo.status === 0) {
      return 'connectionNotReady';
    }

    // Get socket information
    const [socket, index] = await this.getMicroServiceSocket(
      recData.destination,
      microServiceInfo.socketList
    );

    // Add to connection count for socket
    this.serviceData[recData.destination].connectionCount[index] += 1;

    // Send to socket
    return socket.request('SERVICE_REQUEST', recData, (res) => {
      // Send Micro Service Response To Source
      clientSocket.reply(res);
      // Close Socket If Keep Alive Not Set
      if (recData.keepAlive === false) {
        clientSocket.conn.destroy();
      }
      // Show message in console
      if (recData.keepAlive === false) {
        this.log(`[${conId}] Service core has closed the connection!`, 'log');
      } else {
        this.log(
          `[${conId}] Service core has not closed this connection, this socket can be reused or manually closed via socket.conn.destroy()`,
          'log'
        );
      }
      // Return
      return 'connectionReady';
    });
  }

  // Check connection
  checkConnection(
    recData,
    clientSocket,
    microServiceInfo,
    conId,
    connectionAttempts
  ) {
    // Perform action
    const microServerConnection = this.microServerCommunication(
      recData,
      clientSocket,
      microServiceInfo,
      conId
    );
    let intConnAttempts = connectionAttempts;
    // Check Connection, Execute Or Timeout...
    if (microServerConnection === 'connectionNotReady') {
      if (intConnAttempts > this.settings.msConnectionRetryLimit) {
        // Notification
        this.log('Service connection initiation attempts, maximum reached');
        // Create Response Object
        const responseObject = new ResponseBody();
        // Build Response Object [status - transport]
        responseObject.setTransportStatus({
          code: 5002,
          message: 'Reached maximum service connection initiation attempts!'
        });
        // Build Response Object [status - transport]
        responseObject.setCommandStatus({
          code: 500,
          message: 'Command not executed, tansport failure!'
        });
        // Build Response Object [ResBody - Error Details]
        responseObject.setErrData({
          entity: 'Service core',
          action: 'Service redirection',
          originalData: recData
        });
        // Send Response Back To Source
        clientSocket.reply(responseObject);
        // Close Socket
        return clientSocket.conn.destroy();
      }
      // Increment Connection Attempts
      intConnAttempts += 1;
      // Wait & Try Again...
      return setTimeout(
        () =>
          this.checkConnection(
            recData,
            clientSocket,
            microServiceInfo,
            conId,
            intConnAttempts
          ),
        10
      );
    }
    // Console log
    return this.log(
      `[${conId}] Local socket connection handed over successfully!`
    );
  }

  // Resolve the micro service socket and index
  getMicroServiceSocket(name, socketList) {
    return new Promise((resolve) => {
      let socketData;
      // Allows us to retry getting the socket
      const getSocket = () => {
        socketData = this.resolveMicroServiceSocket(name, socketList);
        const [socket, index] = socketData;
        // If the socket exists resolve the promise else try again
        if (socket) {
          resolve([socket, index]);
        } else {
          setTimeout(() => {
            getSocket();
          }, 1);
        }
      };
      getSocket();
    });
  }

  // Get socket depending on queue type
  resolveMicroServiceSocket(name, socketList) {
    // Get socket for service
    switch (true) {
      case typeof this.serviceOptions[name].loadBalancing === 'function': {
        // Must return [socket, index]
        return this.serviceOptions[name].loadBalancing(socketList);
      }
      case this.serviceOptions[name].loadBalancing === 'roundRobin': {
        // Queuing: roundRobin
        const socketIndex = this.serviceData[name].connectionCount.indexOf(
          Math.min(...this.serviceData[name].connectionCount)
        );
        return [socketList[socketIndex], socketIndex];
      }
      case this.serviceOptions[name].loadBalancing === 'random': {
        // Queuing: random
        return randomScheduling(socketList);
      }
      default: {
        this.log(
          `Load balancing strategy for ${name} is incorrect. Defaulting to "random" strategy...`,
          'warn'
        );
        return randomScheduling(socketList);
      }
    }
  }

  // Function unknown
  functionUnknown(command) {
    // Notification
    this.log(
      `Request received & destination verified but function unknown. MORE INFO: ${command.destination}`
    );
    // Create Response Object
    const responseObject = new ResponseBody();
    // Build Response Object [status - transport]
    responseObject.setTransportStatus({
      code: 5007,
      message: 'Request received & destination verified but function unknown!'
    });
    // Build Response Object [status - transport]
    responseObject.setCommandStatus({
      code: 503,
      message: 'Command not executed, function unknown!'
    });
    // Build Response Object [ResBody - Error Details]
    responseObject.setErrData({
      entity: 'Service core',
      action: 'Service redirection',
      originalData: command
    });
    // Return
    return responseObject;
  }

  // Destination unknown
  destinationUnknown(command) {
    // Notification
    this.log(
      `Request received but destination unknown. MORE INFO: ${command.destination}`
    );
    // Create Response Object
    const responseObject = new ResponseBody();
    // Build Response Object [status - transport]
    responseObject.setTransportStatus({
      code: 5005,
      message: 'Request recieved but destination unknown!'
    });
    // Build Response Object [status - transport]
    responseObject.setCommandStatus({
      code: 500,
      message: 'Command not executed, transport failure!'
    });
    // Build Response Object [ResBody - Error Details]
    responseObject.setErrData({
      entity: 'Service core',
      action: 'Service redirection',
      originalData: command
    });
    // Return
    return responseObject;
  }

  // Process Communication Request
  processComRequest(command, clientSocket, connectionId) {
    // Service Connection Attempt Count...
    const connectionAttempts = 0;
    // Process Request [Redirection]
    switch (true) {
      case command.destination === process.env.name: {
        // Return
        return setImmediate(() => {
          // Build methods
          const helperMethods = buildResponseFunctions(
            clientSocket,
            command,
            this.operationScope
          );
          return Object.prototype.hasOwnProperty.call(
            this.coreOperations,
            command.data.functionName
          )
            ? this.coreOperations[command.data.functionName](helperMethods)
            : handleReplyToSocket(
                this.functionUnknown(command),
                clientSocket,
                false
              );
        });
      }
      case Object.prototype.hasOwnProperty.call(
        this.serviceData,
        command.destination
      ): {
        // Get micro server data
        const microServiceInfo = this.serviceData[command.destination];
        // Check Connection & Send Data
        return this.checkConnection(
          command,
          clientSocket,
          microServiceInfo,
          connectionId,
          connectionAttempts
        );
      }
      default: {
        return handleReplyToSocket(
          this.destinationUnknown(command),
          clientSocket,
          false
        );
      }
    }
  }
}

// EXPORTS
export default ServiceCore;
