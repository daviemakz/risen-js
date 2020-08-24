'use strict';

// Load libs
import Listener from './listener';
import Speaker from './speaker';
import SpeakerReconnector from './speakerReconnector';

// Listens to data on a specific port
export function createListener(address) {
  return new Listener(address);
}

// Connects to a port and emits data to a specific port
export function createSpeaker(...rest) {
  const addresses = rest.length >= 1 ? [].slice.call(rest, 0) : [];
  return new Speaker(addresses);
}

// Connects to a port and emits data to a specific port and will automatically reconnect if connection is lost
export function createSpeakerReconnector(...rest) {
  const addresses = rest.length >= 1 ? [].slice.call(rest, 0) : [];
  return new SpeakerReconnector(addresses);
}
