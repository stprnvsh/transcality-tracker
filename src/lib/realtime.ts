"use client";

import Pusher from "pusher-js";

let client: Pusher | null = null;

export function getRealtimeClient() {
  if (typeof window === "undefined") return null;

  if (!client) {
    client = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY ?? "", {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "us3",
      authEndpoint: "/api/realtime/auth"
    });
  }

  return client;
}
