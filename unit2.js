/* ===================================================================
   UNIT 2: EVERYDAY TULU — content only. The games themselves live in
   unit-engine.js. Vocabulary matches the sourced lessons in script.js
   (ROADMAP_UNITS, Unit 2).
=================================================================== */

/* ---------------------------------------------------------------
   DATA
--------------------------------------------------------------- */
const MARKET_PAIRS = [
  { tulu:'maNoli', en:'ivy gourd' },
  { tulu:'touthe', en:'cucumber' },
  { tulu:'koththambari', en:'coriander' },
  { tulu:'moolangi', en:'radish' },
  { tulu:'munchi', en:'pepper' },
];

const SENTENCE_PAIRS = [
  { tulu:'yAn pOpae', en:'I go' },
  { tulu:'Aye pOpe', en:'he goes' },
  { tulu:'mOlu pOpal', en:'she goes' },
];
// Used only in the quiz round (don't fit the drag-to-subject format above)
const SENTENCE_EXTRA = [
  { tulu:'yAn sAleg pOpae', en:'I go to school' },
  { tulu:'enkulu dinola pEpar Oduva', en:'we read the newspaper daily' },
];

const PHRASE_PAIRS = [
  { tulu:'nekk Eth?', en:'how much is this?' },
  { tulu:'vaNas aanDa?', en:'had your lunch?' },
];

const QUESTION_PAIRS = [
  { tulu:'att / ata', en:'no / isn’t it (statement)' },
  { tulu:'ijji / ijja', en:'no / isn’t it (existence)' },
  { tulu:'undu dAde?', en:'what is this?' },
  { tulu:'Ir dUra pOvondullar?', en:'where are you going? (formal)' },
  { tulu:'gaNTae EtAND?', en:'what time is it?' },
];

const QUIZ_QUESTIONS = [
  { prompt:'What does "maNoli" mean?', answer:'ivy gourd', choices:['ivy gourd','cucumber','radish','pepper'] },
  { prompt:'What does "touthe" mean?', answer:'cucumber', choices:['cucumber','coriander','radish','ivy gourd'] },
  { prompt:'How do you say "I go" in Tulu?', answer:'yAn pOpae', choices:['yAn pOpae','Aye pOpe','mOlu pOpal','yAn sAleg pOpae'] },
  { prompt:'What does "yAn sAleg pOpae" mean?', answer:'I go to school', choices:['I go to school','I go home','he goes to school','we go daily'] },
  { prompt:'What does "enkulu dinola pEpar Oduva" mean?', answer:'we read the newspaper daily', choices:['we read the newspaper daily','I read the newspaper','he reads daily','we go to school daily'] },
  { prompt:'What does "nekk Eth?" mean?', answer:'how much is this?', choices:['how much is this?','what is this?','where are you going?','had your lunch?'] },
  { prompt:'What does "undu dAde?" mean?', answer:'what is this?', choices:['what is this?','how much is this?','what time is it?','where are you going?'] },
  { prompt:'What does "gaNTae EtAND?" mean?', answer:'what time is it?', choices:['what time is it?','what is this?','where are you going?','had your lunch?'] },
  { prompt:'Which word means "she goes"?', answer:'mOlu pOpal', choices:['mOlu pOpal','Aye pOpe','yAn pOpae','ijji / ijja'] },
  { prompt:'What does "ijji / ijja" mean?', answer:'no / isn’t it (existence)', choices:['no / isn’t it (existence)','no / isn’t it (statement)','what is this?','how much is this?'] },
];


// Sentences for the builder. Tulu puts the verb last
// (subject – object – verb), so these practise word order.
const BUILD_SENTENCES = [
  { en:'I go to school', words:['yAn', 'sAleg', 'pOpae'], extra:['Aye'] },
  { en:'he goes', words:['Aye', 'pOpe'], extra:['pOpal'] },
  { en:'she goes', words:['mOlu', 'pOpal'], extra:['pOpe'] },
  { en:'we read the newspaper daily', words:['enkulu', 'dinola', 'pEpar', 'Oduva'], extra:['pOpae'] },
];

// Respectful vs everyday forms, all from the course's sourced lessons.
const REGISTER_ITEMS = [
  { tulu:'Ulai bale', en:'Come in (polite)', bin:'formal' },
  { tulu:'Encha ullar?', en:'How are you? (formal)', bin:'formal' },
  { tulu:'pudar enchine?', en:"What's your name? (formal)", bin:'formal' },
  { tulu:'Ir dUra pOvondullar?', en:'Where are you going? (formal)', bin:'formal' },
  { tulu:'Ulai bola', en:'Come in (casual)', bin:'casual' },
  { tulu:'encha ulla?', en:'How are you? (informal)', bin:'casual' },
];

// A short visit to a shop, built only from phrases taught in Units 1–2.
const SHOP_DIALOGUE = [
  { who:'them', tulu:'Namaskara! Bale.', en:'Hello! Welcome.' },
  { who:'you', goal:'Greet the shopkeeper back.', options:[
    { tulu:'Namaskara', en:'Hello', correct:true },
    { tulu:'Barpe', en:'Goodbye' },
  ]},
  { who:'them', tulu:'Yencha ullar?', en:'How are you?' },
  { who:'you', goal:'Say you are fine.', options:[
    { tulu:'Yaan usar ulle', en:'I am fine', correct:true },
    { tulu:'Swagatha', en:'Welcome' },
    { tulu:'undu dAde?', en:'What is this?' },
  ]},
  { who:'you', goal:'Point at the fish and ask how much it is.', options:[
    { tulu:'nekk Eth?', en:'How much is this?', correct:true },
    { tulu:'gaNTae EtAND?', en:'What time is it?' },
    { tulu:'Kullule', en:'Please sit down' },
  ]},
  { who:'them', tulu:'vaNas aanDa?', en:'Had your lunch?' },
  { who:'you', goal:'Thank them as you leave.', options:[
    { tulu:'Solmelu', en:'Thank you', correct:true },
    { tulu:'Ullara?', en:'Are you there?' },
  ]},
];

/* ---------------------------------------------------------------
   UNIT CONFIG — run by unit-engine.js
--------------------------------------------------------------- */
window.UNIT = {
  key:'unit-2',
  title:'Unit 2',
  next:{ href:'unit3.html', label:'Go to Unit 3' },
  steps:[
    { type:'learn', title:'Market words', desc:'Tap a card to see what each word means.', items:MARKET_PAIRS },
    { type:'match', title:'Match the market words', desc:'Tap a Tulu word on the left, then its English meaning on the right.', pairs:MARKET_PAIRS },
    { type:'learn', title:'Simple sentences', desc:'Short everyday sentences. Notice where the verb goes.', items:[...SENTENCE_PAIRS, ...SENTENCE_EXTRA],
      note:'Pattern: short verbs take "-p-" plus an ending (pO → pOpe, "he goes"); longer verbs take "-uv-" (mAr → mAruve, "he sells"). The verb comes at the end of the sentence.' },
    { type:'build', title:'Build the sentence', desc:'Tap the words in the right order. One extra word in each set is a decoy.', sentences:BUILD_SENTENCES },
    { type:'drag', title:"Who's going?", desc:'Drag each Tulu sentence onto the meaning that matches.', pairs:SENTENCE_PAIRS },
    { type:'learn', title:'Phrases & questions', desc:'Useful questions for everyday conversation.', items:[...PHRASE_PAIRS, ...QUESTION_PAIRS] },
    { type:'match', kind:'Bonus', title:'Everyday phrases', desc:'Tap a Tulu phrase, then tap what it means.', pairs:PHRASE_PAIRS,
      note:'Real Tulu slang is thin online and needs a native speaker to check, so this round sticks to two verified everyday phrases.' },
    { type:'drag', title:'Questions & verbs', desc:'Drag each Tulu word or phrase onto what it means.', pairs:QUESTION_PAIRS },
    { type:'sort', title:'Polite or casual?', desc:'Tap a phrase, then tap the group it belongs in.',
      bins:[ { key:'formal', label:'Polite', hint:'For elders and people you don\'t know' }, { key:'casual', label:'Casual', hint:'For friends and younger family' } ],
      items:REGISTER_ITEMS, note:'Notice that the respectful forms often end in -r: ullar, pOvondullar.' },
    { type:'dialogue', title:'At the shop', desc:'Choose what to say at each turn. Tap a wrong answer to see what it means.', speaker:'Shopkeeper', lines:SHOP_DIALOGUE },
    { type:'quiz', title:'Quick quiz', desc:'A short round mixing everything from this unit.', questions:QUIZ_QUESTIONS },
  ],
};
