'use strict';

import getFreePort from 'find-free-port';

// Load Templates
import ResponseBody from './template/response';

import { getHostByAddress } from './net';

// Wrap the socker and data to allow easier responses to requests
export function buildResponseFunctions(socket, command, scope) {
  // Destructure the request object
  const { data } = command;
  // Invoke template(s)
  const responseObject = new ResponseBody();
  // When the command is successful
  const sendSuccess = ({ result = null, code, message }) => {
    const { source, conId } = command.data;
    const { name, address, instanceId } = source;
    // Set response object to successfully
    responseObject.success({ data: result, code, message });
    // Show status message
    this.log(
      `[${conId}] Service successfully processed command (${
        data.functionName
      }) from ${
        instanceId === null
          ? `${name}/${this.settings.address}` // Service core
          : `${name}/${address}/id:${instanceId}` // Micro service
      }`,
      'log'
    );
    // Respond To Source
    return socket && socket.reply(responseObject);
  };
  // When the command is NOT successful
  const sendError = ({ result = null, code, message }) => {
    const { source, conId } = command.data;
    const { name, port, instanceId } = source;
    // Set response object to successfully
    responseObject.error({ data: result, code, message });
    // Show status message
    this.log(
      `[${conId}] Service failed to process the command (${
        data.functionName
      }) from ${
        instanceId === null
          ? `${name}/address:${this.settings.address}` // Service core
          : `${name}/port:${port}/id:${instanceId}` // Micro service
      }`,
      'log'
    );
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
}

// Parse the address, depending on what it is
export const parseAddress = (address) => {
  return address;
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

export const handleReplyToSocket = (
  data,
  socket
  // keepAlive = false
) => {
  // Reply
  socket.reply(data);
  // Close Socket
  // return keepAlive && socket.conn.destroy();
};

export const handleOnData = (self, port, instanceId) => (name, type, data) => {
  const { address } = self.settings;
  // Ensure the address is qualified
  const host = getHostByAddress(address);
  const resolvedAddress = host !== null ? `${host}:${port}` : port;
  // Build text
  const logOutput = processStdio(
    `${name}/${resolvedAddress}/instanceId:${instanceId}`,
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
