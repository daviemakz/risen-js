'use strict';

// Load Required
const networkCore = require('./net');

// Load Templates
const CommandBodyObject = require('./template/command.js');
const ResponseBodyObject = require('./template/response.js');

// Declare class
class MicroServiceCommon {
  // Constructor
  constructor(options) {
    // Declare settings
    this.commonSettings = {
      connectionTimeout: options.connectionTimeout || 1500,
      microServiceConnectionTimeout: options.connectionTimeout || 10000,
      apiGatewayPort: 8080,
    };
    // Bind methods
    return [
      'invokeListener',
      'invokeSpeaker',
      'sendRequest',
      'initiateMicroServerConnection',
      'checkResponse',
      'destroyConnection',
      'networkObjectFactory',
    ].forEach((this[func] = this[func].bind(this)));
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
    // Invoke Template(s)
    const resObject = new ResponseBodyObject();
    const comObject = new CommandBodyObject();
    // Invoke Network Interface
    const portSpeaker = invokeSpeaker(this.commonSettings.apiGatewayPort);
    // Build Message Body
    const resBody = {
      MSGData: scopeData,
      MSGDest: scopeDestination,
      MSGCallBack: scopeCallback,
      MSGKeepAlive: scopeKeepConnectionAlive,
    };
    // Check Socket Is Ready & Execute
    const sendDataToGateway = function() {
      // Check If Socket Initialized Then Continue...
      if (Object.values(portSpeaker.sockets).length === 0) {
        // Wait & Retry (including timeout)
        if (connectionAttempts <= this.commonSettings.connectionTimeout) {
          // Wait For Socket & Try Again...
          console.log(
            'NOTICE: API Gateway Server Socket Has Not Initialized Yet...'
          );
          return setTimeout(function() {
            sendDataToGateway();
            connectionAttempts++;
            return;
          }, 1);
        } else {
          // Notification
          console.log(
            'ERROR: Unable To Connect To API Gateway Server. MORE INFO: ' +
              resBody.MSGDest
          );
          // Create Response Object
          const responseObject = resObject;
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
        portSpeaker.request('COM_REQUEST', resBody, function(dataR) {
          // Response Validation
          if (dataR.hasOwnProperty('error')) {
            // Notification
            console.log(
              'ERROR: Unable To Connect To Micro Server. MORE INFO: ' +
                resBody.MSGDest
            );
            // Create Response Object
            const responseObject = resObject;
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
    // Get Parameters
    const portMicroServer = port;
    // Invoke Network Interface
    const portSpeaker = InvokeSpeakerPersistant(portMicroServer);
    // Check Socket Is Ready & Execute
    const sendDataToGateway = function() {
      // Check If Socket Initialized Then Continue...
      if (Object.values(portSpeaker.sockets).length === 0) {
        // Wait & Retry (including timeout)
        if (
          connectionAttempts <=
          this.commonSettings.microServiceConnectionTimeout
        ) {
          // Try Again...
          setTimeout(function() {
            sendDataToGateway();
            connectionAttempts++;
            return;
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
        callback(portSpeaker);
      }
    };
    // Check Connection & Start
    return sendDataToGateway();
  }

  // FUNCTION : Check Response
  checkResponse(res) {
    // Check Response Formed Well
    if (res) {
      // Get Data
      var TransportCode = res.Status.Transport.Code;
      var CommandCode = res.Status.Command.Code;
      // Code Fail Regex
      var RegexFail = /2\d+/;
      // Check Response Body
      if (RegexFail.test(TransportCode)) {
        return 2;
      } else if (RegexFail.test(CommandCode)) {
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
      console.log('[' + id + '] Connection Successfully Closed');
    } else {
      console.log('[' + id + '] Connection Object Untouched. Invalid Object');
      return;
    }
  }

  // FUNCTION: Network object factory
  networkObjectFactory() {
    return {
      sendRequest: sendRequest,
      CheckResponse: CheckResponse,
    };
  }
}

// EXPORTS
module.exports = MicroServiceCommon;
