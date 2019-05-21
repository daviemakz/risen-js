# Risen - JS Micro Services Framework

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdaviemakz%2Frisen.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdaviemakz%2Frisen?ref=badge_shield)

[![NPM](https://nodei.co/npm/micro-service-framework.png?compact=true)](https://www.npmjs.com/package/micro-service-framework)

[![Build Status](https://travis-ci.org/daviemakz/micro-service-framework.svg?branch=master)](https://travis-ci.org/daviemakz/micro-service-framework)
[![Downloads](https://img.shields.io/github/downloads/daviemakz/micro-service-framework/total.svg)](https://www.npmjs.com/package/micro-service-framework)
[![dependencies Status](https://david-dm.org/daviemakz/micro-service-framework/status.svg)](https://david-dm.org/daviemakz/micro-service-framework)
[![devDependencies Status](https://david-dm.org/daviemakz/micro-service-framework/dev-status.svg)](https://david-dm.org/daviemakz/micro-service-framework?type=dev)

Risen is a fast, modern and powerful microservices framework for Node.JS. It helps you to build efficient, reliable & scalable HTTP(s) or local micro services.

_Supports Node 8.x +_

# Installation

To install please follow the below instructions:

Using NPM:

    npm install micro-service-framework --save

Using Yarn:

    yarn add micro-service-framework

# Features

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

# Examples

## Server Side Examples

## Streaming Data To An Single Micro Service

This example is setting up a simple micro service which handles a readable stream and sends the data to the micro-service and returns a readable stream back to the parent process.

```

```

## Test

Run the following commands to test the module:

`npm install && npm test`

## Contributing

All contributions are very welcome, please read my [CONTRIBUTING.md](https://github.com/daviemakz/micro-service-framework/blob/master/CONTRIBUTING.md) first. You can submit any ideas as [pull requests](https://github.com/daviemakz/micro-service-framework/pulls) or as [GitHub issues](https://github.com/daviemakz/micro-service-framework/issues). If you'd like to improve code, please feel free!

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdaviemakz%2Frisen.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdaviemakz%2Frisen?ref=badge_large)
