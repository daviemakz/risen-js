'use strict';

import net from 'net';

import NetworkBase, { getAddressFormatted } from './networkBase';

import { ERR_REQ_REFUSED, MAX_WAITERS } from './constants';

export function onData(data) {
  const ref = this.tokenizeData(data);
  const results = [];
  for (let i = 0, len = ref.length; i < len; i += 1) {
    const messageText = ref[i];
    const message = JSON.parse(messageText);
    if (this.waiters[message.id]) {
      this.waiters[message.id](message.data);
      results.push(delete this.waiters[message.id]);
    }
  }
  return results;
}

class SocketSpeaker extends NetworkBase {
  constructor(addresses) {
    super(addresses);
    let address;
    this.uniqueId = 1;
    this.sockets = [];
    this.waiters = {};
    this.socketIterator = 0;
    this.onData = onData.bind(this);
    for (let i = 0, len = addresses.length; i < len; i += 1) {
      address = addresses[i];
      this.connect(address);
    }
  }

  connect(address) {
    const host = this.getHostByAddress(address);
    const port = this.getPortByAddress(address);
    const socket = new net.Socket();

    socket.uniqueSocketId = this.generateUniqueId();
    socket.setEncoding('utf8');
    socket.setNoDelay(true);
    socket.setMaxListeners(Infinity);

    socket.connect(port, host, () => {
      if (process.env.verbose === 'true') {
        /* eslint-disable-next-line */
        console.log(
          `Successfully connected to address: ${getAddressFormatted(
            host,
            port
          )}`
        );
      }
      return this.sockets.push(socket);
    });

    socket.on('data', this.onData);
  }

  request(subject, data, callback) {
    return this.send(subject, data, callback);
  }

  send(subject, data, callback) {
    let messageId;
    if (this.sockets.length === 0) {
      if (callback) {
        callback({
          error: ERR_REQ_REFUSED
        });
      }
      return;
    }
    if (!this.sockets[this.socketIterator]) {
      this.socketIterator = 0;
    }
    if (callback) {
      messageId = this.generateUniqueId();
      this.waiters[messageId] = callback;
    }
    const payload = this.prepareJsonToSend({
      id: messageId,
      subject,
      data
    });
    this.sockets[this.socketIterator].write(payload);
    this.socketIterator += 1;
  }

  shout(subject, data) {
    let socket;
    const ref = this.sockets;
    const results = [];
    const payload = {
      subject,
      data
    };
    for (let i = 0, len = ref.length; i < len; i += 1) {
      socket = ref[i];
      results.push(socket.write(this.prepareJsonToSend(payload)));
    }
    return results;
  }

  generateUniqueId() {
    const id = `id-${this.uniqueId}`;
    if (!this.waiters[id]) {
      return id;
    }
    if (this.uniqueId === MAX_WAITERS) {
      this.uniqueId = 1;
    }
    this.uniqueId += 1;
    const newId = `id-${this.uniqueId}`;
    if (this.waiters[newId]) {
      delete this.waiters[newId];
    }
    return this.generateUniqueId();
  }
}

// EXPORTS
export default SocketSpeaker;
