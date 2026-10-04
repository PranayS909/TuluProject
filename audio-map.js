/* ===================================================================
   AUDIO MAP — which recording goes with which Tulu word.
   Used by study.html, dictionary.html and unit1.html.

   The recordings in audio/ are named after the English meaning
   (e.g. family-members/husband.m4a), so each Tulu term is listed here
   with its file. Keys must match the term exactly as written in the
   word lists (vocab-data.js / unit1.js). Where the two lists spell a
   word differently, both spellings are listed.

   To add a recording: put the file in audio/<folder>/ and add a line.
   Words with no line here show a muted speaker instead of erroring.
=================================================================== */

const AUDIO_FILES = {
  /* ---------- greetings ---------- */
  'Namaskara':          'greetings/hello.m4a',
  'Swagatha':           'greetings/welcome.m4a',
  'Ulai bale':          'greetings/come-in-politley.m4a',
  'Ulai bola':          'greetings/come-in-casual.m4a',
  'Ulai bala':          'greetings/come-in-casual.m4a',
  'Kullule':            'greetings/please-sit-down.m4a',
  'Cha aanda?':         'greetings/did-you-have-tea-or-coffee.m4a',
  'Bale':               'greetings/come-welcome.m4a',
  'Bannaga':            'greetings/welcome-upon-arrival.m4a',
  'Yencha undu?':       'greetings/how-is-it-going.m4a',
  'Kushi aand thikaad': 'greetings/glad-to-meet-you.m4a',
  'Yedde ponna?':       'greetings/is-everything-going-well.m4a',
  'Ullara?':            'greetings/are-you-there.m4a',
  'Saavu':              'greetings/greetings-bowing-to-you.m4a',

  /* ---------- numbers ---------- */
  'onji':'numbers/onji.m4a', 'raDD':'numbers/radd.m4a', 'mUji':'numbers/muji.m4a',
  'nAl':'numbers/nal.m4a', 'ain':'numbers/ain.m4a', 'Aji':'numbers/aji.m4a',
  'El':'numbers/el.m4a', 'enma':'numbers/enma.m4a', 'orumba':'numbers/orumba.m4a',
  'patt':'numbers/oatt.m4a', 'pattonji':'numbers/pattonji.m4a', 'padiraDD':'numbers/padiradd.m4a',
  'padimUji':'numbers/padimuji.m4a', 'padinAl':'numbers/padinal.m4a', 'padinain':'numbers/padinain.m4a',
  'padinAji':'numbers/padinaji.m4a', 'padinel':'numbers/padinel.m4a', 'padinenma':'numbers/padinenma.m4a',
  'padinorumba':'numbers/padinorumba.m4a', 'irva':'numbers/irva.m4a',
  'muppa':'numbers/muppa.m4a', 'nalpa':'numbers/nalpa.m4a', 'aiva':'numbers/aiva.m4a',
  'ajipa':'numbers/ajipa.m4a', 'elpa':'numbers/elpa.m4a', 'enpa':'numbers/enpa.m4a',
  'sonpa':'numbers/sonpa.m4a', 'nUdu':'numbers/nudu.m4a',

  /* ---------- family ---------- */
  'appae (amma)':          'family-members/mom.m4a',
  'amme (ayye / poppa)':   'family-members/dad.m4a',
  'mage':                  'family-members/son.m4a',
  'magal':                 'family-members/daughter.m4a',
  'bAlae':                 'family-members/child.m4a',
  'bAlelu / jOkulu':       'family-members/children.m4a',
  'palaye (aNNe)':         'family-members/elder-brother.m4a',
  'paldi / pali (akka)':   'family-members/elder-sister.m4a',
  'megye':                 'family-members/younger-brother.m4a',
  'megdi / tangaDi':       'family-members/yonger-sister.m4a',
  'ajje':                  'family-members/grandpa.m4a',
  'ajji (abba)':           'family-members/grandma.m4a',
  'pulli':                 'family-members/grandchild.m4a',
  'talli':                 'family-members/great-grand-child-or-great-great-grand-child.m4a',
  'kaNDane / kaNDani':     'family-members/husband.m4a',
  'boDedi':                'family-members/wife.m4a',
  'mAmu / mAme':           'family-members/father-in-law.m4a',
  'mAmi':                  'family-members/mother-in-law.m4a',
  'marmaye':               'family-members/son-in-law.m4a',
  'marmal':                'family-members/daughter-in-law.m4a',
  'tammala / tammale':     'family-members/maternal-uncle.m4a',
  'bhAve':                 'family-members/elder-brother-in-law.m4a',
  'nanike / maitine':      'family-members/younger-brother-in-law.m4a',
  'attai / atyae':         'family-members/sister-in-law-brothers-wife.m4a',
  'maitidi':               'family-members/sister-in-law-husbands-sister.m4a',
  'arvatte':               'family-members/nephew.m4a',
  'kuTuma':                'family-members/family.m4a',
  'kuTumbadalli':          'family-members/relatives.m4a',
  'sisTer':                'family-members/friends.m4a',

  /* ---------- market: grains & staples ---------- */
  'Ari':   'grains-and-staples/Raw rice.m4a',
  'Nuji':  'grains-and-staples/Broken rice pieces.m4a',
  'Artha': 'grains-and-staples/Flour.m4a',
  'Bele':  'grains-and-staples/Lentils.m4a',
  'Enme':  'grains-and-staples/Sesame oil.m4a',
  'Neer':  'grains-and-staples/Water.m4a',
  'Pela':  'grains-and-staples/Milk.m4a',
  'Nenpu': 'grains-and-staples/Ghee.m4a',

  /* ---------- market: coastal seafood ---------- */
  'Bangude':        'coastal-seafood/mackarel-fish.m4a',
  'Anjal / Surmai': 'coastal-seafood/kingfish.m4a',
  'Boothai':        'coastal-seafood/sardines.m4a',
  'Meen':           'coastal-seafood/fish.m4a',
  'Yetti':          'coastal-seafood/prawns.m4a',
  'Denji':          'coastal-seafood/crab.m4a',
  'Noonji':         'coastal-seafood/squid.m4a',
  'Muru':           'coastal-seafood/reef-cod.m4a',

  /* ---------- market: spices & aromatics ---------- */
  'Munchi':         'spices-and-aromatics/chili.m4a',
  'Paji Munchi':    'spices-and-aromatics/green-chili.m4a',
  'Kanja Munchi':   'spices-and-aromatics/dried-red-chili.m4a',
  'Ulli / Nirulli': 'spices-and-aromatics/onion.m4a',
  'Bollulli':       'spices-and-aromatics/garlic.m4a',
  'Inji':           'spices-and-aromatics/ginger.m4a',
  'Uppu':           'spices-and-aromatics/salt.m4a',
  'Churki':         'spices-and-aromatics/black-pepper.m4a',
  'Thore':          'spices-and-aromatics/cumin.m4a',
  'Sarsu':          'spices-and-aromatics/mustard-seeds.m4a',

  /* ---------- market: vegetables & fruits ---------- */
  'Thev':              'vegetables-and-fruits/taro-leaves.m4a',
  'Pelakaayi':         'vegetables-and-fruits/jackfruit.m4a',
  'Kanchala':          'vegetables-and-fruits/bitter-gourd.m4a',
  'Padpe':             'vegetables-and-fruits/amaranth-leaves.m4a',
  'Kumbala':           'vegetables-and-fruits/pumpkin.m4a',
  'Bende':             'vegetables-and-fruits/okra.m4a',
  'Parangi Pelakaayi': 'vegetables-and-fruits/papaya-or-pineapple.m4a',
  'Gua':               'vegetables-and-fruits/guava.m4a',
  'Booruda':           'vegetables-and-fruits/watermelon.m4a',
  'Baajil':            'vegetables-and-fruits/beaten-rice-poha.m4a',
};

/* Shorter spellings also find a recording: "appae" and "amma" both
   find "appae (amma)", and "munchi" finds "Munchi". Built from the
   keys above (split on "/" and brackets, case-insensitive). */
const AUDIO_ALIASES = {};
Object.entries(AUDIO_FILES).forEach(([term, file]) => {
  [term, ...term.split(/[\/()]/)].forEach(part => {
    const key = part.trim().toLowerCase();
    if (key && !(key in AUDIO_ALIASES)) AUDIO_ALIASES[key] = file;
  });
});

// URL for a term's recording, or null if it hasn't been recorded yet.
// encodeURI handles the file names that contain spaces.
function audioSrc(term){
  if (!term) return null;
  const file = AUDIO_FILES[term] || AUDIO_ALIASES[term.trim().toLowerCase()];
  return file ? encodeURI(`audio/${file}`) : null;
}

// Play a term's recording. Calls onMissing if there isn't one (or it
// fails to play). Starting a new clip stops the previous one.
let currentClip = null;
function playTerm(term, onMissing){
  const src = audioSrc(term);
  if (!src){ if (onMissing) onMissing(); return null; }
  if (currentClip) currentClip.pause();
  currentClip = new Audio(src);
  currentClip.play().catch(() => { if (onMissing) onMissing(); });
  return currentClip;
}

// The "quoted" Tulu word shown in a quiz prompt, if it has a recording.
// Safe to play before answering: the word is already on screen.
function quizPromptTerm(q){
  const quoted = (q.prompt.match(/"([^"]+)"/) || [])[1];
  return audioSrc(quoted) ? quoted : null;
}

// The Tulu word to play once a quiz question is answered: the answer
// if that's Tulu, otherwise the word in the prompt.
function quizAudioTerm(q){
  return audioSrc(q.answer) ? q.answer : quizPromptTerm(q);
}

// Marks a word chip that has a recording, so CSS can show a 🔊.
function markAudioChip(chip, term){
  chip.classList.toggle('has-audio', !!audioSrc(term));
}
