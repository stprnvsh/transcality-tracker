import { EventEmitter } from "events";

export type RealtimeEvent = {
  type: string;
  payload?: unknown;
};

const emitter = new EventEmitter();
emitter.setMaxListeners(0);

export function publishRealtimeEvent(event: RealtimeEvent) {
  emitter.emit("message", event);
}

export function subscribeRealtimeEvents(handler: (event: RealtimeEvent) => void) {
  emitter.on("message", handler);
  return () => {
    emitter.off("message", handler);
  };
}
