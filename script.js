/* ===================================================================
   TULU LANDING PAGE — behaviour
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initLeaderboard();
  initRoadmap();
});

/* ---------- NAV: scroll shadow + mobile toggle ---------- */
function initNav(){
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    links.style.cssText = open
      ? 'display:flex;flex-direction:column;gap:16px;position:absolute;top:100%;left:0;right:0;background:#12332C;padding:20px 24px;'
      : '';
  });

  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('is-open');
    links.style.cssText = '';
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

/* ---------- Scroll reveal ---------- */
function initReveal(){
  const targets = document.querySelectorAll(
    '.history-col, .lb-panel, .stop, .hero-stats'
  );
  targets.forEach(el => el.setAttribute('data-reveal', ''));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold:0.15, rootMargin:'0px 0px -40px 0px' });

  targets.forEach(el => io.observe(el));
}

/* ---------- Leaderboard ---------- */
const LEADERBOARD_DATA = {
  weekly: [
    { name:'Ashwini Poojary', streak:21, xp:2840, initials:'AP', color:'#D3A02C' },
    { name:'Rohan Kotian',    streak:14, xp:2615, initials:'RK', color:'#4C8B7E' },
    { name:'Meera Shetty',    streak:9,  xp:2390, initials:'MS', color:'#BE4626' },
    { name:'Yusuf Baig',      streak:12, xp:2110, initials:'YB', color:'#2F6E63' },
    { name:'Divya Amin',      streak:6,  xp:1875, initials:'DA', color:'#9C3A1E' },
    { name:'Prakash Rai',     streak:5,  xp:1640, initials:'PR', color:'#D3A02C' },
    { name:'Sana Fernandes',  streak:8,  xp:1520, initials:'SF', color:'#4C8B7E' },
  ],
  alltime: [
    { name:'Ashwini Poojary', streak:118, xp:41200, initials:'AP', color:'#D3A02C' },
    { name:'Bhavya Kulal',    streak:95,  xp:38750, initials:'BK', color:'#BE4626' },
    { name:'Rohan Kotian',    streak:87,  xp:35980, initials:'RK', color:'#4C8B7E' },
    { name:'Meera Shetty',    streak:70,  xp:29410, initials:'MS', color:'#2F6E63' },
    { name:'Imran Salian',    streak:64,  xp:27305, initials:'IS', color:'#9C3A1E' },
    { name:'Yusuf Baig',      streak:58,  xp:24870, initials:'YB', color:'#D3A02C' },
    { name:'Divya Amin',      streak:44,  xp:19960, initials:'DA', color:'#4C8B7E' },
  ]
};

function initLeaderboard(){
  const table = document.getElementById('lbTable');
  const tabs = document.querySelectorAll('.lb-tab');

  const render = (range) => {
    // remove existing data rows
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
const ROADMAP_DATA = [
  {
    level:'Stage 1', title:'First words', status:'complete',
    desc:'Greetings, introducing yourself, and the sounds of Tulu that don\u2019t exist in English.',
    items:['Greetings & politeness', 'Tulu vowel & consonant sounds', 'Numbers 1–20']
  },
  {
    level:'Stage 2', title:'Everyday Tulu', status:'complete',
    desc:'Family terms, food vocabulary, and simple present-tense sentences.',
    items:['Family & kinship terms', 'Market & food vocabulary', 'Simple sentence order']
  },
  {
    level:'Stage 3', title:'Grammar foundations', status:'current',
    desc:'Verb conjugation, question forms, and the case markers that shape Tulu sentences.',
    items:['Present, past & future verbs', 'Asking questions', 'Case markers']
  },
  {
    level:'Stage 4', title:'Reading Kannada-script Tulu', status:'upcoming',
    desc:'Most modern Tulu writing uses the Kannada script — learn to read and write it fluently.',
    items:['Kannada script basics', 'Reading short passages', 'Writing practice']
  },
  {
    level:'Stage 5', title:'Culture in context', status:'upcoming',
    desc:'Vocabulary and listening drawn from Yakshagana, Kambala, and Bhuta Kola traditions.',
    items:['Festival & ritual vocabulary', 'Listening: folk songs', 'Regional dialect variation']
  },
  {
    level:'Stage 6', title:'The Tigalari script', status:'upcoming',
    desc:'An introduction to Tulu\u2019s own historical script, for reading old manuscripts and inscriptions.',
    items:['Tigalari letterforms', 'Reading short inscriptions', 'History of the script']
  },
];

function initRoadmap(){
  const list = document.getElementById('riverStops');

  ROADMAP_DATA.forEach((stage, i) => {
    const li = document.createElement('li');
    li.className = `stop${stage.status === 'complete' ? ' is-complete' : ''}${stage.status === 'current' ? ' is-current' : ''}`;

    const nodeLabel = stage.status === 'complete' ? '✓' : String(i + 1);

    li.innerHTML = `
      <div class="stop-node">${nodeLabel}</div>
      <div class="stop-body">
        <span class="stop-level">${stage.level}${stage.status === 'current' ? ' · in progress' : ''}</span>
        <h3 class="stop-title">${stage.title}</h3>
        <p class="stop-desc">${stage.desc}</p>
        <div class="stop-detail">
          <ul>${stage.items.map(it => `<li>${it}</li>`).join('')}</ul>
        </div>
        <button class="stop-toggle" aria-expanded="false">
          <span class="toggle-text">What's inside</span>
          <svg viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    `;

    const toggleBtn = li.querySelector('.stop-toggle');
    toggleBtn.addEventListener('click', () => {
      const open = li.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', String(open));
      toggleBtn.querySelector('.toggle-text').textContent = open ? "Hide" : "What's inside";
    });

    list.appendChild(li);
  });
}
