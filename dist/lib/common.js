'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = require("./util");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var logTypes = ['log', 'error', 'warn'];

var ServiceCommon = function () {
  function ServiceCommon() {
    var _this = this;

    _classCallCheck(this, ServiceCommon);

    ['log', 'destroyConnection', 'executeInitialFunctions'].forEach(function (func) {
      _this[func] = _this[func].bind(_this);
    });
    this.buildResponseFunctions = _util.buildResponseFunctions.bind(this);
    return this;
  }

  _createClass(ServiceCommon, [{
    key: "log",
    value: function log(message, type) {
      var override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (typeof this.writeToLogFile === 'function') {
        this.writeToLogFile(message);
      }

      if ((this.settings.verbose || override) && logTypes.includes(type)) {
        console[type](message);
      }
    }
  }, {
    key: "executeInitialFunctions",
    value: function executeInitialFunctions(opsProp) {
      var _this2 = this;

      var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'options';
      var isService = process.env.service === 'true';
      var operationScope = {
        request: this.request,
        requestChain: this.requestChain,
        sendRequest: this.sendRequest,
        destroyConnection: this.destroyConnection,
        operations: this[opsProp]
      };
      var helperMethods = this.buildResponseFunctions(void 0, {}, operationScope);
      return new Promise(function (resolve, reject) {
        try {
          _this2[container].runOnStart.filter(function (func) {
            if (typeof _this2[opsProp][func] === 'function') {
              return true;
            }

            _this2.log("This not a valid function: ".concat(func || 'undefined or empty string', ". Check that its been added to the ").concat(isService ? 'object of functions in your operations path' : 'coreOperations object when you initialised Risen.JS'), 'warn');

            return false;
          }).forEach(function (func) {
            if (Object.prototype.hasOwnProperty.call(_this2[opsProp], func)) {
              _this2.log("Executing the run on start function: ".concat(func), 'log');

              _this2[opsProp][func](helperMethods);
            } else {
              reject(Error("The function ".concat(func, " has not been defined in this service!")));
            }
          });

          return resolve();
        } catch (e) {
          _this2.log(e, 'error');

          return reject(Error(e));
        }
      });
    }
  }, {
    key: "destroyConnection",
    value: function destroyConnection(socket, id) {
      if (Object.prototype.hasOwnProperty.call(socket, 'conn')) {
        socket.conn.destroy();
        return this.log("[".concat(id, "] Connection successfully closed"), 'log');
      }

      return this.log("[".concat(id, "] Connection object untouched. invalid object..."), 'log');
    }
  }]);

  return ServiceCommon;
}();

var _default = ServiceCommon;
exports["default"] = _default;