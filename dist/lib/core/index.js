'use strict';
var _exportNames = {
  uniqueArray: !0,
  getRandomElements: !0,
  startService: !0,
  stopService: !0,
  end: !0,
  storage: !0,
  changeInstances: !0
};
var _request = require('./request');
Object.defineProperty(exports, '__esModule', { value: !0 });
(exports.uniqueArray = uniqueArray),
  (exports.getRandomElements = getRandomElements),
  (exports.startService = startService),
  (exports.stopService = stopService),
  (exports.end = end),
  (exports.storage = storage),
  (exports.changeInstances = changeInstances),
  (exports['default'] = void 0),
  require('regenerator-runtime');
Object.keys(_request).forEach(function (a) {
  'default' === a ||
    '__esModule' === a ||
    Object.prototype.hasOwnProperty.call(_exportNames, a) ||
    Object.defineProperty(exports, a, {
      enumerable: !0,
      get: function get() {
        return _request[a];
      }
    });
});
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
function uniqueArray(a) {
  return a.filter(function (a, b, c) {
    return c.indexOf(a) === b;
  });
}
function getRandomElements(a, b) {
  var c = _toConsumableArray(a);
  return _toConsumableArray(Array(b)).map(function () {
    return c.splice(Math.floor(Math.random() * c.length), 1)[0];
  });
}
function startService(a, b) {
  return this.startServices(a, b);
}
function stopService(a, b) {
  var c = this;
  return new Promise(function (d, f) {
    var g = Math.abs(b),
      h = c.serviceData[a].port.length,
      i = g > h ? h : g;
    if (0 === i) return d(void 0);
    var j = getRandomElements(c.serviceData[a].port, i);
    (process.env.exitedProcessPorts = uniqueArray(
      [].concat(process.env.exitedProcessPorts, j)
    )),
      ('string' == typeof process.env.exitedProcessPorts
        ? process.env.exitedProcessPorts.split(',')
        : process.env.exitedProcessPorts
      )
        .map(function (a) {
          return parseInt(a, 10);
        })
        .filter(function (a) {
          return 'number' == typeof a;
        });
    var k = j.map(function (b) {
      return c.getProcessIndex(a, b);
    });
    try {
      return (
        k.forEach(
          (function () {
            var b = _asyncToGenerator(
              regeneratorRuntime.mark(function b(d, e) {
                return regeneratorRuntime.wrap(function (b) {
                  for (;;)
                    switch ((b.prev = b.next)) {
                      case 0:
                        return b.abrupt(
                          'return',
                          new Promise(function (b, f) {
                            c.log(
                              'Service core will send kill command to the service: '
                                .concat(a, '/port:')
                                .concat(j[e]),
                              'log'
                            ),
                              c.serviceData[a].clientSocket[d].request(
                                'SERVICE_KILL',
                                void 0,
                                function (d) {
                                  c.log(
                                    'Service core has recieved acknowledgement of kill command from: '
                                      .concat(a, '/port:')
                                      .concat(j[e]),
                                    'log'
                                  ),
                                    200 === d.status.command.code
                                      ? b(!0)
                                      : f(Error(!1));
                                }
                              );
                          })
                        );
                      case 1:
                      case 'end':
                        return b.stop();
                    }
                }, b);
              })
            );
            return function () {
              return b.apply(this, arguments);
            };
          })()
        ),
        d(void 0)
      );
    } catch (a) {
      return f(a);
    }
  });
}
function end(a) {
  var b = a.sendSuccess;
  return (
    b({
      result: {
        error: null,
        details: {},
        isSuccess: !0,
        message: 'Shutting down micro service framework.'
      }
    }),
    setTimeout(function () {
      return process.exit();
    }, 1e3)
  );
}
function storage(a) {
  var b = this,
    c = a.data,
    d = a.sendError,
    e = a.sendSuccess,
    f = c.body,
    g = f.table,
    h = f.method,
    i = f.args;
  return setImmediate(function () {
    return b.databaseOperation(g, h, i, function (a, b, c) {
      return a
        ? e({
            result: {
              isSuccess: a,
              result: b,
              message: 'The operation completed successfully!'
            }
          })
        : d({
            result: {
              isSuccess: a,
              result: b,
              error: c,
              message: 'The operation failed!'
            },
            code: 401,
            message:
              'Command executed but an error occurred while attempting storage operation.'
          });
    });
  });
}
function changeInstances() {
  return _changeInstances.apply(this, arguments);
}
function _changeInstances() {
  return (
    (_changeInstances = _asyncToGenerator(
      regeneratorRuntime.mark(function a(b) {
        var c, d, e, f, g, h, i, j, k, l, m;
        return regeneratorRuntime.wrap(
          function (a) {
            for (;;)
              switch ((a.prev = a.next)) {
                case 0:
                  if (
                    ((c = b.data),
                    (d = b.sendError),
                    (e = b.sendSuccess),
                    (f = c.body),
                    (g = f.name),
                    (h = f.instances),
                    (i = { error: null, details: {} }),
                    Object.keys(this.serviceInfo).includes(g))
                  ) {
                    a.next = 7;
                    break;
                  }
                  d({
                    result: Object.assign(i, {
                      isSuccess: !1,
                      message: 'Service "'.concat(g, '" was not found!')
                    })
                  }),
                    (a.next = 24);
                  break;
                case 7:
                  if ('number' == typeof h && 0 !== h) {
                    a.next = 11;
                    break;
                  }
                  d({
                    result: Object.assign(i, {
                      isSuccess: !1,
                      message:
                        '"instance" property must be a number which is not 0!'
                    })
                  }),
                    (a.next = 24);
                  break;
                case 11:
                  if (
                    ((k = (j = []).concat.apply(
                      j,
                      _toConsumableArray(this.serviceData[g].port)
                    )),
                    !(0 < h))
                  ) {
                    a.next = 18;
                    break;
                  }
                  return (
                    (a.next = 15),
                    startService.call(
                      this,
                      _defineProperty({}, g, this.serviceInfo[g]),
                      h
                    )
                  );
                case 15:
                  (a.t0 = a.sent), (a.next = 21);
                  break;
                case 18:
                  return (a.next = 20), stopService.call(this, g, h);
                case 20:
                  a.t0 = a.sent;
                case 21:
                  (l = a.t0),
                    (m = this.serviceData[g].port),
                    'undefined' == typeof l
                      ? e({
                          result: Object.assign(i, {
                            isSuccess: !0,
                            message: 'Services were modified successfully!',
                            details: {
                              instances: m.length,
                              name: g,
                              previousPorts: k,
                              nextPorts: m
                            }
                          })
                        })
                      : d({
                          result: Object.assign(i, {
                            isSuccess: !1,
                            message: 'Services modification failed!',
                            details: {
                              instances: m.length,
                              name: g,
                              previousPorts: k,
                              nextPorts: m
                            }
                          }),
                          code: 402,
                          message:
                            'Command executed but an error occurred while attempting to change instances'
                        });
                case 24:
                case 'end':
                  return a.stop();
              }
          },
          a,
          this
        );
      })
    )),
    _changeInstances.apply(this, arguments)
  );
}
var _default = {
  end: end,
  storage: storage,
  changeInstances: changeInstances,
  uniqueArray: uniqueArray,
  getRandomElements: getRandomElements
};
exports['default'] = _default;
