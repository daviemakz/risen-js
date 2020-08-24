'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = void 0;

var _net = _interopRequireDefault(require('net'));

var _networkBase = _interopRequireDefault(require('./networkBase'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var extendsObj = function extendsObj(child, parent) {
  for (var key in parent) {
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

var Listener = (function(_super) {
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

    var tcpServer = _net['default'].createServer(function(connection) {
      return connection.on('data', function(data) {
        var message;
        var messageText;

        var _i;

        var _len;

        var _ref;

        var _results;

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
          data: json
        })
      );
    };

    message.next = function() {
      var _ref;

      return (_ref = _this.remoteMethods[subject]) !== null
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
    var methods;
    var subject;
    (subject = arguments[0]),
      (methods = arguments.length >= 2 ? [].slice.call(arguments, 1) : []);
    return (this.remoteMethods[subject] = methods);
  };

  return Listener;
})(_networkBase['default']);

var _default = Listener;
exports['default'] = _default;
