const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../apps/trilha-das-habilidades/script.js"), "utf8");
const code = source.slice(
  source.indexOf("function getRoundSummary("),
  source.indexOf("function showVictory()")
);
const summarize = vm.runInNewContext(`${code}\ngetRoundSummary;`);

test("trilha: casas puladas pelo dado não contam como respostas erradas", () => {
  const history = Array.from({ length: 7 }, () => ({ type: "answer", correct: true }));
  history.push({ type: "roll", roll: 6 });
  const result = summarize(history);
  assert.equal(result.attempts, 7);
  assert.equal(result.correct, 7);
  assert.equal(result.accuracy, 100);
});

test("trilha: resultado considera erros e novas tentativas", () => {
  const result = summarize([
    { type: "answer", correct: false },
    { type: "answer", correct: true },
    { type: "answer", correct: true }
  ]);
  assert.equal(result.attempts, 3);
  assert.equal(result.correct, 2);
  assert.equal(result.accuracy, 67);
  assert.equal(summarize([]).accuracy, 0);
});

function diceHarness() {
  const timers = [];
  const intervals = new Map();
  const state = { started: true, waitingForContinue: false, position: 0, history: [] };
  const rollButton = { disabled: false };
  let opened = 0;
  const noop = () => {};
  const context = vm.createContext({
    state,
    rollButton,
    gameSettingsButton: { disabled: false },
    caravanRoute: null,
    console,
    modal: { hidden: true },
    window: {
      setTimeout(fn) {
        timers.push(fn);
      },
      setInterval(fn) {
        const id = intervals.size + 1;
        intervals.set(id, fn);
        return id;
      },
      clearInterval(id) {
        intervals.delete(id);
      }
    },
    getTrack: () => Array(20),
    diceFaces: [1, 2, 3, 4, 5, 6],
    diceValue: { textContent: "-" },
    diceCube: { classList: { remove: noop, add: noop }, offsetWidth: 1 },
    playTone: noop,
    setDiceFace: noop,
    announce: noop,
    renderAll: noop,
    animateCaravan: () => 0,
    resetTrack: noop,
    createSkillStats: () => ({}),
    hideVictory: noop,
    setStatus: noop,
    openQuestion: () => {
      opened += 1;
    }
  });
  const roll = source.slice(source.indexOf("function rollDice()"), source.indexOf("function openQuestion("));
  const restart = source.slice(
    source.indexOf("function restartGame()"),
    source.indexOf("function toggleTheme()")
  );
  const game = vm.runInContext(
    `let rollGeneration = 0; ${roll}\n${restart}\n({rollDice, restartGame});`,
    context
  );
  return { game, state, rollButton, timers, intervals, opened: () => opened };
}

test("trilha: reiniciar durante o dado cancela a jogada anterior", () => {
  const h = diceHarness();
  h.game.rollDice();
  assert.equal(h.rollButton.disabled, true);
  h.game.restartGame();
  for (const callback of h.intervals.values()) callback();
  h.timers.shift()();
  assert.equal(h.state.position, 0);
  assert.equal(h.state.history.length, 0);
  assert.equal(h.opened(), 0);
  assert.equal(h.intervals.size, 0);
  assert.equal(h.rollButton.disabled, false);
});

test("trilha: reiniciar antes da pergunta não abre uma pergunta antiga", () => {
  const h = diceHarness();
  h.game.rollDice();
  h.timers.shift()();
  assert.ok(h.state.position > 0);
  h.game.restartGame();
  h.timers.shift()();
  assert.equal(h.state.position, 0);
  assert.equal(h.opened(), 0);
});

test("trilha: cliques repetidos não criam duas jogadas simultâneas", () => {
  const h = diceHarness();
  h.game.rollDice();
  h.game.rollDice();
  assert.equal(h.timers.length, 1);
  h.timers.shift()();
  h.timers.shift()();
  assert.equal(h.state.history.length, 1);
  assert.equal(h.opened(), 1);
});

test("trilha: opções bloqueiam o fundo e devolvem o foco à origem", () => {
  const main = { inert: true };
  const document = { activeElement: null, querySelector: () => main };
  const opener = {
    focus() {
      document.activeElement = opener;
    }
  };
  const close = {
    focus() {
      document.activeElement = close;
    }
  };
  document.activeElement = opener;
  const settingsPanel = { hidden: true };
  const settingsScrim = { hidden: true };
  const startScreen = { inert: false };
  const state = { started: false };
  const control = { setAttribute() {} };
  const context = vm.createContext({
    document,
    settingsPanel,
    settingsScrim,
    startScreen,
    state,
    settingsToggle: control,
    gameSettingsButton: control,
    settingsClose: close,
    modal: { hidden: true },
    victoryModal: { hidden: true }
  });
  const code = source.slice(
    source.indexOf("function closeSettingsPanel()"),
    source.indexOf("function handleKeyboardShortcuts(")
  );
  const panel = vm.runInContext(
    `let settingsReturnFocus = null; ${code}\n({toggleSettingsPanel, closeSettingsPanel});`,
    context
  );
  panel.toggleSettingsPanel();
  assert.equal(settingsPanel.hidden, false);
  assert.equal(settingsScrim.hidden, false);
  assert.equal(startScreen.inert, true);
  assert.equal(main.inert, true);
  assert.equal(document.activeElement, close);
  panel.closeSettingsPanel();
  assert.equal(settingsPanel.hidden, true);
  assert.equal(startScreen.inert, false);
  assert.equal(main.inert, true);
  assert.equal(document.activeElement, opener);
  state.started = true;
  main.inert = false;
  panel.toggleSettingsPanel();
  assert.equal(main.inert, true);
  panel.closeSettingsPanel();
  assert.equal(main.inert, false);
});
