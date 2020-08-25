'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = void 0;
var networkBase;

networkBase = (function () {
  function networkBase() {
    this.savedBuffer = '';
  }

  networkBase.prototype.getHostByAddress = function (address) {
    if (typeof address === 'number') {
      return null;
    }

    if (typeof address === 'string') {
      return address.split(':')[0];
    }

    return void 0;
  };

  networkBase.prototype.getPortByAddress = function (address) {
    if (typeof address === 'number') {
      return address;
    }

    if (typeof address === 'string') {
      return address.split(':')[1];
    }

    return void 0;
  };

  networkBase.prototype.prepareJsonToSend = function (json) {
    return ''.concat(JSON.stringify(json), '\0');
  };

  networkBase.prototype.tokenizeData = function (data) {
    var tokens;
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

var _default = networkBase;
exports['default'] = _default;
