'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _net = _interopRequireDefault(require("net"));

var _networkBase = require("./networkBase");

var _socketSpeaker = _interopRequireDefault(require("./socketSpeaker"));

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

var processExitedPorts = function processExitedPorts(ports) {
  return typeof ports === 'string' ? ports.split(',') : ports;
};

var SocketSpeakerReconnect = function (_SocketSpeaker) {
  _inherits(SocketSpeakerReconnect, _SocketSpeaker);

  var _super = _createSuper(SocketSpeakerReconnect);

  function SocketSpeakerReconnect() {
    _classCallCheck(this, SocketSpeakerReconnect);

    return _super.apply(this, arguments);
  }

  _createClass(SocketSpeakerReconnect, [{
    key: "connect",
    value: function connect(address) {
      var _this = this;

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

        return _this.sockets.push(socket);
      });
      socket.on('data', this.onData);
      socket.on('error', function () {});
      socket.on('close', function () {
        var isInExitedProcessPorts = processExitedPorts(process.env.exitedProcessPorts).map(function (port) {
          return parseInt(port, 10);
        }).includes(port);

        if (!isInExitedProcessPorts) {
          if (process.env.verbose === 'true') {
            console.log("Attempting to connect to address: ".concat((0, _networkBase.getAddressFormatted)(host, port)));
          }

          var index = 0;
          var sock;
          var ref = _this.sockets;

          for (var i = 0, len = ref.length; i < len; i += 1) {
            sock = ref[i];

            if (sock.uniqueSocketId === socket.uniqueSocketId) {
              break;
            }

            index += 1;
          }

          _this.sockets.splice(index, 1);

          socket.destroy();
          setTimeout(function () {
            return _this.connect(address);
          }, 100);
        }
      });
    }
  }]);

  return SocketSpeakerReconnect;
}(_socketSpeaker["default"]);

var _default = SocketSpeakerReconnect;
exports["default"] = _default;