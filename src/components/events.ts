/**
 * Events exposes an EventEmitter and handles events in the app.
 * Events must be of the shape `EventObject`
 *
 * This could easily be extended to be more generic, like an event bus,
 * exposing functions to create a new event emitter with a "name",
 * and attach listeners to it. Similar to the Cache.
 */
import EventEmitter from 'events';

export type ListenerPayload = {
  type: EventTypes
  event: EventObject
}
export type Listener = (event: ListenerPayload) => void

export type EventObject = Record<string, any>

export enum EventTypes {
  AUTHENTICATED = 'AUTHENTICATED',
  AUTH_LOGOUT = 'AUTH_LOGOUT',
  TOKENS_FETCHED = 'TOKENS_FETCHED',
  TOKENS_REFRESHED = 'TOKENS_REFRESHED',
}

export const emitter = new EventEmitter();

const AuthEvents = {
  emitter: emitter,
  emit: (type: EventTypes, event: EventObject) => emitter.emit(type, { type, event: event}),
  register: (type: EventTypes, cb: Listener) => emitter.addListener(type, cb),
  remove: (type: EventTypes, cb: Listener) =>  emitter.removeListener(type, cb),
};

export default AuthEvents;
