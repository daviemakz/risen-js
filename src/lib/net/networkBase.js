'use strict';

/* eslint-disable */

let networkBase;

export const getHostByAddress = (address) => {
  if (typeof address === 'number') {
    return null;
  }
  if (typeof address === 'string') {
    return address.split(':')[0];
  }
  return void 0;
};

export const getPortByAddress = (address) => {
  if (typeof address === 'number') {
    return address;
  }
  if (typeof address === 'string') {
    return address.split(':')[1];
  }
  return void 0;
};

export const getAddressFormatted = (host, port) => {
  if (host !== null) {
    return `${host}:${port}`;
  } else {
    return `localhost:${port}`;
  }
};

networkBase = (function () {
  function networkBase() {
    this.savedBuffer = '';
  }
  networkBase.prototype.getHostByAddress = getHostByAddress;
  networkBase.prototype.getPortByAddress = getPortByAddress;
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

export default networkBase;
