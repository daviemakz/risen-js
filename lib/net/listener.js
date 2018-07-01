'use strict';

// Load NPM modules
const net = require('net');

// Load libs
const networkBase = require('./networkBase');

// FUNCTION: Extend object
const extendsObj = function(child, parent) {
  for (var key in parent) {
    if ({}.hasOwnProperty.call(parent, key)) child[key] = parent[key];
  }
  function ctor() {
    this.constructor = child;
  }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  child.__super__ = parent.prototype;
  return child;
};

// FUNCTION: Listener
const Listener = (function(_super) {
  extendsObj(Listener, _super);
  function Listener(address) {
    var _this = this;
    Listener.__super__.constructor.call(this);
    this.remoteMethods = {};
    this.host = this.getHostByAddress(address);
    this.port = this.getPortByAddress(address);
    this.startServer();
    this.errorFn = function() {
      return _this.startServer();
    };
  }
  Listener.prototype.startServer = function() {
    var _this = this;
    var tcpServer = net.createServer(function(connection) {
      return connection.on('data', function(data) {
        var message, messageText, _i, _len, _ref, _results;
        _ref = _this.tokenizeData(data);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          messageText = _ref[_i];
          message = JSON.parse(messageText);
          message.conn = connection;
          message = _this.prepare(message);
          _results.push(_this.dispatch(message));
        }
        return _results;
      });
    });
    tcpServer.listen(this.port, this.host);
    tcpServer.setMaxListeners(Infinity);
    return tcpServer.on('error', function(exception) {
      return _this.errorFn(exception);
    });
  };
  Listener.prototype.onError = function(errorFn) {
    this.errorFn = errorFn;
  };
  Listener.prototype.prepare = function(message) {
    var _this = this;
    var subject = message.subject;
    var i = 0;
    message.reply = function(json) {
      return message.conn.write(
        _this.prepareJsonToSend({
          id: message.id,
          data: json,
        })
      );
    };
    message.next = function() {
      var _ref;
      return (_ref = _this.remoteMethods[subject]) != null
        ? _ref[i++](message, message.data)
        : void 0;
    };
    return message;
  };
  Listener.prototype.dispatch = function(message) {
    var subject = message.subject;
    return message.next();
  };
  Listener.prototype.on = function() {
    var methods, subject;
    (subject = arguments[0]),
      (methods = 2 <= arguments.length ? [].slice.call(arguments, 1) : []);
    return (this.remoteMethods[subject] = methods);
  };
  return Listener;
})(networkBase);

// EXPORTS
module.exports = Listener;
