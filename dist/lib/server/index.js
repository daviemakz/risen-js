'use strict';

require('core-js');

require('regenerator-runtime');

var _isPortFree = _interopRequireDefault(require('is-port-free'));

var _isRunning = _interopRequireDefault(require('is-running'));

var _net = require('../net');

var _common = _interopRequireDefault(require('../common'));

var _response = _interopRequireDefault(require('../template/response'));

var _baseMethods = require('./baseMethods');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _typeof(obj) {
  '@babel/helpers - typeof';
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };
  }
  return _typeof(obj);
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

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError(
    'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
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

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === 'undefined' || !(Symbol.iterator in Object(arr)))
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function');
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === 'function') return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

var standardFunctions = [
  {
    name: 'echoData',
    func: _baseMethods.echoData
  },
  {
    name: 'noDataRecieved',
    func: _baseMethods.noDataRecieved
  },
  {
    name: 'redirectFailed',
    func: _baseMethods.redirectFailed
  }
];

var processManagement = function processManagement() {
  if (!(0, _isRunning['default'])(process.env.parentPid)) {
    setTimeout(function() {
      return process.exit();
    }, 1000);
  }
};

var MicroServer = (function(_ServiceCommon) {
  _inherits(MicroServer, _ServiceCommon);

  var _super = _createSuper(MicroServer);

  function MicroServer() {
    var _this;

    _classCallCheck(this, MicroServer);

    _this = _super.call(this);
    _this.conId = 0;
    _this['interface'] = void 0;
    _this.connectionIndex = {};
    _this.operations = {};
    _this.settings = JSON.parse(process.env.settings);
    _this.options = JSON.parse(process.env.options);
    _this.serviceInfo = JSON.parse(process.env.serviceInfo);
    process.env.verbose = _this.settings.verbose;
    [
      'processRequest',
      'assignProcessListers',
      'assignOperations',
      'bindService',
      'initServer'
    ].forEach(function(func) {
      _this[func] = _this[func].bind(_assertThisInitialized(_this));
    });
    setInterval(processManagement, 1000);

    _asyncToGenerator(
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(
          function _callee$(_context) {
            while (1) {
              switch ((_context.prev = _context.next)) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return _this.assignOperations();

                case 3:
                  _context.next = 5;
                  return _this.assignProcessListers();

                case 5:
                  _context.next = 7;
                  return _this.initServer();

                case 7:
                  _context.next = 9;
                  return _this.bindService();

                case 9:
                  _context.next = 11;
                  return _this.executeInitialFunctions('operations');

                case 11:
                  return _context.abrupt('return', void 0);

                case 14:
                  _context.prev = 14;
                  _context.t0 = _context['catch'](0);
                  throw new Error(_context.t0);

                case 17:
                case 'end':
                  return _context.stop();
              }
            }
          },
          _callee,
          null,
          [[0, 14]]
        );
      })
    )();

    return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
  }

  _createClass(MicroServer, [
    {
      key: 'assignOperations',
      value: function assignOperations() {
        var _this2 = this;

        return new Promise(function(resolve) {
          var operationScope = {
            sendRequest: _this2.sendRequest,
            destroyConnection: _this2.destroyConnection,
            operations: _this2.operations,
            localStorage: {}
          };
          Object.entries(require(process.env.operations)).forEach(function(
            _ref2
          ) {
            var _ref3 = _slicedToArray(_ref2, 2),
              name = _ref3[0],
              op = _ref3[1];

            _this2.operations[name] = op.bind(operationScope);
          });
          standardFunctions.forEach(function(_ref4) {
            var name = _ref4.name,
              func = _ref4.func;
            _this2.operations[name] = func.bind(operationScope);
          });
          return resolve();
        });
      }
    },
    {
      key: 'assignProcessListers',
      value: function assignProcessListers() {
        var _this3 = this;

        return new Promise(function(resolve) {
          process.on('exit', function(code) {
            var responseObject = new _response['default']();
            responseObject.status.transport = {
              code: 2006,
              message: 'Micro service process exited unexpectedly. CODE: '.concat(
                code
              )
            };
            responseObject.status.command = {
              code: 200,
              message: 'Command not executed, transport failure'
            };
            responseObject.resultBody.errData = {
              entity: 'Unknown error',
              action: 'Micro service process exited unexpectedly. CODE: '.concat(
                code
              ),
              errorType: 'ERROR',
              originalData: null
            };
            Object.values(_this3.connectionIndex).forEach(function(socket) {
              socket.reply(responseObject);
              socket.conn.destroy();
            });
          });
          return resolve();
        });
      }
    },
    {
      key: 'initServer',
      value: function initServer() {
        var _this4 = this;

        return new Promise(function(resolve, reject) {
          return (0, _isPortFree['default'])(parseInt(process.env.port, 10))
            .then(function() {
              _this4.log(
                'Starting service on port: '.concat(
                  parseInt(process.env.port, 10)
                ),
                'log'
              );

              _this4['interface'] = (0, _net.createListener)(
                parseInt(process.env.port, 10)
              );

              if (!_this4['interface']) {
                _this4.log('Unable to start Micro service!', 'log');

                return reject(Error('Unable to start Micro service!'));
              }

              _this4.log('Service started successfully!', 'log');

              return resolve(true);
            })
            ['catch'](function(e) {
              _this4.log(e, 'error');

              _this4.log(
                'Service port "'
                  .concat(
                    parseInt(process.env.port, 10),
                    '" not free or unknown error has occurred. MORE INFO: '
                  )
                  .concat(JSON.stringify(e, null, 2)),
                'error'
              );

              return reject(
                Error(
                  'Service port "'
                    .concat(
                      parseInt(process.env.port, 10),
                      '" not free or unknown error has occurred. MORE INFO: '
                    )
                    .concat(JSON.stringify(e, null, 2))
                )
              );
            });
        });
      }
    },
    {
      key: 'bindService',
      value: function bindService() {
        var _this5 = this;

        return new Promise(function(resolve) {
          _this5['interface'].on('SERVICE_REQUEST', function(socket, data) {
            _this5.log(
              '['.concat(
                _this5.conId,
                '] Micro service connection request received'
              )
            );

            _this5.connectionIndex = _defineProperty({}, _this5.conId, socket);

            if (data) {
              _this5.processRequest(socket, data);
            } else {
              _this5.noDataRecieved(socket, data);
            }

            _this5.log(
              '['.concat(
                _this5.conId,
                '] Micro service connection request processed!'
              )
            );

            _this5.conId += 1;
            return void 0;
          });

          _this5['interface'].on('SERVICE_KILL', function(socket) {
            var responseObject = new _response['default']();

            _this5.log(
              '['.concat(
                _this5.conId,
                '] Micro service connection request received'
              )
            );

            _this5.connectionIndex = _defineProperty({}, _this5.conId, socket);

            _this5.log(
              '['.concat(
                _this5.conId,
                '] Micro service connection request processed, kill command recieved!'
              )
            );

            _this5.conId += 1;
            responseObject.status.transport = {
              code: 1000,
              message: 'Micro service process has exited!'
            };
            responseObject.status.command = {
              code: 100,
              message: 'Command completed successfully'
            };
            responseObject.resultBody.errData = {};
            socket.reply(responseObject);
            return process.exit();
          });

          return resolve();
        });
      }
    },
    {
      key: 'processRequest',
      value: function processRequest(socket, requestObj) {
        var commandData = requestObj.data;
        var funcName = commandData.funcName;
        return Object.prototype.hasOwnProperty.call(this.operations, funcName)
          ? this.operations[funcName](socket, commandData)
          : this.redirectFailed(socket, requestObj);
      }
    }
  ]);

  return MicroServer;
})(_common['default']);

new MicroServer();
