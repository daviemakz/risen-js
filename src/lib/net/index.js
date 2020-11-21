'use strict';

import SocketListener from './socketListener';
import SocketSpeaker from './socketSpeaker';
import SocketSpeakerReconnect from './socketSpeakerReconnect';

export function createSocketListener(address) {
  return new SocketListener(address);
}

export function createSocketSpeaker(...rest) {
  const addresses = rest.length >= 1 ? [].slice.call(rest, 0) : [];
  return new SocketSpeaker(addresses);
}

export function createSocketSpeakerReconnect(...rest) {
  const addresses = rest.length >= 1 ? [].slice.call(rest, 0) : [];
  return new SocketSpeakerReconnect(addresses);
}

export * from './networkBase';
