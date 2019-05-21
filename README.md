# Risen Micro Services Framework

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdaviemakz%2Frisen.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdaviemakz%2Frisen?ref=badge_shield)

[![NPM](https://nodei.co/npm/risen.png?compact=true)](https://www.npmjs.com/package/risen)

[![Build Status](https://travis-ci.org/daviemakz/risen.svg?branch=master)](https://travis-ci.org/daviemakz/risen)
[![Downloads](https://img.shields.io/github/downloads/daviemakz/risen/total.svg)](https://www.npmjs.com/package/risen)
[![dependencies Status](https://david-dm.org/daviemakz/risen/status.svg)](https://david-dm.org/daviemakz/risen)
[![devDependencies Status](https://david-dm.org/daviemakz/risen/dev-status.svg)](https://david-dm.org/daviemakz/risen?type=dev)

Risen is a fast, modern and powerful microservices framework for Node.JS. It helps you to build efficient, reliable & scalable HTTP(s) or local micro services.

_Supports Node 8.x +_

# Installation

To install please follow the below instructions:

Using NPM:

    npm install risen --save

Using Yarn:

    yarn add risen

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

All contributions are very welcome, please read my [CONTRIBUTING.md](https://github.com/daviemakz/risen/blob/master/CONTRIBUTING.md) first. You can submit any ideas as [pull requests](https://github.com/daviemakz/risen/pulls) or as [GitHub issues](https://github.com/daviemakz/risen/issues). If you'd like to improve code, please feel free!

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdaviemakz%2Frisen.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdaviemakz%2Frisen?ref=badge_large)
