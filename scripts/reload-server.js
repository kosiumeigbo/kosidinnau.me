const { config } = require("dotenv");
const { watch } = require("chokidar");
const { WebSocketServer } = require("ws");
const { resolve } = require("node:path");
const { createServer } = require("node:http");

config({ path: ".env" });

const WS_SERVER_PORT = "9000";
const HTTP_SERVER_PORT = "8080";

const writingsDirectory = resolve(process.cwd(), "writings");
console.log(writingsDirectory);
const watcher = watch(writingsDirectory, {});

const wss = new WebSocketServer({ port: parseInt(process.env.WS_SERVER_PORT || WS_SERVER_PORT, 10) });
wss.on("connection", (ws) => {
  console.log("[Reload] Client connected");
  ["change", "add", "unlink"].forEach((event) => {
    watcher.on(event, (path) => {
      console.log(`[Reload] File changed: ${path}`);
      if (ws.readyState === 1) {
        ws.send("reload");
      }
    });
  });
});

/* HTTP Server Running */
const httpPort = parseInt(process.env.HTTP_SERVER_PORT || HTTP_SERVER_PORT, 10);
createServer().listen(httpPort, () => {
  console.log(`HTTP Server running on port ${httpPort.toString()}...`);
});
