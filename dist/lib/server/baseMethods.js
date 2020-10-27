'use strict';
Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.echoData = echoData),
  (exports.redirectFailed = redirectFailed),
  (exports.noDataRecieved = noDataRecieved);
function echoData(a) {
  var b = a.data,
    c = a.sendSuccess;
  return c({ result: b.body });
}
function redirectFailed(a) {
  var b = a.data,
    c = a.sendError;
  return c({
    result: {
      entity: 'Micro service: '.concat(process.env.name),
      action: 'Internal micro service redirection failed',
      originalData: b.body
    },
    code: 501,
    message: 'Command not executed, internal redirection failure'
  });
}
function noDataRecieved(a) {
  var b = a.data,
    c = a.sendError;
  return c({
    result: {
      entity: 'Micro service: '.concat(process.env.name),
      action: 'No data received from connection',
      originalData: b.body
    },
    code: 502,
    message: 'Command not executed, no data recieved by service'
  });
}
