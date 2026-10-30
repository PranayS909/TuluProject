/* ===================================================================
   UNIT 3: READING TULU — content only (games live in unit-engine.js).
   Most Tulu today is printed in the Kannada script, as are the signs
   and menus across Tulu Nadu, so this unit teaches reading it.

   Letters come from lipi-data.js (generated from the Unicode tables).
   The word lists below are DRAFT: they haven't yet been checked by a
   Tulu speaker. Fix anything wrong right here.
=================================================================== */

const KN_VOWELS = LIPI_VOWELS.map(v => ({ kn:v.kn, rom:v.rom }));
const KN_CONSONANTS = LIPI_CONSONANT_GROUPS.flatMap(g => g.items).map(c => ({ kn:c.kn, rom:c.rom }));

// Words from Units 1–2, now written in Kannada script.
const KNOWN_WORDS = [
  { kn:'ನಮಸ್ಕಾರ', rom:'namaskāra', en:'hello' },
  { kn:'ನೀರ್', rom:'nīr', en:'water' },
  { kn:'ತುಳು', rom:'tuḷu', en:'Tulu' },
  { kn:'ಒಂಜಿ', rom:'onji', en:'one' },
  { kn:'ರಡ್ಡ್', rom:'raḍḍ', en:'two' },
  { kn:'ಮೂಜಿ', rom:'mūji', en:'three' },
  { kn:'ನಾಲ್', rom:'nāl', en:'four' },
  { kn:'ಐನ್', rom:'ain', en:'five' },
  { kn:'ಅಜ್ಜಿ', rom:'ajji', en:'grandmother' },
  { kn:'ಮಗಳ್', rom:'magaḷ', en:'daughter' },
];

// Signs you'll see around Mangaluru and Udupi. Signs are mostly in
// Kannada, so some of these are Kannada words rather than Tulu.
const SIGNBOARDS = [
  { kn:'ಹೋಟೆಲ್', rom:'hōṭel', en:'hotel / restaurant' },
  { kn:'ಬಸ್ ನಿಲ್ದಾಣ', rom:'bas nildāṇa', en:'bus stand' },
  { kn:'ಮೀನ್ ಊಟ', rom:'mīn ūṭa', en:'fish meal' },
  { kn:'ಅಂಗಡಿ', rom:'aṅgaḍi', en:'shop' },
  { kn:'ಮಂಗಳೂರು', rom:'maṅgaḷūru', en:'Mangaluru' },
  { kn:'ಕುಡ್ಲ', rom:'kuḍla', en:'Kudla (the Tulu name for Mangaluru)' },
  { kn:'ಉಡುಪಿ', rom:'uḍupi', en:'Udupi' },
];

// "Which letter makes this sound?" — built from the letter tables.
function letterQuestions(letters, count){
  return shuffle(letters).slice(0, count).map(answer => ({
    prompt:`Which letter makes the sound "${answer.rom}"?`,
    answer:answer.kn,
    choices:[answer.kn, ...shuffle(letters.filter(l => l !== answer)).slice(0, 3).map(l => l.kn)],
  }));
}

/* ---------------------------------------------------------------
   UNIT CONFIG — run by unit-engine.js
--------------------------------------------------------------- */
window.UNIT = {
  key:'unit-3',
  title:'Unit 3',
  draft:true,
  hideScriptSwitch:true,
  next:{ href:'unit4.html', label:'Go to Unit 4' },
  steps:[
    { type:'alphabet', title:'Vowels · ಸ್ವರಗಳು', desc:'These stand on their own at the start of a word. Inside a word, each vowel becomes a small sign attached to a consonant.', letters:KN_VOWELS,
      note:'Tulu uses the same letters as Kannada. Some writers add marks for sounds Kannada doesn\'t have, but everyday print uses the standard alphabet.' },
    { type:'letters', title:'Vowel sounds', desc:'Look at each letter and pick its sound.', letters:KN_VOWELS, rounds:8 },
    { type:'alphabet', title:'Consonants · ವ್ಯಂಜನಗಳು', desc:'Each consonant carries a built-in "a" sound, just like in Tulu Lipi.', letters:KN_CONSONANTS },
    { type:'letters', title:'Consonant sounds', desc:'Look at each letter and pick its sound.', letters:KN_CONSONANTS, rounds:10 },
    { type:'quiz', title:'Find the letter', desc:'Now the other way round: hear the sound in your head, then find the letter.', questions:letterQuestions([...KN_VOWELS, ...KN_CONSONANTS], 8) },
    { type:'read', title:'Words you already know', desc:'These are words from Units 1 and 2, now in Kannada script. First pick how it sounds, then what it means.', items:KNOWN_WORDS },
    { type:'read', title:'Reading signboards', desc:'Signs and menus across Tulu Nadu are mostly in Kannada script. Can you read these?', items:SIGNBOARDS,
      note:'Coming later in this unit: Tulu proverbs and short reading passages. They need a Tulu speaker to choose and translate them properly.' },
  ],
};
