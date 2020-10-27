'use strict';
Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports['default'] = void 0);
var _mkdirp = _interopRequireDefault(require('mkdirp')),
  _uuid = require('uuid'),
  _fs = require('fs'),
  _child_process = require('child_process'),
  _path = require('path'),
  _response = _interopRequireDefault(require('./template/response')),
  _net = require('./net'),
  _util = require('./util'),
  _common = _interopRequireDefault(require('./common'));
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
var coreName = 'serviceCore',
  ServiceCore = (function (a) {
    function b(a) {
      var d;
      return (
        _classCallCheck(this, b),
        (d = c.call(this, a)),
        (process.env.name = coreName),
        [
          'addServerToTracking',
          'checkConnection',
          'databaseOperation',
          'destinationUnknown',
          'functionUnknown',
          'getMicroServiceSocket',
          'initConnectionToService',
          'initService',
          'initiateMicroServerConnection',
          'microServerCommunication',
          'processComError',
          'processComRequest',
          'removeServerFromTracking',
          'resolveMicroServiceSocket'
        ].forEach(function (a) {
          d[a] = d[a].bind(_assertThisInitialized(d));
        }),
        _possibleConstructorReturn(d, _assertThisInitialized(d))
      );
    }
    _inherits(b, a);
    var c = _createSuper(b);
    return (
      _createClass(b, [
        {
          key: 'databaseOperation',
          value: function databaseOperation(a, b, c, d) {
            var e = this;
            return setImmediate(function () {
              try {
                var f;
                return Object.prototype.hasOwnProperty.call(e.db, a)
                  ? d(
                      !0,
                      (f = e.db[a])[b].apply(f, _toConsumableArray(c)),
                      null
                    )
                  : d(
                      !1,
                      void 0,
                      new Error('The table '.concat(a, ' does not exist!'))
                    );
              } catch (a) {
                return d(!1, void 0, a);
              }
            });
          }
        },
        {
          key: 'getProcessIndex',
          value: function getProcessIndex(a, b) {
            return this.serviceData[a].port.indexOf(b);
          }
        },
        {
          key: 'addServerToTracking',
          value: function addServerToTracking(a, b, c) {
            return (this.inUsePorts.includes(b) || this.inUsePorts.push(b),
            (process.env.exitedProcessPorts = ('string' ==
            typeof process.env.exitedProcessPorts
              ? process.env.exitedProcessPorts.split(',')
              : process.env.exitedProcessPorts
            )
              .map(function (a) {
                return parseInt(a, 10);
              })
              .filter(function (a) {
                return 'number' == typeof b && a !== b;
              })),
            Object.prototype.hasOwnProperty.call(this.serviceData, a))
              ? ((this.serviceData[a] = _objectSpread(
                  _objectSpread({}, this.serviceData[a]),
                  {},
                  {
                    socketList: this.serviceData[a].socketList.concat(void 0),
                    port: this.serviceData[a].port.concat(b),
                    instanceId: this.serviceData[a].instanceId.concat(c),
                    process: this.serviceData[a].process.concat(void 0),
                    connectionCount: this.serviceData[a].connectionCount.concat(
                      0
                    )
                  }
                )),
                !0)
              : ((this.serviceData[a] = {
                  instanceId: [c],
                  socketList: [void 0],
                  status: !1,
                  error: !1,
                  port: [b],
                  connectionCount: [0],
                  process: [void 0]
                }),
                !0);
          }
        },
        {
          key: 'removeServerFromTracking',
          value: function removeServerFromTracking(a, b) {
            var c = this.serviceData[a].port.indexOf(b);
            return (
              (this.inUsePorts = this.inUsePorts.filter(function (a) {
                return a !== b;
              })),
              void (
                -1 < c &&
                (this.serviceData[a].instanceId.splice(c, 1),
                this.serviceData[a].socketList.splice(c, 1),
                this.serviceData[a].port.splice(c, 1),
                this.serviceData[a].process.splice(c, 1),
                this.serviceData[a].connectionCount.splice(c, 1))
              )
            );
          }
        },
        {
          key: 'initService',
          value: function initService(a, b) {
            var c = this,
              d = void 0,
              e = (0, _uuid.v4)(),
              f = function () {
                return new Promise(function (f, g) {
                  var h = (function () {
                    var i = _asyncToGenerator(
                      regeneratorRuntime.mark(function i() {
                        return regeneratorRuntime.wrap(
                          function (i) {
                            for (;;)
                              switch ((i.prev = i.next)) {
                                case 0:
                                  return (
                                    (i.prev = 0),
                                    (i.next = 3),
                                    (0, _util.findAFreePort)(c)
                                  );
                                case 3:
                                  if (
                                    ((d = i.sent), !c.inUsePorts.includes(d))
                                  ) {
                                    i.next = 6;
                                    break;
                                  }
                                  return i.abrupt('return', setTimeout(h, 50));
                                case 6:
                                  return (
                                    c.addServerToTracking(a, d, e),
                                    (c.serviceData[a].error = !1),
                                    (c.serviceData[a].process[
                                      c.getProcessIndex(a, d)
                                    ] = (0, _child_process.exec)(
                                      ''
                                        .concat(process.execPath, ' ')
                                        .concat(__dirname, '/server/entry.js'),
                                      {
                                        maxBuffer: 1024 * c.settings.maxBuffer,
                                        env: {
                                          parentPid: process.pid,
                                          verbose: process.env.verbose,
                                          name: a,
                                          instanceId: e,
                                          port: d,
                                          service: !0,
                                          operations: c.serviceInfo[a],
                                          settings: JSON.stringify(c.settings),
                                          options: JSON.stringify(
                                            c.serviceOptions[a]
                                          ),
                                          serviceInfo: JSON.stringify(
                                            c.serviceInfo
                                          )
                                        }
                                      },
                                      function (b, f, g) {
                                        c.removeServerFromTracking(a, d),
                                          (b || g) &&
                                            (c.serviceData[a].error = !0),
                                          (0, _util.handleOnData)(c, d, e)(
                                            a,
                                            'event',
                                            'Micro service - '.concat(
                                              a,
                                              ': Process has exited!'
                                            )
                                          );
                                      }
                                    )),
                                    i.abrupt('return', f(b(!0)))
                                  );
                                case 12:
                                  return (
                                    (i.prev = 12),
                                    (i.t0 = i['catch'](0)),
                                    i.abrupt('return', g(Error(i.t0)))
                                  );
                                case 15:
                                case 'end':
                                  return i.stop();
                              }
                          },
                          i,
                          null,
                          [[0, 12]]
                        );
                      })
                    );
                    return function () {
                      return i.apply(this, arguments);
                    };
                  })();
                  return h();
                });
              },
              g = (function () {
                var b = _asyncToGenerator(
                  regeneratorRuntime.mark(function b(h) {
                    return regeneratorRuntime.wrap(
                      function (b) {
                        for (;;)
                          switch ((b.prev = b.next)) {
                            case 0:
                              return (b.prev = 0), (b.next = 3), f();
                            case 3:
                              return (
                                (b.next = 5),
                                new Promise(function (b) {
                                  ['stdout', 'stderr'].forEach(function (b) {
                                    return c.serviceData[a].process[
                                      c.getProcessIndex(a, d)
                                    ][b].on('data', function (f) {
                                      return (0, _util.handleOnData)(c, d, e)(
                                        a,
                                        b,
                                        f
                                      );
                                    });
                                  }),
                                    ['exit'].forEach(function (b) {
                                      return c.serviceData[a].process[
                                        c.getProcessIndex(a, d)
                                      ].on(b, function () {
                                        setTimeout(function () {
                                          process.env.exitedProcessPorts
                                            .split(',')
                                            .map(function (a) {
                                              return parseInt(a, 10);
                                            })
                                            .includes(d) || g(h);
                                        }, c.settings.restartTimeout);
                                      });
                                    }),
                                    b();
                                })
                              );
                            case 5:
                              return (
                                (b.next = 7),
                                new Promise(function (b) {
                                  c.initConnectionToService(a, d, function () {
                                    h.apply(void 0, arguments), b();
                                  });
                                })
                              );
                            case 7:
                              b.next = 12;
                              break;
                            case 9:
                              throw (
                                ((b.prev = 9),
                                (b.t0 = b['catch'](0)),
                                new Error(b.t0))
                              );
                            case 12:
                            case 'end':
                              return b.stop();
                          }
                      },
                      b,
                      null,
                      [[0, 9]]
                    );
                  })
                );
                return function () {
                  return b.apply(this, arguments);
                };
              })();
            g(b);
          }
        },
        {
          key: 'writeToLogFile',
          value: function writeToLogFile(a) {
            var b = this;
            return this.settings.logPath
              ? (0, _mkdirp['default'])(
                  (0, _path.dirname)(this.settings.logPath)
                )
                  .then(function () {
                    return (
                      b.logFileStream ||
                        (b.logFileStream = (0, _fs.createWriteStream)(
                          b.settings.logPath,
                          { flags: 'a' }
                        )),
                      b.logFileStream.write(''.concat(a, '\n'))
                    );
                  })
                  ['catch'](function (a) {
                    a &&
                      b.log(
                        'Unable to write to log file. MORE INFO: '.concat(a),
                        'warn'
                      );
                  })
              : void 0;
          }
        },
        {
          key: 'initiateMicroServerConnection',
          value: function initiateMicroServerConnection(a, b) {
            var c = this,
              d = 0,
              e = this.settings.msConnectionTimeout,
              f = (0, _net.createSpeakerReconnector)(a),
              g = function () {
                return 0 === Object.values(f.sockets).length
                  ? d <= e
                    ? setTimeout(function () {
                        g(), (d += 1);
                      }, 10)
                    : ((f.error = 'Socket initialization timeout...'),
                      c.log(
                        'Socket initialization timeout. PORT: '.concat(a),
                        'log'
                      ))
                  : (c.log(
                      'Service core successfully initialized socket on port: '.concat(
                        a
                      ),
                      'log'
                    ),
                    b(f));
              };
            return g();
          }
        },
        {
          key: 'initConnectionToService',
          value: function initConnectionToService(a, b, c) {
            var d = this;
            return this.initiateMicroServerConnection(b, function (e) {
              return Object.prototype.hasOwnProperty.call(e, 'error')
                ? (d.log(
                    'Unable to connect to service - '.concat(
                      a,
                      '. Retrying...'
                    ),
                    'log'
                  ),
                  (d.serviceData[a].status = !1),
                  setTimeout(function () {
                    return d.initConnectionToService(a, b, c);
                  }, d.settings.connectionTimeout))
                : (d.log(
                    'Service core has successfully connected to micro service: '.concat(
                      b
                    )
                  ),
                  (d.serviceData[a].status = !0),
                  (d.serviceData[a].socketList[d.getProcessIndex(a, b)] = e),
                  c(!0, e));
            });
          }
        },
        {
          key: 'processComError',
          value: function processComError(a, b) {
            if (!a) {
              var c = new _response['default']();
              return (
                c.setTransportStatus({
                  code: 5001,
                  message: 'No data received'
                }),
                c.setCommandStatus({
                  code: 500,
                  message:
                    'Command not executed, tansport failure  or no data recieved!'
                }),
                c.setErrData({
                  entity: 'Service core',
                  action: 'Request error handling',
                  originalData: a
                }),
                this.log('No data received. MORE INFO: '.concat(c), 'log'),
                b.reply(c)
              );
            }
          }
        },
        {
          key: 'microServerCommunication',
          value: (function () {
            var a = _asyncToGenerator(
              regeneratorRuntime.mark(function a(b, c, d, e) {
                var f,
                  g,
                  h,
                  i,
                  j = this;
                return regeneratorRuntime.wrap(
                  function (a) {
                    for (;;)
                      switch ((a.prev = a.next)) {
                        case 0:
                          if (0 !== d.status) {
                            a.next = 2;
                            break;
                          }
                          return a.abrupt('return', 'connectionNotReady');
                        case 2:
                          return (
                            (a.next = 4),
                            this.getMicroServiceSocket(
                              b.destination,
                              d.socketList
                            )
                          );
                        case 4:
                          return (
                            (f = a.sent),
                            (g = _slicedToArray(f, 2)),
                            (h = g[0]),
                            (i = g[1]),
                            (this.serviceData[b.destination].connectionCount[
                              i
                            ] += 1),
                            a.abrupt(
                              'return',
                              h.request('SERVICE_REQUEST', b, function (a) {
                                return (
                                  c.reply(a),
                                  !1 === b.keepAlive && c.conn.destroy(),
                                  !1 === b.keepAlive
                                    ? j.log(
                                        '['.concat(
                                          e,
                                          '] Service core has closed the connection!'
                                        ),
                                        'log'
                                      )
                                    : j.log(
                                        '['.concat(
                                          e,
                                          '] Service core has not closed this connection, this socket can be reused or manually closed via socket.conn.destroy()'
                                        ),
                                        'log'
                                      ),
                                  'connectionReady'
                                );
                              })
                            )
                          );
                        case 10:
                        case 'end':
                          return a.stop();
                      }
                  },
                  a,
                  this
                );
              })
            );
            return function microServerCommunication() {
              return a.apply(this, arguments);
            };
          })()
        },
        {
          key: 'checkConnection',
          value: function checkConnection(a, b, c, d, e) {
            var f = this,
              g = this.microServerCommunication(a, b, c, d),
              h = e;
            if ('connectionNotReady' === g) {
              if (h > this.settings.msConnectionRetryLimit) {
                this.log(
                  'Service connection initiation attempts, maximum reached'
                );
                var i = new _response['default']();
                return (
                  i.setTransportStatus({
                    code: 5002,
                    message:
                      'Reached maximum service connection initiation attempts!'
                  }),
                  i.setCommandStatus({
                    code: 500,
                    message: 'Command not executed, tansport failure!'
                  }),
                  i.setErrData({
                    entity: 'Service core',
                    action: 'Service redirection',
                    originalData: a
                  }),
                  b.reply(i),
                  b.conn.destroy()
                );
              }
              return (
                (h += 1),
                setTimeout(function () {
                  return f.checkConnection(a, b, c, d, h);
                }, 10)
              );
            }
            return this.log(
              '['.concat(
                d,
                '] Local socket connection handed over successfully!'
              )
            );
          }
        },
        {
          key: 'getMicroServiceSocket',
          value: function getMicroServiceSocket(a, b) {
            var c = this;
            return new Promise(function (d) {
              var e,
                f = function () {
                  e = c.resolveMicroServiceSocket(a, b);
                  var g = e,
                    h = _slicedToArray(g, 2),
                    i = h[0],
                    j = h[1];
                  i
                    ? d([i, j])
                    : setTimeout(function () {
                        f();
                      }, 1);
                };
              f();
            });
          }
        },
        {
          key: 'resolveMicroServiceSocket',
          value: function resolveMicroServiceSocket(a, b) {
            switch (!0) {
              case 'function' == typeof this.serviceOptions[a].loadBalancing:
                return this.serviceOptions[a].loadBalancing(b);
              case 'roundRobin' === this.serviceOptions[a].loadBalancing: {
                var c = this.serviceData[a].connectionCount.indexOf(
                  Math.min.apply(
                    Math,
                    _toConsumableArray(this.serviceData[a].connectionCount)
                  )
                );
                return [b[c], c];
              }
              case 'random' === this.serviceOptions[a].loadBalancing:
                return (0, _util.randomScheduling)(b);
              default:
                return (
                  this.log(
                    'Load balancing strategy for '.concat(
                      a,
                      ' is incorrect. Defaulting to "random" strategy...'
                    ),
                    'warn'
                  ),
                  (0, _util.randomScheduling)(b)
                );
            }
          }
        },
        {
          key: 'functionUnknown',
          value: function functionUnknown(a) {
            this.log(
              'Request received & destination verified but function unknown. MORE INFO: '.concat(
                a.destination
              )
            );
            var b = new _response['default']();
            return (
              b.setTransportStatus({
                code: 5007,
                message:
                  'Request received & destination verified but function unknown!'
              }),
              b.setCommandStatus({
                code: 503,
                message: 'Command not executed, function unknown!'
              }),
              b.setErrData({
                entity: 'Service core',
                action: 'Service redirection',
                originalData: a
              }),
              b
            );
          }
        },
        {
          key: 'destinationUnknown',
          value: function destinationUnknown(a) {
            this.log(
              'Request received but destination unknown. MORE INFO: '.concat(
                a.destination
              )
            );
            var b = new _response['default']();
            return (
              b.setTransportStatus({
                code: 5005,
                message: 'Request recieved but destination unknown!'
              }),
              b.setCommandStatus({
                code: 500,
                message: 'Command not executed, transport failure!'
              }),
              b.setErrData({
                entity: 'Service core',
                action: 'Service redirection',
                originalData: a
              }),
              b
            );
          }
        },
        {
          key: 'processComRequest',
          value: function processComRequest(a, b, c) {
            var d = this;
            switch (!0) {
              case a.destination === process.env.name:
                return setImmediate(function () {
                  var c = (0, _util.buildResponseFunctions)(
                    b,
                    a,
                    d.operationScope
                  );
                  return Object.prototype.hasOwnProperty.call(
                    d.coreOperations,
                    a.data.functionName
                  )
                    ? d.coreOperations[a.data.functionName](c)
                    : (0, _util.handleReplyToSocket)(
                        d.functionUnknown(a),
                        b,
                        !1
                      );
                });
              case Object.prototype.hasOwnProperty.call(
                this.serviceData,
                a.destination
              ): {
                var e = this.serviceData[a.destination];
                return this.checkConnection(a, b, e, c, 0);
              }
              default:
                return (0, _util.handleReplyToSocket)(
                  this.destinationUnknown(a),
                  b,
                  !1
                );
            }
          }
        }
      ]),
      b
    );
  })(_common['default']),
  _default = ServiceCore;
exports['default'] = _default;
