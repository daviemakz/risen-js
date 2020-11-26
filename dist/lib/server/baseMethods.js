'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.echoData = echoData;
exports.redirectFailed = redirectFailed;
exports.noDataRecieved = noDataRecieved;

function echoData(_ref) {
  var data = _ref.data,
      sendSuccess = _ref.sendSuccess;
  return sendSuccess({
    result: data.body
  });
}

function redirectFailed(_ref2) {
  var data = _ref2.data,
      sendError = _ref2.sendError;
  return sendError({
    result: {
      entity: "Micro service: ".concat(process.env.name),
      action: 'Internal micro service redirection failed',
      originalData: data.body
    },
    code: 501,
    message: 'Command not executed, internal redirection failure'
  });
}

function noDataRecieved(_ref3) {
  var data = _ref3.data,
      sendError = _ref3.sendError;
  return sendError({
    result: {
      entity: "Micro service: ".concat(process.env.name),
      action: 'No data received from connection',
      originalData: data.body
    },
    code: 502,
    message: 'Command not executed, no data recieved by service'
  });
}