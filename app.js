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
  spotifyState: "moodix_spotify_state",
  youtubeToken: "moodix_youtube_token",
  lastfmUsername: "moodix_lastfm_username",
  lastfmApiKey: "moodix_lastfm_api_key"
};

const memoryStorage = {};
const audioProfiles = {
  Ambient: {
    tempo: 84,
    wave: "sine",
    volume: 0.064,
    melody: [329.63, 392.0, 493.88, 440.0],
    bass: [164.81, 196.0],
    chime: [659.25, 783.99]
  },
  Focused: {
    tempo: 76,
    wave: "triangle",
    volume: 0.074,
    melody: [261.63, 329.63, 392.0, 493.88],
    bass: [130.81, 164.81],
    chime: [523.25, 659.25]
  },
  Restorative: {
    tempo: 58,
    wave: "sine",
    volume: 0.059,
    melody: [293.66, 349.23, 440.0, 523.25],
    bass: [146.83, 174.61],
    chime: [587.33, 698.46]
  },
  Bright: {
    tempo: 104,
    wave: "triangle",
    volume: 0.078,
    melody: [329.63, 392.0, 493.88, 587.33],
    bass: [164.81, 196.0],
    chime: [659.25, 783.99]
  },
  Tender: {
    tempo: 66,
    wave: "sine",
    volume: 0.066,
    melody: [220.0, 277.18, 329.63, 415.3],
    bass: [110.0, 138.59],
    chime: [440.0, 554.37]
  },
  Electric: {
    tempo: 122,
    wave: "sawtooth",
    volume: 0.071,
    melody: [293.66, 369.99, 440.0, 587.33],
    bass: [146.83, 185.0],
    chime: [739.99, 880.0]
  },
  Grounded: {
    tempo: 72,
    wave: "triangle",
    volume: 0.071,
    melody: [196.0, 246.94, 293.66, 392.0],
    bass: [98.0, 123.47],
    chime: [392.0, 493.88]
  },
  Reflective: {
    tempo: 68,
    wave: "sine",
    volume: 0.066,
    melody: [246.94, 311.13, 369.99, 493.88],
    bass: [123.47, 155.56],
    chime: [493.88, 622.25]
  }
};
const spotifyConfig = {
  clientId: "",
  scopes: ["playlist-read-private", "playlist-read-collaborative"],
  redirectUri: "https://johnny0103.github.io/moodix/import.html"
};
const youtubeConfig = {
  clientId: "254918547608-dvk9124sjj7ckhnu76gnjhte9chea1o3.apps.googleusercontent.com",
  scopes: "https://www.googleapis.com/auth/youtube.readonly"
};
const lastfmConfig = {
  apiKey: "43489d760bd5d45de811456996ed8e5d"
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

const moodixAudio = (() => {
  let context = null;
  let master = null;
  let sfx = null;
  let filter = null;
  let timer = 0;
  let step = 0;
  let mood = "Ambient";
  let unlocked = false;
  let muted = false;
  let stoppedByUser = false;

  const getProfile = () => audioProfiles[mood] || audioProfiles.Ambient;

  const ensureContext = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (!context) {
      context = new AudioContext();
      master = context.createGain();
      sfx = context.createGain();
      filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 2200;
      master.gain.value = 0;
      sfx.gain.value = 0.23;
      filter.connect(master);
      master.connect(context.destination);
      sfx.connect(context.destination);
    }
    return context;
  };

  const fadeMaster = (target, seconds = 0.8) => {
    if (!context || !master) return;
    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.setTargetAtTime(target, context.currentTime, seconds / 4);
  };

  const playTone = (frequency, when, duration, type, gainValue) => {
    if (!context || !filter) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, when);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(Math.max(gainValue, 0.0002), when + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    oscillator.connect(gain);
    gain.connect(filter);
    oscillator.start(when);
    oscillator.stop(when + duration + 0.06);
  };

  const playPress = async () => {
    const ctx = ensureContext();
    if (!ctx || !sfx) return;
    if (ctx.state === "suspended") {
      await ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;
    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    const pop = ctx.createOscillator();
    const popGain = ctx.createGain();

    click.type = "triangle";
    click.frequency.setValueAtTime(780, now);
    click.frequency.exponentialRampToValueAtTime(420, now + 0.055);
    clickGain.gain.setValueAtTime(0.0001, now);
    clickGain.gain.exponentialRampToValueAtTime(0.105, now + 0.008);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

    pop.type = "sine";
    pop.frequency.setValueAtTime(190, now);
    pop.frequency.exponentialRampToValueAtTime(145, now + 0.08);
    popGain.gain.setValueAtTime(0.0001, now);
    popGain.gain.exponentialRampToValueAtTime(0.05, now + 0.012);
    popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    click.connect(clickGain);
    pop.connect(popGain);
    clickGain.connect(sfx);
    popGain.connect(sfx);
    click.start(now);
    pop.start(now);
    click.stop(now + 0.095);
    pop.stop(now + 0.11);
  };

  const scheduleLoop = () => {
    if (!context || muted) return;
    const profile = getProfile();
    const beat = 60 / profile.tempo;
    const now = context.currentTime + 0.05;
    const melody = profile.melody[step % profile.melody.length];
    const bass = profile.bass[Math.floor(step / 4) % profile.bass.length];

    playTone(melody, now, beat * 1.7, profile.wave, profile.volume);
    if (step % 4 === 0) playTone(bass, now, beat * 3.6, "sine", profile.volume * 0.9);
    if (step % 8 === 6) {
      profile.chime.forEach((frequency, index) => {
        playTone(frequency, now + index * 0.08, beat * 1.1, "sine", profile.volume * 0.45);
      });
    }
    step = (step + 1) % 16;
  };

  const start = async (nextMood = mood) => {
    mood = audioProfiles[nextMood] ? nextMood : "Ambient";
    if (stoppedByUser) return;
    if (muted) return;
    const ctx = ensureContext();
    if (!ctx) return;
    if (ctx.state === "suspended") await ctx.resume();
    unlocked = true;
    window.clearInterval(timer);
    step = 0;
    scheduleLoop();
    timer = window.setInterval(scheduleLoop, (60 / getProfile().tempo) * 1000);
    fadeMaster(getProfile().volume, 1.2);
    updateAudioToggle();
  };

  const stop = () => {
    muted = true;
    stoppedByUser = true;
    window.clearInterval(timer);
    fadeMaster(0, 0.5);
    updateAudioToggle();
  };

  const setMood = (nextMood) => {
    mood = audioProfiles[nextMood] ? nextMood : "Ambient";
    if (unlocked && !muted) start(mood);
  };

  const playTransition = async () => {
    if (stoppedByUser) return;
    muted = false;
    await start("Bright");
    if (!context) return;
    const now = context.currentTime;
    [392, 493.88, 659.25, 783.99, 987.77].forEach((frequency, index) => {
      playTone(frequency, now + index * 0.18, 0.38, "triangle", 0.065);
    });
    window.setTimeout(() => setMood(getStoredAnalysis()?.word || "Ambient"), 3000);
  };

  const toggle = async () => {
    if (muted || !unlocked) {
      stoppedByUser = false;
      muted = false;
      await start(mood);
    } else {
      stop();
    }
  };

  const state = () => ({ muted, unlocked, mood, stoppedByUser });
  return { start, stop, setMood, playTransition, playPress, toggle, state };
})();

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

function setupPressEffects() {
  const selector = [
    "button",
    ".button",
    ".header-cta",
    ".step-card",
    ".mode-choice",
    ".wizard-option",
    ".source-card",
    ".intent-button",
    ".audio-toggle"
  ].join(",");

  document.addEventListener("pointerdown", (event) => {
    const target = event.target.closest?.(selector);
    if (!target || target.disabled || target.getAttribute("aria-disabled") === "true") return;

    moodixAudio.playPress().catch(() => {});

    const rect = target.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "press-ripple";
    ripple.style.setProperty("--press-x", `${event.clientX - rect.left}px`);
    ripple.style.setProperty("--press-y", `${event.clientY - rect.top}px`);

    target.classList.add("is-pressing");
    target.append(ripple);
    window.setTimeout(() => target.classList.remove("is-pressing"), 180);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  });
}

function updateAudioToggle() {
  const button = document.querySelector("[data-audio-toggle]");
  if (!button) return;
  const state = moodixAudio.state();
  const isPlaying = state.unlocked && !state.muted && !state.stoppedByUser;
  button.hidden = !isPlaying;
  button.textContent = "Stop music";
  button.setAttribute("aria-pressed", String(isPlaying));
  button.dataset.audioState = state.muted ? "off" : "on";
}

function setupSiteAudio() {
  if (!document.body || document.querySelector("[data-audio-toggle]")) return;
  const button = document.createElement("button");
  button.className = "audio-toggle";
  button.type = "button";
  button.dataset.audioToggle = "true";
  button.setAttribute("aria-label", "Stop Moodix background music");
  button.hidden = true;
  document.body.append(button);
  updateAudioToggle();

  button.addEventListener("click", () => {
    moodixAudio.stop();
  });

  const preferredMood = () => getStoredAnalysis()?.word || document.querySelector("[data-result-word]")?.textContent?.trim() || "Ambient";
  const tryAutoplay = () => {
    moodixAudio.start(preferredMood()).catch(() => {});
  };
  const unlock = (event) => {
    if (event.target?.closest?.("[data-audio-toggle]")) return;
    moodixAudio.start(preferredMood());
  };
  tryAutoplay();
  document.addEventListener("DOMContentLoaded", tryAutoplay, { once: true });
  window.addEventListener("load", tryAutoplay, { once: true });
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
  window.addEventListener("wheel", unlock, { once: true });
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
      moodixAudio.playTransition();
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
  const skip = document.querySelector("[data-wizard-skip]");
  const back = document.querySelector("[data-wizard-back]");
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
      moodixAudio.setMood(analysis.word);
      card.hidden = false;
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return;
  }

  const answers = {};
  let selectedAnswer = "";
  let step = 0;
  let advanceTimer = 0;

  const saveAnalysis = () => {
    const synthetic = new FormData();
    moodQuestions.forEach((question) => synthetic.set(question.name, answers[question.name] || question.options[0][0]));
    const analysis = analyzeDay(synthetic);
    storageSet(storageKeys.checkMode, "today");
    setJSON(storageKeys.analysis, analysis);
    document.querySelector("[data-day-word]").textContent = analysis.word;
    document.querySelector("[data-day-summary]").textContent = `${analysis.weekday} reads as ${analysis.word.toLowerCase()}. Moodix saved this for ${analysis.date}.`;
    document.querySelector("[data-analysis-detail]").textContent = analysis.detail;
    moodixAudio.setMood(analysis.word);
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
    if (back) back.disabled = step === 0;
  };

  const renderStep = () => {
    const question = moodQuestions[step];
    if (!question) {
      updateProgress();
      saveAnalysis();
      return;
    }
    selectedAnswer = answers[question.name] || "";
    questionTarget.innerHTML = `
      <p class="eyebrow">Question ${step + 1} of ${moodQuestions.length}</p>
      <h2>${question.question}</h2>
      <div class="wizard-options">
        ${question.options.map(([value, label, hint]) => `
          <button class="wizard-option${selectedAnswer === value ? " selected" : ""}" type="button" data-answer="${escapeHTML(value)}">
            <strong>${escapeHTML(label)}</strong>
            <small>${escapeHTML(hint)}</small>
          </button>
        `).join("")}
      </div>
    `;
    updateProgress();
  };

  questionTarget.addEventListener("click", (event) => {
    const option = event.target.closest("[data-answer]");
    if (!option) return;
    selectedAnswer = option.dataset.answer;
    questionTarget.querySelectorAll("[data-answer]").forEach((button) => {
      button.classList.toggle("selected", button === option);
    });
    window.clearTimeout(advanceTimer);
    advanceTimer = window.setTimeout(() => advance(false), 220);
  });

  const advance = (preferNot = false) => {
    const question = moodQuestions[step];
    if (!question) return;
    answers[question.name] = preferNot ? question.options[0][0] : selectedAnswer || question.options[0][0];
    step += 1;
    renderStep();
  };

  skip?.addEventListener("click", () => advance(true));
  back?.addEventListener("click", () => {
    window.clearTimeout(advanceTimer);
    if (step === 0) return;
    step -= 1;
    selectedAnswer = answers[moodQuestions[step]?.name] || "";
    renderStep();
  });

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
  const skip = document.querySelector("[data-week-wizard-skip]");
  const back = document.querySelector("[data-week-wizard-back]");
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
  let advanceTimer = 0;

  const updateProgress = () => {
    const completed = Math.min(step, days.length);
    const completion = Math.round((completed / days.length) * 100);
    if (percent) percent.textContent = `${completion}% complete`;
    if (left) {
      const remaining = days.length - completed;
      left.textContent = remaining === 1 ? "1 day left" : `${remaining} days left`;
    }
    if (bar) bar.style.width = `${completion}%`;
    if (back) back.disabled = step === 0;
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
    if (analyzedDays[0]?.analysis?.word) moodixAudio.setMood(analyzedDays[0].analysis.word);
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
    selectedAnswer = answers[step] || "";
    questionTarget.innerHTML = `
      <p class="eyebrow">Day ${step + 1} of ${days.length}</p>
      <h2>What mood do you predict for ${day.weekday}?</h2>
      <div class="wizard-options">
        ${weekOptions.map(([value, label, hint]) => `
          <button class="wizard-option${selectedAnswer === value ? " selected" : ""}" type="button" data-week-answer="${escapeHTML(value)}">
            <strong>${escapeHTML(label)}</strong>
            <small>${escapeHTML(hint)}</small>
          </button>
        `).join("")}
      </div>
    `;
    updateProgress();
  };

  questionTarget.addEventListener("click", (event) => {
    const option = event.target.closest("[data-week-answer]");
    if (!option) return;
    selectedAnswer = option.dataset.weekAnswer;
    questionTarget.querySelectorAll("[data-week-answer]").forEach((button) => {
      button.classList.toggle("selected", button === option);
    });
    window.clearTimeout(advanceTimer);
    advanceTimer = window.setTimeout(() => advance(false), 220);
  });

  const advance = (preferNot = false) => {
    answers[step] = preferNot ? "steady" : selectedAnswer || "steady";
    step += 1;
    renderStep();
  };

  skip?.addEventListener("click", () => advance(true));
  back?.addEventListener("click", () => {
    window.clearTimeout(advanceTimer);
    if (step === 0) return;
    step -= 1;
    selectedAnswer = answers[step] || "";
    renderStep();
  });
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

function getYouTubeClientId() {
  return window.MOODIX_YOUTUBE_CLIENT_ID || youtubeConfig.clientId;
}

function getYouTubeAccessToken() {
  const token = getJSON(storageKeys.youtubeToken);
  if (!token?.accessToken || Date.now() > token.expiresAt) return null;
  return token.accessToken;
}

function setYouTubeAccessToken(accessToken, expiresIn) {
  setJSON(storageKeys.youtubeToken, {
    accessToken,
    expiresAt: Date.now() + (expiresIn || 3600) * 1000
  });
}

async function youtubeFetch(path, params = {}) {
  const token = getYouTubeAccessToken();
  if (!token) throw new Error("Connect YouTube again to refresh access.");
  const query = new URLSearchParams(params);
  const response = await fetch(`https://www.googleapis.com/youtube/v3/${path}?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error?.message || "YouTube request failed.";
    if (/channel not found/i.test(message)) {
      throw new Error("YouTube channel not found for this Google account. Open YouTube once with this account, create/activate a channel, add at least one playlist, then reconnect Moodix.");
    }
    throw new Error(`${message} Check YouTube Data API access and OAuth test-user settings.`);
  }
  return data;
}

async function youtubeFetchAll(path, params = {}, limit = 100) {
  const items = [];
  let pageToken = "";
  do {
    const data = await youtubeFetch(path, {
      ...params,
      maxResults: String(Math.min(50, limit - items.length)),
      ...(pageToken ? { pageToken } : {})
    });
    items.push(...(data.items || []));
    pageToken = data.nextPageToken || "";
  } while (pageToken && items.length < limit);
  return items;
}

function youtubeItemToSong(item) {
  const snippet = item.snippet || {};
  return {
    title: snippet.title || "Untitled track",
    artist: snippet.videoOwnerChannelTitle || snippet.channelTitle || "YouTube",
    mood: "",
    energy: "",
    genre: "youtube",
    activity: ""
  };
}

function normalizeImportedTracks(tracks) {
  return tracks
    .filter((song) => song.title && song.artist && !/deleted video|private video/i.test(song.title))
    .map((song) => ({
      ...song,
      mood: song.mood || inferMood(song),
      energy: song.energy || inferEnergy(song),
      genre: normalize(song.genre),
      activity: normalize(song.activity)
    }));
}

async function loadYouTubePlaylist(playlistId) {
  const note = document.querySelector("[data-import-note]");
  const link = document.querySelector("[data-result-link]");
  const items = await youtubeFetchAll("playlistItems", {
    part: "snippet",
    playlistId
  }, 100);
  const tracks = normalizeImportedTracks(items.map(youtubeItemToSong));
  setJSON(storageKeys.tracks, tracks.length ? tracks : demoSongs);
  storageSet(storageKeys.source, "YouTube Music");
  if (note) note.innerHTML = `Imported <strong>${tracks.length || demoSongs.length}</strong> tracks from <strong>YouTube</strong>.`;
  link?.removeAttribute("hidden");
}

function renderYouTubePlaylists(playlists) {
  const target = document.querySelector("[data-youtube-playlists]");
  if (!target) return;
  target.innerHTML = `
    <strong>Choose a YouTube playlist</strong>
    <div class="provider-playlist-list">
      ${playlists.map((playlist) => `
        <button type="button" data-youtube-playlist="${escapeHTML(playlist.id)}">
          <span>${escapeHTML(playlist.snippet?.title || "Untitled playlist")}</span>
          <small>${playlist.contentDetails?.itemCount || 0} tracks</small>
        </button>
      `).join("")}
    </div>
  `;
  target.hidden = false;
}

async function loadYouTubePlaylists() {
  const status = document.querySelector("[data-youtube-status]");
  const items = await youtubeFetchAll("playlists", {
    part: "snippet,contentDetails",
    mine: "true"
  }, 50);
  renderYouTubePlaylists(items);
  if (status) status.textContent = "YouTube connected. Choose a playlist below to import tracks.";
}

function startYouTubeAuth() {
  const status = document.querySelector("[data-youtube-status]");
  const clientId = getYouTubeClientId();
  if (!clientId) {
    if (status) {
      status.innerHTML = "YouTube direct import needs a Google OAuth Client ID. Add it to <strong>youtubeConfig.clientId</strong> in app.js, then add <strong>https://johnny0103.github.io</strong> as the authorized JavaScript origin in Google Cloud.";
    }
    return;
  }
  if (!window.google?.accounts?.oauth2) {
    if (status) status.textContent = "Google sign-in script is still loading. Try again in a second.";
    return;
  }
  const client = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: youtubeConfig.scopes,
    callback: async (response) => {
      if (response.error) {
        if (status) {
          status.textContent = response.error === "access_denied"
            ? "Google denied access. While Moodix is unverified, add your Google account as a test user in Google Cloud, then try again."
            : response.error;
        }
        return;
      }
      setYouTubeAccessToken(response.access_token, response.expires_in);
      try {
        await loadYouTubePlaylists();
      } catch (error) {
        if (status) status.textContent = error.message;
      }
    }
  });
  client.requestAccessToken();
}

function setupYouTubeImport() {
  const connect = document.querySelector("[data-youtube-connect]");
  const status = document.querySelector("[data-youtube-status]");
  const playlistTarget = document.querySelector("[data-youtube-playlists]");
  if (!connect && !status && !playlistTarget) return;

  if (!getYouTubeClientId() && status) {
    status.innerHTML = "YouTube import is ready for setup. Add a Google OAuth Client ID in <strong>app.js</strong> to let users connect playlists directly.";
  } else if (status && !getYouTubeAccessToken()) {
    status.textContent = "YouTube is configured. Connect your Google account to import playlists.";
  }

  connect?.addEventListener("click", startYouTubeAuth);
  playlistTarget?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-youtube-playlist]");
    if (!button) return;
    button.disabled = true;
    button.textContent = "Importing...";
    try {
      await loadYouTubePlaylist(button.dataset.youtubePlaylist);
    } catch (error) {
      if (status) status.textContent = error.message;
    }
  });

  if (getYouTubeAccessToken()) {
    loadYouTubePlaylists().catch((error) => {
      if (status) status.textContent = error.message;
    });
  }
}

function getLastfmApiKey() {
  return window.MOODIX_LASTFM_API_KEY || lastfmConfig.apiKey || storageGet(storageKeys.lastfmApiKey);
}

async function lastfmFetch(method, username) {
  const apiKey = getLastfmApiKey();
  if (!apiKey) throw new Error("Add a free Last.fm API key first. Paste it on this page for testing, or add it to lastfmConfig.apiKey before launch.");
  const params = new URLSearchParams({
    method,
    user: username,
    api_key: apiKey,
    format: "json",
    limit: "50"
  });
  let data;
  try {
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${params.toString()}`);
    if (!response.ok) throw new Error("Last.fm request failed.");
    data = await response.json();
  } catch (error) {
    data = await lastfmJsonp(params);
  }
  if (data.error) throw new Error(data.message || "Last.fm import failed.");
  return data;
}

function lastfmJsonp(params) {
  return new Promise((resolve, reject) => {
    const callback = `moodixLastfm${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => {
      delete window[callback];
      script.remove();
      reject(new Error("Last.fm request timed out."));
    }, 10000);
    window[callback] = (data) => {
      window.clearTimeout(timeout);
      delete window[callback];
      script.remove();
      resolve(data);
    };
    params.set("callback", callback);
    script.src = `https://ws.audioscrobbler.com/2.0/?${params.toString()}`;
    script.onerror = () => {
      window.clearTimeout(timeout);
      delete window[callback];
      script.remove();
      reject(new Error("Last.fm request failed."));
    };
    document.head.appendChild(script);
  });
}

function lastfmTrackToSong(track) {
  return {
    title: track.name || "Untitled track",
    artist: track.artist?.name || track.artist?.["#text"] || "Unknown artist",
    mood: "",
    energy: "",
    genre: "lastfm",
    activity: ""
  };
}

async function importLastfm(method) {
  const input = document.querySelector("[data-lastfm-username]");
  const status = document.querySelector("[data-lastfm-status]");
  const note = document.querySelector("[data-import-note]");
  const link = document.querySelector("[data-result-link]");
  const username = input?.value.trim() || storageGet(storageKeys.lastfmUsername);
  if (!username) {
    if (status) status.textContent = "Enter a Last.fm username first.";
    return;
  }
  storageSet(storageKeys.lastfmUsername, username);
  if (status) status.textContent = "Importing Last.fm tracks...";
  const data = await lastfmFetch(method, username);
  const list = method === "user.getlovedtracks"
    ? data.lovedtracks?.track
    : method === "user.getrecenttracks"
      ? data.recenttracks?.track
      : data.toptracks?.track;
  const tracks = normalizeImportedTracks((list || []).map(lastfmTrackToSong));
  setJSON(storageKeys.tracks, tracks.length ? tracks : demoSongs);
  storageSet(storageKeys.source, "Last.fm");
  if (status) status.textContent = `Imported ${tracks.length || demoSongs.length} tracks from Last.fm.`;
  if (note) note.innerHTML = `Imported <strong>${tracks.length || demoSongs.length}</strong> tracks from <strong>Last.fm</strong>.`;
  link?.removeAttribute("hidden");
}

function setupLastfmImport() {
  const input = document.querySelector("[data-lastfm-username]");
  const status = document.querySelector("[data-lastfm-status]");
  const top = document.querySelector("[data-lastfm-top]");
  const loved = document.querySelector("[data-lastfm-loved]");
  const recent = document.querySelector("[data-lastfm-recent]");
  const apiKeyInput = document.querySelector("[data-lastfm-api-key]");
  const saveKey = document.querySelector("[data-lastfm-save-key]");
  if (!input && !status && !top && !loved && !recent && !apiKeyInput && !saveKey) return;

  if (input) input.value = storageGet(storageKeys.lastfmUsername) || "";
  if (apiKeyInput) apiKeyInput.value = storageGet(storageKeys.lastfmApiKey) || "";
  if (!getLastfmApiKey() && status) {
    status.innerHTML = "Last.fm can import public listening history after you add a free API key. Paste it below for testing, or put it in <strong>lastfmConfig.apiKey</strong> in app.js before launch.";
  } else if (status) {
    status.textContent = "Last.fm is ready. Enter a public Last.fm username and choose Recent, Top, or Loved tracks.";
  }

  saveKey?.addEventListener("click", () => {
    const key = apiKeyInput?.value.trim();
    if (!key) {
      if (status) status.textContent = "Paste your Last.fm API key first.";
      return;
    }
    storageSet(storageKeys.lastfmApiKey, key);
    if (status) status.textContent = "Last.fm API key saved locally for this browser. Now enter a username and import.";
  });
  recent?.addEventListener("click", () => {
    importLastfm("user.getrecenttracks").catch((error) => {
      if (status) status.textContent = error.message;
    });
  });
  top?.addEventListener("click", () => {
    importLastfm("user.gettoptracks").catch((error) => {
      if (status) status.textContent = error.message;
    });
  });
  loved?.addEventListener("click", () => {
    importLastfm("user.getlovedtracks").catch((error) => {
      if (status) status.textContent = error.message;
    });
  });
}

function setupSourceChips() {
  const chips = document.querySelectorAll("[data-source]");
  const label = document.querySelector("[data-selected-source]");
  const note = document.querySelector("[data-auth-note]");
  const importNote = document.querySelector("[data-import-note]");
  const panels = document.querySelectorAll("[data-import-panel]");
  const hasImportPanels = panels.length > 0;

  const showImportPanel = (method) => {
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.importPanel !== method;
    });
  };

  const saved = storageGet(storageKeys.source);
  const active = hasImportPanels ? null : Array.from(chips).find((chip) => chip.dataset.source === saved) || Array.from(chips).find((chip) => chip.classList.contains("active"));
  if (active && !hasImportPanels) {
    chips.forEach((item) => item.classList.toggle("active", item === active));
    if (label) label.textContent = active.dataset.source;
    storageSet(storageKeys.source, active.dataset.source);
  }
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((item) => item.classList.toggle("active", item === chip));
      if (label) label.textContent = chip.dataset.source;
      storageSet(storageKeys.source, chip.dataset.source);
      if (chip.dataset.importMethod) showImportPanel(chip.dataset.importMethod);
      if (note) {
        if (chip.dataset.source === "YouTube Music") note.textContent = "YouTube selected. Connect Google, then choose a playlist.";
        else if (chip.dataset.source === "Last.fm") note.textContent = "Last.fm selected. Enter a username, then import recent, top, or loved tracks.";
        else if (chip.dataset.source === "Manual import") note.textContent = "Manual import selected. Add songs one by one or paste a list.";
        else note.textContent = `${chip.dataset.source} selected.`;
      }
      if (importNote) {
        if (chip.dataset.source === "YouTube Music") importNote.textContent = "YouTube selected. Connect Google to choose a playlist.";
        else if (chip.dataset.source === "Last.fm") importNote.textContent = "Last.fm selected. Enter a username to import listening history.";
        else if (chip.dataset.source === "Manual import") importNote.textContent = "Manual import selected. Add songs, then save.";
      }
    });
  });
}

function setupManualImport() {
  const title = document.querySelector("[data-manual-title]");
  const artist = document.querySelector("[data-manual-artist]");
  const vibe = document.querySelector("[data-manual-vibe]");
  const add = document.querySelector("[data-add-manual-song]");
  const save = document.querySelector("[data-save-manual-songs]");
  const list = document.querySelector("[data-manual-song-list]");
  const note = document.querySelector("[data-import-note]");
  const link = document.querySelector("[data-result-link]");
  if (!title && !artist && !add && !save && !list) return;

  const songs = [];
  const render = () => {
    if (!list) return;
    if (!songs.length) {
      list.innerHTML = "<p>No songs added yet.</p>";
      return;
    }
    list.innerHTML = `
      <strong>${songs.length} song${songs.length === 1 ? "" : "s"} added</strong>
      <ol>
        ${songs.map((song, index) => `
          <li>
            <span>${escapeHTML(song.title)} — ${escapeHTML(song.artist)}</span>
            <button type="button" data-remove-manual-song="${index}" aria-label="Remove ${escapeHTML(song.title)}">Remove</button>
          </li>
        `).join("")}
      </ol>
    `;
  };

  const addSong = () => {
    const nextTitle = title?.value.trim();
    const nextArtist = artist?.value.trim();
    if (!nextTitle || !nextArtist) {
      if (note) note.textContent = "Add both a song title and artist first.";
      return;
    }
    const song = {
      title: nextTitle,
      artist: nextArtist,
      mood: normalize(vibe?.value || ""),
      energy: "",
      genre: "manual",
      activity: ""
    };
    song.mood = song.mood || inferMood(song);
    song.energy = inferEnergy(song);
    songs.push(song);
    title.value = "";
    artist.value = "";
    if (vibe) vibe.value = "";
    if (note) note.textContent = "Song added. Add more or save your manual import.";
    render();
    title?.focus();
  };

  add?.addEventListener("click", addSong);
  [title, artist].forEach((field) => {
    field?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addSong();
      }
    });
  });
  list?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-manual-song]");
    if (!button) return;
    songs.splice(Number(button.dataset.removeManualSong), 1);
    render();
  });
  save?.addEventListener("click", () => {
    if (!songs.length) {
      if (note) note.textContent = "Add at least one song before saving.";
      return;
    }
    setJSON(storageKeys.tracks, songs);
    storageSet(storageKeys.source, "Manual import");
    if (note) note.innerHTML = `Saved <strong>${songs.length}</strong> manual song${songs.length === 1 ? "" : "s"}.`;
    link?.removeAttribute("hidden");
  });
  render();
}

async function saveImport() {
  const note = document.querySelector("[data-import-note]");
  const link = document.querySelector("[data-result-link]");
  const tracks = parsePlaylist(await getPlaylistText());
  const selected = storageGet(storageKeys.source) || "Manual import";
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
  moodixAudio.setMood(analysis.word);
  reveal.addEventListener("click", () => {
    renderTopFive(rankSongs(tracks, analysis), analysis);
    reveal.hidden = true;
  });
}

function setupIntentButtons() {
  const buttons = document.querySelectorAll("[data-intent]");
  const field = document.querySelector("[data-intent-field]");
  const summary = document.querySelector("[data-intent-summary]");
  const summaries = {
    yes: {
      title: "Early access",
      body: "You want to try the app version first, including smoother Spotify import when it becomes available."
    },
    maybe: {
      title: "Send updates",
      body: "You are interested, but want progress notes before joining. Moodix can send updates when app features are ready."
    },
    later: {
      title: "Later",
      body: "No pressure. Moodix will keep the website version simple while the app version develops in the background."
    }
  };

  const renderSummary = (intent) => {
    if (!summary) return;
    const next = summaries[intent] || summaries.yes;
    summary.innerHTML = `
      <strong>${next.title}</strong>
      <p>${next.body}</p>
    `;
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      if (field) field.value = button.dataset.intent;
      renderSummary(button.dataset.intent);
    });
  });
  renderSummary(field?.value || "yes");
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
  const signin = document.querySelector("#signin");
  const formSelector = "input, textarea, select, button, [contenteditable='true']";
  let turningPage = false;

  const turnToSignin = () => {
    if (!signin || turningPage) return;
    turningPage = true;
    signin.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      turningPage = false;
    }, 900);
  };

  window.addEventListener("wheel", (event) => {
    if (event.ctrlKey || Math.abs(event.deltaY) < 1) return;
    if (event.target.closest?.(formSelector)) return;
    if (event.deltaY > 0 && window.scrollY < window.innerHeight * 0.25) {
      event.preventDefault();
      turnToSignin();
      return;
    }
    if (event.deltaY < 0 && window.scrollY < window.innerHeight * 1.35) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
  }, { passive: false });

  window.addEventListener("touchstart", (event) => {
    window.moodixTouchStart = event.touches?.[0]?.clientY || 0;
  }, { passive: true });

  window.addEventListener("touchmove", (event) => {
    if (event.target.closest?.(formSelector)) return;
    const start = window.moodixTouchStart || 0;
    const current = event.touches?.[0]?.clientY || start;
    const distance = start - current;
    if (distance > 18 && window.scrollY < window.innerHeight * 0.25) {
      event.preventDefault();
      turnToSignin();
    }
  }, { passive: false });
}

setupLogoPicker();
setupLocalTime();
setupPressEffects();
setupSiteAudio();
setupSignin();
requireSignin();
setupScrollBoost();
setupDateIntro();
setupDayForm();
setupMoodMode();
setupWeekForm();
setupImportContext();
setupYouTubeImport();
setupLastfmImport();
setupSourceChips();
setupManualImport();
setupIntentButtons();
setupSignup();
setupResultPage();

document.querySelector("[data-save-import]")?.addEventListener("click", saveImport);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js?v=45").catch(() => {});
  });
}
