'use strict';

// Load NPM modules
const {
  ResponseBodyObject,
  CommandBodyObject
} = require('../../../dist/index.js');

// EXPORTS
module.exports = {
  getInfoFromSuperService(socket) {
    const resObject = new ResponseBodyObject();
    const cmdObject = new CommandBodyObject();
    resObject.status.transport.responseSource = process.env.name;
    return this.sendRequest(
      Object.assign(cmdObject, {
        funcName: 'getEchoFromService',
        body: void 0
      }),
      'echoService',
      false,
      void 0,
      void 0,
      responseData => {
        resObject.resultBody.resData = responseData;
        return socket.reply(resObject);
      }
    );
  }
};
