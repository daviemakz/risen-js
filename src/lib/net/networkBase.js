'use strict';

export function getHostByAddress(address) {
  if (typeof address === 'number') {
    return null;
  }
  if (typeof address === 'string') {
    return address.split(':')[0];
  }
  return void 0;
}

export function getPortByAddress(address) {
  if (typeof address === 'number') {
    return address;
  }
  if (typeof address === 'string') {
    return address.split(':')[1];
  }
  return void 0;
}

export function getAddressFormatted(host, port) {
  if (host !== null) {
    return `${host}:${port}`;
  }
  return `${port}`;
}

function prepareJsonToSend(json) {
  return `${JSON.stringify(json)}\0`;
}

function tokenizeData(data) {
  this.savedBuffer += data;
  const tokens = this.savedBuffer.split('\0');
  if (tokens.pop()) {
    return [];
  }
  this.savedBuffer = '';
  return tokens;
}

class NetworkBase {
  constructor() {
    this.savedBuffer = '';
    this.getHostByAddress = getHostByAddress.bind(this);
    this.getPortByAddress = getPortByAddress.bind(this);
    this.prepareJsonToSend = prepareJsonToSend.bind(this);
    this.tokenizeData = tokenizeData.bind(this);
  }
}

export default NetworkBase;
