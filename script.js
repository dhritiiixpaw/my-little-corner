// My Little Corner ♡ — interactive features live here.
const $ = (selector) => document.querySelector(selector);

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

// Mood picker
const moodMessages = {
  happy: "Let yourself enjoy this little bit of sunshine ☀️",
  calm: "You deserve this peaceful little moment 🌿",
  tired: "Rest is productive, too. Be gentle with yourself 🩷",
  meh: "You don't have to sparkle every single day. ♡"
};
$("#moods").addEventListener("click", (event) => {
  const button = event.target.closest("[data-mood]");
  if (!button) return;
  document.querySelectorAll(".mood").forEach((item) => item.classList.remove("selected"));
  button.classList.add("selected");
  $("#moodMessage").textContent = moodMessages[button.dataset.mood];
});

// To-do list
const todoForm = $("#todoForm"), todoInput = $("#todoInput"), todoList = $("#todoList");
let tasks = [];
try {
  tasks = JSON.parse(localStorage.getItem("mlc-tasks") || "[]");
  if (!Array.isArray(tasks)) tasks = [];
} catch { tasks = []; }

function saveTasks() {
  try { localStorage.setItem("mlc-tasks", JSON.stringify(tasks)); }
  catch { showToast("Couldn't save the list in this browser, but you can still use it."); }
}
function renderTasks() {
  todoList.replaceChildren();
  tasks.forEach((task, index) => {
    const item = document.createElement("li");
    item.className = `todo-item${task.done ? " done" : ""}`;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox"; checkbox.checked = Boolean(task.done);
    checkbox.setAttribute("aria-label", `Mark ${task.text} complete`);
    checkbox.addEventListener("change", () => { tasks[index].done = checkbox.checked; saveTasks(); renderTasks(); });
    const text = document.createElement("span"); text.className = "task-text"; text.textContent = task.text;
    const remove = document.createElement("button"); remove.className = "delete-task"; remove.type = "button"; remove.textContent = "×";
    remove.setAttribute("aria-label", `Delete ${task.text}`);
    remove.addEventListener("click", () => { tasks.splice(index, 1); saveTasks(); renderTasks(); });
    item.append(checkbox, text, remove); todoList.append(item);
  });
}
todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = todoInput.value.trim();
  if (!text) { todoInput.focus(); showToast("Add a tiny task first, bestie ♡"); return; }
  tasks.push({ text, done: false }); saveTasks(); renderTasks(); todoInput.value = ""; todoInput.focus();
});
renderTasks();

// Affirmation button
const quotes = [
  "Small beginnings can hold the prettiest possibilities.",
  "You are allowed to grow at your own pace. ♡",
  "Tiny progress is still progress, lovely.",
  "You don't need to have it all figured out today.",
  "Make room for the things that make you feel like you."
];
let quoteIndex = 0;
$("#newQuote").addEventListener("click", () => {
  quoteIndex = (quoteIndex + 1) % quotes.length;
  $("#quote").textContent = quotes[quoteIndex];
});

// Dramatic bestie button
const bestieResponses = [
  "GIRL. EXCUSE ME??? Start from the beginning. 💅",
  "And then WHAT HAPPENED??? Don't you dare skip details. 🍿",
  "Bestie, I'm sitting down for this. Continue. 😭",
  "THE PLOT THICKENS. I need a full explanation. 🎭",
  "Girl, blink twice if we need to investigate. 🕵️‍♀️",
  "Not you dropping this lore and expecting me to move on. 💀",
  "Okay but what's the BACKSTORY??? 👀",
  "I'm listening. My imaginary tea is ready. ☕",
  "Respectfully... WHAT IN THE ROM-COM IS THIS??? 🎀",
  "And how are WE feeling about this development, bestie? 🫶",
  "Tbh ykw fairs.🌹",
  "ARE WE DEADASS????",
  "Life ain't daijobou. jk"
];
$("#bestieBtn").addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * bestieResponses.length);
  showToast(bestieResponses[randomIndex]);
});

// Journal auto-save (this browser only)
const journal = $("#journalInput"), saveStatus = $("#saveStatus");
try { journal.value = localStorage.getItem("mlc-journal") || ""; }
catch { saveStatus.textContent = "Your note may not save in this browser."; }
journal.addEventListener("input", () => {
  try { localStorage.setItem("mlc-journal", journal.value); saveStatus.textContent = "Saved just for this browser ♡"; }
  catch { saveStatus.textContent = "Couldn't save automatically in this browser."; }
});
$("#clearJournal").addEventListener("click", () => {
  journal.value = "";
  try { localStorage.removeItem("mlc-journal"); } catch {}
  saveStatus.textContent = "A fresh page ♡";
  showToast("Your note has been cleared, lovely.");
});


const teaInput = document.querySelector("#teaInput");
const judgeTea = document.querySelector("#judgeTea");
const teaVerdict = document.querySelector("#teaVerdict");

judgeTea.addEventListener("click", () => {
  const tea = teaInput.value.trim().toLowerCase();

  if (!tea) {
    teaVerdict.hidden = false;
    teaVerdict.innerHTML = `
      <span class="verdict-badge verdict-jail">
        🚔 CASE DISMISSED
      </span>
      <strong>BESTIE, WHERE IS THE TEA?!</strong>
      You cannot walk into my courtroom with an empty cup. 😭
    `;
    return;
  }

  
  let verdict;
  let category;
  let roast;

  if (["stole", "stolen", "threatened", "betrayed"].some(word => tea.includes(word))) {
    verdict = "🚔 STRAIGHT TO JAIL";
    category = "verdict-jail";
    roast = "BABE???? THE AUDACITY IS AUDACITY-ING. 💀 THE COURT HAS LEFT THE CHAT. We are NOT romanticizing this!";
  } else if (["cheated", "cheating", "manipulated", "lied to me", "lying to me"].some(word => tea.includes(word))) {
    verdict = "🚩 RED FLAG";
    category = "verdict-red";
    roast = "OH, THAT'S EMBARRASSING. FOR THEM. 💀 Babe, your standards deserve a raise. The audacity???";
  } else if (["supported me", "respected me", "helped me", "checked on me", "apologized", "apologised", "was kind"].some(word => tea.includes(word))) {
    verdict = "💚 GREEN FLAG";
    category = "verdict-green";
    roast = "WAITTTT. EMOTIONAL INTELLIGENCE?! 😭💚 We love to see it, bestie. Now let's see if they stay consistent!";
  } else if (["crush", "stared at me", "looked at me", "liked my story", "dreamt about", "dreamed about", "texted me"].some(word => tea.includes(word))) {
    verdict = "🎀 DELULU BUT CUTE";
    category = "verdict-delulu";
    roast = "BABE, A STORY LIKE IS NOT A MARRIAGE PROPOSAL. 😭💋 Giggle a little, but keep one foot on planet Earth!";
  } else {
    verdict = "👀 THE COURT NEEDS MORE LORE";
    category = "verdict-delulu";
    roast = "GIRL, WE NEED CONTEXT! 🍿 You cannot drop one sentence and expect a whole Netflix documentary. SPILL MORE.";
  }

  teaVerdict.hidden = false;

const tone = getTeaCourtTone();

teaVerdict.innerHTML = `
  <span class="verdict-badge ${category}">${verdict}</span>
  <p>${tone.intro}</p>
  <p>${roast}</p>
  <p>${tone.outro}</p>
`;

});

const personalitySlider = document.querySelector("#personalitySlider");
const personalityLabel = document.querySelector("#personalityLabel");
const personalityMessage = document.querySelector("#personalityMessage");

const personalities = {
  1: {
    label: "Sweet Angel 🪽",
    message: "You deserve softness, kindness, and all the pretty things. 🌷",
    roast: "Let's be gentle, bestie. 💗 Tell me what happened, and we'll figure it out together."
  },
  2: {
    label: "Softie Bestie 🌸",
    message: "A little kindness, a little sparkle, a LOT of self-love. 🎀",
    roast: "Okay, babe, let's unpack this gently. 👀 Your feelings matter, so let's hear the whole story."
  },
  3: {
    label: "Bestie Mode 💗",
    message: "Your little corner, your rules, bestie. ✨",
    roast: "BESTIE, I'm listening. 🍿 Give me the lore, the context, and the suspicious details."
  },
  4: {
    label: "Sassy Queen 💅",
    message: "Cute face, big dreams, absolutely no time for nonsense. 💋",
    roast: "OH, WE HAVE SOME TEA. 💀 Babe, the audacity is audacity-ing. Let's investigate."
  },
  5: {
    label: "Certified Menace 😈",
    message: "Respectfully, I'm the plot twist. 💋",
    roast: "YOUR HONOR, I'M LOSING MY MIND. 🚨 THE AUDACITY?! THE DRAMA?! PRESENT THE EVIDENCE, BESTIE."
  }
};


function updatePersonality() {
  const vibe = personalities[personalitySlider.value];

  personalityLabel.textContent = vibe.label;
  personalityMessage.classList.remove("vibe-fade");

  // Restart the animation whenever the vibe changes
  void personalityMessage.offsetWidth;

  personalityMessage.textContent = vibe.message;
  personalityMessage.classList.add("vibe-fade");

  document.body.dataset.personality = personalitySlider.value;
}


personalitySlider.addEventListener("input", updatePersonality);

updatePersonality();

function getTeaCourtTone() {
  const level = Number(personalitySlider.value);

  const tones = {
    1: {
      intro: "Oh, sweetheart. 🥺💕",
      outro: "You deserve kindness, and it's okay to protect your peace. 🌷"
    },
    2: {
      intro: "Okay, love, let's talk about this. 🎀",
      outro: "Trust your feelings, babe. You deserve consistency. 💗"
    },
    3: {
      intro: "BESTIE, THE COURT IS LISTENING. 🍿",
      outro: "We need the facts, the context, and possibly snacks. 👀"
    },
    4: {
      intro: "GIRL. BE SO FOR REAL RIGHT NOW. 💅",
      outro: "The behavior is under investigation. CASE NOTES UPDATED. 🕵️‍♀️"
    },
    5: {
      intro: "YOUR HONOR, I'M ABOUT TO LOSE IT. 💀🚨",
      outro: "THE AUDACITY HAS BEEN DOCUMENTED. COURT ADJOURNED."
    }
  };

  return tones[level] || tones[3];
}

/* 🎀 FLOATING NAVIGATION MENU */

const navToggle = document.querySelector("#navToggle");
const navLinks = document.querySelector("#navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");

  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );

  navToggle.textContent = isOpen ? "✕" : "☰";
});

// Close the mobile menu after choosing a destination.
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
    navToggle.textContent = "☰";
  });
});

/* 🌙 DAYDREAM ↔ MOONLIGHT MODE */

const themeToggle = document.querySelector("#themeToggle");

// Restore the saved theme, or start with daydream mode.
let savedTheme = "day";

try {
  savedTheme = localStorage.getItem("littleCornerTheme") || "day";
} catch (error) {
  // The toggle still works if browser storage is unavailable.
}

function applyTheme(theme) {
  const isNight = theme === "night";

  document.body.dataset.theme = isNight ? "night" : "day";

  themeToggle.textContent = isNight
    ? "☀️ Daydream"
    : "🌙 Moonlight";

  themeToggle.setAttribute(
    "aria-label",
    isNight ? "Switch to daydream mode" : "Switch to moonlight mode"
  );

  themeToggle.setAttribute("aria-pressed", String(isNight));
}

applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const isCurrentlyNight =
    document.body.dataset.theme === "night";

  const nextTheme = isCurrentlyNight ? "day" : "night";

  applyTheme(nextTheme);

  try {
    localStorage.setItem("littleCornerTheme", nextTheme);
  } catch (error) {
    // The theme still changes until the page is refreshed.
  }
});

/* ✨ CLICK FOR A LITTLE FAIRY MAGIC */

const magicLayer = document.querySelector("#magicLayer");
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

function createMagic(x, y, symbol, className) {
  // Respect the visitor's motion preference.
  if (reducedMotion.matches || !magicLayer) return;

  const particle = document.createElement("span");

  particle.className = `magic-particle ${className}`;
  particle.textContent = symbol;

  // Place the particle where the visitor clicked.
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  particle.style.fontSize = `${12 + Math.random() * 12}px`;

  // Give each particle a slightly different sideways drift.
  particle.style.setProperty(
    "--drift",
    `${Math.round(Math.random() * 70 - 35)}px`
  );

  magicLayer.appendChild(particle);

  // Clean up the particle when its animation finishes.
  particle.addEventListener("animationend", () => {
    particle.remove();
  }, { once: true });
}

document.addEventListener("click", (event) => {
  // Don't create extra particles when using the navigation toggle.
  if (event.target.closest(".nav-toggle")) return;

  const x = event.clientX;
  const y = event.clientY;

  // One tiny sparkle on every click.
  createMagic(x, y, "✦", "magic-sparkle");

  // A heart appears on every second click.
  if (Math.random() > 0.5) {
    createMagic(
      x + 10,
      y + 5,
      "♡",
      "magic-heart"
    );
  }
});
