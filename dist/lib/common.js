'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = void 0;

var _net = require('./net');

var _response = _interopRequireDefault(require('./template/response'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var logTypes = ['log', 'error', 'warn'];

var ServiceCommon = (function () {
  function ServiceCommon() {
    var _this = this;

    _classCallCheck(this, ServiceCommon);

    [
      'log',
      'sendRequest',
      'destroyConnection',
      'executeInitialFunctions'
    ].forEach(function (func) {
      _this[func] = _this[func].bind(_this);
    });
    return this;
  }

  _createClass(ServiceCommon, [
    {
      key: 'log',
      value: function log(message, type) {
        var override =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : false;

        if (typeof this.writeToLogFile === 'function') {
          this.writeToLogFile(message);
        }

        if ((this.settings.verbose || override) && logTypes.includes(type)) {
          console[type](message);
        }
      }
    },
    {
      key: 'executeInitialFunctions',
      value: function executeInitialFunctions(opsProp) {
        var _this2 = this;

        var container =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : 'options';
        return new Promise(function (resolve, reject) {
          try {
            _this2[container].runOnStart
              .filter(function (func) {
                if (typeof func === 'function') {
                  return true;
                }

                _this2.log(
                  'This not a valid function: '.concat(
                    func || 'undefined or empty string'
                  ),
                  'warn'
                );

                return false;
              })
              .forEach(function (func) {
                return Object.prototype.hasOwnProperty.call(
                  _this2[opsProp],
                  func
                )
                  ? _this2[opsProp][func]()
                  : reject(
                      Error(
                        'The function '.concat(
                          func,
                          ' has not been defined in this service!'
                        )
                      )
                    );
              });

            return resolve();
          } catch (e) {
            return reject(Error(e));
          }
        });
      }
    },
    {
      key: 'sendRequest',
      value: function sendRequest(data, destination, keepAlive) {
        var _this3 = this;

        var options =
          arguments.length > 3 && arguments[3] !== undefined
            ? arguments[3]
            : {
                port: this.settings.apiGatewayPort,
                connectionId: this.conId
              };
        var socket =
          arguments.length > 4 && arguments[4] !== undefined
            ? arguments[4]
            : void 0;
        var callback = arguments.length > 5 ? arguments[5] : undefined;
        var connectionAttempts = 0;
        var portEmitter = socket || (0, _net.createSpeaker)(options.port);
        var resBody = {
          data: data,
          destination: destination,
          callback: callback,
          keepAlive: keepAlive
        };

        var sendToSocket = function sendToSocket() {
          if (Object.values(portEmitter.sockets).length === 0) {
            if (connectionAttempts <= _this3.settings.connectionTimeout) {
              _this3.log(
                'Service core socket has not yet initialized...',
                'log'
              );

              return setTimeout(function () {
                sendToSocket();
                connectionAttempts += 1;
                return void 0;
              }, 1);
            }

            _this3.log(
              'Unable to connect to service core. MORE INFO: '.concat(
                resBody.destination
              ),
              'log'
            );

            var responseObject = new _response['default']();
            responseObject.status.transport = {
              code: 5003,
              message: 'Unable to connect to service core.'
            };
            responseObject.status.command = {
              code: 500,
              message: 'Command not executed, tansport failure!'
            };
            responseObject.resultBody.errData = {
              entity: 'Client request',
              action: 'Connect to service core',
              errorType: 'ERROR',
              originalData: resBody
            };

            _this3.log('Socket initialization timeout...', 'log');

            if (typeof resBody.callback === 'function') {
              return resBody.callback(responseObject, resBody, portEmitter);
            }

            return void 0;
          }

          _this3.log('Socket initialized. sending data...', 'log');

          return portEmitter.request('COM_REQUEST', resBody, function (
            requestData
          ) {
            if (Object.prototype.hasOwnProperty.call(requestData, 'error')) {
              _this3.log(
                'Unable to connect to service. MORE INFO: '.concat(
                  resBody.destination
                ),
                'log'
              );

              var _responseObject = new _response['default']();

              _responseObject.status.transport = {
                code: 5004,
                message: 'Unable to connect to service: '.concat(
                  resBody.destination
                )
              };
              _responseObject.status.command = {
                code: 500,
                message: 'Command not executed, tansport failure!'
              };
              _responseObject.resultBody.errData = {
                entity: 'Client request',
                action: 'Connect to service: '.concat(resBody.destination),
                errorType: 'ERROR',
                originalData: resBody
              };

              _this3.log(
                'Unable to transmit data to: '.concat(resBody.destination),
                'log'
              );

              if (typeof resBody.callback === 'function') {
                resBody.callback(_responseObject, resBody, portEmitter);
              }
            } else {
              var serviceExists =
                Object.prototype.hasOwnProperty.call(
                  _this3.serviceInfo,
                  resBody.destination
                ) ||
                (process.env.service
                  ? false
                  : resBody.destination === 'serviceCore');

              if (serviceExists) {
                _this3.log(
                  '['
                    .concat(options.connectionId, '] ')
                    .concat(
                      process.env.service ? 'Micro service' : 'Service core',
                      ' has processed request for service: '
                    )
                    .concat(resBody.destination),
                  'log'
                );
              } else {
                _this3.log(
                  '['
                    .concat(options.connectionId, '] ')
                    .concat(
                      process.env.service ? 'Micro service' : 'Service core',
                      'Service core was unable to find the service: '
                    )
                    .concat(resBody.destination),
                  'log'
                );
              }

              if (typeof resBody.callback === 'function') {
                resBody.callback(
                  requestData,
                  resBody,
                  serviceExists ? portEmitter : void 0
                );
              }
            }
          });
        };

        return sendToSocket();
      }
    },
    {
      key: 'destroyConnection',
      value: function destroyConnection(socket, id) {
        if (Object.prototype.hasOwnProperty.call(socket, 'conn')) {
          socket.conn.destroy();
          return this.log(
            '['.concat(id, '] Connection successfully closed'),
            'log'
          );
        }

        return this.log(
          '['.concat(id, '] Connection object untouched. invalid object...'),
          'log'
        );
      }
    }
  ]);

  return ServiceCommon;
})();

var _default = ServiceCommon;
exports['default'] = _default;
