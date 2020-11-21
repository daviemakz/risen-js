'use strict';

import net from 'net';

import { getAddressFormatted } from './networkBase';

import SocketSpeaker from './socketSpeaker';

const processExitedPorts = (ports) => {
  return typeof ports === 'string' ? ports.split(',') : ports;
};

class SocketSpeakerReconnect extends SocketSpeaker {
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
    socket.on('error', () => {});
    socket.on('close', () => {
      const isInExitedProcessPorts = processExitedPorts(
        process.env.exitedProcessPorts
      )
        .map((port) => parseInt(port, 10))
        .includes(port);
      if (!isInExitedProcessPorts) {
        if (process.env.verbose === 'true') {
          /* eslint-disable-next-line */
          console.log(
            `Attempting to connect to address: ${getAddressFormatted(
              host,
              port
            )}`
          );
        }
        let index = 0;
        let sock;
        const ref = this.sockets;
        for (let i = 0, len = ref.length; i < len; i += 1) {
          sock = ref[i];
          if (sock.uniqueSocketId === socket.uniqueSocketId) {
            break;
          }
          index += 1;
        }
        this.sockets.splice(index, 1);
        socket.destroy();
        setTimeout(() => this.connect(address), 100);
      }
    });
  }
}

// EXPORTS
export default SocketSpeakerReconnect;
