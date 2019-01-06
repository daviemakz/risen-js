'use strict';

// Load NPM modules
const { cloneDeep } = require('lodash');

// Declare variables
let networkBase;

// FUNCTION: Messenger base
networkBase = (function() {
  function networkBase() {
    this.savedBuffer = '';
  }
  networkBase.prototype.getHostByAddress = address => {
    if (typeof address === 'number') {
      return null;
    }
    if (typeof address === 'string') {
      return address.split(':')[0];
    }
  };
  networkBase.prototype.getPortByAddress = address => {
    if (typeof address === 'number') {
      return address;
    }
    if (typeof address === 'string') {
      return address.split(':')[1];
    }
  };
  networkBase.prototype.prepareJsonToSend = json => `${JSON.stringify(json)}\0`;

  networkBase.prototype.tokenizeData = function(data) {
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
module.exports = networkBase;
