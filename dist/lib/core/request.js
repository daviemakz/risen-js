'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendRequest = sendRequest;
exports.requestChain = requestChain;
exports.request = request;
exports.requestOperations = void 0;

var _response = _interopRequireDefault(require("../template/response"));

var _command = _interopRequireDefault(require("../template/command"));

var _net = require("../net");

var _util = require("../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var getProcessType = function getProcessType() {
  return process.env.service === 'true' ? 'Micro service' : 'Service core';
};

var executeCallback = function executeCallback(_ref) {
  var responseData = _ref.responseData,
      resBody = _ref.resBody,
      portEmitter = _ref.portEmitter;
  return typeof resBody.callback === 'function' ? resBody.callback(responseData, resBody, portEmitter || void 0) : void 0;
};

function sendRequest(data, destination) {
  var _this = this;

  var keepAlive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
    address: this.settings.address,
    connectionId: this.conId
  };
  var socket = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : void 0;
  var callback = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : function () {
    return void 0;
  };
  var connectionAttempts = 0;
  var portEmitter = socket || (0, _net.createSocketSpeaker)(options.address);
  var resBody = {
    data: data,
    destination: destination,
    callback: callback,
    keepAlive: keepAlive
  };

  var sendToSocket = function sendToSocket() {
    if (Object.values(portEmitter.sockets).length === 0) {
      _this.log('Service core socket has not yet initialized...', 'log');

      if (connectionAttempts <= _this.settings.connectionTimeout) {
        return setTimeout(function () {
          sendToSocket();
          connectionAttempts += 1;
          return void 0;
        }, 1);
      }

      _this.log("Unable to connect to service core. MORE INFO: ".concat(resBody.destination), 'log');

      var responseObject = new _response["default"]();
      responseObject.setTransportStatus({
        code: 5003,
        message: 'Unable to connect to service core.'
      });
      responseObject.setCommandStatus({
        code: 500,
        message: 'Command not executed, transport failure!'
      });
      responseObject.setErrData({
        entity: 'Client request',
        action: 'Connect to service core',
        originalData: resBody
      });

      _this.log('Socket initialization timeout...', 'log');

      if (typeof resBody.callback === 'function') {
        return resBody.callback(responseObject, resBody, portEmitter);
      }

      return void 0;
    }

    _this.log("[".concat(options.connectionId, "] Sending data to: ").concat(resBody === null || resBody === void 0 ? void 0 : resBody.destination), 'log');

    return portEmitter.request('COM_REQUEST', resBody, function (responseData) {
      if (Object.prototype.hasOwnProperty.call(responseData, 'error')) {
        _this.log("Unable to connect to service. MORE INFO: ".concat(resBody.destination), 'log');

        var _responseObject = new _response["default"]();

        _responseObject.setTransportStatus({
          code: 5004,
          message: "Unable to connect to service: ".concat(resBody.destination)
        });

        _responseObject.setCommandStatus({
          code: 500,
          message: 'Command not executed, tansport failure!'
        });

        _responseObject.setErrData({
          entity: 'Client request',
          action: "Connect to service: ".concat(resBody.destination),
          originalData: resBody
        });

        _this.log("Unable to transmit data to: ".concat(resBody.destination), 'log');

        return executeCallback({
          responseData: responseData,
          resBody: resBody,
          portEmitter: portEmitter
        });
      }

      switch (true) {
        case _this.settings.mode === 'client':
          {
            _this.log("[".concat(options.connectionId, "] ", 'Service core (client)', " has processed request for service: ").concat(resBody.destination), 'log');

            return executeCallback({
              responseData: responseData,
              resBody: resBody,
              portEmitter: portEmitter
            });
          }

        case process.env.service === 'true':
          {
            _this.log("[".concat(options.connectionId, "] ").concat(getProcessType(), " has processed request for service: ").concat(resBody.destination), 'log');

            return executeCallback({
              responseData: responseData,
              resBody: resBody,
              portEmitter: portEmitter
            });
          }

        case process.env.service === 'false':
          {
            var serviceExists = Object.prototype.hasOwnProperty.call(_this.serviceInfo, resBody.destination) || process.env.service === 'false' && resBody.destination === 'serviceCore';

            if (serviceExists) {
              _this.log("[".concat(options.connectionId, "] ").concat(getProcessType(), " has processed request for service: ").concat(resBody.destination), 'log');
            } else {
              _this.log("[".concat(options.connectionId, "] ").concat(getProcessType(), " was unable to find the service: ").concat(resBody.destination), 'log');
            }

            return executeCallback({
              responseData: responseData,
              resBody: resBody,
              portEmitter: portEmitter
            });
          }

        default:
          {
            throw new Error('Unexpected condition, cannot handle callback for sendRequest()');
          }
      }
    });
  };

  return sendToSocket();
}

function requestChain(commandList, callback) {
  var _this2 = this;

  var socket = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this === null || this === void 0 ? void 0 : this.speakerInterface;
  var responses = [];
  var functionCommandList = commandList.map(function (_ref2) {
    var destination = _ref2.destination,
        functionName = _ref2.functionName,
        body = _ref2.body,
        address = _ref2.address,
        generateBody = _ref2.generateBody,
        generateCommand = _ref2.generateCommand;
    return function () {
      return new Promise(function (resolve, reject) {
        var resolvedBody = typeof generateBody === 'function' ? generateBody(body, responses) : body;
        var resolvedCommand = typeof generateCommand === 'function' ? generateCommand(body, responses) : {
          destination: destination,
          functionName: functionName,
          body: resolvedBody,
          address: address
        };

        try {
          _this2.request(Object.assign(resolvedCommand, {
            socket: socket,
            keepAlive: true
          }), function (response) {
            responses.push(response);
            resolve(response);
          });
        } catch (e) {
          _this2.log("An error occurred in the request chain while communicating with a micro service: ".concat(e), 'error');

          reject(e);
        }
      });
    };
  });
  return new Promise(function (resolve, reject) {
    try {
      (0, _util.executePromisesInOrder)([].concat(_toConsumableArray(functionCommandList), [function () {
        return new Promise(function (intResolve) {
          intResolve();

          if (typeof callback === 'function') {
            callback(responses);
          }

          resolve(responses);
        });
      }]));
    } catch (e) {
      _this2.log("An error occurred in the request chain: ".concat(e), 'error');

      reject(e);
    }
  });
}

function request(_ref3, callback) {
  var _this3 = this;

  var _ref3$body = _ref3.body,
      body = _ref3$body === void 0 ? null : _ref3$body,
      _ref3$destination = _ref3.destination,
      destination = _ref3$destination === void 0 ? void 0 : _ref3$destination,
      _ref3$functionName = _ref3.functionName,
      functionName = _ref3$functionName === void 0 ? '' : _ref3$functionName,
      _ref3$address = _ref3.address,
      address = _ref3$address === void 0 ? void 0 : _ref3$address,
      _ref3$keepAlive = _ref3.keepAlive,
      keepAlive = _ref3$keepAlive === void 0 ? true : _ref3$keepAlive,
      _ref3$socket = _ref3.socket,
      socket = _ref3$socket === void 0 ? this === null || this === void 0 ? void 0 : this.speakerInterface : _ref3$socket;
  return new Promise(function (resolve, reject) {
    var command = new _command["default"]();
    var connectionId = _this3.conId;
    command.setCommandSource();
    command.setConnectionId(connectionId);
    command.setDestination(destination);
    command.setFuncName(functionName);
    command.setBody(body);

    try {
      return _this3.sendRequest(command, destination, keepAlive, address ? {
        address: address,
        connectionId: connectionId
      } : void 0, socket, function (response, resBody, currentSocket) {
        var result = Object.assign(new _response["default"](), response);

        if (typeof callback === 'function') {
          callback(result.getResponse(), resBody, currentSocket);
        }

        return resolve(result.getResponse(), resBody, currentSocket);
      });
    } catch (e) {
      _this3.log("An error occurred while communicating with a micro service: ".concat(e), 'error');

      return reject(e);
    }
  });
}

var requestOperations = {
  requestChain: requestChain,
  sendRequest: sendRequest,
  request: request
};
exports.requestOperations = requestOperations;