'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onData = onData;
exports["default"] = void 0;

var _net = _interopRequireDefault(require("net"));

var _networkBase = _interopRequireWildcard(require("./networkBase"));

var _constants = require("./constants");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function onData(data) {
  var ref = this.tokenizeData(data);
  var results = [];

  for (var i = 0, len = ref.length; i < len; i += 1) {
    var messageText = ref[i];
    var message = JSON.parse(messageText);

    if (this.waiters[message.id]) {
      this.waiters[message.id](message.data);
      results.push(delete this.waiters[message.id]);
    }
  }

  return results;
}

var SocketSpeaker = function (_NetworkBase) {
  _inherits(SocketSpeaker, _NetworkBase);

  var _super = _createSuper(SocketSpeaker);

  function SocketSpeaker(addresses) {
    var _this;

    _classCallCheck(this, SocketSpeaker);

    _this = _super.call(this, addresses);
    var address;
    _this.uniqueId = 1;
    _this.sockets = [];
    _this.waiters = {};
    _this.socketIterator = 0;
    _this.onData = onData.bind(_assertThisInitialized(_this));

    for (var i = 0, len = addresses.length; i < len; i += 1) {
      address = addresses[i];

      _this.connect(address);
    }

    return _this;
  }

  _createClass(SocketSpeaker, [{
    key: "connect",
    value: function connect(address) {
      var _this2 = this;

      var host = this.getHostByAddress(address);
      var port = this.getPortByAddress(address);
      var socket = new _net["default"].Socket();
      socket.uniqueSocketId = this.generateUniqueId();
      socket.setEncoding('utf8');
      socket.setNoDelay(true);
      socket.setMaxListeners(Infinity);
      socket.connect(port, host, function () {
        if (process.env.verbose === 'true') {
          console.log("Successfully connected to address: ".concat((0, _networkBase.getAddressFormatted)(host, port)));
        }

        return _this2.sockets.push(socket);
      });
      socket.on('data', this.onData);
    }
  }, {
    key: "request",
    value: function request(subject, data, callback) {
      return this.send(subject, data, callback);
    }
  }, {
    key: "send",
    value: function send(subject, data, callback) {
      var messageId;

      if (this.sockets.length === 0) {
        if (callback) {
          callback({
            error: _constants.ERR_REQ_REFUSED
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

      var payload = this.prepareJsonToSend({
        id: messageId,
        subject: subject,
        data: data
      });
      this.sockets[this.socketIterator].write(payload);
      this.socketIterator += 1;
    }
  }, {
    key: "shout",
    value: function shout(subject, data) {
      var socket;
      var ref = this.sockets;
      var results = [];
      var payload = {
        subject: subject,
        data: data
      };

      for (var i = 0, len = ref.length; i < len; i += 1) {
        socket = ref[i];
        results.push(socket.write(this.prepareJsonToSend(payload)));
      }

      return results;
    }
  }, {
    key: "generateUniqueId",
    value: function generateUniqueId() {
      var id = "id-".concat(this.uniqueId);

      if (!this.waiters[id]) {
        return id;
      }

      if (this.uniqueId === _constants.MAX_WAITERS) {
        this.uniqueId = 1;
      }

      this.uniqueId += 1;
      var newId = "id-".concat(this.uniqueId);

      if (this.waiters[newId]) {
        delete this.waiters[newId];
      }

      return this.generateUniqueId();
    }
  }]);

  return SocketSpeaker;
}(_networkBase["default"]);

var _default = SocketSpeaker;
exports["default"] = _default;