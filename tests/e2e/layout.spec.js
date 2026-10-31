const { test, expect } = require("@playwright/test");

const viewports = [
  { name: "desktop", width: 1280, height: 720 },
  { name: "mobile", width: 390, height: 844 },
  { name: "small-phone", width: 320, height: 568 },
  { name: "phone-375", width: 375, height: 667 },
  { name: "narrow-tablet", width: 600, height: 800 },
  { name: "landscape-phone", width: 844, height: 390 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "small-laptop", width: 1024, height: 768 },
  { name: "laptop", width: 1366, height: 768 },
  { name: "compact-landscape", width: 1366, height: 600 },
  { name: "wide-browser", width: 1920, height: 900 },
  { name: "wide-desktop", width: 1920, height: 1080 },
  { name: "ultrawide", width: 2560, height: 1440 }
];

async function expectNoHorizontalOverflow(page) {
  const metrics = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth
  }));

  expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1);
}

async function expectNoVerticalOverflow(page) {
  const metrics = await page.evaluate(() => ({
    viewportHeight: window.innerHeight,
    documentHeight: document.documentElement.scrollHeight
  }));

  expect(metrics.documentHeight).toBeLessThanOrEqual(metrics.viewportHeight + 2);
}

async function expectElementsInsideViewport(page, selectors) {
  const issues = await page.evaluate((targetSelectors) => {
    return targetSelectors.flatMap((selector) => {
      const element = document.querySelector(selector);
      if (!element || element.hidden) return [`${selector}: ausente ou oculto`];

      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const tolerance = 2;
      const elementIssues = [];

      if (rect.left < -tolerance) elementIssues.push(`${selector}: ultrapassa a esquerda`);
      if (rect.right > window.innerWidth + tolerance) elementIssues.push(`${selector}: ultrapassa a direita`);
      if (rect.top < -tolerance) elementIssues.push(`${selector}: ultrapassa o topo`);
      if (rect.bottom > window.innerHeight + tolerance) elementIssues.push(`${selector}: ultrapassa a base`);
      if (
        ["hidden", "clip"].includes(style.overflowX) &&
        element.scrollWidth > element.clientWidth + tolerance
      ) {
        elementIssues.push(`${selector}: conteudo cortado na horizontal`);
      }
      if (
        ["hidden", "clip"].includes(style.overflowY) &&
        element.scrollHeight > element.clientHeight + tolerance
      ) {
        elementIssues.push(`${selector}: conteudo cortado na vertical`);
      }

      return elementIssues;
    });
  }, selectors);

  expect(issues).toEqual([]);
}

async function capture(page, testInfo, name) {
  await page.screenshot({ path: testInfo.outputPath(`${name}.png`), fullPage: false });
}

for (const viewport of viewports) {
  test.describe(`${viewport.name} ${viewport.width}x${viewport.height}`, () => {
    test.use({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: "reduce"
    });

    test(`portal: botoes e creditos sem cortes`, async ({ page }, testInfo) => {
      await page.addInitScript(() => window.localStorage.clear());
      await page.goto("/");

      await expectNoHorizontalOverflow(page);
      await expectNoVerticalOverflow(page);
      await expectElementsInsideViewport(page, [
        ".site-header",
        "#portal-title",
        ".game-options",
        ".theme-toggle"
      ]);
      await expect(page.getByRole("link", { name: /Quiz Português/ })).toBeVisible();
      await expect(page.getByRole("link", { name: /Trilha das Habilidades/ })).toBeVisible();
      if (viewport.width > 360 && viewport.width <= 760 && viewport.height >= 720) {
        const cards = page.locator(".game-card");
        const [first, second] = await Promise.all([cards.nth(0).boundingBox(), cards.nth(1).boundingBox()]);
        expect(Math.abs(first.x - second.x)).toBeLessThan(2);
        await expect(cards.nth(0).locator(".game-info p")).toBeVisible();
        await expect(cards.nth(1).locator(".game-info p")).toBeVisible();
      }
      await capture(page, testInfo, "portal-inicio");
    });

    test(`portal: legendas das capas preservam contraste nos dois temas`, async ({ page }) => {
      await page.addInitScript(() => window.localStorage.clear());
      await page.goto("/");

      const captionContrast = () =>
        page.evaluate(() => {
          const channels = (color) => color.match(/[\da-f]{2}/gi).map((part) => parseInt(part, 16));
          const luminance = (rgb) =>
            rgb
              .map((channel) => channel / 255)
              .map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))
              .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
          const theme = getComputedStyle(document.documentElement);
          const foreground = channels(theme.getPropertyValue("--cover-ink").trim()).slice(0, 3);
          const fade = channels(theme.getPropertyValue("--cover-fade").trim());
          const alpha = fade[3] === undefined ? 1 : fade[3] / 255;
          const background = fade.slice(0, 3).map((channel) => channel * alpha + 255 * (1 - alpha));
          const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
          const ratio = (values[0] + 0.05) / (values[1] + 0.05);
          return [...document.querySelectorAll(".cover-index, .cover-caption")].map(() => ratio);
        });

      const dark = await captionContrast();
      expect(dark).toHaveLength(4);
      expect(dark.every((ratio) => ratio >= 4.5)).toBe(true);

      await page.locator("#theme-toggle").click();
      const light = await captionContrast();
      expect(light).toHaveLength(4);
      expect(light.every((ratio) => ratio >= 4.5)).toBe(true);
    });

    test(`quiz: temas mantem contraste de leitura`, async ({ page }) => {
      await page.addInitScript(() => window.localStorage.clear());
      await page.goto("/Quiz-Portugues/");

      const measureContrast = () =>
        page.evaluate(() => {
          const style = getComputedStyle(document.body);
          const parse = (value) => {
            const match = value.match(/^#([\da-f]{6})$/i);
            if (!match) throw new Error(`Cor inesperada: ${value}`);
            const hex = match[1];
            return [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
          };
          const luminance = (color) =>
            color
              .map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))
              .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
          const ratio = (foreground, background) => {
            const values = [luminance(parse(foreground)), luminance(parse(background))].sort((a, b) => b - a);
            return (values[0] + 0.05) / (values[1] + 0.05);
          };
          const get = (name) => style.getPropertyValue(name).trim();
          return {
            theme: document.body.dataset.theme,
            text: ratio(get("--fg"), get("--bg")),
            accent: ratio(get("--line"), get("--bg")),
            button: ratio(get("--button-fg"), get("--button-bg")),
            browserBar: document.querySelector('meta[name="theme-color"]').content
          };
        });

      const light = await measureContrast();
      expect(light.theme).toBe("light");
      expect(light.text).toBeGreaterThanOrEqual(4.5);
      expect(light.accent).toBeGreaterThanOrEqual(4.5);
      expect(light.button).toBeGreaterThanOrEqual(4.5);
      expect(light.browserBar).toBe("#f3ead5");

      await page.locator("#open-settings-button").click();
      await page.locator("#theme-toggle-button").click();
      const dark = await measureContrast();
      expect(dark.theme).toBe("dark");
      expect(dark.text).toBeGreaterThanOrEqual(4.5);
      expect(dark.accent).toBeGreaterThanOrEqual(4.5);
      expect(dark.button).toBeGreaterThanOrEqual(4.5);
      expect(dark.browserBar).toBe("#101e2a");
    });

    test(`quiz: inicio, pergunta e feedback sem cortes`, async ({ page }, testInfo) => {
      await page.addInitScript(() => window.localStorage.clear());
      await page.goto("/Quiz-Portugues/");

      await expectNoHorizontalOverflow(page);
      await expectElementsInsideViewport(page, [
        ".title-block--home",
        "#question-total-label",
        ".menu-grid--home"
      ]);
      if (viewport.width <= 360) {
        const homeLabels = await page
          .locator(".menu-grid--home > .menu-button--home .menu-button__label")
          .evaluateAll((labels) =>
            labels.map((label) => ({
              clientWidth: label.clientWidth,
              scrollWidth: label.scrollWidth,
              height: label.getBoundingClientRect().height,
              lineHeight: parseFloat(getComputedStyle(label).lineHeight)
            }))
          );
        expect(homeLabels).toHaveLength(2);
        for (const label of homeLabels) {
          expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth + 1);
          expect(label.height).toBeLessThanOrEqual(label.lineHeight + 1);
        }
      }
      await capture(page, testInfo, "quiz-inicio");

      await page.locator("#start-button").click();
      await expect(page.locator("#question-counter")).toBeVisible();
      await expectElementsInsideViewport(page, ["#question-counter", "#question-text"]);

      await page.locator("#options-list .option-button").first().scrollIntoViewIfNeeded();
      await expectElementsInsideViewport(page, ["#options-list .option-button:first-child"]);
      await page.locator("#options-list .option-button").last().scrollIntoViewIfNeeded();
      await expectElementsInsideViewport(page, ["#options-list .option-button:last-child"]);
      await page.locator('#options-list button[data-index="0"]').click();
      await expect(page.locator("#feedback-panel")).toBeVisible();
      await page.waitForTimeout(120);
      const activeViewport = page.viewportSize();
      if (
        (activeViewport.width >= 761 && activeViewport.height >= 641) ||
        (activeViewport.width <= 760 && activeViewport.height >= 760)
      ) {
        const balance = await page.locator(".quiz-stage").evaluate((stage) => {
          const rect = stage.getBoundingClientRect();
          return Math.abs(rect.top - (window.innerHeight - rect.bottom));
        });
        expect(balance).toBeLessThan(activeViewport.width <= 760 ? 24 : 10);
      }
      await page.locator("#next-button").scrollIntoViewIfNeeded();
      await expectElementsInsideViewport(page, ["#feedback-panel", "#next-button"]);
      await capture(page, testInfo, "quiz-feedback");
    });

    test(`quiz: resultado e revisao alcancaveis`, async ({ page }, testInfo) => {
      test.setTimeout(25_000);
      await page.addInitScript(() => window.localStorage.clear());
      await page.goto("/Quiz-Portugues/");
      await page.locator("#start-button").click();

      for (let question = 1; question < 14; question += 1) {
        await page.locator("#options-list .option-button").first().click();
        await page.locator("#next-button").click();
        await expect(page.locator("#question-counter")).toContainText(`Pergunta ${question + 1}`);
      }

      await page.locator("#options-list .option-button").first().click();
      await page.getByRole("button", { name: "Ver Resultado" }).click();
      await expect(page.locator("#result-title")).toBeVisible();
      await expectNoHorizontalOverflow(page);
      await expectElementsInsideViewport(page, ["#result-title"]);
      const resultBadgeContrast = await page.evaluate(() => {
        const luminance = (value) => {
          const channels = value
            .match(/[\d.]+/g)
            .slice(0, 3)
            .map(Number);
          return channels
            .map((channel) => channel / 255)
            .map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))
            .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
        };
        return [...document.querySelectorAll(".performance-label, .summary-status")].map((badge) => {
          const style = getComputedStyle(badge);
          const colors = [luminance(style.color), luminance(style.backgroundColor)].sort((a, b) => b - a);
          return (colors[0] + 0.05) / (colors[1] + 0.05);
        });
      });
      expect(resultBadgeContrast.length).toBeGreaterThan(1);
      expect(resultBadgeContrast.every((ratio) => ratio >= 4.5)).toBe(true);
      const resultHighlight = page.locator('.screen[data-screen="result"] .result-highlight');
      await resultHighlight.scrollIntoViewIfNeeded();
      await expectElementsInsideViewport(page, ['.screen[data-screen="result"] .result-highlight']);
      await capture(page, testInfo, "quiz-resultado");

      for (const action of ["#restart-button", "#result-home-button"]) {
        await page.locator(action).scrollIntoViewIfNeeded();
        await expectElementsInsideViewport(page, [action]);
      }

      const errorReview = page.locator("#errors-review-section");
      if (await errorReview.isVisible()) {
        await errorReview.locator("summary").click();
        const reviewItems = page.locator("#summary-list .summary-item");
        await expect(reviewItems.first()).toBeVisible();
        await reviewItems.first().scrollIntoViewIfNeeded();
        await expectElementsInsideViewport(page, ["#summary-list .summary-item:first-child"]);
        await reviewItems.last().scrollIntoViewIfNeeded();
        await expectElementsInsideViewport(page, ["#summary-list .summary-item:last-child"]);
        await capture(page, testInfo, "quiz-revisao");
      }
    });

    test(`quiz: modo professor utilizavel`, async ({ page }, testInfo) => {
      await page.addInitScript(() => window.localStorage.clear());
      await page.goto("/Quiz-Portugues/");
      await page.locator("#open-settings-button").click();
      await page.locator("#teacher-mode-button").click();

      await expect(page.locator("#teacher-modal")).toBeVisible();
      await expectNoHorizontalOverflow(page);
      await expectElementsInsideViewport(page, [".modal-card--teacher", "#teacher-close-button"]);
      await capture(page, testInfo, "quiz-modo-professor");
    });

    test(`configuracoes continuam alcancaveis por rolagem`, async ({ page }) => {
      await page.addInitScript(() => window.localStorage.clear());
      await page.goto("/Quiz-Portugues/");
      await page.locator("#open-settings-button").click();
      await page.locator("#teacher-mode-button").scrollIntoViewIfNeeded();
      await expectElementsInsideViewport(page, ["#teacher-mode-button"]);
      await page.locator("#settings-back-button").click();

      await page.goto("/Trilha-das-Habilidades/");
      await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#a8e1f2");
      await page.locator("#settings-toggle").click();
      await expect(page.locator("#settings-panel")).toBeVisible();
      await expectElementsInsideViewport(page, ["#settings-panel", "#settings-close"]);
      await page.locator("#theme-button").click();
      await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#0d2b3c");
      await page.locator("#theme-button").click();
      await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#a8e1f2");
      await page.locator("#setting-speech").scrollIntoViewIfNeeded();
      await expectElementsInsideViewport(page, ["#setting-speech"]);
      await page.locator("#settings-close").click();
      await expect(page.locator("#settings-panel")).toBeHidden();
      await page.locator("#start-button").click();
      await page.locator("#game-settings-button").click();
      await expect(page.locator("#settings-panel")).toBeVisible();
      await expect(page.locator("#theme-button")).toBeVisible();
      await expect(page.locator("#fullscreen-button")).toBeVisible();
    });

    test(`trilha: inicio e tabuleiro sem cortes`, async ({ page }, testInfo) => {
      await page.addInitScript(() => {
        window.localStorage.clear();
        window.localStorage.setItem(
          "trilha-habilidades:settings",
          JSON.stringify({ animations: false, music: false, sfx: false })
        );
      });
      await page.goto("/Trilha-das-Habilidades/");

      await expectNoHorizontalOverflow(page);
      await expectElementsInsideViewport(page, [".start-card", "#settings-toggle", "#start-button"]);
      if (viewport.width <= 680) {
        const sceneBackground = await page.locator(".start-card__scene").evaluate((scene) => ({
          backgroundImage: getComputedStyle(scene).backgroundImage,
          aspectRatio: scene.clientWidth / scene.clientHeight
        }));
        expect(sceneBackground.backgroundImage).toContain("caravan-journey-mobile.svg");
        expect(sceneBackground.aspectRatio).toBeCloseTo(2.4, 1);
      }
      await capture(page, testInfo, "trilha-inicio");

      await page.locator("#start-button").click();
      await expect(page.locator("#roll-button")).toBeEnabled();
      await expectNoHorizontalOverflow(page);
      const sceneSpacing = await page.evaluate(() => {
        const bounds = (selector) => {
          const { left, right, top, bottom } = document.querySelector(selector).getBoundingClientRect();
          return { left, right, top, bottom };
        };
        const overlaps = (a, b) =>
          a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        const bus = bounds("#caravan");
        return {
          schoolClearsBus: !overlaps(bounds(".school"), bus),
          startSignClearsBus: !overlaps(bounds(".study-sign--start"), bus)
        };
      });
      expect(sceneSpacing.schoolClearsBus).toBe(true);
      expect(sceneSpacing.startSignClearsBus).toBe(true);
      await expectElementsInsideViewport(page, [".top-panel h1", ".score-panel"]);
      if (viewport.width >= 981 && viewport.width <= 1100) {
        const statusGap = await page.locator("#journey-message").evaluate((message) => {
          const panel = message.closest(".controls").getBoundingClientRect();
          return panel.bottom - message.getBoundingClientRect().bottom;
        });
        expect(statusGap).toBeLessThan(24);
      }
      await page.locator(".controls").scrollIntoViewIfNeeded();
      await expectElementsInsideViewport(page, [".controls"]);
      if (viewport.width <= 820) {
        await expectElementsInsideViewport(page, [".mobile-action-dock", "#roll-button", "#dice-value"]);
        const lastTile = page.locator("#board .tile").last();
        await lastTile.evaluate((element) => element.scrollIntoView({ block: "center" }));
        const lastTileClearsActionDock = await page.evaluate(() => {
          const tile = document.querySelector("#board .tile:last-child").getBoundingClientRect();
          const dock = document.querySelector(".mobile-action-dock").getBoundingClientRect();
          return tile.bottom <= dock.top + 2;
        });
        expect(lastTileClearsActionDock).toBe(true);
      }

      if (viewport.width > 980) {
        await page.locator(".board-wrap").scrollIntoViewIfNeeded();
        await expectElementsInsideViewport(page, [".board-wrap"]);
      } else {
        const scrollState = await page.evaluate(() => ({
          documentHeight: document.documentElement.scrollHeight,
          viewportHeight: window.innerHeight,
          bodyOverflowY: window.getComputedStyle(document.body).overflowY
        }));
        expect(scrollState.documentHeight).toBeGreaterThan(scrollState.viewportHeight);
        expect(scrollState.bodyOverflowY).not.toBe("hidden");

        await page.locator(".board-wrap").scrollIntoViewIfNeeded();
        const boardIsReachable = await page.locator(".board-wrap").evaluate((element) => {
          const rect = element.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.bottom > 0;
        });
        expect(boardIsReachable).toBe(true);
      }
      if (viewport.width <= 820) {
        await expectElementsInsideViewport(page, [".mobile-action-dock", "#roll-button", "#dice-value"]);
      }
      await capture(page, testInfo, "trilha-tabuleiro");
    });

    test(`trilha: tema noturno preserva a cena e os controles`, async ({ page }) => {
      await page.addInitScript(() => {
        window.localStorage.clear();
        window.localStorage.setItem("trilha-habilidades:theme", "dark");
        window.localStorage.setItem(
          "trilha-habilidades:settings",
          JSON.stringify({ animations: false, music: false, sfx: false })
        );
      });
      await page.goto("/Trilha-das-Habilidades/");

      await expect(page.locator("body")).toHaveAttribute("data-theme", "dark");
      await expect(page.locator(".moon")).toHaveCSS("opacity", "1");
      await expect(page.locator(".stars")).toHaveCSS("opacity", "1");
      if (viewport.width <= 680) {
        const sceneLayers = await page.locator(".start-card__scene").evaluate((scene) => ({
          backgroundImage: getComputedStyle(scene).backgroundImage,
          aspectRatio: scene.clientWidth / scene.clientHeight
        }));
        expect(sceneLayers.backgroundImage).toContain("caravan-journey-mobile.svg");
        expect(sceneLayers.backgroundImage.match(/radial-gradient/g)).toHaveLength(2);
        expect(sceneLayers.aspectRatio).toBeCloseTo(2.4, 1);
      }

      await page.locator("#start-button").click();
      await expect(page.locator("#roll-button")).toBeEnabled();
      await expectNoHorizontalOverflow(page);
      await page.locator(".controls").scrollIntoViewIfNeeded();
      await expectElementsInsideViewport(page, [".controls", "#dice-value"]);
    });

    test(`trilha: pergunta e feedback utilizaveis`, async ({ page }, testInfo) => {
      await page.addInitScript(() => {
        window.localStorage.clear();
        window.localStorage.setItem(
          "trilha-habilidades:settings",
          JSON.stringify({ animations: false, music: false, sfx: false })
        );
      });
      await page.goto("/Trilha-das-Habilidades/");
      await page.locator("#start-button").click();
      await page.locator("#roll-button").click();

      await expect(page.locator("#question-modal")).toBeVisible();
      await expectElementsInsideViewport(page, [".question-card", "#question-title"]);
      await page.locator("#options-list").scrollIntoViewIfNeeded();
      await expectElementsInsideViewport(page, ["#options-list"]);
      await page.locator("#options-list .option-button").first().click();
      await expect(page.locator("#continue-button")).toBeVisible();
      await page.locator("#continue-button").scrollIntoViewIfNeeded();
      await expectElementsInsideViewport(page, ["#feedback-text", "#continue-button"]);
      await capture(page, testInfo, "trilha-feedback");
    });
  });
}
