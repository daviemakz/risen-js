'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.defaultInstanceOptions = exports.eventList = exports.defaultServiceOptions = exports.buildHttpOptions = exports.buildSecureOptions = exports.hardenServer = void 0;

var _fs = require('fs');

var _path = require('path');

var _helmet = _interopRequireDefault(require('helmet'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
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

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === 'Object' && o.constructor) n = o.constructor.name;
  if (n === 'Map' || n === 'Set') return Array.from(o);
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
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

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
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
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
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

var hardenServer = function hardenServer(expressApp) {
  return expressApp.use((0, _helmet['default'])());
};

exports.hardenServer = hardenServer;

var buildSecureOptions = function buildSecureOptions(ssl) {
  try {
    return _typeof(ssl) === 'object'
      ? Object.entries(
          _objectSpread(
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
    port: Object.prototype.hasOwnProperty.call(options, 'port')
      ? options.port
      : 8888,
    ssl: buildSecureOptions(options.ssl),
    harden: Object.prototype.hasOwnProperty.call(options, 'harden')
      ? options.harden
      : true,
    beforeStart: Object.prototype.hasOwnProperty.call(options, 'beforeStart')
      ? options.beforeStart
      : function(express) {
          return express;
        },
    middlewares: Object.prototype.hasOwnProperty.call(options, 'middlewares')
      ? options.middlewares
      : [],
    static: Object.prototype.hasOwnProperty.call(options, 'static')
      ? options['static']
      : [],
    routes: Object.prototype.hasOwnProperty.call(options, 'routes')
      ? options.routes
      : []
  };
};

exports.buildHttpOptions = buildHttpOptions;
var defaultServiceOptions = {
  loadBalancing: 'roundRobin',
  runOnStart: [],
  instances: 1
};
exports.defaultServiceOptions = defaultServiceOptions;
var eventList = ['uncaughtException', 'unhandledRejection'];
exports.eventList = eventList;
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
