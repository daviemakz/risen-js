'use strict';

const echoDataPostMiddlewareCallback = {
  method: 'GET',
  uri: '/echo-data-middleware-callback',
  preMiddleware: [],
  postMiddleware: [
    (req, res, next) => {
      res.header('X-Post-Middleware', 'E8C12E65-3C59-4B05-9C79-7F07EE7BE81B');
      res.send(res.locals.data);
      next();
    }
  ],
  handler: (req, res, next, { request }) =>
    request(
      {
        body: 'Retrieving data from post middleware.',
        destination: 'devService',
        functionName: 'echoData'
      },
      (data) => {
        res.locals.data = data;
        return next();
      }
    )
};

const echoDataCallback = {
  method: 'GET',
  uri: '/echo-data-callback',
  preMiddleware: [
    (req, res, next) => {
      res.header('X-Pre-Middleware', '9269F051-5BB2-4EF1-A8BE-66EEF83BC443');
      next();
    }
  ],
  postMiddleware: [],
  handler: (req, res, next, { request }) =>
    request(
      {
        body: 'Testing the echo data service.',
        destination: 'devService',
        functionName: 'echoData'
      },
      (data) => res.send(data)
    )
};

const getLocalStorageData = {
  method: 'GET',
  uri: '/get-local-storage',
  handler: async (req, res, next, { request }) => {
    const data = await request({
      body: null,
      destination: 'runOnStartService',
      functionName: 'getLocalStorage'
    });
    res.send(data);
    return data;
  }
};

const reflectCoreOperation = {
  method: 'GET',
  uri: '/reflect-core-operation',
  handler: async (req, res, next, { request }) => {
    const data = await request({
      body: null,
      destination: 'serviceCore',
      functionName: 'reflectString'
    });
    res.send(data);
    return data;
  }
};

const getSavedNumber = {
  method: 'GET',
  uri: '/get-saved-number',
  handler: async (req, res, next, { request }) => {
    const data = await request({
      destination: 'serviceCore',
      functionName: 'storage',
      body: {
        method: 'get',
        table: '_defaultDatabase',
        args: ['number500']
      }
    });
    res.send(data);
    return data;
  }
};

const echoDataPromise = {
  method: 'GET',
  uri: '/echo-data-promise',
  handler: async (req, res, next, { request }) => {
    const data = await request({
      body: 'Testing the echo data service via a promise.',
      destination: 'devService',
      functionName: 'echoData'
    });
    res.send(data);
    return data;
  }
};

const calculateNumbers = {
  method: 'POST',
  uri: '/calculate-numbers',
  handler: async (req, res, next, { request }) => {
    const { numberList, calculationMethod } = req.body;
    const data = await request({
      body: {
        numberList,
        calculationMethod
      },
      destination: 'devService',
      functionName: 'performCalculation'
    });
    res.send(data);
    return data;
  }
};

const savePoweredNumber = {
  method: 'POST',
  uri: '/save-powered-number',
  handler: async (req, res, next, { requestChain }) => {
    const { number } = req.body;
    const data = await requestChain([
      {
        body: number,
        destination: 'storageService',
        functionName: 'storePowerNumber'
      },
      {
        destination: 'serviceCore',
        functionName: 'storage',
        body: {
          method: 'get',
          table: '_defaultDatabase',
          args: [`powerOfNumber-${number}`]
        }
      }
    ]);
    res.send(data);
    return data;
  }
};

const changeInstancesReduce = {
  method: 'POST',
  uri: '/change-instances-reduce',
  handler: async (req, res, next, { request }) => {
    const { subtractInstances } = req.body;
    const data = await request({
      body: {
        name: 'instanceService',
        instances: subtractInstances
      },
      destination: 'serviceCore',
      functionName: 'changeInstances'
    });
    res.send(data);
    return data;
  }
};

const changeInstances = {
  method: 'POST',
  uri: '/change-instances',
  handler: async (req, res, next, { requestChain }) => {
    const { addInstances } = req.body;
    const data = await requestChain([
      {
        body: {
          name: 'instanceService',
          instances: addInstances
        },
        destination: 'serviceCore',
        functionName: 'changeInstances'
      },
      {
        body: null,
        destination: 'instanceService',
        functionName: 'respond'
      },
      {
        body: null,
        destination: 'instanceService',
        functionName: 'respond'
      },
      {
        body: null,
        destination: 'instanceService',
        functionName: 'respond'
      },
      {
        body: null,
        destination: 'instanceService',
        functionName: 'respond'
      },
      {
        body: null,
        destination: 'instanceService',
        functionName: 'respond'
      },
      {
        body: null,
        destination: 'instanceService',
        functionName: 'respond'
      }
    ]);
    res.send(data);
    return data;
  }
};

const chainedMethods = {
  method: 'get',
  uri: '/request-chained',
  handler: async (req, res, next, { requestChain }) => {
    const data = await requestChain([
      {
        body: 'Request One',
        destination: 'devService',
        functionName: 'echoData'
      },
      {
        body: 'Request Two',
        destination: 'devService',
        functionName: 'echoData'
      },
      {
        body: 'Request Three',
        destination: 'devService',
        functionName: 'echoData'
      },
      {
        body: {
          numberList: [23, 44, 55, 22],
          calculationMethod: 'addArrayElements'
        },
        destination: 'devService',
        functionName: 'performCalculation'
      },
      {
        body: {
          numberList: [12, 44, 221, 533],
          calculationMethod: 'multiplyArrayElements'
        },
        destination: 'devService',
        functionName: 'performCalculation'
      },
      {
        body: {
          numberList: [133, 43, 34, 2],
          calculationMethod: 'divideArrayElements'
        },
        destination: 'devService',
        functionName: 'performCalculation'
      },
      {
        body: {
          numberList: [21, 34, 51, 31],
          calculationMethod: 'subtractArrayElements'
        },
        destination: 'devService',
        functionName: 'performCalculation'
      }
    ]);
    res.send(data);
    return data;
  }
};

/* eslint-disable-next-line */
export const routes = [
  getLocalStorageData,
  reflectCoreOperation,
  getSavedNumber,
  changeInstances,
  changeInstancesReduce,
  chainedMethods,
  calculateNumbers,
  echoDataCallback,
  echoDataPromise,
  savePoweredNumber,
  echoDataPostMiddlewareCallback
];
