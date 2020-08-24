'use strict';

export const validateRouteOptions = route => {
  switch (true) {
    case !['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(
      (route.method || '').toUpperCase()
    ): {
      throw new Error('The http route option "method" is invalid!');
    }
    case typeof route.uri !== 'string': {
      throw new Error('The http route option "uri" must be a string!');
    }
    case Object.prototype.hasOwnProperty.call(route, 'preMiddleware') &&
      !Array.isArray(route.preMiddleware): {
      throw new Error(
        'The http route option "preMiddleware" must be an array!'
      );
    }
    case Object.prototype.hasOwnProperty.call(route, 'preMiddleware') &&
      !Array.isArray(route.postMiddleware): {
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

export const validateHttpOptions = httpOptions =>
  httpOptions.every(http => {
    switch (true) {
      case Object.prototype.hasOwnProperty.call(!http, 'port') ||
        typeof http.port !== 'number': {
        throw new Error('The http option "port" must be a number!');
      }
      case Object.prototype.hasOwnProperty.call(http, 'ssl') &&
        !['object', 'boolean'].includes(typeof http.ssl): {
        throw new Error(
          'The http option "ssl" must be a boolean false or an object with the keys: {key, ca, cert}'
        );
      }
      case Object.prototype.hasOwnProperty.call(http, 'harden') &&
        typeof http.harden !== 'boolean': {
        throw new Error('The http option "harden" must be a boolean!');
      }
      case Object.prototype.hasOwnProperty.call(http, 'beforeStart') &&
        typeof http.beforeStart !== 'function': {
        throw new Error('The http option "beforeStart" must be a function!');
      }
      case Object.prototype.hasOwnProperty.call(http, 'middlewares') &&
        !Array.isArray(http.middlewares): {
        throw new Error('The http option "middlewares" must be an array!');
      }
      case Object.prototype.hasOwnProperty.call(http, 'static') &&
        !Array.isArray(http.static): {
        throw new Error('The http option "static" must be an array!');
      }
      case (Object.prototype.hasOwnProperty.call(http, 'routes') &&
        !Array.isArray(http.routes)) ||
        !http.routes.every(route => validateRouteOptions(route)): {
        throw new Error(
          'The http option "routes" must be an array with valid configuration!'
        );
      }
      default: {
        return true;
      }
    }
  });

export const validateCoreOperations = options =>
  options instanceof Object
    ? Object.entries(options).every(
        ([functionName, functionOp]) =>
          typeof functionName === 'string' && typeof functionOp === 'function'
      )
    : false;

export const validateOptions = options => {
  switch (true) {
    case Object.prototype.hasOwnProperty.call(options, 'mode') &&
      !['server', 'client'].includes(options.mode): {
      throw new Error(
        'The "mode" option is not valid, it can only be "server" or "client"'
      );
    }
    case Object.prototype.hasOwnProperty.call(options, 'http') &&
      !validateHttpOptions(options.http): {
      throw new Error(
        'The "http" option is not valid, consult documentation for more information'
      );
    }
    case Object.prototype.hasOwnProperty.call(options, 'databaseNames') &&
      !Array.isArray(options.databaseNames): {
      throw new Error(
        'The "databaseNames" option is not valid, it must be an array of strings'
      );
    }
    case Object.prototype.hasOwnProperty.call(options, 'verbose') &&
      typeof options.verbose !== 'boolean': {
      throw new Error(
        'The "verbose" option is not valid, it must be an boolean'
      );
    }
    case Object.prototype.hasOwnProperty.call(options, 'maxBuffer') &&
      typeof options.maxBuffer !== 'number': {
      throw new Error(
        'The "maxBuffer" option is not valid, it must be a number'
      );
    }
    case Object.prototype.hasOwnProperty.call(options, 'logPath') &&
      typeof options.logPath !== 'string': {
      throw new Error('The "logPath" option is not valid, it must be a string');
    }
    case Object.prototype.hasOwnProperty.call(options, 'restartTimeout') &&
      typeof options.restartTimeout !== 'number': {
      throw new Error(
        'The "restartTimeout" option is not valid, it must be a number'
      );
    }
    case Object.prototype.hasOwnProperty.call(options, 'connectionTimeout') &&
      typeof options.connectionTimeout !== 'number': {
      throw new Error(
        'The "connectionTimeout" option is not valid, it must be a number'
      );
    }
    case Object.prototype.hasOwnProperty.call(
      options,
      'microServiceConnectionTimeout'
    ) && typeof options.microServiceConnectionTimeout !== 'number': {
      throw new Error(
        'The "microServiceConnectionTimeout" option is not valid, it must be a number'
      );
    }
    case Object.prototype.hasOwnProperty.call(
      options,
      'microServiceConnectionAttempts'
    ) && typeof options.microServiceConnectionAttempts !== 'number': {
      throw new Error(
        'The "microServiceConnectionAttempts" option is not valid, it must be a number'
      );
    }
    case Object.prototype.hasOwnProperty.call(options, 'apiGatewayPort') &&
      typeof options.apiGatewayPort !== 'number': {
      throw new Error(
        'The "apiGatewayPort" option is not valid, it must be a number'
      );
    }
    case Object.prototype.hasOwnProperty.call(options, 'portRangeStart') &&
      typeof options.portRangeStart !== 'number': {
      throw new Error(
        'The "portRangeStart" option is not valid, it must be a number'
      );
    }
    case Object.prototype.hasOwnProperty.call(options, 'portRangeFinish') &&
      typeof options.portRangeFinish !== 'number': {
      throw new Error(
        'The "portRangeFinish" option is not valid, it must be a number'
      );
    }
    case (Object.prototype.hasOwnProperty.call(options, 'runOnStart') &&
      !Array.isArray(options.runOnStart)) ||
      (Array.isArray(options.runOnStart) &&
        options.runOnStart.length &&
        options.runOnStart.every(op => typeof op !== 'string')): {
      throw new Error(
        'The "runOnStart" option is not valid, it must be a array of strings corresponding to defined operations'
      );
    }
    case Object.prototype.hasOwnProperty.call(options, 'coreOperations') &&
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

export const validateServiceOptions = serviceOption => {
  switch (true) {
    case (Object.prototype.hasOwnProperty.call(serviceOption, 'runOnStart') &&
      !Array.isArray(serviceOption.runOnStart)) ||
      (Array.isArray(serviceOption.runOnStart) &&
        serviceOption.runOnStart.some(op => typeof op !== 'string')): {
      throw new Error(
        'The service options "runOnStart" option is not valid, it must be a valid array'
      );
    }
    case Object.prototype.hasOwnProperty.call(serviceOption, 'loadBalancing') &&
      typeof serviceOption.loadBalancing !== 'function' &&
      !['random', 'roundRobin'].includes(serviceOption.loadBalancing): {
      throw new Error(
        'The service options "loadBalancing" option is not valid, can either be "random" or "roundRobin" or a function(socketList)'
      );
    }
    case Object.prototype.hasOwnProperty.call(serviceOption, 'instances') &&
      (typeof serviceOption.instances !== 'number' ||
        (typeof serviceOption.instances === 'number' &&
          serviceOption.instances < 1)): {
      throw new Error(
        'The service options "instances" option is not valid, it must be an number above 1'
      );
    }
    default: {
      return true;
    }
  }
};
