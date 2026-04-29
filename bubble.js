const QUESTIONS = [
  {
    text: "Қай тақырыпты басасың?",
    a: { icon:"🔥", label:"ШОК! Бұл барлығын мәңгіге өзгертеді", score:2 },
    b: { icon:"📊", label:"Зерттеу күтпеген нәтиже көрсетті",    score:0 }
  },
  {
    text: "Не оқығанды ұнатасың?",
    a: { icon:"😱", label:"Жанжал, драма, қақтығыстар",           score:2 },
    b: { icon:"📚", label:"Терең талдау және фактілер",           score:0 }
  },
  {
    text: "Жаңалықтың көзін тексересің бе?",
    a: { icon:"✅", label:"Иә, әрқашан",                           score:0 },
    b: { icon:"🤷", label:"Сирек — сезімге сенемін",              score:1 }
  },
  {
    text: "Келіспейтін постқа қалай реакция білдіресің?",
    a: { icon:"💬", label:"Оқимын, ойланамын, кейде пікірімді өзгертемін", score:0 },
    b: { icon:"🚫", label:"Жасырамын / елемеймін / ашуланамын",  score:2 }
  },
  {
    text: "Досың саған мүлде бөлек пікір жіберді. Сенің әрекетің?",
    a: { icon:"🧐", label:"Қызықты — неге олай ойлайды деп ойланамын", score:0 },
    b: { icon:"🙄", label:"Сенбеймін, бірден жабамын",                  score:2 }
  },
  {
    text: "Жаңалықты қайдан аласың?",
    a: { icon:"📰", label:"Бірнеше түрлі сайт пен газеттен",      score:0 },
    b: { icon:"📱", label:"Тек өз таспамнан — TikTok, Instagram", score:2 }
  },
  {
    text: "Алгоритм саған не ұсынады деп ойлайсың?",
    a: { icon:"🎯", label:"Мені қызықтыратын нәрсені ғана",       score:2 },
    b: { icon:"🌐", label:"Маңызды жаңалықтарды жалпы",           score:0 }
  },
  {
    text: "Бейтаныс адам сенің пікіріңмен келіспесе?",
    a: { icon:"⚔️", label:"Дауласамын — өзімді дәлелдеуім керек", score:2 },
    b: { icon:"🤝", label:"Тыңдаймын — мүмкін олар дұрыс шығар", score:0 }
  },
  {
    text: "\"Барлық бұқаралық ақпарат құралдары өтірік айтады\" деген сөзге не дейсің?",
    a: { icon:"👍", label:"Рас, ешкімге сенуге болмайды",          score:2 },
    b: { icon:"🔍", label:"Жоқ, дереккөзді таңдай білу керек",    score:0 }
  },
  {
    text: "Бір аптада қанша түрлі пікірді оқисың?",
    a: { icon:"🌈", label:"Көп — қарама-қарсы тараптарды да қарайм", score:0 },
    b: { icon:"🔁", label:"Бір ғана — өзіме ұнайтын",               score:2 }
  }
];

const NEWS = {
  calm: [
    { icon:"🔬", text:"Әлеуметтік желілердің жасөспірімдер ұйқысына әсері туралы жаңа зерттеу", src:"nature.com" },
    { icon:"🌍", text:"Ғалымдар Азиядағы орман өсімінің рекордтық деңгейін тіркеді",             src:"sciencedaily.com" },
    { icon:"🤖", text:"Ұсыныс алгоритмдері қалай жұмыс істейді және неге қателеседі",           src:"wired.com" }
  ],
  mixed: [
    { icon:"⚡", text:"Технологиялар еңбек нарығын өзгертуде — сандар мен болжамдар",  src:"bloomberg.com" },
    { icon:"🧩", text:"Сарапшылар жасанды интеллектті реттеу бойынша пікір алышты",    src:"reuters.com" },
    { icon:"❓", text:"ChatGPT туралы соңғы жаңалықтарда не шындық, не жалған",        src:"factcheck.org" }
  ],
  emotional: [
    { icon:"🔥", text:"ШОК! Технологиялар 3 жылда жұмыс орындарының 50%-ін жояды", src:"vibemedia.kz",  hot:true },
    { icon:"😱", text:"Бұл ЖАСЫРЫЛДЫ! 5G мен денсаулық туралы шындық",             src:"exposethem.net", hot:true },
    { icon:"⚠️", text:"СЕН ҚАЗІР ҚАУІПТЕ — шұғыл оқы",                             src:"alarmpost.io",  hot:true }
  ]
};

const ALL_NEWS = [
  ...NEWS.calm.map(n     => ({...n, tag:"calm",  tagLabel:"Сабырлы"  })),
  ...NEWS.mixed.map(n    => ({...n, tag:"mixed", tagLabel:"Бейтарап" })),
  ...NEWS.emotional.map(n=> ({...n, tag:"hot",   tagLabel:"Клікбейт" }))
];

let score = 0, currentQ = 0;
const $ = id => document.getElementById(id);

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

$('btn-start').addEventListener('click', () => {
  score = 0; currentQ = 0;
  renderQuestion();
  show('screen-test');
});
$('btn-reveal').addEventListener('click', showTruth);
$('btn-restart').addEventListener('click', () => show('screen-start'));

function renderQuestion() {
  const q = QUESTIONS[currentQ];
  $('q-label').textContent = `${currentQ + 1}-сұрақ, ${QUESTIONS.length}-нан`;
  $('q-text').textContent = q.text;
  $('progress-fill').style.width = (currentQ / QUESTIONS.length * 100) + '%';
  const choices = $('choices');
  choices.innerHTML = '';
  [q.a, q.b].forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<span class="icon">${opt.icon}</span><span>${opt.label}</span>`;
    btn.addEventListener('click', () => {
      score += opt.score; currentQ++;
      if (currentQ < QUESTIONS.length) {
        renderQuestion();
      } else {
        $('progress-fill').style.width = '100%';
        setTimeout(showFeed, 300);
      }
    });
    choices.appendChild(btn);
  });
}

function showFeed() {
  const type = score <= 4 ? 'calm' : score <= 9 ? 'mixed' : 'emotional';
  const list = $('news-list');
  list.innerHTML = '';
  NEWS[type].forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'news-card' + (item.hot ? ' emotional' : '');
    card.style.animationDelay = (i * 0.12) + 's';
    card.innerHTML = `<span class="nc-icon">${item.icon}</span>
      <div><div class="nc-text">${item.text}</div>
      <div class="nc-src">${item.src}</div></div>`;
    list.appendChild(card);
  });
  show('screen-feed');
}

function showTruth() {
  const maxScore = QUESTIONS.reduce((s,q) => s + Math.max(q.a.score, q.b.score), 0);
  const percent = Math.round((score / maxScore) * 100);
  $('gauge-percent').textContent = percent + '%';
  $('gauge-label').textContent = getBubbleLabel(percent);
  const grid = $('all-grid');
  grid.innerHTML = '';
  ALL_NEWS.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'all-card';
    card.style.animationDelay = (i * 0.07) + 's';
    card.innerHTML = `<span>${item.icon}</span>
      <span style="flex:1">${item.text}</span>
      <span class="tag tag-${item.tag}">${item.tagLabel}</span>`;
    grid.appendChild(card);
  });
  $('insight-text').innerHTML = getInsight(percent);
  show('screen-truth');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    $('gauge-fill').style.width = percent + '%';
  }));
}

function getBubbleLabel(p) {
  if (p <= 20) return "Көпіршік жоқ дерлік — ашық көзқарас";
  if (p <= 50) return "Жеңіл көпіршік — кейде шындықты сүзгіден өткізесің";
  if (p <= 75) return "Байқалатын көпіршік — алгоритмдер сені жақсы біледі";
  return "Тығыз көпіршік — тек көргісі келгенін көреді";
}

function getInsight(p) {
  if (p <= 20) return `<strong>Сен сыни ойлайсың.</strong> Бірақ есте сақта: көпіршік байқаусызда қалыптасады. Тіпті ең саналы пайдаланушылар да уақыт өте оған түседі — алгоритмдер біз ойлағаннан да шыдамдырақ.`;
  if (p <= 50) return `<strong>Орташа көпіршік.</strong> Сен фактілерден бас тартпайсың, бірақ эмоционалды тақырыптар сені тартады. TikTok, YouTube және Instagram алгоритмдері дәл осыны пайдаланады — олар назарыңның секундтарынан үйренеді.`;
  return `<strong>Алгоритмдер сені түсінді.</strong> Олар сені не тартатынын әлдеқашан білді — және мұны қайта-қайта көрсетеді. Бұл конспирация емес: жай ғана кликтер математикасы. Қарама-қарсы көзқарастарды саналы түрде іздеп көр.`;
}
