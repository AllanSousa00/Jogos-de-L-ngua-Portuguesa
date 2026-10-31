const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// Exercita o código de áudio real sem navegador, alto-falantes ou dependências externas.
function audioHarness() {
  const timers = new Map();
  const voices = [];
  const gains = [];
  let nextTimer = 0;
  class AudioContext {
    constructor() {
      this.state = "running";
      this.currentTime = 1;
      this.destination = {};
    }
    resume() {
      this.state = "running";
      return Promise.resolve();
    }
    createGain() {
      const gain = {
        value: 0,
        setValueAtTime(value) {
          assert.ok(Number.isFinite(value));
        },
        exponentialRampToValueAtTime(value) {
          assert.ok(value > 0 && value <= 1);
        },
        cancelScheduledValues() {
          this.cancelled = true;
        },
        setTargetAtTime(value) {
          assert.ok(value >= 0 && value <= 1);
          this.targetValue = value;
          this.silenced = true;
        }
      };
      const node = {
        gain,
        connect() {},
        disconnect() {
          this.disconnected = true;
        }
      };
      gains.push(node);
      return node;
    }
    createOscillator() {
      const node = {
        frequency: {
          setValueAtTime(value) {
            assert.ok(value > 0 && value < 20_000);
          }
        },
        connect() {},
        disconnect() {
          this.disconnected = true;
        },
        start() {},
        stop(time) {
          this.stopAt = time;
        }
      };
      voices.push(node);
      return node;
    }
  }
  const window = {
    AudioContext,
    setInterval(callback) {
      const id = ++nextTimer;
      timers.set(id, callback);
      return id;
    },
    clearInterval(id) {
      timers.delete(id);
    }
  };
  return { window, timers, voices, gains };
}

function loadQuiz(harness, extra = {}) {
  const source = fs.readFileSync(path.join(__dirname, "../apps/quiz-portugues/script.js"), "utf8");
  const audio = source.slice(source.indexOf("class AudioEngine {"), source.indexOf("const audioEngine ="));
  const context = vm.createContext({ window: harness.window, state: { musicEnabled: true }, ...extra });
  return vm.runInContext(`${audio}\nnew AudioEngine();`, context);
}

test("quiz: um único relógio, frase completa, silêncio e liberação de nós", async () => {
  const h = audioHarness();
  const engine = loadQuiz(h);
  await engine.syncBackground(true);
  await engine.syncBackground(true);
  assert.equal(h.timers.size, 1);
  assert.equal(engine.sequence.length, 64);
  assert.ok(engine.sequence.includes(0));
  for (let step = 1; step < 64; step += 1) engine.playMusicStep();
  assert.equal(engine.stepIndex, 0);
  engine.stopBackground();
  assert.equal(h.timers.size, 0);
  assert.equal(engine.isPlaying, false);
  assert.ok(h.gains.slice(1).every((node) => node.gain.silenced));
  for (const voice of h.voices) voice.onended();
  assert.equal(engine.voices.size, 0);
  assert.ok(h.voices.every((node) => node.disconnected));
  assert.ok(h.gains.slice(1).every((node) => node.disconnected));
});

test("quiz: silenciar durante a retomada do contexto não reinicia a música", async () => {
  const h = audioHarness();
  const engine = loadQuiz(h);
  let finishResume;
  engine.resumeContext = () =>
    new Promise((resolve) => {
      finishResume = resolve;
    });
  const pending = engine.syncBackground(true);
  engine.stopBackground();
  finishResume(true);
  await pending;
  assert.equal(h.timers.size, 0);
  assert.equal(engine.isPlaying, false);
});

test("quiz: navegador sem áudio continua funcional", async () => {
  const h = audioHarness();
  delete h.window.AudioContext;
  const engine = loadQuiz(h);
  await engine.syncBackground(true);
  await engine.playEffect("correct");
  assert.equal(h.voices.length, 0);
  assert.equal(h.timers.size, 0);
});

test("quiz: volume permite silêncio e não ultrapassa o limite", () => {
  const h = audioHarness();
  const engine = loadQuiz(h);
  engine.setVolume(0);
  engine.ensureContext();
  assert.equal(h.gains[0].gain.value, 0);
  engine.setVolume(3);
  assert.equal(engine.volume, 1);
  assert.equal(h.gains[0].gain.targetValue, 0.18);
  engine.setVolume(-1);
  assert.equal(engine.volume, 0);
  engine.setVolume(undefined);
  assert.equal(engine.volume, 0.7);
});

test("trilha: música não duplica, respeita aba oculta e libera o áudio", () => {
  const h = audioHarness();
  const source = fs.readFileSync(path.join(__dirname, "../apps/trilha-das-habilidades/script.js"), "utf8");
  const audio = source.slice(
    source.indexOf("function normalizeVolume("),
    source.indexOf("function setSetting(")
  );
  const document = { hidden: false };
  const settings = { music: true, muted: false, sfx: true };
  const context = vm.createContext({ window: h.window, settings, document, console });
  const engine = vm.runInContext(
    `let audioContext = null; let audioMasterGain = null; let musicTimer = null; let musicStep = 0; const audioVoices = new Set();\n${audio}\n({startMusic, stopMusic, playTone, voices: audioVoices, normalizeVolume})`,
    context
  );
  engine.startMusic();
  engine.startMusic();
  assert.equal(h.timers.size, 1);
  for (let step = 0; step < 64; step += 1) [...h.timers.values()][0]();
  assert.ok(h.voices.length > 20);
  settings.muted = true;
  engine.stopMusic();
  const before = h.voices.length;
  engine.playTone(440);
  assert.equal(h.voices.length, before);
  assert.equal(h.timers.size, 0);
  for (const voice of h.voices) voice.onended();
  assert.equal(engine.voices.size, 0);
  settings.muted = false;
  document.hidden = true;
  engine.startMusic();
  assert.equal(h.timers.size, 0);
  assert.equal(engine.normalizeVolume(-1), 0);
  assert.equal(engine.normalizeVolume(2), 1);
  assert.equal(engine.normalizeVolume(0.35), 0.35);
  assert.equal(engine.normalizeVolume(undefined), 0.7);
});
