const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: [
      "**/dist/**",
      "node_modules/**",
      "output/**",
      "apps/quiz-portugues/script.js",
      "apps/quiz-portugues/viewport-fit.js",
      "apps/trilha-das-habilidades/script.js",
      "apps/trilha-das-habilidades/game-data.js"
    ]
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ["apps/trilha-das-habilidades/route-motion.js"],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser }
    }
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser
      }
    }
  }
];
