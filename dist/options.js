'use strict';
Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.defaultInstanceOptions = exports.eventList = exports.defaultServiceOptions = exports.buildHttpOptions = exports.buildSecureOptions = exports.hardenServer = void 0);
var _fs = require('fs'),
  _path = require('path'),
  _helmet = _interopRequireDefault(require('helmet'));
function _interopRequireDefault(a) {
  return a && a.__esModule ? a : { default: a };
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
function _arrayLikeToArray(a, b) {
  (null == b || b > a.length) && (b = a.length);
  for (var c = 0, d = Array(b); c < b; c++) d[c] = a[c];
  return d;
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
var hardenServer = function (a) {
  return a.use((0, _helmet['default'])());
};
exports.hardenServer = hardenServer;
var buildSecureOptions = function (a) {
  try {
    return 'object' === _typeof(a)
      ? Object.entries(
          _objectSpread({ key: void 0, cert: void 0, ca: void 0 }, a)
        )
          .filter(function (a) {
            var b = _slicedToArray(a, 2),
              c = b[1];
            return c;
          })
          .map(function (a) {
            var b = _slicedToArray(a, 2),
              c = b[0],
              d = b[1];
            return _defineProperty(
              {},
              c,
              (0, _fs.readFileSync)((0, _path.resolve)(d)).toString()
            );
          })
          .reduce(function (a, b) {
            return Object.assign(a, b);
          }, {})
      : a;
  } catch (a) {
    throw new Error(a);
  }
};
exports.buildSecureOptions = buildSecureOptions;
var buildHttpOptions = function (a) {
  return {
    port: Object.prototype.hasOwnProperty.call(a, 'port') ? a.port : 8888,
    ssl: buildSecureOptions(a.ssl),
    harden: !Object.prototype.hasOwnProperty.call(a, 'harden') || a.harden,
    beforeStart: Object.prototype.hasOwnProperty.call(a, 'beforeStart')
      ? a.beforeStart
      : function (a) {
          return a;
        },
    middlewares: Object.prototype.hasOwnProperty.call(a, 'middlewares')
      ? a.middlewares
      : [],
    static: Object.prototype.hasOwnProperty.call(a, 'static')
      ? a['static']
      : [],
    routes: Object.prototype.hasOwnProperty.call(a, 'routes') ? a.routes : []
  };
};
exports.buildHttpOptions = buildHttpOptions;
var defaultServiceOptions = {
  babelConfig: {},
  loadBalancing: 'roundRobin',
  runOnStart: [],
  instances: 1
};
exports.defaultServiceOptions = defaultServiceOptions;
var eventList = ['uncaughtException', 'unhandledRejection'];
exports.eventList = eventList;
var defaultInstanceOptions = {
  mode: 'server',
  http: !1,
  databaseNames: ['_defaultTable'],
  verbose: !0,
  maxBuffer: 50,
  logPath: void 0,
  restartTimeout: 50,
  connectionTimeout: 1e3,
  msConnectionTimeout: 1e4,
  msConnectionRetryLimit: 1e3,
  apiGatewayPort: 8080,
  portRangeStart: 1024,
  portRangeFinish: 65535,
  coreOperations: {},
  runOnStart: []
};
exports.defaultInstanceOptions = defaultInstanceOptions;
