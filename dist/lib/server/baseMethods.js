'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.echoData = echoData;
exports.redirectFailed = redirectFailed;
exports.noDataRecieved = noDataRecieved;

var _response = _interopRequireDefault(require('../template/response'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function echoData(serviceCoreSocket, requestObj) {
  var responseObject = new _response['default']();
  responseObject.status.transport.responseSource = process.env.name;
  responseObject.resultBody.resData = requestObj;
  return serviceCoreSocket.reply(responseObject);
}

function redirectFailed(serviceCoreSocket, requestObj) {
  var responseObject = new _response['default']();
  responseObject.status.transport.responseSource = process.env.name;
  responseObject.status.command = {
    code: 202,
    message: 'Command not executed, internal redirection failure'
  };
  responseObject.resultBody.errData = {
    entity: 'Micro service: '.concat(process.env.name),
    action: 'Internal micro service redirection failed',
    errorType: 'ERROR',
    originalData: requestObj.body
  };
  return serviceCoreSocket.reply(responseObject);
}

function noDataRecieved(serviceCoreSocket, requestObj) {
  var responseObject = new _response['default']();
  responseObject.status.transport.responseSource = process.env.name;
  responseObject.status.command = {
    code: 202,
    message: 'Command not executed, no data recieved by service'
  };
  responseObject.resultBody.errData = {
    entity: 'Micro service: '.concat(process.env.name),
    action: 'No data received from connection',
    errorType: 'ERROR',
    originalData: requestObj.body
  };
  return serviceCoreSocket.reply(responseObject);
}
