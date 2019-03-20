'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.validateServiceOptions = exports.validateOptions = exports.validateCoreOperations = exports.validateHttpOptions = exports.validateRouteOptions = void 0;

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

var validateRouteOptions = function validateRouteOptions(route) {
  switch (true) {
    case !['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(
      (route.method || '').toUpperCase()
    ): {
      throw new Error('The http route option "method" is invalid!');
    }

    case typeof route.uri !== 'string': {
      throw new Error('The http route option "uri" must be a string!');
    }

    case route.hasOwnProperty('preMiddleware') &&
      !Array.isArray(route.preMiddleware): {
      throw new Error(
        'The http route option "preMiddleware" must be an array!'
      );
    }

    case !Array.isArray(route.postMiddleware): {
      throw new Error(
        'The http route option "postMiddleware" must be an array!'
      );
    }

    case typeof route.handler !== 'function': {
      throw new Error('The http route option "handler" must be a function!');
    }

    default: {
      return true;
    }
  }
};

exports.validateRouteOptions = validateRouteOptions;

var validateHttpOptions = function validateHttpOptions(httpOptions) {
  return httpOptions.every(function(http) {
    switch (true) {
      case !http.hasOwnProperty('port') || typeof http.port !== 'number': {
        throw new Error('The http option "port" must be a number!');
      }

      case http.hasOwnProperty('ssl') &&
        !['object', 'boolean'].includes(_typeof(http.ssl)): {
        throw new Error(
          'The http option "ssl" must be a boolean false or an object with the keys: {key, ca, cert}'
        );
      }

      case http.hasOwnProperty('harden') && typeof http.harden !== 'boolean': {
        throw new Error('The http option "harden" must be a boolean!');
      }

      case http.hasOwnProperty('beforeStart') &&
        typeof http.beforeStart !== 'function': {
        throw new Error('The http option "beforeStart" must be a function!');
      }

      case http.hasOwnProperty('middlewares') &&
        !Array.isArray(http.middlewares): {
        throw new Error('The http option "middlewares" must be an array!');
      }

      case http.hasOwnProperty('static') && !Array.isArray(http.static): {
        throw new Error('The http option "static" must be an array!');
      }

      case (http.hasOwnProperty('routes') && !Array.isArray(http.routes)) ||
        !http.routes.every(function(route) {
          return validateRouteOptions(route);
        }): {
        throw new Error(
          'The http option "routes" must be an array with valid configuration!'
        );
      }

      default: {
        return true;
      }
    }
  });
};

exports.validateHttpOptions = validateHttpOptions;

var validateCoreOperations = function validateCoreOperations(options) {
  return options instanceof Object
    ? Object.entries(options).every(function(_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          functionName = _ref2[0],
          functionOp = _ref2[1];

        return (
          typeof functionName === 'string' && typeof functionOp === 'function'
        );
      })
    : false;
};

exports.validateCoreOperations = validateCoreOperations;

var validateOptions = function validateOptions(options) {
  switch (true) {
    case options.hasOwnProperty('mode') &&
      !['server', 'client'].includes(options.mode): {
      throw new Error(
        'The "mode" option is not valid, it can only be "server" or "client"'
      );
    }

    case options.hasOwnProperty('http') && !validateHttpOptions(options.http): {
      throw new Error(
        'The "http" option is not valid, consult documentation for more information'
      );
    }

    case options.hasOwnProperty('databaseNames') &&
      !Array.isArray(options.databaseNames): {
      throw new Error(
        'The "databaseNames" option is not valid, it must be an array of strings'
      );
    }

    case options.hasOwnProperty('verbose') &&
      typeof options.verbose !== 'boolean': {
      throw new Error(
        'The "verbose" option is not valid, it must be an boolean'
      );
    }

    case options.hasOwnProperty('maxBuffer') &&
      typeof options.maxBuffer !== 'number': {
      throw new Error(
        'The "maxBuffer" option is not valid, it must be a number'
      );
    }

    case options.hasOwnProperty('logPath') &&
      typeof options.logPath !== 'string': {
      throw new Error('The "logPath" option is not valid, it must be a string');
    }

    case options.hasOwnProperty('restartTimeout') &&
      typeof options.restartTimeout !== 'number': {
      throw new Error(
        'The "restartTimeout" option is not valid, it must be a number'
      );
    }

    case options.hasOwnProperty('connectionTimeout') &&
      typeof options.connectionTimeout !== 'number': {
      throw new Error(
        'The "connectionTimeout" option is not valid, it must be a number'
      );
    }

    case options.hasOwnProperty('microServiceConnectionTimeout') &&
      typeof options.microServiceConnectionTimeout !== 'number': {
      throw new Error(
        'The "microServiceConnectionTimeout" option is not valid, it must be a number'
      );
    }

    case options.hasOwnProperty('microServiceConnectionAttempts') &&
      typeof options.microServiceConnectionAttempts !== 'number': {
      throw new Error(
        'The "microServiceConnectionAttempts" option is not valid, it must be a number'
      );
    }

    case options.hasOwnProperty('apiGatewayPort') &&
      typeof options.apiGatewayPort !== 'number': {
      throw new Error(
        'The "apiGatewayPort" option is not valid, it must be a number'
      );
    }

    case options.hasOwnProperty('portRangeStart') &&
      typeof options.portRangeStart !== 'number': {
      throw new Error(
        'The "portRangeStart" option is not valid, it must be a number'
      );
    }

    case options.hasOwnProperty('portRangeFinish') &&
      typeof options.portRangeFinish !== 'number': {
      throw new Error(
        'The "portRangeFinish" option is not valid, it must be a number'
      );
    }

    case (options.hasOwnProperty('runOnStart') &&
      !Array.isArray(options.runOnStart)) ||
      (Array.isArray(options.runOnStart) &&
        options.runOnStart.length &&
        options.runOnStart.every(function(op) {
          return typeof op !== 'string';
        })): {
      throw new Error(
        'The "runOnStart" option is not valid, it must be a array of strings corresponding to defined operations'
      );
    }

    case options.hasOwnProperty('coreOperations') &&
      !validateCoreOperations(options.coreOperations): {
      throw new Error(
        'The "coreOperations" option is not valid, it must be an object composed of strings ("operations") which map to functions'
      );
    }

    default: {
      return true;
    }
  }
};

exports.validateOptions = validateOptions;

var validateServiceOptions = function validateServiceOptions(serviceOption) {
  switch (true) {
    case serviceOption.hasOwnProperty('runOnStart') &&
      !Array.isArray(serviceOption.runOnStart): {
      throw new Error(
        'The service options "runOnStart" option is not valid, it must be an array'
      );
    }

    case serviceOption.hasOwnProperty('loadBalancing') &&
      !['random', 'roundRobin'].includes(serviceOption.loadBalancing): {
      throw new Error(
        'The service options "loadBalancing" option is not valid, can either be "random" or "roundRobin" or a function(socketList)'
      );
    }

    case serviceOption.hasOwnProperty('instances') &&
      typeof serviceOption.instances !== 'number' &&
      serviceOption.instances >= 1: {
      throw new Error(
        'The service options "instances" option is not valid, it must be an number above 1'
      );
    }

    default: {
      return true;
    }
  }
};

exports.validateServiceOptions = validateServiceOptions;
