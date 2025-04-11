"use client";

import { useEffect } from "react";
import { WebSocket } from "ws";

export function ReloadWatcher() {
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:9999${process.env.WS_SERVER_PORT || 9000}`);

    /* ws.onmessage = (event) => {
      if (event.data === "reload") {
        console.log("[ReloadWatcher] Reloading page due to file change...");
        window.location.reload();
      }
    }; */

    ws.on("message", (data) => {
      const msg = data.toString();
      if (msg === "reload") {
        console.log("[ReloadWatcher] Reloading page due to file change...");
        if (window) {
          window.location.reload();
        }
      }
    });

    return () => {
      ws.close();
    };
  }, []);

  return null;
}
