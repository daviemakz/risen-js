'use strict';
var _validator = require('validator');
Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.validateServiceOptions = exports.validateOptions = exports.validateCoreOperations = exports.validateHttpOptions = exports.validateRouteOptions = void 0);
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
var validateRouteOptions = function (a) {
  switch (!0) {
    case !['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(
      (a.method || '').toUpperCase()
    ):
      throw new Error('The http route option "method" is invalid!');
    case 'string' != typeof a.uri:
      throw new Error('The http route option "uri" must be a string!');
    case Object.prototype.hasOwnProperty.call(a, 'preMiddleware') &&
      !Array.isArray(a.preMiddleware):
      throw new Error(
        'The http route option "preMiddleware" must be an array!'
      );
    case Object.prototype.hasOwnProperty.call(a, 'preMiddleware') &&
      !Array.isArray(a.postMiddleware):
      throw new Error(
        'The http route option "postMiddleware" must be an array!'
      );
    case 'function' != typeof a.handler:
      throw new Error('The http route option "handler" must be a function!');
    default:
      return !0;
  }
};
exports.validateRouteOptions = validateRouteOptions;
var validateHttpOptions = function (a) {
  return a.every(function (a) {
    switch (!0) {
      case Object.prototype.hasOwnProperty.call(!a, 'port') ||
        'number' != typeof a.port:
        throw new Error('The http option "port" must be a number!');
      case Object.prototype.hasOwnProperty.call(a, 'ssl') &&
        !['object', 'boolean'].includes(_typeof(a.ssl)):
        throw new Error(
          'The http option "ssl" must be a boolean false or an object with the keys: {key, ca, cert}'
        );
      case Object.prototype.hasOwnProperty.call(a, 'harden') &&
        'boolean' != typeof a.harden:
        throw new Error('The http option "harden" must be a boolean!');
      case Object.prototype.hasOwnProperty.call(a, 'beforeStart') &&
        'function' != typeof a.beforeStart:
        throw new Error('The http option "beforeStart" must be a function!');
      case Object.prototype.hasOwnProperty.call(a, 'middlewares') &&
        !Array.isArray(a.middlewares):
        throw new Error('The http option "middlewares" must be an array!');
      case Object.prototype.hasOwnProperty.call(a, 'static') &&
        !Array.isArray(a['static']):
        throw new Error('The http option "static" must be an array!');
      case (Object.prototype.hasOwnProperty.call(a, 'routes') &&
        !Array.isArray(a.routes)) ||
        !a.routes.every(function (a) {
          return validateRouteOptions(a);
        }):
        throw new Error(
          'The http option "routes" must be an array with valid configuration!'
        );
      default:
        return !0;
    }
  });
};
exports.validateHttpOptions = validateHttpOptions;
var validateCoreOperations = function (a) {
  return (
    !!(a instanceof Object) &&
    Object.entries(a).every(function (a) {
      var b = _slicedToArray(a, 2),
        c = b[0],
        d = b[1];
      return 'string' == typeof c && 'function' == typeof d;
    })
  );
};
exports.validateCoreOperations = validateCoreOperations;
var validateOptions = function (a) {
  switch (!0) {
    case Object.prototype.hasOwnProperty.call(a, 'mode') &&
      !['server', 'client'].includes(a.mode):
      throw new Error(
        'The "mode" option is not valid, it can only be "server" or "client"'
      );
    case Object.prototype.hasOwnProperty.call(a, 'http') &&
      !validateHttpOptions(a.http):
      throw new Error(
        'The "http" option is not valid, consult documentation for more information'
      );
    case Object.prototype.hasOwnProperty.call(a, 'databaseNames') &&
      !Array.isArray(a.databaseNames):
      throw new Error(
        'The "databaseNames" option is not valid, it must be an array of strings'
      );
    case Object.prototype.hasOwnProperty.call(a, 'verbose') &&
      'boolean' != typeof a.verbose:
      throw new Error(
        'The "verbose" option is not valid, it must be an boolean'
      );
    case Object.prototype.hasOwnProperty.call(a, 'maxBuffer') &&
      'number' != typeof a.maxBuffer:
      throw new Error(
        'The "maxBuffer" option is not valid, it must be a number'
      );
    case Object.prototype.hasOwnProperty.call(a, 'logPath') &&
      'string' != typeof a.logPath:
      throw new Error('The "logPath" option is not valid, it must be a string');
    case Object.prototype.hasOwnProperty.call(a, 'restartTimeout') &&
      'number' != typeof a.restartTimeout:
      throw new Error(
        'The "restartTimeout" option is not valid, it must be a number'
      );
    case Object.prototype.hasOwnProperty.call(a, 'connectionTimeout') &&
      'number' != typeof a.connectionTimeout:
      throw new Error(
        'The "connectionTimeout" option is not valid, it must be a number'
      );
    case Object.prototype.hasOwnProperty.call(a, 'msConnectionTimeout') &&
      'number' != typeof a.msConnectionTimeout:
      throw new Error(
        'The "msConnectionTimeout" option is not valid, it must be a number'
      );
    case Object.prototype.hasOwnProperty.call(a, 'msConnectionRetryLimit') &&
      'number' != typeof a.msConnectionRetryLimit:
      throw new Error(
        'The "msConnectionRetryLimit" option is not valid, it must be a number'
      );
    case Object.prototype.hasOwnProperty.call(a, 'address') &&
      'number' != typeof a.address &&
      !(0, _validator.isURL)(a.address, {
        protocols: ['http', 'https'],
        require_tld: !1,
        require_protocol: !1,
        require_host: !1,
        require_valid_protocol: !0
      }):
      throw new Error(
        'The "address" option is not valid, it must be a valid network address'
      );
    case Object.prototype.hasOwnProperty.call(a, 'portRangeStart') &&
      'number' != typeof a.portRangeStart:
      throw new Error(
        'The "portRangeStart" option is not valid, it must be a number'
      );
    case Object.prototype.hasOwnProperty.call(a, 'portRangeFinish') &&
      'number' != typeof a.portRangeFinish:
      throw new Error(
        'The "portRangeFinish" option is not valid, it must be a number'
      );
    case (Object.prototype.hasOwnProperty.call(a, 'runOnStart') &&
      !Array.isArray(a.runOnStart)) ||
      (Array.isArray(a.runOnStart) &&
        a.runOnStart.length &&
        a.runOnStart.every(function (a) {
          return 'string' != typeof a;
        })):
      throw new Error(
        'The "runOnStart" option is not valid, it must be a array of strings corresponding to defined operations'
      );
    case Object.prototype.hasOwnProperty.call(a, 'coreOperations') &&
      !validateCoreOperations(a.coreOperations):
      throw new Error(
        'The "coreOperations" option is not valid, it must be an object composed of strings ("operations") which map to functions'
      );
    default:
      return !0;
  }
};
exports.validateOptions = validateOptions;
var validateServiceOptions = function (a) {
  switch (!0) {
    case (Object.prototype.hasOwnProperty.call(a, 'runOnStart') &&
      !Array.isArray(a.runOnStart)) ||
      (Array.isArray(a.runOnStart) &&
        a.runOnStart.some(function (a) {
          return 'string' != typeof a;
        })):
      throw new Error(
        'The service options "runOnStart" option is not valid, it must be a valid array'
      );
    case Object.prototype.hasOwnProperty.call(a, 'loadBalancing') &&
      'function' != typeof a.loadBalancing &&
      !['random', 'roundRobin'].includes(a.loadBalancing):
      throw new Error(
        'The service options "loadBalancing" option is not valid, can either be "random" or "roundRobin" or a function(socketList)'
      );
    case Object.prototype.hasOwnProperty.call(a, 'instances') &&
      ('number' != typeof a.instances ||
        ('number' == typeof a.instances && 1 > a.instances)):
      throw new Error(
        'The service options "instances" option is not valid, it must be an number above 1'
      );
    case Object.prototype.hasOwnProperty.call(a, 'babelConfig') &&
      ('object' !== _typeof(a.babelConfig) || null === a.babelConfig):
      throw new Error(
        'The service options "babelConfig" option is not valid, it must be an object containing babel configuration'
      );
    default:
      return !0;
  }
};
exports.validateServiceOptions = validateServiceOptions;
