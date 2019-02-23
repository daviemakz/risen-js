'use strict';

// Load NPM modules
const {
  ResponseBodyObject,
  CommandBodyObject
} = require('./../../../src/index.js');

// EXPORTS
module.exports = {
  testService: function(socket) {
    const resObject = new ResponseBodyObject();
    const cmdObject = new CommandBodyObject();
    const _socket = socket;
    resObject.status.transport.responseSource = process.env.name;
    return this.sendRequest(
      Object.assign(cmdObject, { funcName: 'testInfo', body: void 0 }),
      'superService',
      false,
      void 0,
      void 0,
      responseData => {
        resObject.resultBody.resData = responseData;
        return _socket.reply(
          "This response is coming from 'testService' process!"
        );
      }
    );
  }
};
