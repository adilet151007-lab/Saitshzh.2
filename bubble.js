/* ═══════════════════════════════════════════════
   bubble.js  —  "Ты в пузыре?" logic
   ═══════════════════════════════════════════════ */

const QUESTIONS = [
  {
    text: "Какой заголовок ты кликнешь?",
    a: { icon: "🔥", label: "ШОК! Это изменит всё навсегда",        score: 2 },
    b: { icon: "📊", label: "Исследование показало неожиданный результат", score: 0 }
  },
  {
    text: "Что тебе интереснее читать?",
    a: { icon: "😱", label: "Скандалы, драма, конфликты",            score: 2 },
    b: { icon: "📚", label: "Глубокий анализ и факты",               score: 0 }
  },
  {
    text: "Ты проверяешь источник новости?",
    a: { icon: "✅", label: "Да, всегда",                             score: 0 },
    b: { icon: "🤷", label: "Редко — доверяю ощущению",              score: 1 }
  },
  {
    text: "Как реагируешь на пост, с которым не согласен?",
    a: { icon: "💬", label: "Читаю, думаю, иногда меняю мнение",     score: 0 },
    b: { icon: "🚫", label: "Скрываю / игнорирую / злюсь",           score: 2 }
  }
];

const NEWS = {
  calm: [
    { icon: "🔬", text: "Новое исследование о влиянии соцсетей на сон подростков", src: "nature.com" },
    { icon: "🌍", text: "Учёные зафиксировали рекордный прирост лесов в Азии",    src: "sciencedaily.com" },
    { icon: "🤖", text: "Как работают алгоритмы рекомендаций и почему они ошибаются", src: "wired.com" }
  ],
  mixed: [
    { icon: "⚡", text: "Технологии меняют рынок труда — цифры и прогнозы",        src: "bloomberg.com" },
    { icon: "🧩", text: "Эксперты разошлись во мнениях об ИИ-регуляции",           src: "reuters.com" },
    { icon: "❓", text: "Что правда, а что нет в последних новостях про ChatGPT",   src: "factcheck.org" }
  ],
  emotional: [
    { icon: "🔥", text: "ШОК! Технологии уничтожат 50% рабочих мест за 3 года",   src: "vibemedia.ru",   hot: true },
    { icon: "😱", text: "Это СКРЫВАЛИ от тебя! Правда о 5G и здоровье",            src: "exposethem.net", hot: true },
    { icon: "⚠️", text: "ТЫ В ОПАСНОСТИ прямо сейчас — читай срочно",             src: "alarmpost.io",   hot: true }
  ]
};

const ALL_NEWS = [
  ...NEWS.calm.map(n => ({ ...n, tag: "calm",     tagLabel: "Спокойно"  })),
  ...NEWS.mixed.map(n => ({ ...n, tag: "mixed",    tagLabel: "Нейтрально" })),
  ...NEWS.emotional.map(n => ({ ...n, tag: "hot",  tagLabel: "Кликбейт" }))
];

/* ── STATE ── */
let score = 0;
let currentQ = 0;

/* ── HELPERS ── */
const $ = id => document.getElementById(id);
const show = id => { $(id).classList.add("active"); };
const hide = id => { $(id).classList.remove("active"); };

function setProgress(ratio) {
  $("progress-fill").style.width = (ratio * 100) + "%";
}

/* ── BOOT ── */
document.addEventListener("DOMContentLoaded", () => {
  $("btn-start").addEventListener("click", startTest);
  $("btn-reveal").addEventListener("click", showTruth);
  $("btn-restart").addEventListener("click", restart);
  show("screen-start");
});

/* ── START ── */
function startTest() {
  score = 0;
  currentQ = 0;
  hide("screen-start");
  renderQuestion();
  show("screen-test");
}

/* ── QUESTIONS ── */
function renderQuestion() {
  const q = QUESTIONS[currentQ];
  $("q-label").textContent = `Вопрос ${currentQ + 1} из ${QUESTIONS.length}`;
  $("q-text").textContent = q.text;

  const choices = $("choices");
  choices.innerHTML = "";

  [q.a, q.b].forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerHTML = `<span class="icon">${opt.icon}</span><span>${opt.label}</span>`;
    btn.addEventListener("click", () => handleAnswer(opt.score));
    choices.appendChild(btn);
  });

  setProgress((currentQ) / QUESTIONS.length);
}

function handleAnswer(s) {
  score += s;
  currentQ++;
  if (currentQ < QUESTIONS.length) {
    // brief fade out / in
    const screen = $("screen-test");
    screen.style.opacity = "0";
    setTimeout(() => {
      renderQuestion();
      screen.style.transition = "opacity 0.3s";
      screen.style.opacity = "1";
    }, 180);
  } else {
    setProgress(1);
    setTimeout(showFeed, 300);
  }
}

/* ── FEED ── */
function showFeed() {
  hide("screen-test");

  const type = score <= 2 ? "calm" : score <= 4 ? "mixed" : "emotional";
  const items = NEWS[type];
  const list = $("news-list");
  list.innerHTML = "";

  items.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "news-card" + (item.hot ? " emotional" : "");
    card.style.animationDelay = (i * 0.12) + "s";
    card.innerHTML = `
      <span class="nc-icon">${item.icon}</span>
      <div>
        <div class="nc-text">${item.text}</div>
        <div class="nc-src">${item.src}</div>
      </div>`;
    list.appendChild(card);
  });

  show("screen-feed");
}

/* ── TRUTH ── */
function showTruth() {
  hide("screen-feed");

  const maxScore = QUESTIONS.reduce((s, q) => s + Math.max(q.a.score, q.b.score), 0);
  const percent = Math.round((score / maxScore) * 100);

  $("gauge-percent").textContent = percent + "%";
  $("gauge-label").textContent = getBubbleLabel(percent);

  show("screen-truth");

  // animate gauge after render
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      $("gauge-fill").style.width = percent + "%";
    });
  });

  // render all news
  const grid = $("all-grid");
  grid.innerHTML = "";
  ALL_NEWS.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "all-card";
    card.style.animationDelay = (i * 0.07) + "s";
    card.innerHTML = `
      <span>${item.icon}</span>
      <span style="flex:1">${item.text}</span>
      <span class="tag tag-${item.tag}">${item.tagLabel}</span>`;
    grid.appendChild(card);
  });

  $("insight-text").innerHTML = getInsight(percent);
}

function getBubbleLabel(p) {
  if (p <= 20) return "Практически нет пузыря — открытый взгляд";
  if (p <= 50) return "Лёгкий пузырь — иногда фильтруешь реальность";
  if (p <= 75) return "Заметный пузырь — алгоритмы тебя знают";
  return "Плотный пузырь — видишь только то, что хочешь видеть";
}

function getInsight(p) {
  if (p <= 20) return `<strong>Ты критически мыслишь.</strong> Но помни: пузырь строится незаметно. Даже самые осознанные пользователи со временем попадают в него — алгоритмы терпеливее, чем мы думаем.`;
  if (p <= 50) return `<strong>Умеренный пузырь.</strong> Ты не отказываешься от фактов, но эмоциональные заголовки всё равно притягивают. Именно это и используют алгоритмы TikTok, YouTube и Instagram — они учатся на твоих секундах внимания.`;
  return `<strong>Алгоритмы тебя поняли.</strong> Они давно знают, что тебя цепляет — и показывают это снова и снова. Это не заговор: просто математика кликов. Попробуй осознанно искать противоположные точки зрения.`;
}

/* ── RESTART ── */
function restart() {
  hide("screen-truth");
  score = 0;
  currentQ = 0;
  show("screen-start");
}
