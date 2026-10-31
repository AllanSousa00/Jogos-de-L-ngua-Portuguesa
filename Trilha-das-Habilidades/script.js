"use strict";

const THEME_STORAGE_KEY = "trilha-habilidades:theme";
const SETTINGS_STORAGE_KEY = "trilha-habilidades:settings";

const trilhaData = window.TRILHA_DATA || {};
const questionTypes = trilhaData.questionTypes || {};
const skillsMeta = Array.isArray(trilhaData.skills) ? trilhaData.skills : [];
const skills = skillsMeta.map((skill) => (typeof skill === "string" ? skill : skill.name)).filter(Boolean);
const skillIconMap = new Map(
  skillsMeta
    .filter((skill) => skill && typeof skill === "object")
    .map((skill) => [skill.name, skill.icon || skill.name.slice(0, 2).toUpperCase()])
);
const questions = Array.isArray(trilhaData.questions) ? trilhaData.questions : [];
const tilePositions = Array.isArray(trilhaData.tilePositions) ? trilhaData.tilePositions : [];
const startPosition = trilhaData.startPosition || { x: 7.9, y: 80.7 };
const tileColors = Array.isArray(trilhaData.tileColors)
  ? trilhaData.tileColors
  : ["#ef476f", "#ffd166", "#43aa8b", "#4cc9f0", "#b565c0", "#f3722c"];
const questionsPerSkill = Math.max(1, Number(trilhaData.questionsPerSkill) || 2);

const board = document.querySelector("#board");
const rollButton = document.querySelector("#roll-button");
const orderButton = document.querySelector("#order-button");
const restartButton = document.querySelector("#restart-button");
const soundButton = document.querySelector("#sound-button");
const soundLabel = document.querySelector("#sound-label");
const orderLabel = document.querySelector("#order-label");
const themeButton = document.querySelector("#theme-button");
const themeLabel = document.querySelector("#theme-label");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const diceValue = document.querySelector("#dice-value");
const positionLabel = document.querySelector("#position-label");
const scoreLabel = document.querySelector("#score-label");
const progressFill = document.querySelector("#progress-fill");
const modal = document.querySelector("#question-modal");
const questionSkill = document.querySelector("#question-skill");
const questionNumber = document.querySelector("#question-number");
const questionTitle = document.querySelector("#question-title");
const optionsList = document.querySelector("#options-list");
const feedbackText = document.querySelector("#feedback-text");
const continueButton = document.querySelector("#continue-button");
const questionType = document.querySelector("#question-type");
const caravan = document.querySelector("#caravan");
const routeTraveled = document.querySelector(".route-traveled");
const diceCube = document.querySelector("#dice-cube");
const startScreen = document.querySelector("#start-screen");
const startButton = document.querySelector("#start-button");
const settingsToggle = document.querySelector("#settings-toggle");
const settingsPanel = document.querySelector("#settings-panel");
const settingsScrim = document.querySelector("#settings-scrim");
const settingsClose = document.querySelector("#settings-close");
const gameSettingsButton = document.querySelector("#game-settings-button");
const settingVolume = document.querySelector("#setting-volume");
const volumeValue = document.querySelector("#volume-value");
const settingTheme = document.querySelector("#setting-theme");
const settingMusic = document.querySelector("#setting-music");
const settingSfx = document.querySelector("#setting-sfx");
const settingAnimations = document.querySelector("#setting-animations");
const settingDecorations = document.querySelector("#setting-decorations");
const settingLargeText = document.querySelector("#setting-large-text");
const settingHighContrast = document.querySelector("#setting-high-contrast");
const settingSpeech = document.querySelector("#setting-speech");
const settingMuted = document.querySelector("#setting-muted");
const fullscreenButton = document.querySelector("#fullscreen-button");
const srStatus = document.querySelector("#sr-status");
const victoryModal = document.querySelector("#victory-modal");
const victoryCard = document.querySelector(".victory-card");
const victorySummary = document.querySelector("#victory-summary");
const skillSummary = document.querySelector("#skill-summary");
const victoryRestartButton = document.querySelector("#victory-restart-button");
const victoryCloseButton = document.querySelector("#victory-close-button");

const state = {
  started: false,
  mode: "alternated",
  position: 0,
  previousPosition: 0,
  score: 0,
  answered: new Set(),
  skillStats: {},
  history: [],
  activeQuestionIndex: -1,
  waitingForContinue: false,
  theme: "light"
};

const defaultSettings = {
  volume: 0.7,
  music: false,
  sfx: true,
  animations: true,
  decorations: true,
  largeText: false,
  highContrast: false,
  speech: false,
  muted: false
};

const settings = { ...defaultSettings };
let audioContext = null;
let audioMasterGain = null;
let settingsReturnFocus = null;
let musicTimer = null;
let musicStep = 0;
const audioVoices = new Set();
let activeTrack = [];
let rollGeneration = 0;
let caravanRoute = null;
let caravanTravelMs = 0;

const diceFaces = [1, 2, 3, 4, 5, 6];
const diceFaceClasses = diceFaces.map((face) => `show-${face}`);

function setDiceFace(value) {
  diceCube.classList.remove(...diceFaceClasses);
  diceCube.classList.add(`show-${value}`);
}

function shuffleList(items) {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

function createSkillStats() {
  return skills.reduce((stats, skill) => {
    stats[skill] = { right: 0, wrong: 0 };
    return stats;
  }, {});
}

function getSkillIcon(skill) {
  return skillIconMap.get(skill) || skill.slice(0, 2).toUpperCase();
}

// Desenhos próprios em uma grade de 24 unidades; os nomes das habilidades continuam em texto.
const skillDrawings = {
  LI: "M3 5c4-1 7 0 9 2 2-2 5-3 9-2v14c-4-1-7 0-9 2-2-2-5-3-9-2V5Zm9 2v14M6 9h3m-3 4h3m6-4h3m-3 4h3",
  OR: "m3 18 5-13 5 13M5 13h6m3 1 3 3 5-7",
  PT: "M5 5h4v5H5V5Zm10 0h4v5h-4V5ZM5 15h4v4H5v-4Zm10 0h4v4l-4 3",
  CP: "M9 3h6v5H9V3Zm-6 13h6v5H3v-5Zm12 0h6v5h-6v-5ZM12 8v4m-6 4v-4h12v4",
  CO: "M3 7h6v10H3V7Zm12 0h6v10h-6V7Zm-6 5h6m-4-3 3 3-3 3",
  SA: "M3 7h17m-4-4 4 4-4 4M21 17H4m4-4-4 4 4 4",
  AC: "m4 20 6-13 6 13M6 15h8m-2-12 4-2m2 5 3 3",
  PQ: "M6 7c0-7 13-7 13 0 0 5-7 4-7 9m0 4v1",
  PX: "m4 16 12-12 4 4L8 20l-5 1 1-5Zm9-9 4 4M4 16l4 4m6 1h7",
  CC: "m9 15-2 2c-5 5-10-1-5-5l4-4c3-3 6-1 7 1m2 0 2-2c5-5 10 1 5 5l-4 4c-3 3-6 1-7-1m-1-3 4-4"
};

function createSkillDrawing(skill) {
  const code = getSkillIcon(skill);
  const drawing = skillDrawings[code];
  if (!drawing) return document.createTextNode(code);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.classList.add("skill-drawing");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", drawing);
  svg.appendChild(path);
  return svg;
}

function getQuestionTypeLabel(question) {
  return questionTypes[question.type] || "Múltipla escolha";
}

function announce(message) {
  if (srStatus) {
    srStatus.textContent = message;
  }
}

function speak(message) {
  if (!settings.speech || settings.muted || !("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "pt-BR";
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

function saveSettings() {
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn("Nao foi possivel salvar as configuracoes.", error);
  }
}

function loadSettings() {
  try {
    const savedSettings = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY));
    if (savedSettings && typeof savedSettings === "object") {
      Object.assign(settings, defaultSettings, savedSettings);
    }
    settings.volume = normalizeVolume(settings.volume);
  } catch (error) {
    console.warn("Nao foi possivel carregar as configuracoes.", error);
  }
}

function updateSettingsUI() {
  const volumePercent = Math.round(normalizeVolume(settings.volume) * 100);
  settingVolume.value = String(volumePercent);
  settingVolume.setAttribute("aria-valuetext", `${volumePercent}%`);
  volumeValue.textContent = `${volumePercent}%`;
  soundLabel.textContent = settings.muted ? "Ativar som" : "Silenciar som";
  soundButton.setAttribute("aria-pressed", String(settings.muted));
  if (settingTheme) {
    settingTheme.checked = state.theme === "dark";
  }

  if (settingMusic) {
    settingMusic.checked = settings.music;
  }

  if (settingSfx) {
    settingSfx.checked = settings.sfx;
  }

  if (settingAnimations) {
    settingAnimations.checked = settings.animations;
  }

  if (settingDecorations) {
    settingDecorations.checked = settings.decorations;
  }

  if (settingLargeText) {
    settingLargeText.checked = settings.largeText;
  }

  if (settingHighContrast) {
    settingHighContrast.checked = settings.highContrast;
  }

  if (settingSpeech) {
    settingSpeech.checked = settings.speech;
  }

  if (settingMuted) {
    settingMuted.checked = settings.muted;
  }
}

function applySettingsClasses() {
  document.body.classList.toggle("reduce-motion", !settings.animations);
  document.body.classList.toggle("simple-decor", !settings.decorations);
  document.body.classList.toggle("large-text", settings.largeText);
  document.body.classList.toggle("high-contrast", settings.highContrast);
}

function normalizeVolume(value) {
  const volume = Number(value);
  return Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.7;
}

function ensureAudioContext() {
  const AudioConstructor = window.AudioContext || window.webkitAudioContext;

  if (!AudioConstructor) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioConstructor();
    audioMasterGain = audioContext.createGain();
    audioMasterGain.gain.value = normalizeVolume(settings.volume);
    audioMasterGain.connect(audioContext.destination);
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  return audioContext;
}

function playTone(frequency, duration = 0.12, type = "sine", volume = 0.035, force = false) {
  if (settings.muted || (!force && !settings.sfx)) {
    return;
  }

  try {
    const context = ensureAudioContext();
    if (!context) {
      return;
    }
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain);
    gain.connect(audioMasterGain);
    const voice = { oscillator, gain };
    audioVoices.add(voice);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
      audioVoices.delete(voice);
    };
  } catch (error) {
    console.warn("Nao foi possivel tocar o som.", error);
  }
}

function startMusic() {
  stopMusic();

  if (!settings.music || settings.muted || document.hidden || !ensureAudioContext()) {
    return;
  }

  const notes = [
    392, 493.88, 587.33, 0, 659.25, 587.33, 493.88, 0,
    329.63, 392, 493.88, 0, 587.33, 493.88, 392, 0,
    261.63, 329.63, 392, 0, 523.25, 493.88, 440, 0,
    293.66, 369.99, 440, 0, 493.88, 440, 392, 0,
    493.88, 587.33, 659.25, 0, 587.33, 493.88, 440, 0,
    392, 493.88, 587.33, 0, 493.88, 440, 392, 0,
    440, 523.25, 659.25, 0, 587.33, 523.25, 440, 0,
    369.99, 440, 587.33, 0, 493.88, 440, 392, 0
  ];
  const bass = [98, 82.41, 65.41, 73.42, 98, 82.41, 110, 73.42];
  musicStep = 0;
  musicTimer = window.setInterval(() => {
    const note = notes[musicStep];
    if (musicStep % 8 === 0) {
      playTone(bass[Math.floor(musicStep / 8)], 2.1, "sine", 0.014, true);
      playTone(bass[Math.floor(musicStep / 8)] * 1.5, 1.8, "sine", 0.004, true);
    }
    if (note) {
      playTone(note, 0.62, "triangle", 0.012, true);
    }
    musicStep = (musicStep + 1) % notes.length;
  }, 480);
}

function stopMusic() {
  if (musicTimer) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }
  if (audioContext) {
    const now = audioContext.currentTime;
    for (const voice of audioVoices) {
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setTargetAtTime(0.0001, now, 0.01);
      voice.oscillator.stop(now + 0.05);
    }
  }
}

function setSetting(key, value) {
  settings[key] = key === "volume" ? normalizeVolume(value) : value;
  saveSettings();
  applySettingsClasses();
  updateSettingsUI();
  if (key === "volume" && audioContext && audioMasterGain) {
    audioMasterGain.gain.setTargetAtTime(settings.volume, audioContext.currentTime, 0.03);
  }

  if (key === "muted" && value) {
    stopMusic();
    window.speechSynthesis?.cancel();
  }
  if (key === "speech" && !value) {
    window.speechSynthesis?.cancel();
  }
  if (key === "muted") {
    announce(value ? "Som desativado." : "Som ativado.");
  }

  if (key === "music" || key === "muted") {
    if (settings.music && !settings.muted) {
      ensureAudioContext();
      startMusic();
    } else {
      stopMusic();
    }
  }
}

function setTheme(theme, shouldSave = true) {
  state.theme = theme;
  if (shouldSave) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, state.theme);
    } catch (error) {
      console.warn("Nao foi possivel salvar o tema.", error);
    }
  }
  renderAll();
}

function buildOrderedQuestions() {
  const bySkill = skills.map((skill) => (
    shuffleList(questions.filter((question) => question.skill === skill)).slice(0, questionsPerSkill)
  ));

  if (state.mode === "grouped") {
    return bySkill.flat();
  }

  const ordered = [];

  for (let round = 0; round < questionsPerSkill; round += 1) {
    bySkill.forEach((skillQuestions) => {
      if (skillQuestions[round]) {
        ordered.push(skillQuestions[round]);
      }
    });
  }

  return ordered;
}

function resetTrack() {
  activeTrack = buildOrderedQuestions();
}

function getTrack() {
  if (!activeTrack.length) {
    resetTrack();
  }

  return activeTrack;
}

function recordSkillResult(question, isCorrect) {
  if (!state.skillStats[question.skill]) {
    state.skillStats[question.skill] = { right: 0, wrong: 0 };
  }

  state.skillStats[question.skill][isCorrect ? "right" : "wrong"] += 1;
}

function renderBoard() {
  const track = getTrack();
  board.innerHTML = "";

  track.forEach((question, index) => {
    const position = tilePositions[index];
    const tile = document.createElement("li");
    const icon = document.createElement("span");
    const number = document.createElement("span");
    const skill = document.createElement("strong");
    const questionLabel = document.createElement("span");

    if (!position) {
      return;
    }

    tile.className = "tile";
    tile.dataset.skill = question.skill;
    tile.style.left = `${position.x}%`;
    tile.style.top = `${position.y}%`;
    tile.style.setProperty("--tile-rotate", `${position.rotate}deg`);
    tile.style.setProperty("--tile-color", tileColors[index % tileColors.length]);
    tile.classList.toggle("is-current", state.position === index + 1);
    tile.classList.toggle("is-complete", state.answered.has(index));
    const stopStatus = state.answered.has(index) ? " Respondida." : "";
    const currentStatus = state.position === index + 1 ? " Parada atual." : "";
    tile.setAttribute("aria-label", `Casa ${index + 1}. ${question.skill}. ${getQuestionTypeLabel(question)}.${stopStatus}${currentStatus}`);
    if (state.position === index + 1) tile.setAttribute("aria-current", "step");
    tile.title = `Casa ${index + 1}: ${question.skill}`;

    icon.className = "tile-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.appendChild(createSkillDrawing(question.skill));

    number.className = "tile-number";
    number.textContent = String(index + 1);

    skill.className = "tile-skill";
    skill.textContent = question.skill;

    questionLabel.className = "tile-question";
    questionLabel.textContent = getQuestionTypeLabel(question);

    tile.append(icon, number, skill, questionLabel);

    board.appendChild(tile);
  });

  renderCaravan();
}

function renderCaravan() {
  const position = state.position === 0 ? startPosition : tilePositions[state.position - 1];

  if (!position) {
    return;
  }

  if (!state.started) {
    caravan.style.left = `${position.x}%`;
    caravan.style.top = `${position.y}%`;
    return;
  }
  if (!caravanRoute) {
    const routeBase = document.querySelector(".route-base");
    routeTraveled.setAttribute("d", routeBase.getAttribute("d"));
    caravanRoute = window.createCaravanRoute({
      path: routeBase,
      onHeading: ({ facing, lean }) => {
        caravan.style.setProperty("--bus-facing", String(facing));
        caravan.style.setProperty("--bus-lean", `${lean.toFixed(2)}deg`);
      },
      onProgress: (progress) => { routeTraveled.style.strokeDashoffset = (1 - progress).toFixed(5); },
      marker: caravan,
      positions: tilePositions,
      startPosition,
      canAnimate: () => settings.animations && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    });
  }
  caravanTravelMs = caravanRoute.moveTo(state.position);
}

function animateCaravan() {
  return caravanTravelMs;
}

function updateScore() {
  const total = getTrack().length;
  const progressPercent = Math.round((state.position / total) * 100);
  positionLabel.textContent = `Casa ${state.position} de ${total}`;
  scoreLabel.textContent = `${state.score} acerto${state.score === 1 ? "" : "s"}`;
  progressFill.style.width = `${progressPercent}%`;
  scoreLabel.classList.remove("score-pop");
  void scoreLabel.offsetWidth;
  scoreLabel.classList.add("score-pop");
}

function renderAll() {
  orderLabel.textContent = state.mode === "alternated" ? "Modo alternado" : "Modo por habilidade";
  themeButton.setAttribute("aria-pressed", String(state.theme === "dark"));
  themeLabel.textContent = state.theme === "dark" ? "Tema claro" : "Tema escuro";
  document.body.dataset.theme = state.theme;
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", state.theme === "dark" ? "#0d2b3c" : "#a8e1f2");
  }
  applySettingsClasses();
  updateSettingsUI();
  renderBoard();
  updateScore();
}

function setStatus(title, text) {
  console.info(`${title}: ${text}`);
  document.querySelector("#journey-message").textContent = text;
  announce(`${title}. ${text}`);
}

function rollDice() {
  if (!state.started || state.waitingForContinue || rollButton.disabled) {
    return;
  }

  const track = getTrack();
  const generation = ++rollGeneration;
  const roll = Math.floor(Math.random() * 6) + 1;
  playTone(196, 0.08, "square", 0.018);
  rollButton.disabled = true;
  gameSettingsButton.disabled = true;
  diceValue.textContent = "...";
  diceCube.classList.remove("is-rolling");
  void diceCube.offsetWidth;
  diceCube.classList.add("is-rolling");

  let tick = 0;
  const tickTimer = window.setInterval(() => {
    if (generation !== rollGeneration) {
      window.clearInterval(tickTimer);
      return;
    }
    setDiceFace(diceFaces[tick % diceFaces.length]);
    tick += 1;
  }, 95);

  window.setTimeout(() => {
    window.clearInterval(tickTimer);
    if (generation !== rollGeneration) {
      return;
    }
    diceCube.classList.remove("is-rolling");
    setDiceFace(roll);
    diceValue.textContent = String(roll);
    playTone(330 + roll * 28, 0.14, "triangle", 0.03);

    state.previousPosition = state.position;
    state.position = Math.min(state.position + roll, track.length);
    state.history.push({
      type: "roll",
      roll,
      from: state.previousPosition,
      to: state.position,
      time: new Date().toISOString()
    });
    announce(`Dado caiu em ${roll}. Caravana avançou para a casa ${state.position}.`);

    renderAll();
    const travelMs = animateCaravan();

    if (state.position === 0) {
      rollButton.disabled = false;
      return;
    }

    window.setTimeout(() => {
      if (generation === rollGeneration) {
        openQuestion(state.position - 1);
      }
    }, travelMs + 120);
  }, 1080);
}

function openQuestion(index) {
  const question = getTrack()[index];

  if (!question) {
    finishGame();
    return;
  }

  state.activeQuestionIndex = index;
  state.waitingForContinue = true;
  rollButton.disabled = true;
  questionSkill.replaceChildren(createSkillDrawing(question.skill), document.createTextNode(question.skill));
  questionNumber.textContent = `Casa ${index + 1}`;
  questionType.textContent = getQuestionTypeLabel(question);
  questionTitle.textContent = question.prompt;
  feedbackText.textContent = "";
  continueButton.hidden = true;
  optionsList.innerHTML = "";

  question.options.forEach((option, optionIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    const letter = document.createElement("span");
    letter.className = "answer-letter";
    letter.textContent = String.fromCharCode(65 + optionIndex);
    letter.setAttribute("aria-hidden", "true");
    const text = document.createElement("span");
    text.className = "answer-copy";
    text.textContent = option;
    const stamp = document.createElement("span");
    stamp.className = "answer-stamp";
    stamp.setAttribute("aria-hidden", "true");
    stamp.hidden = true;
    button.append(letter, text, stamp);
    button.setAttribute("aria-label", `Alternativa ${String.fromCharCode(65 + optionIndex)}: ${option}`);
    button.addEventListener("click", () => answerQuestion(optionIndex));
    optionsList.appendChild(button);
  });

  modal.hidden = false;
  document.querySelector("main.app").inert = true;
  modal.querySelector(".question-card")?.focus();
  speak(`${question.skill}. ${getQuestionTypeLabel(question)}. ${question.prompt}. ${question.options.join(". ")}`);
  announce(`Pergunta aberta. ${question.skill}. ${getQuestionTypeLabel(question)}.`);
}

function answerQuestion(selectedIndex) {
  if (modal.hidden || !continueButton.hidden) {
    return;
  }
  const question = getTrack()[state.activeQuestionIndex];
  const isCorrect = selectedIndex === question.answer;
  const optionButtons = [...optionsList.querySelectorAll(".option-button")];
  const currentHouse = state.position;

  recordSkillResult(question, isCorrect);

  optionButtons.forEach((button, index) => {
    button.disabled = true;
    button.classList.toggle("is-correct", index === question.answer);
    button.classList.toggle("is-wrong", index === selectedIndex && !isCorrect);
    const correctOption = index === question.answer;
    const wrongSelection = index === selectedIndex && !isCorrect;
    const stamp = button.querySelector(".answer-stamp");
    stamp.hidden = !correctOption && !wrongSelection;
    stamp.textContent = correctOption ? "✓" : wrongSelection ? "×" : "";
    const status = correctOption
      ? index === selectedIndex ? "Sua resposta, correta" : "Alternativa correta"
      : wrongSelection ? "Sua resposta, incorreta" : "Não selecionada";
    button.setAttribute("aria-label", `Alternativa ${String.fromCharCode(65 + index)}: ${question.options[index]}. ${status}.`);
  });

  if (isCorrect) {
    if (!state.answered.has(state.activeQuestionIndex)) {
      state.score += 1;
      state.answered.add(state.activeQuestionIndex);
    }

    feedbackText.textContent = `Acertou! ${question.explanation} Você permanece na casa ${state.position}.`;
    playTone(523.25, 0.12, "triangle", 0.035);
    window.setTimeout(() => playTone(659.25, 0.14, "triangle", 0.03), 110);
    setStatus("Resposta correta", `Você ficou na casa ${state.position}. Agora pode jogar o dado novamente.`);
  } else {
    state.position = state.previousPosition;
    feedbackText.textContent = `Resposta correta: ${question.options[question.answer]}. ${question.explanation} Você volta para a casa ${state.position}.`;
    playTone(261.63, 0.24, "triangle", 0.02);
    setStatus("Voltou uma jogada", `Você retornou para a casa ${state.position}. Jogue de novo para tentar avançar.`);
  }

  state.history.push({
    type: "answer",
    house: currentHouse,
    skill: question.skill,
    questionType: question.type,
    correct: isCorrect,
    selectedIndex,
    time: new Date().toISOString()
  });

  continueButton.hidden = false;
  renderAll();
  speak(feedbackText.textContent);
  continueButton.focus();
}

function closeQuestion() {
  window.speechSynthesis?.cancel();
  modal.hidden = true;
  document.querySelector("main.app").inert = false;
  state.activeQuestionIndex = -1;
  state.waitingForContinue = false;
  rollButton.disabled = false;
  gameSettingsButton.disabled = false;

  if (state.position >= getTrack().length && state.answered.has(getTrack().length - 1)) {
    finishGame();
  } else {
    rollButton.focus();
  }
}

function getRoundSummary(history) {
  const answers = history.filter((entry) => entry.type === "answer");
  const correct = answers.filter((entry) => entry.correct).length;
  const attempts = answers.length;
  return { correct, attempts, accuracy: attempts ? Math.round(correct / attempts * 100) : 0 };
}

function showVictory() {
  const { correct, attempts, accuracy } = getRoundSummary(state.history);
  victorySummary.textContent = `Você percorreu as ${getTrack().length} casas. Respondeu ${attempts} pergunta${attempts === 1 ? "" : "s"} e acertou ${correct}: ${accuracy}% de acertos nas respostas desta partida.`;
  skillSummary.innerHTML = "";

  skills.forEach((skill) => {
    const stat = state.skillStats[skill] || { right: 0, wrong: 0 };
    const item = document.createElement("div");
    item.className = "skill-summary__item";
    const stamp = document.createElement("span");
    stamp.setAttribute("aria-hidden", "true");
    stamp.appendChild(createSkillDrawing(skill));
    const title = document.createElement("strong");
    title.textContent = skill;
    const detail = document.createElement("em");
    detail.textContent = stat.right + stat.wrong === 0 ? "Não sorteada nesta partida" : `${stat.right} acerto${stat.right === 1 ? "" : "s"} / ${stat.wrong} erro${stat.wrong === 1 ? "" : "s"}`;
    item.append(stamp, title, detail);
    skillSummary.appendChild(item);
  });

  victoryModal.hidden = false;
  document.querySelector("main.app").inert = true;
  victoryCard.focus();
  speak(`Chegada alcançada. ${victorySummary.textContent}`);
}

function hideVictory() {
  window.speechSynthesis?.cancel();
  victoryModal.hidden = true;
  document.querySelector("main.app").inert = false;
  restartButton.focus();
}

function finishGame() {
  setStatus("Fim da trilha", `Você chegou ao final com ${state.score} acerto${state.score === 1 ? "" : "s"}.`);
  rollButton.disabled = true;
  showVictory();
}

function toggleMode() {
  state.mode = state.mode === "alternated" ? "grouped" : "alternated";
  restartGame();
}

function restartGame() {
  rollGeneration += 1;
  caravanRoute?.reset(0);
  resetTrack();
  state.position = 0;
  state.previousPosition = 0;
  state.score = 0;
  state.answered = new Set();
  state.skillStats = createSkillStats();
  state.history = [];
  state.activeQuestionIndex = -1;
  state.waitingForContinue = false;
  diceValue.textContent = "-";
  setDiceFace(1);
  diceCube.classList.remove("is-rolling");
  rollButton.disabled = !state.started;
  gameSettingsButton.disabled = !state.started;
  modal.hidden = true;
  hideVictory();
  setStatus("Pronto para começar", "Lance o dado para começar uma nova viagem.");
  renderAll();
}

function toggleTheme() {
  setTheme(state.theme === "dark" ? "light" : "dark");
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
    announce("Tela cheia ativada.");
    return;
  }

  document.exitFullscreen?.();
  announce("Tela cheia desativada.");
}

function loadTheme() {
  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "light" || savedTheme === "dark") {
      state.theme = savedTheme;
    }
  } catch (error) {
    console.warn("Nao foi possivel carregar o tema.", error);
  }
}

function startGame() {
  state.started = true;
  if (!activeTrack.length) {
    resetTrack();
  }
  startScreen.hidden = true;
  document.querySelector("main.app").hidden = false;
  document.querySelector("main.app").inert = false;
  settingsPanel.hidden = true;
  settingsScrim.hidden = true;
  settingsToggle.setAttribute("aria-expanded", "false");
  rollButton.disabled = false;
  gameSettingsButton.disabled = false;
  playTone(440, 0.12, "triangle", 0.03);
  window.setTimeout(() => playTone(587.33, 0.14, "triangle", 0.03), 120);

  if (settings.music) {
    ensureAudioContext();
    startMusic();
  }

  rollButton.focus();
  renderCaravan();
}

function closeSettingsPanel() {
  settingsPanel.hidden = true;
  settingsScrim.hidden = true;
  startScreen.inert = false;
  document.querySelector("main.app").inert = !state.started || !modal.hidden || !victoryModal.hidden;
  settingsToggle.setAttribute("aria-expanded", "false");
  gameSettingsButton.setAttribute("aria-expanded", "false");
  settingsReturnFocus?.focus();
}

function toggleSettingsPanel() {
  if (!settingsPanel.hidden) {
    closeSettingsPanel();
    return;
  }
  settingsReturnFocus = document.activeElement;
  settingsPanel.hidden = false;
  settingsScrim.hidden = false;
  startScreen.inert = true;
  document.querySelector("main.app").inert = true;
  settingsToggle.setAttribute("aria-expanded", "true");
  gameSettingsButton.setAttribute("aria-expanded", "true");
  settingsClose.focus();
}

function handleKeyboardShortcuts(event) {
  const activeDialog = !settingsPanel.hidden ? settingsPanel : !modal.hidden ? modal : !victoryModal.hidden ? victoryModal : null;
  if (event.key === "Tab" && activeDialog) {
    const buttons = [...activeDialog.querySelectorAll("button:not(:disabled):not([hidden]), input:not(:disabled), select:not(:disabled)")];
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (!first) {
      event.preventDefault();
    } else if (event.shiftKey && (document.activeElement === first || !buttons.includes(document.activeElement))) {
      last.focus();
      event.preventDefault();
    } else if (!event.shiftKey && (document.activeElement === last || !buttons.includes(document.activeElement))) {
      first.focus();
      event.preventDefault();
    }
    return;
  }
  if (!settingsPanel.hidden) {
    if (event.key === "Escape") {
      closeSettingsPanel();
      event.preventDefault();
    }
    return;
  }
  const tagName = document.activeElement?.tagName;
  const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(tagName);

  if (event.altKey || event.ctrlKey || event.metaKey || isTyping) {
    return;
  }

  if (!modal.hidden && /^[1-4]$/.test(event.key)) {
    const option = optionsList.querySelectorAll(".option-button")[Number(event.key) - 1];
    option?.click();
    event.preventDefault();
    return;
  }

  if (event.key === "Escape") {
    if (!settingsPanel.hidden) {
      toggleSettingsPanel();
      settingsToggle.focus();
      event.preventDefault();
      return;
    }

    if (!victoryModal.hidden) {
      hideVictory();
      restartButton.focus();
      event.preventDefault();
      return;
    }
  }

  if (!state.started) {
    if (!settingsPanel.hidden || document.activeElement?.closest("button")) {
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      startGame();
      event.preventDefault();
    }
    return;
  }

  const key = event.key.toLowerCase();
  if ((event.key === " " || key === "d") && !rollButton.disabled) {
    rollDice();
    event.preventDefault();
  } else if (key === "r") {
    restartGame();
    event.preventDefault();
  } else if (key === "t") {
    toggleTheme();
    event.preventDefault();
  } else if (key === "f") {
    toggleFullscreen();
    event.preventDefault();
  } else if (key === "m") {
    setSetting("muted", !settings.muted);
    event.preventDefault();
  }
}

rollButton.addEventListener("click", rollDice);
orderButton.addEventListener("click", toggleMode);
restartButton.addEventListener("click", restartGame);
soundButton.addEventListener("click", () => setSetting("muted", !settings.muted));
themeButton.addEventListener("click", toggleTheme);
fullscreenButton.addEventListener("click", toggleFullscreen);
continueButton.addEventListener("click", closeQuestion);
startButton.addEventListener("click", startGame);
settingsToggle.addEventListener("click", toggleSettingsPanel);
gameSettingsButton.addEventListener("click", toggleSettingsPanel);
settingsClose.addEventListener("click", closeSettingsPanel);
settingsScrim.addEventListener("click", closeSettingsPanel);
settingVolume.addEventListener("input", () => setSetting("volume", Number(settingVolume.value) / 100));
settingTheme.addEventListener("change", () => setTheme(settingTheme.checked ? "dark" : "light"));
settingMusic.addEventListener("change", () => setSetting("music", settingMusic.checked));
settingSfx.addEventListener("change", () => setSetting("sfx", settingSfx.checked));
settingAnimations.addEventListener("change", () => setSetting("animations", settingAnimations.checked));
settingDecorations.addEventListener("change", () => setSetting("decorations", settingDecorations.checked));
settingLargeText.addEventListener("change", () => setSetting("largeText", settingLargeText.checked));
settingHighContrast.addEventListener("change", () => setSetting("highContrast", settingHighContrast.checked));
settingSpeech.addEventListener("change", () => setSetting("speech", settingSpeech.checked));
settingMuted.addEventListener("change", () => setSetting("muted", settingMuted.checked));
victoryRestartButton.addEventListener("click", restartGame);
victoryCloseButton.addEventListener("click", hideVictory);
document.addEventListener("keydown", handleKeyboardShortcuts);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopMusic();
    window.speechSynthesis?.cancel();
    caravanRoute?.finish();
  } else if (state.started && settings.music && !settings.muted) {
    startMusic();
  }
});
window.addEventListener("pagehide", () => caravanRoute?.finish());

loadTheme();
loadSettings();
resetTrack();
state.skillStats = createSkillStats();
renderAll();
