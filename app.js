const storageKeys = {
  user: "moodix_user",
  analysis: "moodix_day_analysis",
  source: "moodix_music_source",
  tracks: "moodix_playlist_tracks",
  logo: "moodix_logo_choice",
  waitlist: "moodix_app_waitlist",
  checkMode: "moodix_check_mode",
  weekAnalysis: "moodix_week_analysis",
  introStamp: "moodix_intro_stamp",
  spotifyToken: "moodix_spotify_token",
  spotifyVerifier: "moodix_spotify_verifier",
  spotifyState: "moodix_spotify_state"
};

const memoryStorage = {};
const spotifyConfig = {
  clientId: "",
  scopes: ["playlist-read-private", "playlist-read-collaborative"],
  redirectUri: "https://johnny0103.github.io/moodix/import.html"
};

const moodQuestions = [
  {
    name: "feeling",
    question: "How are you feeling today?",
    options: [
      ["light", "Light", "Open, easy, a little bright"],
      ["steady", "Steady", "Balanced and manageable"],
      ["heavy", "Heavy", "Low, tired, or slow"],
      ["restless", "Restless", "Ready to move or shake something off"],
      ["tender", "Tender", "Soft, emotional, or close to the heart"]
    ]
  },
  {
    name: "plans",
    question: "What are you doing today?",
    options: [
      ["work school class project", "Work or school", "Tasks, classes, meetings, deadlines"],
      ["errands busy drive", "Errands", "Moving between small responsibilities"],
      ["gym workout run move", "Gym or movement", "Training, walking, dancing, moving"],
      ["friends family social party", "Seeing people", "Friends, family, dates, groups"],
      ["rest sleep recover quiet", "Resting", "Home, quiet, recovery, low pressure"],
      ["study create focus progress", "Studying or creating", "Deep work, making, practicing"]
    ]
  },
  {
    name: "pace",
    question: "What pace would help today feel better?",
    options: [
      ["slow", "Slow and soft", "Lower the volume of the day"],
      ["steady", "Steady", "Keep things calm and reliable"],
      ["bright", "Upbeat", "Lift the room a little"],
      ["intense", "Fast and intense", "Give me energy and momentum"]
    ]
  },
  {
    name: "setting",
    question: "Where will most of today happen?",
    options: [
      ["home", "Mostly at home", "Your own space"],
      ["work", "Work or school", "A focused place"],
      ["outside", "Outside or commuting", "Moving through the day"],
      ["social", "Around people", "Shared rooms and conversations"]
    ]
  },
  {
    name: "company",
    question: "Who are you mostly around?",
    options: [
      ["solo", "Mostly myself", "A personal headspace"],
      ["team", "Team or classmates", "People with tasks attached"],
      ["friends", "Friends or family", "Familiar energy"],
      ["someone", "Someone close", "One person matters today"]
    ]
  },
  {
    name: "need",
    question: "What should music quietly do for you?",
    options: [
      ["focus", "Keep me focused", "Make the next thing easier"],
      ["lift", "Lift me up", "Bring light back into the room"],
      ["settle", "Settle me down", "Calm the nervous edge"],
      ["feel", "Let me feel things", "Give emotion a place to land"],
      ["move", "Push my energy forward", "Help me start moving"]
    ]
  },
  {
    name: "success",
    question: "What would make today feel successful?",
    options: [
      ["done finish one thing progress", "Finish one thing", "A clear small win"],
      ["lighter calm better", "Feel lighter", "Less weight by tonight"],
      ["progress project focus", "Make progress", "A few real steps forward"],
      ["fun friends celebrate", "Have fun", "Leave room for joy"],
      ["calm simple steady", "Stay calm", "Keep the day smooth"]
    ]
  },
  {
    name: "mind",
    question: "What is sitting on your mind?",
    options: [
      ["deadline exam project work", "A deadline", "Something needs attention"],
      ["person love miss care", "A person", "Someone is taking up space"],
      ["change future unsure", "A change", "Something feels in motion"],
      ["excited bright fun", "Excitement", "There is something to look forward to"],
      ["stress tired busy", "Stress", "A bit too much at once"],
      ["simple calm nothing", "Nothing heavy", "A clean enough headspace"]
    ]
  }
];

function storageGet(key) {
  try {
    return window.localStorage?.getItem(key) ?? memoryStorage[key] ?? null;
  } catch {
    return memoryStorage[key] ?? null;
  }
}

function storageSet(key, value) {
  memoryStorage[key] = value;
  try {
    window.localStorage?.setItem(key, value);
  } catch {
    // Memory fallback keeps the current prototype session usable.
  }
}

function storageRemove(key) {
  delete memoryStorage[key];
  try {
    window.localStorage?.removeItem(key);
  } catch {
    // Memory fallback keeps the current prototype session usable.
  }
}

const logoMarks = {
  pulse: `
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <rect width="44" height="44" rx="12"></rect>
      <path d="M9 25h7l4-11 6 20 4-9h5"></path>
      <circle cx="32" cy="14" r="4"></circle>
    </svg>
  `,
  orbit: `
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <rect width="44" height="44" rx="12"></rect>
      <circle cx="22" cy="22" r="7"></circle>
      <path d="M8 24c7-12 21-18 28-11 6 6-2 18-16 21"></path>
      <circle cx="34" cy="12" r="3"></circle>
    </svg>
  `,
  wave: `
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <rect width="44" height="44" rx="12"></rect>
      <path d="M8 25c5-11 10-11 15 0s10 11 15 0"></path>
      <path d="M12 16h20"></path>
    </svg>
  `
};

const demoSongs = [
  { title: "Blinding Lights", artist: "The Weeknd", mood: "electric", energy: "high", genre: "synthpop", activity: "commute" },
  { title: "Sunflower", artist: "Post Malone and Swae Lee", mood: "bright", energy: "medium", genre: "pop", activity: "morning" },
  { title: "Weightless", artist: "Marconi Union", mood: "restorative", energy: "low", genre: "ambient", activity: "rest" },
  { title: "Good Days", artist: "SZA", mood: "reflective", energy: "medium", genre: "r&b", activity: "unwind" },
  { title: "Levitating", artist: "Dua Lipa", mood: "bright", energy: "high", genre: "dance", activity: "workout" },
  { title: "Nights", artist: "Frank Ocean", mood: "reflective", energy: "medium", genre: "alternative", activity: "night" },
  { title: "Electric Feel", artist: "MGMT", mood: "electric", energy: "high", genre: "indie", activity: "weekend" },
  { title: "Pink + White", artist: "Frank Ocean", mood: "tender", energy: "low", genre: "r&b", activity: "unwind" },
  { title: "Midnight City", artist: "M83", mood: "electric", energy: "high", genre: "electronic", activity: "commute" },
  { title: "Holocene", artist: "Bon Iver", mood: "grounded", energy: "low", genre: "folk", activity: "morning" },
  { title: "Dog Days Are Over", artist: "Florence + The Machine", mood: "bright", energy: "high", genre: "indie", activity: "workout" },
  { title: "Intro", artist: "The xx", mood: "focused", energy: "medium", genre: "indie electronic", activity: "work" }
];

const wordProfiles = {
  Focused: { moods: ["focused", "grounded"], energy: "medium", activities: ["work", "study"] },
  Restorative: { moods: ["restorative", "grounded"], energy: "low", activities: ["rest", "sleep", "home"] },
  Bright: { moods: ["bright"], energy: "high", activities: ["morning", "social"] },
  Tender: { moods: ["tender", "reflective"], energy: "low", activities: ["unwind", "night"] },
  Electric: { moods: ["electric", "bright"], energy: "high", activities: ["workout", "commute"] },
  Grounded: { moods: ["grounded", "focused"], energy: "medium", activities: ["home", "work"] },
  Reflective: { moods: ["reflective", "tender"], energy: "medium", activities: ["unwind", "night"] }
};

const moodHints = {
  bright: ["happy", "sun", "gold", "smile", "dance", "good", "bright", "sweet", "levitating"],
  restorative: ["calm", "soft", "quiet", "sleep", "peace", "ocean", "slow", "weightless", "ambient"],
  tender: ["love", "heart", "pink", "kiss", "close", "miss", "care", "white"],
  electric: ["electric", "light", "fire", "run", "night", "power", "alive", "blinding"],
  focused: ["focus", "work", "study", "deep", "intro", "mind", "steady", "drive"],
  grounded: ["home", "earth", "morning", "steady", "folk", "holocene", "green"],
  reflective: ["midnight", "memory", "days", "dream", "nights", "past", "think", "good days"]
};

function getJSON(key, fallback = null) {
  try {
    return JSON.parse(storageGet(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function setJSON(key, value) {
  storageSet(key, JSON.stringify(value));
}

function localDayStamp(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getLocalDayMeta() {
  const now = new Date();
  return {
    stamp: localDayStamp(now),
    weekday: now.toLocaleDateString(undefined, { weekday: "long" }),
    date: now.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }),
    time: now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
  };
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function setLogo(choice) {
  const selected = logoMarks[choice] ? choice : "pulse";
  document.querySelectorAll("[data-brand-mark]").forEach((mark) => {
    mark.innerHTML = logoMarks[selected];
  });
  document.querySelectorAll("[data-logo-preview]").forEach((preview) => {
    preview.innerHTML = logoMarks[preview.dataset.logoPreview] || logoMarks.pulse;
  });
  document.querySelectorAll("[data-logo-choice]").forEach((button) => {
    button.classList.toggle("active", button.dataset.logoChoice === selected);
  });
}

function setupLogoPicker() {
  const saved = storageGet(storageKeys.logo) || "pulse";
  setLogo(saved);
  document.querySelectorAll("[data-logo-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      storageSet(storageKeys.logo, button.dataset.logoChoice);
      setLogo(button.dataset.logoChoice);
    });
  });
}

function setupLocalTime() {
  const meta = getLocalDayMeta();
  document.querySelectorAll("[data-local-weekday]").forEach((item) => item.textContent = meta.weekday);
  document.querySelectorAll("[data-local-date]").forEach((item) => item.textContent = meta.date);
  document.querySelectorAll("[data-local-time]").forEach((item) => item.textContent = `${meta.time} local time`);
}

function getUser() {
  return getJSON(storageKeys.user);
}

function setupSignin() {
  const form = document.querySelector("[data-signin-form]");
  const note = document.querySelector("[data-signin-note]");
  const overlay = document.querySelector("[data-emotion-overlay]");
  const user = getUser();

  if (user) {
    document.body.classList.add("is-signed-in");
    document.querySelectorAll("[data-signed-in-note]").forEach((item) => {
      item.replaceChildren(`Signed in as ${user.name || user.email}. Choose a step below.`);
    });
    document.querySelectorAll("[data-step-link]").forEach((link) => link.classList.remove("locked"));
    if (note) note.textContent = "You are signed in for this prototype.";
    if (form) {
      form.elements.namedItem("name").value = user.name || "";
      form.elements.namedItem("email").value = user.email || "";
    }
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      signedInAt: new Date().toISOString()
    };
    setJSON(storageKeys.user, userData);
    document.body.classList.add("is-signed-in");
    document.querySelectorAll("[data-step-link]").forEach((link) => link.classList.remove("locked"));
    document.querySelectorAll("[data-signed-in-note]").forEach((item) => {
      item.replaceChildren(`Signed in as ${userData.name || userData.email}. Choose a step below.`);
    });
    if (note) note.textContent = "Signed in. Listen to your emotion.";
    if (overlay) {
      overlay.hidden = false;
      overlay.classList.add("active");
      document.body.classList.add("show-emotion-overlay");
      window.setTimeout(() => {
        window.location.href = "mood-check.html?intro=1";
      }, 3000);
    } else {
      window.location.href = "mood-check.html?intro=1";
    }
  });
}

function setupDateIntro() {
  const intro = document.querySelector("[data-date-intro]");
  if (!intro || !getUser()) return;

  const params = new URLSearchParams(window.location.search);
  const meta = getLocalDayMeta();
  const shouldShow = params.get("intro") === "1" || storageGet(storageKeys.introStamp) !== meta.stamp;
  if (!shouldShow) return;

  const weekdayTarget = intro.querySelector("[data-intro-weekday]");
  const dateTarget = intro.querySelector("[data-intro-date]");
  const timeTarget = intro.querySelector("[data-intro-time]");
  let finished = false;

  const updateTime = () => {
    const now = new Date();
    const liveMeta = getLocalDayMeta();
    if (weekdayTarget) weekdayTarget.textContent = liveMeta.weekday;
    if (dateTarget) dateTarget.textContent = liveMeta.date;
    if (timeTarget) {
      timeTarget.textContent = now.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
      });
      timeTarget.setAttribute("datetime", now.toISOString());
    }
  };

  const finishIntro = () => {
    if (finished) return;
    finished = true;
    window.clearInterval(timer);
    storageSet(storageKeys.introStamp, localDayStamp());
    intro.classList.add("is-leaving");
    document.body.classList.add("date-intro-revealing");
    window.setTimeout(() => {
      intro.hidden = true;
      document.body.classList.remove("date-intro-active", "date-intro-revealing");
      document.getElementById("check-title")?.focus({ preventScroll: true });
      if (params.get("intro") === "1") {
        window.history.replaceState({}, "", "mood-check.html");
      }
    }, 820);
  };

  updateTime();
  const timer = window.setInterval(updateTime, 1000);
  intro.hidden = false;
  document.body.classList.add("date-intro-active");
  intro.focus({ preventScroll: true });
  intro.addEventListener("click", finishIntro);
  intro.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      finishIntro();
    }
  });
}

function requireSignin() {
  if (!document.body.matches("[data-requires-signin]")) return;
  if (getUser()) return;

  const gate = document.createElement("section");
  gate.className = "signin-gate";
  gate.innerHTML = `
    <div>
      <p class="eyebrow">Sign in required</p>
      <h1>Start from the Moodix sign-in page.</h1>
      <p>Moodix saves today's local check-in after prototype sign-in.</p>
      <a class="button primary" href="index.html#signin">Go to sign in</a>
    </div>
  `;
  document.querySelector("main")?.replaceChildren(gate);
}

function addScore(scores, word, amount) {
  scores[word] = (scores[word] || 0) + amount;
}

function analyzeDay(formData, meta = getLocalDayMeta()) {
  const text = normalize(`${formData.get("plans")} ${formData.get("mind")} ${formData.get("success")}`);
  const scores = {
    Focused: 0,
    Restorative: 0,
    Bright: 0,
    Tender: 0,
    Electric: 0,
    Grounded: 0,
    Reflective: 0
  };

  const feelingMap = {
    light: "Bright",
    steady: "Grounded",
    heavy: "Restorative",
    restless: "Electric",
    tender: "Tender"
  };
  addScore(scores, feelingMap[formData.get("feeling")] || "Reflective", 5);

  if (formData.get("pace") === "slow") addScore(scores, "Restorative", 4);
  if (formData.get("pace") === "steady") addScore(scores, "Grounded", 3);
  if (formData.get("pace") === "bright") addScore(scores, "Bright", 4);
  if (formData.get("pace") === "intense") addScore(scores, "Electric", 4);

  if (formData.get("setting") === "work") addScore(scores, "Focused", 4);
  if (formData.get("setting") === "home") addScore(scores, "Grounded", 3);
  if (formData.get("setting") === "outside") addScore(scores, "Electric", 2);
  if (formData.get("setting") === "social") addScore(scores, "Bright", 3);

  if (formData.get("company") === "solo") addScore(scores, "Reflective", 2);
  if (formData.get("company") === "team") addScore(scores, "Focused", 2);
  if (formData.get("company") === "friends") addScore(scores, "Bright", 2);
  if (formData.get("company") === "someone") addScore(scores, "Tender", 4);

  if (formData.get("need") === "focus") addScore(scores, "Focused", 5);
  if (formData.get("need") === "lift") addScore(scores, "Bright", 5);
  if (formData.get("need") === "settle") addScore(scores, "Restorative", 5);
  if (formData.get("need") === "feel") addScore(scores, "Tender", 3), addScore(scores, "Reflective", 3);
  if (formData.get("need") === "move") addScore(scores, "Electric", 5);

  const keywordMap = {
    Focused: ["deadline", "exam", "study", "class", "work", "project", "focus", "done", "progress"],
    Restorative: ["rest", "sleep", "tired", "drained", "recover", "quiet", "break", "lighter"],
    Bright: ["excited", "friends", "party", "sun", "happy", "fun", "celebrate", "better"],
    Tender: ["date", "love", "miss", "family", "heart", "person", "care"],
    Electric: ["gym", "run", "workout", "busy", "drive", "errands", "move"],
    Grounded: ["home", "clean", "cook", "routine", "steady", "simple", "calm"],
    Reflective: ["thinking", "remember", "unsure", "change", "past", "future", "alone"]
  };
  Object.entries(keywordMap).forEach(([word, keywords]) => {
    keywords.forEach((keyword) => {
      if (text.includes(keyword)) addScore(scores, word, 2);
    });
  });

  const word = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  return {
    word,
    detail: analysisDetail(word, formData),
    ...meta,
    answers: Object.fromEntries(formData.entries()),
    profile: wordProfiles[word]
  };
}

function analysisDetail(word, formData) {
  const needLabels = { focus: "focus", lift: "lift", settle: "calm", feel: "emotional space", move: "momentum" };
  const settingLabels = { home: "home", work: "work or school", outside: "movement", social: "people" };
  return `Because you pointed toward ${settingLabels[formData.get("setting")] || "today"} and asked music for ${needLabels[formData.get("need")] || "support"}, Moodix reads the day as ${word.toLowerCase()}.`;
}

function getStoredAnalysis() {
  const analysis = getJSON(storageKeys.analysis);
  if (!analysis || analysis.stamp !== getLocalDayMeta().stamp) return null;
  return analysis;
}

function setupDayForm() {
  const form = document.querySelector("[data-day-form]");
  const card = document.querySelector("[data-analysis-card]");
  const questionTarget = document.querySelector("[data-wizard-question]");
  const percent = document.querySelector("[data-wizard-percent]");
  const left = document.querySelector("[data-wizard-left]");
  const bar = document.querySelector("[data-wizard-bar]");
  const next = document.querySelector("[data-wizard-next]");
  const skip = document.querySelector("[data-wizard-skip]");
  if (!form || !card) return;

  if (!questionTarget) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const analysis = analyzeDay(new FormData(form));
      storageSet(storageKeys.checkMode, "today");
      setJSON(storageKeys.analysis, analysis);
      document.querySelector("[data-day-word]").textContent = analysis.word;
      document.querySelector("[data-day-summary]").textContent = `${analysis.weekday} reads as ${analysis.word.toLowerCase()}. Moodix saved this for ${analysis.date}.`;
      document.querySelector("[data-analysis-detail]").textContent = analysis.detail;
      card.hidden = false;
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return;
  }

  const answers = {};
  let selectedAnswer = "";
  let step = 0;

  const saveAnalysis = () => {
    const synthetic = new FormData();
    moodQuestions.forEach((question) => synthetic.set(question.name, answers[question.name] || question.options[0][0]));
    const analysis = analyzeDay(synthetic);
    storageSet(storageKeys.checkMode, "today");
    setJSON(storageKeys.analysis, analysis);
    document.querySelector("[data-day-word]").textContent = analysis.word;
    document.querySelector("[data-day-summary]").textContent = `${analysis.weekday} reads as ${analysis.word.toLowerCase()}. Moodix saved this for ${analysis.date}.`;
    document.querySelector("[data-analysis-detail]").textContent = analysis.detail;
    card.hidden = false;
    form.hidden = true;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const updateProgress = () => {
    const completed = Math.min(step, moodQuestions.length);
    const completion = Math.round((completed / moodQuestions.length) * 100);
    if (percent) percent.textContent = `${completion}% complete`;
    if (left) {
      const remaining = moodQuestions.length - completed;
      left.textContent = remaining === 1 ? "1 question left" : `${remaining} questions left`;
    }
    if (bar) bar.style.width = `${completion}%`;
  };

  const renderStep = () => {
    const question = moodQuestions[step];
    if (!question) {
      updateProgress();
      saveAnalysis();
      return;
    }
    questionTarget.innerHTML = `
      <p class="eyebrow">Question ${step + 1} of ${moodQuestions.length}</p>
      <h2>${question.question}</h2>
      <div class="wizard-options">
        ${question.options.map(([value, label, hint]) => `
          <button class="wizard-option" type="button" data-answer="${escapeHTML(value)}">
            <strong>${escapeHTML(label)}</strong>
            <small>${escapeHTML(hint)}</small>
          </button>
        `).join("")}
      </div>
    `;
    selectedAnswer = "";
    updateProgress();
  };

  questionTarget.addEventListener("click", (event) => {
    const option = event.target.closest("[data-answer]");
    if (!option) return;
    selectedAnswer = option.dataset.answer;
    questionTarget.querySelectorAll("[data-answer]").forEach((button) => {
      button.classList.toggle("selected", button === option);
    });
  });

  const advance = (preferNot = false) => {
    const question = moodQuestions[step];
    if (!question) return;
    answers[question.name] = preferNot ? question.options[0][0] : selectedAnswer || question.options[0][0];
    step += 1;
    renderStep();
  };

  next?.addEventListener("click", () => advance(false));
  skip?.addEventListener("click", () => advance(true));

  form.addEventListener("submit", (event) => event.preventDefault());
  renderStep();
}

function setupMoodMode() {
  const choices = document.querySelectorAll("[data-mode-choice]");
  const panels = document.querySelectorAll("[data-mode-panel]");
  const modeGrid = document.querySelector(".mode-choice-grid");
  if (!choices.length) return;

  const setMode = (mode) => {
    storageSet(storageKeys.checkMode, mode);
    choices.forEach((choice) => choice.classList.toggle("active", choice.dataset.modeChoice === mode));
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.modePanel !== mode;
    });
    document.querySelector("[data-analysis-card]")?.setAttribute("hidden", "");
    document.querySelector("[data-week-summary]")?.setAttribute("hidden", "");
    if (modeGrid) modeGrid.hidden = true;
  };

  choices.forEach((choice) => {
    choice.addEventListener("click", () => setMode(choice.dataset.modeChoice));
  });
  panels.forEach((panel) => {
    panel.hidden = true;
  });
  choices.forEach((choice) => choice.classList.remove("active"));
}

function weekDates() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return {
      stamp: localDayStamp(date),
      weekday: date.toLocaleDateString(undefined, { weekday: "long" }),
      date: date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }),
      time: today.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
      label: index === 0 ? "Today" : date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    };
  });
}

function renderWeekSummary(days) {
  const summary = document.querySelector("[data-week-summary]");
  const list = document.querySelector("[data-week-summary-list]");
  if (!summary || !list || !days?.length) return;
  list.innerHTML = days.map((day) => `
    <div>
      <strong>${day.weekday}</strong>
      <small>${day.label || day.stamp}</small>
      <span>${day.analysis.word}</span>
    </div>
  `).join("");
  summary.hidden = false;
}

function setupWeekForm() {
  const form = document.querySelector("[data-week-form]");
  const questionTarget = document.querySelector("[data-week-wizard-question]");
  const percent = document.querySelector("[data-week-wizard-percent]");
  const left = document.querySelector("[data-week-wizard-left]");
  const bar = document.querySelector("[data-week-wizard-bar]");
  const next = document.querySelector("[data-week-wizard-next]");
  const skip = document.querySelector("[data-week-wizard-skip]");
  const summary = document.querySelector("[data-week-summary]");
  if (!form || !questionTarget) return;

  const days = weekDates();
  const answers = {};
  const weekOptions = [
    ["light", "Light", "Easy, optimistic, or open"],
    ["steady", "Steady", "Balanced and predictable"],
    ["heavy", "Heavy", "Slow, tired, or recovery-focused"],
    ["restless", "Restless", "Busy, active, or high-energy"],
    ["tender", "Tender", "Soft, personal, or emotional"]
  ];
  let selectedAnswer = "";
  let step = 0;

  const updateProgress = () => {
    const completed = Math.min(step, days.length);
    const completion = Math.round((completed / days.length) * 100);
    if (percent) percent.textContent = `${completion}% complete`;
    if (left) {
      const remaining = days.length - completed;
      left.textContent = remaining === 1 ? "1 day left" : `${remaining} days left`;
    }
    if (bar) bar.style.width = `${completion}%`;
  };

  const saveWeek = () => {
    const analyzedDays = days.map((day, index) => {
      const synthetic = new FormData();
      const feeling = answers[index] || "steady";
      synthetic.set("feeling", feeling);
      synthetic.set("plans", feeling === "restless" ? "busy errands movement" : feeling === "heavy" ? "rest recover quiet" : "week plan");
      synthetic.set("need", feeling === "restless" ? "move" : feeling === "heavy" ? "settle" : "focus");
      synthetic.set("pace", "steady");
      synthetic.set("setting", "work");
      synthetic.set("company", "solo");
      synthetic.set("success", "make the day feel manageable");
      synthetic.set("mind", "");
      const analysis = analyzeDay(synthetic, day);
      return {
        ...day,
        analysis
      };
    });
    storageSet(storageKeys.checkMode, "week");
    if (analyzedDays[0]?.analysis) setJSON(storageKeys.analysis, analyzedDays[0].analysis);
    setJSON(storageKeys.weekAnalysis, {
      createdAt: new Date().toISOString(),
      weekOf: analyzedDays[0]?.stamp,
      days: analyzedDays
    });
    renderWeekSummary(analyzedDays);
    form.hidden = true;
    if (summary) {
      summary.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const renderStep = () => {
    const day = days[step];
    if (!day) {
      updateProgress();
      saveWeek();
      return;
    }
    questionTarget.innerHTML = `
      <p class="eyebrow">Day ${step + 1} of ${days.length}</p>
      <h2>What mood do you predict for ${day.weekday}?</h2>
      <div class="wizard-options">
        ${weekOptions.map(([value, label, hint]) => `
          <button class="wizard-option" type="button" data-week-answer="${escapeHTML(value)}">
            <strong>${escapeHTML(label)}</strong>
            <small>${escapeHTML(hint)}</small>
          </button>
        `).join("")}
      </div>
    `;
    selectedAnswer = "";
    updateProgress();
  };

  questionTarget.addEventListener("click", (event) => {
    const option = event.target.closest("[data-week-answer]");
    if (!option) return;
    selectedAnswer = option.dataset.weekAnswer;
    questionTarget.querySelectorAll("[data-week-answer]").forEach((button) => {
      button.classList.toggle("selected", button === option);
    });
  });

  const advance = (preferNot = false) => {
    answers[step] = preferNot ? "steady" : selectedAnswer || "steady";
    step += 1;
    renderStep();
  };

  next?.addEventListener("click", () => advance(false));
  skip?.addEventListener("click", () => advance(true));
  form.addEventListener("submit", (event) => event.preventDefault());
  renderStep();
}

function splitCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;
  for (const char of line) {
    if (char === "\"") quoted = !quoted;
    else if (char === "," && !quoted) cells.push(cell.trim()), cell = "";
    else cell += char;
  }
  cells.push(cell.trim());
  return cells;
}

function inferMood(song) {
  const haystack = normalize(`${song.title} ${song.artist} ${song.genre} ${song.activity}`);
  const match = Object.entries(moodHints).find(([, hints]) => hints.some((hint) => haystack.includes(hint)));
  return match?.[0] || song.mood || "reflective";
}

function inferEnergy(song) {
  const haystack = normalize(`${song.title} ${song.genre} ${song.activity}`);
  if (haystack.includes("sleep") || haystack.includes("ambient") || haystack.includes("acoustic") || haystack.includes("slow")) return "low";
  if (haystack.includes("dance") || haystack.includes("workout") || haystack.includes("electric") || haystack.includes("rock")) return "high";
  return song.energy || "medium";
}

function parsePlaylist(text) {
  const lines = String(text || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return [];

  let headers = ["title", "artist", "mood", "energy", "genre", "activity"];
  const firstCells = splitCsvLine(lines[0]).map(normalize);
  const hasHeaders = firstCells.some((cell) => headers.includes(cell));
  const dataLines = hasHeaders ? lines.slice(1) : lines;
  if (hasHeaders) headers = firstCells;

  return dataLines.map((line) => {
    const cells = splitCsvLine(line);
    const song = {};
    cells.forEach((cell, index) => {
      song[headers[index] || `field${index}`] = cell;
    });
    const normalizedSong = {
      title: song.title || song.track || song.song || cells[0] || "Untitled track",
      artist: song.artist || song.artists || song.creator || cells[1] || "Unknown artist",
      mood: normalize(song.mood),
      energy: normalize(song.energy),
      genre: normalize(song.genre),
      activity: normalize(song.activity)
    };
    normalizedSong.mood = normalizedSong.mood || inferMood(normalizedSong);
    normalizedSong.energy = ["low", "medium", "high"].includes(normalizedSong.energy) ? normalizedSong.energy : inferEnergy(normalizedSong);
    return normalizedSong;
  }).filter((song) => song.title && song.artist);
}

async function getPlaylistText() {
  const fileInput = document.querySelector("[data-playlist-file]");
  const pasteInput = document.querySelector("[data-playlist-text]");
  if (fileInput?.files?.[0]) return fileInput.files[0].text();
  return pasteInput?.value || "";
}

function setupImportContext() {
  const analysis = getStoredAnalysis();
  const word = document.querySelector("[data-import-word]");
  const day = document.querySelector("[data-import-day]");
  const context = document.querySelector("[data-import-context]");
  if (!analysis) return;
  if (word) word.textContent = analysis.word;
  if (day) day.textContent = `${analysis.weekday}, ${analysis.time} local time`;
  if (context) context.textContent = `Moodix will rank songs for a ${analysis.word.toLowerCase()} ${analysis.weekday}.`;
}

function getSpotifyClientId() {
  return window.MOODIX_SPOTIFY_CLIENT_ID || spotifyConfig.clientId;
}

function getSpotifyRedirectUri() {
  if (location.hostname === "johnny0103.github.io") return spotifyConfig.redirectUri;
  return `${location.origin}${location.pathname}`;
}

function randomString(length = 64) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join("");
}

function base64UrlEncode(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

async function sha256(value) {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
}

async function startSpotifyAuth() {
  const clientId = getSpotifyClientId();
  const status = document.querySelector("[data-spotify-status]");
  if (!clientId) {
    if (status) {
      status.innerHTML = "Spotify is ready, but it needs your Client ID first. Create a Spotify app, add the redirect URI below, then set <strong>window.MOODIX_SPOTIFY_CLIENT_ID</strong> or <strong>spotifyConfig.clientId</strong> in app.js.";
    }
    return;
  }

  const verifier = randomString();
  const state = randomString(24);
  storageSet(storageKeys.spotifyVerifier, verifier);
  storageSet(storageKeys.spotifyState, state);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: spotifyConfig.scopes.join(" "),
    redirect_uri: getSpotifyRedirectUri(),
    state,
    code_challenge_method: "S256",
    code_challenge: base64UrlEncode(await sha256(verifier))
  });
  location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

async function exchangeSpotifyCode(code) {
  const clientId = getSpotifyClientId();
  const verifier = storageGet(storageKeys.spotifyVerifier);
  if (!clientId || !verifier) throw new Error("Missing Spotify client configuration.");

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: getSpotifyRedirectUri(),
    code_verifier: verifier
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!response.ok) throw new Error("Spotify authorization failed.");
  const token = await response.json();
  setJSON(storageKeys.spotifyToken, {
    accessToken: token.access_token,
    expiresAt: Date.now() + (token.expires_in || 3600) * 1000,
    scope: token.scope || ""
  });
  storageRemove(storageKeys.spotifyVerifier);
  storageRemove(storageKeys.spotifyState);
  return token.access_token;
}

function getSpotifyAccessToken() {
  const token = getJSON(storageKeys.spotifyToken);
  if (!token?.accessToken || Date.now() > token.expiresAt) return null;
  return token.accessToken;
}

async function spotifyFetch(path) {
  const token = getSpotifyAccessToken();
  if (!token) throw new Error("Connect Spotify again to refresh access.");
  const response = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Spotify request failed.");
  return response.json();
}

function spotifyTrackToSong(item) {
  const track = item.track || item;
  return {
    title: track.name || "Untitled track",
    artist: track.artists?.map((artist) => artist.name).join(", ") || "Unknown artist",
    mood: "",
    energy: "",
    genre: "",
    activity: ""
  };
}

async function loadSpotifyPlaylist(playlistId) {
  const note = document.querySelector("[data-import-note]");
  const link = document.querySelector("[data-result-link]");
  const data = await spotifyFetch(`/playlists/${encodeURIComponent(playlistId)}/tracks?limit=100`);
  const tracks = (data.items || []).map(spotifyTrackToSong).filter((song) => song.title && song.artist);
  const normalized = tracks.map((song) => ({
    ...song,
    mood: inferMood(song),
    energy: inferEnergy(song)
  }));
  setJSON(storageKeys.tracks, normalized.length ? normalized : demoSongs);
  storageSet(storageKeys.source, "Spotify");
  if (note) note.innerHTML = `Imported <strong>${normalized.length || demoSongs.length}</strong> tracks from <strong>Spotify</strong>.`;
  link?.removeAttribute("hidden");
}

function renderSpotifyPlaylists(playlists) {
  const target = document.querySelector("[data-spotify-playlists]");
  if (!target) return;
  target.innerHTML = `
    <strong>Choose a Spotify playlist</strong>
    <div class="spotify-playlist-list">
      ${playlists.map((playlist) => `
        <button type="button" data-spotify-playlist="${escapeHTML(playlist.id)}">
          <span>${escapeHTML(playlist.name)}</span>
          <small>${playlist.tracks?.total || 0} tracks</small>
        </button>
      `).join("")}
    </div>
  `;
  target.hidden = false;
}

async function loadSpotifyPlaylists() {
  const status = document.querySelector("[data-spotify-status]");
  const data = await spotifyFetch("/me/playlists?limit=20");
  renderSpotifyPlaylists(data.items || []);
  if (status) status.textContent = "Spotify connected. Choose a playlist below to import tracks.";
}

async function setupSpotifyImport() {
  const connect = document.querySelector("[data-spotify-connect]");
  const status = document.querySelector("[data-spotify-status]");
  const playlistTarget = document.querySelector("[data-spotify-playlists]");
  if (!connect && !status && !playlistTarget) return;

  if (!getSpotifyClientId() && status) {
    status.innerHTML = "Spotify direct import needs a Client ID. Add your Spotify app Client ID in <strong>app.js</strong>, then this button will start PKCE authorization.";
  }

  connect?.addEventListener("click", startSpotifyAuth);
  playlistTarget?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-spotify-playlist]");
    if (!button) return;
    button.disabled = true;
    button.textContent = "Importing...";
    try {
      await loadSpotifyPlaylist(button.dataset.spotifyPlaylist);
    } catch (error) {
      if (status) status.textContent = error.message;
    }
  });

  const params = new URLSearchParams(location.search);
  const code = params.get("code");
  const state = params.get("state");
  if (code) {
    try {
      if (state !== storageGet(storageKeys.spotifyState)) throw new Error("Spotify state check failed. Try connecting again.");
      if (status) status.textContent = "Finishing Spotify connection...";
      await exchangeSpotifyCode(code);
      history.replaceState({}, "", location.pathname);
      await loadSpotifyPlaylists();
    } catch (error) {
      if (status) status.textContent = error.message;
    }
    return;
  }

  if (getSpotifyAccessToken()) {
    try {
      await loadSpotifyPlaylists();
    } catch (error) {
      if (status) status.textContent = error.message;
    }
  }
}

function setupSourceChips() {
  const chips = document.querySelectorAll("[data-source]");
  const label = document.querySelector("[data-selected-source]");
  const note = document.querySelector("[data-auth-note]");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((item) => item.classList.toggle("active", item === chip));
      if (label) label.textContent = chip.dataset.source;
      storageSet(storageKeys.source, chip.dataset.source);
      if (note) note.textContent = chip.dataset.source === "Spotify"
        ? "Spotify selected. Use the direct import card once your Client ID is configured, or save playlist rows manually."
        : `${chip.dataset.source} selected. This provider is guidance-only in this static prototype; save playlist rows to continue.`;
    });
  });
}

async function saveImport() {
  const note = document.querySelector("[data-import-note]");
  const link = document.querySelector("[data-result-link]");
  const tracks = parsePlaylist(await getPlaylistText());
  const selected = storageGet(storageKeys.source) || "Spotify";
  setJSON(storageKeys.tracks, tracks.length ? tracks : demoSongs);
  if (note) note.innerHTML = `Saved <strong>${tracks.length || demoSongs.length}</strong> tracks from <strong>${selected}</strong> for today's result.`;
  link?.removeAttribute("hidden");
}

function scoreSong(song, analysis) {
  const profile = analysis?.profile || wordProfiles.Reflective;
  let score = 48;
  if (profile.moods.includes(song.mood)) score += 28;
  if (song.energy === profile.energy) score += 18;
  if (profile.activities.some((activity) => song.activity.includes(activity))) score += 12;
  if (normalize(song.genre).includes("ambient") && analysis?.word === "Restorative") score += 8;
  if (normalize(song.genre).includes("dance") && ["Bright", "Electric"].includes(analysis?.word)) score += 8;
  if (normalize(song.genre).includes("electronic") && analysis?.word === "Focused") score += 5;
  return Math.min(99, score);
}

function reasonFor(song, analysis, fallback) {
  const word = analysis?.word || "Reflective";
  const profile = analysis?.profile || wordProfiles.Reflective;
  if (profile.moods.includes(song.mood) && song.energy === profile.energy) return `Fits a ${word.toLowerCase()} day with ${song.energy} energy.`;
  if (profile.moods.includes(song.mood)) return "Matches the emotional color Moodix inferred for today.";
  if (profile.activities.some((activity) => song.activity.includes(activity))) return "Works for the kind of day you described.";
  return fallback ? "Discovery pick added to complete the top five." : "Closest useful match from your playlist.";
}

function rankSongs(songs, analysis) {
  return (songs.length ? songs : demoSongs)
    .map((song) => ({ ...song, score: scoreSong(song, analysis), fallback: !songs.length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function renderTopFive(songs, analysis) {
  const grid = document.querySelector("[data-results-grid]");
  if (!grid) return;
  grid.innerHTML = `
    <article class="result-card feature-result">
      <div class="result-card-top">
        <div>
          <span>${analysis?.word || "Reflective"} / today</span>
          <h3>Top five songs</h3>
        </div>
        <strong>${analysis?.profile?.energy || "medium"}</strong>
      </div>
      <ol class="song-list">
        ${songs.map((song) => `
          <li>
            <span class="song-rank">${song.score}</span>
            <div>
              <strong>${song.title}</strong>
              <small>${song.artist}</small>
              <p>${reasonFor(song, analysis, song.fallback)}</p>
            </div>
          </li>
        `).join("")}
      </ol>
    </article>
  `;
  grid.hidden = false;
  document.querySelector("[data-after-results]")?.removeAttribute("hidden");
}

function setupResultPage() {
  const word = document.querySelector("[data-result-word]");
  const summary = document.querySelector("[data-result-summary]");
  const reveal = document.querySelector("[data-reveal-songs]");
  if (!word || !summary || !reveal) return;

  const analysis = getStoredAnalysis() || {
    word: "Reflective",
    detail: "Moodix needs today's mood check for a sharper result.",
    weekday: getLocalDayMeta().weekday,
    profile: wordProfiles.Reflective
  };
  const tracks = getJSON(storageKeys.tracks, demoSongs);
  word.textContent = analysis.word;
  summary.textContent = analysis.detail || `${analysis.weekday} reads as ${analysis.word.toLowerCase()}.`;
  reveal.addEventListener("click", () => {
    renderTopFive(rankSongs(tracks, analysis), analysis);
    reveal.hidden = true;
  });
}

function setupIntentButtons() {
  const buttons = document.querySelectorAll("[data-intent]");
  const field = document.querySelector("[data-intent-field]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      if (field) field.value = button.dataset.intent;
    });
  });
}

function setupSignup() {
  const form = document.querySelector("[data-signup-form]");
  const note = document.querySelector("[data-signup-note]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    if (!formData.get("email")) {
      note.textContent = "Add an email address so Moodix can invite you.";
      return;
    }
    const signups = getJSON(storageKeys.waitlist, []);
    signups.push({
      name: formData.get("name") || "",
      email: formData.get("email"),
      source: formData.get("source") || "Spotify",
      intent: formData.get("intent") || "yes",
      dayWord: getStoredAnalysis()?.word || "",
      createdAt: new Date().toISOString()
    });
    setJSON(storageKeys.waitlist, signups);
    form.reset();
    note.textContent = "Thanks for joining. Start your music adventure.";
  });
}

function setupScrollBoost() {
  if (!document.body.matches("[data-scroll-boost]")) return;
  const boostZone = () => window.innerHeight * 2.2;
  const formSelector = "input, textarea, select, button, [contenteditable='true']";
  window.addEventListener("wheel", (event) => {
    if (event.ctrlKey || Math.abs(event.deltaY) < 1 || window.scrollY > boostZone()) return;
    if (event.target.closest(formSelector)) return;
    event.preventDefault();
    window.scrollBy({
      top: event.deltaY * 1.9,
      left: 0,
      behavior: "auto"
    });
  }, { passive: false });
}

setupLogoPicker();
setupLocalTime();
setupSignin();
requireSignin();
setupScrollBoost();
setupDateIntro();
setupDayForm();
setupMoodMode();
setupWeekForm();
setupImportContext();
setupSpotifyImport();
setupSourceChips();
setupIntentButtons();
setupSignup();
setupResultPage();

document.querySelector("[data-save-import]")?.addEventListener("click", saveImport);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js?v=16").catch(() => {});
  });
}
