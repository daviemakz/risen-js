'use strict';

/* eslint-disable */

// Load NPM modules
import net from 'net';

// Load libs
import networkBase from './networkBase';

// Extend object
const extendsObj = function (child, parent) {
  for (const key in parent) {
    if ({}.hasOwnProperty.call(parent, key)) {
      child[key] = parent[key];
    }
  }
  function ctor() {
    this.constructor = child;
  }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  child.__super__ = parent.prototype;
  return child;
};

// Listener
const Listener = (function (_super) {
  extendsObj(Listener, _super);
  function Listener(address) {
    const _this = this;
    Listener.__super__.constructor.call(this);
    this.remoteMethods = {};
    this.host = this.getHostByAddress(address);
    this.port = this.getPortByAddress(address);
    this.startServer();
    this.errorFn = function () {
      return _this.startServer();
    };
  }
  Listener.prototype.startServer = function () {
    const _this = this;
    const tcpServer = net.createServer((connection) =>
      connection.on('data', (data) => {
        let message;
        let messageText;
        let _i;
        let _len;
        let _ref;
        let _results;
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
      })
    );
    tcpServer.listen(this.port, this.host);
    tcpServer.setMaxListeners(Infinity);
    return tcpServer.on('error', (exception) => _this.errorFn(exception));
  };
  Listener.prototype.onError = function (errorFn) {
    this.errorFn = errorFn;
  };
  Listener.prototype.prepare = function (message) {
    const _this = this;
    const { subject } = message;
    let i = 0;
    message.reply = function (json) {
      return message.conn.write(
        _this.prepareJsonToSend({
          id: message.id,
          data: json
        })
      );
    };
    message.next = function () {
      let _ref;
      return (_ref = _this.remoteMethods[subject]) !== null
        ? _ref[i++](message, message.data)
        : void 0;
    };
    return message;
  };
  Listener.prototype.dispatch = function (message) {
    const { subject } = message;
    return message.next();
  };
  Listener.prototype.on = function () {
    let methods;
    let subject;
    (subject = arguments[0]),
      (methods = arguments.length >= 2 ? [].slice.call(arguments, 1) : []);
    return (this.remoteMethods[subject] = methods);
  };
  return Listener;
})(networkBase);

// EXPORTS
export default Listener;
