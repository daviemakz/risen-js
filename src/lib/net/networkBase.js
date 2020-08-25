'use strict';

/* eslint-disable */

// Declare variables
let networkBase;

// Messenger base
networkBase = (function () {
  function networkBase() {
    this.savedBuffer = '';
  }
  networkBase.prototype.getHostByAddress = (address) => {
    if (typeof address === 'number') {
      return null;
    }
    if (typeof address === 'string') {
      return address.split(':')[0];
    }
    return void 0;
  };
  networkBase.prototype.getPortByAddress = (address) => {
    if (typeof address === 'number') {
      return address;
    }
    if (typeof address === 'string') {
      return address.split(':')[1];
    }
    return void 0;
  };
  networkBase.prototype.prepareJsonToSend = (json) =>
    `${JSON.stringify(json)}\0`;

  networkBase.prototype.tokenizeData = function (data) {
    let tokens;
    this.savedBuffer += data;
    tokens = this.savedBuffer.split('\0');
    if (tokens.pop()) {
      return [];
    }
    this.savedBuffer = '';
    return tokens;
  };
  return networkBase;
})();

// EXPORTS
export default networkBase;
