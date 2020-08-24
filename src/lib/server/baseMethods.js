'use strict';

// Load Templates
import ResponseBodyObject from '../template/response';

// Echo Recieved Data (Debug Purposes)
export function echoData(serviceCoreSocket, requestObj) {
  // Invoke Template(s)
  const responseObject = new ResponseBodyObject();
  // Build Response Object [status - transport]
  responseObject.status.transport.responseSource = process.env.name;
  // Build Response Object [ResBody - command Details]
  responseObject.resultBody.resData = requestObj;
  // Respond To Source
  return serviceCoreSocket.reply(responseObject);
}

// Failed To Find Route
export function redirectFailed(serviceCoreSocket, requestObj) {
  // Invoke Template(s)
  const responseObject = new ResponseBodyObject();
  // Build Response Object [status - transport]
  responseObject.status.transport.responseSource = process.env.name;
  // Build Response Object [status - command]
  responseObject.status.command = {
    code: 202,
    message: 'Command not executed, internal redirection failure'
  };
  // Build Response Object [ResBody - command Details]
  responseObject.resultBody.errData = {
    entity: `Micro service: ${process.env.name}`,
    action: 'Internal micro service redirection failed',
    errorType: 'ERROR',
    originalData: requestObj.body
  };
  // Respond To Source
  return serviceCoreSocket.reply(responseObject);
}

// No Data Recieved From Socket
export function noDataRecieved(serviceCoreSocket, requestObj) {
  // Invoke Template(s)
  const responseObject = new ResponseBodyObject();
  // Build Response Object [status - transport]
  responseObject.status.transport.responseSource = process.env.name;
  // Build Response Object [status - command]
  responseObject.status.command = {
    code: 202,
    message: 'Command not executed, no data recieved by service'
  };
  // Build Response Object [ResBody - command Details]
  responseObject.resultBody.errData = {
    entity: `Micro service: ${process.env.name}`,
    action: 'No data received from connection',
    errorType: 'ERROR',
    originalData: requestObj.body
  };
  return serviceCoreSocket.reply(responseObject);
}
