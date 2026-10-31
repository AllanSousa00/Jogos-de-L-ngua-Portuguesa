"use strict";

const http = require("node:http");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const serverUrl = `http://127.0.0.1:${process.env.PORT || 4180}/Quiz-Portugues/`;
let ownedServer = null;

function isServerReady() {
  return new Promise((resolve) => {
    const request = http.get(serverUrl, (response) => {
      response.resume();
      resolve(response.statusCode === 200 && response.headers["x-project"] === "portugues-em-jogos");
    });

    request.on("error", () => resolve(false));
    request.setTimeout(500, () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await isServerReady()) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Servidor local nao respondeu em ${serverUrl}.`);
}

function stopOwnedServer() {
  if (ownedServer && ownedServer.exitCode === null) {
    ownedServer.kill();
  }
}

async function run() {
  if (!(await isServerReady())) {
    ownedServer = spawn(process.execPath, [path.join(root, "tools", "serve.js")], {
      cwd: root,
      stdio: "ignore"
    });
    await waitForServer();
  }

  const cliPath = require.resolve("@playwright/test/cli");
  const runner = spawn(process.execPath, [cliPath, "test", ...process.argv.slice(2)], {
    cwd: root,
    env: process.env,
    stdio: "inherit"
  });

  const exitCode = await new Promise((resolve) => {
    runner.on("exit", (code) => resolve(code ?? 1));
    runner.on("error", () => resolve(1));
  });

  stopOwnedServer();
  process.exitCode = exitCode;
}

process.on("exit", stopOwnedServer);
process.on("SIGINT", () => {
  stopOwnedServer();
  process.exit(130);
});
process.on("SIGTERM", () => {
  stopOwnedServer();
  process.exit(143);
});

run().catch((error) => {
  console.error(error.message);
  stopOwnedServer();
  process.exitCode = 1;
});
