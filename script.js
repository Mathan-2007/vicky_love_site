/* =========================================================
   EDIT THIS PART
   ========================================================= */
const CONFIG = {
  // Your name (shown at the end of the love note)
  from: "Your Name",

  // Optional: your WhatsApp number with country code, digits only.
  // Example: "919876543210". Leave "" to let her choose the chat.
  phone: "",

  // The love note (use \n for a new line)
  note:
    "you make every ordinary day feel special.\n\n" +
    "no matter what, I'll always be there for you.\n\n" +
    "today and every day, I celebrate you and us.",

  // Messages shown each time she clicks "No"
  nags: [
    "Are you sure?",
    "Think again...",
    "Don't do this to me",
    "Please? ",
    "The YES button is getting bigger...",
    "Last chance!"
  ],

  // Photos for the final screen (files inside the images folder)
  gallery: [
    "couple-1.jpg",
    "friends-balloons.jpg",
    "portrait-lake.jpg",
    "couple-2.jpg",
    "friends-lab.jpg",
    "portrait-balloons.jpg",
    "friends-crowd.jpg"
  ]
};

/* =========================================================
   Logic
   ========================================================= */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const state = { noCount: 0, date: "", activity: "" };

function show(id) {
  $$(".screen").forEach(el => el.classList.toggle("active", el.id === id));
  window.scrollTo({ top: 0 });
}

/* ---- Screen 1: yes / no ---- */
const yesBtn = $("#yes");
const noBtn  = $("#no");
const nag    = $("#nag");

noBtn.addEventListener("click", () => {
  state.noCount++;
  const n = state.noCount;

  yesBtn.style.setProperty("--yes", (1 + n * 0.22).toFixed(2));
  noBtn.style.setProperty("--no",  Math.max(0.35, 1 - n * 0.14).toFixed(2));
  nag.textContent = CONFIG.nags[Math.min(n - 1, CONFIG.nags.length - 1)];

  if (n >= CONFIG.nags.length) noBtn.classList.add("gone");
});

yesBtn.addEventListener("click", () => {
  rain();
  show("s2");
});

/* ---- Screen 2: continue ---- */
$$("[data-next]").forEach(b =>
  b.addEventListener("click", () => show(b.dataset.next))
);

/* ---- Screen 3: date ---- */
const dateInput = $("#dateInput");
const toActivity = $("#toActivity");

// Don't allow dates in the past
dateInput.min = new Date().toISOString().split("T")[0];

dateInput.addEventListener("input", () => {
  state.date = dateInput.value;
  toActivity.disabled = !state.date;
});
toActivity.addEventListener("click", () => show("s4"));

/* ---- Screen 4: activity ---- */
const choices = $$(".px-choice");
const lockIn  = $("#lockIn");

choices.forEach(btn =>
  btn.addEventListener("click", () => {
    choices.forEach(b => b.setAttribute("aria-checked", String(b === btn)));
    state.activity = btn.textContent.trim();
    lockIn.disabled = false;
  })
);

lockIn.addEventListener("click", () => {
  buildFinal();
  show("s5");
  rain();
  typeNote();
});

/* ---- Screen 5: summary ---- */
function prettyDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "long", year: "numeric"
  });
}

function buildFinal() {
  $("#outDate").textContent = prettyDate(state.date);
  $("#outActivity").textContent = state.activity;

  const g = $("#gallery");
  g.innerHTML = "";
  CONFIG.gallery.forEach((file, i) => {
    const p = document.createElement("div");
    p.className = "polaroid";
    p.style.setProperty("--tilt", (i % 2 ? 3 : -3) + "deg");
    const img = document.createElement("img");
    img.src = "images/" + file;
    img.alt = "Our photo " + (i + 1);
    img.loading = "lazy";
    p.appendChild(img);
    g.appendChild(p);
  });

  $("#noteSign").textContent = "xoxo, " + CONFIG.from;

  const msg =
    "YES! Date locked in: " + prettyDate(state.date) +
    " - " + state.activity + " (from your pixel invite)";
  const base = CONFIG.phone ? "https://wa.me/" + CONFIG.phone : "https://wa.me/";
  $("#shareBtn").href = base + "?text=" + encodeURIComponent(msg);
}

/* Typewriter effect for the note */
let typing;
function typeNote() {
  const el = $("#noteText");
  const text = CONFIG.note;
  clearInterval(typing);
  el.textContent = "";

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = text;
    return;
  }
  let i = 0;
  typing = setInterval(() => {
    el.textContent = text.slice(0, ++i);
    if (i >= text.length) clearInterval(typing);
  }, 45);
}

/* Falling hearts */
function rain() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < 26; i++) {
    const h = document.createElement("span");
    h.className = "heart-fall";
    h.textContent = Math.random() > 0.3 ? "♥" : "✦";
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = 12 + Math.random() * 20 + "px";
    h.style.animationDuration = 2.2 + Math.random() * 2.2 + "s";
    h.style.animationDelay = Math.random() * 0.8 + "s";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 5500);
  }
}
