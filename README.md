# Node.JS Micro Services Framework

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdaviemakz%2Fmicro-services-framework.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdaviemakz%2Fmicro-services-framework?ref=badge_shield)

[![NPM](https://nodei.co/npm/micro-services-framework.png?compact=true)](https://www.npmjs.com/package/micro-services-framework)

[![Build Status](https://travis-ci.org/daviemakz/micro-services-framework.svg?branch=master)](https://travis-ci.org/daviemakz/micro-services-framework)
[![dependencies Status](https://david-dm.org/daviemakz/micro-services-framework/status.svg)](https://david-dm.org/daviemakz/micro-services-framework)
[![devDependencies Status](https://david-dm.org/daviemakz/micro-services-framework/dev-status.svg)](https://david-dm.org/daviemakz/micro-services-framework?type=dev)

This package allows streaming &amp; non-streaming micro-services to be build on the front-end and the back-end. Within the browser it uses Web Workers while in the server-side it utilises child processes

_Supports Node 6.x +_

# Installation

To install please follow the below instructions:

Using NPM:

    npm install micro-services-framework --save

Using Yarn:

    yarn add micro-services-framework -W

# Error Codes

200 - Command not executed, transport failure or no data received.  
201 - Command not executed, internal redirection failure.
202 - Command not executed, no data received by service.
203 - Command not executed, function unknown.

## Transport

2001 - No data received.
2002 - Service connection initiation attempts, maximum reached.
2003 - Unable to connect to service core.
2004 - Unable to connect to specific service.
2005 - Request received but destination unknown.
2006 - Child service process exited unexpectedly.
2007 - Child service process exited unexpectedly.

## Functions

# Examples

## Server Side Examples

## Streaming Data To An Single Micro Service

This example is setting up a simple micro service which handles a readable stream and sends the data to the micro-service and returns a readable stream back to the parent process.

```

```

## Browser Examples

## Example App 1: [insert link]

## Test

Run the following commands to test the module:

`npm install && npm test`

## Contributing

All contributions are very welcome, please read my [CONTRIBUTING.md](https://github.com/daviemakz/micro-services-framework/blob/master/CONTRIBUTING.md) first. You can submit any ideas as [pull requests](https://github.com/daviemakz/micro-services-framework/pulls) or as [GitHub issues](https://github.com/daviemakz/micro-services-framework/issues). If you'd like to improve code, please feel free!

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdaviemakz%2Fmicro-services-framework.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdaviemakz%2Fmicro-services-framework?ref=badge_large)
