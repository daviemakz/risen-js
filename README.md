# Risen.JS - Simple, Fast & Scalable Micro Services Framework

[![NPM](https://nodei.co/npm/risen-js.png?compact=true)](https://www.npmjs.com/package/risen-js)

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdaviemakz%2Frisen-js.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdaviemakz%2Frisen-js?ref=badge_shield)
[![Build Status](https://travis-ci.org/daviemakz/risen-js.svg?branch=master)](https://travis-ci.org/daviemakz/risen-js)
[![Downloads](https://img.shields.io/npm/dm/risen-js.svg)](https://www.npmjs.com/package/risen-js)
[![GitHub issues](https://img.shields.io/github/issues/daviemakz/risen-js)](https://github.com/daviemakz/risen-js/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/daviemakz/risen-js)](https://github.com/daviemakz/risen-js/pulls)
[![NPM](https://img.shields.io/npm/l/risen-js)](https://www.npmjs.com/package/risen-js)
[![npm](https://img.shields.io/npm/v/risen-js)](https://www.npmjs.com/package/risen-js)

Risen.JS is a framework for building efficient, scalable non-blocking Node.JS server-side applications. It uses ES6+ JavaScript and combines elements of OOP (Object Oriented Programming) and FP (Functional Programming).

Under the hood, Risen.JS makes use of the well-known and robust [Express](http://expressjs.com) HTTP(s) package, [Quick-DB](https://www.npmjs.com/package/quick.db) for long term persistent storage, and the native [child process](https://nodejs.org/api/child_process.html) feature in Node.JS.

Risen.JS provides a level of abstraction above these frameworks, but also exposes their APIs directly to the developer. This allows for easy use of the myriad third-party modules, packages and middleware’s which are available for each platform.

Because the "services" you will create run as Node.JS processes, this means you can build micro services utilising the tens of thousands of NPM packages which currently exist and are added every day. Simply put anything you can do in Node.JS, you can build a micro service to do for you.

From inserting and retrieving data from a separate external database (e.g. Redis) to a service which converts images. It’s even possible to use this framework alongside [server-side rendering](https://reactjs.org/docs/react-dom-server.html) in, the possibilities are endless!

Click [here](https://medium.com/@daviemakz/a-simple-way-to-deploy-react-multi-threaded-server-side-rendering-with-risen-js-eba4db97407) to read a Medium article on Risen.JS!

# Philosophy

There are a lot of Node.JS based micro service frameworks out there and some of them are very powerful, however generally speaking they are quite complicated and require a significant amount of knowledge outside of JavaScript to utilise effectively or securely (especially in a production environment).

This package was created to handle a lot of the complexity involved in deploying robust and dependable micro services. These are the key principles which led the design of this package:

- The framework should not require extensive knowledge outside of JavaScript
- The framework should allow you to define multiple "services" designed to handle multiple workloads
- The framework should allow RESTful API communication to multiple HTTP and HTTP(s) [Express](http://expressjs.com) instances concurrently
- The framework should allow Node.JS based communication between instances of Risen.JS concurrently
- The framework should allow the number of discrete "services" to be scaled depending on load & support multiple load balance strategies
- The framework should allow instancing of "services" for better load balancing and higher throughput
- The framework should allow micro services to communicate with any other service and share data
- The framework should have built in persistent storage which can be utilised by any of the "services"
- The framework should be OS agnostic and run on all well-known platforms
- The framework should be fast, secure, scalable and efficient
- The framework should handle errors seamlessly and not crash due to an error in a "service"
- The framework should restart failed services automatically and allow changing of the number of instances during runtime
- The framework should handle all communication, ports and routing and allow extensive hardening and configuration

_Supports Node 10.x +_

# Installation

To install please follow the below instructions:

Using NPM:

    npm install risen-js --save

Using Yarn:

    yarn add risen-js

# How Fast Can I Deploy A Micro Service Framework?

Well, let’s show you! We are going to create a simple HTTP based micro service framework which will use React.JS server side rendering with the aim of calculating all the prime numbers up to a certain number, defined within a query string and return a server side rendered [React.JS](https://reactjs.org) page back to your browser.

The example will be based on Linux however you can do the exact same thing with MacOS & Windows. We will skip going through each line of JavaScript code as this example assumes basic knowledge of Node.JS. Detailed documentation on the package will be available below this example.

## Simple React.JS Server Side Rendering Server

1. Create a new folder and cd into the said folder:

```
mkdir prime-calculator && cd prime-calculator
```

2. Initialise the directory as an NPM package:

```
npm init -y
```

3. Install node dependencies (fixing the react version in case of future changes):

```
yarn add @babel/register @babel/core@^7.0.0-0 @babel/preset-react @babel/preset-env react-dom@16.8.6 react@16.8.6 antd@3.18.2 risen-js@latest
```

_NOTE: We are using babel to transpile JSX on the micro service as we are using SSR (server-side-rendering) in this example. You wont need it in most cases._

4. Create the file which will contain the functions which your micro service will have:

```
touch calculator.js
```

5. Paste the following into this file.

```
'use strict';

require('@babel/register')({
  presets: ['@babel/preset-react', '@babel/preset-env']
});

module.exports = require('./App');
```

6. Create the file which will contain the server configuration you are going to execute:

```
touch server.js
```

7. Paste the following code into the file you've just created:

```
'use strict';

// Import risen
const { Risen } = require('risen-js');

// Define express route
const getPrimeNumber = {
  method: 'GET', // The method which the request must have
  uri: '/getPrimeNumbers', // The url route (after the domain)
  handler: (req, res, { sendRequest, destroyConnection, CommandBodyObject }) => {
    // This is the handler which "connects" express to your service core and thus microservices.
    // In this example the microservice is doing the calculation and returning HTML which is then sent back
    // to the client. Below im getting a new object because all requests to micro services need to be done via a command object.
    const primeNumberCommandBody = new CommandBodyObject();

    // Assign command information
    primeNumberCommandBody.destination = 'primeCalculator';
    primeNumberCommandBody.funcName = 'calculatePrime';
    primeNumberCommandBody.body = {
      primeUpTo: req.query.primeUpTo
    };

    // Send request to micro service and send the response back to the origin
    return sendRequest(
      primeNumberCommandBody, // The command body which will be sent to service core and routed to an available "service"
      'primeCalculator', // The name of the micro service you are targeting
      false, // Whether to keep the connection alive, this improves performance because you get a socket object you can reuse
      void 0, // You can target another instance of this framework running on a different port if you want e.g. { port: [another risen-js instance port] }
      void 0, // If you have set keepalive to true above you must pass your existing socket here
      response => res.send(response.resultBody.resData.pageOutput) // Send the request back to the client
    );
  }
};

// Define HTTP options (its an array so you can define as many of these as you want)
const httpOptions = [
  {
    port: 9898,
    ssl: false,
    harden: true,
    routes: [getPrimeNumber]
  }
];

// Define framework options
const frameworkOptions = {
  mode: 'server',
  http: httpOptions,
  verbose: true // To see whats going on :)
};

// Initialise instance, you have not started it yet but simply set the configuration
const RisenInstance = new Risen(frameworkOptions);

// Define path to the file which will define the operations a service can perform (without .js extension)
const primeNumberServiceOperations = './calculator';

// Define a micro service
RisenInstance.defineService('primeCalculator', primeNumberServiceOperations, {
  instances: 5 // Lets have 5 identical instances of this "service" running on startup
});

// Start the framework
RisenInstance.startServer();
```

8. Create the file which will contain the server you are going to execute:

```
touch App.jsx
```

9. Paste the following code into the file you've just created. This is to make the React.JS server side rendering work and demonstrate the true capabilities of the package:

```
'use strict';

// Load NPM modules
const React = require('react');
const { renderToString } = require('react-dom/server');

// Load antDesign modules
const { Layout, Breadcrumb, Tag } = require('antd');
const { Content, Header, Footer } = Layout;

// Load response body
const { ResponseBodyObject } = require('risen-js');

// PrimeNumberResponsePage
export const PrimeNumberResponsePage = ({ primeUpTo, listOfPrimes }) => (
  <html>
    <head>
      <title>{`All Prime Numbers Up To ${primeUpTo}`}</title>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.18.2/antd.min.css"
      />
    </head>
    <body>
      <Layout className="layout">
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Prime Number Finder</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <div
              style={{
                background: '#fff',
                padding: 24,
                minHeight: 'calc(100vh - 170px)'
              }}>
              <h2
                style={{
                  textAlign: 'center'
                }}>{`Below is a list of all prime numbers up to ${primeUpTo}`}</h2>
              <br />
              {listOfPrimes.map((number, index) => (
                <Tag style={{ marginBottom: '8px' }} key={index}>
                  {number}
                </Tag>
              ))}
            </div>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center'
          }}>{`This page was rendered on the server by an instance of the ${
          process.env.name
        } service. Instance ID: ${process.env.processId}`}</Footer>
      </Layout>
    </body>
  </html>
);

// Is the number a prime?
function isPrime(num) {
  for (let i = 2; i < num; i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
}

// Build an array of prime numbers
function getPrimeList(n) {
  let arr = [2];
  for (let i = 3; i < n; i = i + 2) {
    if (isPrime(i)) {
      arr.push(i);
    }
  }
  return arr;
}

// Defining the capabilities for a service is simply defining an object with functions attatched.
// Its worth noting that if you were going to do caching / other performance improvements this
// is probably where you want to do it! You could also do it on the Express side using middleware.
module.exports = {
  calculatePrime: (socket, data) => {
    // Invoke template(s)
    const resObject = new ResponseBodyObject();

    // Get the prime number from data body
    const primeUpTo = data.body.primeUpTo;

    // Perform operations on next tick
    return setImmediate(() => {
      // Get the list of prime numbers
      const listOfPrimes = getPrimeList(primeUpTo);
      // Assign the process name to the response
      resObject.status.transport.responseSource = process.env.name;
      // Assign result to response body
      resObject.resultBody.resData = {
        status: true,
        message: 'The operation completed successfully!',
        pageOutput: renderToString(
          <PrimeNumberResponsePage
            listOfPrimes={listOfPrimes}
            primeUpTo={primeUpTo}
          />
        )
      };

      // Send the response back to the broker which manages connections between client and server using reply()
      return socket.reply(resObject);
    });
  }
};
```

9. Start the micro service using the command below:

```
node server.js
```

10. Navigate to the below endpoint:

http://localhost:9898/getPrimeNumbers?primeUpTo=1000

You should see a website showing you a group of prime numbers up to the number 1000. Try refreshing the page a couple times and notice how the `Instance ID` at the bottom of the page changes with each page load. Each instance of a service and the services themselves have a unique ID and this is what’s is being shown on the frontend.

In the console you will see an output similar to this showing the Risen.JS in action:

```
Successfully connected on port: 8080
Socket initialized. sending data...
[0] Service core connection request received
[0] Service core has closed the connection!
[0] Service core has processed request for service: primeCalculator
```

And there we are, in less than **200 lines** we have created micro service framework, with 5 identical instances of a [React.JS](https://reactjs.org) server-side renderer with an express HTTP server providing a RESTful interface between client and the Risen.JS. This is the philosophy of this framework, simple, fast and efficient!

### Extra Notes

It’s worth noting that this framework _intentionally_ has a function which blocks the event loop while calculating the prime numbers as well as using `renderToString` which is also synchronous. This is to demonstrate that blocking a service will not stop Risen.JS serving content and routing requests to their destinations.

Of course, you should design your services in a way which does not block your service instances from receiving and processing new requests.

_This package is built with that assumption in mind so it’s worth noting._

# Documentation:

## Terminology:

`Service core` - This is the core process which manages all other services. Communication to the services from express and between micro services always pass through this process first.  
`Micro services / services` - This would be a service you have already defined.  
`Service instances` - These are copies of a particular service, a micro service needs at-least one instance (by default) to be started.  
`Risen instances` - These are distinct instances of the Risen.JS framework.  
`HTTP route handlers` - These functions are applied to express routes and connect express with the framework.  
`Risen.JS` - Refers to the combination of the `service core` and `micro services` working under framework.

## API Methods

`defineService(name, operations, options)` - Please see the [Defining A Server](#defining-a-service) section for more details.  
`startServer()` - After you have configured your server you use this method to start the server. It does nothing if you are in `client` mode.  
`sendRequest(commandBody, serviceName, keepSocketAlive, customRisenJSTarget, openSocket, callback)` - This method is available from the service instance(s), service core and HTTP route handlers. This is the only function which allows communication between the different processes.
`destroyConnection(socket, connectionId)` - Allows you to destroy a socket connection.

### defineService(...args)

This is discussed in more detail [here](#defining-a-service).

### startServer()

Ensure you have finished configuration before starting Risen.JS:

```
// Initialise instance, you have not started it yet but simply set the configuration
const RisenInstance = new Risen(frameworkOptions);

// Define a micro service
RisenInstance.defineService(...args);

// Start the framework
RisenInstance.startServer();
```

### destroyConnection(...args)

The method allows you to destroy a connection at any point, it may be you don't want to send a response back so you don't need the connection open at that time.

### sendRequest(...args)

The method `sendRequest` is where all communication happens and below are the parameters:

```
// Send request to micro service and send the response back to the origin
return sendRequest(
  exampleCommandBody, // The command body which will be sent to service core and routed to an available "service"
  'primeCalculator', // The name of the micro service you are targeting
  false, // Whether to keep the connection alive, this improves performance because you get a socket object you can reuse
  void 0, // You can target another instance of this framework running on a different port if you want e.g. { port: [another risen-js apiGatewayPort] }
  void 0, // If want to reuse a socket which you did not close (by setting keepalive to true above) pass it here
  (responseData, originalData, socket) => { // Send the request back to its origin }
);
```

_NOTE: Reusing sockets will result in better performance as you are not initiating a connection every time. This only affects `sendRequest()` when its used in a HTTP handler. The service core and its service instances maintain active, bidirectional connections at all times._

## Risen.JS Framework Configuration

Before you use Risen.JS you need to create a new instance of the Risen.JS object. You can have multiple instances running at the same time if you wish and have them communicate with each other.

When the service core is starting instances of services it will automatically look for the next available port to bind the service to. So, you won’t need to worry about doing this yourself. Below are the options for the framework:

#### Defaults:

```
{
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
  apiGatewayPort: 8080,
  portRangeStart: 1024,
  portRangeFinish: 65535,
  coreOperations: {},
  runOnStart: []
}
```

#### Options

`mode [string]` - This tells which mode the particular Risen.JS instance will operate under. "server" will have the instance run like a server while "client" will give you access to the `sendRequest(...args)` method. This is how you would communicate with another running Risen.JS instance in "server" mode. The `apiGatewayPort` will need to match on both instances.  
`http [bool]` - Please see [HTTP Configuration](#http-configuration) section.  
`databaseNames [array]` - The number of databases you want in the Risen.JS instance. Once declared you can use the method defined in this section to create/modify/delete data. Please see the [Service Core Operations](#service-core-operations) section.  
`verbose [bool]` - Whether to print more verbose logs of what the instance is doing. Note this has no effect on what the client will see for security reasons.  
`maxBuffer [number]` - This option specifies the largest number of bytes allowed on stdout or stderr combined. If this value is exceeded, then the service instance is restarted.  
`logPath [string]` - If you want to log to a file what you would see in the console. If you want more information set `{ verbose: true }`.  
`restartTimeout [number]` - How long to wait before restarting a service instance (in ms).  
`connectionTimeout [number]` - How long to wait while attempting to acquire a connection to the service core before trying again (in ms).  
`msConnectionTimeout [number]` - How the service core should wait while it attempting to connect to a service instance before timing out and returning an error to the source.  
`msConnectionRetryLimit [number]` - How many times the service core should try to acquire a connection to a service instance if the connection is rejected before returning an error to the source.  
`apiGatewayPort [number]` - The main port where the service core listens to new connections. _NOTE: To bind below ports 1024 you need to have privileged access._  
`portRangeStart [number]` - What port the service core should begin while trying to find a free port for a service instance.  
`portRangeFinish [number]` - What port the service core should end its search if it cannot find a free port. At this point the service core will throw an error.  
`coreOperations [object]` - This follows the same structure as defining operations for services. You can add new functions here which will be available for any instance (including the service core) to use. Please see the [Service Core Operations](#service-core-operations) section for the default core operations.  
`runOnStart [array]` - What core operations you want to be executed on start-up to perform a function of your choice. This would be for example where you would put any polling if you were so inclined.  
`onConRequest [function]` - A function which is executed when a connection is received by the service core.  
`onConClose [function]` - A function which is executed when a connection is closed by the service core.

## HTTP Configuration

Risen.JS allows you to define multiple instances of express as well as exposing the express instance itself for deeper configuration. This must be an array of objects containing options described below:

Below HTTP capabilities are disabled and you will need to start a separate Risen.JS instance in `client` mode & matching `apiGatewayPort` to communicate with the framework:

```
{
  http: false
}
```

Here you can as well as communicate directly with a Risen.JS instance in `client` mode but also communicate via HTTP on 8888:

```
[{
  port: 8888,
  ssl: false,
  harden:  true,
  beforeStart: express => express, // If you want to do something with express before starting
  middlewares: [],
  static: [],
  routes: []
};]
```

#### Options

`port [number]` - The port to listen on.  
`host [string]` - If you want to bind to a specific address. If omitted it will bind to `0.0.0.0` (all interfaces).  
`ssl [bool|object]` - Whether HTTPS will be enabled. `false` will run the express server in HTTP and supplying an object (e.g. `{ key: '', cert: '', ca: '' }`) will switch to HTTPS. The `ca` property is optional.  
`harden [bool]` - This hardening follows the guidance from this [link](https://expressjs.com/en/advanced/best-practice-security.html).  
`beforeStart [function (express) => { ... }]` - Allows you access to the express instance before initialisation.  
`middlewares [array]` - If you want to apply middleware to your express instance before initialisation.  
`static [array]` - Allows you to serve [static](https://expressjs.com/en/starter/static-files.html) content, relative to the folder where Risen.JS is executed.  
`routes [array]` - Please see [Route Alias Configuration](#route-alias-configuration) on how you map incoming requests to services.

## Route Alias Configuration

Routes are defined as a collection of objects within an array. Below are the options for each route. You will need to do this for each `uri/method` combination.

#### Options

`method [string]` - The method of the URI, case sensitive.  
`uri [string]` - The URI which this route will be mapped to.  
`preMiddleware [array]` - Any middleware you want the request to pass through before running your handler.  
`postMiddleware [array]` - Any middleware you want the request to pass through after running your handler.  
`handler [function (req, res, { sendRequest, destroyConnection, CommandBodyObject, ResponseBodyObject }) => { res.send(/* response to client */)}]` - This is where you link express with the framework. It’s here where you receive a request from a client, you then send a request to your chosen service, receive a response from the service and send the data back to the client via `res.send()`.

**The handler used in the above example:**

```
(req, res, { sendRequest, destroyConnection, CommandBodyObject, ResponseBodyObject }) => {

  /*

   This is the handler which "connects" express to your service core and thus micro-services. Below I'm
   getting a new command object because all requests to micro services need to be done via a command object.

  */

  // Get a new command body
  const exampleCommandBody = new CommandBodyObject();

  // Name of your service
  exampleCommandBody.destination = 'exampleService';

  // The name of the operation which will be executed on the service
  exampleCommandBody.funcName = 'exampleOperation';

  // The body of your request the operation will receive
  exampleCommandBody.body = [1,2,3,4,5];

  // Send request to micro service and send the response back to the origin
  return sendRequest(
    exampleCommandBody, // The command body which will be sent to service core and routed according to the destination
    'exampleService', // The name of the micro service you are targeting, in this case "exampleService"
    false, // Whether to keep the connection alive, this improves performance because you get a socket object back you can reuse
    void 0, // You can target another instance of this framework running on a different port if you want e.g. { port: [another risen-js instance port] }
    void 0, // You must pass your existing socket here if the previous request had 'keepAlive' set to true
    response => res.send(response.resultBody.resData.pageOutput) // Send the request back to the client
  );
}
```

## Defining A Service

Now let’s look at defining a service. There are two things you need to do:

1. Create a file which exports an object:

```
module.exports = {
  exampleOperation: (socket, data) => {

    // Invoke template(s)
    const resObject = new ResponseBodyObject();

    // Perform operations on next tick
    return setImmediate(() => {

      // Get some result
      const someResult = someCalculation(data.body.argument);

      // Assign the process name to the response
      resObject.status.transport.responseSource = process.env.name;

      /*
        Assign result to response body. If there is an error assign the result to "errData" instead
        so the service core can take appropriate action. You will still need to handle this result
        in your HTTP handler however this should be straightforward. An empty resultBody.errData === 'GOOD'!
      */

      if (some condition I want to check) {
        resObject.resultBody.resData = {
          status: true,
          message: 'The operation completed successfully!',
          result: someResult
        };
      } else {
        resObject.resultBody.errData = {
          status: false,
          message: 'The operation failed!',
          error: someResult
        };
      }

      // Send the response back to the service core using reply()
      return socket.reply(resObject);
    });
  }
};
```

2. Before you start your service you need to define it in Risen.JS. This is done using the pattern below:

```
// Define my framework options
const frameworkOptions = { ... }

// Initialise instance, you have not started it yet but simply set the configuration
const RisenInstance = new Risen(frameworkOptions);

// Define path to the file which will define the operations a service will have (without .js extension)
const pathToAboveFile = './exampleOperationDefinitions';

// Define a micro service
RisenInstance.defineService('exampleServiceName', pathToAboveFile, {
  instances: 1 // How many instances of this service called "exampleServiceName" should the service core start
  loadBalancing: 'roundRobin' // What is the load balancing strategy for this service. Options are 'roundRobin'/'random'/[function (socketList) => socketList[0]]
  runOnStart: ['exampleOperation'] // An array containing the names of functions you want to execute when the service instance starts
});
```

The key of the object is the name of the operation on a service. If you wanted persistent process executing on an instance of a service, you would likely use `runOnStart` and setup some kind of recursive polling o.e.

### Load Balancing Options

For the load balancing above you can use either:

`random` - Randomly send data to instances
`roundRobin` - Send the data sequentially to each instance
`function function(socketList) => [socketList[0], 0]` - A custom function which will receive an array containing sockets. Return an array consisting of: `[socket, socketIndex]`

### Operation Function Scope

Each operation defined in a service is bound to a shared scope (accessible via `this`) which looks like so:

```
{
  sendRequest: [Function], // See above for parameters
  destroyConnection: [Function], // See above for parameters
  operations: [Object], // You can access any operations you defined for the service here
  localStorage: [Object] // Local storage if needed
}
```

While there is nothing which stops you storing any data inside `this.localStorage` you should not store data in an instance which will be required elsewhere, perhaps by the same service. Instances in this context should be treated as "copies" of a service, the result from one instance of a service should be the same as the responses from the other remaining instances.

## Data Messaging Structure

Below is a description of how data (messages) are sent in Risen.JS. All messages must be sent via the `new CommandBodyObject()` constructor and all responses must utilise the `new ResponseBodyObject()` constructor. This is to ensure communication is uniform and consistent.

### Command Object

Executing the following code on the constructor `new CommandBodyObject()` will return this result:

```
{
  destination: void 0,
  funcName: '',
  body: {}
}
```

#### Details:

`destination` - The name of the service you want to target.  
`funcName` - The operation which will receive the command body as defined in the file containing operations for the service. The key of the object is the function name.  
`body` - Any data you want to send to a service instance. The data here must be serializable. If not convert it to a format which can and reconvert it once it arrives inside a service instance operation.

The command body is then passed to `sendRequest()` like so:

```
// Get a new command body object
const exampleCommandBody = new CommandBodyObject();

// Assign command information
exampleCommandBody.destination = 'exampleService';
exampleCommandBody.funcName = 'exampleOperation';
exampleCommandBody.body = [...any data I want];

// Send request to a micro service
return sendRequest(
  exampleCommandBody,
  'exampleService',
  ...args
);
```

### Response Object

Executing the following code on the constructor `new ResponseBodyObject()` will return this result:

```
{
  status: {
    transport: {
      code: 2000,
      message: 'Transport completed successfully',
      responseSource: ''
    },
    command: {
      code: 200,
      message: 'Command completed successfully'
    }
  },
  resultBody: {
    resData: {},
    errData: {}
  }
}
```

#### Details:

`status` - This is where the service core will put any important information such as error details and codes, including the where the request has been. You shouldn't be directly editing this however nothing stops you from doing so either. It’s likely any data put here will be overwritten.  
`resultBody` - For all your requests this is where you should be putting your data. If there was no error place your data within `resultBody.resData = { ... }` else place in within `resultBody.errData = { ... }`. This distinction is very important as its one of the only ways the service core will know what went on within a service instance.

When an operation within a service instance receives this command object, the response once any work is finished should be sent like so:

```
(socket, data) => {
  // NOTE: "data" is the exampleCommandBody we defined above

  // Invoke template(s)
  const resObject = new ResponseBodyObject();

  // Assign the process name to the response
  resObject.status.transport.responseSource = process.env.name;

  // Assign result to response body (assuming success conditions)
  resObject.resultBody.resData = {
    status: true,
    message: 'The operation completed successfully!',
    result: true
  };

  // Send the response back to the service core using reply(). This can only be called once!
  return socket.reply(resObject);
}

```

## Service Core Operations

Service core operations work exactly as they do in the micro services themselves and receive the same parameters. The only difference is they are executed in the service core process, so if you are not careful you could block your framework if you do something CPU intensive, stopping further communication.

Avoid doing this. To access these operations, you must set the destination of your `new CommandBodyObject()` to `serviceCore` with the `funcName` being one of the following:

### end

This function shuts down the Risen.JS micro service framework. The service instances are shut down first and then the service core. Command body:

```
{
  destination: 'serviceCore',
  funcName: 'end',
  body: null // Nothing is required
}
```

### storage

This is the operation which provides access to persistent storage for a running Risen.JS instance. All storage operations only happen on the service core. The storage is powered by [Quick-DB](https://www.npmjs.com/package/quick.db) so please have a look at available methods to use. Command body:

```
{
  destination: 'serviceCore',
  funcName: 'storage',
  body: {
    method: 'set' // See a full list by visiting the above link
    table: '_defaultTable', // Make sure you have defined the table in the initial configuration otherwise you will get an error
    args: ['randomNumber', 1024] // Arguments will change depending on the method
  }
}
```

Because you can initialise multiple tables at start-up you can separate your data as you need. The data will be stored in a `json.sqlite` file in your `__dirname` folder.

### changeInstances

This is one of the key core operations in Risen.JS because this function allows you to increase and decrease the instance count of any services you have already defined during runtime.

This means it’s possible to have a service dedicated to monitoring load and increasing/decreasing the instance count of various services where necessary. The command is very simple, define the name of the service you want to change the instance count and define how many instances you want to add/remove.

Command body for adding **3** instances to a service:

```
{
  destination: 'serviceCore',
  funcName: 'changeInstances',
  body: {
    name: 'exampleService' // The name of the service
    instances: 3 // The number of instances you want to add
  }
}
```

Command body for removing **3** instances to a service:

```
{
  destination: 'serviceCore',
  funcName: 'changeInstances',
  body: {
    name: 'exampleService' // The name of the service
    instances: -3 // The number of instances you want to remove
  }
}
```

Note that if you only have **2** instances and request to remove **5** the service core will stop all remaining instances, effectively shutting down this service. The interesting this is you can always start them back up at any point during runtime.

# Codes

Below are the status codes which service core will append to your response object before sending it back to its origin:

## Success Codes

### Transport

- 2000 - Transport completed successfully.

### Command

- 200 - Command completed successfully.

## Error Codes

### Transport

- 5001 - No data received.
- 5002 - Service connection initiation attempts, maximum reached.
- 5003 - Unable to connect to service core.
- 5004 - Unable to connect to specific service.
- 5005 - Request received but destination unknown.
- 5006 - Micro service process exited unexpectedly.
- 5007 - Request received & destination verified but function unknown.

### Command

- 400 - Command executed but an error occurred while processing the request.
- 401 - Command executed but an error occurred while attempting storage operation.
- 402 - Command executed but an error occurred while attempting to change instances.
- 500 - Command not executed, transport failure or no data received.
- 501 - Command not executed, internal redirection failure.
- 502 - Command not executed, no data received by service.
- 503 - Command not executed, function unknown.

## Testing

Run the following commands to test the module:

`yarn && yarn test`

## Future Development:

### Version 2

### To Do:

- Improve project configuration. [DONE]

- Clean up code to align more closely with latest ECMA10+. [DONE]

- Add a development mode to the package which allows everything to be tested while developing. [DONE]

- Add methods to response object to allow self setting of data. [DONE]

- Add cleaner method other than `sendRequest()` modelled around express. [DONE]

- Add method to allow chaining of requests between multiple micro services. [DONE]

- Add cleaner method for sending responses while in the micro service. [DONE]

- Reuse HTTP connection from express server. [PARTIALLY DONE]

- Update relevant NPM modules & clean up unused packages. [DONE]

- Single file configuration with on execution bundling into self contained code. [NOT DONE]

- Customisable babel transpilation from configuration. [DONE]

- Allow connection to services via HTTPS. [NOT DONE]

- Add full spectrum tests to support development environment & replace integration test with this. [DONE]

- Fix the JEST test command. [DONE]

- Allow service connections outside of localhost: server:port. (clarify this, rename variables, already there) [DONE]

- Optimise and reuse connections between micro services and service core. [DONE]

- Optimise and reuse connections between express server(s) and service core. [DONE]

- Add test for a transpiled service to test babelConfig [DONE]

- Create GitHub docs website to formalise documentation and a way to update them in the pipeline. [DONE]

- Reformat service messages [DONE]

- Create CircleCI pipelines for:

1. Testing
2. Building & Publishing Documentation
3. Publishing Package On Version Change

- Update `README.md` with the following:

1. Add pre-made example and add this into the `README.md`.
2. Update `README.md` with a more slimmed down version.
3. Add 'development section' to `README.md`.
4. Add a logo to the project.

- Bump version...icing!

## Version 2.1

- Make final package changes:

- Refactor net functions
- Experiment with fork mode
- Implement CLI version of launching script with `--init` & `--config` functionality.

## Contributing

All contributions are very welcome, please read my [CONTRIBUTING.md](https://github.com/daviemakz/risen-js/blob/master/CONTRIBUTING.md) first. You can submit any ideas as [pull requests](https://github.com/daviemakz/risen-js/pulls) or as [GitHub issues](https://github.com/daviemakz/risen-js/issues). If you'd like to improve code, please feel free!

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdaviemakz%2Frisen-js.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdaviemakz%2Frisen-js?ref=badge_large)
