"use strict";

const STORAGE_KEY = "quiz-portugues-jogo:state-v2";
const optionLetters = ["a", "b", "c", "d"];

const DEFAULT_QUESTIONS = [
  {
    id: "base-1",
    prompt: "Complete corretamente a palavra “mu__arela”.",
    options: ["ss", "sc", "ç", "sç"],
    answer: 2,
    explanation: "A forma correta é “muçarela”, escrita com ç."
  },
  {
    id: "base-2",
    prompt: "Na frase “Seus ensinamentos foram muito significativos”, qual o sentido da palavra “significativos”?",
    options: ["Relativas", "Adequadas", "Pontuais", "Importantes"],
    answer: 3,
    explanation: "“Significativos” indica algo importante, marcante ou de grande valor."
  },
  {
    id: "base-3",
    prompt: "Na frase “Para sonhar, basta cerrar os olhos”, qual o significado da palavra “cerrar”?",
    options: ["Abrir", "Fechar", "Piscar", "Esquecer"],
    answer: 1,
    explanation: "Nesse contexto, “cerrar” significa fechar."
  },
  {
    id: "base-4",
    prompt: "Complete corretamente: “O suspeito foi pego em___”.",
    options: ["Flagrante", "Fragrante", "Flagante", "Frangrante"],
    answer: 0,
    explanation: "A expressão correta da língua portuguesa é “em flagrante”."
  },
  {
    id: "base-5",
    prompt: "Complete corretamente: “Ela agiu com muita __ ao resolver o problema.”",
    options: ["descrição", "discrição", "descrissão", "discreção"],
    answer: 1,
    explanation: "“Discrição” significa agir com reserva, cuidado ou prudência."
  },
  {
    id: "base-6",
    prompt: "Qual a forma correta da palavra?",
    options: ["Excessão", "Exceção", "Escessão", "Esceção"],
    answer: 1,
    explanation: "A grafia correta é “exceção”."
  },
  {
    id: "base-7",
    prompt: "Na frase “Ele foi muito cordial com todos”, o que significa “cordial”?",
    options: ["Educado", "Bravo", "Indiferente", "Triste"],
    answer: 0,
    explanation: "“Cordial” significa alguém gentil, educado e simpático."
  },
  {
    id: "base-8",
    prompt: "Complete corretamente: “Precisamos manter o __ da situação.”",
    options: ["controle", "controule", "controlhe", "comtrole"],
    answer: 0,
    explanation: "A palavra correta é “controle”."
  },
  {
    id: "base-9",
    prompt: "Qual palavra completa corretamente a frase: “Ele fez uma ótima ___ na prova.”",
    options: ["redassão", "redação", "rezação", "redacão"],
    answer: 1,
    explanation: "A grafia correta é “redação”."
  },
  {
    id: "base-10",
    prompt: "Na frase “O menino estava exausto”, o significado de “exausto” é:",
    options: ["Animado", "Cansado", "Bravo", "Confuso"],
    answer: 1,
    explanation: "“Exausto” significa muito cansado."
  },
  {
    id: "base-11",
    prompt: "Complete corretamente: “A professora pediu silêncio na ___.”",
    options: ["sála", "salla", "sala", "çala"],
    answer: 2,
    explanation: "A palavra correta é “sala”."
  },
  {
    id: "base-12",
    prompt: "Qual a forma correta da palavra?",
    options: ["Enchergar", "Enxergar", "Inxergar", "Encherguar"],
    answer: 1,
    explanation: "A grafia correta é “enxergar”."
  },
  {
    id: "base-13",
    prompt: "Na frase “O atleta demonstrou muita determinação”, o que significa “determinação”?",
    options: ["Preguiça", "Persistência", "Desânimo", "Medo"],
    answer: 1,
    explanation: "“Determinação” está relacionada à persistência e firmeza."
  },
  {
    id: "base-14",
    prompt: "Complete corretamente: “Ele sempre fala a ___.”",
    options: ["verdadi", "verdad", "verdade", "verdadee"],
    answer: 2,
    explanation: "A forma correta é “verdade”."
  }, 
];

const appRoot = document.querySelector("#app-root");
const screens = new Map(
  [...document.querySelectorAll("[data-screen]")].map((screen) => [screen.dataset.screen, screen])
);

const startButton = document.querySelector("#start-button");
const startButtonLabel = document.querySelector("#start-button-label");
const continueButton = document.querySelector("#continue-button");
const homeExitButton = document.querySelector("#home-exit-button");
const openSettingsButton = document.querySelector("#open-settings-button");
const questionTotalLabel = document.querySelector("#question-total-label");
const resumePanel = document.querySelector("#resume-panel");
const resumeText = document.querySelector("#resume-text");

const settingsBackButton = document.querySelector("#settings-back-button");
const musicToggleButton = document.querySelector("#music-toggle-button");
const musicLabel = document.querySelector("#music-label");
const musicIcon = document.querySelector("#music-icon");
const quizVolume = document.querySelector("#quiz-volume");
const quizVolumeValue = document.querySelector("#quiz-volume-value");
const quizSoundButton = document.querySelector("#quiz-sound-button");
const quizProgress = document.querySelector("#quiz-progress");
const quizProgressFill = document.querySelector("#quiz-progress-fill");
const themeToggleIcon = document.querySelector("#theme-toggle-button .icon-glyph");
const themeToggleButton = document.querySelector("#theme-toggle-button");
const themeToggleLabel = document.querySelector("#theme-toggle-label");
const shuffleQuestionsButton = document.querySelector("#shuffle-questions-button");
const shuffleQuestionsLabel = document.querySelector("#shuffle-questions-label");
const shuffleOptionsButton = document.querySelector("#shuffle-options-button");
const shuffleOptionsLabel = document.querySelector("#shuffle-options-label");
const fullscreenButton = document.querySelector("#fullscreen-button");
const fullscreenLabel = document.querySelector("#fullscreen-label");
const teacherModeButton = document.querySelector("#teacher-mode-button");

const quizStage = document.querySelector("#quiz-stage");
const questionCounter = document.querySelector("#question-counter");
const questionText = document.querySelector("#question-text");
const optionsList = document.querySelector("#options-list");
const feedbackPanel = document.querySelector("#feedback-panel");
const feedbackTitle = document.querySelector("#feedback-title");
const feedbackText = document.querySelector("#feedback-text");
const nextButton = document.querySelector("#next-button");

const finalScore = document.querySelector("#final-score");
const finalPercent = document.querySelector("#final-percent");
const resultMessage = document.querySelector("#result-message");
const performanceLabel = document.querySelector("#performance-label");
const summaryList = document.querySelector("#summary-list");
const errorsReviewSection = document.querySelector("#errors-review-section");
const errorsReviewList = document.querySelector("#errors-review-list");
const restartButton = document.querySelector("#restart-button");
const resultHomeButton = document.querySelector("#result-home-button");
const exitHomeButton = document.querySelector("#exit-home-button");

const confirmModal = document.querySelector("#confirm-modal");
const confirmModalTitle = document.querySelector("#confirm-modal-title");
const confirmModalText = document.querySelector("#confirm-modal-text");
const confirmModalCancel = document.querySelector("#confirm-modal-cancel");
const confirmModalConfirm = document.querySelector("#confirm-modal-confirm");

const teacherModal = document.querySelector("#teacher-modal");
const teacherCloseButton = document.querySelector("#teacher-close-button");
const teacherBankCount = document.querySelector("#teacher-bank-count");
const teacherExportButton = document.querySelector("#teacher-export-button");
const teacherImportButton = document.querySelector("#teacher-import-button");
const teacherPrompt = document.querySelector("#teacher-prompt");
const teacherOptionA = document.querySelector("#teacher-option-a");
const teacherOptionB = document.querySelector("#teacher-option-b");
const teacherOptionC = document.querySelector("#teacher-option-c");
const teacherOptionD = document.querySelector("#teacher-option-d");
const teacherAnswer = document.querySelector("#teacher-answer");
const teacherExplanation = document.querySelector("#teacher-explanation");
const teacherAddButton = document.querySelector("#teacher-add-button");
const teacherStatus = document.querySelector("#teacher-status");
const teacherCustomList = document.querySelector("#teacher-custom-list");
const questionImportInput = document.querySelector("#question-import-input");

const themeColorMeta = document.querySelector('meta[name="theme-color"]');

const state = {
  theme: "light",
  musicEnabled: true,
  audioVolume: 0.7,
  shuffleQuestions: true,
  shuffleOptions: true,
  currentScreen: "home",
  currentQuestionIndex: 0,
  answers: [],
  sessionQuestions: [],
  customQuestions: []
};

const runtime = {
  confirmAction: null,
  activeModal: null,
  modalRestoreFocus: new Map(),
  questionTransitionTimer: 0
};

const iconMarkup = {
  musicOn: `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9h4l5-4v14l-5-4H4ZM16 8q5 4 0 8m3-11q8 7 0 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `,
  musicOff: `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9h4l5-4v14l-5-4H4Zm13 1 5 5m0-5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `
};

class AudioEngine {
  constructor() {
    this.context = null;
    this.masterGain = null;
    this.musicInterval = 0;
    this.stepIndex = 0;
    this.isPlaying = false;
    this.voices = new Set();
    this.playRequest = 0;
    this.volume = 0.7;
    // Duas frases de oito compassos, com pausas para não competir com a leitura.
    this.sequence = [
      523.25, 659.25, 783.99, 0, 659.25, 587.33, 523.25, 0,
      440, 523.25, 659.25, 0, 587.33, 523.25, 493.88, 0,
      349.23, 440, 523.25, 0, 659.25, 587.33, 523.25, 0,
      392, 493.88, 587.33, 0, 523.25, 493.88, 392, 0,
      659.25, 783.99, 880, 0, 783.99, 659.25, 587.33, 0,
      523.25, 659.25, 783.99, 0, 659.25, 523.25, 440, 0,
      349.23, 523.25, 698.46, 0, 659.25, 587.33, 523.25, 0,
      392, 493.88, 587.33, 0, 659.25, 587.33, 523.25, 0
    ];
    this.bass = [130.81, 110, 87.31, 98, 130.81, 110, 87.31, 98];
    this.stepMs = 410;
  }

  ensureContext() {
    if (this.context) {
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    this.context = new AudioContextClass();
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = 0.18 * this.volume;
    this.masterGain.connect(this.context.destination);
  }

  async resumeContext() {
    this.ensureContext();

    if (!this.context || !this.masterGain) {
      return false;
    }

    if (this.context.state === "suspended") {
      try {
        await this.context.resume();
      } catch (error) {
        return false;
      }
    }

    return true;
  }

  setVolume(value) {
    const volume = Number(value);
    this.volume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.7;
    if (this.context && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(0.18 * this.volume, this.context.currentTime, 0.03);
    }
  }

  playTone(frequency, duration, type = "triangle", volume = 0.08, delay = 0) {
    if (!this.context || !this.masterGain) {
      return;
    }

    const startAt = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gainNode.gain.setValueAtTime(0.0001, startAt);
    gainNode.gain.exponentialRampToValueAtTime(volume, startAt + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    const voice = { oscillator, gain: gainNode };
    this.voices.add(voice);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.03);
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
      this.voices.delete(voice);
    };
  }

  playMusicStep() {
    if (!this.context || !this.masterGain) {
      return;
    }

    const step = this.stepIndex;
    const note = this.sequence[step];
    this.stepIndex = (this.stepIndex + 1) % this.sequence.length;
    if (step % 8 === 0) {
      const root = this.bass[Math.floor(step / 8)];
      this.playTone(root, 2.4, "sine", 0.07);
      this.playTone(root * 1.5, 2.1, "sine", 0.025, 0.03);
    }
    if (note) {
      this.playTone(note, 0.65, "triangle", 0.065);
      this.playTone(note * 2, 0.28, "sine", 0.016, 0.012);
    }
  }

  async syncBackground(enabled) {
    if (!enabled) {
      this.stopBackground();
      return;
    }

    const request = ++this.playRequest;
    const ready = await this.resumeContext();
    if (!ready || this.isPlaying || request !== this.playRequest) {
      return;
    }

    this.isPlaying = true;
    this.stepIndex = 0;
    this.playMusicStep();
    this.musicInterval = window.setInterval(() => this.playMusicStep(), this.stepMs);
  }

  stopBackground() {
    this.playRequest += 1;
    if (this.musicInterval) {
      window.clearInterval(this.musicInterval);
      this.musicInterval = 0;
    }

    this.isPlaying = false;
    if (this.context) {
      const now = this.context.currentTime;
      for (const voice of this.voices) {
        voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setTargetAtTime(0.0001, now, 0.01);
        voice.oscillator.stop(now + 0.05);
      }
    }
  }

  async playEffect(type) {
    if (!state.musicEnabled) {
      return;
    }

    const ready = await this.resumeContext();
    if (!ready) {
      return;
    }

    if (type === "correct") {
      this.playTone(659.25, 0.12, "sine", 0.12);
      this.playTone(880, 0.18, "sine", 0.11, 0.1);
      return;
    }

    this.playTone(293.66, 0.2, "triangle", 0.09);
    this.playTone(261.63, 0.3, "sine", 0.08, 0.14);
  }
}

const audioEngine = new AudioEngine();

function sanitizeText(value) {
  return String(value == null ? "" : value).trim();
}

function createQuestionId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function cloneQuestion(question) {
  return {
    id: question.id,
    prompt: question.prompt,
    options: [...question.options],
    answer: question.answer,
    explanation: question.explanation
  };
}

function normalizeAnswer(rawAnswer, options) {
  if (typeof rawAnswer === "number" && Number.isInteger(rawAnswer) && rawAnswer >= 0 && rawAnswer <= 3) {
    return rawAnswer;
  }

  if (typeof rawAnswer === "string") {
    const normalized = rawAnswer.trim().toLowerCase();
    if (optionLetters.includes(normalized)) {
      return optionLetters.indexOf(normalized);
    }
    if (/^[1-4]$/.test(normalized)) {
      return Number(normalized) - 1;
    }

    const matchedIndex = options.findIndex((option) => option.toLowerCase() === normalized);
    if (matchedIndex >= 0) {
      return matchedIndex;
    }
  }

  return -1;
}

function normalizeQuestion(candidate, prefix = "custom") {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const prompt = sanitizeText(candidate.prompt || candidate.enunciado || candidate.question);
  const explanation = sanitizeText(candidate.explanation || candidate.explicacao || candidate.feedback);

  let options = candidate.options || candidate.alternatives || candidate.alternativas;
  if (!Array.isArray(options)) {
    options = [candidate.a, candidate.b, candidate.c, candidate.d];
  }

  if (!Array.isArray(options) || options.length !== 4) {
    return null;
  }

  const cleanedOptions = options.map((option) => sanitizeText(option)).filter(Boolean);
  if (cleanedOptions.length !== 4 || !prompt) {
    return null;
  }

  const answer = normalizeAnswer(
    candidate.answer != null ? candidate.answer : candidate.correctIndex != null ? candidate.correctIndex : candidate.correct,
    cleanedOptions
  );

  if (answer < 0 || answer > 3) {
    return null;
  }

  return {
    id: sanitizeText(candidate.id) || createQuestionId(prefix),
    prompt,
    options: cleanedOptions,
    answer,
    explanation: explanation || `A alternativa correta é ${optionLetters[answer]}) ${cleanedOptions[answer]}.`
  };
}

function normalizeQuestionList(rawQuestions, prefix) {
  if (!Array.isArray(rawQuestions)) {
    return [];
  }

  return rawQuestions
    .map((question) => normalizeQuestion(question, prefix))
    .filter(Boolean);
}

function validateSavedAnswer(answer, question) {
  if (
    !answer ||
    typeof answer.selectedIndex !== "number" ||
    !Number.isInteger(answer.selectedIndex) ||
    answer.selectedIndex < 0 ||
    answer.selectedIndex >= question.options.length
  ) {
    return null;
  }

  return {
    selectedIndex: answer.selectedIndex,
    isCorrect: answer.selectedIndex === question.answer
  };
}

function shuffleArray(items) {
  const clonedItems = [...items];

  for (let index = clonedItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [clonedItems[index], clonedItems[randomIndex]] = [clonedItems[randomIndex], clonedItems[index]];
  }

  return clonedItems;
}

function shuffleQuestionOptions(question) {
  const mappedOptions = question.options.map((option, index) => ({ option, originalIndex: index }));
  const shuffledOptions = shuffleArray(mappedOptions);

  return {
    ...question,
    options: shuffledOptions.map((item) => item.option),
    answer: shuffledOptions.findIndex((item) => item.originalIndex === question.answer)
  };
}

function getQuestionBank() {
  return DEFAULT_QUESTIONS.concat(state.customQuestions);
}

function createSessionQuestions() {
  let sessionQuestions = getQuestionBank().map((question) => cloneQuestion(question));

  if (state.shuffleOptions) {
    sessionQuestions = sessionQuestions.map((question) => shuffleQuestionOptions(question));
  }

  if (state.shuffleQuestions) {
    sessionQuestions = shuffleArray(sessionQuestions);
  }

  return sessionQuestions;
}

function getAnsweredCount() {
  return state.answers.filter(Boolean).length;
}

function calculateScore() {
  return state.answers.filter(Boolean).filter((answer) => answer.isCorrect).length;
}

function hasSessionToContinue() {
  return state.sessionQuestions.length > 0 && getAnsweredCount() < state.sessionQuestions.length;
}

function isSessionComplete() {
  return state.sessionQuestions.length > 0 && getAnsweredCount() === state.sessionQuestions.length;
}

function getCurrentQuestion() {
  return state.sessionQuestions[state.currentQuestionIndex];
}

function buildPersistedState() {
  return {
    version: 2,
    theme: state.theme,
    musicEnabled: state.musicEnabled,
    audioVolume: state.audioVolume,
    shuffleQuestions: state.shuffleQuestions,
    shuffleOptions: state.shuffleOptions,
    currentScreen: state.currentScreen,
    currentQuestionIndex: state.currentQuestionIndex,
    answers: state.answers,
    sessionQuestions: state.sessionQuestions,
    customQuestions: state.customQuestions
  };
}

function persistState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(buildPersistedState()));
  } catch (error) {
    console.warn("Nao foi possivel salvar o estado do quiz.", error);
  }
}

function loadPersistedState() {
  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY);
    if (!rawState) {
      return;
    }

    const parsedState = JSON.parse(rawState);

    if (parsedState.theme === "light" || parsedState.theme === "dark") {
      state.theme = parsedState.theme;
    }

    if (typeof parsedState.musicEnabled === "boolean") {
      state.musicEnabled = parsedState.musicEnabled;
    }
    if (typeof parsedState.audioVolume === "number" && Number.isFinite(parsedState.audioVolume)) {
      state.audioVolume = Math.max(0, Math.min(1, parsedState.audioVolume));
    }

    if (typeof parsedState.shuffleQuestions === "boolean") {
      state.shuffleQuestions = parsedState.shuffleQuestions;
    }

    if (typeof parsedState.shuffleOptions === "boolean") {
      state.shuffleOptions = parsedState.shuffleOptions;
    }

    state.customQuestions = normalizeQuestionList(parsedState.customQuestions, "custom");
    state.sessionQuestions = normalizeQuestionList(parsedState.sessionQuestions, "session");

    if (Array.isArray(parsedState.answers) && state.sessionQuestions.length > 0) {
      state.answers = state.sessionQuestions.map((question, index) =>
        validateSavedAnswer(parsedState.answers[index], question)
      );
    } else {
      state.answers = [];
    }

    state.currentQuestionIndex =
      typeof parsedState.currentQuestionIndex === "number" && Number.isInteger(parsedState.currentQuestionIndex)
        ? Math.min(Math.max(parsedState.currentQuestionIndex, 0), Math.max(state.sessionQuestions.length - 1, 0))
        : 0;

    state.currentScreen =
      typeof parsedState.currentScreen === "string" && screens.has(parsedState.currentScreen)
        ? parsedState.currentScreen
        : "home";
  } catch (error) {
    console.warn("Nao foi possivel carregar o estado salvo do quiz.", error);
  }
}

function getThemeColor() {
  return state.theme === "light" ? "#f3ead5" : "#101e2a";
}

function focusScreenAnchor(name) {
  const target = document.querySelector(`[data-focus-anchor="${name}"]`);
  if (target instanceof HTMLElement) {
    target.focus({ preventScroll: true });
  }
}

function updateDocumentTitle() {
  if (state.currentScreen === "quiz" && state.sessionQuestions.length > 0) {
    document.title = `Pergunta ${state.currentQuestionIndex + 1} de ${state.sessionQuestions.length} | Quiz sobre Língua Portuguesa`;
    return;
  }

  if (state.currentScreen === "settings") {
    document.title = "Configurações | Quiz sobre Língua Portuguesa";
    return;
  }

  if (state.currentScreen === "result") {
    document.title = "Resultado | Quiz sobre Língua Portuguesa";
    return;
  }

  document.title = "Quiz sobre Língua Portuguesa";
}

function showScreen(name, options = {}) {
  screens.forEach((screen, key) => {
    screen.classList.toggle("is-active", key === name);
    if (key === name) screen.scrollTop = 0;
  });

  state.currentScreen = name;
  updateDocumentTitle();

  if (!options.skipPersist) {
    persistState();
  }

  window.scrollTo({ top: 0, behavior: "auto" });

  if (options.focus !== false) {
    window.requestAnimationFrame(() => focusScreenAnchor(name));
  }
}

function applyTheme() {
  document.body.dataset.theme = state.theme;
  themeToggleButton.setAttribute("aria-pressed", String(state.theme === "dark"));
  themeToggleLabel.textContent = "Tema escuro";
  themeToggleIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';

  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", getThemeColor());
  }
}

function applyMusicUI() {
  musicToggleButton.setAttribute("aria-pressed", String(state.musicEnabled));
  musicLabel.textContent = state.musicEnabled ? "Música Ligada" : "Música Desligada";
  musicIcon.innerHTML = state.musicEnabled ? iconMarkup.musicOn : iconMarkup.musicOff;
  quizSoundButton.innerHTML = state.musicEnabled ? iconMarkup.musicOn : iconMarkup.musicOff;
  quizSoundButton.setAttribute("aria-label", state.musicEnabled ? "Silenciar som" : "Ativar som");
  quizSoundButton.setAttribute("aria-pressed", String(!state.musicEnabled));
  const volumePercent = Math.round(state.audioVolume * 100);
  quizVolume.value = String(volumePercent);
  quizVolume.setAttribute("aria-valuetext", `${volumePercent}%`);
  quizVolumeValue.textContent = `${volumePercent}%`;
  audioEngine.setVolume(state.audioVolume);
}

function supportsFullscreen() {
  return typeof appRoot.requestFullscreen === "function";
}

function isFullscreenActive() {
  return document.fullscreenElement === appRoot;
}

function updateFullscreenUI() {
  const supported = supportsFullscreen();
  fullscreenButton.disabled = !supported;
  fullscreenButton.setAttribute("aria-pressed", String(isFullscreenActive()));
  fullscreenLabel.textContent = supported ? "Tela cheia" : "Tela cheia indisponível";
}

function updateShuffleUI() {
  shuffleQuestionsButton.setAttribute("aria-pressed", String(state.shuffleQuestions));
  shuffleOptionsButton.setAttribute("aria-pressed", String(state.shuffleOptions));
  shuffleQuestionsLabel.textContent = "Embaralhar perguntas";
  shuffleOptionsLabel.textContent = "Embaralhar alternativas";
}

function updateHomeUI() {
  const totalQuestions = getQuestionBank().length;
  questionTotalLabel.textContent = `${totalQuestions} ${totalQuestions === 1 ? "pergunta pronta" : "perguntas prontas"}`;

  const canContinue = hasSessionToContinue();
  resumePanel.hidden = !canContinue;
  startButtonLabel.textContent = canContinue ? "Novo Jogo" : "Iniciar";

  if (canContinue) {
    resumeText.textContent = `Partida salva na pergunta ${state.currentQuestionIndex + 1} de ${state.sessionQuestions.length}.`;
  }
}

function renderTeacherCustomList() {
  teacherCustomList.innerHTML = "";

  if (state.customQuestions.length === 0) {
    const emptyCard = document.createElement("article");
    const emptyTitle = document.createElement("h4");
    const emptyText = document.createElement("p");

    emptyCard.className = "teacher-question-card";
    emptyTitle.textContent = "Nenhuma questão personalizada ainda.";
    emptyText.textContent = "Use o formulário acima ou importe um arquivo JSON para aumentar o banco do quiz.";
    emptyCard.append(emptyTitle, emptyText);
    teacherCustomList.appendChild(emptyCard);
    return;
  }

  state.customQuestions.forEach((question, index) => {
    const card = document.createElement("article");
    const title = document.createElement("h4");
    const answer = document.createElement("p");
    const actions = document.createElement("div");
    const removeButton = document.createElement("button");

    card.className = "teacher-question-card";
    title.textContent = `${index + 1}. ${question.prompt}`;
    answer.textContent = `Resposta correta: ${optionLetters[question.answer]}) ${question.options[question.answer]}`;
    actions.className = "teacher-question-card__actions";
    removeButton.type = "button";
    removeButton.className = "menu-button menu-button--compact menu-button--ghost";
    removeButton.textContent = "Remover questão";
    removeButton.addEventListener("click", () => {
      openConfirmModal({
        title: "Remover esta questão?",
        message: "A questão personalizada será retirada do banco deste navegador.",
        confirmLabel: "Remover",
        cancelLabel: "Cancelar",
        onConfirm: () => removeTeacherQuestion(question.id)
      });
    });

    actions.appendChild(removeButton);
    card.append(title, answer, actions);
    teacherCustomList.appendChild(card);
  });
}

function removeTeacherQuestion(questionId) {
  state.customQuestions = state.customQuestions.filter((question) => question.id !== questionId);
  applyAndPersist();
  showTeacherStatus("Questão personalizada removida.", "success");
}

function updateTeacherUI() {
  const totalQuestions = getQuestionBank().length;
  const customCount = state.customQuestions.length;
  teacherBankCount.textContent = `${totalQuestions} perguntas no banco (${customCount} personalizadas)`;
  renderTeacherCustomList();
}

function syncUI() {
  applyTheme();
  applyMusicUI();
  updateShuffleUI();
  updateFullscreenUI();
  updateHomeUI();
  updateTeacherUI();
  updateDocumentTitle();
}

function getPerformanceTier(percent) {
  if (percent >= 90) {
    return {
      label: "Excelente",
      className: "is-excellent",
      message: "Desempenho excelente. Você dominou muito bem o conteúdo deste quiz."
    };
  }

  if (percent >= 60) {
    return {
      label: "Muito bom",
      className: "is-good",
      message: "Muito bom. Você teve um ótimo aproveitamento e mostrou segurança nas respostas."
    };
  }

  return {
    label: "Precisa revisar",
    className: "is-review",
    message: "Precisa revisar. A lista abaixo mostra os pontos principais para estudar de novo."
  };
}

function resetFeedbackPanel() {
  feedbackPanel.hidden = true;
  feedbackPanel.className = "feedback-panel";
  feedbackTitle.textContent = "";
  feedbackText.textContent = "";
}

function buildOptionButton(option, index) {
  const button = document.createElement("button");
  const marker = document.createElement("span");
  const stamp = document.createElement("span");
  const label = document.createElement("span");

  button.type = "button";
  button.className = "menu-button option-button";
  button.dataset.index = String(index);

  marker.className = "option-button__marker";
  marker.textContent = `${optionLetters[index]})`;
  stamp.className = "option-button__stamp";
  stamp.setAttribute("aria-hidden", "true");
  stamp.hidden = true;
  marker.appendChild(stamp);

  label.className = "menu-button__label";
  label.textContent = option;

  button.append(marker, label);
  button.addEventListener("click", () => handleAnswer(index));

  return button;
}

function renderQuizProgress() {
  const total = state.sessionQuestions.length;
  const answered = getAnsweredCount();
  quizProgress.setAttribute("aria-valuemax", String(total));
  quizProgress.setAttribute("aria-valuenow", String(answered));
  quizProgress.setAttribute("aria-valuetext", `${answered} de ${total} perguntas respondidas`);
  quizProgressFill.style.width = `${total ? answered / total * 100 : 0}%`;
}

function revealAnswerState(selectedIndex) {
  const question = getCurrentQuestion();
  if (!question) {
    return;
  }

  const isCorrect = selectedIndex === question.answer;
  const optionButtons = [...optionsList.querySelectorAll(".option-button")];

  optionButtons.forEach((button, index) => {
    button.disabled = true;
    button.classList.toggle("is-selected", index === selectedIndex);
    button.classList.toggle("is-correct", index === question.answer);
    button.classList.toggle("is-wrong", index === selectedIndex && !isCorrect);
    button.classList.toggle("is-muted", index !== selectedIndex && index !== question.answer);
    const stamp = button.querySelector(".option-button__stamp");
    const correctOption = index === question.answer;
    const wrongSelection = index === selectedIndex && !isCorrect;
    stamp.hidden = !correctOption && !wrongSelection;
    stamp.textContent = correctOption ? "✓" : wrongSelection ? "×" : "";
    const status = correctOption
      ? index === selectedIndex ? "Sua resposta, correta" : "Alternativa correta"
      : wrongSelection ? "Sua resposta, incorreta" : "Não selecionada";
    button.setAttribute("aria-label", `${optionLetters[index]}) ${question.options[index]}. ${status}.`);
  });

  feedbackPanel.hidden = false;
  feedbackPanel.classList.add(isCorrect ? "is-correct" : "is-wrong");
  feedbackTitle.textContent = isCorrect ? "Resposta correta!" : "Quase lá!";
  feedbackText.textContent = isCorrect
    ? question.explanation
    : `${question.explanation} A alternativa certa era ${optionLetters[question.answer]}) ${question.options[question.answer]}.`;

  nextButton.hidden = false;
  nextButton.disabled = false;
  renderQuizProgress();
}

function renderQuestion() {
  const question = getCurrentQuestion();
  if (!question) {
    showScreen("home");
    return;
  }

  questionCounter.textContent = `Pergunta ${state.currentQuestionIndex + 1} de ${state.sessionQuestions.length}`;
  questionText.textContent = question.prompt;
  renderQuizProgress();
  optionsList.innerHTML = "";

  question.options.forEach((option, index) => {
    optionsList.appendChild(buildOptionButton(option, index));
  });

  resetFeedbackPanel();
  nextButton.hidden = true;
  nextButton.disabled = true;
  nextButton.textContent =
    state.currentQuestionIndex === state.sessionQuestions.length - 1 ? "Ver Resultado" : "Próxima";

  const savedAnswer = state.answers[state.currentQuestionIndex];
  if (savedAnswer) {
    revealAnswerState(savedAnswer.selectedIndex);
  }

  updateDocumentTitle();
}

function transitionToQuestion(nextIndex) {
  window.clearTimeout(runtime.questionTransitionTimer);
  quizStage.classList.add("is-transitioning");

  runtime.questionTransitionTimer = window.setTimeout(() => {
    state.currentQuestionIndex = nextIndex;
    renderQuestion();
    persistState();
    window.requestAnimationFrame(() => {
      quizStage.classList.remove("is-transitioning");
      focusScreenAnchor("quiz");
    });
  }, 170);
}

function renderErrorsReview() {
  errorsReviewList.innerHTML = "";

  const wrongEntries = state.sessionQuestions
    .map((question, index) => ({ question, answer: state.answers[index] }))
    .filter((entry) => entry.answer && !entry.answer.isCorrect);

  if (wrongEntries.length === 0) {
    errorsReviewSection.hidden = true;
    return;
  }

  errorsReviewSection.hidden = false;

  wrongEntries.forEach((entry, index) => {
    const card = document.createElement("article");
    const title = document.createElement("h4");
    const selected = document.createElement("p");
    const correct = document.createElement("p");
    const explanation = document.createElement("p");

    card.className = "review-card";
    title.textContent = `${index + 1}. ${entry.question.prompt}`;
    selected.textContent = `Sua resposta: ${optionLetters[entry.answer.selectedIndex]}) ${entry.question.options[entry.answer.selectedIndex]}`;
    correct.textContent = `Revisar: ${optionLetters[entry.question.answer]}) ${entry.question.options[entry.question.answer]}`;
    explanation.textContent = entry.question.explanation;
    card.append(title, selected, correct, explanation);
    errorsReviewList.appendChild(card);
  });
}

function renderSummaryList() {
  summaryList.innerHTML = "";

  state.sessionQuestions.forEach((question, index) => {
    const answer = state.answers[index];
    if (!answer) {
      return;
    }

    const item = document.createElement("article");
    const status = document.createElement("span");
    const title = document.createElement("h3");
    const chosen = document.createElement("p");
    const correct = document.createElement("p");

    item.className = "summary-item";
    status.className = `summary-status ${answer.isCorrect ? "is-correct" : "is-wrong"}`;
    status.textContent = answer.isCorrect ? "Acertou" : "Errou";

    title.textContent = `${index + 1}. ${question.prompt}`;
    chosen.textContent = `Sua resposta: ${optionLetters[answer.selectedIndex]}) ${question.options[answer.selectedIndex]}`;
    correct.textContent = `Resposta certa: ${optionLetters[question.answer]}) ${question.options[question.answer]}`;

    item.append(status, title, chosen, correct);
    summaryList.appendChild(item);
  });
}

function renderResults() {
  if (state.sessionQuestions.length === 0) {
    showScreen("home");
    return;
  }

  state.score = calculateScore();
  const percent = Math.round((state.score / state.sessionQuestions.length) * 100);
  const tier = getPerformanceTier(percent);

  finalScore.textContent = `${state.score}/${state.sessionQuestions.length}`;
  finalPercent.textContent = `${percent}% de acertos`;
  resultMessage.textContent = tier.message;
  performanceLabel.textContent = tier.label;
  performanceLabel.className = `performance-label ${tier.className}`;

  renderErrorsReview();
  renderSummaryList();
  showScreen("result");
}

function beginNewGame() {
  state.sessionQuestions = createSessionQuestions();
  state.answers = Array.from({ length: state.sessionQuestions.length }, () => null);
  state.currentQuestionIndex = 0;
  renderQuestion();
  showScreen("quiz");
  persistState();
}

function continueSavedGame() {
  if (!hasSessionToContinue()) {
    beginNewGame();
    return;
  }

  renderQuestion();
  showScreen("quiz");
}

function handleAnswer(selectedIndex) {
  if (state.answers[state.currentQuestionIndex]) {
    return;
  }

  const question = getCurrentQuestion();
  if (!question) {
    return;
  }

  state.answers[state.currentQuestionIndex] = {
    selectedIndex,
    isCorrect: selectedIndex === question.answer
  };

  revealAnswerState(selectedIndex);
  persistState();
  audioEngine.playEffect(selectedIndex === question.answer ? "correct" : "wrong");
}

function nextStep() {
  if (!state.answers[state.currentQuestionIndex]) {
    return;
  }

  if (state.currentQuestionIndex < state.sessionQuestions.length - 1) {
    transitionToQuestion(state.currentQuestionIndex + 1);
    return;
  }

  renderResults();
}

function applyAndPersist() {
  syncUI();
  persistState();
}

function toggleTheme() {
  state.theme = state.theme === "light" ? "dark" : "light";
  applyAndPersist();
}

async function syncMusic() {
  applyMusicUI();
  persistState();
  await audioEngine.syncBackground(state.musicEnabled);
}

function toggleMusic() {
  state.musicEnabled = !state.musicEnabled;
  syncMusic();
}

function toggleShuffleQuestions() {
  state.shuffleQuestions = !state.shuffleQuestions;
  applyAndPersist();
}

function toggleShuffleOptions() {
  state.shuffleOptions = !state.shuffleOptions;
  applyAndPersist();
}

async function toggleFullscreen() {
  if (!supportsFullscreen()) {
    return;
  }

  try {
    if (isFullscreenActive()) {
      await document.exitFullscreen();
    } else {
      await appRoot.requestFullscreen();
    }
  } catch (error) {
    console.warn("Nao foi possivel alternar a tela cheia.", error);
  } finally {
    updateFullscreenUI();
  }
}

function showTeacherStatus(message, tone = "default") {
  teacherStatus.textContent = message;
  teacherStatus.className = "teacher-status";

  if (tone === "success") {
    teacherStatus.classList.add("is-success");
  }

  if (tone === "error") {
    teacherStatus.classList.add("is-error");
  }
}

function resetTeacherForm() {
  teacherPrompt.value = "";
  teacherOptionA.value = "";
  teacherOptionB.value = "";
  teacherOptionC.value = "";
  teacherOptionD.value = "";
  teacherAnswer.value = "0";
  teacherExplanation.value = "";
}

function readTeacherFormQuestion() {
  return normalizeQuestion(
    {
      prompt: teacherPrompt.value,
      options: [teacherOptionA.value, teacherOptionB.value, teacherOptionC.value, teacherOptionD.value],
      answer: Number(teacherAnswer.value),
      explanation: teacherExplanation.value
    },
    "custom"
  );
}

function addTeacherQuestion() {
  const newQuestion = readTeacherFormQuestion();

  if (!newQuestion) {
    showTeacherStatus("Preencha a pergunta, as quatro alternativas e a resposta correta.", "error");
    return;
  }

  state.customQuestions = state.customQuestions.concat(newQuestion);
  resetTeacherForm();
  applyAndPersist();
  showTeacherStatus("Pergunta adicionada com sucesso. Ela entra na próxima nova partida.", "success");
}

function buildExportPayload() {
  return {
    exportedAt: new Date().toISOString(),
    totalQuestions: getQuestionBank().length,
    questions: getQuestionBank().map((question) => ({
      prompt: question.prompt,
      options: [...question.options],
      answer: question.answer,
      explanation: question.explanation
    }))
  };
}

function exportQuestionsJson() {
  const fileContents = JSON.stringify(buildExportPayload(), null, 2);
  const blob = new Blob([fileContents], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);

  anchor.href = url;
  anchor.download = `quiz-lingua-portuguesa-${dateStamp}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);

  showTeacherStatus("Arquivo JSON exportado com sucesso.", "success");
}

function extractImportedQuestions(parsedData) {
  if (Array.isArray(parsedData)) {
    return parsedData;
  }

  if (parsedData && typeof parsedData === "object") {
    if (Array.isArray(parsedData.questions)) {
      return parsedData.questions;
    }

    if (Array.isArray(parsedData.perguntas)) {
      return parsedData.perguntas;
    }
  }

  return [];
}

async function importQuestionsFromFile(event) {
  const [selectedFile] = event.target.files || [];
  if (!selectedFile) {
    return;
  }

  try {
    const rawText = await selectedFile.text();
    const parsedData = JSON.parse(rawText);
    const importedQuestions = normalizeQuestionList(extractImportedQuestions(parsedData), "custom");

    if (importedQuestions.length === 0) {
      throw new Error("Nenhuma pergunta válida foi encontrada no JSON.");
    }

    state.customQuestions = state.customQuestions.concat(importedQuestions);
    applyAndPersist();
    showTeacherStatus(`${importedQuestions.length} pergunta(s) importada(s) com sucesso.`, "success");
  } catch (error) {
    showTeacherStatus(
      error instanceof Error ? error.message : "Nao foi possivel importar o arquivo JSON.",
      "error"
    );
  } finally {
    questionImportInput.value = "";
  }
}

function getOpenModal() {
  if (runtime.activeModal && !runtime.activeModal.hidden) {
    return runtime.activeModal;
  }

  return null;
}

function syncModalBackground() {
  const active = runtime.activeModal;
  screens.forEach((screen) => { screen.inert = Boolean(active); });
  teacherModal.inert = Boolean(active && active !== teacherModal);
  confirmModal.inert = Boolean(active && active !== confirmModal);
}

function openModal(modal, focusTarget) {
  runtime.activeModal = modal;
  runtime.modalRestoreFocus.set(
    modal,
    document.activeElement instanceof HTMLElement ? document.activeElement : null
  );
  modal.hidden = false;
  document.body.classList.add("is-modal-open");
  syncModalBackground();

  window.requestAnimationFrame(() => {
    if (runtime.activeModal === modal && focusTarget instanceof HTMLElement) {
      focusTarget.focus({ preventScroll: true });
    }
  });
}

function closeModal(modal) {
  const restoreFocus = runtime.modalRestoreFocus.get(modal);

  modal.hidden = true;
  runtime.modalRestoreFocus.delete(modal);
  runtime.activeModal = !confirmModal.hidden ? confirmModal : !teacherModal.hidden ? teacherModal : null;
  document.body.classList.toggle("is-modal-open", Boolean(runtime.activeModal));
  syncModalBackground();

  if (restoreFocus) {
    restoreFocus.focus({ preventScroll: true });
  }
}

function openConfirmModal(config) {
  runtime.confirmAction = config.onConfirm;
  confirmModalTitle.textContent = config.title || "Confirmar ação";
  confirmModalText.textContent = config.message || "Deseja continuar?";
  confirmModalConfirm.textContent = config.confirmLabel || "Confirmar";
  confirmModalCancel.textContent = config.cancelLabel || "Cancelar";
  openModal(confirmModal, confirmModalCancel);
}

function closeConfirmModal() {
  runtime.confirmAction = null;
  closeModal(confirmModal);
}

function confirmModalAction() {
  const action = runtime.confirmAction;
  closeConfirmModal();

  if (typeof action === "function") {
    action();
  }
}

function openTeacherModal() {
  showTeacherStatus("Novas perguntas entram automaticamente na próxima nova partida.");
  openModal(teacherModal, teacherPrompt);
}

function closeTeacherModal() {
  closeModal(teacherModal);
}

function attemptExit() {
  try {
    window.close();
  } catch (error) {
    console.warn("O navegador bloqueou o fechamento automatico.", error);
  }

  window.setTimeout(() => {
    if (!window.closed) {
      showScreen("exit");
    }
  }, 120);
}

function goHome() {
  updateHomeUI();
  showScreen("home");
}

function getFocusableElements(modal) {
  return [...modal.querySelectorAll("button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled])")];
}

function handleModalKeyboard(event, modal) {
  if (event.key === "Escape") {
    event.preventDefault();

    if (modal === confirmModal) {
      closeConfirmModal();
      return;
    }

    if (modal === teacherModal) {
      closeTeacherModal();
    }
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusableElements = getFocusableElements(modal);
  if (focusableElements.length === 0) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement;

  if (event.shiftKey && activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (!event.shiftKey && activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

function handleQuizKeyboard(event) {
  if (event.target?.closest?.("#quiz-sound-button")) {
    return;
  }
  if (state.currentScreen !== "quiz" || state.sessionQuestions.length === 0) {
    return;
  }

  const key = event.key.toLowerCase();
  const keyIndex = optionLetters.indexOf(key);
  const numericIndex = Number(key) - 1;

  if (!state.answers[state.currentQuestionIndex]) {
    if (keyIndex >= 0) {
      handleAnswer(keyIndex);
      return;
    }

    if (numericIndex >= 0 && numericIndex < 4) {
      handleAnswer(numericIndex);
    }
    return;
  }

  if (event.key === "Enter" || event.key === " " || event.key === "ArrowRight") {
    event.preventDefault();
    nextStep();
  }
}

function handleGlobalKeydown(event) {
  const openModalElement = getOpenModal();

  if (openModalElement) {
    handleModalKeyboard(event, openModalElement);
    return;
  }

  if (state.currentScreen === "settings" && event.key === "Escape") {
    event.preventDefault();
    showScreen("home");
    return;
  }

  handleQuizKeyboard(event);
}

function restoreViewFromState() {
  syncUI();

  if (isSessionComplete() && state.currentScreen === "result") {
    renderResults();
    return;
  }

  if (hasSessionToContinue()) {
    showScreen("home", { skipPersist: true });
    return;
  }

  if (state.currentScreen === "settings") {
    showScreen("settings", { skipPersist: true });
    return;
  }

  showScreen("home", { skipPersist: true });
}

function primeAudioFromGesture() {
  const bootstrapAudio = () => {
    if (state.musicEnabled) {
      syncMusic();
    } else {
      audioEngine.resumeContext();
    }
  };

  document.addEventListener("pointerdown", bootstrapAudio, { once: true });
  document.addEventListener("keydown", bootstrapAudio, { once: true });
}

function setupEventListeners() {
  startButton.addEventListener("click", () => {
    if (hasSessionToContinue()) {
      openConfirmModal({
        title: "Iniciar um novo jogo?",
        message: "Existe uma partida salva. Se continuar, o progresso atual será reiniciado.",
        confirmLabel: "Novo Jogo",
        cancelLabel: "Cancelar",
        onConfirm: beginNewGame
      });
      return;
    }

    beginNewGame();
  });

  continueButton.addEventListener("click", continueSavedGame);
  homeExitButton.addEventListener("click", () => {
    openConfirmModal({
      title: "Sair do quiz?",
      message: "Vou tentar fechar a aba. Se o navegador bloquear, deixo uma tela pronta para encerrar manualmente.",
      confirmLabel: "Sair Agora",
      cancelLabel: "Cancelar",
      onConfirm: attemptExit
    });
  });

  openSettingsButton.addEventListener("click", () => showScreen("settings"));
  settingsBackButton.addEventListener("click", goHome);

  musicToggleButton.addEventListener("click", toggleMusic);
  quizSoundButton.addEventListener("click", toggleMusic);
  quizVolume.addEventListener("input", () => {
    state.audioVolume = Math.max(0, Math.min(1, Number(quizVolume.value) / 100));
    applyMusicUI();
    persistState();
  });
  themeToggleButton.addEventListener("click", toggleTheme);
  shuffleQuestionsButton.addEventListener("click", toggleShuffleQuestions);
  shuffleOptionsButton.addEventListener("click", toggleShuffleOptions);
  fullscreenButton.addEventListener("click", toggleFullscreen);
  teacherModeButton.addEventListener("click", openTeacherModal);

  nextButton.addEventListener("click", nextStep);
  restartButton.addEventListener("click", beginNewGame);
  resultHomeButton.addEventListener("click", goHome);
  exitHomeButton.addEventListener("click", goHome);

  confirmModalCancel.addEventListener("click", closeConfirmModal);
  confirmModalConfirm.addEventListener("click", confirmModalAction);
  confirmModal.addEventListener("click", (event) => {
    if (event.target === confirmModal) {
      closeConfirmModal();
    }
  });

  teacherCloseButton.addEventListener("click", closeTeacherModal);
  teacherExportButton.addEventListener("click", exportQuestionsJson);
  teacherImportButton.addEventListener("click", () => questionImportInput.click());
  teacherAddButton.addEventListener("click", addTeacherQuestion);
  questionImportInput.addEventListener("change", importQuestionsFromFile);
  teacherModal.addEventListener("click", (event) => {
    if (event.target === teacherModal) {
      closeTeacherModal();
    }
  });

  document.addEventListener("keydown", handleGlobalKeydown);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      audioEngine.stopBackground();
      return;
    }

    if (state.musicEnabled) {
      syncMusic();
    }
  });

  document.addEventListener("fullscreenchange", updateFullscreenUI);
  window.addEventListener("pagehide", persistState);
}

function init() {
  loadPersistedState();
  primeAudioFromGesture();
  setupEventListeners();
  restoreViewFromState();
}

init();
