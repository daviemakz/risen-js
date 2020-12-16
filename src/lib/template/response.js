'use strict';

import { inRange } from 'lodash';

const isSuccess = (self) =>
  inRange(self?.status?.transport?.code ?? self?.transport?.code, 2000, 2999) &&
  inRange(self?.status?.command?.code ?? self?.command?.code, 200, 299);

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
    setResponseSource(
      { name, pid, instanceId, address } = {
        name: process.env.name,
        pid: process.pid,
        instanceId: process.env.instanceId,
        address: process.env.address
      }
    ) {
      this.status.transport.responseSource = {
        name,
        pid,
        address,
        instanceId
      };
    },
    setCommandStatus({ code, message }) {
      Object.assign(this.status.command, {
        code: code || this.status.command.code,
        message: message || this.status.command.message
      });
    },
    setTransportStatus({ code, message }) {
      Object.assign(this.status.transport, {
        code: code || this.status.transport.code,
        message: message || this.status.transport.message
      });
    },
    setResData(data) {
      this.resultBody.resData = data;
    },
    setErrData(data) {
      this.resultBody.errData = data;
    },
    success({ data, code = 200, message = 'Command completed successfully' }) {
      // Set the source of the request
      this.setResponseSource();
      // Set's the command status
      this.setCommandStatus({ code, message });
      // Set's the res data of the response object
      this.setResData(data);
    },
    error({
      data,
      code = 400,
      message = 'Command executed but an error occurred while processing the request'
    }) {
      // Set the source of the request
      this.setResponseSource();
      // Set's the command status
      this.setCommandStatus({ code, message });
      // Set's the err data of the response object
      this.setErrData(data);
    },
    getResponse() {
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

export default getResponseBody;
