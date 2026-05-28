const storageKeys = {
  user: "moodix_user",
  analysis: "moodix_day_analysis",
  source: "moodix_music_source",
  tracks: "moodix_playlist_tracks",
  logo: "moodix_logo_choice",
  waitlist: "moodix_app_waitlist"
};

const memoryStorage = {};

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
  const user = getUser();

  if (user) {
    document.body.classList.add("is-signed-in");
    document.querySelector("[data-signed-in-note]")?.replaceChildren(`Signed in as ${user.name || user.email}. Choose a step below.`);
    document.querySelectorAll("[data-step-link]").forEach((link) => link.classList.remove("locked"));
    if (note) note.textContent = "You are signed in for this prototype.";
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
    document.querySelector("[data-signed-in-note]")?.replaceChildren(`Signed in as ${userData.name || userData.email}. Choose a step below.`);
    note.textContent = "Signed in. Start with Mood check.";
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

function analyzeDay(formData) {
  const meta = getLocalDayMeta();
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
  if (!form || !card) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const analysis = analyzeDay(new FormData(form));
    setJSON(storageKeys.analysis, analysis);
    document.querySelector("[data-day-word]").textContent = analysis.word;
    document.querySelector("[data-day-summary]").textContent = `${analysis.weekday} reads as ${analysis.word.toLowerCase()}. Moodix saved this for ${analysis.date}.`;
    document.querySelector("[data-analysis-detail]").textContent = analysis.detail;
    card.hidden = false;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
  });
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

function setupSourceChips() {
  const chips = document.querySelectorAll("[data-source]");
  const label = document.querySelector("[data-selected-source]");
  const note = document.querySelector("[data-auth-note]");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((item) => item.classList.toggle("active", item === chip));
      if (label) label.textContent = chip.dataset.source;
      storageSet(storageKeys.source, chip.dataset.source);
      if (note) note.textContent = `${chip.dataset.source} selected. Authorization is simulated in this static prototype; save playlist rows to continue.`;
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

setupLogoPicker();
setupLocalTime();
setupSignin();
requireSignin();
setupDayForm();
setupImportContext();
setupSourceChips();
setupIntentButtons();
setupSignup();
setupResultPage();

document.querySelector("[data-save-import]")?.addEventListener("click", saveImport);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
