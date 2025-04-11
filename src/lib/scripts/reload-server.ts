import { config } from "dotenv";
import chokidar from "chokidar";
import { WebSocketServer } from "ws";
import path from "node:path";

config({ path: ".env" });

const wss = new WebSocketServer({ port: process.env.WS_SERVER_PORT || 9000 });

wss.on("connection", (_) => {
  console.log("[Reload] Client connected");
});

const writingsDirectory = path.resolve(process.cwd(), "writings");

const watcher = chokidar.watch(writingsDirectory, {
  ignored: (path, _) => !path.endsWith(".html"),
  awaitWriteFinish: { stabilityThreshold: 3000 },
  persistent: true,
});

watcher.on("change", (path) => {
  console.log(`[Reload] File changed: ${path}`);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send("reload");
    }
  });
});
