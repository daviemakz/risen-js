'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHostByAddress = getHostByAddress;
exports.getPortByAddress = getPortByAddress;
exports.getAddressFormatted = getAddressFormatted;
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getHostByAddress(address) {
  if (typeof address === 'number') {
    return null;
  }

  if (typeof address === 'string') {
    return address.split(':')[0];
  }

  return void 0;
}

function getPortByAddress(address) {
  if (typeof address === 'number') {
    return address;
  }

  if (typeof address === 'string') {
    return address.split(':')[1];
  }

  return void 0;
}

function getAddressFormatted(host, port) {
  if (host !== null) {
    return "".concat(host, ":").concat(port);
  }

  return "".concat(port);
}

function prepareJsonToSend(json) {
  return "".concat(JSON.stringify(json), "\0");
}

function tokenizeData(data) {
  this.savedBuffer += data;
  var tokens = this.savedBuffer.split('\0');

  if (tokens.pop()) {
    return [];
  }

  this.savedBuffer = '';
  return tokens;
}

var NetworkBase = function NetworkBase() {
  _classCallCheck(this, NetworkBase);

  this.savedBuffer = '';
  this.getHostByAddress = getHostByAddress.bind(this);
  this.getPortByAddress = getPortByAddress.bind(this);
  this.prepareJsonToSend = prepareJsonToSend.bind(this);
  this.tokenizeData = tokenizeData.bind(this);
};

var _default = NetworkBase;
exports["default"] = _default;