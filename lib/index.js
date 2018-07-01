'use strict';

// Load NPM Modules
const getFreePort = require('find-free-port');

// Load Templates
const CommandBodyObject = require('./template/command.js');
const ResponseBodyObject = require('./template/response.js');

// Load libs
const MicroServiceCommon = require('./common');

// Load class
class MicroServiceFramework extends MicroServiceCommon {
  // Constructor
  constructor(options) {
    // Allow access to 'this'
    super(options);
    // Connection tracking number
    this.conId = 0;
    // Invoke server tracking object
    this.serverInfo = {};
    // Declare settings
    this.settings = {
      connectionTimeout: options.conTimeout || 1500,
      microServiceConnectionTimeout: options.msConTimeout || 10000,
      microServiceConnectionAttempts: options.msConAttempt || 1000,
      apiGatewayPort: options.apiGatewayPort || 8080,
      portRangeStart: options.portRangeStart || 10000,
      portRangeFinish: options.portRangeFinish || 65535,
    };
    // Bind methods
    return [].forEach(func => (this[func] = this[func].bind(this))) || this;
  }

  // FUNCTION: Add new server to tracking
  addServerToTracking(name, port) {
    // Check that the server doesnt already exist
    if (this.serverInfo.hasOwnProperty(name)) {
      return false;
    } else {
      // Add the server to the tracking
      return (
        (this.serverInfo[name] = {
          Socket: void 0,
          Status: false,
          Port: port,
          Funcs: {},
        }) && true
      );
    }
  }

  // FUNCTION: Initiate a connection to a microservice
  initService(name, callback) {
    // Find a free port
    return getFreePort(
      this.settings.portRangeStart,
      this.settings.portRangeFinish,
      (err, port) => {
        // Check that the retrieving a port was successful
        if (!err) {
          // Add service to tracking
          this.addServerToTracking(name, port);
          // Start service
          // START SERVICE
          // Initialise connection
          // INITILAISE CONNECTION
        } else {
          callback(err, null);
        }
      }
    );
  }

  // FUNCTION: Initiate a connection to a microservice
  initConnectionToService(name, port, callback) {
    // Initiate micro service connection
    return this.initiateMicroServerConnection(port, function(connection) {
      // Show Status
      if (connection.hasOwnProperty('error')) {
        console.log('ERROR: Unable To Connect To Micro Server. Retrying...');
        // Set status
        this.serverInfo[name].Status = false;
        // Retry
        return initConnectionToService(name, callback);
      } else {
        console.log(
          'NOTICE: Connected To Micro Server. Ready For Client Connections!'
        );
        // Set status
        this.serverInfo[name].Status = true;
        // Store Socket Object
        this.serverInfo[name].Socket = connection;
        // Callback
        return callback(null, conn);
      }
    });
  }

  // FUNCTION : Handles Error(s) In Communication/Messages
  processComError(data, message, id) {
    // Get Parameters
    const scopeData = data;
    const scopeConId = id;
    const scopeMessage = message;
    // Check Empty Data
    if (!scopeData) {
      // Create Response Object
      const responseObject = new ResponseBodyObject();
      // Build Response Object [Status - Transport]
      responseObject.Status.Transport = {
        Code: 2001,
        Message: 'No Data Recieved',
      };
      // Build Response Object [Status - Transport]
      responseObject.Status.Command = {
        Code: 200,
        Message: 'Command Not Executed - Transport Failiure / No Data Recieved',
      };
      // Build Response Object [ResBody - Error Details]
      responseObject.ResultBody.ErrData = {
        Entity: 'Main eXChange Server',
        Action: 'Message Error Handling',
        EType: 'ERROR',
        OriginalData: scopeData,
      };
      // Notification
      console.log('ERROR: No Data Recieved. MORE INFO: ' + responseObject);
      // Send Response
      return scopeMessage.reply(responseObject);
    }
    // Return
    return void 0;
  }

  // FUNCTION: Communicate With MicroServer
  microServerCommunication(recData, foreignSocket, localSocket) {
    // Check Socket Readiness...
    return localSocket.Status == 0
      ? 20
      : localSocket.Socket.request('MICRO_COM_REQUEST', recData, res => {
          // Send Micro Service Response To Source
          foreignSocket.reply(res);
          // Close Socket If Keep Alive Not Set
          recData.MSGKeepAlive === false && foreignSocket.conn.destroy();
          // Return
          return 10;
        });
  }

  // Check connection
  checkConnection(recData, foreignSock, localSock, conId, conAttempts) {
    // Perform Action
    const returnResult = this.microServerCommunication(
      recData,
      foreignSock,
      localSock
    );
    // Check Connection, Execute Or Timeout...
    if (returnResult == 20) {
      if (conAttempts > this.settings.microServiceConnectionAttempts) {
        // Notification
        console.log(
          'ERROR: Micro Server Connection Initiation Attempts - Maximum Reached'
        );
        // Create Response Object
        const responseObject = new ResponseBodyObject();
        // Build Response Object [Status - Transport]
        responseObject.Status.Transport = {
          Code: 2002,
          Message:
            'Micro Server Connection Initiation Attempts - Maximum Reached',
        };
        // Build Response Object [Status - Transport]
        responseObject.Status.Command = {
          Code: 201,
          Message: 'Command Not Executed - Transport Failiure',
        };
        // Build Response Object [ResBody - Error Details]
        responseObject.ResultBody.ErrData = {
          Entity: 'Main eXChange Server',
          Action: 'Micro Server Redirection',
          EType: 'ERROR',
          OriginalData: scopeData,
        };
        // Send Response Back To Source
        foreignSock.reply(responseObject);
        // Close Socket
        return foreignSock.conn.destroy();
      } else {
        // Increment Connection Attempts
        conAttempts++;
        // Wait & Try Again...
        setTimeout(function() {
          return this.checkConnection(recData, foreignSock, localSock, conId);
        }, 10);
      }
    } else {
      // Console log
      return console.log(
        '[' + conId + '] Local Socket Connection Handed Over Successfully!'
      );
    }
  }

  // FUNCTION : Process Communication Request
  processComRequest(data, message, id) {
    // Micro Server Connection Attempt Count...
    var conAttempts = 0;
    // Get Parameters
    const scopeData = data;
    const scopeConId = id;
    const scopeMessage = message;
    // Process Request [Redirection]
    if (this.serverInfo.hasOwnProperty(scopeData.MSGDest)) {
      // Get server data
      const serverData = this.serverInfo[scopeData.MSGDest];
      // Check Connection & Send Data
      this.checkConnection(
        scopeData,
        scopeMessage,
        serverData,
        scopeConId,
        conAttempts
      );
    } else {
      // Notification
      console.log(
        'ERROR: Request Recieved But Destination Unknown. MORE INFO: ' +
          scopeData.MSGDest
      );
      // Create Response Object
      var responseObject = new ResponseBodyObject();
      // Build Response Object [Status - Transport]
      responseObject.Status.Transport = {
        Code: 2005,
        Message: 'Request Recieved But Destination Unknown',
      };
      // Build Response Object [Status - Transport]
      responseObject.Status.Command = {
        Code: 201,
        Message: 'Command Not Executed - Transport Failiure',
      };
      // Build Response Object [ResBody - Error Details]
      responseObject.ResultBody.ErrData = {
        Entity: 'Main eXChange Server',
        Action: 'Micro Server Redirection',
        EType: 'ERROR',
        OriginalData: scopeData,
      };
      // Reply
      scopeMessage.reply(responseObject);
      // Close Socket
      return scopeMessage.conn.destroy();
    }
  }
}

// EXPORTS
module.exports = MicroServiceFramework;
