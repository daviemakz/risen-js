'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = void 0;

var _mkdirp = _interopRequireDefault(require('mkdirp'));

var _uuid = require('uuid');

var _fs = require('fs');

var _child_process = require('child_process');

var _path = require('path');

var _response = _interopRequireDefault(require('./template/response'));

var _net = require('./net');

var _util = require('./util');

var _common = _interopRequireDefault(require('./common'));

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

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError(
    'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
  );
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === 'undefined' || !(Symbol.iterator in Object(arr)))
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      _next(undefined);
    });
  };
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        );
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) ||
    _iterableToArray(arr) ||
    _unsupportedIterableToArray(arr) ||
    _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError(
    'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === 'Object' && o.constructor) n = o.constructor.name;
  if (n === 'Map' || n === 'Set') return Array.from(o);
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter))
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
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

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function');
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === 'function') return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

var coreName = 'serviceCore';

var ServiceCore = (function (_ServiceCommon) {
  _inherits(ServiceCore, _ServiceCommon);

  var _super = _createSuper(ServiceCore);

  function ServiceCore(options) {
    var _this;

    _classCallCheck(this, ServiceCore);

    _this = _super.call(this, options);
    process.env.name = coreName;
    [
      'addServerToTracking',
      'removeServerFromTracking',
      'initService',
      'initConnectionToService',
      'processComError',
      'microServerCommunication',
      'checkConnection',
      'processComRequest',
      'destinationUnknown',
      'functionUnknown',
      'initiateMicroServerConnection',
      'databaseOperation'
    ].forEach(function (func) {
      _this[func] = _this[func].bind(_assertThisInitialized(_this));
    });
    return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
  }

  _createClass(ServiceCore, [
    {
      key: 'databaseOperation',
      value: function databaseOperation(table, method, args, callback) {
        var _this2 = this;

        return setImmediate(function () {
          try {
            var _this2$db$table;

            return Object.prototype.hasOwnProperty.call(_this2.db, table)
              ? callback(
                  true,
                  (_this2$db$table = _this2.db[table])[method].apply(
                    _this2$db$table,
                    _toConsumableArray(args)
                  ),
                  null
                )
              : callback(
                  false,
                  void 0,
                  new Error('The table '.concat(table, ' does not exist!'))
                );
          } catch (e) {
            return callback(false, void 0, e);
          }
        });
      }
    },
    {
      key: 'getProcessIndex',
      value: function getProcessIndex(name, port) {
        return this.serviceData[name].port.indexOf(port);
      }
    },
    {
      key: 'addServerToTracking',
      value: function addServerToTracking(name, port, processId) {
        if (!this.inUsePorts.includes(port)) {
          this.inUsePorts.push(port);
        }

        process.env.exitedProcessPorts = (typeof process.env
          .exitedProcessPorts === 'string'
          ? process.env.exitedProcessPorts.split(',')
          : process.env.exitedProcessPorts
        )
          .map(function (port) {
            return parseInt(port, 10);
          })
          .filter(function (exitedPort) {
            return typeof port === 'number' && exitedPort !== port;
          });

        if (Object.prototype.hasOwnProperty.call(this.serviceData, name)) {
          this.serviceData[name] = _objectSpread(
            _objectSpread({}, this.serviceData[name]),
            {},
            {
              socketList: this.serviceData[name].socketList.concat(void 0),
              port: this.serviceData[name].port.concat(port),
              processId: this.serviceData[name].processId.concat(processId),
              process: this.serviceData[name].process.concat(void 0),
              connectionCount: this.serviceData[name].connectionCount.concat(0)
            }
          );
          return true;
        }

        this.serviceData[name] = {
          processId: [processId],
          socketList: [void 0],
          status: false,
          error: false,
          port: [port],
          connectionCount: [0],
          process: [void 0]
        };
        return true;
      }
    },
    {
      key: 'removeServerFromTracking',
      value: function removeServerFromTracking(name, port) {
        var socketIndex = this.serviceData[name].port.indexOf(port);
        this.inUsePorts = this.inUsePorts.filter(function (usedPort) {
          return usedPort !== port;
        });

        if (socketIndex > -1) {
          this.serviceData[name].processId.splice(socketIndex, 1);
          this.serviceData[name].socketList.splice(socketIndex, 1);
          this.serviceData[name].port.splice(socketIndex, 1);
          this.serviceData[name].process.splice(socketIndex, 1);
          this.serviceData[name].connectionCount.splice(socketIndex, 1);
        }

        return void 0;
      }
    },
    {
      key: 'initService',
      value: function initService(name, callback) {
        var _this3 = this;

        var port = void 0;
        var processId = (0, _uuid.v4)();

        var microServiceWrapper = function microServiceWrapper() {
          return new Promise(function (resolve, reject) {
            var initialiseOnFreePort = (function () {
              var _ref = _asyncToGenerator(
                regeneratorRuntime.mark(function _callee() {
                  return regeneratorRuntime.wrap(
                    function _callee$(_context) {
                      while (1) {
                        switch ((_context.prev = _context.next)) {
                          case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return (0, _util.findAFreePort)(_this3);

                          case 3:
                            port = _context.sent;

                            if (!_this3.inUsePorts.includes(port)) {
                              _context.next = 6;
                              break;
                            }

                            return _context.abrupt(
                              'return',
                              setTimeout(initialiseOnFreePort, 50)
                            );

                          case 6:
                            _this3.addServerToTracking(name, port, processId);

                            _this3.serviceData[name].error = false;
                            _this3.serviceData[name].process[
                              _this3.getProcessIndex(name, port)
                            ] = (0, _child_process.exec)(
                              ''
                                .concat(process.execPath, ' ')
                                .concat(__dirname, '/server/index.js'),
                              {
                                maxBuffer: 1024 * _this3.settings.maxBuffer,
                                env: {
                                  parentPid: process.pid,
                                  verbose: process.env.verbose,
                                  name: name,
                                  processId: processId,
                                  port: port,
                                  service: true,
                                  operations: _this3.serviceInfo[name],
                                  settings: JSON.stringify(_this3.settings),
                                  options: JSON.stringify(
                                    _this3.serviceOptions[name]
                                  ),
                                  serviceInfo: JSON.stringify(
                                    _this3.serviceInfo
                                  )
                                }
                              },
                              function (error, stdout, stderr) {
                                _this3.removeServerFromTracking(name, port);

                                if (error || stderr) {
                                  _this3.serviceData[name].error = true;
                                }

                                (0, _util.handleOnData)(
                                  _this3,
                                  port,
                                  processId
                                )(
                                  name,
                                  'event',
                                  'Micro service - '.concat(
                                    name,
                                    ': Process has exited!'
                                  )
                                );
                              }
                            );
                            return _context.abrupt(
                              'return',
                              resolve(callback(true))
                            );

                          case 12:
                            _context.prev = 12;
                            _context.t0 = _context['catch'](0);
                            return _context.abrupt(
                              'return',
                              reject(Error(_context.t0))
                            );

                          case 15:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    },
                    _callee,
                    null,
                    [[0, 12]]
                  );
                })
              );

              return function initialiseOnFreePort() {
                return _ref.apply(this, arguments);
              };
            })();

            return initialiseOnFreePort();
          });
        };

        var startService = (function () {
          var _ref2 = _asyncToGenerator(
            regeneratorRuntime.mark(function _callee2(callback) {
              return regeneratorRuntime.wrap(
                function _callee2$(_context2) {
                  while (1) {
                    switch ((_context2.prev = _context2.next)) {
                      case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return microServiceWrapper();

                      case 3:
                        _context2.next = 5;
                        return new Promise(function (resolve) {
                          ['stdout', 'stderr'].forEach(function (event) {
                            return _this3.serviceData[name].process[
                              _this3.getProcessIndex(name, port)
                            ][event].on('data', function (data) {
                              return (0, _util.handleOnData)(
                                _this3,
                                port,
                                processId
                              )(name, event, data);
                            });
                          });
                          ['exit'].forEach(function (event) {
                            return _this3.serviceData[name].process[
                              _this3.getProcessIndex(name, port)
                            ].on(event, function () {
                              setTimeout(function () {
                                if (
                                  !process.env.exitedProcessPorts
                                    .split(',')
                                    .map(function (port) {
                                      return parseInt(port, 10);
                                    })
                                    .includes(port)
                                ) {
                                  startService(callback);
                                }
                              }, _this3.settings.restartTimeout);
                            });
                          });
                          resolve();
                        });

                      case 5:
                        _context2.next = 7;
                        return new Promise(function (resolve) {
                          _this3.initConnectionToService(
                            name,
                            port,
                            function () {
                              callback.apply(void 0, arguments);
                              resolve();
                            }
                          );
                        });

                      case 7:
                        _context2.next = 12;
                        break;

                      case 9:
                        _context2.prev = 9;
                        _context2.t0 = _context2['catch'](0);
                        throw new Error(_context2.t0);

                      case 12:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                },
                _callee2,
                null,
                [[0, 9]]
              );
            })
          );

          return function startService(_x) {
            return _ref2.apply(this, arguments);
          };
        })();

        startService(callback);
      }
    },
    {
      key: 'writeToLogFile',
      value: function writeToLogFile(contents) {
        var _this4 = this;

        if (this.settings.logPath) {
          return (0, _mkdirp['default'])(
            (0, _path.dirname)(this.settings.logPath)
          )
            .then(function () {
              if (!_this4.logFileStream) {
                _this4.logFileStream = (0, _fs.createWriteStream)(
                  _this4.settings.logPath,
                  {
                    flags: 'a'
                  }
                );
              }

              return _this4.logFileStream.write(''.concat(contents, '\n'));
            })
            ['catch'](function (error) {
              if (error) {
                _this4.log(
                  'Unable to write to log file. MORE INFO: '.concat(error),
                  'warn'
                );
              }
            });
        }

        return void 0;
      }
    },
    {
      key: 'initiateMicroServerConnection',
      value: function initiateMicroServerConnection(port, callback) {
        var _this5 = this;

        var connectionAttempts = 0;
        var microServiceConnectionTimeout = this.settings
          .microServiceConnectionTimeout;
        var portEmitter = (0, _net.createSpeakerReconnector)(port);

        var startMicroServiceConnection = function startMicroServiceConnection() {
          if (Object.values(portEmitter.sockets).length === 0) {
            if (connectionAttempts <= microServiceConnectionTimeout) {
              return setTimeout(function () {
                startMicroServiceConnection();
                connectionAttempts += 1;
              }, 10);
            }

            portEmitter.error = 'Socket initialization timeout...';
            return _this5.log(
              'Socket initialization timeout. PORT: '.concat(port),
              'log'
            );
          }

          _this5.log(
            'Service core successfully initialized socket on port: '.concat(
              port
            ),
            'log'
          );

          return callback(portEmitter);
        };

        return startMicroServiceConnection();
      }
    },
    {
      key: 'initConnectionToService',
      value: function initConnectionToService(name, port, callback) {
        var _this6 = this;

        return this.initiateMicroServerConnection(port, function (socket) {
          if (Object.prototype.hasOwnProperty.call(socket, 'error')) {
            _this6.log(
              'Unable to connect to service - '.concat(name, '. Retrying...'),
              'log'
            );

            _this6.serviceData[name].status = false;
            return setTimeout(function () {
              return _this6.initConnectionToService(name, port, callback);
            }, _this6.settings.connectionTimeout);
          }

          _this6.log('Connected to service, ready for client connections!');

          _this6.serviceData[name].status = true;
          _this6.serviceData[name].socketList[
            _this6.getProcessIndex(name, port)
          ] = socket;
          return callback(true, socket);
        });
      }
    },
    {
      key: 'processComError',
      value: function processComError(data, clientSocket) {
        if (!data) {
          var responseObject = new _response['default']();
          responseObject.status.transport = {
            code: 2001,
            message: 'No data recieved'
          };
          responseObject.status.command = {
            code: 200,
            message:
              'Command not executed, tansport failure  or no data recieved!'
          };
          responseObject.resultBody.errData = {
            entity: 'Service core',
            action: 'Request error handling',
            errorType: 'ERROR',
            originalData: data
          };
          this.log(
            'No data received. MORE INFO: '.concat(responseObject),
            'log'
          );
          return clientSocket.reply(responseObject);
        }

        return void 0;
      }
    },
    {
      key: 'microServerCommunication',
      value: function microServerCommunication(
        recData,
        clientSocket,
        microServiceInfo,
        conId
      ) {
        var _this7 = this;

        if (microServiceInfo.status === 0) {
          return 'connectionNotReady';
        }

        var _this$getMicroService = this.getMicroServiceSocket(
            recData.destination,
            microServiceInfo.socketList
          ),
          _this$getMicroService2 = _slicedToArray(_this$getMicroService, 2),
          socket = _this$getMicroService2[0],
          index = _this$getMicroService2[1];

        this.serviceData[recData.destination].connectionCount[index] += 1;
        return socket.request('SERVICE_REQUEST', recData, function (res) {
          clientSocket.reply(res);

          if (recData.keepAlive === false) {
            clientSocket.conn.destroy();
          }

          if (recData.keepAlive === false) {
            _this7.log(
              '['.concat(conId, '] Service core has closed the connection!'),
              'log'
            );
          } else {
            _this7.log(
              '['.concat(
                conId,
                '] Service core has not closed this connection, this socket can be reused or manually closed via socket.conn.destroy()'
              ),
              'log'
            );
          }

          return 'connectionReady';
        });
      }
    },
    {
      key: 'checkConnection',
      value: function checkConnection(
        recData,
        clientSocket,
        microServiceInfo,
        conId,
        connectionAttempts
      ) {
        var _this8 = this;

        var microServerConnection = this.microServerCommunication(
          recData,
          clientSocket,
          microServiceInfo,
          conId
        );
        var intConnAttempts = connectionAttempts;

        if (microServerConnection === 'connectionNotReady') {
          if (intConnAttempts > this.settings.microServiceConnectionAttempts) {
            this.log('Service connection initiation attempts, maximum reached');
            var responseObject = new _response['default']();
            responseObject.status.transport = {
              code: 2002,
              message: 'Service connection initiation attempts, maximum reached'
            };
            responseObject.status.command = {
              code: 200,
              message: 'Command not executed, tansport failure!'
            };
            responseObject.resultBody.errData = {
              entity: 'Service core',
              action: 'Service redirection',
              errorType: 'ERROR',
              originalData: recData
            };
            clientSocket.reply(responseObject);
            return clientSocket.conn.destroy();
          }

          intConnAttempts += 1;
          return setTimeout(function () {
            return _this8.checkConnection(
              recData,
              clientSocket,
              microServiceInfo,
              conId,
              intConnAttempts
            );
          }, 10);
        }

        return this.log(
          '['.concat(
            conId,
            '] Local socket connection handed over successfully!'
          )
        );
      }
    },
    {
      key: 'getMicroServiceSocket',
      value: function getMicroServiceSocket(name, socketList) {
        switch (true) {
          case typeof this.serviceOptions[name].loadBalancing === 'function': {
            return this.serviceOptions[name].loadBalancing(socketList);
          }

          case this.serviceOptions[name].loadBalancing === 'roundRobin': {
            var socketIndex = this.serviceData[name].connectionCount.indexOf(
              Math.min.apply(
                Math,
                _toConsumableArray(this.serviceData[name].connectionCount)
              )
            );
            return [socketList[socketIndex], socketIndex];
          }

          case this.serviceOptions[name].loadBalancing === 'random': {
            return (0, _util.randomScheduling)();
          }

          default: {
            this.log(
              'Load balancing strategy for '.concat(
                name,
                ' is incorrect. Defaulting to "random" strategy...'
              ),
              'warn'
            );
            return (0, _util.randomScheduling)();
          }
        }
      }
    },
    {
      key: 'functionUnknown',
      value: function functionUnknown(data) {
        this.log(
          'Request received & destination verified but function unknown. MORE INFO: '.concat(
            data.destination
          )
        );
        var responseObject = new _response['default']();
        responseObject.status.transport = {
          code: 2007,
          message:
            'Request received & destination verified but function unknown!'
        };
        responseObject.status.command = {
          code: 203,
          message: 'Command not executed, function unknown!'
        };
        responseObject.resultBody.errData = {
          entity: 'Service core',
          action: 'Service redirection',
          errorType: 'ERROR',
          originalData: data
        };
        return responseObject;
      }
    },
    {
      key: 'destinationUnknown',
      value: function destinationUnknown(data) {
        this.log(
          'Request received but destination unknown. MORE INFO: '.concat(
            data.destination
          )
        );
        var responseObject = new _response['default']();
        responseObject.status.transport = {
          code: 2005,
          message: 'Request recieved but destination unknown!'
        };
        responseObject.status.command = {
          code: 200,
          message: 'Command not executed, transport failure!'
        };
        responseObject.resultBody.errData = {
          entity: 'Service core',
          action: 'Service redirection',
          errorType: 'ERROR',
          originalData: data
        };
        return responseObject;
      }
    },
    {
      key: 'processComRequest',
      value: function processComRequest(data, clientSocket, connectionId) {
        var _this9 = this;

        var connectionAttempts = 0;

        switch (true) {
          case data.destination === process.env.name: {
            return setImmediate(function () {
              return Object.prototype.hasOwnProperty.call(
                _this9.coreOperations,
                data.data.funcName
              )
                ? _this9.coreOperations[data.data.funcName](
                    clientSocket,
                    data.data
                  )
                : (0, _util.handleReplyToSocket)(
                    _this9.functionUnknown(data),
                    clientSocket,
                    false
                  );
            });
          }

          case Object.prototype.hasOwnProperty.call(
            this.serviceData,
            data.destination
          ): {
            var microServiceInfo = this.serviceData[data.destination];
            return this.checkConnection(
              data,
              clientSocket,
              microServiceInfo,
              connectionId,
              connectionAttempts
            );
          }

          default: {
            return (0, _util.handleReplyToSocket)(
              this.destinationUnknown(data),
              clientSocket,
              false
            );
          }
        }
      }
    }
  ]);

  return ServiceCore;
})(_common['default']);

var _default = ServiceCore;
exports['default'] = _default;
