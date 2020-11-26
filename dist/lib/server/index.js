'use strict';

require("core-js");

require("regenerator-runtime");

var _isPortFree = _interopRequireDefault(require("is-port-free"));

var _isRunning = _interopRequireDefault(require("is-running"));

var _validator = require("validator");

var _net = require("../net");

var _common = _interopRequireDefault(require("../common"));

var _response = _interopRequireDefault(require("../template/response"));

var _baseMethods = require("./baseMethods");

var _request = require("../core/request");

var _options = require("../../options");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

var standardFunctions = [{
  name: 'echoData',
  func: _baseMethods.echoData
}, {
  name: 'noDataRecieved',
  func: _baseMethods.noDataRecieved
}, {
  name: 'redirectFailed',
  func: _baseMethods.redirectFailed
}];

var processManagement = function processManagement() {
  if (!(0, _isRunning["default"])(process.env.parentPid)) {
    setTimeout(function () {
      return process.exit();
    }, 1000);
  }
};

var MicroServer = function (_ServiceCommon) {
  _inherits(MicroServer, _ServiceCommon);

  var _super = _createSuper(MicroServer);

  function MicroServer() {
    var _this;

    _classCallCheck(this, MicroServer);

    _this = _super.call(this);
    _this.conId = 0;
    _this.listnerInterface = void 0;
    _this.speakerInterface = void 0;
    _this.connectionIndex = {};
    _this.operations = {};
    _this.settings = JSON.parse(process.env.settings);
    _this.options = JSON.parse(process.env.options);
    _this.serviceInfo = JSON.parse(process.env.serviceInfo);
    process.env.verbose = _this.settings.verbose;
    ['assignRequestFunctions', 'assignProcessListeners', 'assignFunctions', 'processRequest', 'bindService', 'initListener', 'initSpeaker'].forEach(function (func) {
      _this[func] = _this[func].bind(_assertThisInitialized(_this));
    });
    setInterval(processManagement, 1000);

    _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _this.assignRequestFunctions();

            case 3:
              _context.next = 5;
              return _this.assignFunctions();

            case 5:
              _context.next = 7;
              return _this.assignProcessListeners();

            case 7:
              _context.next = 9;
              return _this.initListener();

            case 9:
              _context.next = 11;
              return _this.initSpeaker();

            case 11:
              _context.next = 13;
              return _this.bindService();

            case 13:
              _context.next = 15;
              return _this.executeInitialFunctions('operations');

            case 15:
              return _context.abrupt("return", void 0);

            case 18:
              _context.prev = 18;
              _context.t0 = _context["catch"](0);
              throw new Error(_context.t0);

            case 21:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 18]]);
    }))();

    _this.operationScope = {
      request: _this.request,
      requestChain: _this.requestChain,
      sendRequest: _this.sendRequest,
      destroyConnection: _this.destroyConnection,
      operations: _this.operations,
      localStorage: {}
    };
    _this.microServerAddress = (0, _validator.isNumeric)(process.env.address) ? parseInt(process.env.address, 10) : process.env.address;
    return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
  }

  _createClass(MicroServer, [{
    key: "assignRequestFunctions",
    value: function assignRequestFunctions() {
      var _this2 = this;

      return new Promise(function (resolve) {
        Object.entries(_objectSpread({}, _request.requestOperations)).forEach(function (_ref2) {
          var _ref3 = _slicedToArray(_ref2, 2),
              name = _ref3[0],
              func = _ref3[1];

          _this2[name] = func.bind(_this2);
        });
        return resolve();
      });
    }
  }, {
    key: "assignFunctions",
    value: function assignFunctions() {
      var _this3 = this;

      return new Promise(function (resolve) {
        Object.entries(require(process.env.operations)).forEach(function (_ref4) {
          var _ref5 = _slicedToArray(_ref4, 2),
              name = _ref5[0],
              op = _ref5[1];

          if (name === 'default' && _typeof(op) === 'object') {
            Object.entries(op).forEach(function (_ref6) {
              var _ref7 = _slicedToArray(_ref6, 2),
                  nameEsm = _ref7[0],
                  opEsm = _ref7[1];

              _this3.operations[nameEsm] = opEsm.bind(_this3.operationScope);
            });
          } else {
            _this3.operations[name] = op.bind(_this3.operationScope);
          }
        });
        standardFunctions.forEach(function (_ref8) {
          var name = _ref8.name,
              func = _ref8.func;
          _this3.operations[name] = func.bind(_this3.operationScope);
        });
        return resolve();
      });
    }
  }, {
    key: "assignProcessListeners",
    value: function assignProcessListeners() {
      var _this4 = this;

      var handleError = function handleError(code) {
        var responseObject = new _response["default"]();
        responseObject.setResponseSource();
        responseObject.setTransportStatus({
          code: 5006,
          message: "Micro service process exited unexpectedly. CODE: ".concat(code)
        });
        responseObject.setCommandStatus({
          code: 500,
          message: 'Command not executed, transport failure'
        });
        responseObject.setErrData({
          entity: 'Unknown error',
          action: "Micro service process exited unexpectedly. CODE: ".concat(code),
          originalData: null
        });
        Object.values(_this4.connectionIndex).forEach(function (serviceCoreSocket) {
          serviceCoreSocket.reply(responseObject);
          serviceCoreSocket.conn.destroy();
        });
      };

      return new Promise(function (resolve) {
        _options.eventList.forEach(function (event) {
          process.on(event, handleError);
        });

        process.on('exit', handleError);
        return resolve();
      });
    }
  }, {
    key: "initListener",
    value: function initListener() {
      var _this5 = this;

      var startConnection = function startConnection(resolve, reject) {
        _this5.log("Starting service on address: ".concat(_this5.microServerAddress), 'log');

        _this5.listnerInterface = (0, _net.createSocketListener)(_this5.microServerAddress);

        if (!_this5.listnerInterface) {
          _this5.log('Unable to start micro service!', 'log');

          return reject(Error('Unable to start micro service!'));
        }

        _this5.log('Service started successfully!', 'log');

        return resolve(true);
      };

      return new Promise(function (resolve, reject) {
        if (typeof _this5.microServerAddress === 'number') {
          (0, _isPortFree["default"])(_this5.microServerAddress).then(startConnection(resolve, reject))["catch"](function (e) {
            _this5.log(e, 'error');

            _this5.log("Service port \"".concat(_this5.microServerAddress, "\" not free or unknown error has occurred. MORE INFO: ").concat(JSON.stringify(e, null, 2)), 'error');

            return reject(Error("Service port \"".concat(_this5.microServerAddress, "\" not free or unknown error has occurred. MORE INFO: ").concat(JSON.stringify(e, null, 2))));
          });
        } else {
          startConnection(resolve, reject);
        }
      });
    }
  }, {
    key: "initSpeaker",
    value: function initSpeaker() {
      var _this6 = this;

      return new Promise(function (resolve) {
        _this6.log("Connecting to service core on address: ".concat(_this6.settings.address), 'log');

        _this6.speakerInterface = (0, _net.createSocketSpeakerReconnect)(_this6.settings.address);

        if (!_this6.speakerInterface) {
          _this6.log('Unable to connect to service core! Process will attempt to connect manually next time!', 'log');
        }

        return resolve(true);
      });
    }
  }, {
    key: "bindService",
    value: function bindService() {
      var _this7 = this;

      return new Promise(function (resolve) {
        _this7.listnerInterface.on('SERVICE_REQUEST', function (serviceCoreSocket, data) {
          _this7.log("[".concat(_this7.conId, "] Micro service connection request received"));

          _this7.connectionIndex = _defineProperty({}, _this7.conId, serviceCoreSocket);

          if (data) {
            _this7.processRequest(serviceCoreSocket, data);
          } else {
            _this7.operations.noDataRecieved(serviceCoreSocket, data);
          }

          _this7.log("[".concat(_this7.conId, "] Micro service connection request processed!"));

          _this7.conId += 1;
          return void 0;
        });

        _this7.listnerInterface.on('SERVICE_KILL', function (serviceCoreSocket) {
          var responseObject = new _response["default"]();

          _this7.log("[".concat(_this7.conId, "] Micro service connection request received"));

          _this7.connectionIndex = _defineProperty({}, _this7.conId, serviceCoreSocket);

          _this7.log("[".concat(_this7.conId, "] Micro service connection request processed, kill command recieved!"));

          _this7.conId += 1;
          responseObject.setResponseSource();
          responseObject.setTransportStatus({
            code: 2000,
            message: 'Micro service process has exited!'
          });
          responseObject.setCommandStatus({
            code: 200,
            message: 'Command completed successfully'
          });
          serviceCoreSocket.reply(responseObject);

          if (_this7 !== null && _this7 !== void 0 && _this7.speakerInterface) {
            var _this7$speakerInterfa;

            _this7 === null || _this7 === void 0 ? void 0 : (_this7$speakerInterfa = _this7.speakerInterface) === null || _this7$speakerInterfa === void 0 ? void 0 : _this7$speakerInterfa.conn.destroy();
          }

          return process.exit();
        });

        return resolve();
      });
    }
  }, {
    key: "processRequest",
    value: function processRequest(serviceCoreSocket, command) {
      var data = command.data;
      var functionName = data.functionName;
      var helperMethods = this.buildResponseFunctions(serviceCoreSocket, command, this.operationScope);
      return Object.prototype.hasOwnProperty.call(this.operations, functionName) ? this.operations[functionName](helperMethods) : this.operations.redirectFailed(helperMethods);
    }
  }]);

  return MicroServer;
}(_common["default"]);

new MicroServer();