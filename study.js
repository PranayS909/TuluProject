/* ===================================================================
   STUDY PAGE — sectioned vocab/phrase cards, click-to-play audio.

   AUDIO FILE CONVENTION (no real recordings exist yet, but the click
   handling below is fully wired up for when they do):
     audio/<section-id>/<slugified-tulu-word>.mp3
   e.g. "Yencha ullar?" in the Greetings section looks for:
     audio/greetings/yencha-ullar.mp3
   Slugging rule: take the text before the first "/" or "(", lowercase
   it, and replace anything that isn't a-z/0-9 with a single hyphen.
   Drop real .mp3 files into those folders later and cards will just
   start playing them — no code changes needed.
=================================================================== */

function slugify(tulu){
  return tulu
    .split('/')[0].split('(')[0]
    .trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const SECTION_THEME = {
  greetings: { var:'--e1', shadow:'#46A302' },
  numbers:   { var:'--e2', shadow:'#1899D6' },
  family:    { var:'--e3', shadow:'#D97F00' },
  market:    { var:'--e4', shadow:'#A568DB' },
};

const STUDY_SECTIONS = [
  {
    id:'greetings', icon:'👋', title:'Greetings',
    desc:'The phrases you’ll actually open a conversation with.',
    crosslink:{ label:'Practice greetings in Unit 1 →', href:'unit1.html' },
    groups:[
      { name:'Everyday Greetings', items:[
        { tulu:'Yencha ullar?', en:'How are you?', emoji:'🙋' },
        { tulu:'Yaan usar ulle', en:'I am fine', emoji:'🙂' },
        { tulu:'Erena pudar enchina?', en:'What is your name?', emoji:'❓' },
        { tulu:'Yenna pudar…', en:'My name is...', emoji:'🧑' },
        { tulu:'Solmelu', en:'Thank you', emoji:'🙏' },
        { tulu:'Barpe', en:'Goodbye', emoji:'👋' },
      ]},
      { name:'Polite & Formal Phrases', items:[
        { tulu:'Swagatha', en:'Welcome', emoji:'🎉' },
        { tulu:'Ulai bale', en:'Come in (polite / formal)', emoji:'🚪' },
        { tulu:'Ulai bola', en:'Come in (casual / informal)', emoji:'🚪' },
        { tulu:'Kullule', en:'Please sit down', emoji:'🪑' },
        { tulu:'Oona aanda?', en:'Did you have food?', emoji:'🍚' },
        { tulu:'Cha aanda?', en:'Did you have tea / coffee?', emoji:'☕' },
        { tulu:'Namaskara', en:'Hello / Greetings', emoji:'🙏' },
        { tulu:'Bale', en:'Come / Welcome', emoji:'👋' },
        { tulu:'Bannaga', en:'Welcome / Upon your arrival', emoji:'🏡' },
        { tulu:'Yencha undu?', en:'How is it going?', emoji:'🤔' },
        { tulu:'Kushi aand thikaad', en:'Glad to meet you / Nice to meet you', emoji:'😊' },
        { tulu:'Yedde ponna?', en:'Is everything going well?', emoji:'👍' },
        { tulu:'Ullara?', en:'Are you there?', emoji:'📣' },
        { tulu:'Saavu', en:'Greetings / Bowing to you', emoji:'🙇' },
      ]},
    ],
  },
  {
    id:'numbers', icon:'🔢', title:'Numbers',
    desc:'Count from 1 to 100 — the tens follow one repeating pattern.',
    crosslink:{ label:'Practice counting in Unit 1 →', href:'unit1.html' },
    groups:[
      { name:'1 – 20', numeral:true, items:[
        { tulu:'onji', en:'1' }, { tulu:'raDD', en:'2' }, { tulu:'mUji', en:'3' },
        { tulu:'nAl', en:'4' }, { tulu:'ain', en:'5' }, { tulu:'Aji', en:'6' },
        { tulu:'El', en:'7' }, { tulu:'enma', en:'8' }, { tulu:'orumba', en:'9' },
        { tulu:'patt', en:'10' }, { tulu:'pattonji', en:'11' }, { tulu:'padiraDD', en:'12' },
        { tulu:'padimUji', en:'13' }, { tulu:'padinAl', en:'14' }, { tulu:'padinain', en:'15' },
        { tulu:'padinAji', en:'16' }, { tulu:'padinel', en:'17' }, { tulu:'padinenma', en:'18' },
        { tulu:'padinorumba', en:'19' }, { tulu:'irva', en:'20' },
      ]},
      { name:'Counting by Tens (20 – 100)', numeral:true,
        note:'Tulu tens follow one pattern: take the ten’s word, then add "-ttonji" (+1), "-ttraDD" (+2) and so on up to "-ttorumba" (+9) — e.g. irva → irvattonji (21), irvattraDD (22)… muppa → muppattorumba (39).',
        items:[
        { tulu:'irva', en:'20' }, { tulu:'muppa', en:'30' }, { tulu:'nalpa', en:'40' },
        { tulu:'aiva', en:'50' }, { tulu:'ajipa', en:'60' }, { tulu:'elpa', en:'70' },
        { tulu:'enpa', en:'80' }, { tulu:'sonpa', en:'90' }, { tulu:'nUdu', en:'100' },
      ]},
    ],
  },
  {
    id:'family', icon:'👪', title:'Family',
    desc:'Tulu kinship terms are very specific — a different word for almost every relation.',
    crosslink:{ label:'Practice family words in Unit 1 →', href:'unit1.html' },
    groups:[
      { name:'Immediate Family', items:[
        { tulu:'appae (amma)', en:'Mother / Mummy', emoji:'👩' },
        { tulu:'amme (ayye / poppa)', en:'Father / Daddy', emoji:'👨' },
        { tulu:'mage', en:'Son', emoji:'👦' },
        { tulu:'magal', en:'Daughter', emoji:'👧' },
        { tulu:'bAlae', en:'Child / kid / baby', emoji:'🧒' },
        { tulu:'bAlelu / jOkulu', en:'Children', emoji:'🧑‍🧑‍🧒' },
      ]},
      { name:'Siblings', items:[
        { tulu:'palaye (aNNe)', en:'Elder brother', emoji:'👦' },
        { tulu:'paldi / pali (akka)', en:'Elder sister', emoji:'👧' },
        { tulu:'megye', en:'Younger brother', emoji:'🧑' },
        { tulu:'megdi / tangaDi', en:'Younger sister', emoji:'🧑' },
      ]},
      { name:'Grandparents and Beyond', items:[
        { tulu:'ajje', en:'Grandfather', emoji:'👴' },
        { tulu:'ajji (abba)', en:'Grandmother', emoji:'👵' },
        { tulu:'pijje / pijji', en:'Great-grandmother / great-grandfather', emoji:'🧓' },
        { tulu:'pulli', en:'Grandchild', emoji:'👶' },
        { tulu:'talli', en:'Great-grandchild (or great-great-grandchild)', emoji:'👶' },
      ]},
      { name:'Spouses and In-Laws', items:[
        { tulu:'kaNDane / kaNDani', en:'Husband', emoji:'🤵' },
        { tulu:'boDedi', en:'Wife', emoji:'👰' },
        { tulu:'mAmu / mAme', en:'Father-in-law / paternal uncle', emoji:'👨' },
        { tulu:'mAmi', en:'Mother-in-law / paternal aunt', emoji:'👩' },
        { tulu:'marmaye', en:'Son-in-law / nephew', emoji:'🧑' },
        { tulu:'marmal', en:'Daughter-in-law / niece', emoji:'🧑' },
      ]},
      { name:'Extended Family', items:[
        { tulu:'tammala / tammale', en:'Maternal uncle / father-in-law’s side', emoji:'👨' },
        { tulu:'bhAve', en:'Elder brother-in-law / sister’s husband', emoji:'🧑' },
        { tulu:'nanike / maitine', en:'Younger brother-in-law / wife’s younger brother', emoji:'🧑' },
        { tulu:'attai / atyae', en:'Sister-in-law / brother’s wife', emoji:'👩' },
        { tulu:'maitidi', en:'Sister-in-law / husband’s sister', emoji:'👩' },
        { tulu:'arvatte', en:'Nephew / son-in-law relations', emoji:'🧑' },
      ]},
      { name:'Social Terms', items:[
        { tulu:'kuTuma', en:'Family', emoji:'👪' },
        { tulu:'kuTumbadalli', en:'Relatives', emoji:'👨‍👩‍👧‍👦' },
        { tulu:'sisTer', en:'Friends / well-wishers', emoji:'🧑‍🤝‍🧑' },
        { tulu:'dOsti', en:'Friend / friendship', emoji:'🤝' },
      ]},
    ],
  },
  {
    id:'market', icon:'🛒', title:'Market Words',
    desc:'What you’ll actually hear and say at a Mangalorean market.',
    crosslink:{ label:'Practice market words in Unit 2 →', href:'unit2.html' },
    groups:[
      { name:'Grains & Staples', items:[
        { tulu:'Ari', en:'Raw rice (the absolute core staple of Tulunadu)', emoji:'🍚' },
        { tulu:'Nuji', en:'Broken rice pieces', emoji:'🍚' },
        { tulu:'Artha', en:'Flour (e.g., ari artha for rice flour)', emoji:'🌾' },
        { tulu:'Bele', en:'Lentils / Dals', emoji:'🫘' },
        { tulu:'Enme', en:'Sesame oil / Cooking oil', emoji:'🛢️' },
        { tulu:'Neer', en:'Water', emoji:'💧' },
        { tulu:'Pela', en:'Milk', emoji:'🥛' },
        { tulu:'Nenpu', en:'Ghee', emoji:'🧈' },
      ]},
      { name:'Coastal Seafood', note:'Seafood is the heart of the Mangalorean market — locals judge you by how accurately you name the fish!', items:[
        { tulu:'Bangude', en:'Mackerel (most common)', emoji:'🐟' },
        { tulu:'Anjal / Surmai', en:'Kingfish (premium)', emoji:'🐟' },
        { tulu:'Boothai', en:'Sardines', emoji:'🐟' },
        { tulu:'Meen', en:'Fish (generic term)', emoji:'🐟' },
        { tulu:'Yetti', en:'Prawns / Shrimp', emoji:'🦐' },
        { tulu:'Denji', en:'Crab', emoji:'🦀' },
        { tulu:'Noonji', en:'Squid / Cuttlefish', emoji:'🦑' },
        { tulu:'Muru', en:'Reef Cod', emoji:'🐟' },
      ]},
      { name:'Spices & Aromatics', items:[
        { tulu:'Munchi', en:'Chilli (general)', emoji:'🌶️' },
        { tulu:'Paji Munchi', en:'Green chilli', emoji:'🌶️' },
        { tulu:'Kanja Munchi', en:'Dried red chilli', emoji:'🌶️' },
        { tulu:'Ulli / Nirulli', en:'Onion', emoji:'🧅' },
        { tulu:'Bollulli', en:'Garlic', emoji:'🧄' },
        { tulu:'Inji', en:'Ginger', emoji:'🫚' },
        { tulu:'Uppu', en:'Salt', emoji:'🧂' },
        { tulu:'Churki', en:'Black pepper', emoji:'⚫' },
        { tulu:'Thore', en:'Cumin', emoji:'🟤' },
        { tulu:'Sarsu', en:'Mustard seeds', emoji:'🟡' },
      ]},
      { name:'Vegetables & Fruits', items:[
        { tulu:'Thev', en:'Colocasia / Taro leaves (used to make local delicacies)', emoji:'🥬' },
        { tulu:'Pelakaayi', en:'Jackfruit (hugely important in local cuisine)', emoji:'🍈' },
        { tulu:'Kanchala', en:'Bitter gourd', emoji:'🥒' },
        { tulu:'Padpe', en:'Amaranth leaves / Red spinach', emoji:'🥬' },
        { tulu:'Kumbala', en:'Pumpkin', emoji:'🎃' },
        { tulu:'Bende', en:'Okra / Ladyfinger', emoji:'🫛' },
        { tulu:'Parangi Pelakaayi', en:'Papaya or Pineapple (depending on the micro-dialect zone)', emoji:'🍍' },
        { tulu:'Gua', en:'Guava', emoji:'🍈' },
        { tulu:'Booruda', en:'Watermelon', emoji:'🍉' },
        { tulu:'Baajil', en:'Beaten rice / Poha', emoji:'🍚' },
      ]},
    ],
  },
];

let heardWords = new Set();
let learnedWords = new Set();
let totalWords = 0;

function playAudio(card, sectionId, tuluWord){
  const src = `audio/${sectionId}/${slugify(tuluWord)}.mp3`;
  const audio = new Audio(src);
  card.classList.add('is-playing');
  const clearPlaying = () => card.classList.remove('is-playing');

  audio.addEventListener('ended', clearPlaying);
  audio.addEventListener('error', () => {
    clearPlaying();
    card.classList.add('no-audio-known');
    card.classList.remove('has-audio');
    card.classList.add('is-noaudio-flash');
    setTimeout(() => card.classList.remove('is-noaudio-flash'), 400);
    showToast(`🔇 No recording yet for "${tuluWord}" — text-only for now.`);
  });

  audio.play().then(() => {
    card.classList.add('has-audio');
    card.classList.remove('no-audio-known');
  }).catch(() => {
    clearPlaying();
    card.classList.add('no-audio-known');
    card.classList.add('is-noaudio-flash');
    setTimeout(() => card.classList.remove('is-noaudio-flash'), 400);
    showToast(`🔇 No recording yet for "${tuluWord}" — text-only for now.`);
  });
}

let toastTimer = null;
function showToast(msg){
  const toast = document.getElementById('studyToast');
  toast.textContent = msg;
  toast.classList.add('is-shown');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-shown'), 2200);
}

function updateMeta(){
  document.getElementById('metaHeard').textContent = heardWords.size;
  document.getElementById('metaTotal').textContent = totalWords;
}

function buildCard(sectionId, item, theme, isNumeral){
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'study-card';
  const wordKey = `${sectionId}::${item.tulu}`;

  const media = isNumeral
    ? `<span class="study-card-numeral">${item.en}</span>`
    : `<span class="study-card-emoji">${item.emoji || '🗣️'}</span>`;

  card.innerHTML = `
    <div class="study-card-top">
      ${media}
      <span class="study-speaker" aria-hidden="true">🔊</span>
    </div>
    <div class="study-card-tulu">${item.tulu}</div>
    <div class="study-card-en">${isNumeral ? 'tap to hear it spoken' : item.en}</div>
    <span class="study-card-learned" title="Mark as learned">✓</span>
  `;

  card.addEventListener('click', (e) => {
    if (e.target.closest('.study-card-learned')){
      e.stopPropagation();
      card.classList.toggle('is-learned');
      if (card.classList.contains('is-learned')) learnedWords.add(wordKey);
      else learnedWords.delete(wordKey);
      return;
    }
    heardWords.add(wordKey);
    updateMeta();
    playAudio(card, sectionId, item.tulu);
  });

  return card;
}

function renderSections(){
  const main = document.getElementById('studyMain');
  const jumpnav = document.getElementById('studyJumpnav');
  const rootStyle = getComputedStyle(document.documentElement);

  STUDY_SECTIONS.forEach(section => {
    const theme = SECTION_THEME[section.id];
    const face = rootStyle.getPropertyValue(theme.var).trim();

    // jump nav pill
    const pill = document.createElement('a');
    pill.href = `#sec-${section.id}`;
    pill.className = 'study-jump-btn';
    pill.dataset.section = section.id;
    pill.innerHTML = `${section.icon} ${section.title}`;
    pill.style.setProperty('--pill-face', face);
    jumpnav.appendChild(pill);

    // section
    const sectionEl = document.createElement('section');
    sectionEl.className = 'study-section';
    sectionEl.id = `sec-${section.id}`;

    const head = document.createElement('div');
    head.className = 'study-section-head';
    head.innerHTML = `
      <div class="study-section-icon" style="--c:${face}">${section.icon}</div>
      <div>
        <h2>${section.title}</h2>
        <p>${section.desc}</p>
      </div>
    `;
    sectionEl.appendChild(head);

    section.groups.forEach(group => {
      const groupEl = document.createElement('div');
      groupEl.className = 'study-group';
      groupEl.innerHTML = `
        <div class="study-group-head">
          <span class="study-group-name">${group.name}</span>
          <span class="study-group-count">${group.items.length} words</span>
        </div>
        ${group.note ? `<div class="study-group-note">${group.note}</div>` : ''}
      `;
      const grid = document.createElement('div');
      grid.className = 'study-grid';
      group.items.forEach(item => {
        totalWords++;
        grid.appendChild(buildCard(section.id, item, theme, !!group.numeral));
      });
      groupEl.appendChild(grid);
      sectionEl.appendChild(groupEl);
    });

    if (section.crosslink){
      const link = document.createElement('a');
      link.href = section.crosslink.href;
      link.className = 'study-crosslink';
      link.textContent = section.crosslink.label;
      sectionEl.appendChild(link);
    }

    main.appendChild(sectionEl);
  });

  updateMeta();
  setupScrollSpy();
}

function setupScrollSpy(){
  const pills = Array.from(document.querySelectorAll('.study-jump-btn'));
  const sections = STUDY_SECTIONS.map(s => document.getElementById(`sec-${s.id}`));

  function setActive(id){
    pills.forEach(p => {
      const active = p.dataset.section === id;
      p.classList.toggle('is-active', active);
      p.style.background = active ? p.style.getPropertyValue('--pill-face') : '';
      p.style.borderColor = active ? 'transparent' : '';
    });
  }

  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id.replace('sec-', ''));
      });
    }, { rootMargin: '-140px 0px -70% 0px', threshold: 0 });
    sections.forEach(s => s && io.observe(s));
  }

  if (pills[0]) setActive(pills[0].dataset.section);
}

document.addEventListener('DOMContentLoaded', renderSections);
