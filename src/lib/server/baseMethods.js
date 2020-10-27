'use strict';

// Echo Recieved Data (Debug Purposes)
export function echoData({ data, sendSuccess }) {
  // Respond To Source
  return sendSuccess({ result: data.body });
}

// Failed To Find Route
export function redirectFailed({ data, sendError }) {
  // Respond To Source
  return sendError({
    result: {
      entity: `Micro service: ${process.env.name}`,
      action: 'Internal micro service redirection failed',
      originalData: data.body
    },
    code: 501,
    message: 'Command not executed, internal redirection failure'
  });
}

// No Data Recieved From Socket
export function noDataRecieved({ data, sendError }) {
  // Respond To Source
  return sendError({
    result: {
      entity: `Micro service: ${process.env.name}`,
      action: 'No data received from connection',
      originalData: data.body
    },
    code: 502,
    message: 'Command not executed, no data recieved by service'
  });
}
