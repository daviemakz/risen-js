'use strict';
Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.sendRequest = sendRequest),
  (exports.requestChain = requestChain),
  (exports.request = request),
  (exports.requestOperations = void 0);
var _response = _interopRequireDefault(require('../template/response')),
  _command = _interopRequireDefault(require('../template/command')),
  _net = require('../net'),
  _util = require('../util');
function _interopRequireDefault(a) {
  return a && a.__esModule ? a : { default: a };
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
var getProcessType = function () {
    return 'true' === process.env.service ? 'Micro service' : 'Service core';
  },
  executeCallback = function (a) {
    var b = a.responseData,
      c = a.resBody,
      d = a.portEmitter;
    return 'function' == typeof c.callback
      ? c.callback(b, c, d || void 0)
      : void 0;
  };
function sendRequest(a, b) {
  var c = this,
    d = !!(2 < arguments.length && arguments[2] !== void 0) && arguments[2],
    e =
      3 < arguments.length && arguments[3] !== void 0
        ? arguments[3]
        : { address: this.settings.address, connectionId: this.conId },
    f = 4 < arguments.length && arguments[4] !== void 0 ? arguments[4] : void 0,
    g =
      5 < arguments.length && arguments[5] !== void 0
        ? arguments[5]
        : function () {},
    h = 0,
    i = f || (0, _net.createSpeaker)(e.address),
    j = { data: a, destination: b, callback: g, keepAlive: d },
    k = function () {
      if (0 === Object.values(i.sockets).length) {
        if (h <= c.settings.connectionTimeout)
          return (
            c.log('Service core socket has not yet initialized...', 'log'),
            setTimeout(function () {
              return k(), void (h += 1);
            }, 1)
          );
        c.log(
          'Unable to connect to service core. MORE INFO: '.concat(
            j.destination
          ),
          'log'
        );
        var a = new _response['default']();
        return (
          a.setTransportStatus({
            code: 5003,
            message: 'Unable to connect to service core.'
          }),
          a.setCommandStatus({
            code: 500,
            message: 'Command not executed, transport failure!'
          }),
          a.setErrData({
            entity: 'Client request',
            action: 'Connect to service core',
            originalData: j
          }),
          c.log('Socket initialization timeout...', 'log'),
          'function' == typeof j.callback ? j.callback(a, j, i) : void 0
        );
      }
      return (
        c.log('Socket initialized. sending data...', 'log'),
        i.request('COM_REQUEST', j, function (a) {
          if (Object.prototype.hasOwnProperty.call(a, 'error')) {
            c.log(
              'Unable to connect to service. MORE INFO: '.concat(j.destination),
              'log'
            );
            var b = new _response['default']();
            return (
              b.setTransportStatus({
                code: 5004,
                message: 'Unable to connect to service: '.concat(j.destination)
              }),
              b.setCommandStatus({
                code: 500,
                message: 'Command not executed, tansport failure!'
              }),
              b.setErrData({
                entity: 'Client request',
                action: 'Connect to service: '.concat(j.destination),
                originalData: j
              }),
              c.log(
                'Unable to transmit data to: '.concat(j.destination),
                'log'
              ),
              executeCallback({ responseData: a, resBody: j, portEmitter: i })
            );
          }
          switch (!0) {
            case 'client' === c.settings.mode:
              return (
                c.log(
                  '['
                    .concat(
                      e.connectionId,
                      '] ',
                      'Service core (client)',
                      ' has processed request for service: '
                    )
                    .concat(j.destination),
                  'log'
                ),
                executeCallback({ responseData: a, resBody: j, portEmitter: i })
              );
            case 'true' === process.env.service:
              return (
                c.log(
                  '['
                    .concat(e.connectionId, '] ')
                    .concat(
                      getProcessType(),
                      ' has processed request for service: '
                    )
                    .concat(j.destination),
                  'log'
                ),
                executeCallback({ responseData: a, resBody: j, portEmitter: i })
              );
            case 'false' === process.env.service: {
              var d =
                Object.prototype.hasOwnProperty.call(
                  c.serviceInfo,
                  j.destination
                ) ||
                ('false' === process.env.service &&
                  'serviceCore' === j.destination);
              return (
                d
                  ? c.log(
                      '['
                        .concat(e.connectionId, '] ')
                        .concat(
                          getProcessType(),
                          ' has processed request for service: '
                        )
                        .concat(j.destination),
                      'log'
                    )
                  : c.log(
                      '['
                        .concat(e.connectionId, '] ')
                        .concat(
                          getProcessType(),
                          ' was unable to find the service: '
                        )
                        .concat(j.destination),
                      'log'
                    ),
                executeCallback({ responseData: a, resBody: j, portEmitter: i })
              );
            }
            default:
              throw new Error(
                'Unexpected condition, cannot handle callback for sendRequest()'
              );
          }
        })
      );
    };
  return k();
}
function requestChain(a, b) {
  var c = this,
    d = [],
    e = void 0,
    f = a.map(function (a, b, f) {
      var g = a.destination,
        h = a.functionName,
        i = a.body,
        j = a.address,
        k = a.generateBody,
        l = a.generateCommand;
      return function () {
        return new Promise(function (a, m) {
          var n = f.length === b + 1,
            o = 'function' == typeof k ? k(i, d) : i,
            p =
              'function' == typeof l
                ? l(i, d)
                : { destination: g, functionName: h, body: o, address: j };
          try {
            c.request(
              Object.assign(
                p,
                _objectSpread(
                  { socket: e },
                  n ? { keepAlive: !1 } : { keepAlive: !0 }
                )
              ),
              function (b, c, f) {
                (e = f), d.push(b), a(b);
              }
            );
          } catch (a) {
            c.log(
              'An error occurred in the request chain while communicating with a micro service: '.concat(
                a
              ),
              'error'
            ),
              m(a);
          }
        });
      };
    });
  return new Promise(function (a, g) {
    try {
      (0, _util.executePromisesInOrder)(
        [].concat(_toConsumableArray(f), [
          function () {
            return new Promise(function (c) {
              c(), 'function' == typeof b && b(d), a(d);
            });
          }
        ])
      );
    } catch (a) {
      c.log('An error occurred in the request chain: '.concat(a), 'error'),
        g(a);
    }
  });
}
function request(a, b) {
  var c = this,
    d = a.body,
    e = void 0 === d ? null : d,
    f = a.destination,
    g = void 0 === f ? void 0 : f,
    h = a.functionName,
    i = void 0 === h ? '' : h,
    j = a.address,
    k = void 0 === j ? void 0 : j,
    l = a.keepAlive,
    m = a.socket,
    n = void 0 === m ? void 0 : m;
  return new Promise(function (a, d) {
    var f = new _command['default'](),
      h = c.conId;
    f.setDestination(g), f.setFuncName(i), f.setBody(e);
    try {
      return c.sendRequest(
        f,
        g,
        void 0 !== l && l,
        k ? { address: k, connectionId: h } : void 0,
        n,
        function (c, d, e) {
          var f = Object.assign(new _response['default'](), c);
          return (
            'function' == typeof b && b(f.getResponse(), d, e),
            a(f.getResponse(), d, e)
          );
        }
      );
    } catch (a) {
      return (
        c.log(
          'An error occurred while communicating with a micro service: '.concat(
            a
          ),
          'error'
        ),
        d(a)
      );
    }
  });
}
var requestOperations = {
  requestChain: requestChain,
  sendRequest: sendRequest,
  request: request
};
exports.requestOperations = requestOperations;
