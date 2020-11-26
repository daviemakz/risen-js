'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  createSocketListener: true,
  createSocketSpeaker: true,
  createSocketSpeakerReconnect: true
};
exports.createSocketListener = createSocketListener;
exports.createSocketSpeaker = createSocketSpeaker;
exports.createSocketSpeakerReconnect = createSocketSpeakerReconnect;

var _socketListener = _interopRequireDefault(require("./socketListener"));

var _socketSpeaker = _interopRequireDefault(require("./socketSpeaker"));

var _socketSpeakerReconnect = _interopRequireDefault(require("./socketSpeakerReconnect"));

var _networkBase = require("./networkBase");

Object.keys(_networkBase).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _networkBase[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _networkBase[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function createSocketListener(address) {
  return new _socketListener["default"](address);
}

function createSocketSpeaker() {
  for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
    rest[_key] = arguments[_key];
  }

  var addresses = rest.length >= 1 ? [].slice.call(rest, 0) : [];
  return new _socketSpeaker["default"](addresses);
}

function createSocketSpeakerReconnect() {
  for (var _len2 = arguments.length, rest = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    rest[_key2] = arguments[_key2];
  }

  var addresses = rest.length >= 1 ? [].slice.call(rest, 0) : [];
  return new _socketSpeakerReconnect["default"](addresses);
}