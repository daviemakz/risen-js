'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _uuid = require("uuid");

var _fs = require("fs");

var _child_process = require("child_process");

var _path = require("path");

var _response = _interopRequireDefault(require("./template/response"));

var _net = require("./net");

var _util = require("./util");

var _common = _interopRequireDefault(require("./common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

var coreName = 'serviceCore';

var ServiceCore = function (_ServiceCommon) {
  _inherits(ServiceCore, _ServiceCommon);

  var _super = _createSuper(ServiceCore);

  function ServiceCore(options) {
    var _this;

    _classCallCheck(this, ServiceCore);

    _this = _super.call(this, options);
    process.env.name = coreName;
    ['addServerToTracking', 'checkConnection', 'databaseOperation', 'destinationUnknown', 'functionUnknown', 'getMicroServiceSocket', 'initConnectionToService', 'initService', 'initiateMicroServerConnection', 'microServerCommunication', 'processComError', 'processComRequest', 'removeServerFromTracking', 'resolveMicroServiceSocket'].forEach(function (func) {
      _this[func] = _this[func].bind(_assertThisInitialized(_this));
    });
    return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
  }

  _createClass(ServiceCore, [{
    key: "databaseOperation",
    value: function databaseOperation(table, method, args, callback) {
      var _this2 = this;

      return setImmediate(function () {
        try {
          var _this2$db$table;

          return Object.prototype.hasOwnProperty.call(_this2.db, table) ? callback(true, (_this2$db$table = _this2.db[table])[method].apply(_this2$db$table, _toConsumableArray(args)), null) : callback(false, void 0, new Error("The table ".concat(table, " does not exist!")));
        } catch (e) {
          return callback(false, void 0, e);
        }
      });
    }
  }, {
    key: "getProcessIndex",
    value: function getProcessIndex(name, port) {
      return this.serviceData[name].port.indexOf(port);
    }
  }, {
    key: "addServerToTracking",
    value: function addServerToTracking(name, port, instanceId) {
      if (!this.inUsePorts.includes(port)) {
        this.inUsePorts.push(port);
      }

      process.env.exitedProcessPorts = (typeof process.env.exitedProcessPorts === 'string' ? process.env.exitedProcessPorts.split(',') : process.env.exitedProcessPorts).map(function (port) {
        return parseInt(port, 10);
      }).filter(function (exitedPort) {
        return typeof port === 'number' && exitedPort !== port;
      });

      if (Object.prototype.hasOwnProperty.call(this.serviceData, name)) {
        this.serviceData[name] = _objectSpread(_objectSpread({}, this.serviceData[name]), {}, {
          socketList: this.serviceData[name].socketList.concat(void 0),
          port: this.serviceData[name].port.concat(port),
          instanceId: this.serviceData[name].instanceId.concat(instanceId),
          process: this.serviceData[name].process.concat(void 0),
          connectionCount: this.serviceData[name].connectionCount.concat(0)
        });
        return true;
      }

      this.serviceData[name] = {
        instanceId: [instanceId],
        socketList: [void 0],
        status: false,
        error: false,
        port: [port],
        connectionCount: [0],
        process: [void 0]
      };
      return true;
    }
  }, {
    key: "removeServerFromTracking",
    value: function removeServerFromTracking(name, port) {
      var socketIndex = this.serviceData[name].port.indexOf(port);
      this.inUsePorts = this.inUsePorts.filter(function (usedPort) {
        return usedPort !== port;
      });

      if (socketIndex > -1) {
        this.serviceData[name].instanceId.splice(socketIndex, 1);
        this.serviceData[name].socketList.splice(socketIndex, 1);
        this.serviceData[name].port.splice(socketIndex, 1);
        this.serviceData[name].process.splice(socketIndex, 1);
        this.serviceData[name].connectionCount.splice(socketIndex, 1);
      }

      return void 0;
    }
  }, {
    key: "initService",
    value: function initService(name, callback) {
      var _this3 = this;

      var port = void 0;
      var instanceId = (0, _uuid.v4)();

      var microServiceWrapper = function microServiceWrapper() {
        return new Promise(function (resolve, reject) {
          var initialiseOnFreePort = function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
              var host;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.prev = 0;
                      _context.next = 3;
                      return (0, _util.findAFreePort)(_this3);

                    case 3:
                      port = _context.sent;

                      if (!_this3.inUsePorts.includes(port)) {
                        _context.next = 6;
                        break;
                      }

                      return _context.abrupt("return", setTimeout(initialiseOnFreePort, 50));

                    case 6:
                      _this3.addServerToTracking(name, port, instanceId);

                      host = (0, _net.getHostByAddress)(_this3.settings.address);
                      _this3.serviceData[name].error = false;
                      _this3.serviceData[name].process[_this3.getProcessIndex(name, port)] = (0, _child_process.exec)("".concat(process.execPath, " ").concat(__dirname, "/server/entry.js"), {
                        maxBuffer: 1024 * _this3.settings.maxBuffer,
                        env: {
                          parentPid: process.pid,
                          verbose: process.env.verbose,
                          name: name,
                          instanceId: instanceId,
                          address: host !== null ? "".concat(host, ":").concat(port) : port,
                          service: true,
                          operations: _this3.serviceInfo[name],
                          settings: JSON.stringify(_this3.settings),
                          options: JSON.stringify(_this3.serviceOptions[name]),
                          serviceInfo: JSON.stringify(_this3.serviceInfo)
                        }
                      }, function (error, stdout, stderr) {
                        _this3.removeServerFromTracking(name, port);

                        if (error || stderr) {
                          _this3.serviceData[name].error = true;
                        }

                        (0, _util.handleOnData)(_this3, port, instanceId)(name, 'event', "Micro service - ".concat(name, ": Process has exited!"));
                      });
                      return _context.abrupt("return", resolve(callback(true)));

                    case 13:
                      _context.prev = 13;
                      _context.t0 = _context["catch"](0);
                      return _context.abrupt("return", reject(Error(_context.t0)));

                    case 16:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee, null, [[0, 13]]);
            }));

            return function initialiseOnFreePort() {
              return _ref.apply(this, arguments);
            };
          }();

          return initialiseOnFreePort();
        });
      };

      var startService = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(callback) {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;
                  _context2.next = 3;
                  return microServiceWrapper();

                case 3:
                  _context2.next = 5;
                  return new Promise(function (resolve) {
                    ['stdout', 'stderr'].forEach(function (event) {
                      return _this3.serviceData[name].process[_this3.getProcessIndex(name, port)][event].on('data', function (data) {
                        return (0, _util.handleOnData)(_this3, port, instanceId)(name, event, data);
                      });
                    });
                    ['exit'].forEach(function (event) {
                      return _this3.serviceData[name].process[_this3.getProcessIndex(name, port)].on(event, function () {
                        setTimeout(function () {
                          if (!process.env.exitedProcessPorts.split(',').map(function (port) {
                            return parseInt(port, 10);
                          }).includes(port)) {
                            startService(callback);
                          }
                        }, _this3.settings.restartTimeout);
                      });
                    });
                    resolve();
                  });

                case 5:
                  _context2.next = 7;
                  return new Promise(function (resolve) {
                    _this3.initConnectionToService(name, port, function () {
                      callback.apply(void 0, arguments);
                      resolve();
                    });
                  });

                case 7:
                  _context2.next = 12;
                  break;

                case 9:
                  _context2.prev = 9;
                  _context2.t0 = _context2["catch"](0);
                  throw new Error(_context2.t0);

                case 12:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, null, [[0, 9]]);
        }));

        return function startService(_x) {
          return _ref2.apply(this, arguments);
        };
      }();

      startService(callback);
    }
  }, {
    key: "writeToLogFile",
    value: function writeToLogFile(contents) {
      var _this4 = this;

      if (this.settings.logPath) {
        return (0, _mkdirp["default"])((0, _path.dirname)(this.settings.logPath)).then(function () {
          if (!_this4.logFileStream) {
            _this4.logFileStream = (0, _fs.createWriteStream)(_this4.settings.logPath, {
              flags: 'a'
            });
          }

          return _this4.logFileStream.write("".concat(contents, "\n"));
        })["catch"](function (error) {
          if (error) {
            _this4.log("Unable to write to log file. MORE INFO: ".concat(error), 'warn');
          }
        });
      }

      return void 0;
    }
  }, {
    key: "initiateMicroServerConnection",
    value: function initiateMicroServerConnection(port, callback) {
      var _this5 = this;

      var connectionAttempts = 0;
      var _this$settings = this.settings,
          msConnectionTimeout = _this$settings.msConnectionTimeout,
          address = _this$settings.address;
      var host = (0, _net.getHostByAddress)(address);
      var resolvedAddress = host !== null ? "".concat(host, ":").concat(port) : port;
      var portEmitter = (0, _net.createSocketSpeakerReconnect)(resolvedAddress);

      var startMicroServiceConnection = function startMicroServiceConnection() {
        if (Object.values(portEmitter.sockets).length === 0) {
          if (connectionAttempts <= msConnectionTimeout) {
            return setTimeout(function () {
              startMicroServiceConnection();
              connectionAttempts += 1;
            }, 10);
          }

          portEmitter.error = 'Socket initialization timeout...';
          return _this5.log("Socket initialization timeout to: ".concat(resolvedAddress), 'log');
        }

        _this5.log("Service core successfully initialized socket on address: ".concat(resolvedAddress), 'log');

        return callback(portEmitter);
      };

      return startMicroServiceConnection();
    }
  }, {
    key: "initConnectionToService",
    value: function initConnectionToService(name, port, callback) {
      var _this6 = this;

      var address = this.settings.address;
      var host = (0, _net.getHostByAddress)(address);
      var resolvedAddress = host !== null ? "".concat(host, ":").concat(port) : port;
      return this.initiateMicroServerConnection(port, function (socket) {
        if (Object.prototype.hasOwnProperty.call(socket, 'error')) {
          _this6.log("Unable to connect to service - ".concat(name, ". Retrying..."), 'log');

          _this6.serviceData[name].status = false;
          return setTimeout(function () {
            return _this6.initConnectionToService(name, port, callback);
          }, _this6.settings.connectionTimeout);
        }

        _this6.log("Service core has successfully connected to micro service: ".concat(resolvedAddress));

        _this6.serviceData[name].status = true;
        _this6.serviceData[name].socketList[_this6.getProcessIndex(name, port)] = socket;
        return callback(true, socket);
      });
    }
  }, {
    key: "processComError",
    value: function processComError(command, clientSocket) {
      if (!command) {
        var responseObject = new _response["default"]();
        responseObject.setTransportStatus({
          code: 5001,
          message: 'No data received'
        });
        responseObject.setCommandStatus({
          code: 500,
          message: 'Command not executed, tansport failure  or no data recieved!'
        });
        responseObject.setErrData({
          entity: 'Service core',
          action: 'Request error handling',
          originalData: command
        });
        this.log("No data received. MORE INFO: ".concat(responseObject), 'log');
        return clientSocket.reply(responseObject);
      }

      return void 0;
    }
  }, {
    key: "microServerCommunication",
    value: function () {
      var _microServerCommunication = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(recData, clientSocket, microServiceInfo) {
        var _yield$this$getMicroS, _yield$this$getMicroS2, socket;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(microServiceInfo.status === 0)) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return", 'connectionNotReady');

              case 2:
                _context3.next = 4;
                return this.getMicroServiceSocket(recData.destination, microServiceInfo.socketList, recData);

              case 4:
                _yield$this$getMicroS = _context3.sent;
                _yield$this$getMicroS2 = _slicedToArray(_yield$this$getMicroS, 1);
                socket = _yield$this$getMicroS2[0];
                return _context3.abrupt("return", socket.request('SERVICE_REQUEST', recData, function (res) {
                  clientSocket.reply(res);
                  return 'connectionReady';
                }));

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function microServerCommunication(_x2, _x3, _x4) {
        return _microServerCommunication.apply(this, arguments);
      }

      return microServerCommunication;
    }()
  }, {
    key: "checkConnection",
    value: function checkConnection(recData, clientSocket, microServiceInfo, conId, connectionAttempts) {
      var _this7 = this;

      var microServerConnection = this.microServerCommunication(recData, clientSocket, microServiceInfo, conId);
      var intConnAttempts = connectionAttempts;

      if (microServerConnection === 'connectionNotReady') {
        if (intConnAttempts > this.settings.msConnectionRetryLimit) {
          this.log('Service connection initiation attempts, maximum reached');
          var responseObject = new _response["default"]();
          responseObject.setTransportStatus({
            code: 5002,
            message: 'Reached maximum service connection initiation attempts!'
          });
          responseObject.setCommandStatus({
            code: 500,
            message: 'Command not executed, tansport failure!'
          });
          responseObject.setErrData({
            entity: 'Service core',
            action: 'Service redirection',
            originalData: recData
          });
          clientSocket.reply(responseObject);
          return clientSocket.conn.destroy();
        }

        intConnAttempts += 1;
        return setTimeout(function () {
          return _this7.checkConnection(recData, clientSocket, microServiceInfo, conId, intConnAttempts);
        }, 10);
      }

      return this.log("[".concat(conId, "] Local socket connection handed over successfully!"));
    }
  }, {
    key: "getMicroServiceSocket",
    value: function getMicroServiceSocket(name, socketList, command) {
      var _this8 = this;

      return new Promise(function (resolve) {
        var socketData;

        var getSocket = function getSocket() {
          socketData = _this8.resolveMicroServiceSocket(name, socketList, command);

          var _socketData = socketData,
              _socketData2 = _slicedToArray(_socketData, 2),
              socket = _socketData2[0],
              index = _socketData2[1];

          if (socket) {
            resolve([socket, index]);
          } else {
            setTimeout(function () {
              getSocket();
            }, 1);
          }
        };

        getSocket();
      });
    }
  }, {
    key: "resolveMicroServiceSocket",
    value: function resolveMicroServiceSocket(name, socketList, command) {
      var socketResult;

      switch (true) {
        case typeof this.serviceOptions[name].loadBalancing === 'function':
          {
            socketResult = this.serviceOptions[name].loadBalancing(socketList, command);
            break;
          }

        case this.serviceOptions[name].loadBalancing === 'roundRobin':
          {
            var socketIndex = this.serviceData[name].connectionCount.indexOf(Math.min.apply(Math, _toConsumableArray(this.serviceData[name].connectionCount)));
            socketResult = [socketList[socketIndex], socketIndex];
            break;
          }

        case this.serviceOptions[name].loadBalancing === 'random':
          {
            socketResult = (0, _util.randomScheduling)(socketList);
            break;
          }

        default:
          {
            this.log("Load balancing strategy for ".concat(name, " is incorrect. Defaulting to \"random\" strategy..."), 'warn');
            socketResult = (0, _util.randomScheduling)(socketList);
            break;
          }
      }

      this.serviceData[name].connectionCount[socketResult[1]] += 1;
      return socketResult;
    }
  }, {
    key: "functionUnknown",
    value: function functionUnknown(command) {
      this.log("Request received & destination verified but function unknown. MORE INFO: ".concat(command.destination));
      var responseObject = new _response["default"]();
      responseObject.setTransportStatus({
        code: 5007,
        message: 'Request received & destination verified but function unknown!'
      });
      responseObject.setCommandStatus({
        code: 503,
        message: 'Command not executed, function unknown!'
      });
      responseObject.setErrData({
        entity: 'Service core',
        action: 'Service redirection',
        originalData: command
      });
      return responseObject;
    }
  }, {
    key: "destinationUnknown",
    value: function destinationUnknown(command) {
      this.log("Request received but destination unknown. MORE INFO: ".concat(command.destination));
      var responseObject = new _response["default"]();
      responseObject.setTransportStatus({
        code: 5005,
        message: 'Request recieved but destination unknown!'
      });
      responseObject.setCommandStatus({
        code: 500,
        message: 'Command not executed, transport failure!'
      });
      responseObject.setErrData({
        entity: 'Service core',
        action: 'Service redirection',
        originalData: command
      });
      return responseObject;
    }
  }, {
    key: "processComRequest",
    value: function processComRequest(command, clientSocket, connectionId) {
      var _this9 = this;

      var connectionAttempts = 0;

      switch (true) {
        case command.destination === process.env.name:
          {
            return setImmediate(function () {
              var helperMethods = _this9.buildResponseFunctions(clientSocket, command, _this9.operationScope);

              return Object.prototype.hasOwnProperty.call(_this9.coreOperations, command.data.functionName) ? _this9.coreOperations[command.data.functionName](helperMethods) : (0, _util.handleReplyToSocket)(_this9.functionUnknown(command), clientSocket, false);
            });
          }

        case Object.prototype.hasOwnProperty.call(this.serviceData, command.destination):
          {
            var microServiceInfo = this.serviceData[command.destination];
            return this.checkConnection(command, clientSocket, microServiceInfo, connectionId, connectionAttempts);
          }

        default:
          {
            return (0, _util.handleReplyToSocket)(this.destinationUnknown(command), clientSocket, false);
          }
      }
    }
  }]);

  return ServiceCore;
}(_common["default"]);

var _default = ServiceCore;
exports["default"] = _default;