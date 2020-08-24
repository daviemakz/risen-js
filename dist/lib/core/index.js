'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.uniqueArray = uniqueArray;
exports.getRandomElements = getRandomElements;
exports.startService = startService;
exports.stopService = stopService;
exports.end = end;
exports.storage = storage;
exports.changeInstances = changeInstances;
exports['default'] = void 0;

require('regenerator-runtime');

var _response = _interopRequireDefault(require('../template/response'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      _next(undefined);
    });
  };
}

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) ||
    _iterableToArray(arr) ||
    _unsupportedIterableToArray(arr) ||
    _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError(
    'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === 'Object' && o.constructor) n = o.constructor.name;
  if (n === 'Map' || n === 'Set') return Array.from(o);
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter))
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function uniqueArray(arrArg) {
  return arrArg.filter(function(elem, pos, arr) {
    return arr.indexOf(elem) === pos;
  });
}

function getRandomElements(arr, count) {
  var arrClone = _toConsumableArray(arr);

  return _toConsumableArray(Array(count)).map(function() {
    return arrClone.splice(Math.floor(Math.random() * arrClone.length), 1)[0];
  });
}

function startService(serviceInfo, instances) {
  return this.startServices(serviceInfo, instances);
}

function stopService(name, instances) {
  var _this = this;

  return new Promise(function(resolve, reject) {
    var requestedInstances = Math.abs(instances);
    var actualInstances = _this.serviceData[name].port.length;
    var instancesToTerminate =
      requestedInstances > actualInstances
        ? actualInstances
        : requestedInstances;

    if (instancesToTerminate === 0) {
      return resolve(void 0);
    }

    var ports = getRandomElements(
      _this.serviceData[name].port,
      instancesToTerminate
    );
    process.env.exitedProcessPorts = uniqueArray(
      [].concat(process.env.exitedProcessPorts, ports)
    );
    (typeof process.env.exitedProcessPorts === 'string'
      ? process.env.exitedProcessPorts.split(',')
      : process.env.exitedProcessPorts
    )
      .map(function(port) {
        return parseInt(port, 10);
      })
      .filter(function(exitedPort) {
        return typeof exitedPort === 'number';
      });
    var processIndexes = ports.map(function(port) {
      return _this.getProcessIndex(name, port);
    });

    try {
      processIndexes.forEach(
        (function() {
          var _ref = _asyncToGenerator(
            regeneratorRuntime.mark(function _callee(index, elIndex) {
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      return _context.abrupt(
                        'return',
                        new Promise(function(resolve, reject) {
                          _this.log(
                            'Service core will send kill command to the service: '
                              .concat(name, '/port:')
                              .concat(ports[elIndex]),
                            'log'
                          );

                          _this.serviceData[name].socket[index].request(
                            'SERVICE_KILL',
                            void 0,
                            function(res) {
                              _this.log(
                                'Service core has recieved acknowledgement of kill command from: '
                                  .concat(name, '/port:')
                                  .concat(ports[elIndex]),
                                'log'
                              );

                              if (res.status.command.code === 100) {
                                resolve(true);
                              } else {
                                reject(Error(false));
                              }
                            }
                          );
                        })
                      );

                    case 1:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee);
            })
          );

          return function(_x, _x2) {
            return _ref.apply(this, arguments);
          };
        })()
      );
      return resolve(void 0);
    } catch (e) {
      return reject(e);
    }
  });
}

function end(socket) {
  var resObject = new _response['default']();
  resObject.status.transport.responseSource = process.env.name;
  var baseResponse = {
    error: null,
    details: {}
  };
  resObject.resultBody.resData = Object.assign(baseResponse, {
    status: true,
    message: 'Shutting down micro service framework.',
    details: {}
  });
  socket.reply(resObject);
  return setTimeout(function() {
    return process.exit();
  }, 1000);
}

function storage(socket, data) {
  var _this2 = this;

  var resObject = new _response['default']();
  resObject.status.transport.responseSource = process.env.name;
  return setImmediate(function() {
    return _this2.databaseOperation(
      data.body.table,
      data.body.method,
      data.body.args,
      function(status, result, error) {
        if (status) {
          resObject.resultBody.resData = {
            status: true,
            message: 'The operation completed successfully!',
            result: result
          };
        } else {
          resObject.resultBody.resData = {
            status: false,
            message: 'The operation failed!',
            result: result,
            error: error
          };
          resObject.resultBody.errData = error;
        }

        return socket.reply(resObject);
      }
    );
  });
}

function changeInstances(_x3, _x4) {
  return _changeInstances.apply(this, arguments);
}

function _changeInstances() {
  _changeInstances = _asyncToGenerator(
    regeneratorRuntime.mark(function _callee2(socket, data) {
      var resObject, baseResponse, _ref2, previousPorts, result, nextPorts;

      return regeneratorRuntime.wrap(
        function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                resObject = new _response['default']();
                baseResponse = {
                  error: null,
                  details: {}
                };
                resObject.status.transport.responseSource = process.env.name;

                if (Object.keys(this.serviceInfo).includes(data.body.name)) {
                  _context2.next = 7;
                  break;
                }

                resObject.resultBody.errData = Object.assign(baseResponse, {
                  status: false,
                  message: 'Service "'.concat(
                    data.body.name,
                    '" was not found!'
                  )
                });
                _context2.next = 24;
                break;

              case 7:
                if (
                  !(
                    typeof data.body.instances !== 'number' ||
                    data.body.instances === 0
                  )
                ) {
                  _context2.next = 11;
                  break;
                }

                resObject.resultBody.errData = Object.assign(baseResponse, {
                  status: false,
                  message:
                    '"instance" property must be a number which is not 0!'
                });
                _context2.next = 24;
                break;

              case 11:
                previousPorts = (_ref2 = []).concat.apply(
                  _ref2,
                  _toConsumableArray(this.serviceData[data.body.name].port)
                );

                if (!(data.body.instances > 0)) {
                  _context2.next = 18;
                  break;
                }

                _context2.next = 15;
                return startService.call(
                  this,
                  _defineProperty(
                    {},
                    data.body.name,
                    this.serviceInfo[data.body.name]
                  ),
                  data.body.instances
                );

              case 15:
                _context2.t0 = _context2.sent;
                _context2.next = 21;
                break;

              case 18:
                _context2.next = 20;
                return stopService.call(
                  this,
                  data.body.name,
                  data.body.instances
                );

              case 20:
                _context2.t0 = _context2.sent;

              case 21:
                result = _context2.t0;
                nextPorts = this.serviceData[data.body.name].port;

                if (typeof result === 'undefined') {
                  resObject.resultBody.resData = Object.assign(baseResponse, {
                    status: true,
                    message: 'Services were modified successfully!',
                    details: {
                      name: data.body.name,
                      previousPorts: previousPorts,
                      nextPorts: nextPorts
                    }
                  });
                } else {
                  resObject.resultBody.errData = Object.assign(baseResponse, {
                    status: false,
                    message: 'Services modification failed!',
                    details: {
                      name: data.body.name,
                      previousPorts: previousPorts,
                      nextPorts: nextPorts
                    }
                  });
                }

              case 24:
                return _context2.abrupt('return', socket.reply(resObject));

              case 25:
              case 'end':
                return _context2.stop();
            }
          }
        },
        _callee2,
        this
      );
    })
  );
  return _changeInstances.apply(this, arguments);
}

var _default = {
  end: end,
  storage: storage,
  changeInstances: changeInstances,
  uniqueArray: uniqueArray,
  getRandomElements: getRandomElements
};
exports['default'] = _default;
