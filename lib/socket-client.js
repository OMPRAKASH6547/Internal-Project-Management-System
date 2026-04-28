"use client";

import { io } from "socket.io-client";

let socketClient = null;

export function getSocketClient() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!socketClient) {
    socketClient = io(process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
  }

  return socketClient;
}
