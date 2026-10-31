const { test, expect } = require("@playwright/test");

test.describe("portal unico", () => {
  test("raiz direciona para os dois jogos publicados", async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto("/");

    await expect(page).toHaveTitle(/Jogos de Língua Portuguesa/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Toda palavra abre um caminho." })
    ).toBeVisible();
    await expect(page.getByText("Uso restrito")).toBeVisible();
    await expect(page.getByRole("link", { name: "Solicitar acesso" })).toHaveAttribute(
      "href",
      "https://site-de-pedidos-pt.pages.dev/"
    );
    await expect(page.getByText("Créditos: projeto organizado para Allan Sousa.")).toHaveCount(0);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("button", { name: "Trocar para tema claro" })).toBeVisible();

    await page.getByRole("button", { name: "Trocar para tema claro" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.getByRole("button", { name: "Trocar para tema escuro" })).toBeVisible();

    await page.getByRole("link", { name: /Quiz Português/ }).click();
    await expect(page).toHaveURL(/\/Quiz-Portugues\/$/);
    await expect(page.getByRole("heading", { level: 1, name: "Quiz sobre Língua Portuguesa" })).toBeVisible();

    await page.goto("/");
    await page.getByRole("link", { name: /Trilha das Habilidades/ }).click();
    await expect(page).toHaveURL(/\/Trilha-das-Habilidades\/$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Trilha das Habilidades" }).first()
    ).toBeVisible();
  });
});

test.describe("jogos independentes", () => {
  test("quiz abre diretamente em sua propria pasta", async ({ page }) => {
    await page.goto("/Quiz-Portugues/");

    await expect(page).toHaveTitle(/Quiz sobre Língua Portuguesa/);
    await expect(page.getByRole("heading", { level: 1, name: "Quiz sobre Língua Portuguesa" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Trilha das Habilidades/ })).toHaveCount(0);
  });

  test("trilha abre diretamente em sua propria pasta", async ({ page }) => {
    await page.goto("/Trilha-das-Habilidades/");

    await expect(page).toHaveTitle(/Trilha das Habilidades/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Trilha das Habilidades" }).first()
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Quiz Português/ })).toHaveCount(0);
  });
});

test.describe("quiz portugues", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto("/Quiz-Portugues/");
  });

  test("inicia uma rodada e exibe feedback", async ({ page }) => {
    await page.getByRole("button", { name: "Iniciar" }).click();

    await expect(page.locator("#question-counter")).toContainText(/Pergunta 1 de 14/);
    await page.locator("#options-list button").first().click();
    await expect(page.locator("#feedback-panel")).toBeVisible();
    await expect(page.getByRole("button", { name: "Próxima" })).toBeVisible();
  });

  test("abre e fecha o modo professor sem alterar o banco", async ({ page }) => {
    await page.getByRole("button", { name: "Configurações" }).click();
    await page.getByRole("button", { name: "Modo Professor" }).click();

    await expect(page.getByRole("dialog", { name: "Modo Professor" })).toBeVisible();
    await expect(page.locator("#teacher-bank-count")).toContainText("14 perguntas");
    await page.getByRole("button", { name: "Fechar" }).click();
    await expect(page.locator("#teacher-modal")).toBeHidden();
  });

  test("cadastra e remove uma pergunta personalizada com texto seguro", async ({ page }) => {
    await page.getByRole("button", { name: "Configurações" }).click();
    await page.getByRole("button", { name: "Modo Professor" }).click();

    await page
      .locator("#teacher-prompt")
      .fill('<img src=x onerror="window.quizXss=true"> Qual palavra está correta?');
    await page.locator("#teacher-option-a").fill("Casa");
    await page.locator("#teacher-option-b").fill("Caza");
    await page.locator("#teacher-option-c").fill("Cassa");
    await page.locator("#teacher-option-d").fill("Caça");
    await page.locator("#teacher-explanation").fill("Casa é escrita com a letra s.");
    await page.getByRole("button", { name: "Adicionar Pergunta" }).click();

    await expect(page.locator("#teacher-bank-count")).toContainText("15 perguntas");
    await expect(page.locator("#teacher-custom-list img")).toHaveCount(0);
    await expect(page.locator("#teacher-custom-list")).toContainText("<img src=x");

    await page.getByRole("button", { name: "Remover questão" }).click();
    await expect(page.getByRole("dialog", { name: "Remover esta questão?" })).toBeVisible();
    await page.getByRole("button", { name: "Remover", exact: true }).click();

    await expect(page.locator("#teacher-bank-count")).toContainText("14 perguntas");
    await expect(page.locator("#teacher-custom-list")).toContainText("Nenhuma questão personalizada ainda.");
  });
});

test.describe("trilha das habilidades", () => {
  test("inicia a partida, joga o dado e abre a pergunta", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "trilha-habilidades:settings",
        JSON.stringify({ animations: false, music: false, sfx: false })
      );
    });
    await page.goto("/Trilha-das-Habilidades/");

    await page.getByRole("button", { name: "Iniciar jogo" }).click();
    const rollButton = page.getByRole("button", { name: "Jogar o dado" });
    await expect(rollButton).toBeEnabled();
    await rollButton.click();

    await expect(page.getByRole("dialog", { name: /./ })).toBeVisible({ timeout: 4_000 });
    await expect(page.locator("#options-list .option-button").first()).toBeVisible();
  });

  test("conclui as 20 casas, mostra o resumo e permite jogar novamente", async ({ page }) => {
    test.setTimeout(30_000);
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.localStorage.setItem(
        "trilha-habilidades:settings",
        JSON.stringify({ animations: false, music: false, sfx: false })
      );
      Math.random = () => 0.4;
    });
    await page.goto("/Trilha-das-Habilidades/");
    await page.getByRole("button", { name: "Iniciar jogo" }).click();

    for (let turn = 0; turn < 8; turn += 1) {
      if (await page.locator("#victory-modal").isVisible()) break;

      await page.locator("#roll-button").click();
      await expect(page.locator("#question-modal")).toBeVisible({ timeout: 5_000 });
      const prompt = await page.locator("#question-title").innerText();
      const answerIndex = await page.evaluate(
        (questionPrompt) =>
          window.TRILHA_DATA.questions.find((question) => question.prompt === questionPrompt)?.answer,
        prompt
      );
      expect(Number.isInteger(answerIndex)).toBe(true);

      await page.locator("#question-modal .option-button").nth(answerIndex).click();
      await page.locator("#continue-button").click();
      await expect(page.locator("#question-modal")).toBeHidden();
    }

    await expect(page.locator("#victory-modal")).toBeVisible();
    await expect(page.locator("#victory-summary")).toContainText("Você percorreu as 20 casas");
    await expect(page.locator("#victory-summary")).toContainText("7 perguntas");
    await expect(page.locator("#skill-summary .skill-summary__item")).toHaveCount(10);

    for (const viewport of [
      { width: 390, height: 844 },
      { width: 320, height: 568 }
    ]) {
      await page.setViewportSize(viewport);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow).toBe(false);

      const finalSkill = page.locator("#skill-summary .skill-summary__item").last();
      await finalSkill.scrollIntoViewIfNeeded();
      await expect(finalSkill).toBeInViewport();
      await page.locator("#victory-restart-button").scrollIntoViewIfNeeded();
      await expect(page.locator("#victory-restart-button")).toBeInViewport();
    }

    await page.locator("#victory-restart-button").click();
    await expect(page.locator("#victory-modal")).toBeHidden();
    await expect(page.locator("#position-label")).toHaveText("Casa 0 de 20");
    await expect(page.locator("#roll-button")).toBeEnabled();
  });
});
