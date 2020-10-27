'use strict';

import isReachable from 'is-reachable';
import axios from 'axios';
import https from 'https';

export const host = 'localhost';
export const httpPortOne = 12000;
export const httpPortTwo = 12001;
const timeout = 10000;

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

export const makeRequest = ({
  host,
  port,
  method,
  path,
  callback,
  body = void 0,
  ssl = true
}) => {
  return isReachable(`${host}:${port}`, { timeout }).then((canConnect) => {
    if (canConnect) {
      return axiosInstance[method](
        `${ssl ? 'https' : 'http'}://${host}:${port}${path}`,
        body
      )
        .then((response) => callback(response))
        .catch((error) => callback(error));
    }
    throw new Error(
      `Unable to verify Risen.JS port is ready for connections after ${timeout}ms.`
    );
  });
};
