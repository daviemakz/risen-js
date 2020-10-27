'use strict';

import getFreePort from 'find-free-port';

// Load Templates
import ResponseBody from './template/response';

// Wrap the socker and data to allow easier responses to requests
export const buildResponseFunctions = (socket, command, scope) => {
  // Destructure the request object
  const { data } = command;
  // Invoke template(s)
  const responseObject = new ResponseBody();
  // When the command is successful
  const sendSuccess = ({ result = null, code, message }) => {
    // Set response object to successfully
    responseObject.success({ data: result, code, message });
    // Respond To Source
    return socket && socket.reply(responseObject);
  };
  // When the command is NOT successful
  const sendError = ({ result = null, code, message }) => {
    // Set response object to successfully
    responseObject.error({ data: result, code, message });
    // Respond To Source
    return socket && socket.reply(responseObject);
  };
  return {
    data,
    command,
    sendSuccess,
    sendError,
    ...scope
  };
};

export const executePromisesInOrder = (funcs) =>
  funcs.reduce(
    (promise, func) =>
      promise.then(
        (result) => func().then(Array.prototype.concat.bind(result)),
        (err) => {
          throw new Error(err);
        }
      ),
    Promise.resolve([])
  );

export const findAFreePort = (self) => {
  return new Promise((resolve) =>
    getFreePort(
      self.settings.portRangeStart,
      self.settings.portRangeFinish,
      (err, freePort) => resolve(freePort)
    )
  );
};

export const processStdio = (name, type, data) => {
  return (
    `[Child process: ${type}] Micro service - ${name}: ${
      typeof data === 'object' ? JSON.stringify(data, null, 2) : data
    }` || ''
  ).trim();
};

export const handleReplyToSocket = (data, socket, keepAlive = false) => {
  // Reply
  socket.reply(data);
  // Close Socket
  return keepAlive && socket.conn.destroy();
};

export const handleOnData = (self, port, instanceId) => (name, type, data) => {
  // Build text
  const logOutput = processStdio(
    `${name}/port:${port}/id:${instanceId}`,
    type,
    data
  );
  // Write to log
  self.writeToLogFile(logOutput);
  // Show in parent console
  self.log(logOutput, 'log');
};

export const randomScheduling = (socketList) => {
  // Queuing: random
  const socketIndex = Math.floor(Math.random() * socketList.length);
  // Return
  return [socketList[socketIndex], socketIndex];
};
