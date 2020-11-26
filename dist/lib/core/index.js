'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  uniqueArray: true,
  getRandomElements: true,
  startService: true,
  stopService: true,
  end: true,
  storage: true,
  changeInstances: true
};
exports.uniqueArray = uniqueArray;
exports.getRandomElements = getRandomElements;
exports.startService = startService;
exports.stopService = stopService;
exports.end = end;
exports.storage = storage;
exports.changeInstances = changeInstances;
exports["default"] = void 0;

require("regenerator-runtime");

var _lodash = require("lodash");

var _request = require("./request");

Object.keys(_request).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _request[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _request[key];
    }
  });
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function uniqueArray(arrArg) {
  return arrArg.filter(function (elem, pos, arr) {
    return arr.indexOf(elem) === pos;
  });
}

function getRandomElements(arr, count) {
  var arrClone = _toConsumableArray(arr);

  return _toConsumableArray(Array(count)).map(function () {
    return arrClone.splice(Math.floor(Math.random() * arrClone.length), 1)[0];
  });
}

function startService(serviceInfo, instances) {
  return this.startServices(serviceInfo, instances);
}

function stopService(name, instances) {
  var _this = this;

  return new Promise(function (resolve, reject) {
    var requestedInstances = Math.abs(instances);
    var actualInstances = _this.serviceData[name].port.length;
    var instancesToTerminate = requestedInstances > actualInstances ? actualInstances : requestedInstances;

    if (instancesToTerminate === 0) {
      return resolve(void 0);
    }

    var ports = getRandomElements(_this.serviceData[name].port, instancesToTerminate);
    process.env.exitedProcessPorts = uniqueArray([].concat(process.env.exitedProcessPorts, ports));
    (typeof process.env.exitedProcessPorts === 'string' ? process.env.exitedProcessPorts.split(',') : process.env.exitedProcessPorts).map(function (port) {
      return parseInt(port, 10);
    }).filter(function (exitedPort) {
      return typeof exitedPort === 'number';
    });
    var processIndexes = ports.map(function (port) {
      return _this.getProcessIndex(name, port);
    });

    try {
      processIndexes.forEach(function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(index, elIndex) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt("return", new Promise(function (resolve, reject) {
                    _this.log("Service core will send kill command to the service: ".concat(name, "/port:").concat(ports[elIndex]), 'log');

                    _this.serviceData[name].clientSocket[index].request('SERVICE_KILL', void 0, function (res) {
                      _this.log("Service core has recieved acknowledgement of kill command from: ".concat(name, "/port:").concat(ports[elIndex]), 'log');

                      if ((0, _lodash.inRange)(res.status.command.code, 200, 299)) {
                        resolve(true);
                      } else {
                        reject(Error(false));
                      }
                    });
                  }));

                case 1:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
      return resolve(void 0);
    } catch (e) {
      return reject(e);
    }
  });
}

function end(_ref2) {
  var sendSuccess = _ref2.sendSuccess;
  sendSuccess({
    result: {
      error: null,
      details: {},
      isSuccess: true,
      message: 'Shutting down micro service framework.'
    }
  });
  return setTimeout(function () {
    return process.exit();
  }, 1000);
}

function storage(_ref3) {
  var _this2 = this;

  var data = _ref3.data,
      sendError = _ref3.sendError,
      sendSuccess = _ref3.sendSuccess;
  var _data$body = data.body,
      table = _data$body.table,
      method = _data$body.method,
      args = _data$body.args;
  return setImmediate(function () {
    return _this2.databaseOperation(table, method, args, function (isSuccess, result, error) {
      if (isSuccess) {
        return sendSuccess({
          result: {
            isSuccess: isSuccess,
            result: result,
            message: 'The operation completed successfully!'
          }
        });
      }

      return sendError({
        result: {
          isSuccess: isSuccess,
          result: result,
          error: error,
          message: 'The operation failed!'
        },
        code: 401,
        message: 'Command executed but an error occurred while attempting storage operation.'
      });
    });
  });
}

function changeInstances(_x3) {
  return _changeInstances.apply(this, arguments);
}

function _changeInstances() {
  _changeInstances = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref4) {
    var data, sendError, sendSuccess, _data$body2, name, instances, baseResponse, _ref5, previousPorts, result, nextPorts, instanceIds;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            data = _ref4.data, sendError = _ref4.sendError, sendSuccess = _ref4.sendSuccess;
            _data$body2 = data.body, name = _data$body2.name, instances = _data$body2.instances;
            baseResponse = {
              error: null,
              details: {}
            };

            if (Object.keys(this.serviceInfo).includes(name)) {
              _context2.next = 7;
              break;
            }

            sendError({
              result: Object.assign(baseResponse, {
                isSuccess: false,
                message: "Service \"".concat(name, "\" was not found!")
              })
            });
            _context2.next = 25;
            break;

          case 7:
            if (!(typeof instances !== 'number' || instances === 0)) {
              _context2.next = 11;
              break;
            }

            sendError({
              result: Object.assign(baseResponse, {
                isSuccess: false,
                message: '"instance" property must be a number which is not 0!'
              })
            });
            _context2.next = 25;
            break;

          case 11:
            previousPorts = (_ref5 = []).concat.apply(_ref5, _toConsumableArray(this.serviceData[name].port));

            if (!(instances > 0)) {
              _context2.next = 18;
              break;
            }

            _context2.next = 15;
            return startService.call(this, _defineProperty({}, name, this.serviceInfo[name]), instances);

          case 15:
            _context2.t0 = _context2.sent;
            _context2.next = 21;
            break;

          case 18:
            _context2.next = 20;
            return stopService.call(this, name, instances);

          case 20:
            _context2.t0 = _context2.sent;

          case 21:
            result = _context2.t0;
            nextPorts = this.serviceData[name].port;
            instanceIds = this.serviceData[name].instanceId;

            if (typeof result === 'undefined') {
              sendSuccess({
                result: Object.assign(baseResponse, {
                  isSuccess: true,
                  message: 'Services were modified successfully!',
                  details: {
                    instances: nextPorts.length,
                    instanceIds: instanceIds,
                    name: name,
                    previousPorts: previousPorts,
                    nextPorts: nextPorts
                  }
                })
              });
            } else {
              sendError({
                result: Object.assign(baseResponse, {
                  isSuccess: false,
                  message: 'Services modification failed!',
                  details: {
                    instances: nextPorts.length,
                    instanceIds: instanceIds,
                    name: name,
                    previousPorts: previousPorts,
                    nextPorts: nextPorts
                  }
                }),
                code: 402,
                message: 'Command executed but an error occurred while attempting to change instances'
              });
            }

          case 25:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _changeInstances.apply(this, arguments);
}

var _default = {
  end: end,
  storage: storage,
  changeInstances: changeInstances,
  uniqueArray: uniqueArray,
  getRandomElements: getRandomElements
};
exports["default"] = _default;