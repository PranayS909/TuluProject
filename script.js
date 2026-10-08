/* ===================================================================
   TULU HOMEPAGE — behaviour
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initLeaderboard();
  initCourse();
  initSceneAudio();
  initReveal();
  initFaqSchema();
});

/* ---------- NAV ---------- */
function initNav(){
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!nav) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    if (toggle){
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
  };
  if (toggle) toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  if (links) links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });
}

/* ---------- Scroll reveal ---------- */
function initReveal(){
  const targets = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)){
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }
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

/* ---------- "A first word" audio ---------- */
function initSceneAudio(){
  const btn = document.getElementById('sceneHear');
  if (!btn || typeof audioSrc !== 'function') return;
  const src = audioSrc('Namaskara');
  if (!src){ btn.hidden = true; return; }
  btn.addEventListener('click', () => {
    const audio = new Audio(src);
    btn.classList.add('is-playing');
    const done = () => btn.classList.remove('is-playing');
    audio.addEventListener('ended', done);
    audio.addEventListener('error', done);
    audio.play().catch(done);
  });
}

/* ---------- Leaderboard ---------- */
const LEADERBOARD_DATA = {
  weekly: [
    { name:'Ashwini Poojary', streak:21, xp:2840, initials:'AP' },
    { name:'Rohan Kotian',    streak:14, xp:2615, initials:'RK' },
    { name:'Meera Shetty',    streak:9,  xp:2390, initials:'MS' },
    { name:'Yusuf Baig',      streak:12, xp:2110, initials:'YB' },
    { name:'Divya Amin',      streak:6,  xp:1875, initials:'DA' },
    { name:'Prakash Rai',     streak:5,  xp:1640, initials:'PR' },
    { name:'Sana Fernandes',  streak:8,  xp:1520, initials:'SF' },
  ],
  alltime: [
    { name:'Ashwini Poojary', streak:118, xp:41200, initials:'AP' },
    { name:'Bhavya Kulal',    streak:95,  xp:38750, initials:'BK' },
    { name:'Rohan Kotian',    streak:87,  xp:35980, initials:'RK' },
    { name:'Meera Shetty',    streak:70,  xp:29410, initials:'MS' },
    { name:'Imran Salian',    streak:64,  xp:27305, initials:'IS' },
    { name:'Yusuf Baig',      streak:58,  xp:24870, initials:'YB' },
    { name:'Divya Amin',      streak:44,  xp:19960, initials:'DA' },
  ]
};

function initLeaderboard(){
  const table = document.getElementById('lbTable');
  const tabs = document.querySelectorAll('.lb-tab');
  if (!table) return;

  const render = (range) => {
    table.querySelectorAll('.lb-row--data').forEach(r => r.remove());
    LEADERBOARD_DATA[range].forEach((person, i) => {
      const rank = i + 1;
      const row = document.createElement('div');
      row.className = `lb-row lb-row--data${rank === 1 ? ' is-first' : ''}`;
      row.setAttribute('role', 'row');
      row.innerHTML = `
        <span class="lb-rank${rank <= 3 ? ' is-top' : ''}" role="cell">${String(rank).padStart(2, '0')}</span>
        <span class="lb-user" role="cell">
          <span class="lb-avatar" aria-hidden="true">${person.initials}</span>
          <span class="lb-name">${person.name}</span>
        </span>
        <span class="lb-streak" role="cell">${person.streak} days</span>
        <span class="lb-xp" role="cell">${person.xp.toLocaleString()}</span>
      `;
      table.appendChild(row);
    });
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      render(tab.dataset.range);
    });
  });

  render('weekly');
}

/* ---------- Course syllabus ---------- */
const ROADMAP_UNITS = [
  {
    name:'Unit 1', title:'First Words',
    nodes:[
      { type:'lesson', title:'Greetings', status:'complete',
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
      { type:'lesson', title:'Numbers 1–20', status:'complete',
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
      { type:'chest', title:'Bonus: Tongue-Twisters', status:'complete',
        desc:'A playful bonus round of classic Tulu tongue-twisters.',
        items:['Rhythm & pronunciation','Fun local phrases'],
        note:'Real Tulu tongue-twisters are thin on the open web — native speakers or Tulu community groups are a better source than any site found so far.',
        source:[{label:'Quora — Tulu slang thread (starting point)', url:'https://www.quora.com/What-are-some-tulu-slangs'}] },
      { type:'lesson', title:'Family Words', status:'complete',
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
      { type:'trophy', title:'Unit 1 Complete', status:'complete',
        desc:'You can greet people, count, and talk about family in Tulu.',
        items:['Review all Unit 1 skills'] },
    ]
  },
  {
    name:'Unit 2', title:'Everyday Tulu',
    nodes:[
      { type:'lesson', title:'Food & Market', status:'complete',
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
      { type:'lesson', title:'Simple Sentences', status:'complete',
        desc:'Build basic present-tense sentences with correct word order.',
        items:['Subject–object–verb order','Present tense basics','Everyday statements'],
        vocab:[
          {tulu:'yAn pOpae', en:'I go'}, {tulu:'Aye pOpe', en:'he goes'},
          {tulu:'mOlu pOpal', en:'she goes'}, {tulu:'yAn sAleg pOpae', en:'I go to school'},
          {tulu:'enkulu dinola pEpar Oduva', en:'we read the newspaper daily'},
        ],
        note:'Pattern: short verbs take “-p-” + ending (pO → pOpe, “he goes”); longer verbs take “-uv-” + ending (mAr → mAruve, “he sells”).',
        source:[{label:'Easy Tulu — Lesson 3: Simple Present Tense', url:'https://www.easytulu.com/2016/02/tulu-lesson-3-simple-present-tense.html'}] },
      { type:'chest', title:'Bonus: Coastal Slang', status:'current',
        desc:'Casual, everyday expressions you’ll actually hear on the coast.',
        items:['Informal greetings','Local expressions'],
        note:'Idioms and slang need a native speaker to vet — the links below are a starting point, not a vocab list to copy verbatim.',
        source:[{label:'Raveesh Kumar — Tulu/Kannada idioms & sayings', url:'https://www.raveeshkumar.com/2011/11/learn-tulu-idioms-sayings-with.html'},
                {label:'Quora — Tulu slang thread', url:'https://www.quora.com/What-are-some-tulu-slangs'}] },
      { type:'lesson', title:'Questions & Verbs', status:'locked',
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
      { type:'trophy', title:'Unit 2 Complete', status:'locked',
        desc:'Hold a basic everyday conversation in Tulu.',
        items:['Review all Unit 2 skills'] },
    ]
  },
  {
    name:'Unit 3', title:'Reading Tulu',
    nodes:[
      { type:'lesson', title:'Kannada Script', status:'locked',
        desc:'Most modern Tulu writing uses the Kannada script — start reading it.',
        items:['Vowels & consonants','Combining letters','Common words'] },
      { type:'lesson', title:'Reading Practice', status:'locked',
        desc:'Read short everyday passages, signs, and menus.',
        items:['Short passages','Signs & labels','Comprehension checks'] },
      { type:'chest', title:'Bonus: Proverbs', status:'locked',
        desc:'Classic Tulu proverbs and what they reveal about coastal life.',
        items:['Proverbs & meanings'] },
      { type:'lesson', title:'Writing Practice', status:'locked',
        desc:'Write simple words and sentences in the Kannada script.',
        items:['Handwriting basics','Spelling practice','Simple composition'] },
      { type:'trophy', title:'Unit 3 Complete', status:'locked',
        desc:'Read and write everyday Tulu confidently.',
        items:['Review all Unit 3 skills'] },
    ]
  },
  {
    name:'Unit 4', title:'Culture Deep-Dive',
    nodes:[
      { type:'lesson', title:'Kambala & Festivals', status:'locked',
        desc:'Vocabulary from Kambala buffalo races, Dasara, and the Tulu New Year.',
        items:['Festival terms','Kambala vocabulary'] },
      { type:'lesson', title:'Folk Songs', status:'locked',
        desc:'Listen to Paddana-style oral songs and pick out key phrases.',
        items:['Listening practice','Recognising sung Tulu','Regional dialect variation'] },
      { type:'chest', title:'Bonus: Bhoota Kola', status:'locked',
        desc:'Vocabulary around the spirit-possession ritual and its performance.',
        items:['Ritual terms','Cultural context'] },
      { type:'lesson', title:'Tigalari Script', status:'locked',
        desc:'An introduction to Tulu\u2019s own historical script.',
        items:['Tigalari letterforms','Reading short inscriptions','History of the script'] },
      { type:'trophy', title:'Course Complete', status:'locked',
        desc:'From first greeting to reading historical Tulu inscriptions.',
        items:['Review all skills'] },
    ]
  },
];

// Units with a practice page of their own
const UNIT_PRACTICE = { 'Unit 1':'unit1.html', 'Unit 2':'unit2.html' };

const STATUS_LABEL = { complete:'Complete', current:'Up next', locked:'Coming soon' };
const TYPE_TAG = { chest:'Bonus', trophy:'Review' };

function escapeHtml(s){
  return String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
}

function initCourse(){
  const wrap = document.getElementById('pathWrap');
  if (!wrap) return;
  let total = 0, complete = 0;

  ROADMAP_UNITS.forEach((unit, u) => {
    const states = unit.nodes.map(n => n.status);
    const unitState = states.every(s => s === 'complete') ? 'done'
      : states.some(s => s !== 'locked') ? 'active' : 'later';
    const unitStateLabel = { done:'Complete', active:'In progress', later:'Coming soon' }[unitState];

    const card = document.createElement('article');
    card.className = 'unit card';
    card.setAttribute('data-reveal', '');

    const practice = UNIT_PRACTICE[unit.name]
      ? `<a class="arrow-link unit-practice" href="${UNIT_PRACTICE[unit.name]}">Practise this unit <span class="arr" aria-hidden="true">→</span></a>`
      : '';

    card.innerHTML = `
      <header class="unit-head">
        <div>
          <p class="unit-label">${unit.name} · ${unit.nodes.length} lessons</p>
          <h3 class="unit-title">${unit.title}</h3>
        </div>
        <span class="unit-state is-${unitState}">${unitStateLabel}</span>
      </header>
      ${practice}
      <ol class="lessons"></ol>
    `;

    const list = card.querySelector('.lessons');
    unit.nodes.forEach((node, n) => {
      total++;
      if (node.status === 'complete') complete++;
      list.appendChild(lessonItem(node, `${u + 1}.${n + 1}`));
    });

    wrap.appendChild(card);
  });

  const pct = total ? Math.round((complete / total) * 100) : 0;
  document.getElementById('ppCount').textContent = `${complete} / ${total}`;
  document.getElementById('ppBar').setAttribute('aria-valuenow', String(pct));
  requestAnimationFrame(() => { document.getElementById('ppFill').style.width = pct + '%'; });
}

function lessonItem(node, idx){
  const li = document.createElement('li');
  li.className = `lesson is-${node.status}`;
  const tag = TYPE_TAG[node.type] ? `<span class="lesson-tag">${TYPE_TAG[node.type]}</span>` : '';
  const title = node.title.replace(/^Bonus:\s*/, '');

  const vocab = node.vocab
    ? `<table class="vocab-table"><tbody>${node.vocab.map(v => `<tr><td>${escapeHtml(v.tulu)}</td><td>${escapeHtml(v.en)}</td></tr>`).join('')}</tbody></table>`
    : `<ul class="lesson-list">${node.items.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`;
  const note = node.note ? `<p class="lesson-note">${escapeHtml(node.note)}</p>` : '';
  const sources = node.source
    ? `<p class="lesson-sources">Sources: ${node.source.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${escapeHtml(s.label)}</a>`).join(', ')}</p>`
    : '';

  li.innerHTML = `
    <details>
      <summary>
        <span class="lesson-idx">${idx}</span>
        <span class="lesson-name">${escapeHtml(title)}${tag}</span>
        <span class="lesson-status">${STATUS_LABEL[node.status]}</span>
        <span class="lesson-chev" aria-hidden="true"></span>
      </summary>
      <div class="lesson-body">
        <p>${escapeHtml(node.desc)}</p>
        ${vocab}
        ${note}
        ${sources}
      </div>
    </details>
  `;
  return li;
}

/* ---------- FAQ structured data ----------
   Builds schema.org FAQPage JSON-LD from the visible #faqList, so
   search engines can show the answers and the two never drift apart. */
function initFaqSchema(){
  const items = document.querySelectorAll('#faqList .faq-item');
  if (!items.length) return;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: Array.from(items).map(item => ({
      '@type': 'Question',
      name: item.querySelector('summary').textContent.trim(),
      acceptedAnswer: { '@type': 'Answer', text: item.querySelector('p').textContent.replace(/\s+/g, ' ').trim() },
    })),
  };
  const tag = document.createElement('script');
  tag.type = 'application/ld+json';
  tag.textContent = JSON.stringify(schema);
  document.head.appendChild(tag);
}
