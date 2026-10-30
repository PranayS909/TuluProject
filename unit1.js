/* ===================================================================
   UNIT 1: FIRST WORDS — content only. The games themselves live in
   unit-engine.js; recordings are mapped in audio-map.js.
=================================================================== */

/* ---------------------------------------------------------------
   LEARNING MODULE DATA (term = Tulu, def = English)
--------------------------------------------------------------- */
const LEARN_GREETINGS = [
  { term:'Namaskara', def:'Hello / Greetings' },
  { term:'Yencha ullar?', def:'How are you?' },
  { term:'Yaan usar ulle', def:'I am fine' },
  { term:'Erena pudar enchina?', def:'What is your name?' },
  { term:'Yenna pudar…', def:'My name is...' },
  { term:'Solmelu', def:'Thank you' },
  { term:'Barpe', def:'Goodbye' },
  { term:'Swagatha', def:'Welcome' },
  { term:'Ulai bale', def:'Come in (polite / formal)' },
  { term:'Ulai bala', def:'Come in (casual / informal)' },
  { term:'Kullule', def:'Please sit down' },
  { term:'vanas aanda?', def:'Did you have food?' },
  { term:'Cha aanda?', def:'Did you have tea / coffee?' },
  { term:'Bale', def:'Come / Welcome' },
  { term:'Bannaga', def:'Welcome / Upon your arrival' },
  { term:'Yencha undu?', def:'How is it going?' },
  { term:'Kushi aand thikaad', def:'Glad to meet you / Nice to meet you' },
  { term:'Yedde ponna?', def:'Is everything going well?' },
  { term:'Ullara?', def:'Are you there?' },
  { term:'Saavu', def:'Greetings / Bowing to you' },
];

const LEARN_NUMBERS = [
  { term:'onji', def:'1' }, { term:'raDD', def:'2' }, { term:'mUji', def:'3' },
  { term:'nAl', def:'4' }, { term:'ain', def:'5' }, { term:'Aji', def:'6' },
  { term:'El', def:'7' }, { term:'enma', def:'8' }, { term:'orumba', def:'9' },
  { term:'patt', def:'10' }, { term:'pattonji', def:'11' }, { term:'padiraDD', def:'12' },
  { term:'padimUji', def:'13' }, { term:'padinAl', def:'14' }, { term:'padinain', def:'15' },
  { term:'padinAji', def:'16' }, { term:'padinel', def:'17' }, { term:'padinenma', def:'18' },
  { term:'padinorumba', def:'19' }, { term:'irva', def:'20' },
];
const NUMBERS_TENS_NOTE = 'Bonus pattern: the tens keep going the same way — muppa (30), nalpa (40), aiva (50), ajipa (60), elpa (70), enpa (80), sonpa (90), nUdu (100). Add "-ttonji" (+1) up to "-ttorumba" (+9) to count past each ten, e.g. irvattonji = 21.';

const LEARN_FAMILY = [
  { term:'appae (amma)', def:'Mother / Mummy' },
  { term:'amme (ayye / poppa)', def:'Father / Daddy' },
  { term:'mage', def:'Son' },
  { term:'magal', def:'Daughter' },
  { term:'bAlae', def:'Child / kid / baby' },
  { term:'bAlelu / jOkulu', def:'Children' },
  { term:'palaye (aNNe)', def:'Elder brother' },
  { term:'paldi / pali (akka)', def:'Elder sister' },
  { term:'megye', def:'Younger brother' },
  { term:'megdi / tangaDi', def:'Younger sister' },
  { term:'ajje', def:'Grandfather' },
  { term:'ajji (abba)', def:'Grandmother' },
  { term:'pulli', def:'Grandchild' },
  { term:'talli', def:'Great-grandchild (or great-great-grandchild)' },
  { term:'kaNDane / kaNDani', def:'Husband' },
  { term:'boDedi', def:'Wife' },
  { term:'mAmu / mAme', def:'Father-in-law / paternal uncle' },
  { term:'mAmi', def:'Mother-in-law / paternal aunt' },
  { term:'marmaye', def:'Son-in-law / nephew' },
  { term:'marmal', def:'Daughter-in-law / niece' },
  { term:'tammala / tammale', def:'Maternal uncle / father-in-law’s side' },
  { term:'bhAve', def:'Elder brother-in-law / sister’s husband' },
  { term:'nanike / maitine', def:'Younger brother-in-law / wife’s younger brother' },
  { term:'attai / atyae', def:'Sister-in-law / brother’s wife' },
  { term:'maitidi', def:'Sister-in-law / husband’s sister' },
  { term:'arvatte', def:'Nephew / son-in-law relations' },
  { term:'kuTuma', def:'Family' },
  { term:'kuTumbadalli', def:'Relatives' },
  { term:'sisTer', def:'Friends / well-wishers' },
  { term:'dOsti', def:'Friend / friendship' },
];

const LEARN_MARKET = [
  { term:'Ari', def:'Raw rice (the core staple of Tulunadu)' },
  { term:'Nuji', def:'Broken rice pieces' },
  { term:'Artha', def:'Flour (e.g., ari artha for rice flour)' },
  { term:'Bele', def:'Lentils / Dals' },
  { term:'Enme', def:'Sesame oil / Cooking oil' },
  { term:'Neer', def:'Water' },
  { term:'Pela', def:'Milk' },
  { term:'Nenpu', def:'Ghee' },
  { term:'Bangude', def:'Mackerel (most common fish)' },
  { term:'Anjal / Surmai', def:'Kingfish (premium)' },
  { term:'Boothai', def:'Sardines' },
  { term:'Meen', def:'Fish (generic term)' },
  { term:'Yetti', def:'Prawns / Shrimp' },
  { term:'Denji', def:'Crab' },
  { term:'Noonji', def:'Squid / Cuttlefish' },
  { term:'Muru', def:'Reef Cod' },
  { term:'Munchi', def:'Chilli (general)' },
  { term:'Paji Munchi', def:'Green chilli' },
  { term:'Kanja Munchi', def:'Dried red chilli' },
  { term:'Ulli / Nirulli', def:'Onion' },
  { term:'Bollulli', def:'Garlic' },
  { term:'Inji', def:'Ginger' },
  { term:'Uppu', def:'Salt' },
  { term:'Churki', def:'Black pepper' },
  { term:'Thore', def:'Cumin' },
  { term:'Sarsu', def:'Mustard seeds' },
  { term:'Thev', def:'Colocasia / Taro leaves' },
  { term:'Pelakaayi', def:'Jackfruit' },
  { term:'Kanchala', def:'Bitter gourd' },
  { term:'Padpe', def:'Amaranth leaves / Red spinach' },
  { term:'Kumbala', def:'Pumpkin' },
  { term:'Bende', def:'Okra / Ladyfinger' },
  { term:'Parangi Pelakaayi', def:'Papaya or Pineapple (dialect-dependent)' },
  { term:'Gua', def:'Guava' },
  { term:'Booruda', def:'Watermelon' },
  { term:'Baajil', def:'Beaten rice / Poha' },
];

/* ---------------------------------------------------------------
   EXERCISE DATA (a practiced subset of each learning module above)
--------------------------------------------------------------- */
const GREETINGS_MATCH_PAIRS = [
  { tulu:'Namaskara', en:'hello / greetings' },
  { tulu:'Yencha ullar?', en:'how are you?' },
  { tulu:'Yaan usar ulle', en:'I am fine' },
  { tulu:'Solmelu', en:'thank you' },
  { tulu:'Barpe', en:'goodbye' },
  { tulu:'Swagatha', en:'welcome' },
];

const NUMBERS_DRAG_PAIRS = [1,2,3,4,5,6,7,8,9,10].map((n, i) => ({
  tulu: LEARN_NUMBERS[i].term, en:`${n}`, dots:n,
}));

const FAMILY_DRAG_PAIRS = [
  { tulu:'appae (amma)', en:'mother' },
  { tulu:'amme (ayye / poppa)', en:'father' },
  { tulu:'mage', en:'son' },
  { tulu:'magal', en:'daughter' },
  { tulu:'palaye (aNNe)', en:'elder brother' },
  { tulu:'paldi / pali (akka)', en:'elder sister' },
  { tulu:'ajje', en:'grandfather' },
  { tulu:'ajji (abba)', en:'grandmother' },
];

const MARKET_DRAG_PAIRS = [
  { tulu:'Ari', en:'rice' },
  { tulu:'Neer', en:'water' },
  { tulu:'Pela', en:'milk' },
  { tulu:'Meen', en:'fish' },
  { tulu:'Yetti', en:'prawns' },
  { tulu:'Ulli / Nirulli', en:'onion' },
  { tulu:'Bollulli', en:'garlic' },
  { tulu:'Munchi', en:'chilli' },
];

const QUIZ_QUESTIONS = [
  { prompt:'What does "Namaskara" mean?', answer:'Hello / Greetings', choices:['Hello / Greetings','Goodbye','Thank you','Welcome'] },
  { prompt:'How do you say "how are you?" in Tulu?', answer:'Yencha ullar?', choices:['Yencha ullar?','Yaan usar ulle','Solmelu','Barpe'] },
  { prompt:'What does "irva" mean?', answer:'20', choices:['20','12','2','10'] },
  { prompt:'What is "raDD" in numbers?', answer:'2', choices:['2','20','12','7'] },
  { prompt:'How do you say "5" in Tulu?', answer:'ain', choices:['ain','El','Aji','nAl'] },
  { prompt:'What does "appae" mean?', answer:'Mother', choices:['Mother','Father','Son','Daughter'] },
  { prompt:'What does "ajje" mean?', answer:'Grandfather', choices:['Grandfather','Grandmother','Uncle','Father'] },
  { prompt:'Which word means "elder sister"?', answer:'paldi / pali (akka)', choices:['paldi / pali (akka)','megdi / tangaDi','magal','ajji (abba)'] },
  { prompt:'What does "Ari" mean at the market?', answer:'Raw rice', choices:['Raw rice','Water','Milk','Fish'] },
  { prompt:'What does "Meen" mean?', answer:'Fish (generic term)', choices:['Fish (generic term)','Prawns','Crab','Squid'] },
  { prompt:'Which word means "onion"?', answer:'Ulli / Nirulli', choices:['Ulli / Nirulli','Bollulli','Inji','Munchi'] },
  { prompt:'What does "Solmelu" mean?', answer:'Thank you', choices:['Thank you','Goodbye','Welcome','Please sit down'] },
];


/* ---------------------------------------------------------------
   UNIT CONFIG — run by unit-engine.js
--------------------------------------------------------------- */
const asCards = (list) => list.map(x => ({ tulu:x.term, en:x.def }));

window.UNIT = {
  key:'unit-1',
  title:'Unit 1',
  next:{ href:'unit2.html', label:'Go to Unit 2' },
  steps:[
    { type:'learn', title:'Greetings', desc:'Tap a card to hear it spoken and see what it means.', items:asCards(LEARN_GREETINGS) },
    { type:'match', title:'Match the greetings', desc:'Tap a Tulu phrase on the left, then its English meaning on the right.', pairs:GREETINGS_MATCH_PAIRS },
    { type:'listen', title:'Listen and pick', desc:'Play each clip without looking, then pick the phrase you heard.', items:asCards(LEARN_GREETINGS), rounds:6 },
    { type:'learn', title:'Numbers', desc:'Tap a card to hear it spoken and see the number.', items:asCards(LEARN_NUMBERS), note:NUMBERS_TENS_NOTE },
    { type:'drag', title:'Count the dots', desc:'Drag each word onto the tile with the same number of dots. You can also tap a word, then tap a tile.', pairs:NUMBERS_DRAG_PAIRS },
    { type:'learn', title:'Family', desc:'Tap a card to hear it spoken and see who it means.', items:asCards(LEARN_FAMILY) },
    { type:'drag', title:"Who's who?", desc:'Drag each Tulu word onto the family member it means.', pairs:FAMILY_DRAG_PAIRS },
    { type:'learn', title:'Market words', desc:'Tap a card to hear it spoken and see what it means.', items:asCards(LEARN_MARKET) },
    { type:'drag', title:'At the market', desc:'Drag each Tulu word onto the item it names.', pairs:MARKET_DRAG_PAIRS },
    { type:'quiz', title:'Quick quiz', desc:'A short round mixing everything from this unit.', questions:QUIZ_QUESTIONS },
  ],
};
