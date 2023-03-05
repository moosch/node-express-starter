/**
 * Events exposes an EventEmitter and handles events in the app.
 * Events must be of the shape `EventObject`
 * 
 * This could easily be extended to be more generic, like an event bus,
 * exposing functions to create a new event emitter with a "name",
 * and attach listeners to it.
 */

import EventEmitter from 'events';
import Logger from '@/components/logger';

const logger = new Logger('events');

export enum EventTypes {
  AUTH_LOGOUT = 'AUTH_LOGOUT',
  AUTH_REFRESHED = 'AUTH_REFRESHED',
}

type EventEmitters = {
  [key: string]: EventEmitter;
};

interface EventObject {
  name: string
  payload: any
}
type Listener = (event: EventObject) => void;

export const emitters: EventEmitters = {};

export function setupListener() {
  emitters['auth'] = new EventEmitter();
}

export function register(emitter: string, type: EventTypes, cb: Listener) {
  if (!emitters[emitter]) {
    logger.warn(`Cannot find emitter "${emitter}". Failed to register listener.`);
    return;
  }

  emitters[emitter].addListener(type, cb);
}

export function emit(emitter: string, type: EventTypes, event: EventObject) {
  if (!emitters[emitter]) {
    logger.warn(`Cannot find emitter "${emitter}". Failed to trigger event.`);
    return;
  }
  emitters[emitter].emit(type, event);
}

export function remove(emitter: string, type: EventTypes, cb: Listener) {
  if (!emitters[emitter]) {
    logger.warn(`Cannot find emitter "${emitter}". Failed to remove listener.`);
    return;
  }
  emitters[emitter].removeListener(type, cb);
}

export default {
  register,
  emit,
  remove,
};
