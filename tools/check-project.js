"use strict";

const { spawnSync } = require("node:child_process");
const path = require("node:path");
const { applications } = require("./project-map");

const root = path.resolve(__dirname, "..");
const quiz = applications.find(({ id }) => id === "quiz");
const trilha = applications.find(({ id }) => id === "trilha");

const checks = [
  ["Conferindo JavaScript da trilha", ["--check", path.join(root, trilha.sourceDirectory, "script.js")]],
  ["Conferindo dados da trilha", ["--check", path.join(root, trilha.sourceDirectory, "game-data.js")]],
  [
    "Conferindo movimento da caravana",
    ["--check", path.join(root, trilha.sourceDirectory, "route-motion.js")]
  ],
  ["Conferindo JavaScript do quiz", ["--check", path.join(root, quiz.sourceDirectory, "script.js")]],
  [
    "Conferindo ajuste de viewport do quiz",
    ["--check", path.join(root, quiz.sourceDirectory, "viewport-fit.js")]
  ],
  ["Conferindo mapa de aplicativos", ["--check", path.join(root, "tools", "project-map.js")]],
  ["Conferindo servidor local", ["--check", path.join(root, "tools", "serve.js")]],
  ["Conferindo runner E2E", ["--check", path.join(root, "tools", "run-e2e.js")]],
  ["Conferindo build estatico", ["--check", path.join(root, "tools", "build-static.js")]],
  ["Validando contrato publico", [path.join(root, "tools", "validate-contract.js")]]
];

for (const [title, args] of checks) {
  console.log(`\n${title}`);
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    stdio: "inherit"
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

console.log("\nChecklist automatico concluido com sucesso.");
