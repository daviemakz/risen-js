'use strict';

var _net = require("./net");

var _response = _interopRequireDefault(require("./template/response"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var logTypes = ['log', 'error', 'warn'];

var ServiceCommon = function () {
  function ServiceCommon() {
    var _this = this;

    _classCallCheck(this, ServiceCommon);

    return ['log', 'invokeListener', 'invokeSpeaker', 'sendRequest', 'destroyConnection', 'executeInitialFunctions'].forEach(function (func) {
      return _this[func] = _this[func].bind(_this);
    }) || this;
  }

  _createClass(ServiceCommon, [{
    key: "invokeListener",
    value: function invokeListener(port) {
      return (0, _net.createListener)(port);
    }
  }, {
    key: "invokeSpeaker",
    value: function invokeSpeaker(port) {
      return (0, _net.createSpeaker)(port);
    }
  }, {
    key: "invokeSpeakerPersistent",
    value: function invokeSpeakerPersistent(port) {
      return (0, _net.createSpeakerReconnector)(port);
    }
  }, {
    key: "log",
    value: function log(message, type) {
      var override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      typeof this.writeToLogFile === 'function' && this.writeToLogFile(message);
      return (this.settings.verbose || override) && logTypes.includes(type) && console[type](message);
    }
  }, {
    key: "executeInitialFunctions",
    value: function executeInitialFunctions(opsProp) {
      var _this2 = this;

      var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'options';
      return new Promise(function (resolve, reject) {
        try {
          _this2[container].runOnStart.filter(function (func) {
            if (typeof func === 'function') {
              return true;
            }

            _this2.log("This not a valid function: ".concat(func || 'undefined or empty string'), 'warn');

            return false;
          }).forEach(function (func) {
            return _this2[opsProp].hasOwnProperty(func) ? _this2[opsProp][func]() : reject(Error("The function ".concat(func, " has not been defined in this service!")));
          });

          return resolve();
        } catch (e) {
          return reject(Error(e));
        }
      });
    }
  }, {
    key: "sendRequest",
    value: function sendRequest(data, dest, kalive) {
      var _this3 = this;

      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
        port: this.settings.apiGatewayPort,
        connectionId: this.conId
      };
      var socket = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : void 0;
      var callb = arguments.length > 5 ? arguments[5] : undefined;
      var _connectionAttempts = 0;
      var _data = data;
      var _destination = dest;
      var _keepAlive = kalive;
      var _callback = callb;

      var _portSpeaker = socket || this.invokeSpeaker(options.port);

      var _resBody = {
        data: _data,
        destination: _destination,
        callback: _callback,
        keepAlive: _keepAlive
      };

      var sendToSocket = function sendToSocket() {
        if (Object.values(_portSpeaker.sockets).length === 0) {
          if (_connectionAttempts <= _this3.settings.connectionTimeout) {
            _this3.log('Service core socket has not yet initialized...', 'log');

            return setTimeout(function () {
              sendToSocket();
              return _connectionAttempts++;
            }, 1);
          }

          _this3.log("Unable to connect to service core. MORE INFO: ".concat(_resBody.destination), 'log');

          var responseObject = new _response.default();
          responseObject.status.transport = {
            code: 2003,
            message: 'Unable to connect to service core'
          };
          responseObject.status.command = {
            code: 200,
            message: 'Command not executed, tansport failure!'
          };
          responseObject.resultBody.errData = {
            entity: 'Client request',
            action: 'Connect to service core',
            errorType: 'ERROR',
            originalData: _resBody
          };

          _this3.log('Socket initialization timeout...', 'log');

          if (typeof _resBody.callback === 'function') {
            return _resBody.callback(responseObject, _resBody, _portSpeaker);
          }

          return void 0;
        }

        _this3.log('Socket initialized. sending data...', 'log');

        return _portSpeaker.request('COM_REQUEST', _resBody, function (_requestData) {
          if (_requestData.hasOwnProperty('error')) {
            _this3.log("Unable to connect to service. MORE INFO: ".concat(_resBody.destination), 'log');

            var _responseObject = new _response.default();

            _responseObject.status.transport = {
              code: 2004,
              message: "Unable to connect to service: ".concat(_resBody.destination)
            };
            _responseObject.status.command = {
              code: 200,
              message: 'Command not executed, tansport failure!'
            };
            _responseObject.resultBody.errData = {
              entity: 'Client request',
              action: "Connect to service: ".concat(_resBody.destination),
              errorType: 'ERROR',
              originalData: _resBody
            };

            _this3.log("Unable to transmit data to: ".concat(_resBody.destination), 'log');

            if (typeof _resBody.callback === 'function') {
              _resBody.callback(_responseObject, _resBody, _portSpeaker);
            }
          } else {
            var serviceExists = _this3.serviceInfo.hasOwnProperty(_resBody.destination) || (process.env.service ? false : _resBody.destination === 'serviceCore');
            serviceExists ? _this3.log("[".concat(options.connectionId, "] ").concat(process.env.service ? 'Micro service' : 'Service core', " has processed request for service: ").concat(_resBody.destination), 'log') : _this3.log("[".concat(options.connectionId, "] ").concat(process.env.service ? 'Micro service' : 'Service core', "Service core was unable to find the service: ").concat(_resBody.destination), 'log');

            if (typeof _resBody.callback === 'function') {
              _resBody.callback(_requestData, _resBody, serviceExists ? _portSpeaker : void 0);
            }
          }
        });
      };

      return sendToSocket();
    }
  }, {
    key: "destroyConnection",
    value: function destroyConnection(socket, id) {
      if (socket.hasOwnProperty('conn')) {
        socket.conn.destroy();
        return this.log("[".concat(id, "] Connection successfully closed"), 'log');
      }

      return this.log("[".concat(id, "] Connection object untouched. invalid object..."), 'log');
    }
  }]);

  return ServiceCommon;
}();

module.exports = ServiceCommon;