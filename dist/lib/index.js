'use strict';

var _findFreePort = _interopRequireDefault(require('find-free-port'));

var _mkdirp = _interopRequireDefault(require('mkdirp'));

var _v = _interopRequireDefault(require('uuid/v4'));

var _fs = require('fs');

var _child_process = require('child_process');

var _path = require('path');

var _response = _interopRequireDefault(require('./template/response'));

var _common = _interopRequireDefault(require('./common'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError('Invalid attempt to destructure non-iterable instance');
}

function _iterableToArrayLimit(arr, i) {
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
  return function() {
    var self = this,
      args = arguments;
    return new Promise(function(resolve, reject) {
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

function _typeof(obj) {
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

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError('Invalid attempt to spread non-iterable instance');
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === '[object Arguments]'
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
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

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
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

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

var coreName = 'serviceCore';

var ServiceCore = (function(_ServiceCommon) {
  _inherits(ServiceCore, _ServiceCommon);

  function ServiceCore(options) {
    var _this;

    _classCallCheck(this, ServiceCore);

    _this = _possibleConstructorReturn(
      this,
      _getPrototypeOf(ServiceCore).call(this, options)
    );
    process.env.name = coreName;
    return _possibleConstructorReturn(
      _this,
      [
        'addServerToTracking',
        'removeServerFromTracking',
        'initService',
        'initConnectionToService',
        'processComError',
        'microServerCommunication',
        'checkConnection',
        'processComRequest',
        'sentReplyToSocket',
        'destinationUnknown',
        'functionUnknown',
        'initiateMicroServerConnection',
        'databaseOperation'
      ].forEach(function(func) {
        return (_this[func] = _this[func].bind(
          _assertThisInitialized(_assertThisInitialized(_this))
        ));
      }) || _assertThisInitialized(_assertThisInitialized(_this))
    );
  }

  _createClass(ServiceCore, [
    {
      key: 'databaseOperation',
      value: function databaseOperation(table, method, args, callback) {
        var _this2 = this;

        return setImmediate(function() {
          try {
            var _this2$db$table;

            return _this2.db.hasOwnProperty(table)
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
        !this.inUsePorts.includes(port) && this.inUsePorts.push(port);
        process.env.exitedProcessPorts = (typeof process.env
          .exitedProcessPorts === 'string'
          ? process.env.exitedProcessPorts.split(',')
          : process.env.exitedProcessPorts
        )
          .map(function(port) {
            return parseInt(port, 10);
          })
          .filter(function(exitedPort) {
            return typeof port === 'number' && exitedPort !== port;
          });

        if (this.serviceData.hasOwnProperty(name)) {
          return (
            (this.serviceData[name] = Object.assign(
              {},
              this.serviceData[name],
              {
                socket: this.serviceData[name].socket.concat(void 0),
                port: this.serviceData[name].port.concat(port),
                processId: this.serviceData[name].processId.concat(processId),
                process: this.serviceData[name].process.concat(void 0),
                connectionCount: this.serviceData[name].connectionCount.concat(
                  0
                )
              }
            )) && true
          );
        }

        return (
          (this.serviceData[name] = {
            processId: [processId],
            socket: [void 0],
            status: false,
            error: false,
            port: [port],
            connectionCount: [0],
            process: [void 0]
          }) && true
        );
      }
    },
    {
      key: 'removeServerFromTracking',
      value: function removeServerFromTracking(name, port) {
        var socketIndex = this.serviceData[name].port.indexOf(port);
        this.inUsePorts = this.inUsePorts.filter(function(usedPort) {
          return usedPort !== port;
        });

        if (socketIndex > -1) {
          this.serviceData[name].processId.splice(socketIndex, 1);
          this.serviceData[name].socket.splice(socketIndex, 1);
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
        var processId = (0, _v.default)();

        var findAFreePort = function findAFreePort() {
          return new Promise(function(resolve) {
            return (0,
            _findFreePort.default)(_this3.settings.portRangeStart, _this3.settings.portRangeFinish, function(err, freePort) {
              return resolve(freePort);
            });
          });
        };

        var processStdio = function processStdio(name, type, data) {
          return (
            '[Child process: '
              .concat(type, '] Micro service - ')
              .concat(name, ': ')
              .concat(
                _typeof(data) === 'object'
                  ? JSON.stringify(data, null, 2)
                  : data
              ) || ''
          ).trim();
        };

        var handleOnData = function handleOnData(name, type, data) {
          var logOutput = processStdio(
            ''
              .concat(name, '/port:')
              .concat(port, '/id:')
              .concat(processId),
            type,
            data
          );

          _this3.writeToLogFile(logOutput);

          _this3.log(logOutput, 'log');
        };

        var microServiceWrapper = function microServiceWrapper() {
          return new Promise(function(resolve, reject) {
            var ensurePortFree = (function() {
              var _ref = _asyncToGenerator(
                regeneratorRuntime.mark(function _callee() {
                  return regeneratorRuntime.wrap(
                    function _callee$(_context) {
                      while (1) {
                        switch ((_context.prev = _context.next)) {
                          case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return findAFreePort();

                          case 3:
                            port = _context.sent;

                            if (!_this3.inUsePorts.includes(port)) {
                              _context.next = 6;
                              break;
                            }

                            return _context.abrupt(
                              'return',
                              setTimeout(ensurePortFree, 50)
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
                              function(error, stdout, stderr) {
                                _this3.removeServerFromTracking(name, port);

                                if (error || stderr) {
                                  _this3.serviceData[name].error = true;
                                }

                                handleOnData(
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
                    this,
                    [[0, 12]]
                  );
                })
              );

              return function ensurePortFree() {
                return _ref.apply(this, arguments);
              };
            })();

            return ensurePortFree();
          });
        };

        var assignEventHandlers = function assignEventHandlers() {
          return new Promise(function(resolve) {
            ['stdout', 'stderr'].forEach(function(event) {
              return _this3.serviceData[name].process[
                _this3.getProcessIndex(name, port)
              ][event].on('data', function(data) {
                return handleOnData(name, event, data);
              });
            });
            ['exit'].forEach(function(event) {
              return _this3.serviceData[name].process[
                _this3.getProcessIndex(name, port)
              ].on(event, restartService);
            });
            resolve();
          });
        };

        var startService = (function() {
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
                        return assignEventHandlers();

                      case 5:
                        _context2.next = 7;
                        return new Promise(function(resolve) {
                          _this3.initConnectionToService(
                            name,
                            port,
                            function() {
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
                this,
                [[0, 9]]
              );
            })
          );

          return function startService(_x) {
            return _ref2.apply(this, arguments);
          };
        })();

        var restartService = function restartService() {
          return setTimeout(function() {
            !process.env.exitedProcessPorts
              .split(',')
              .map(function(port) {
                return parseInt(port, 10);
              })
              .includes(port) && startService(callback);
          }, _this3.settings.restartTimeout);
        };

        startService(callback);
      }
    },
    {
      key: 'writeToLogFile',
      value: function writeToLogFile(contents) {
        var _this4 = this;

        return (
          this.settings.logPath &&
          (0, _mkdirp.default)(
            (0, _path.dirname)(this.settings.logPath),
            function(err) {
              if (err) {
                _this4.log(
                  'Unable to write to log file. MORE INFO: '.concat(err),
                  'warn'
                );

                return void 0;
              }

              if (!_this4.logFileStream) {
                _this4.logFileStream = (0, _fs.createWriteStream)(
                  _this4.settings.logPath,
                  {
                    flags: 'a'
                  }
                );
              }

              return _this4.logFileStream.write(contents + '\n');
            }
          )
        );
      }
    },
    {
      key: 'initiateMicroServerConnection',
      value: function initiateMicroServerConnection(port, callback) {
        var _this5 = this;

        var _connectionAttempts = 0;

        var _portSpeaker = this.invokeSpeakerPersistent(port);

        var startMicroServiceConnection = function startMicroServiceConnection() {
          if (Object.values(_portSpeaker.sockets).length === 0) {
            if (
              _connectionAttempts <=
              _this5.settings.microServiceConnectionTimeout
            ) {
              return setTimeout(function() {
                startMicroServiceConnection();
                return _connectionAttempts++;
              }, 10);
            }

            _portSpeaker.error = 'Socket initialization timeout...';
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

          return callback(_portSpeaker);
        };

        return startMicroServiceConnection();
      }
    },
    {
      key: 'initConnectionToService',
      value: function initConnectionToService(name, port, callback) {
        var _this6 = this;

        return this.initiateMicroServerConnection(port, function(socket) {
          if (socket.hasOwnProperty('error')) {
            _this6.log(
              'Unable to connect to service - '.concat(name, '. Retrying...'),
              'log'
            );

            _this6.serviceData[name].status = false;
            return setTimeout(function() {
              return _this6.initConnectionToService(name, port, callback);
            }, _this6.settings.connectionTimeout);
          }

          _this6.log('Connected to service, ready for client connections!');

          _this6.serviceData[name].status = true;
          _this6.serviceData[name].socket[
            _this6.getProcessIndex(name, port)
          ] = socket;
          return callback(true, socket);
        });
      }
    },
    {
      key: 'processComError',
      value: function processComError(data, message) {
        var _data = data;
        var _foreignSocket = message;

        if (!_data) {
          var responseObject = new _response.default();
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
            originalData: _data
          };
          this.log(
            'No data received. MORE INFO: '.concat(responseObject),
            'log'
          );
          return _foreignSocket.reply(responseObject);
        }

        return void 0;
      }
    },
    {
      key: 'microServerCommunication',
      value: function microServerCommunication(
        recData,
        foreignSocket,
        localSocket,
        conId
      ) {
        var _this7 = this;

        if (localSocket.status === 0) {
          return 'connectionNotReady';
        }

        var _this$getMicroService = this.getMicroServiceSocket(
            recData.destination,
            localSocket.socket
          ),
          _this$getMicroService2 = _slicedToArray(_this$getMicroService, 2),
          socket = _this$getMicroService2[0],
          index = _this$getMicroService2[1];

        ++this.serviceData[recData.destination].connectionCount[index];
        return socket.request('SERVICE_REQUEST', recData, function(res) {
          foreignSocket.reply(res);
          recData.keepAlive === false && foreignSocket.conn.destroy();
          recData.keepAlive === false
            ? _this7.log(
                '['.concat(conId, '] Service core has closed the connection!'),
                'log'
              )
            : _this7.log(
                '['.concat(
                  conId,
                  '] Service core has not closed this connection, this socket can be reused or manually closed via socket.conn.destroy()'
                ),
                'log'
              );
          return 'connectionReady';
        });
      }
    },
    {
      key: 'checkConnection',
      value: function checkConnection(
        recData,
        foreignSock,
        localSock,
        conId,
        _connectionAttempts
      ) {
        var _this8 = this;

        var _connectionInstance = this.microServerCommunication(
          recData,
          foreignSock,
          localSock,
          conId
        );

        var _connectionAttemptsLocal = _connectionAttempts;

        if (_connectionInstance === 'connectionNotReady') {
          if (
            _connectionAttemptsLocal >
            this.settings.microServiceConnectionAttempts
          ) {
            this.log('Service connection initiation attempts, maximum reached');
            var responseObject = new _response.default();
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
            foreignSock.reply(responseObject);
            return foreignSock.conn.destroy();
          }

          _connectionAttemptsLocal++;
          return setTimeout(function() {
            return _this8.checkConnection(
              recData,
              foreignSock,
              localSock,
              conId,
              _connectionAttemptsLocal
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
        var randomScheduling = function randomScheduling() {
          var socketIndex = Math.floor(Math.random() * socketList.length);
          return [socketList[socketIndex], socketIndex];
        };

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
            return randomScheduling();
          }

          default: {
            this.log(
              'Load balancing strategy for '.concat(
                name,
                ' is incorrect. Defaulting to "random" strategy...'
              ),
              'warn'
            );
            return randomScheduling();
          }
        }
      }
    },
    {
      key: 'sentReplyToSocket',
      value: function sentReplyToSocket(data, socket) {
        var keepAlive =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : false;
        socket.reply(data);
        return keepAlive && socket.conn.destroy();
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
        var responseObject = new _response.default();
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
        var responseObject = new _response.default();
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
      value: function processComRequest(data, message, id) {
        var _this9 = this;

        var _connectionAttempts = 0;
        var _data = data;
        var _connectionId = id;
        var _foreignSocket = message;

        switch (true) {
          case _data.destination === process.env.name: {
            return setImmediate(function() {
              return _this9.coreOperations.hasOwnProperty(_data.data.funcName)
                ? _this9.coreOperations[_data.data.funcName](
                    _foreignSocket,
                    _data.data
                  )
                : _this9.sentReplyToSocket(
                    _this9.functionUnknown(_data),
                    _foreignSocket,
                    false
                  );
            });
          }

          case this.serviceData.hasOwnProperty(_data.destination): {
            var _localSocket = this.serviceData[_data.destination];
            return this.checkConnection(
              _data,
              _foreignSocket,
              _localSocket,
              _connectionId,
              _connectionAttempts
            );
          }

          default: {
            return this.sentReplyToSocket(
              this.destinationUnknown(_data),
              _foreignSocket,
              false
            );
          }
        }
      }
    }
  ]);

  return ServiceCore;
})(_common.default);

module.exports = ServiceCore;
