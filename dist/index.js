'use strict';
Object.defineProperty(exports, '__esModule', { value: !0 }),
  Object.defineProperty(exports, 'CommandBody', {
    enumerable: !0,
    get: function get() {
      return _command['default'];
    }
  }),
  Object.defineProperty(exports, 'ResponseBody', {
    enumerable: !0,
    get: function get() {
      return _response['default'];
    }
  }),
  Object.defineProperty(exports, 'buildHttpOptions', {
    enumerable: !0,
    get: function get() {
      return _options.buildHttpOptions;
    }
  }),
  Object.defineProperty(exports, 'buildSecureOptions', {
    enumerable: !0,
    get: function get() {
      return _options.buildSecureOptions;
    }
  }),
  Object.defineProperty(exports, 'defaultServiceOptions', {
    enumerable: !0,
    get: function get() {
      return _options.defaultServiceOptions;
    }
  }),
  Object.defineProperty(exports, 'defaultInstanceOptions', {
    enumerable: !0,
    get: function get() {
      return _options.defaultInstanceOptions;
    }
  }),
  (exports.Risen = void 0),
  require('core-js'),
  require('regenerator-runtime'),
  require('./lib/runtime');
var _isPortFree = _interopRequireDefault(require('is-port-free')),
  _https = _interopRequireDefault(require('https')),
  _http = _interopRequireDefault(require('http')),
  _express = _interopRequireDefault(require('express')),
  _fs = require('fs'),
  _uuid = require('uuid'),
  _path = require('path'),
  _lodash = require('lodash'),
  _package = require('../package.json'),
  _net = require('./lib/net'),
  _core = _interopRequireDefault(require('./lib/core')),
  _db = _interopRequireDefault(require('./lib/db')),
  _lib = _interopRequireDefault(require('./lib')),
  _command = _interopRequireDefault(require('./lib/template/command')),
  _response = _interopRequireDefault(require('./lib/template/response')),
  _request = require('./lib/core/request'),
  _options = require('./options'),
  _validate = require('./lib/validate');
function _interopRequireDefault(a) {
  return a && a.__esModule ? a : { default: a };
}
function _typeof(a) {
  '@babel/helpers - typeof';
  return (
    (_typeof =
      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
        ? function (a) {
            return typeof a;
          }
        : function (a) {
            return a &&
              'function' == typeof Symbol &&
              a.constructor === Symbol &&
              a !== Symbol.prototype
              ? 'symbol'
              : typeof a;
          }),
    _typeof(a)
  );
}
function _slicedToArray(a, b) {
  return (
    _arrayWithHoles(a) ||
    _iterableToArrayLimit(a, b) ||
    _unsupportedIterableToArray(a, b) ||
    _nonIterableRest()
  );
}
function _nonIterableRest() {
  throw new TypeError(
    'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
  );
}
function _iterableToArrayLimit(a, b) {
  if ('undefined' != typeof Symbol && Symbol.iterator in Object(a)) {
    var c = [],
      d = !0,
      e = !1,
      f = void 0;
    try {
      for (
        var g, h = a[Symbol.iterator]();
        !(d = (g = h.next()).done) && (c.push(g.value), !(b && c.length === b));
        d = !0
      );
    } catch (a) {
      (e = !0), (f = a);
    } finally {
      try {
        d || null == h['return'] || h['return']();
      } finally {
        if (e) throw f;
      }
    }
    return c;
  }
}
function _arrayWithHoles(a) {
  if (Array.isArray(a)) return a;
}
function asyncGeneratorStep(a, b, c, d, e, f, g) {
  try {
    var h = a[f](g),
      i = h.value;
  } catch (a) {
    return void c(a);
  }
  h.done ? b(i) : Promise.resolve(i).then(d, e);
}
function _asyncToGenerator(a) {
  return function () {
    var b = this,
      c = arguments;
    return new Promise(function (d, e) {
      function f(a) {
        asyncGeneratorStep(h, d, e, f, g, 'next', a);
      }
      function g(a) {
        asyncGeneratorStep(h, d, e, f, g, 'throw', a);
      }
      var h = a.apply(b, c);
      f(void 0);
    });
  };
}
function _toConsumableArray(a) {
  return (
    _arrayWithoutHoles(a) ||
    _iterableToArray(a) ||
    _unsupportedIterableToArray(a) ||
    _nonIterableSpread()
  );
}
function _nonIterableSpread() {
  throw new TypeError(
    'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
  );
}
function _unsupportedIterableToArray(a, b) {
  if (a) {
    if ('string' == typeof a) return _arrayLikeToArray(a, b);
    var c = Object.prototype.toString.call(a).slice(8, -1);
    return (
      'Object' === c && a.constructor && (c = a.constructor.name),
      'Map' === c || 'Set' === c
        ? Array.from(a)
        : 'Arguments' === c ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)
        ? _arrayLikeToArray(a, b)
        : void 0
    );
  }
}
function _iterableToArray(a) {
  if ('undefined' != typeof Symbol && Symbol.iterator in Object(a))
    return Array.from(a);
}
function _arrayWithoutHoles(a) {
  if (Array.isArray(a)) return _arrayLikeToArray(a);
}
function _arrayLikeToArray(a, b) {
  (null == b || b > a.length) && (b = a.length);
  for (var c = 0, d = Array(b); c < b; c++) d[c] = a[c];
  return d;
}
function ownKeys(a, b) {
  var c = Object.keys(a);
  if (Object.getOwnPropertySymbols) {
    var d = Object.getOwnPropertySymbols(a);
    b &&
      (d = d.filter(function (b) {
        return Object.getOwnPropertyDescriptor(a, b).enumerable;
      })),
      c.push.apply(c, d);
  }
  return c;
}
function _objectSpread(a) {
  for (var b, c = 1; c < arguments.length; c++)
    (b = null == arguments[c] ? {} : arguments[c]),
      c % 2
        ? ownKeys(Object(b), !0).forEach(function (c) {
            _defineProperty(a, c, b[c]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(a, Object.getOwnPropertyDescriptors(b))
        : ownKeys(Object(b)).forEach(function (c) {
            Object.defineProperty(a, c, Object.getOwnPropertyDescriptor(b, c));
          });
  return a;
}
function _defineProperty(a, b, c) {
  return (
    b in a
      ? Object.defineProperty(a, b, {
          value: c,
          enumerable: !0,
          configurable: !0,
          writable: !0
        })
      : (a[b] = c),
    a
  );
}
function _classCallCheck(a, b) {
  if (!(a instanceof b))
    throw new TypeError('Cannot call a class as a function');
}
function _defineProperties(a, b) {
  for (var c, d = 0; d < b.length; d++)
    (c = b[d]),
      (c.enumerable = c.enumerable || !1),
      (c.configurable = !0),
      'value' in c && (c.writable = !0),
      Object.defineProperty(a, c.key, c);
}
function _createClass(a, b, c) {
  return (
    b && _defineProperties(a.prototype, b), c && _defineProperties(a, c), a
  );
}
function _inherits(a, b) {
  if ('function' != typeof b && null !== b)
    throw new TypeError('Super expression must either be null or a function');
  (a.prototype = Object.create(b && b.prototype, {
    constructor: { value: a, writable: !0, configurable: !0 }
  })),
    b && _setPrototypeOf(a, b);
}
function _setPrototypeOf(a, b) {
  return (
    (_setPrototypeOf =
      Object.setPrototypeOf ||
      function (a, b) {
        return (a.__proto__ = b), a;
      }),
    _setPrototypeOf(a, b)
  );
}
function _createSuper(a) {
  var b = _isNativeReflectConstruct();
  return function () {
    var c,
      d = _getPrototypeOf(a);
    if (b) {
      var e = _getPrototypeOf(this).constructor;
      c = Reflect.construct(d, arguments, e);
    } else c = d.apply(this, arguments);
    return _possibleConstructorReturn(this, c);
  };
}
function _possibleConstructorReturn(a, b) {
  return b && ('object' === _typeof(b) || 'function' == typeof b)
    ? b
    : _assertThisInitialized(a);
}
function _assertThisInitialized(a) {
  if (void 0 === a)
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  return a;
}
function _isNativeReflectConstruct() {
  if ('undefined' == typeof Reflect || !Reflect.construct) return !1;
  if (Reflect.construct.sham) return !1;
  if ('function' == typeof Proxy) return !0;
  try {
    return (
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {})),
      !0
    );
  } catch (a) {
    return !1;
  }
}
function _getPrototypeOf(a) {
  return (
    (_getPrototypeOf = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function (a) {
          return a.__proto__ || Object.getPrototypeOf(a);
        }),
    _getPrototypeOf(a)
  );
}
var Risen = (function (a) {
  function b(a) {
    var d;
    return (
      _classCallCheck(this, b),
      (d = c.call(this, a)),
      (0, _validate.validateOptions)(a) || process.exit(1),
      (d.microServiceStarted = !1),
      (d.conId = 0),
      (d.settings = _objectSpread(
        _objectSpread(_objectSpread({}, _options.defaultInstanceOptions), a),
        {},
        {
          http:
            !!(Array.isArray(a.http) && a.http.length) &&
            a.http.map(function (a) {
              return (0, _options.buildHttpOptions)(a);
            })
        }
      )),
      ['httpsServer', 'httpServer', 'inUsePorts'].forEach(function (a) {
        d[a] = [];
      }),
      (d.db =
        d.settings.databaseNames
          .map(function (a) {
            return _defineProperty(
              {},
              a,
              new _db['default']({ databaseName: a }).db
            );
          })
          .reduce(function (a, b) {
            return Object.assign(a, b);
          }, {}) || {}),
      (process.env.service = 'false'),
      (process.env.settings = d.settings),
      (process.env.exitedProcessPorts = []),
      [
        'externalInterfaces',
        'coreOperations',
        'serviceInfo',
        'serviceOptions',
        'serviceData',
        'eventHandlers'
      ].forEach(function (a) {
        d[a] = {};
      }),
      [
        'assignCoreFunctions',
        'assignRequestFunctions',
        'startServer',
        'initGateway',
        'bindGateway',
        'startHttpServer'
      ].forEach(function (a) {
        d[a] = d[a].bind(_assertThisInitialized(d));
      }),
      (d.eventHandlers = Object.assign.apply(
        Object,
        [{}].concat(
          _toConsumableArray(
            ['onConRequest', 'onConClose'].map(function (b) {
              return 'function' == typeof a[b]
                ? _defineProperty(
                    {},
                    b,
                    a[b].bind(
                      _objectSpread(
                        _objectSpread({}, _assertThisInitialized(d)),
                        {},
                        { request: d.request, requestChain: d.requestChain }
                      )
                    )
                  )
                : {};
            })
          )
        )
      )),
      (process.env.verbose = !0 === d.settings.verbose),
      (d.operationScope = {
        request: d.request,
        requestChain: d.requestChain,
        sendRequest: d.sendRequest,
        destroyConnection: d.destroyConnection,
        operations: d.coreOperations
      }),
      _asyncToGenerator(
        regeneratorRuntime.mark(function a() {
          return regeneratorRuntime.wrap(
            function (a) {
              for (;;)
                switch ((a.prev = a.next)) {
                  case 0:
                    return (
                      (a.prev = 0), (a.next = 3), d.assignRequestFunctions()
                    );
                  case 3:
                    a.next = 8;
                    break;
                  case 5:
                    throw (
                      ((a.prev = 5), (a.t0 = a['catch'](0)), new Error(a.t0))
                    );
                  case 8:
                  case 'end':
                    return a.stop();
                }
            },
            a,
            null,
            [[0, 5]]
          );
        })
      )(),
      d
    );
  }
  _inherits(b, a);
  var c = _createSuper(b);
  return (
    _createClass(b, [
      {
        key: 'startServer',
        value: function startServer() {
          var a = this,
            b =
              0 < arguments.length && void 0 !== arguments[0]
                ? arguments[0]
                : function () {};
          return this.microServiceStarted
            ? this.log(
                'Micro service framework has already been initialised!',
                'warn'
              )
            : _asyncToGenerator(
                regeneratorRuntime.mark(function c() {
                  return regeneratorRuntime.wrap(
                    function (c) {
                      for (;;)
                        switch ((c.prev = c.next)) {
                          case 0:
                            if (
                              ((c.prev = 0),
                              (a.microServiceStarted = !0),
                              !['client', 'server'].includes(a.settings.mode))
                            ) {
                              c.next = 28;
                              break;
                            }
                            if ('server' !== a.settings.mode) {
                              c.next = 25;
                              break;
                            }
                            return (
                              (c.prev = 4),
                              (c.next = 7),
                              a.assignCoreFunctions()
                            );
                          case 7:
                            return (c.next = 9), a.initGateway();
                          case 9:
                            return (c.next = 11), a.bindGateway();
                          case 11:
                            return (c.next = 13), a.startServices();
                          case 13:
                            return (c.next = 15), a.startHttpServer();
                          case 15:
                            return (
                              (c.next = 17),
                              a.executeInitialFunctions(
                                'coreOperations',
                                'settings'
                              )
                            );
                          case 17:
                            return b(), c.abrupt('return', void 0);
                          case 21:
                            (c.prev = 21),
                              (c.t0 = c['catch'](4)),
                              a.log(
                                'A fatal error has occurred when starting the framework. Process cannot continue, exiting...',
                                'error'
                              ),
                              process.exit(1);
                          case 25:
                            return (
                              a.log(
                                'Micro Service Framework: '.concat(
                                  _package.version
                                ),
                                'log'
                              ),
                              a.log('Running in client mode...', 'log'),
                              c.abrupt('return', void 0)
                            );
                          case 28:
                            throw new Error(
                              "Unsupported mode detected. Valid options are 'server' or 'client'"
                            );
                          case 31:
                            throw (
                              ((c.prev = 31),
                              (c.t1 = c['catch'](0)),
                              new Error(c.t1))
                            );
                          case 34:
                          case 'end':
                            return c.stop();
                        }
                    },
                    c,
                    null,
                    [
                      [0, 31],
                      [4, 21]
                    ]
                  );
                })
              )();
        }
      },
      {
        key: 'assignRequestFunctions',
        value: function assignRequestFunctions() {
          var a = this;
          return new Promise(function (b) {
            return (
              Object.entries(
                _objectSpread({}, _request.requestOperations)
              ).forEach(function (b) {
                var c = _slicedToArray(b, 2),
                  d = c[0],
                  e = c[1];
                a[d] = e.bind(a);
              }),
              b()
            );
          });
        }
      },
      {
        key: 'assignCoreFunctions',
        value: function assignCoreFunctions() {
          var a = this;
          return new Promise(function (b) {
            return (
              Object.entries(
                _objectSpread(
                  _objectSpread({}, _core['default']),
                  a.settings.coreOperations
                )
              ).forEach(function (b) {
                var c = _slicedToArray(b, 2),
                  d = c[0],
                  e = c[1];
                a.coreOperations[d] = e.bind(a);
              }),
              b()
            );
          });
        }
      },
      {
        key: 'defineService',
        value: function defineService(a, b, c) {
          if ('server' !== this.settings.mode)
            return this.log(
              "Cannot define service because framework is not running in 'server' mode. Mode: ".concat(
                this.settings.mode
              ),
              'error'
            );
          if (
            !(0, _validate.validateServiceOptions)(
              c || _options.defaultServiceOptions
            )
          )
            return this.log(
              'Unable to add '.concat(
                a,
                ' because the options are not valid! Check options and try again!'
              ),
              'log'
            );
          var d = ''.concat((0, _path.resolve)(b), '.js'),
            e = { operations: require(d), resolvedPath: d };
          switch (!0) {
            case 'undefined' == typeof a:
              throw new Error(
                'The name of the microservice is not defined! '.concat(a)
              );
            case 'undefined' == typeof e.operations ||
              !(0, _fs.existsSync)(e.resolvedPath):
              throw new Error(
                'The operations path of the microservice is not defined or cannot be found! PATH: '.concat(
                  e.resolvedPath
                )
              );
            case 'object' !== _typeof(e.operations) ||
              !Object.keys(e.operations).length:
              throw new Error(
                'No operations found. Expecting an exported object with atleast one key! PATH: '.concat(
                  e.resolvedPath
                )
              );
            case Object.prototype.hasOwnProperty.call(this.serviceInfo, a):
              throw new Error(
                'The microservice '.concat(a, ' has already been defined.')
              );
            default:
              return (
                (this.serviceOptions[a] = _objectSpread(
                  _objectSpread({}, _options.defaultServiceOptions),
                  c
                )),
                (this.serviceInfo[a] = d),
                !0
              );
          }
        }
      },
      {
        key: 'initGateway',
        value: function initGateway() {
          var a = this;
          return (
            this.log(
              'Risen.JS Micro Service Framework: '.concat(_package.version),
              'log',
              !0
            ),
            new Promise(function (b, c) {
              return (0, _isPortFree['default'])(a.settings.apiGatewayPort)
                .then(function () {
                  return (
                    a.log('Starting service core...', 'log', !0),
                    (a.externalInterfaces.apiGateway = (0, _net.createListener)(
                      a.settings.apiGatewayPort
                    )),
                    a.externalInterfaces.apiGateway
                      ? a.log('Service core started!', 'log', !0) || b(!0)
                      : a.log(
                          'Unable to start gateway, exiting!',
                          'error',
                          !0
                        ) || c(Error('Unable to start gateway, exiting!'))
                  );
                })
                ['catch'](function (b) {
                  return (
                    a.log(
                      'Gateway port not free or unknown error has occurred. INFO: '.concat(
                        JSON.stringify(b, null, 2)
                      ),
                      'log'
                    ),
                    c(
                      Error(
                        'Gateway port not free or unknown error has occurred. INFO: '.concat(
                          JSON.stringify(b, null, 2)
                        )
                      )
                    )
                  );
                });
            })
          );
        }
      },
      {
        key: 'bindGateway',
        value: function bindGateway() {
          var a = this;
          return new Promise(function (b) {
            return (
              a.externalInterfaces.apiGateway.on('COM_REQUEST', function (
                b,
                c
              ) {
                a.log(
                  '['.concat(
                    a.conId,
                    '] Service core connection request recieved'
                  ),
                  'log'
                ),
                  Object.prototype.hasOwnProperty.call(
                    a.eventHandlers,
                    'onConRequest'
                  ) && a.eventHandlers.onConRequest(c),
                  c
                    ? a.processComRequest(c, b, a.conId)
                    : a.processComError(c, b, a.conId),
                  a.log(
                    '['.concat(
                      a.conId,
                      '] Service core connection request processed'
                    )
                  ),
                  (a.conId += 1);
              }),
              a.externalInterfaces.apiGateway.on('COM_CLOSE', function (b) {
                a.log(
                  '['.concat(
                    a.conId,
                    '] Service core connection close requested'
                  )
                ),
                  Object.prototype.hasOwnProperty.call(
                    a.eventHandlers,
                    'onConClose'
                  ) && a.eventHandlers.onConClose(),
                  b.conn.destroy(),
                  a.log(
                    '['.concat(
                      a.conId,
                      '] Service core connection successfully closed'
                    )
                  ),
                  (a.conId += 1);
              }),
              a.externalInterfaces.apiGateway.on('KILL', function () {
                process.exit();
              }),
              b()
            );
          });
        }
      },
      {
        key: 'startHttpServer',
        value: function startHttpServer() {
          var a = this;
          return Array.isArray(this.settings.http)
            ? Promise.all(
                this.settings.http.map(function (b) {
                  return new Promise(function (c, d) {
                    try {
                      if (b) {
                        var e = (0, _express['default'])();
                        return (
                          b.beforeStart(e),
                          b['static'].forEach(function (a) {
                            e.use(_express['default']['static'](a));
                          }),
                          b.harden && (0, _options.hardenServer)(e),
                          b.middlewares.forEach(function (a) {
                            return e.use(a);
                          }),
                          b.routes
                            .filter(function (b) {
                              return (
                                !![
                                  'put',
                                  'post',
                                  'get',
                                  'delete',
                                  'patch'
                                ].includes(b.method.toLowerCase()) ||
                                (a.log(
                                  'This route has an unknown method, skipping: '.concat(
                                    JSON.stringify(b, null, 2)
                                  ),
                                  'warn'
                                ),
                                !1)
                              );
                            })
                            .forEach(function (b) {
                              return e[b.method.toLowerCase()].apply(
                                e,
                                [b.uri].concat(
                                  _toConsumableArray(b.preMiddleware || []),
                                  [
                                    function (c, d, f) {
                                      var g = d.send,
                                        h = (0, _uuid.v4)(),
                                        i = (function (a, b) {
                                          return function (a) {
                                            b === h &&
                                              (_options.eventList.forEach(
                                                function (a) {
                                                  return process.removeListener(
                                                    a,
                                                    i
                                                  );
                                                }
                                              ),
                                              f(a));
                                          };
                                        })(d, h);
                                      _options.eventList.forEach(function (a) {
                                        return process.on(a, i);
                                      }),
                                        setImmediate(function () {
                                          d.send = function () {
                                            _options.eventList.forEach(
                                              function (a) {
                                                return process.removeListener(
                                                  a,
                                                  i
                                                );
                                              }
                                            );
                                            for (
                                              var a = arguments.length,
                                                b = Array(a),
                                                c = 0;
                                              c < a;
                                              c++
                                            )
                                              b[c] = arguments[c];
                                            'undefined' == typeof b[0] &&
                                              d.status(500),
                                              g.call.apply(g, [d].concat(b));
                                          };
                                          try {
                                            return b.handler(c, d, f, {
                                              request: a.request,
                                              requestChain: a.requestChain,
                                              getCommandBody: function getCommandBody() {
                                                return new _command[
                                                  'default'
                                                ]();
                                              },
                                              getResponseObject: function getResponseObject() {
                                                return new _response[
                                                  'default'
                                                ]();
                                              }
                                            });
                                          } catch (a) {
                                            return f(a);
                                          }
                                        });
                                    }
                                  ],
                                  _toConsumableArray(b.postMiddleware || [])
                                )
                              );
                            }),
                          a.log('Starting HTTP server(s)...', 'log'),
                          'object' === _typeof(b.ssl)
                            ? a.httpsServer.push(
                                _https['default']
                                  .createServer(b.ssl, e)
                                  .listen(b.port, b.host || '0.0.0.0')
                              ) && c()
                            : a.httpServer.push(
                                _http['default']
                                  .createServer(e)
                                  .listen(b.port, b.host || '0.0.0.0')
                              ) && c()
                        );
                      }
                      return c();
                    } catch (a) {
                      return d(Error(a));
                    }
                  });
                })
              )
            : new Promise(function (b) {
                return (
                  a.log(
                    'No HTTP(s) servers defined. Starting services only...'
                  ),
                  b()
                );
              });
        }
      },
      {
        key: 'startServices',
        value: function startServices() {
          var a = this,
            b =
              0 < arguments.length && void 0 !== arguments[0]
                ? arguments[0]
                : void 0,
            c =
              1 < arguments.length && void 0 !== arguments[1]
                ? arguments[1]
                : void 0,
            d = b || this.serviceInfo;
          return new Promise(function (b, f) {
            return Object.keys(d)
              ? Promise.all(
                  (0, _lodash.shuffle)(
                    Object.keys(d).reduce(function (b, d) {
                      for (
                        var e = c || a.serviceOptions[d].instances, f = [];
                        0 < e;

                      )
                        f.push(d), (e -= 1);
                      return b.concat.apply(b, f);
                    }, [])
                  ).map(function (b) {
                    return new Promise(function (c, d) {
                      return a.initService(b, function (a) {
                        return !0 === a
                          ? c(!0)
                          : d(
                              Error(
                                'Unable to start microservice! MORE INFO: '.concat(
                                  JSON.stringify(a, null, 2)
                                )
                              )
                            );
                      });
                    });
                  })
                )
                  .then(function () {
                    return b();
                  })
                  ['catch'](function (a) {
                    return f(a);
                  })
              : f(Error('No microservices defined!'));
          });
        }
      }
    ]),
    b
  );
})(_lib['default']);
exports.Risen = Risen;
