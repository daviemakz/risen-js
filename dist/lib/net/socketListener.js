'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _net = _interopRequireDefault(require("net"));

var _autoBind = _interopRequireDefault(require("auto-bind"));

var _networkBase = _interopRequireDefault(require("./networkBase"));

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

var SocketListener = function (_NetworkBase) {
  _inherits(SocketListener, _NetworkBase);

  var _super = _createSuper(SocketListener);

  function SocketListener(address) {
    var _this;

    _classCallCheck(this, SocketListener);

    _this = _super.call(this, address);
    (0, _autoBind["default"])(_assertThisInitialized(_this));
    _this.remoteMethods = {};
    _this.host = _this.getHostByAddress(address);
    _this.port = _this.getPortByAddress(address);

    _this.startServer();

    _this.errorFn = function () {
      return _this.startServer();
    };

    return _this;
  }

  _createClass(SocketListener, [{
    key: "startServer",
    value: function startServer() {
      var _this2 = this;

      var tcpServer = _net["default"].createServer(function (connection) {
        return connection.on('data', function (data) {
          var message;
          var messageText;

          var ref = _this2.tokenizeData(data);

          var results = [];

          for (var i = 0, len = ref.length; i < len; i += 1) {
            messageText = ref[i];
            message = JSON.parse(messageText);
            message.conn = connection;
            message = _this2.prepare(message);
            results.push(_this2.dispatch(message));
          }

          return results;
        });
      });

      tcpServer.listen(this.port, this.host);
      tcpServer.setMaxListeners(Infinity);
      return tcpServer.on('error', function (exception) {
        return _this2.errorFn(exception);
      });
    }
  }, {
    key: "onError",
    value: function onError(errorFn) {
      this.errorFn = errorFn;
    }
  }, {
    key: "prepare",
    value: function prepare(message) {
      var _this3 = this;

      var subject = message.subject;
      var i = 0;
      Object.assign(message, {
        reply: function reply(json) {
          return message.conn.write(_this3.prepareJsonToSend({
            id: message.id,
            data: json
          }));
        }
      });
      Object.assign(message, {
        next: function next() {
          var ref = _this3.remoteMethods[subject];

          if (ref !== null) {
            var nextVal = ref[i](message, message.data);
            i += 1;
            return nextVal;
          }

          return void 0;
        }
      });
      return message;
    }
  }, {
    key: "dispatch",
    value: function dispatch(message) {
      return message.next();
    }
  }, {
    key: "on",
    value: function on() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var subject = args[0];
      var methods = args.length >= 2 ? [].slice.call(args, 1) : [];
      this.remoteMethods[subject] = methods;
      return methods;
    }
  }]);

  return SocketListener;
}(_networkBase["default"]);

var _default = SocketListener;
exports["default"] = _default;