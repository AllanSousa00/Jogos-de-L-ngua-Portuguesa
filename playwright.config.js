const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  timeout: 15_000,
  expect: {
    timeout: 5_000
  },
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://127.0.0.1:${process.env.PORT || 4180}`,
    screenshot: "only-on-failure",
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" }
    }
  ]
});
