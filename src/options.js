'use strict';

import { readFileSync } from 'fs';
import { resolve } from 'path';
import helmet from 'helmet';

export const hardenServer = (expressApp) => {
  /*
    This hardening follows the guidance in this file:
    https://expressjs.com/en/advanced/best-practice-security.html
    This may be enhanced in the future
  */
  return expressApp.use(helmet());
};

export const buildSecureOptions = (ssl) => {
  try {
    return typeof ssl === 'object'
      ? Object.entries({
          key: void 0,
          cert: void 0,
          ca: void 0,
          ...ssl
        })
          .filter(([, filePath]) => filePath)
          .map(([optionKey, filePath]) => ({
            [optionKey]: readFileSync(resolve(filePath)).toString()
          }))
          .reduce((acc, x) => Object.assign(acc, x), {})
      : ssl;
  } catch (e) {
    throw new Error(e);
  }
};

export const buildHttpOptions = (options) => ({
  port: Object.prototype.hasOwnProperty.call(options, 'port')
    ? options.port
    : 8888,
  ssl: buildSecureOptions(options.ssl),
  harden: Object.prototype.hasOwnProperty.call(options, 'harden')
    ? options.harden
    : true,
  beforeStart: Object.prototype.hasOwnProperty.call(options, 'beforeStart')
    ? options.beforeStart
    : (express) => express,
  middlewares: Object.prototype.hasOwnProperty.call(options, 'middlewares')
    ? options.middlewares
    : [],
  static: Object.prototype.hasOwnProperty.call(options, 'static')
    ? options.static
    : [],
  routes: Object.prototype.hasOwnProperty.call(options, 'routes')
    ? options.routes
    : []
});

export const defaultServiceOptions = {
  babelConfig: {},
  loadBalancing: 'roundRobin',
  runOnStart: [],
  instances: 1
};

export const eventList = ['uncaughtException', 'unhandledRejection'];

export const defaultInstanceOptions = {
  mode: 'server',
  http: false,
  databaseNames: ['_defaultTable'],
  verbose: true,
  maxBuffer: 50, // in megabytes
  logPath: void 0,
  restartTimeout: 50,
  connectionTimeout: 1000,
  msConnectionTimeout: 10000,
  msConnectionRetryLimit: 1000,
  address: 8080,
  portRangeStart: 1024,
  portRangeFinish: 65535,
  coreOperations: {},
  runOnStart: []
};
