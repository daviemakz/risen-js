const { Risen } = require('risen-js');
const bodyParser = require('body-parser');
const compression = require('compression');

// If no prime is defined in the query string we default to this
const defaultPrimeNumber = 25;

// This is a route object which our Express server will use to map the
// HTTP request/method and communicate with Risen.JS
const routes = [
  {
    method: 'GET',
    uri: '/',
    handler: async (req, res, next, { request }) => {
      const body = req.query;
      // Check that a query parameter is there, if not we will redirect
      // to the default prime number defined above.
      if (Object.prototype.hasOwnProperty.call(body, 'prime')) {
        return request(
          {
            body,
            destination: 'render',
            functionName: 'renderPage'
          },
          (data) => res.send(data.response)
        );
      }
      return res.redirect(`/?prime=${defaultPrimeNumber}`);
    }
  }
];

// Our single express server, we can have multiple listening on any ports
const httpServer = {
  localhost: 'localhost',
  port: 8080,
  ssl: false,
  harden: true,
  middlewares: [compression(), bodyParser.json()],
  static: [],
  routes
};

// Define the framework options for Risen.JS
const frameworkOptions = {
  databaseNames: ['_defaultDatabase'],
  mode: 'server',
  http: [httpServer],
  runOnStart: [],
  verbose: true,
  logPath: './risen.log',
  address: 'localhost:8081'
};

// Initialise instance
const RisenInstance = new Risen(frameworkOptions);

// Define the "prime" service, with the path to its "operations" file
RisenInstance.defineService('prime', './services/prime/index.js', {
  instances: 4 // We will start 4 identical instances of the prime service
});

// Define the "render", with the path to its "operations" file and
// specifying a babel configuration. This will prompt Risen.JS to
// transpile it before starting the function.
RisenInstance.defineService('render', './services/render/index.jsx', {
  babelConfig: {
    presets: ['@babel/preset-env', '@babel/preset-react']
  },
  instances: 2 // We will start two instances of the render service
});

// Start the server framework
RisenInstance.startServer();
