'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
Object.defineProperty(exports, 'CommandBodyObject', {
  enumerable: true,
  get: function get() {
    return _command.default;
  }
});
Object.defineProperty(exports, 'ResponseBodyObject', {
  enumerable: true,
  get: function get() {
    return _response.default;
  }
});
exports.Risen = exports.defaultInstanceOptions = exports.buildHttpOptions = exports.buildSecureOptions = exports.defaultServiceOptions = void 0;

require('@babel/polyfill');

require('./lib/runtime');

var _isPortFree = _interopRequireDefault(require('is-port-free'));

var _https = _interopRequireDefault(require('https'));

var _v = _interopRequireDefault(require('uuid/v4'));

var _http = _interopRequireDefault(require('http'));

var _helmet = _interopRequireDefault(require('helmet'));

var _express = _interopRequireDefault(require('express'));

var _path = require('path');

var _fs = require('fs');

var _lodash = require('lodash');

var _package = require('../package.json');

var _core = _interopRequireDefault(require('./lib/core'));

var _db = _interopRequireDefault(require('./lib/db'));

var _lib = _interopRequireDefault(require('./lib'));

var _command = _interopRequireDefault(require('./lib/template/command'));

var _response = _interopRequireDefault(require('./lib/template/response'));

var _validate = require('./lib/validate');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
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

var defaultServiceOptions = {
  loadBalancing: 'roundRobin',
  runOnStart: [],
  instances: 1
};
exports.defaultServiceOptions = defaultServiceOptions;

var buildSecureOptions = function buildSecureOptions(ssl) {
  try {
    return _typeof(ssl) === 'object'
      ? Object.entries(
          Object.assign(
            {},
            {
              key: void 0,
              cert: void 0,
              ca: void 0
            },
            ssl
          )
        )
          .filter(function(_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
              optionKey = _ref2[0],
              filePath = _ref2[1];

            return filePath;
          })
          .map(function(_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
              optionKey = _ref4[0],
              filePath = _ref4[1];

            return _defineProperty(
              {},
              optionKey,
              (0, _fs.readFileSync)((0, _path.resolve)(filePath)).toString()
            );
          })
          .reduce(function(acc, x) {
            return Object.assign(acc, x);
          }, {})
      : ssl;
  } catch (e) {
    throw new Error(e);
  }
};

exports.buildSecureOptions = buildSecureOptions;

var buildHttpOptions = function buildHttpOptions(options) {
  return {
    port: options.hasOwnProperty('port') ? options.port : 8888,
    ssl: buildSecureOptions(options.ssl),
    harden: options.hasOwnProperty('harden') ? options.harden : true,
    beforeStart: options.hasOwnProperty('beforeStart')
      ? options.beforeStart
      : function(express) {
          return express;
        },
    middlewares: options.hasOwnProperty('middlewares')
      ? options.middlewares
      : [],
    static: options.hasOwnProperty('static') ? options.static : [],
    routes: options.hasOwnProperty('routes') ? options.routes : []
  };
};

exports.buildHttpOptions = buildHttpOptions;
var defaultInstanceOptions = {
  mode: 'server',
  http: false,
  databaseNames: ['_defaultTable'],
  verbose: true,
  maxBuffer: 50,
  logPath: void 0,
  restartTimeout: 50,
  connectionTimeout: 1000,
  microServiceConnectionTimeout: 10000,
  microServiceConnectionAttempts: 1000,
  apiGatewayPort: 8080,
  portRangeStart: 1024,
  portRangeFinish: 65535,
  coreOperations: {},
  runOnStart: []
};
exports.defaultInstanceOptions = defaultInstanceOptions;

var Risen = (function(_ServiceCore) {
  _inherits(Risen, _ServiceCore);

  function Risen(options) {
    var _this;

    _classCallCheck(this, Risen);

    _this = _possibleConstructorReturn(
      this,
      _getPrototypeOf(Risen).call(this, options)
    );
    !(0, _validate.validateOptions)(options) && process.exit();
    _this.microServiceStarted = false;
    _this.conId = 0;
    _this.settings = Object.assign({}, defaultInstanceOptions, options, {
      http:
        Array.isArray(options.http) && options.http.length
          ? options.http.map(function(httpSettings) {
              return buildHttpOptions(httpSettings);
            })
          : false
    });
    ['httpsServer', 'httpServer', 'inUsePorts'].forEach(function(prop) {
      return (_this[prop] = []);
    });
    _this.db =
      _this.settings.databaseNames
        .map(function(table) {
          return _defineProperty(
            {},
            table,
            new _db.default({
              databaseName: table
            }).db
          );
        })
        .reduce(function(acc, x) {
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
    ].forEach(function(prop) {
      return (_this[prop] = {});
    });
    [
      'assignCoreFunctions',
      'startServerFailed',
      'startServer',
      'initGateway',
      'bindGateway',
      'hardenServer',
      'startHttpServer'
    ].forEach(function(func) {
      return (_this[func] = _this[func].bind(
        _assertThisInitialized(_assertThisInitialized(_this))
      ));
    });
    _this.eventHandlers = Object.assign.apply(
      Object,
      [{}].concat(
        _toConsumableArray(
          ['onConRequest', 'onConClose'].map(function(func) {
            return typeof options[func] === 'function'
              ? _defineProperty(
                  {},
                  func,
                  options[func].bind(
                    _assertThisInitialized(_assertThisInitialized(_this))
                  )
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
      key: 'startServerFailed',
      value: function startServerFailed() {
        return setImmediate(function() {
          return process.exit();
        });
      }
    },
    {
      key: 'startServer',
      value: function startServer() {
        var _this2 = this;

        return !this.microServiceStarted
          ? _asyncToGenerator(
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
                            'Micro Service Framework: '.concat(
                              _package.version
                            ),
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
                  this,
                  [[0, 23]]
                );
              })
            )()
          : this.log(
              'Micro service framework has already been initialised!',
              'warn'
            );
      }
    },
    {
      key: 'assignCoreFunctions',
      value: function assignCoreFunctions() {
        var _this3 = this;

        return new Promise(function(resolve) {
          Object.entries(
            Object.assign({}, _core.default, _this3.settings.coreOperations)
          ).forEach(function(_ref9) {
            var _ref10 = _slicedToArray(_ref9, 2),
              name = _ref10[0],
              func = _ref10[1];

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
            options || defaultServiceOptions
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

          case this.serviceInfo.hasOwnProperty(name): {
            throw new Error(
              'The microservice '.concat(name, ' has already been defined.')
            );
          }

          default: {
            this.serviceOptions[name] = Object.assign(
              {},
              defaultServiceOptions,
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
          'Micro Service Framework: '.concat(_package.version),
          'log',
          true
        );
        return new Promise(function(resolve, reject) {
          return (0, _isPortFree.default)(_this4.settings.apiGatewayPort)
            .then(function() {
              _this4.log('Starting service core...', 'log', true);

              _this4.externalInterfaces.apiGateway = _this4.invokeListener(
                _this4.settings.apiGatewayPort
              );
              return !_this4.externalInterfaces.apiGateway
                ? _this4.log(
                    'Unable to start gateway, exiting!',
                    'error',
                    true
                  ) || reject(Error('Unable to start gateway, exiting!'))
                : _this4.log('Service core started!', 'log', true) ||
                    resolve(true);
            })
            .catch(function(e) {
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

        return new Promise(function(resolve) {
          _this5.externalInterfaces.apiGateway.on('COM_REQUEST', function(
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

            _this5.eventHandlers.hasOwnProperty('onConRequest') &&
              _this5.eventHandlers.onConRequest(data);
            data
              ? _this5.processComRequest(data, message, _this5.conId)
              : _this5.processComError(data, message, _this5.conId);

            _this5.log(
              '['.concat(
                _this5.conId,
                '] Service core connection request processed'
              )
            );

            return _this5.conId++;
          });

          _this5.externalInterfaces.apiGateway.on('COM_CLOSE', function(
            message
          ) {
            _this5.log(
              '['.concat(
                _this5.conId,
                '] Service core connection close requested'
              )
            );

            _this5.eventHandlers.hasOwnProperty('onConClose') &&
              _this5.eventHandlers.onConClose();
            message.conn.destroy();

            _this5.log(
              '['.concat(
                _this5.conId,
                '] Service core connection successfully closed'
              )
            );

            return _this5.conId++;
          });

          _this5.externalInterfaces.apiGateway.on('KILL', function() {
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
              this.settings.http.map(function(httpSettings) {
                return new Promise(function(resolve, reject) {
                  try {
                    if (httpSettings) {
                      var expressApp = (0, _express.default)();
                      httpSettings.beforeStart(expressApp);
                      httpSettings.static.forEach(function(path) {
                        return expressApp.use(_express.default.static(path));
                      });
                      httpSettings.harden && _this6.hardenServer(expressApp);
                      httpSettings.middlewares.forEach(function(middleware) {
                        return expressApp.use(middleware);
                      });
                      httpSettings.routes
                        .filter(function(route) {
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
                        .forEach(function(route) {
                          return expressApp[route.method.toLowerCase()].apply(
                            expressApp,
                            [route.uri].concat(
                              _toConsumableArray(route.preMiddleware || []),
                              [
                                function(req, res, next) {
                                  var resultSend = res.send;
                                  var requestId = (0, _v.default)();
                                  var eventList = [
                                    'uncaughtException',
                                    'unhandledRejection'
                                  ];

                                  var handleException = (function(
                                    res,
                                    requestIdScoped
                                  ) {
                                    return function(err) {
                                      if (requestIdScoped === requestId) {
                                        eventList.forEach(function(event) {
                                          return process.removeListener(
                                            event,
                                            handleException
                                          );
                                        });
                                        next(err);
                                      }
                                    };
                                  })(res, requestId);

                                  eventList.forEach(function(event) {
                                    return process.on(event, handleException);
                                  });
                                  setImmediate(function() {
                                    res.send = function() {
                                      eventList.forEach(function(event) {
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

                                      resultSend.call.apply(
                                        resultSend,
                                        [res].concat(args)
                                      );
                                    };

                                    try {
                                      return route.handler(req, res, {
                                        sendRequest: _this6.sendRequest,
                                        CommandBodyObject: _command.default,
                                        ResponseBodyObject: _response.default
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
                            _https.default
                              .createServer(httpSettings.ssl, expressApp)
                              .listen(httpSettings.port)
                          ) && resolve()
                        );
                      }

                      return (
                        _this6.httpServer.push(
                          _http.default
                            .createServer(expressApp)
                            .listen(httpSettings.port)
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
          : new Promise(function(resolve) {
              _this6.log(
                'No HTTP(s) servers defined. Starting services only...'
              );

              return resolve();
            });
      }
    },
    {
      key: 'hardenServer',
      value: function hardenServer(expressApp) {
        return expressApp.use((0, _helmet.default)());
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
        return new Promise(function(resolve, reject) {
          if (Object.keys(servicesInfo)) {
            return Promise.all(
              (0, _lodash.shuffle)(
                Object.keys(servicesInfo).reduce(function(acc, serviceName) {
                  var instances =
                    customInstances ||
                    _this7.serviceOptions[serviceName].instances;
                  var processList = [];

                  while (instances > 0) {
                    processList.push(serviceName);
                    --instances;
                  }

                  return acc.concat.apply(acc, processList);
                }, [])
              ).map(function(name) {
                return new Promise(function(resolveLocal, rejectLocal) {
                  return _this7.initService(name, function(result) {
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
              .then(function() {
                return resolve();
              })
              .catch(function(e) {
                return reject(e);
              });
          }

          return reject(Error('No microservices defined!'));
        });
      }
    }
  ]);

  return Risen;
})(_lib.default);

exports.Risen = Risen;
