/**
 * Events exposes an EventEmitter and handles events in the app.
 * Events must be of the shape `EventObject`
 *
 * This could easily be extended to be more generic, like an event bus,
 * exposing functions to create a new event emitter with a "name",
 * and attach listeners to it.
 */

import EventEmitter from 'events';

export enum EventTypes {
  AUTH_LOGOUT = 'AUTH_LOGOUT',
  AUTH_REFRESHED = 'AUTH_REFRESHED',
}

export interface EventObject {
  name: string
  payload: any
}

type Listener = (event: EventObject) => void;

export const emitter = new EventEmitter();

const AuthEvents = {
  emitter: emitter,
  emit: (type: EventTypes, event: EventObject) => emitter.emit(type, event),
  register: (type: EventTypes, cb: Listener) => {
    emitter.addListener(type, cb);
  },
  remove: (type: EventTypes, cb: Listener) => {
    emitter.removeListener(type, cb);
  },
};

export default AuthEvents;
