// Load NPM modules
const net = require('net');

// Load libs
const networkBase = require('./networkBase');

// Declare variables
const ERR_REQ_REFUSED = -1;
const MAX_WAITERS = 9999999;

// FUNCTION: Extend object
const extendsObj = function(child, parent) {
  for (const key in parent) {
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

// FUNCTION: Speaker
const Speaker = (function(_super) {
  extendsObj(Speaker, _super);
  function Speaker(addresses) {
    let address;
    let _i;
    let _len;
    Speaker.__super__.constructor.call(this);
    this.uniqueId = 1;
    this.sockets = [];
    this.waiters = {};
    this.socketIterator = 0;
    for (_i = 0, _len = addresses.length; _i < _len; _i++) {
      address = addresses[_i];
      this.connect(address);
    }
  }
  Speaker.prototype.connect = function(address) {
    let host;
    let port;
    let self;
    let socket;
    const _this = this;
    self = this;
    host = this.getHostByAddress(address);
    port = this.getPortByAddress(address);
    socket = new net.Socket();
    socket.uniqueSocketId = this.generateUniqueId();
    socket.setEncoding('utf8');
    socket.setNoDelay(true);
    socket.setMaxListeners(Infinity);
    socket.connect(
      port,
      host,
      () => {
        console.log(`API Gateway successfully connected to service on port: ${port}`);
        return _this.sockets.push(socket);
      }
    );
    socket.on('data', data => {
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
        if (!_this.waiters[message.id]) {
          continue;
        }
        _this.waiters[message.id](message.data);
        _results.push(delete _this.waiters[message.id]);
      }
      return _results;
    });
    socket.on('error', () => {});
    return socket.on('close', () => {
      console.log(`Attempting to connect to service on port: ${port}`);
      let index;
      let sock;
      let _i;
      let _len;
      let _ref;
      index = 0;
      _ref = _this.sockets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sock = _ref[_i];
        if (sock.uniqueSocketId === socket.uniqueSocketId) {
          break;
        }
        index += 1;
      }
      _this.sockets.splice(index, 1);
      socket.destroy();
      return setTimeout(() => self.connect(address), 10);
    });
  };
  Speaker.prototype.request = function(subject, data, callback) {
    if (callback == null) {
      callback = null;
    }
    return this.send(subject, data, callback);
  };
  Speaker.prototype.send = function(subject, data, callback) {
    let messageId;
    let payload;
    if (callback == null) {
      callback = null;
    }
    if (this.sockets.length === 0) {
      if (callback) {
        callback({
          error: ERR_REQ_REFUSED,
        });
      }
      return;
    }
    if (!this.sockets[this.socketIterator]) {
      this.socketIterator = 0;
    }
    if (callback) {
      messageId = this.generateUniqueId();
      this.waiters[messageId] = callback;
    }
    payload = this.prepareJsonToSend({
      id: messageId,
      subject,
      data,
    });
    return this.sockets[this.socketIterator++].write(payload);
  };
  Speaker.prototype.shout = function(subject, data) {
    let payload;
    let socket;
    let _i;
    let _len;
    let _ref;
    let _results;
    payload = {
      subject,
      data,
    };
    _ref = this.sockets;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      socket = _ref[_i];
      _results.push(socket.write(this.prepareJsonToSend(payload)));
    }
    return _results;
  };
  Speaker.prototype.generateUniqueId = function() {
    let id;
    let newId;
    id = `id-${this.uniqueId}`;
    if (!this.waiters[id]) {
      return id;
    }
    if (this.uniqueId++ === MAX_WAITERS) {
      this.uniqueId = 1;
    }
    if (this.waiters[(newId = `id-${this.uniqueId}`)]) {
      delete this.waiters[newId];
    }
    return this.generateUniqueId();
  };
  return Speaker;
})(networkBase);

// EXPORTS
module.exports = Speaker;
