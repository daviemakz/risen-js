'use strict';

// Load Required
const networkCore = require('./net');

// Load Templates
const CommandBodyObject = require('./template/command.js');
const ResponseBodyObject = require('./template/response.js');

// Declare class
class MicroServiceCommon {
  // Constructor
  constructor() {
    // Bind methods
    return (
      [
        'invokeListener',
        'invokeSpeaker',
        'sendRequest',
        'initiateMicroServerConnection',
        'checkResponse',
        'destroyConnection',
        'networkObjectFactory',
      ].forEach(func => (this[func] = this[func].bind(this))) || this
    );
  }

  // FUNCTION: Port Speaker [Object Factory]
  invokeListener(port) {
    return networkCore.createListener(port);
  }

  // FUNCTION: Port Speaker [Object Factory]
  invokeSpeaker(port) {
    return networkCore.createSpeaker(port);
  }

  // FUNCTION : Send Data To XChange Server
  sendRequest(data, dest, kalive, callb) {
    // Get Variables
    var connectionAttempts = 0;
    // Get Parameters
    const scopeData = data;
    const scopeDestination = dest;
    const scopeKeepConnectionAlive = kalive;
    const scopeCallback = callb;
    // Invoke Network Interface
    const portSpeaker = this.invokeSpeaker(this.settings.apiGatewayPort);
    // Build Message Body
    const resBody = {
      MSGData: scopeData,
      MSGDest: scopeDestination,
      MSGCallBack: scopeCallback,
      MSGKeepAlive: scopeKeepConnectionAlive,
    };
    // Check Socket Is Ready & Execute
    const sendDataToGateway = () => {
      // Check If Socket Initialized Then Continue...
      if (Object.values(portSpeaker.sockets).length === 0) {
        // Wait & Retry (including timeout)
        if (connectionAttempts <= this.settings.connectionTimeout) {
          // Wait For Socket & Try Again...
          console.log(
            'NOTICE: API Gateway Server Socket Has Not Initialized Yet...'
          );
          return setTimeout(() => {
            sendDataToGateway();
            return connectionAttempts++;
          }, 1);
        } else {
          // Notification
          console.log(
            'ERROR: Unable To Connect To API Gateway Server. MORE INFO: ' +
              resBody.MSGDest
          );
          // Create Response Object
          const responseObject = new ResponseBodyObject();
          // Build Response Object [Status - Transport]
          responseObject.Status.Transport = {
            Code: 2003,
            Message: 'Unable To Connect To API Gateway Server',
          };
          // Build Response Object [Status - Transport]
          responseObject.Status.Command = {
            Code: 200,
            Message: 'Command Not Executed - Transport Failiure',
          };
          // Build Response Object [resBody - Error Details]
          responseObject.ResultBody.ErrData = {
            Entity: 'Client Request',
            Action: 'Connect To API Gateway Server',
            EType: 'ERROR',
            OriginalData: resBody,
          };
          // Timeout
          console.log('ERROR: Socket Initialization Timeout...');
          // Callback
          if (typeof resBody.MSGCallBack == 'function') {
            resBody.MSGCallBack(responseObject, resBody, portSpeaker);
            return;
          } else {
            return;
          }
        }
      } else {
        // Send Data To Destination
        console.log('NOTICE: Socket Initialized. Sending Data...');
        // Com request
        portSpeaker.request('COM_REQUEST', resBody, dataR => {
          // Response Validation
          if (dataR.hasOwnProperty('error')) {
            // Notification
            console.log(
              'ERROR: Unable To Connect To Micro Server. MORE INFO: ' +
                resBody.MSGDest
            );
            // Create Response Object
            const responseObject = new ResponseBodyObject();
            // Build Response Object [Status - Transport]
            responseObject.Status.Transport = {
              Code: 2004,
              Message: 'Unable To Connect To Micro Server: ' + resBody.MSGDest,
            };
            // Build Response Object [Status - Transport]
            responseObject.Status.Command = {
              Code: 200,
              Message: 'Command Not Executed - Transport Failiure',
            };
            // Build Response Object [resBody - Error Details]
            responseObject.ResultBody.ErrData = {
              Entity: 'Client Request',
              Action: 'Connect To Micro Server: ' + resBody.MSGDest,
              EType: 'ERROR',
              OriginalData: resBody,
            };
            // Console Log
            console.log(
              'ERROR: Unable To Transmit Data To: ' + resBody.MSGDest
            );
            // Callback
            if (typeof resBody.MSGCallBack == 'function') {
              resBody.MSGCallBack(responseObject, resBody, portSpeaker);
            }
          } else {
            // Console Log
            console.log(
              'NOTICE: Data Sent Successfully & Response Recieved From: ' +
                resBody.MSGDest
            );
            // Callback
            if (typeof resBody.MSGCallBack == 'function') {
              resBody.MSGCallBack(dataR, resBody, portSpeaker);
            }
          }
        });
      }
    };
    // Check Connection & Start
    return sendDataToGateway();
  }

  // FUNCTION: Connect To Server & Return Object
  initiateMicroServerConnection(port, callback) {
    // Get Variables
    var connectionAttempts = 0;
    // Invoke Network Interface
    const portSpeaker = this.invokeSpeaker(port);
    // Check Socket Is Ready & Execute
    const sendDataToGateway = () => {
      // Check If Socket Initialized Then Continue...
      if (Object.values(portSpeaker.sockets).length === 0) {
        // Wait & Retry (including timeout)
        if (connectionAttempts <= this.settings.microServiceConnectionTimeout) {
          // Try Again...
          setTimeout(() => {
            sendDataToGateway();
            return connectionAttempts++;
          }, 10);
        } else {
          // Return Error Object
          portSpeaker.error = 'ERROR: Socket Initialization Timeout...';
          // Notification
          console.log(
            'ERROR: Socket Initialization Timeout. PORT: ' + portMicroServer
          );
        }
      } else {
        // Send Data To Destination
        console.log('NOTICE: Socket Initialized. Returning Object...');
        // Return Object Speaker
        return callback(portSpeaker);
      }
    };
    // Check Connection & Start
    return sendDataToGateway();
  }

  // FUNCTION : Check Response
  checkResponse(res) {
    // Variables
    const regexFail = /2\d+/;
    // Check Response Formed Well
    if (res) {
      // Get Data
      const transportCode = res.Status.Transport.Code;
      const commandCode = res.Status.Command.Code;
      // Check Response Body
      if (regexFail.test(transportCode)) {
        return 2;
      } else if (regexFail.test(commandCode)) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return 3;
    }
  }

  // FUNCTION: Force Close Connection
  destroyConnection(message, id) {
    // Check Object & Destroy
    if (message.hasOwnProperty('conn')) {
      message.conn.destroy();
      return console.log('[' + id + '] Connection Successfully Closed');
    } else {
      return console.log(
        '[' + id + '] Connection Object Untouched. Invalid Object'
      );
    }
  }

  // FUNCTION: Network object factory
  networkObjectFactory() {
    return {
      sendRequest: this.sendRequest,
      checkResponse: this.checkResponse,
    };
  }
}

// EXPORTS
module.exports = MicroServiceCommon;
