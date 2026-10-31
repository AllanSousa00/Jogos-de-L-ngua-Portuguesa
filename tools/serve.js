"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { applications } = require("./project-map");

const requestedRoot = process.argv[2] || ".";
const root = path.resolve(process.cwd(), requestedRoot);
const projectRoot = path.resolve(__dirname, "..");
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 4180);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8"
};

function resolveDevelopmentAlias(safePath) {
  if (root !== projectRoot) {
    return safePath;
  }

  const normalizedPath = safePath.replace(/\\/g, "/");
  const rootApplication = applications.find((entry) => entry.publicDirectory === "");

  if (rootApplication && rootApplication.runtimeFiles.includes(normalizedPath)) {
    return path.join(rootApplication.sourceDirectory, normalizedPath);
  }

  const [publicDirectory, ...remainingPath] = normalizedPath.split("/");
  const application = applications.find((entry) => entry.publicDirectory === publicDirectory);

  return application ? path.join(application.sourceDirectory, ...remainingPath) : safePath;
}

function resolveFile(urlPath) {
  let safePath;
  try {
    safePath = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  } catch {
    return null;
  }
  const relativePath = resolveDevelopmentAlias(safePath || "index.html");
  let target = path.resolve(root, relativePath);

  if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
    return null;
  }

  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    target = path.join(target, "index.html");
  }

  return target;
}

const server = http.createServer((request, response) => {
  const target = resolveFile(request.url || "/");

  if (!target || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Arquivo nao encontrado.");
    return;
  }

  const contentType = contentTypes[path.extname(target).toLowerCase()] || "application/octet-stream";
  response.writeHead(200, {
    "X-Project": "portugues-em-jogos",
    "Content-Type": contentType,
    "Cache-Control": "no-cache"
  });
  fs.createReadStream(target).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Servidor disponivel em http://${host}:${port}/ a partir de ${root}`);
});

server.on("error", (error) => {
  if (error.code !== "EADDRINUSE") {
    console.error("Não foi possível iniciar o servidor:", error.message);
    process.exitCode = 1;
    return;
  }
  const request = http.get(`http://${host}:${port}/`, (response) => {
    response.resume();
    if (response.headers["x-project"] === "portugues-em-jogos") {
      console.log(`O jogo já está aberto em http://${host}:${port}/`);
    } else {
      console.error(`A porta ${port} está em uso por outro projeto. Escolha outra porta com PORT.`);
      process.exitCode = 1;
    }
  });
  request.on("error", () => {
    console.error(
      `A porta ${port} está ocupada. Encerre o servidor anterior ou escolha outra porta com PORT.`
    );
    process.exitCode = 1;
  });
  request.setTimeout(1000, () => request.destroy());
});
