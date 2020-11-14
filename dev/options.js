'use strict';

import path from 'path';
import bodyParser from 'body-parser';

import { routes } from './routes';
import { LOG_PATH, SSL_OPTIONS } from './constants';

const verboseMode = process.env.VERBOSE === 'true';

// Define http options
const httpOptions1 = {
  port: 12000,
  ssl: SSL_OPTIONS,
  harden: true,
  middlewares: [
    bodyParser.json(),
    (req, res, next) => {
      res.header('X-Middleware', 'F39B2FCE-6ACE-46EA-A558-00DD3FFA5427');
      next();
    }
  ],
  static: [path.join(__dirname, 'httpsPublic')],
  routes
};

const httpOptions2 = {
  port: 12001,
  ssl: false,
  harden: true,
  middlewares: [bodyParser.json()],
  static: [path.join(__dirname, 'public')],
  routes
};

function saveNumber({ request }) {
  return request({
    body: {
      method: 'set',
      table: '_defaultDatabase',
      args: [`number500`, 500]
    },
    destination: 'serviceCore',
    functionName: 'storage'
  });
}

function reflectString({ sendSuccess }) {
  return sendSuccess({
    result: 'Reflect service core!'
  });
}

const coreOperations = {
  saveNumber,
  reflectString
};

/* eslint-disable-next-line */
export const frameworkOptions = {
  coreOperations,
  databaseNames: ['_defaultDatabase'],
  mode: 'server',
  http: [httpOptions1, httpOptions2],
  runOnStart: ['saveNumber'],
  verbose: verboseMode,
  logPath: LOG_PATH
};
