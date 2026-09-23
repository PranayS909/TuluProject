/* ===================================================================
   TULU LANDING PAGE — behaviour
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHistoryTabs();
  initLeaderboard();
  initRoadmap();
  initReveal();
  initThemeCustomizer();
});

/* ---------- NAV ---------- */
function initNav(){
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    links.style.cssText = open
      ? 'display:flex;flex-direction:column;gap:16px;position:absolute;top:100%;left:0;right:0;background:#fff;padding:20px 24px;border-bottom:2px solid var(--grey-light);'
      : '';
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('is-open');
    links.style.cssText = '';
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

/* ---------- History tabs ---------- */
function initHistoryTabs(){
  const tabs = document.querySelectorAll('.hist-tab');
  const panels = document.querySelectorAll('.hist-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected','false'); });
      panels.forEach(p => p.classList.remove('is-active'));

      tab.classList.add('is-active');
      tab.setAttribute('aria-selected','true');
      document.getElementById(`panel-${tab.dataset.panel}`).classList.add('is-active');
    });
  });
}

/* ---------- Scroll reveal ---------- */
function initReveal(){
  const targets = document.querySelectorAll(
    '.fact-card, .culture-card, .lb-panel, .unit-banner, .path-progress, .era-step'
  );
  targets.forEach(el => el.setAttribute('data-reveal', ''));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold:0.12, rootMargin:'0px 0px -30px 0px' });

  targets.forEach(el => io.observe(el));
}

/* ---------- Leaderboard ---------- */
const LEADERBOARD_DATA = {
  weekly: [
    { name:'Ashwini Poojary', streak:21, xp:2840, initials:'AP', color:'#FF9600' },
    { name:'Rohan Kotian',    streak:14, xp:2615, initials:'RK', color:'#1CB0F6' },
    { name:'Meera Shetty',    streak:9,  xp:2390, initials:'MS', color:'#CE82FF' },
    { name:'Yusuf Baig',      streak:12, xp:2110, initials:'YB', color:'#58CC02' },
    { name:'Divya Amin',      streak:6,  xp:1875, initials:'DA', color:'#FF4B4B' },
    { name:'Prakash Rai',     streak:5,  xp:1640, initials:'PR', color:'#FF86D0' },
    { name:'Sana Fernandes',  streak:8,  xp:1520, initials:'SF', color:'#1CB0F6' },
  ],
  alltime: [
    { name:'Ashwini Poojary', streak:118, xp:41200, initials:'AP', color:'#FF9600' },
    { name:'Bhavya Kulal',    streak:95,  xp:38750, initials:'BK', color:'#FF4B4B' },
    { name:'Rohan Kotian',    streak:87,  xp:35980, initials:'RK', color:'#1CB0F6' },
    { name:'Meera Shetty',    streak:70,  xp:29410, initials:'MS', color:'#58CC02' },
    { name:'Imran Salian',    streak:64,  xp:27305, initials:'IS', color:'#CE82FF' },
    { name:'Yusuf Baig',      streak:58,  xp:24870, initials:'YB', color:'#FF9600' },
    { name:'Divya Amin',      streak:44,  xp:19960, initials:'DA', color:'#1CB0F6' },
  ]
};

function initLeaderboard(){
  const table = document.getElementById('lbTable');
  const tabs = document.querySelectorAll('.lb-tab');

  const render = (range) => {
    table.querySelectorAll('.lb-row--data').forEach(r => r.remove());
    LEADERBOARD_DATA[range].forEach((person, i) => {
      const rank = i + 1;
      const row = document.createElement('div');
      row.className = 'lb-row lb-row--data';
      row.setAttribute('role','row');
      const medalClass = rank <= 3 ? ` medal-${rank}` : '';
      const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
      row.innerHTML = `
        <span class="lb-rank${medalClass}">${medal}</span>
        <span class="lb-user">
          <span class="lb-avatar" style="background:${person.color}">${person.initials}</span>
          <span class="lb-name">${person.name}</span>
        </span>
        <span class="lb-streak">🔥 ${person.streak}d</span>
        <span class="lb-xp">${person.xp.toLocaleString()} XP</span>
      `;
      table.appendChild(row);
    });
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected','true');
      render(tab.dataset.range);
    });
  });

  render('weekly');
}

/* ---------- Roadmap ---------- */
const UNIT_THEMES = {
  green:  { var:'--e1', shadow:'#46A302' },
  blue:   { var:'--e2', shadow:'#1899D6' },
  orange: { var:'--e3', shadow:'#D97F00' },
  purple: { var:'--e4', shadow:'#A568DB' },
};

const ROADMAP_UNITS = [
  {
    theme:'green', icon:'🌱', name:'Unit 1', title:'First Words',
    nodes:[
      { type:'lesson', icon:'👋', title:'Greetings', status:'complete',
        desc:'Say hello, introduce yourself, and be polite in Tulu.',
        items:['Common greetings','Introducing yourself','Please & thank you'],
        vocab:[
          {tulu:'namaskAra / namastE', en:'hello'},
          {tulu:'Encha ullar?', en:'how are you? (formal)'},
          {tulu:'encha ulla?', en:'how are you? (informal)'},
          {tulu:'ushArullae', en:'I am fine'},
          {tulu:'pudar enchine?', en:'what’s your name? (formal)'},
          {tulu:'enna pudar…', en:'my name is…'},
          {tulu:'dayamalt / dayadId', en:'please'},
          {tulu:'barpae', en:'bye'},
        ],
        note:'“solmelu” turns up meaning both “hi” and “thank you” depending on the source — confirm which with a speaker before teaching it.',
        source:[{label:'Easy Tulu — Lesson 41', url:'https://www.easytulu.com/2016/12/tulu-lesson-41-useful-phrases-in-tulu.html'},
                {label:'Raveesh Kumar — Common Phrases', url:'https://www.raveeshkumar.com/2009/05/learn-tulu-online-commonly-used-phrases.html'}] },
      { type:'lesson', icon:'🔢', title:'Numbers 1–20', status:'complete',
        desc:'Count, ask prices, and tell simple quantities.',
        items:['Numbers 1–20','Asking "how many?"','Simple counting phrases'],
        vocab:[
          {tulu:'onji', en:'1'}, {tulu:'raDD', en:'2'}, {tulu:'mUji', en:'3'},
          {tulu:'nAl', en:'4'}, {tulu:'ain', en:'5'}, {tulu:'Aji', en:'6'},
          {tulu:'El', en:'7'}, {tulu:'enma', en:'8'}, {tulu:'orumba', en:'9'},
          {tulu:'patt', en:'10'}, {tulu:'pattonji', en:'11'}, {tulu:'padiraDD', en:'12'},
          {tulu:'padimUji', en:'13'}, {tulu:'padinAl', en:'14'}, {tulu:'padinain', en:'15'},
          {tulu:'padinAji', en:'16'}, {tulu:'padinEl', en:'17'}, {tulu:'padinenma', en:'18'},
          {tulu:'padinorumba', en:'19'}, {tulu:'irva', en:'20'},
        ],
        source:[{label:'Easy Tulu — Lesson 5', url:'https://www.easytulu.com/2016/02/tulu-lesson-5-more-interrogative.html'}] },
      { type:'chest', icon:'🎁', title:'Bonus: Tongue-Twisters', status:'complete',
        desc:'A playful bonus round of classic Tulu tongue-twisters.',
        items:['Rhythm & pronunciation','Fun local phrases'],
        note:'Real Tulu tongue-twisters are thin on the open web — native speakers or Tulu community groups are a better source than any site found so far.',
        source:[{label:'Quora — Tulu slang thread (starting point)', url:'https://www.quora.com/What-are-some-tulu-slangs'}] },
      { type:'lesson', icon:'👪', title:'Family Words', status:'complete',
        desc:'Tulu has famously specific kinship terms — learn the essentials.',
        items:['Immediate family terms','Extended family terms','Talking about relatives'],
        vocab:[
          {tulu:'appae', en:'mother'}, {tulu:'amme', en:'father'},
          {tulu:'mage', en:'son'}, {tulu:'magal', en:'daughter'},
          {tulu:'ajje', en:'grandfather'}, {tulu:'ajji', en:'grandmother'},
          {tulu:'kaNDane', en:'husband'}, {tulu:'boDedi', en:'wife'},
          {tulu:'palaye', en:'elder brother'}, {tulu:'paldi', en:'elder sister'},
          {tulu:'megye', en:'younger brother'}, {tulu:'tangaDi', en:'younger sister'},
        ],
        note:'Sources list “appae” as mother and “amme” as father — the reverse of Kannada. Surprising enough to double-check before teaching it.',
        source:[{label:'Easy Tulu — Family Relationships', url:'https://www.easytulu.com/p/family-relationships-in-tulu.html'},
                {label:'TuluBuzz — Family Relationship names', url:'https://www.tulubuzz.in/2024/03/Family-Relationship-names-in-tulu.html'}] },
      { type:'trophy', icon:'🏆', title:'Unit 1 Complete', status:'complete',
        desc:'You can greet people, count, and talk about family in Tulu.',
        items:['Review all Unit 1 skills'] },
    ]
  },
  {
    theme:'blue', icon:'🌊', name:'Unit 2', title:'Everyday Tulu',
    nodes:[
      { type:'lesson', icon:'🍛', title:'Food & Market', status:'complete',
        desc:'Order food, shop at a market, and talk about meals.',
        items:['Food vocabulary','Market phrases','Talking about meals'],
        vocab:[
          {tulu:'maNoli', en:'ivy gourd'}, {tulu:'touthe', en:'cucumber'},
          {tulu:'koththambari', en:'coriander'}, {tulu:'moolangi', en:'radish'},
          {tulu:'munchi', en:'pepper'},
          {tulu:'nekk Eth?', en:'how much is this?'},
          {tulu:'vaNas aanDa?', en:'had your lunch?'},
        ],
        source:[{label:'Raveesh Kumar — Common Phrases', url:'https://www.raveeshkumar.com/2009/05/learn-tulu-online-commonly-used-phrases.html'}] },
      { type:'lesson', icon:'📝', title:'Simple Sentences', status:'complete',
        desc:'Build basic present-tense sentences with correct word order.',
        items:['Subject–object–verb order','Present tense basics','Everyday statements'],
        vocab:[
          {tulu:'yAn pOpae', en:'I go'}, {tulu:'Aye pOpe', en:'he goes'},
          {tulu:'mOlu pOpal', en:'she goes'}, {tulu:'yAn sAleg pOpae', en:'I go to school'},
          {tulu:'enkulu dinola pEpar Oduva', en:'we read the newspaper daily'},
        ],
        note:'Pattern: short verbs take “-p-” + ending (pO → pOpe, “he goes”); longer verbs take “-uv-” + ending (mAr → mAruve, “he sells”).',
        source:[{label:'Easy Tulu — Lesson 3: Simple Present Tense', url:'https://www.easytulu.com/2016/02/tulu-lesson-3-simple-present-tense.html'}] },
      { type:'chest', icon:'💎', title:'Bonus: Coastal Slang', status:'current',
        desc:'Casual, everyday expressions you’ll actually hear on the coast.',
        items:['Informal greetings','Local expressions'],
        note:'Idioms and slang need a native speaker to vet — the links below are a starting point, not a vocab list to copy verbatim.',
        source:[{label:'Raveesh Kumar — Tulu/Kannada idioms & sayings', url:'https://www.raveeshkumar.com/2011/11/learn-tulu-idioms-sayings-with.html'},
                {label:'Quora — Tulu slang thread', url:'https://www.quora.com/What-are-some-tulu-slangs'}] },
      { type:'lesson', icon:'❓', title:'Questions & Verbs', status:'locked',
        desc:'Ask questions and conjugate verbs across past, present, and future.',
        items:['Question formation','Verb conjugation','Case markers'],
        vocab:[
          {tulu:'att / ata', en:'no / isn’t it (statement)'},
          {tulu:'ijji / ijja', en:'no / isn’t it (existence)'},
          {tulu:'undu dAde?', en:'what is this?'},
          {tulu:'Ir dUra pOvondullar?', en:'where are you going? (formal)'},
          {tulu:'gaNTae EtAND?', en:'what time is it?'},
        ],
        source:[{label:'Easy Tulu — Lesson 5', url:'https://www.easytulu.com/2016/02/tulu-lesson-5-more-interrogative.html'},
                {label:'Easy Tulu — Lesson 41', url:'https://www.easytulu.com/2016/12/tulu-lesson-41-useful-phrases-in-tulu.html'}] },
      { type:'trophy', icon:'🏆', title:'Unit 2 Complete', status:'locked',
        desc:'Hold a basic everyday conversation in Tulu.',
        items:['Review all Unit 2 skills'] },
    ]
  },
  {
    theme:'orange', icon:'📖', name:'Unit 3', title:'Reading Tulu',
    nodes:[
      { type:'lesson', icon:'🔤', title:'Kannada Script', status:'locked',
        desc:'Most modern Tulu writing uses the Kannada script — start reading it.',
        items:['Vowels & consonants','Combining letters','Common words'] },
      { type:'lesson', icon:'📰', title:'Reading Practice', status:'locked',
        desc:'Read short everyday passages, signs, and menus.',
        items:['Short passages','Signs & labels','Comprehension checks'] },
      { type:'chest', icon:'🎁', title:'Bonus: Proverbs', status:'locked',
        desc:'Classic Tulu proverbs and what they reveal about coastal life.',
        items:['Proverbs & meanings'] },
      { type:'lesson', icon:'✍️', title:'Writing Practice', status:'locked',
        desc:'Write simple words and sentences in the Kannada script.',
        items:['Handwriting basics','Spelling practice','Simple composition'] },
      { type:'trophy', icon:'🏆', title:'Unit 3 Complete', status:'locked',
        desc:'Read and write everyday Tulu confidently.',
        items:['Review all Unit 3 skills'] },
    ]
  },
  {
    theme:'purple', icon:'🎭', name:'Unit 4', title:'Culture Deep-Dive',
    nodes:[
      { type:'lesson', icon:'🐃', title:'Kambala & Festivals', status:'locked',
        desc:'Vocabulary from Kambala buffalo races, Dasara, and the Tulu New Year.',
        items:['Festival terms','Kambala vocabulary'] },
      { type:'lesson', icon:'🎶', title:'Folk Songs', status:'locked',
        desc:'Listen to Paddana-style oral songs and pick out key phrases.',
        items:['Listening practice','Recognising sung Tulu','Regional dialect variation'] },
      { type:'chest', icon:'💎', title:'Bonus: Bhoota Kola', status:'locked',
        desc:'Vocabulary around the spirit-possession ritual and its performance.',
        items:['Ritual terms','Cultural context'] },
      { type:'lesson', icon:'📜', title:'Tigalari Script', status:'locked',
        desc:'An introduction to Tulu\u2019s own historical script.',
        items:['Tigalari letterforms','Reading short inscriptions','History of the script'] },
      { type:'trophy', icon:'🏆', title:'Course Complete', status:'locked',
        desc:'From first greeting to reading historical Tulu inscriptions.',
        items:['Review all skills'] },
    ]
  },
];

const ZIGZAG = [0, 78, 118, 78, 0, -78, -118, -78];

function initRoadmap(){
  const wrap = document.getElementById('pathWrap');
  const rootStyle = getComputedStyle(document.documentElement);
  let globalIndex = 0, totalNodes = 0, completeNodes = 0, openPopover = null;

  ROADMAP_UNITS.forEach(unit => {
    const themeDef = UNIT_THEMES[unit.theme];
    const face = rootStyle.getPropertyValue(themeDef.var).trim();
    const shadow = themeDef.shadow;

    const banner = document.createElement('div');
    banner.className = 'unit-banner';
    banner.style.background = face;
    banner.innerHTML = `
      <div class="unit-info">
        <span class="unit-icon">${unit.icon}</span>
        <div><div class="unit-name">${unit.name}</div><div class="unit-title">${unit.title}</div></div>
      </div>
      <span class="unit-badge">${unit.nodes.length} stops</span>
    `;
    wrap.appendChild(banner);

    const track = document.createElement('div');
    track.className = 'path-track';
    const svgNS = 'http://www.w3.org/2000/svg';
    const connector = document.createElementNS(svgNS, 'svg');
    connector.setAttribute('class', 'path-connector');
    const connectorPath = document.createElementNS(svgNS, 'path');
    connectorPath.setAttribute('stroke', face);
    connector.appendChild(connectorPath);
    track.appendChild(connector);

    const col = document.createElement('div');
    col.className = 'node-col';

    unit.nodes.forEach(node => {
      totalNodes++;
      if (node.status === 'complete') completeNodes++;
      const offset = ZIGZAG[globalIndex % ZIGZAG.length];
      globalIndex++;

      const item = document.createElement('div');
      item.className = `node-item is-${node.status}${node.type === 'trophy' ? ' is-trophy' : ''}`;
      item.style.transform = `translateX(${offset}px)`;

      const isLocked = node.status === 'locked';
      item.innerHTML = `
        ${node.status === 'current' ? '<span class="start-badge">START</span>' : ''}
        <button class="node-btn" style="--nb-face:${face}; --nb-shadow:${shadow}" aria-haspopup="true" aria-expanded="false">
          ${isLocked ? '🔒' : node.icon}
          ${node.status === 'complete' ? '<span class="node-check">✓</span>' : ''}
        </button>
      `;
      const btn = item.querySelector('.node-btn');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openPopover = togglePopover(item, node, { face, shadow }, openPopover, btn);
      });

      col.appendChild(item);
    });

    track.appendChild(col);
    wrap.appendChild(track);
    requestAnimationFrame(() => drawConnector(track, connectorPath, col, face));
  });

  const endNote = document.createElement('p');
  endNote.className = 'path-end';
  endNote.textContent = 'More units are on the way \u2014 keep the streak going.';
  wrap.appendChild(endNote);

  document.addEventListener('click', () => {
    if (openPopover){
      openPopover.classList.remove('is-open');
      const openItem = openPopover.closest('.node-item');
      if (openItem) openItem.style.zIndex = '';
      openPopover = null;
    }
  });

  updateProgressHeader(completeNodes, totalNodes);
}

function drawConnector(track, pathEl, col, color){
  const items = Array.from(col.children);
  if (items.length < 2) return;
  const trackRect = track.getBoundingClientRect();
  const pts = items.map(item => {
    const r = item.querySelector('.node-btn').getBoundingClientRect();
    return { x:r.left + r.width/2 - trackRect.left, y:r.top + r.height/2 - trackRect.top };
  });
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++){
    const prev = pts[i-1], cur = pts[i];
    const midY = (prev.y + cur.y) / 2;
    d += ` C ${prev.x} ${midY}, ${cur.x} ${midY}, ${cur.x} ${cur.y}`;
  }
  pathEl.setAttribute('d', d);
  pathEl.setAttribute('stroke', color);
}

function togglePopover(item, node, theme, openPopover, btn){
  const existing = item.querySelector('.node-popover');
  if (openPopover && openPopover !== existing){
    openPopover.classList.remove('is-open');
    const prevItem = openPopover.closest('.node-item');
    if (prevItem) prevItem.style.zIndex = '';
  }

  if (existing){
    const willOpen = !existing.classList.contains('is-open');
    existing.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(willOpen));
    item.style.zIndex = willOpen ? '30' : '';
    return willOpen ? existing : null;
  }

  const pop = document.createElement('div');
  pop.className = 'node-popover';
  const locked = node.status === 'locked';
  const label = locked ? 'Locked' : node.status === 'complete' ? 'Review' : 'Start';
  const vocabHtml = node.vocab ? `
    <div class="np-vocab">${node.vocab.map(v => `
      <div class="np-vocab-row"><span class="np-tulu">${v.tulu}</span><span class="np-en">${v.en}</span></div>
    `).join('')}</div>
  ` : '';
  const noteHtml = node.note ? `<div class="np-note">${node.note}</div>` : '';
  const sourceHtml = node.source ? `<div class="np-sources">Sources: ${node.source.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join(', ')}</div>` : '';
  const listHtml = node.vocab ? '' : `<ul class="np-list">${node.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
  pop.innerHTML = `
    <div class="np-title">${node.icon} ${node.title}</div>
    <p class="np-desc">${node.desc}</p>
    ${listHtml}
    ${vocabHtml}
    ${noteHtml}
    ${sourceHtml}
    <span class="np-btn ${locked ? 'is-locked' : ''}" style="${locked ? '' : `background:${theme.face};box-shadow:0 4px 0 0 ${theme.shadow}`}">${label}</span>
  `;
  pop.style.top = 'calc(100% + 10px)';
  pop.style.left = '50%';
  pop.style.marginLeft = '-140px';
  pop.addEventListener('click', e => e.stopPropagation());

  item.appendChild(pop);
  requestAnimationFrame(() => pop.classList.add('is-open'));
  btn.setAttribute('aria-expanded', 'true');
  item.style.zIndex = '30';
  return pop;
}

function updateProgressHeader(complete, total){
  const pct = total ? Math.round((complete/total) * 100) : 0;
  document.getElementById('ppFill').style.width = pct + '%';
  document.getElementById('ppCount').textContent = `${complete} / ${total}`;
  document.getElementById('ppStreak').textContent = '12';
  document.getElementById('ppGems').textContent = (complete * 45).toLocaleString();
}

window.addEventListener('resize', () => {
  document.querySelectorAll('.path-track').forEach(track => {
    const pathEl = track.querySelector('.path-connector path');
    const col = track.querySelector('.node-col');
    const color = pathEl.getAttribute('stroke');
    if (col) drawConnector(track, pathEl, col, color);
  });
});

/* ===================================================================
   THEME CUSTOMIZER — live accent color & background swapping
=================================================================== */
const DEFAULT_THEME = { accent:'#58CC02', bg:'#FFFFFF' };

function hexToRgb(hex){
  const h = hex.replace('#','');
  const full = h.length === 3 ? h.split('').map(c => c+c).join('') : h;
  const num = parseInt(full, 16);
  return { r:(num>>16)&255, g:(num>>8)&255, b:num&255 };
}
function rgbToHex(r,g,b){
  return '#' + [r,g,b].map(v => Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
}
function darken(hex, amount){
  const { r,g,b } = hexToRgb(hex);
  return rgbToHex(r*(1-amount), g*(1-amount), b*(1-amount));
}

function applyAccent(hex){
  document.documentElement.style.setProperty('--accent', hex);
  document.documentElement.style.setProperty('--accent-dark', darken(hex, 0.18));
  document.getElementById('accentCustom').value = hex;
  // refresh roadmap connector colors that read computed style at build time is fine;
  // unit colors are independent of accent by design.
}

function applyBackground(hex){
  document.documentElement.style.setProperty('--page-bg', hex);
  document.getElementById('bgCustom').value = hex;
}

function initThemeCustomizer(){
  const fab = document.getElementById('themeFab');
  const panel = document.getElementById('themePanel');
  const scrim = document.getElementById('themeScrim');
  const closeBtn = document.getElementById('themeClose');
  const resetBtn = document.getElementById('themeReset');
  const accentCustom = document.getElementById('accentCustom');
  const bgCustom = document.getElementById('bgCustom');

  const openPanel = () => { panel.classList.add('is-open'); scrim.classList.add('is-open'); fab.setAttribute('aria-expanded','true'); };
  const closePanel = () => { panel.classList.remove('is-open'); scrim.classList.remove('is-open'); fab.setAttribute('aria-expanded','false'); };

  fab.addEventListener('click', () => panel.classList.contains('is-open') ? closePanel() : openPanel());
  closeBtn.addEventListener('click', closePanel);
  scrim.addEventListener('click', closePanel);

  document.querySelectorAll('#accentSwatches [data-accent]').forEach(btn => {
    btn.addEventListener('click', () => applyAccent(btn.dataset.accent));
  });
  document.querySelectorAll('#bgSwatches [data-bg]').forEach(btn => {
    btn.addEventListener('click', () => applyBackground(btn.dataset.bg));
  });

  accentCustom.addEventListener('input', () => applyAccent(accentCustom.value));
  bgCustom.addEventListener('input', () => applyBackground(bgCustom.value));

  resetBtn.addEventListener('click', () => {
    applyAccent(DEFAULT_THEME.accent);
    applyBackground(DEFAULT_THEME.bg);
  });
}
