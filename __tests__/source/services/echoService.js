'use strict';

// EXPORTS
module.exports = {
  getEchoFromService(socket) {
    // Respond To Source
    return socket.reply('Service to service communication verified!');
  }
};
