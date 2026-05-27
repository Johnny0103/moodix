const panelButtons = document.querySelectorAll("[data-panel]");
const panels = document.querySelectorAll(".panel");
const panelTitle = document.querySelector("[data-panel-title]");

const panelLabels = {
  today: "Today",
  meds: "Medication List",
  appointments: "Appointments",
  notes: "Family Notes"
};

panelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.panel;

    panelButtons.forEach((item) => item.classList.toggle("active", item === button));
    panels.forEach((panel) => panel.classList.toggle("active", panel.id === `panel-${target}`));
    panelTitle.textContent = panelLabels[target];
  });
});

function setWaitlistNote(form, message) {
  const nearbyNotes = [
    ...form.querySelectorAll("[data-form-note]"),
    ...(form.nextElementSibling?.matches("[data-form-note]") ? [form.nextElementSibling] : [])
  ];

  nearbyNotes.forEach((note) => {
    note.textContent = message;
  });
}

function captureWaitlistSignup(form) {
  const formData = new FormData(form);
  const email = formData.get("email");

  if (!email) {
    setWaitlistNote(form, "Add an email address so I know where to send early access.");
    return;
  }

  const signup = {
    name: formData.get("name") || "",
    email,
    role: formData.get("role") || "Founding family",
    createdAt: new Date().toISOString()
  };

  try {
    const signups = JSON.parse(localStorage.getItem("carecircle_waitlist") || "[]");
    signups.push(signup);
    localStorage.setItem("carecircle_waitlist", JSON.stringify(signups));
  } catch (error) {
    console.info("Waitlist storage is unavailable in this browser context.", error);
  }

  form.reset();
  setWaitlistNote(form, "You are on the list. I saved this signup locally for the prototype.");
}

document.querySelectorAll("[data-waitlist-form]").forEach((form) => {
  const submitButton = form.querySelector("button[type='submit'], button:not([type])");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    captureWaitlistSignup(form);
  });

  submitButton?.addEventListener("click", (event) => {
    event.preventDefault();
    captureWaitlistSignup(form);
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
