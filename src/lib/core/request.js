'use strict';

// Load templates
import ResponseBody from '../template/response';
import CommandBody from '../template/command';

// Load network components
import { createSpeaker } from '../net';

// Load utils
import { executePromisesInOrder } from '../util';

const getProcessType = () => {
  return process.env.service === 'true' ? 'Micro service' : 'Service core';
};

const executeCallback = ({ responseData, resBody, portEmitter }) => {
  return typeof resBody.callback === 'function'
    ? resBody.callback(responseData, resBody, portEmitter || void 0)
    : void 0;
};

// Send data to the service core
export function sendRequest(
  data,
  destination,
  keepAlive = false,
  options = { address: this.settings.address, connectionId: this.conId },
  socket = void 0,
  callback = () => void 0
) {
  // Get Variables
  let connectionAttempts = 0;

  // Invoke Network Interface
  const portEmitter = socket || createSpeaker(options.address);

  // Build message Body
  const resBody = {
    data,
    destination,
    callback,
    keepAlive
  };

  // Check Socket Is Ready & Execute
  const sendToSocket = () => {
    // Check If Socket Initialized Then Continue...
    if (Object.values(portEmitter.sockets).length === 0) {
      // Wait & Retry (including timeout)
      if (connectionAttempts <= this.settings.connectionTimeout) {
        // Wait For Socket & Try Again...
        this.log('Service core socket has not yet initialized...', 'log');
        return setTimeout(() => {
          sendToSocket();
          connectionAttempts += 1;
          return void 0;
        }, 1);
      }
      // Notification
      this.log(
        `Unable to connect to service core. MORE INFO: ${resBody.destination}`,
        'log'
      );
      // Create Response Object
      const responseObject = new ResponseBody();
      // Build Response Object [status - transport]
      responseObject.setTransportStatus({
        code: 5003,
        message: 'Unable to connect to service core.'
      });
      // Build Response Object [status - transport]
      responseObject.setCommandStatus({
        code: 500,
        message: 'Command not executed, transport failure!'
      });
      // Build Response Object [resBody - error]
      responseObject.setErrData({
        entity: 'Client request',
        action: 'Connect to service core',
        originalData: resBody
      });
      // Timeout
      this.log('Socket initialization timeout...', 'log');
      // Callback
      if (typeof resBody.callback === 'function') {
        return resBody.callback(responseObject, resBody, portEmitter);
      }
      return void 0;
    }

    // Send Data To Destination
    this.log('Socket initialized. sending data...', 'log');

    // Com request
    return portEmitter.request('COM_REQUEST', resBody, (responseData) => {
      // Response Validation
      if (Object.prototype.hasOwnProperty.call(responseData, 'error')) {
        // Notification
        this.log(
          `Unable to connect to service. MORE INFO: ${resBody.destination}`,
          'log'
        );
        // Create Response Object
        const responseObject = new ResponseBody();
        // Build Response Object [status - transport]
        responseObject.setTransportStatus({
          code: 5004,
          message: `Unable to connect to service: ${resBody.destination}`
        });
        // Build Response Object [status - transport]
        responseObject.setCommandStatus({
          code: 500,
          message: 'Command not executed, tansport failure!'
        });
        // Build Response Object [ResBody - Error Details]
        responseObject.setErrData({
          entity: 'Client request',
          action: `Connect to service: ${resBody.destination}`,
          originalData: resBody
        });
        // Console Log
        this.log(`Unable to transmit data to: ${resBody.destination}`, 'log');

        // Callback
        return executeCallback({ responseData, resBody, portEmitter });
      }

      switch (true) {
        // Client mode
        case this.settings.mode === 'client': {
          this.log(
            `[${
              options.connectionId
            }] ${'Service core (client)'} has processed request for service: ${
              resBody.destination
            }`,
            'log'
          );
          return executeCallback({ responseData, resBody, portEmitter });
        }
        // Micro server
        case process.env.service === 'true': {
          this.log(
            `[${
              options.connectionId
            }] ${getProcessType()} has processed request for service: ${
              resBody.destination
            }`,
            'log'
          );
          return executeCallback({ responseData, resBody, portEmitter });
        }
        // Service core
        case process.env.service === 'false': {
          // Does this service exist?
          const serviceExists =
            Object.prototype.hasOwnProperty.call(
              this.serviceInfo,
              resBody.destination
            ) ||
            (process.env.service === 'false' &&
              resBody.destination === 'serviceCore');

          // Does this service exist?
          if (serviceExists) {
            this.log(
              `[${
                options.connectionId
              }] ${getProcessType()} has processed request for service: ${
                resBody.destination
              }`,
              'log'
            );
          } else {
            this.log(
              `[${
                options.connectionId
              }] ${getProcessType()} was unable to find the service: ${
                resBody.destination
              }`,
              'log'
            );
          }
          return executeCallback({ responseData, resBody, portEmitter });
        }
        default: {
          throw new Error(
            'Unexpected condition, cannot handle callback for sendRequest()'
          );
        }
      }
    });
  };

  // Check Connection & Start
  return sendToSocket();
}

// Allows you to send multiple requests to a micro server
export function requestChain(commandList, callback) {
  // To store the responses from the micro services
  const responses = [];
  let socket = void 0;

  // Map the command list object and assign parameters
  const functionCommandList = commandList.map(
    (
      {
        destination,
        functionName,
        body,
        address,
        generateBody,
        generateCommand
      },
      position,
      commandsArray
    ) => () =>
      new Promise((resolve, reject) => {
        // Is this the last element
        const isThisTheLastCommand = commandsArray.length === position + 1;

        // Allows you to generate a body
        const resolvedBody =
          typeof generateBody === 'function'
            ? generateBody(body, responses)
            : body;

        // Allows you to generate a whole command object
        const resolvedCommand =
          typeof generateCommand === 'function'
            ? generateCommand(body, responses)
            : {
                destination,
                functionName,
                body: resolvedBody,
                address
              };

        // Send message to the micro server
        try {
          this.request(
            Object.assign(resolvedCommand, {
              socket,
              ...(isThisTheLastCommand
                ? { keepAlive: false }
                : { keepAlive: true })
            }), // Reuse if the socket is defined
            (response, resBody, currentSocket) => {
              // Assign socket for reuse
              socket = currentSocket;
              // Push the result to the response array
              responses.push(response);
              // Resolve the result
              resolve(response);
            }
          );
        } catch (e) {
          this.log(
            `An error occurred in the request chain while communicating with a micro service: ${e}`,
            'error'
          );
          reject(e);
        }
      })
  );

  // Execute the promise to allow chaining
  return new Promise((resolve, reject) => {
    try {
      executePromisesInOrder([
        ...functionCommandList,
        () =>
          new Promise((intResolve) => {
            // Resolve the promise in the chain
            intResolve();
            // Execute callback if its defined
            if (typeof callback === 'function') {
              callback(responses);
            }
            // Resolve the main promise for the function
            resolve(responses);
          })
      ]);
    } catch (e) {
      this.log(`An error occurred in the request chain: ${e}`, 'error');
      reject(e);
    }
  });
}

// Allows you to send a request to a micro server
export function request(
  {
    body = null,
    destination = void 0,
    functionName = '',
    address = void 0,
    keepAlive = false,
    socket = void 0
  },
  callback
) {
  return new Promise((resolve, reject) => {
    // Initialise the command object
    const command = new CommandBody();

    const connectionId = this.conId;

    // Assign the data to the command body
    command.setDestination(destination);
    command.setFuncName(functionName);
    command.setBody(body);

    // Send the message back to the micro service
    try {
      return this.sendRequest(
        command,
        destination,
        keepAlive,
        address ? { address, connectionId } : void 0,
        socket,
        (response, resBody, currentSocket) => {
          // Add missing functions methods since we cannot serialise them
          const result = Object.assign(new ResponseBody(), response);
          // Execute callback if its defined
          if (typeof callback === 'function') {
            callback(result.getResponse(), resBody, currentSocket);
          }
          return resolve(result.getResponse(), resBody, currentSocket);
        }
      );
    } catch (e) {
      this.log(
        `An error occurred while communicating with a micro service: ${e}`,
        'error'
      );
      return reject(e);
    }
  });
}

export const requestOperations = {
  requestChain,
  sendRequest,
  request
};
