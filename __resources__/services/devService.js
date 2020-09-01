'use strict';

module.exports = {
  getStandardResponse(clientSocket) {
    return clientSocket.reply('Service to service communication verified!');
  },
  getInterServiceResponse(clientSocket) {
    return clientSocket.reply('Service to service communication verified!');
  }
};
