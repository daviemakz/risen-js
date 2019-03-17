'use strict';

// Load NPM modules
const { ResponseBodyObject } = require('./../../../dist/index.js');

// EXPORTS
module.exports = {
  getEchoFromService: function(socket) {
    // Get Parameters
    const _socket = socket;
    // Respond To Source
    return _socket.reply('Service to service communication verified!');
  }
};
