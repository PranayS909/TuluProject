/* ===================================================================
   UNIT 5: OUT AND ABOUT — content only (games live in unit-engine.js).
   Directions, time and weather, eating out, and coastal slang.

   DRAFT CONTENT: these words came from a planning list and have NOT
   been checked by a Tulu speaker. Some may be regional, some may be
   Kannada rather than Tulu, and the remaining days of the week were
   filled in to complete the set. Please correct anything wrong here.
   The dialogues reuse phrases already taught in Units 1–2 wherever
   possible.
=================================================================== */

const DIRECTIONS = [
  { tulu:'munde', en:'forward / straight on' },
  { tulu:'pira', en:'back' },
  { tulu:'tenta', en:'left' },
  { tulu:'balatha', en:'right' },
  { tulu:'kadal', en:'sea / beach' },
  { tulu:'ooru', en:'town / village' },
  { tulu:'angadi', en:'shop' },
  { tulu:'rasta', en:'road' },
];

const AUTO_DIALOGUE = [
  { who:'you', goal:'Greet the auto-rickshaw driver.', options:[
    { tulu:'Namaskara', en:'Hello', correct:true },
    { tulu:'Barpe', en:'Goodbye' },
  ]},
  { who:'them', tulu:'Ir dUra pOvondullar?', en:'Where are you going?' },
  { who:'you', goal:'Say you want to go to Mangaluru (Kudla).', options:[
    { tulu:'Kudlag pova', en:"Let's go to Mangaluru", correct:true },
    { tulu:'Kullule', en:'Please sit down' },
    { tulu:'Munde nilpisi', en:'Stop up ahead' },
  ]},
  { who:'you', goal:'Nearly there. Ask the driver to stop just ahead.', options:[
    { tulu:'Munde nilpisi', en:'Stop up ahead', correct:true },
    { tulu:'Ulai bale', en:'Come in' },
  ]},
  { who:'you', goal:'Thank the driver.', options:[
    { tulu:'Solmelu', en:'Thank you', correct:true },
    { tulu:'Swagatha', en:'Welcome' },
  ]},
];

const DAYS = [
  { tulu:'Aitara', en:'Sunday', bin:'days' },
  { tulu:'Somara', en:'Monday', bin:'days' },
  { tulu:'Angare', en:'Tuesday', bin:'days' },
  { tulu:'Budara', en:'Wednesday', bin:'days' },
  { tulu:'Gurvara', en:'Thursday', bin:'days' },
  { tulu:'Sukrara', en:'Friday', bin:'days' },
  { tulu:'Sanyara', en:'Saturday', bin:'days' },
];
const TIMES = [
  { tulu:'kandele', en:'morning', bin:'time' },
  { tulu:'madhyana', en:'afternoon', bin:'time' },
  { tulu:'bayya', en:'evening', bin:'time' },
  { tulu:'raatri', en:'night', bin:'time' },
];
const WEATHER = [
  { tulu:'barsa', en:'rain', bin:'weather' },
  { tulu:'bisilu', en:'sunshine / heat', bin:'weather' },
  { tulu:'chali', en:'cold', bin:'weather' },
];

const EATING_OUT = [
  { tulu:'Neer Dosa', en:'thin, lacy rice crêpes' },
  { tulu:'Kori Rotti', en:'chicken curry with crisp rice wafers' },
  { tulu:'Bangude Pulimunchi', en:'mackerel in a sour, spicy masala' },
  { tulu:'Kuchalakki', en:'boiled (parboiled) rice' },
  { tulu:'Onji glass neer korle', en:'Please give me a glass of water' },
  { tulu:'Vanas bhaari laikeyundu', en:'The food is very tasty' },
];

const MESS_DIALOGUE = [
  { who:'them', tulu:'Ulai bale', en:'Come in' },
  { who:'them', tulu:'Kullule', en:'Please sit down' },
  { who:'you', goal:'Ask for a glass of water.', options:[
    { tulu:'Onji glass neer korle', en:'Please give me a glass of water', correct:true },
    { tulu:'Vanas bhaari laikeyundu', en:'The food is very tasty' },
    { tulu:'nekk Eth?', en:'How much is this?' },
  ]},
  { who:'you', goal:'Order the dish with crisp rice wafers.', options:[
    { tulu:'Kori Rotti', en:'Chicken curry with rice wafers', correct:true },
    { tulu:'Neer Dosa', en:'Lacy rice crêpes' },
    { tulu:'Bangude Pulimunchi', en:'Mackerel in sour, spicy masala' },
  ]},
  { who:'you', goal:'Tell them the food was delicious.', options:[
    { tulu:'Vanas bhaari laikeyundu', en:'The food is very tasty', correct:true },
    { tulu:'Onji glass neer korle', en:'Please give me a glass of water' },
  ]},
  { who:'you', goal:'Thank them and say goodbye.', options:[
    { tulu:'Solmelu', en:'Thank you', correct:true },
    { tulu:'Ullara?', en:'Are you there?' },
  ]},
  { who:'them', tulu:'Barpe', en:'Goodbye' },
];

const SLANG = [
  { tulu:'Maare', en:'friend / mate' },
  { tulu:'Khanditha', en:'definitely' },
  { tulu:'Bombaat', en:'awesome' },
  { tulu:'Gottunda?', en:'do you get it?' },
  { tulu:'Andaa?', en:'is that so?' },
  { tulu:'Chindi', en:'fantastic' },
];

const QUIZ = [
  { prompt:'What does "munde" mean?', answer:'forward / straight on', choices:['forward / straight on', 'back', 'left', 'road'] },
  { prompt:'How do you say "Monday"?', answer:'Somara', choices:['Somara', 'Aitara', 'Budara', 'Sanyara'] },
  { prompt:'What does "barsa" mean?', answer:'rain', choices:['rain', 'cold', 'night', 'sea'] },
  { prompt:'Which phrase asks for water?', answer:'Onji glass neer korle', choices:['Onji glass neer korle', 'Vanas bhaari laikeyundu', 'Munde nilpisi', 'Kudlag pova'] },
  { prompt:'What does "kadal" mean?', answer:'sea / beach', choices:['sea / beach', 'shop', 'town / village', 'road'] },
  { prompt:'What does "kandele" mean?', answer:'morning', choices:['morning', 'evening', 'afternoon', 'night'] },
];

/* ---------------------------------------------------------------
   UNIT CONFIG — run by unit-engine.js
--------------------------------------------------------------- */
window.UNIT = {
  key:'unit-5',
  title:'Unit 5',
  draft:true,
  steps:[
    { type:'learn', title:'Directions & places', desc:'Getting around town.', items:DIRECTIONS },
    { type:'match', title:'Match the directions', desc:'Tap a word, then its meaning.', pairs:DIRECTIONS },
    { type:'dialogue', title:'Taking an auto-rickshaw', desc:'Choose what to say at each turn.', speaker:'Driver', lines:AUTO_DIALOGUE },
    { type:'learn', title:'Days, time & weather', desc:'Days of the week, times of day, and the weather.', items:[...DAYS, ...TIMES, ...WEATHER] },
    { type:'sort', title:'Days, times or weather?', desc:'Tap a word, then tap its group.',
      bins:[ { key:'days', label:'Days of the week' }, { key:'time', label:'Times of day' }, { key:'weather', label:'Weather' } ],
      items:[...shuffle(DAYS).slice(0, 4), ...TIMES, ...WEATHER] },
    { type:'learn', title:'At a Tuluva mess', desc:'Coastal dishes and the phrases to order them.', items:EATING_OUT },
    { type:'dialogue', title:'Ordering lunch', desc:'Choose what to say at each turn.', speaker:'Waiter', lines:MESS_DIALOGUE },
    { type:'learn', kind:'Bonus', title:'Coastal slang', desc:'Casual words you might hear among friends.', items:SLANG,
      note:'Slang changes fast and differs between towns, and some of these are shared with coastal Kannada. Check with a Tulu speaker before using them.' },
    { type:'match', kind:'Bonus', title:'Match the slang', desc:'Tap a word, then its meaning.', pairs:SLANG },
    { type:'quiz', title:'Quick quiz', desc:'A short round mixing everything from this unit.', questions:QUIZ },
  ],
};
