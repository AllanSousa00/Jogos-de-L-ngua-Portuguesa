"use strict";

const applications = [
  {
    id: "portal",
    sourceDirectory: "apps/portal",
    publicDirectory: "",
    runtimeFiles: [
      "index.html",
      "style.css",
      "favicon.svg",
      "reading-room.svg",
      "fonts/outfit-latin.woff2",
      "fonts/OFL.txt"
    ]
  },
  {
    id: "quiz",
    sourceDirectory: "apps/quiz-portugues",
    publicDirectory: "Quiz-Portugues",
    runtimeFiles: [
      "index.html",
      "style.css",
      "script.js",
      "viewport-fit.js",
      "word-workshop.svg",
      "fonts/baloo2-latin.woff2",
      "fonts/OFL.txt"
    ]
  },
  {
    id: "trilha",
    sourceDirectory: "apps/trilha-das-habilidades",
    publicDirectory: "Trilha-das-Habilidades",
    runtimeFiles: [
      "index.html",
      "style.css",
      "script.js",
      "game-data.js",
      "route-motion.js",
      "caravan-journey.svg",
      "caravan-journey-mobile.svg",
      "valley-map.svg",
      "fonts/baloo2-latin.woff2",
      "fonts/OFL.txt"
    ]
  }
];

module.exports = { applications };
