# Risen.JS - Simple, Fast & Scalable Micro Services Framework

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdaviemakz%2Frisen-js.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdaviemakz%2Frisen-js?ref=badge_shield)

[![NPM](https://nodei.co/npm/risen-js.png?compact=true)](https://www.npmjs.com/package/risen-js)

[![Build Status](https://travis-ci.org/daviemakz/risen-js.svg?branch=master)](https://travis-ci.org/daviemakz/risen-js)
[![Downloads](https://img.shields.io/github/downloads/daviemakz/risen-js/total.svg)](https://www.npmjs.com/package/risen-js)
[![dependencies Status](https://david-dm.org/daviemakz/risen-js/status.svg)](https://david-dm.org/daviemakz/risen-js)
[![devDependencies Status](https://david-dm.org/daviemakz/risen-js/dev-status.svg)](https://david-dm.org/daviemakz/risen-js?type=dev)

Risen.JS is a framework for building efficient, scalable non-blocking Node.JS server-side applications. It uses ES6+ JavaScript and combines elements of OOP (Object Oriented Programming) and FP (Functional Programming).

Under the hood, Risen.JS makes use of the well known and robust [Express](http://expressjs.com) HTTP(s) package, [Quick-DB](https://www.npmjs.com/package/quick.db) for long term persistent storage, and the native [child process](https://nodejs.org/api/child_process.html) feature in Node.JS.

Risen.JS provides a level of abstraction above these frameworks, but also exposes their APIs directly to the developer. This allows for easy use of the myriad third-party modules, packages and middlewares which are available for each platform.

Because the "services" you will create run as Node.JS processes, this means you can build micro services utilising the tens of thousands of NPM packages which currently exist and are added everyday. Simply put anything you can do in Node.JS, you can build a micro service to do for you.

From inserting and retrieving data from a separate external database (e.g. Redis) to a service which converts images. Its even possible to use this framework alongside [server side rendering](https://reactjs.org/docs/react-dom-server.html) in [React.JS](https://reactjs.org), the possibilities are endless!

# Philosophy

There are a lot of Node.JS based micro service frameworks out there and some of them are very powerful, however generally speaking they are quite complicated and require a significant amount of knowledge outside of JavaScript to utilize effectively or securely (especially in a production environment). This package was created to handle a lot of the complexity involved in deploying robust and dependable micro services. These are the key principles which led the design of this package:

- The framework should not require extensive knowledge outside of JavaScript
- The framework should allow you to define multiple "services" designed to handle multiple workloads
- The framework should allow RESTful API communication to multiple HTTP and HTTP(s) [Express](http://expressjs.com) instances concurrently
- The framework should allow Node.JS based communication
- The framework should allow the number of discrete "services" to be scaled depending on load & support multiple load balance strategies
- The framework should allow instancing of "services" for better load balancing
- The framework should allow micro services to communicate with each other and share data
- The framework should have build in persistent storage even if the process is restarted
- The framework should be OS agnostic and run on all well known platforms
- The framework should be fast, secure, scalable and efficient
- The framework should handle errors seamlessly and not crash due to an error in a "service"
- The framework should restart failed services automatically
- The framework should handle all communication, ports and routing and allow extensive hardening and configuration

_Supports Node 8.x +_

# Installation

To install please follow the below instructions:

Using NPM:

    npm install risen-js --save

Using Yarn:

    yarn add risen-js

# How Fast Can I Deploy A Micro Service Framework?

Well, lets show you! We are going to create a simple HTTP based micro service framework which will use React.JS server side rendering with the aim of calculating all the prime numbers up to a certain number, defined within a query string and return a rendered [React.JS](https://reactjs.org) page back to your browser.

The example will be based on Linux however you can do the exact same thing with MacOS & Windows. We will skip going through each line of JavaScript code as this example assumes basic knowledge of Node.JS.

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
yarn add @babel/register @babel/preset-react @babel/preset-env react-dom@16.8.6 react@16.8.6 antd@3.18.2 risen-js@latest
```

_NOTE: We are using babel to transpile JSX on the micro service, thats why its here._

3. Create the file which will contain the functions which a micro service will have:

```
touch calculator.js
```

4. Paste the following into this file.

```
'use strict';

require('@babel/register')({
  presets: ['@babel/preset-react', '@babel/preset-env']
});

module.exports = require('./App');
```

5. Create the file which will contain the server configuration you are going to execute:

```
touch server.js
```

6. Paste the following code into the file you've just created:

```
'use strict';

// Import risen
const { Risen } = require('risen-js');

// Define express route
const getPrimeNumber = {
  method: 'GET', // The method which the request must have
  uri: '/getPrimeNumbers', // The url route (after the domain)
  handler: (req, res, { sendRequest, CommandBodyObject }) => {
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

7. Create the file which will contain the server you are going to execute:

```
touch App.jsx
```

8. Paste the following code into the file you've just created. This is to make the React.JS server side rendering work and demonstrate the true capabilities of the package:

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
// is probably where you want to do it!
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

9. Navigate to the this endpoint:

http://localhost:9898/getPrimeNumbers?primeUpTo=1000

You should see a website showing you a group of prime numbers. Try refreshing the page a couple times and notice how the `Instance ID` at the bottom of the page changes with each page load.

And there we are, in less than **200 lines** we have created micro service framework, with 5 identical instances of a React.JS server side renderer with an express HTTP server allowing for a RESTful interface between client and back-end. This is the philosophy of this framework, simple, fast and efficient!

# Documentation:

# Error Codes

## Transport

- 2001 - No data received.
- 2002 - Service connection initiation attempts, maximum reached.
- 2003 - Unable to connect to service core.
- 2004 - Unable to connect to specific service.
- 2005 - Request received but destination unknown.
- 2006 - Child service process exited unexpectedly.
- 2007 - Child service process exited unexpectedly.

## Functions

- 200 - Command not executed, transport failure or no data received.
- 201 - Command not executed, internal redirection failure.
- 202 - Command not executed, no data received by service.
- 203 - Command not executed, function unknown.

## Test

Run the following commands to test the module:

`npm install && npm test`

## Contributing

All contributions are very welcome, please read my [CONTRIBUTING.md](https://github.com/daviemakz/risen-js/blob/master/CONTRIBUTING.md) first. You can submit any ideas as [pull requests](https://github.com/daviemakz/risen-js/pulls) or as [GitHub issues](https://github.com/daviemakz/risen-js/issues). If you'd like to improve code, please feel free!

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdaviemakz%2Frisen-js.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdaviemakz%2Frisen-js?ref=badge_large)
