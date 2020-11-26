'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = require("lodash");

var isSuccess = function isSuccess(self) {
  var _self$status$transpor, _self$status, _self$status$transpor2, _self$transport, _self$status$command$, _self$status2, _self$status2$command, _self$command;

  return (0, _lodash.inRange)((_self$status$transpor = self === null || self === void 0 ? void 0 : (_self$status = self.status) === null || _self$status === void 0 ? void 0 : (_self$status$transpor2 = _self$status.transport) === null || _self$status$transpor2 === void 0 ? void 0 : _self$status$transpor2.code) !== null && _self$status$transpor !== void 0 ? _self$status$transpor : self === null || self === void 0 ? void 0 : (_self$transport = self.transport) === null || _self$transport === void 0 ? void 0 : _self$transport.code, 2000, 2999) && (0, _lodash.inRange)((_self$status$command$ = self === null || self === void 0 ? void 0 : (_self$status2 = self.status) === null || _self$status2 === void 0 ? void 0 : (_self$status2$command = _self$status2.command) === null || _self$status2$command === void 0 ? void 0 : _self$status2$command.code) !== null && _self$status$command$ !== void 0 ? _self$status$command$ : self === null || self === void 0 ? void 0 : (_self$command = self.command) === null || _self$command === void 0 ? void 0 : _self$command.code, 200, 299);
};

function getResponseBody() {
  return {
    status: {
      transport: {
        code: 2000,
        message: 'Transport completed successfully',
        responseSource: void 0
      },
      command: {
        code: 200,
        message: 'Command completed successfully'
      }
    },
    resultBody: {
      resData: null,
      errData: null
    },
    setResponseSource: function setResponseSource() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        name: process.env.name,
        pid: process.pid,
        instanceId: process.env.instanceId,
        address: process.env.address
      },
          name = _ref.name,
          pid = _ref.pid,
          instanceId = _ref.instanceId,
          address = _ref.address;

      this.status.transport.responseSource = {
        name: name,
        pid: pid,
        address: address,
        instanceId: instanceId
      };
    },
    setCommandStatus: function setCommandStatus(_ref2) {
      var code = _ref2.code,
          message = _ref2.message;
      Object.assign(this.status.command, {
        code: code || this.status.command.code,
        message: message || this.status.command.message
      });
    },
    setTransportStatus: function setTransportStatus(_ref3) {
      var code = _ref3.code,
          message = _ref3.message;
      Object.assign(this.status.transport, {
        code: code || this.status.transport.code,
        message: message || this.status.transport.message
      });
    },
    setResData: function setResData(data) {
      this.resultBody.resData = data;
    },
    setErrData: function setErrData(data) {
      this.resultBody.errData = data;
    },
    success: function success(_ref4) {
      var data = _ref4.data,
          _ref4$code = _ref4.code,
          code = _ref4$code === void 0 ? 200 : _ref4$code,
          _ref4$message = _ref4.message,
          message = _ref4$message === void 0 ? 'Command completed successfully' : _ref4$message;
      this.setResponseSource();
      this.setCommandStatus({
        code: code,
        message: message
      });
      this.setResData(data);
    },
    error: function error(_ref5) {
      var data = _ref5.data,
          _ref5$code = _ref5.code,
          code = _ref5$code === void 0 ? 400 : _ref5$code,
          _ref5$message = _ref5.message,
          message = _ref5$message === void 0 ? 'Command executed but an error occurred while processing the request' : _ref5$message;
      this.setResponseSource();
      this.setCommandStatus({
        code: code,
        message: message
      });
      this.setErrData(data);
    },
    getResponse: function getResponse() {
      return {
        status: isSuccess(this),
        transport: this.status.transport,
        command: this.status.command,
        response: this.resultBody.resData,
        error: this.resultBody.errData
      };
    }
  };
}

var _default = getResponseBody;
exports["default"] = _default;