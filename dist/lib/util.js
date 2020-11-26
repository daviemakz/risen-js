'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildResponseFunctions = buildResponseFunctions;
exports.randomScheduling = exports.handleOnData = exports.handleReplyToSocket = exports.processStdio = exports.findAFreePort = exports.executePromisesInOrder = exports.parseAddress = void 0;

var _findFreePort = _interopRequireDefault(require("find-free-port"));

var _response = _interopRequireDefault(require("./template/response"));

var _net = require("./net");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function buildResponseFunctions(socket, command, scope) {
  var _this = this;

  var data = command.data;
  var responseObject = new _response["default"]();

  var sendSuccess = function sendSuccess(_ref) {
    var _ref$result = _ref.result,
        result = _ref$result === void 0 ? null : _ref$result,
        code = _ref.code,
        message = _ref.message;
    var _command$data = command.data,
        source = _command$data.source,
        conId = _command$data.conId;
    var name = source.name,
        address = source.address,
        instanceId = source.instanceId;
    responseObject.success({
      data: result,
      code: code,
      message: message
    });

    _this.log("[".concat(conId, "] Service successfully processed command (").concat(data.functionName, ") from ").concat(instanceId === null ? "".concat(name, "/").concat(_this.settings.address) : "".concat(name, "/").concat(address, "/id:").concat(instanceId)), 'log');

    return socket && socket.reply(responseObject);
  };

  var sendError = function sendError(_ref2) {
    var _ref2$result = _ref2.result,
        result = _ref2$result === void 0 ? null : _ref2$result,
        code = _ref2.code,
        message = _ref2.message;
    var _command$data2 = command.data,
        source = _command$data2.source,
        conId = _command$data2.conId;
    var name = source.name,
        port = source.port,
        instanceId = source.instanceId;
    responseObject.error({
      data: result,
      code: code,
      message: message
    });

    _this.log("[".concat(conId, "] Service failed to process the command (").concat(data.functionName, ") from ").concat(instanceId === null ? "".concat(name, "/address:").concat(_this.settings.address) : "".concat(name, "/port:").concat(port, "/id:").concat(instanceId)), 'log');

    return socket && socket.reply(responseObject);
  };

  return _objectSpread({
    data: data,
    command: command,
    sendSuccess: sendSuccess,
    sendError: sendError
  }, scope);
}

var parseAddress = function parseAddress(address) {
  return address;
};

exports.parseAddress = parseAddress;

var executePromisesInOrder = function executePromisesInOrder(funcs) {
  return funcs.reduce(function (promise, func) {
    return promise.then(function (result) {
      return func().then(Array.prototype.concat.bind(result));
    }, function (err) {
      throw new Error(err);
    });
  }, Promise.resolve([]));
};

exports.executePromisesInOrder = executePromisesInOrder;

var findAFreePort = function findAFreePort(self) {
  return new Promise(function (resolve) {
    return (0, _findFreePort["default"])(self.settings.portRangeStart, self.settings.portRangeFinish, function (err, freePort) {
      return resolve(freePort);
    });
  });
};

exports.findAFreePort = findAFreePort;

var processStdio = function processStdio(name, type, data) {
  return ("[Child process: ".concat(type, "] Micro service - ").concat(name, ": ").concat(_typeof(data) === 'object' ? JSON.stringify(data, null, 2) : data) || '').trim();
};

exports.processStdio = processStdio;

var handleReplyToSocket = function handleReplyToSocket(data, socket) {
  return socket.reply(data);
};

exports.handleReplyToSocket = handleReplyToSocket;

var handleOnData = function handleOnData(self, port, instanceId) {
  return function (name, type, data) {
    var address = self.settings.address;
    var host = (0, _net.getHostByAddress)(address);
    var resolvedAddress = host !== null ? "".concat(host, ":").concat(port) : port;
    var logOutput = processStdio("".concat(name, "/").concat(resolvedAddress, "/instanceId:").concat(instanceId), type, data);
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