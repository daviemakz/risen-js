'use strict';

import net from 'net';
import autoBind from 'auto-bind';

import NetworkBase from './networkBase';

class SocketListener extends NetworkBase {
  constructor(address) {
    super(address);
    autoBind(this);
    this.remoteMethods = {};
    this.host = this.getHostByAddress(address);
    this.port = this.getPortByAddress(address);
    this.startServer();
    this.errorFn = () => {
      return this.startServer();
    };
  }

  startServer() {
    const tcpServer = net.createServer((connection) =>
      connection.on('data', (data) => {
        let message;
        let messageText;
        const ref = this.tokenizeData(data);
        const results = [];
        for (let i = 0, len = ref.length; i < len; i += 1) {
          messageText = ref[i];
          message = JSON.parse(messageText);
          message.conn = connection;
          message = this.prepare(message);
          results.push(this.dispatch(message));
        }
        return results;
      })
    );
    tcpServer.listen(this.port, this.host);
    tcpServer.setMaxListeners(Infinity);
    return tcpServer.on('error', (exception) => this.errorFn(exception));
  }

  onError(errorFn) {
    this.errorFn = errorFn;
  }

  prepare(message) {
    const { subject } = message;
    let i = 0;
    Object.assign(message, {
      reply: (json) => {
        return message.conn.write(
          this.prepareJsonToSend({
            id: message.id,
            data: json
          })
        );
      }
    });
    Object.assign(message, {
      next: () => {
        const ref = this.remoteMethods[subject];
        if (ref !== null) {
          const nextVal = ref[i](message, message.data);
          i += 1;
          return nextVal;
        }
        return void 0;
      }
    });
    return message;
  }

  dispatch(message) {
    return message.next();
  }

  on(...args) {
    const subject = args[0];
    const methods = args.length >= 2 ? [].slice.call(args, 1) : [];
    this.remoteMethods[subject] = methods;
    return methods;
  }
}

export default SocketListener;
