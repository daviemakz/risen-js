'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createListener = createListener;
exports.createSpeaker = createSpeaker;
exports.createSpeakerReconnector = createSpeakerReconnector;

var _listener = _interopRequireDefault(require('./listener'));

var _speaker = _interopRequireDefault(require('./speaker'));

var _speakerReconnector = _interopRequireDefault(
  require('./speakerReconnector')
);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function createListener(address) {
  return new _listener['default'](address);
}

function createSpeaker() {
  for (
    var _len = arguments.length, rest = new Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    rest[_key] = arguments[_key];
  }

  var addresses = rest.length >= 1 ? [].slice.call(rest, 0) : [];
  return new _speaker['default'](addresses);
}

function createSpeakerReconnector() {
  for (
    var _len2 = arguments.length, rest = new Array(_len2), _key2 = 0;
    _key2 < _len2;
    _key2++
  ) {
    rest[_key2] = arguments[_key2];
  }

  var addresses = rest.length >= 1 ? [].slice.call(rest, 0) : [];
  return new _speakerReconnector['default'](addresses);
}
