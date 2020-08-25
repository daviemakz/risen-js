'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.randomScheduling = exports.handleOnData = exports.handleReplyToSocket = exports.processStdio = exports.findAFreePort = void 0;

var _findFreePort = _interopRequireDefault(require('find-free-port'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _typeof(obj) {
  '@babel/helpers - typeof';
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };
  }
  return _typeof(obj);
}

var findAFreePort = function findAFreePort(self) {
  return new Promise(function (resolve) {
    return (0,
    _findFreePort[
      'default'
    ])(self.settings.portRangeStart, self.settings.portRangeFinish, function (err, freePort) {
      return resolve(freePort);
    });
  });
};

exports.findAFreePort = findAFreePort;

var processStdio = function processStdio(name, type, data) {
  return (
    '[Child process: '
      .concat(type, '] Micro service - ')
      .concat(name, ': ')
      .concat(
        _typeof(data) === 'object' ? JSON.stringify(data, null, 2) : data
      ) || ''
  ).trim();
};

exports.processStdio = processStdio;

var handleReplyToSocket = function handleReplyToSocket(data, socket) {
  var keepAlive =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  socket.reply(data);
  return keepAlive && socket.conn.destroy();
};

exports.handleReplyToSocket = handleReplyToSocket;

var handleOnData = function handleOnData(self, port, processId) {
  return function (name, type, data) {
    var logOutput = processStdio(
      ''.concat(name, '/port:').concat(port, '/id:').concat(processId),
      type,
      data
    );
    self.writeToLogFile(logOutput);
    self.log(logOutput, 'log');
  };
};

exports.handleOnData = handleOnData;

var randomScheduling = function randomScheduling(socketList) {
  var socketIndex = Math.floor(Math.random() * socketList.length);
  return [socketList[socketIndex], socketIndex];
};

exports.randomScheduling = randomScheduling;
