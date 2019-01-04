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
        'sendRequestToGateway',
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

  // FUNCTION: Show message in log
  log(message, type) {
    return this.settings.verbose && ['log', 'error', 'warn'].includes(type) && console[type](message);
  }

  // FUNCTION : Send Data To API Server (Micro service only!)
  sendRequestToGateway(data, dest, kalive, callb) {
    // Get Variables
    let _connectionAttempts = 0;
    // Get Parameters
    const _data = data;
    const _destination = dest;
    const _keepAlive = kalive;
    const _callback = callb;
    // Invoke Network Interface
    const portSpeaker = this.invokeSpeaker(this.settings.apiGatewayPort);
    // Build message Body
    const resBody = {
      data: _data,
      destination: _destination,
      callback: _callback,
      keepAlive: _keepAlive,
    };
    // Check Socket Is Ready & Execute
    const sendDataToGateway = () => {
      // Check If Socket Initialized Then Continue...
      if (Object.values(portSpeaker.sockets).length === 0) {
        // Wait & Retry (including timeout)
        if (_connectionAttempts <= this.settings.connectionTimeout) {
          // Wait For Socket & Try Again...
          this.log('API Gateway socket has not yet initialized...', 'log');
          return setTimeout(() => {
            sendDataToGateway();
            return _connectionAttempts++;
          }, 1);
        }
        // Notification
        this.log(`Unable to connect to API Gateway. MORE INFO: ${resBody.destination}`, 'log');
        // Create Response Object
        const responseObject = new ResponseBodyObject();
        // Build Response Object [status - transport]
        responseObject.status.transport = {
          code: 2003,
          message: 'Unable To Connect To API Gateway Server',
        };
        // Build Response Object [status - transport]
        responseObject.status.command = {
          code: 200,
          message: 'Command Not Executed - transport Failiure',
        };
        // Build Response Object [resBody - Error Details]
        responseObject.resultBody.errData = {
          entity: 'Client Request',
          action: 'Connect To API Gateway Server',
          errorType: 'ERROR',
          originalData: resBody,
        };
        // Timeout
        this.log('Socket initialization timeout...', 'log');
        // Callback
        if (typeof resBody.callback === 'function') {
          resBody.callback(responseObject, resBody, portSpeaker);
        }
      } else {
        // Send Data To Destination
        this.log('Socket initialized. sending data...', 'log');
        // Com request
        portSpeaker.request('COM_REQUEST', resBody, dataR => {
          // Response Validation
          if (dataR.hasOwnProperty('error')) {
            // Notification
            this.log(`Unable to connect to service. MORE INFO: ${resBody.destination}`, 'log');
            // Create Response Object
            const responseObject = new ResponseBodyObject();
            // Build Response Object [status - transport]
            responseObject.status.transport = {
              code: 2004,
              message: `Unable To Connect To Micro Server:  ${resBody.destination}`,
            };
            // Build Response Object [status - transport]
            responseObject.status.command = {
              code: 200,
              message: 'Command Not Executed - Transport Failiure',
            };
            // Build Response Object [resBody - Error Details]
            responseObject.resultBody.errData = {
              entity: 'Client Request',
              action: `Connect To Micro Server:  ${resBody.destination}`,
              errorType: 'ERROR',
              originalData: resBody,
            };
            // Console Log
            this.log(`Unable to transmit data to:  ${resBody.destination}`, 'log');
            // Callback
            if (typeof resBody.callback === 'function') {
              resBody.callback(responseObject, resBody, portSpeaker);
            }
          } else {
            // Console Log
            this.log(`Data sent successfully & response recieved from: ${resBody.destination}`, 'log');
            // Callback
            if (typeof resBody.callback === 'function') {
              resBody.callback(dataR, resBody, portSpeaker);
            }
          }
        });
      }
    };
    // Check Connection & Start
    return sendDataToGateway();
  }

  // FUNCTION: Connect To Server & Return Object (API gateway only!)
  initiateMicroServerConnection(port, callback) {
    // Get Variables
    let _connectionAttempts = 0;
    // Invoke Network Interface
    const portSpeaker = this.invokeSpeaker(port);
    // Check Socket Is Ready & Execute
    const sendDataToGateway = () => {
      // Check If Socket Initialized Then Continue...
      if (Object.values(portSpeaker.sockets).length === 0) {
        // Wait & Retry (including timeout)
        if (_connectionAttempts <= this.settings.microServiceConnectionTimeout) {
          // Try Again...
          setTimeout(() => {
            sendDataToGateway();
            return _connectionAttempts++;
          }, 10);
        } else {
          // Return Error Object
          portSpeaker.error = 'Socket initialization timeout...';
          // Notification
          this.log(`Socket initialization timeout. PORT: ${portMicroServer}`, 'log');
        }
      } else {
        // Send Data To Destination
        this.log('Socket initialized, returning object...', 'log');
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
      sendRequestToGateway: this.sendRequestToGateway,
      checkResponse: this.checkResponse,
    };
  }
}

// EXPORTS
module.exports = MSCommon;
