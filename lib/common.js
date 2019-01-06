'use strict';

// Load Required
const networkCore = require('./net');

// Load Templates
const ResponseBodyObject = require('./template/response');

// Declare class
class MSCommon {
  // Constructor
  constructor(options) {
    // Bind methods
    return (
      [
        'log',
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

  // FUNCTION: Port Speaker [Object Factory]
  invokeSpeakerPersistent(port) {
    return networkCore.createSpeakerReconnector(port);
  }

  // FUNCTION: Show message in log
  log(message, type) {
    return this.settings.verbose && ['log', 'error', 'warn'].includes(type) && console[type](message);
  }

  // FUNCTION : Send Data To API Server (Micro service only!)
  sendRequest(
    data,
    dest,
    kalive,
    options = { port: this.settings.apiGatewayPort, connectionId: this.conId },
    socket = void 0,
    callb
  ) {
    // Get Variables
    let _connectionAttempts = 0;
    // Get Parameters
    const _data = data;
    const _destination = dest;
    const _keepAlive = kalive;
    const _callback = callb;
    // Invoke Network Interface
    const _portSpeaker = socket || this.invokeSpeaker(options.port);
    // Build message Body
    const _resBody = {
      data: _data,
      destination: _destination,
      callback: _callback,
      keepAlive: _keepAlive,
    };
    // Check Socket Is Ready & Execute
    const sendToSocket = () => {
      // Check If Socket Initialized Then Continue...
      if (Object.values(_portSpeaker.sockets).length === 0) {
        // Wait & Retry (including timeout)
        if (_connectionAttempts <= this.settings.connectionTimeout) {
          // Wait For Socket & Try Again...
          this.log('Service core socket has not yet initialized...', 'log');
          return setTimeout(() => {
            sendToSocket();
            return _connectionAttempts++;
          }, 1);
        }
        // Notification
        this.log(`Unable to connect to Service core. MORE INFO: ${_resBody.destination}`, 'log');
        // Create Response Object
        const responseObject = new ResponseBodyObject();
        // Build Response Object [status - transport]
        responseObject.status.transport = {
          code: 2003,
          message: 'Unable to connect to service core',
        };
        // Build Response Object [status - transport]
        responseObject.status.command = {
          code: 200,
          message: 'Command not executed, tansport failure!',
        };
        // Build Response Object [_resBody - Error Details]
        responseObject.resultBody.errData = {
          entity: 'Client request',
          action: 'Connect to service core',
          errorType: 'ERROR',
          originalData: _resBody,
        };
        // Timeout
        this.log('Socket initialization timeout...', 'log');
        // Callback
        if (typeof _resBody.callback === 'function') {
          _resBody.callback(responseObject, _resBody, _portSpeaker);
        }
      } else {
        // Send Data To Destination
        this.log('Socket initialized. sending data...', 'log');
        // Com request
        _portSpeaker.request('COM_REQUEST', _resBody, _requestData => {
          // Response Validation
          if (_requestData.hasOwnProperty('error')) {
            // Notification
            this.log(`Unable to connect to service. MORE INFO: ${_resBody.destination}`, 'log');
            // Create Response Object
            const responseObject = new ResponseBodyObject();
            // Build Response Object [status - transport]
            responseObject.status.transport = {
              code: 2004,
              message: `Unable to connect to service: ${_resBody.destination}`,
            };
            // Build Response Object [status - transport]
            responseObject.status.command = {
              code: 200,
              message: 'Command not executed, tansport failure!',
            };
            // Build Response Object [_resBody - Error Details]
            responseObject.resultBody.errData = {
              entity: 'Client request',
              action: `Connect to service: ${_resBody.destination}`,
              errorType: 'ERROR',
              originalData: _resBody,
            };
            // Console Log
            this.log(`Unable to transmit data to: ${_resBody.destination}`, 'log');
            // Callback
            if (typeof _resBody.callback === 'function') {
              _resBody.callback(responseObject, _resBody, _portSpeaker);
            }
          } else {
            // Console Log
            this.log(
              `[${options.connectionId}] Service core successfully sent and recieved a response from: ${
                _resBody.destination
              }`,
              'log'
            );
            // Callback
            if (typeof _resBody.callback === 'function') {
              _resBody.callback(_requestData, _resBody, _portSpeaker);
            }
          }
        });
      }
    };
    // Check Connection & Start
    return sendToSocket();
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

  // FUNCTION : Check Response
  checkResponse(res) {
    // Variables
    const regexFail = /2\d+/;
    // Check Response Formed Well
    if (res) {
      // Get Data
      const transportCode = res.status.transport.code;
      const commandCode = res.status.command.code;
      // Check Response Body
      if (regexFail.test(transportCode)) {
        return 2;
      }
      if (regexFail.test(commandCode)) {
        return 1;
      }
      return 0;
    }
    return 3;
  }

  // FUNCTION: Force Close Connection
  destroyConnection(socket, id) {
    // Check Object & Destroy
    if (socket.hasOwnProperty('conn')) {
      socket.conn.destroy();
      return this.log(`[${id}] Connection successfully closed`, 'log');
    }
    return this.log(`[${id}] Connection object untouched. invalid object...`, 'log');
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
module.exports = MSCommon;
