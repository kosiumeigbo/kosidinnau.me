"use client";

import { useEffect } from "react";

function DevReloadWatcher() {
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:${process.env.WS_SERVER_PORT || "9000"}`);

    const handleReloadOnMessage = function (event: MessageEvent<string>) {
      if (event.data === "reload") {
        console.log("[ReloadWatcher] Reloading page due to file change...");
        if (window) {
          window.location.reload();
        }
      }
    };

    ws.addEventListener("message", handleReloadOnMessage);

    return () => {
      ws.removeEventListener("message", handleReloadOnMessage);
      ws.close();
    };
  });

  return <></>;
}

export const ReloadWatcher = function () {
  return process.env.NODE_ENV === "development" ? <DevReloadWatcher /> : null;
};
