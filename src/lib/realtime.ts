"use client";

import type { RealtimeEvent } from "./realtime-server";

type Listener = (event: RealtimeEvent) => void;

let source: EventSource | null = null;
const listeners = new Set<Listener>();

function startSource() {
  if (source || typeof window === "undefined") return;

  source = new EventSource("/api/realtime/events");

  source.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as RealtimeEvent;
      listeners.forEach((listener) => listener(data));
    } catch (error) {
      console.error("Failed to parse realtime payload", error);
    }
  };

  source.onerror = () => {
    source?.close();
    source = null;
    if (listeners.size > 0) {
      setTimeout(startSource, 2000);
    }
  };
}

export function subscribeToRealtime(listener: Listener) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  listeners.add(listener);
  startSource();

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && source) {
      source.close();
      source = null;
    }
  };
}
