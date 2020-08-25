'use strict';

import getFreePort from 'find-free-port';

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

export const handleOnData = (self, port, processId) => (name, type, data) => {
  // Build text
  const logOutput = processStdio(
    `${name}/port:${port}/id:${processId}`,
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
