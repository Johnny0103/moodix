const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const moods = ["happy", "calm", "sad", "focused", "stressed", "romantic", "energetic", "reflective"];
const energies = ["low", "medium", "high"];
const activities = ["morning", "commute", "work", "study", "workout", "unwind", "sleep"];
const shifts = ["lift me up", "keep me steady", "help me focus", "let me feel it", "cool me down"];

const demoSongs = [
  { title: "Blinding Lights", artist: "The Weeknd", mood: "energetic", energy: "high", genre: "synthpop", activity: "commute" },
  { title: "Sunflower", artist: "Post Malone and Swae Lee", mood: "happy", energy: "medium", genre: "pop", activity: "morning" },
  { title: "Weightless", artist: "Marconi Union", mood: "calm", energy: "low", genre: "ambient", activity: "sleep" },
  { title: "Good Days", artist: "SZA", mood: "reflective", energy: "medium", genre: "r&b", activity: "unwind" },
  { title: "Levitating", artist: "Dua Lipa", mood: "happy", energy: "high", genre: "dance", activity: "workout" },
  { title: "Nights", artist: "Frank Ocean", mood: "reflective", energy: "medium", genre: "alternative", activity: "night" },
  { title: "Electric Feel", artist: "MGMT", mood: "energetic", energy: "high", genre: "indie", activity: "weekend" },
  { title: "Pink + White", artist: "Frank Ocean", mood: "romantic", energy: "low", genre: "r&b", activity: "unwind" },
  { title: "Midnight City", artist: "M83", mood: "energetic", energy: "high", genre: "electronic", activity: "commute" },
  { title: "Holocene", artist: "Bon Iver", mood: "reflective", energy: "low", genre: "folk", activity: "morning" },
  { title: "Dog Days Are Over", artist: "Florence + The Machine", mood: "happy", energy: "high", genre: "indie", activity: "workout" },
  { title: "Intro", artist: "The xx", mood: "focused", energy: "medium", genre: "indie electronic", activity: "work" }
];

const moodHints = {
  happy: ["happy", "sun", "gold", "smile", "dance", "good", "bright", "sweet"],
  calm: ["calm", "soft", "quiet", "sleep", "peace", "ocean", "slow", "weightless"],
  sad: ["sad", "blue", "alone", "rain", "cry", "lost", "hurt", "tears"],
  focused: ["focus", "work", "study", "deep", "intro", "mind", "steady", "drive"],
  stressed: ["stress", "rush", "heavy", "pressure", "tired", "nervous", "burn"],
  romantic: ["love", "heart", "pink", "kiss", "sweet", "close", "moon", "white"],
  energetic: ["electric", "light", "fire", "run", "night", "power", "alive", "levitating"],
  reflective: ["midnight", "memory", "days", "dream", "nights", "home", "past", "think"]
};

const shiftMoodMap = {
  "lift me up": ["happy", "energetic"],
  "keep me steady": ["calm", "reflective"],
  "help me focus": ["focused", "calm"],
  "let me feel it": ["sad", "reflective", "romantic"],
  "cool me down": ["calm", "low", "reflective"]
};

function optionMarkup(items, selected) {
  return items.map((item) => `<option value="${item}"${item === selected ? " selected" : ""}>${item}</option>`).join("");
}

function createMoodCards() {
  const form = document.querySelector("[data-mood-form]");
  if (!form) {
    return;
  }

  form.innerHTML = weekdays.map((day, index) => {
    const defaultMood = moods[index % moods.length];
    const defaultEnergy = index === 4 || index === 5 ? "high" : index === 6 ? "low" : "medium";
    const defaultActivity = activities[index % activities.length];
    const defaultShift = shifts[index % shifts.length];

    return `
      <article class="day-card">
        <div class="day-card-top">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <h3>${day}</h3>
        </div>
        <label for="${day}-mood">Mood</label>
        <select id="${day}-mood" name="${day}-mood">${optionMarkup(moods, defaultMood)}</select>
        <label for="${day}-energy">Energy</label>
        <select id="${day}-energy" name="${day}-energy">${optionMarkup(energies, defaultEnergy)}</select>
        <label for="${day}-activity">Main activity</label>
        <select id="${day}-activity" name="${day}-activity">${optionMarkup(activities, defaultActivity)}</select>
        <label for="${day}-shift">Music should</label>
        <select id="${day}-shift" name="${day}-shift">${optionMarkup(shifts, defaultShift)}</select>
      </article>
    `;
  }).join("");
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function splitCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;

  for (const char of line) {
    if (char === "\"") {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += char;
    }
  }

  cells.push(cell.trim());
  return cells;
}

function inferMood(song) {
  const haystack = normalize(`${song.title} ${song.artist} ${song.genre}`);
  const match = moods.find((mood) => moodHints[mood].some((hint) => haystack.includes(hint)));
  return match || song.mood || "reflective";
}

function inferEnergy(song) {
  const haystack = normalize(`${song.title} ${song.genre} ${song.activity}`);
  if (haystack.includes("sleep") || haystack.includes("ambient") || haystack.includes("acoustic") || haystack.includes("slow")) {
    return "low";
  }
  if (haystack.includes("dance") || haystack.includes("workout") || haystack.includes("electric") || haystack.includes("rock")) {
    return "high";
  }
  return song.energy || "medium";
}

function parsePlaylist(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return [];
  }

  let headers = ["title", "artist", "mood", "energy", "genre", "activity"];
  const firstCells = splitCsvLine(lines[0]).map(normalize);
  const hasHeaders = firstCells.some((cell) => headers.includes(cell));
  const dataLines = hasHeaders ? lines.slice(1) : lines;

  if (hasHeaders) {
    headers = firstCells;
  }

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

    normalizedSong.mood = moods.includes(normalizedSong.mood) ? normalizedSong.mood : inferMood(normalizedSong);
    normalizedSong.energy = energies.includes(normalizedSong.energy) ? normalizedSong.energy : inferEnergy(normalizedSong);
    return normalizedSong;
  }).filter((song) => song.title && song.artist);
}

function getWeekProfile() {
  const form = document.querySelector("[data-mood-form]");
  const data = new FormData(form);

  return weekdays.map((day) => ({
    day,
    mood: data.get(`${day}-mood`) || "reflective",
    energy: data.get(`${day}-energy`) || "medium",
    activity: data.get(`${day}-activity`) || "unwind",
    shift: data.get(`${day}-shift`) || "keep me steady"
  }));
}

function scoreSong(song, dayProfile) {
  let score = 52;
  const targetShiftMoods = shiftMoodMap[dayProfile.shift] || [];

  if (song.mood === dayProfile.mood) score += 28;
  if (targetShiftMoods.includes(song.mood)) score += 18;
  if (song.energy === dayProfile.energy) score += 18;
  if (song.activity && dayProfile.activity && song.activity.includes(dayProfile.activity)) score += 12;
  if (song.genre && normalize(dayProfile.activity).includes("workout") && song.genre.includes("dance")) score += 7;
  if (song.genre && normalize(dayProfile.activity).includes("study") && song.genre.includes("ambient")) score += 7;

  return Math.min(99, score);
}

function reasonFor(song, dayProfile, fallback) {
  if (song.mood === dayProfile.mood && song.energy === dayProfile.energy) {
    return `Matches your ${dayProfile.mood} mood with ${dayProfile.energy} energy.`;
  }
  if ((shiftMoodMap[dayProfile.shift] || []).includes(song.mood)) {
    return `A strong fit when the music should ${dayProfile.shift}.`;
  }
  if (song.activity && song.activity.includes(dayProfile.activity)) {
    return `Works well for ${dayProfile.activity} time.`;
  }
  return fallback ? "Discovery pick added to complete the daily five." : `Closest match from your imported playlist.`;
}

function rankSongs(songs, dayProfile) {
  const availableSongs = songs.length ? songs : demoSongs;
  const ranked = availableSongs
    .map((song) => ({ ...song, score: scoreSong(song, dayProfile), fallback: !songs.length }))
    .sort((a, b) => b.score - a.score);

  const top = ranked.slice(0, 5);
  let demoIndex = 0;

  while (top.length < 5) {
    const demo = demoSongs[demoIndex % demoSongs.length];
    if (!top.some((song) => song.title === demo.title && song.artist === demo.artist)) {
      top.push({ ...demo, score: scoreSong(demo, dayProfile), fallback: true });
    }
    demoIndex += 1;
  }

  return top;
}

async function getPlaylistText() {
  const fileInput = document.querySelector("[data-playlist-file]");
  const pasteInput = document.querySelector("[data-playlist-text]");

  if (fileInput?.files?.[0]) {
    return fileInput.files[0].text();
  }

  return pasteInput?.value || "";
}

function renderResults(results) {
  const grid = document.querySelector("[data-results-grid]");
  const summary = document.querySelector("[data-results-summary]");
  if (!grid) {
    return;
  }

  grid.innerHTML = results.map(({ profile, songs }) => `
    <article class="result-card">
      <div class="result-card-top">
        <div>
          <span>${profile.mood} / ${profile.energy}</span>
          <h3>${profile.day}</h3>
        </div>
        <strong>${profile.activity}</strong>
      </div>
      <ol class="song-list">
        ${songs.map((song) => `
          <li>
            <span class="song-rank">${song.score}</span>
            <div>
              <strong>${song.title}</strong>
              <small>${song.artist}</small>
              <p>${reasonFor(song, profile, song.fallback)}</p>
            </div>
          </li>
        `).join("")}
      </ol>
    </article>
  `).join("");

  if (summary) {
    summary.textContent = "Moodix found top-five matches for every day of your week.";
  }
}

async function generateResults() {
  const note = document.querySelector("[data-import-note]");
  const playlistText = await getPlaylistText();
  const parsedSongs = parsePlaylist(playlistText);
  const weekProfile = getWeekProfile();
  const results = weekProfile.map((profile) => ({ profile, songs: rankSongs(parsedSongs, profile) }));

  try {
    localStorage.setItem("moodix_week_profile", JSON.stringify(weekProfile));
    localStorage.setItem("moodix_last_playlist_count", String(parsedSongs.length));
  } catch (error) {
    console.info("Moodix prototype storage is unavailable.", error);
  }

  renderResults(results);

  if (note) {
    note.innerHTML = parsedSongs.length
      ? `Imported <strong>${parsedSongs.length}</strong> tracks for prototype matching.`
      : "No usable tracks found, so Moodix used demo songs to show the experience.";
  }

  document.querySelector("#results")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setupSourceChips() {
  const chips = document.querySelectorAll("[data-source]");
  const label = document.querySelector("[data-selected-source]");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((item) => item.classList.toggle("active", item === chip));
      if (label) {
        label.textContent = chip.dataset.source;
      }
    });
  });
}

function setupSignup() {
  const form = document.querySelector("[data-signup-form]");
  const note = document.querySelector("[data-signup-note]");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const email = formData.get("email");

    if (!email) {
      note.textContent = "Add an email address so Moodix can invite you.";
      return;
    }

    const signup = {
      name: formData.get("name") || "",
      email,
      source: formData.get("source") || "Spotify",
      createdAt: new Date().toISOString()
    };

    try {
      const signups = JSON.parse(localStorage.getItem("moodix_app_waitlist") || "[]");
      signups.push(signup);
      localStorage.setItem("moodix_app_waitlist", JSON.stringify(signups));
    } catch (error) {
      console.info("Moodix signup storage is unavailable.", error);
    }

    form.reset();
    note.textContent = "Thanks for joining. Start your music adventure.";
  });
}

createMoodCards();
setupSourceChips();
setupSignup();

document.querySelector("[data-generate-results]")?.addEventListener("click", generateResults);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
