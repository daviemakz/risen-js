'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
Object.defineProperty(exports, 'CommandBodyObject', {
  enumerable: true,
  get: function get() {
    return _command['default'];
  }
});
Object.defineProperty(exports, 'ResponseBodyObject', {
  enumerable: true,
  get: function get() {
    return _response['default'];
  }
});
Object.defineProperty(exports, 'buildHttpOptions', {
  enumerable: true,
  get: function get() {
    return _options.buildHttpOptions;
  }
});
Object.defineProperty(exports, 'buildSecureOptions', {
  enumerable: true,
  get: function get() {
    return _options.buildSecureOptions;
  }
});
Object.defineProperty(exports, 'defaultServiceOptions', {
  enumerable: true,
  get: function get() {
    return _options.defaultServiceOptions;
  }
});
Object.defineProperty(exports, 'defaultInstanceOptions', {
  enumerable: true,
  get: function get() {
    return _options.defaultInstanceOptions;
  }
});
exports.Risen = void 0;

require('core-js');

require('regenerator-runtime');

require('./lib/runtime');

var _isPortFree = _interopRequireDefault(require('is-port-free'));

var _https = _interopRequireDefault(require('https'));

var _http = _interopRequireDefault(require('http'));

var _express = _interopRequireDefault(require('express'));

var _uuid = require('uuid');

var _path = require('path');

var _fs = require('fs');

var _lodash = require('lodash');

var _package = require('../package.json');

var _net = require('./lib/net');

var _core = _interopRequireDefault(require('./lib/core'));

var _db = _interopRequireDefault(require('./lib/db'));

var _lib = _interopRequireDefault(require('./lib'));

var _command = _interopRequireDefault(require('./lib/template/command'));

var _response = _interopRequireDefault(require('./lib/template/response'));

var _options = require('./options');

var _validate = require('./lib/validate');

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

var Risen = (function (_ServiceCore) {
  _inherits(Risen, _ServiceCore);

  var _super = _createSuper(Risen);

  function Risen(options) {
    var _this;

    _classCallCheck(this, Risen);

    _this = _super.call(this, options);

    if (!(0, _validate.validateOptions)(options)) {
      process.exit(1);
    }

    _this.microServiceStarted = false;
    _this.conId = 0;
    _this.settings = _objectSpread(
      _objectSpread(
        _objectSpread({}, _options.defaultInstanceOptions),
        options
      ),
      {},
      {
        http:
          Array.isArray(options.http) && options.http.length
            ? options.http.map(function (httpSettings) {
                return (0, _options.buildHttpOptions)(httpSettings);
              })
            : false
      }
    );
    ['httpsServer', 'httpServer', 'inUsePorts'].forEach(function (prop) {
      _this[prop] = [];
    });
    _this.db =
      _this.settings.databaseNames
        .map(function (table) {
          return _defineProperty(
            {},
            table,
            new _db['default']({
              databaseName: table
            }).db
          );
        })
        .reduce(function (acc, x) {
          return Object.assign(acc, x);
        }, {}) || {};
    process.env.settings = _this.settings;
    process.env.exitedProcessPorts = [];
    [
      'externalInterfaces',
      'coreOperations',
      'serviceInfo',
      'serviceOptions',
      'serviceData',
      'eventHandlers'
    ].forEach(function (prop) {
      _this[prop] = {};
    });
    [
      'assignCoreFunctions',
      'startServer',
      'initGateway',
      'bindGateway',
      'startHttpServer'
    ].forEach(function (func) {
      _this[func] = _this[func].bind(_assertThisInitialized(_this));
    });
    _this.eventHandlers = Object.assign.apply(
      Object,
      [{}].concat(
        _toConsumableArray(
          ['onConRequest', 'onConClose'].map(function (func) {
            return typeof options[func] === 'function'
              ? _defineProperty(
                  {},
                  func,
                  options[func].bind(_assertThisInitialized(_this))
                )
              : {};
          })
        )
      )
    );
    process.env.verbose = _this.settings.verbose === true;
    return _this;
  }

  _createClass(Risen, [
    {
      key: 'startServer',
      value: function startServer() {
        var _this2 = this;

        if (!this.microServiceStarted) {
          return _asyncToGenerator(
            regeneratorRuntime.mark(function _callee() {
              return regeneratorRuntime.wrap(
                function _callee$(_context) {
                  while (1) {
                    switch ((_context.prev = _context.next)) {
                      case 0:
                        _context.prev = 0;
                        _this2.microServiceStarted = true;

                        if (
                          !['client', 'server'].includes(_this2.settings.mode)
                        ) {
                          _context.next = 20;
                          break;
                        }

                        if (!(_this2.settings.mode === 'server')) {
                          _context.next = 17;
                          break;
                        }

                        _context.next = 6;
                        return _this2.assignCoreFunctions();

                      case 6:
                        _context.next = 8;
                        return _this2.initGateway();

                      case 8:
                        _context.next = 10;
                        return _this2.bindGateway();

                      case 10:
                        _context.next = 12;
                        return _this2.startServices();

                      case 12:
                        _context.next = 14;
                        return _this2.startHttpServer();

                      case 14:
                        _context.next = 16;
                        return _this2.executeInitialFunctions(
                          'coreOperations',
                          'settings'
                        );

                      case 16:
                        return _context.abrupt('return', void 0);

                      case 17:
                        _this2.log(
                          'Micro Service Framework: '.concat(_package.version),
                          'log'
                        );

                        _this2.log('Running in client mode...', 'log');

                        return _context.abrupt('return', void 0);

                      case 20:
                        throw new Error(
                          "Unsupported mode detected. Valid options are 'server' or 'client'"
                        );

                      case 23:
                        _context.prev = 23;
                        _context.t0 = _context['catch'](0);
                        throw new Error(_context.t0);

                      case 26:
                      case 'end':
                        return _context.stop();
                    }
                  }
                },
                _callee,
                null,
                [[0, 23]]
              );
            })
          )();
        }

        return this.log(
          'Micro service framework has already been initialised!',
          'warn'
        );
      }
    },
    {
      key: 'assignCoreFunctions',
      value: function assignCoreFunctions() {
        var _this3 = this;

        return new Promise(function (resolve) {
          Object.entries(
            _objectSpread(
              _objectSpread({}, _core['default']),
              _this3.settings.coreOperations
            )
          ).forEach(function (_ref4) {
            var _ref5 = _slicedToArray(_ref4, 2),
              name = _ref5[0],
              func = _ref5[1];

            _this3.coreOperations[name] = func.bind(_this3);
          });
          return resolve();
        });
      }
    },
    {
      key: 'defineService',
      value: function defineService(name, operations, options) {
        if (
          !(0, _validate.validateServiceOptions)(
            options || _options.defaultServiceOptions
          )
        ) {
          return this.log(
            'Unable to add '.concat(
              name,
              ' because the options are not valid! Check options and try again!'
            ),
            'log'
          );
        }

        var resolvedPath = ''.concat((0, _path.resolve)(operations), '.js');

        switch (true) {
          case typeof name === 'undefined': {
            throw new Error(
              'The name of the microservice is not defined! '.concat(name)
            );
          }

          case typeof operations === 'undefined' ||
            !(0, _fs.existsSync)(resolvedPath): {
            throw new Error(
              'The operations path of the microservice is not defined or cannot be found! PATH: '.concat(
                resolvedPath
              )
            );
          }

          case _typeof(require(resolvedPath)) !== 'object' ||
            !Object.keys(require(resolvedPath)).length: {
            throw new Error(
              'No operations found. Expecting an exported object with atleast one key! PATH: '.concat(
                resolvedPath
              )
            );
          }

          case Object.prototype.hasOwnProperty.call(this.serviceInfo, name): {
            throw new Error(
              'The microservice '.concat(name, ' has already been defined.')
            );
          }

          default: {
            this.serviceOptions[name] = _objectSpread(
              _objectSpread({}, _options.defaultServiceOptions),
              options
            );
            this.serviceInfo[name] = resolvedPath;
            return true;
          }
        }
      }
    },
    {
      key: 'initGateway',
      value: function initGateway() {
        var _this4 = this;

        this.log(
          'Risen.JS Micro Service Framework: '.concat(_package.version),
          'log',
          true
        );
        return new Promise(function (resolve, reject) {
          return (0, _isPortFree['default'])(_this4.settings.apiGatewayPort)
            .then(function () {
              _this4.log('Starting service core...', 'log', true);

              _this4.externalInterfaces.apiGateway = (0, _net.createListener)(
                _this4.settings.apiGatewayPort
              );

              if (!_this4.externalInterfaces.apiGateway) {
                return (
                  _this4.log(
                    'Unable to start gateway, exiting!',
                    'error',
                    true
                  ) || reject(Error('Unable to start gateway, exiting!'))
                );
              }

              return (
                _this4.log('Service core started!', 'log', true) ||
                resolve(true)
              );
            })
            ['catch'](function (e) {
              _this4.log(
                'Gateway port not free or unknown error has occurred. INFO: '.concat(
                  JSON.stringify(e, null, 2)
                ),
                'log'
              );

              return reject(
                Error(
                  'Gateway port not free or unknown error has occurred. INFO: '.concat(
                    JSON.stringify(e, null, 2)
                  )
                )
              );
            });
        });
      }
    },
    {
      key: 'bindGateway',
      value: function bindGateway() {
        var _this5 = this;

        return new Promise(function (resolve) {
          _this5.externalInterfaces.apiGateway.on('COM_REQUEST', function (
            message,
            data
          ) {
            _this5.log(
              '['.concat(
                _this5.conId,
                '] Service core connection request recieved'
              ),
              'log'
            );

            if (
              Object.prototype.hasOwnProperty.call(
                _this5.eventHandlers,
                'onConRequest'
              )
            ) {
              _this5.eventHandlers.onConRequest(data);
            }

            if (data) {
              _this5.processComRequest(data, message, _this5.conId);
            } else {
              _this5.processComError(data, message, _this5.conId);
            }

            _this5.log(
              '['.concat(
                _this5.conId,
                '] Service core connection request processed'
              )
            );

            _this5.conId += 1;
          });

          _this5.externalInterfaces.apiGateway.on('COM_CLOSE', function (
            message
          ) {
            _this5.log(
              '['.concat(
                _this5.conId,
                '] Service core connection close requested'
              )
            );

            if (
              Object.prototype.hasOwnProperty.call(
                _this5.eventHandlers,
                'onConClose'
              )
            ) {
              _this5.eventHandlers.onConClose();
            }

            message.conn.destroy();

            _this5.log(
              '['.concat(
                _this5.conId,
                '] Service core connection successfully closed'
              )
            );

            _this5.conId += 1;
          });

          _this5.externalInterfaces.apiGateway.on('KILL', function () {
            process.exit();
          });

          return resolve();
        });
      }
    },
    {
      key: 'startHttpServer',
      value: function startHttpServer() {
        var _this6 = this;

        return Array.isArray(this.settings.http)
          ? Promise.all(
              this.settings.http.map(function (httpSettings) {
                return new Promise(function (resolve, reject) {
                  try {
                    if (httpSettings) {
                      var expressApp = (0, _express['default'])();
                      httpSettings.beforeStart(expressApp);
                      httpSettings['static'].forEach(function (path) {
                        return expressApp.use(
                          _express['default']['static'](path)
                        );
                      });

                      if (httpSettings.harden) {
                        (0, _options.hardenServer)(expressApp);
                      }

                      httpSettings.middlewares.forEach(function (middleware) {
                        return expressApp.use(middleware);
                      });
                      httpSettings.routes
                        .filter(function (route) {
                          if (
                            ['put', 'post', 'get', 'delete', 'patch'].includes(
                              route.method.toLowerCase()
                            )
                          ) {
                            return true;
                          }

                          _this6.log(
                            'This route has an unknown method, skipping: '.concat(
                              JSON.stringify(route, null, 2)
                            ),
                            'warn'
                          );

                          return false;
                        })
                        .forEach(function (route) {
                          return expressApp[route.method.toLowerCase()].apply(
                            expressApp,
                            [route.uri].concat(
                              _toConsumableArray(route.preMiddleware || []),
                              [
                                function (req, res, next) {
                                  var resultSend = res.send;
                                  var requestId = (0, _uuid.v4)();

                                  var handleException = (function (
                                    res,
                                    requestIdScoped
                                  ) {
                                    return function (err) {
                                      if (requestIdScoped === requestId) {
                                        _options.eventList.forEach(function (
                                          event
                                        ) {
                                          return process.removeListener(
                                            event,
                                            handleException
                                          );
                                        });

                                        next(err);
                                      }
                                    };
                                  })(res, requestId);

                                  _options.eventList.forEach(function (event) {
                                    return process.on(event, handleException);
                                  });

                                  setImmediate(function () {
                                    res.send = function () {
                                      _options.eventList.forEach(function (
                                        event
                                      ) {
                                        return process.removeListener(
                                          event,
                                          handleException
                                        );
                                      });

                                      for (
                                        var _len = arguments.length,
                                          args = new Array(_len),
                                          _key = 0;
                                        _key < _len;
                                        _key++
                                      ) {
                                        args[_key] = arguments[_key];
                                      }

                                      if (typeof args[0] === 'undefined') {
                                        res.status(500);
                                      }

                                      resultSend.call.apply(
                                        resultSend,
                                        [res].concat(args)
                                      );
                                    };

                                    try {
                                      return route.handler(req, res, {
                                        sendRequest: _this6.sendRequest,
                                        CommandBodyObject: _command['default'],
                                        ResponseBodyObject: _response['default']
                                      });
                                    } catch (e) {
                                      return next(e);
                                    }
                                  });
                                }
                              ],
                              _toConsumableArray(route.postMiddleware || [])
                            )
                          );
                        });

                      _this6.log('Starting HTTP server(s)...', 'log');

                      if (_typeof(httpSettings.ssl) === 'object') {
                        return (
                          _this6.httpsServer.push(
                            _https['default']
                              .createServer(httpSettings.ssl, expressApp)
                              .listen(
                                httpSettings.port,
                                httpSettings.host || '0.0.0.0'
                              )
                          ) && resolve()
                        );
                      }

                      return (
                        _this6.httpServer.push(
                          _http['default']
                            .createServer(expressApp)
                            .listen(
                              httpSettings.port,
                              httpSettings.host || '0.0.0.0'
                            )
                        ) && resolve()
                      );
                    }

                    return resolve();
                  } catch (e) {
                    return reject(Error(e));
                  }
                });
              })
            )
          : new Promise(function (resolve) {
              _this6.log(
                'No HTTP(s) servers defined. Starting services only...'
              );

              return resolve();
            });
      }
    },
    {
      key: 'startServices',
      value: function startServices() {
        var _this7 = this;

        var serviceInfo =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : void 0;
        var customInstances =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : void 0;
        var servicesInfo = serviceInfo || this.serviceInfo;
        return new Promise(function (resolve, reject) {
          if (Object.keys(servicesInfo)) {
            return Promise.all(
              (0, _lodash.shuffle)(
                Object.keys(servicesInfo).reduce(function (acc, serviceName) {
                  var instances =
                    customInstances ||
                    _this7.serviceOptions[serviceName].instances;
                  var processList = [];

                  while (instances > 0) {
                    processList.push(serviceName);
                    instances -= 1;
                  }

                  return acc.concat.apply(acc, processList);
                }, [])
              ).map(function (name) {
                return new Promise(function (resolveLocal, rejectLocal) {
                  return _this7.initService(name, function (result) {
                    return result === true
                      ? resolveLocal(true)
                      : rejectLocal(
                          Error(
                            'Unable to start microservice! MORE INFO: '.concat(
                              JSON.stringify(result, null, 2)
                            )
                          )
                        );
                  });
                });
              })
            )
              .then(function () {
                return resolve();
              })
              ['catch'](function (e) {
                return reject(e);
              });
          }

          return reject(Error('No microservices defined!'));
        });
      }
    }
  ]);

  return Risen;
})(_lib['default']);

exports.Risen = Risen;
