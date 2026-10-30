/* ===================================================================
   UNIT 4: CULTURE DEEP-DIVE — content only (games live in unit-engine.js).
   Every word and meaning here comes from the site's own culture pages
   (Bhoota Kola, Nagaradhane, Festivals, Everyday Cuisine, Pili Nalike,
   Yakshagana), so it matches what those pages teach.
=================================================================== */

const RITUAL_WORDS = [
  { tulu:'daiva', en:'a local deity or ancestral spirit' },
  { tulu:'bhoota', en:'spirit (another word for daiva)' },
  { tulu:'sthana', en:'the shrine where a Kola is held' },
  { tulu:'paddana', en:'a sung oral epic' },
  { tulu:'naga kallu', en:'naga stones' },
  { tulu:'naga bana', en:'a sacred grove of naga stones' },
  { tulu:'nagamandala', en:'the multi-day serpent ceremony' },
];

const FESTIVAL_WORDS = [
  { tulu:'Bisu Parba', en:'the Tulu New Year (mid-April)' },
  { tulu:'bisu kanni', en:'the lucky "first sight" on New Year morning' },
  { tulu:'Aati', en:'the monsoon month' },
  { tulu:'Aati Kalenja', en:'a folk performer who visits homes in Aati' },
  { tulu:'pili', en:'tiger' },
  { tulu:'nalike', en:'dance' },
  { tulu:'taase', en:'the drums played for Pili Nalike' },
];

const FOOD_WORDS = [
  { tulu:'neer', en:'water (as in neer dosa)' },
  { tulu:'kori', en:'chicken curry' },
  { tulu:'rotti', en:'thin, crisp rice wafers' },
];

const STAGE_WORDS = [
  { tulu:'mela', en:'a Yakshagana troupe' },
  { tulu:'himmela', en:'the musicians, seated behind' },
  { tulu:'mummela', en:'the actors, dancing in front' },
  { tulu:'Bhagavata', en:'the lead singer who narrates' },
  { tulu:'chende', en:'a loud, high cylindrical drum' },
  { tulu:'maddale', en:'a barrel drum' },
  { tulu:'prasanga', en:'a traditional Yakshagana play' },
];

const QUIZ = [
  { prompt:'Where is a Bhoota Kola performed?', answer:'At a sthana', choices:['At a sthana', 'In a naga bana', 'On a Kambala track', 'At a mela'] },
  { prompt:'What does "pili" mean?', answer:'tiger', choices:['tiger', 'dance', 'drum', 'serpent'] },
  { prompt:'What is Bisu Parba?', answer:'The Tulu New Year', choices:['The Tulu New Year', 'The monsoon month', 'A serpent ceremony', 'A Yakshagana play'] },
  { prompt:'Which of these is a drum?', answer:'chende', choices:['chende', 'mummela', 'sthana', 'bisu kanni'] },
  { prompt:'What is a Paddana?', answer:'A sung oral epic', choices:['A sung oral epic', 'A sacred grove', 'A troupe of actors', 'A rice wafer'] },
  { prompt:'In Kori Rotti, what is the "rotti"?', answer:'Thin, crisp rice wafers', choices:['Thin, crisp rice wafers', 'Chicken curry', 'Water', 'A drum'] },
  { prompt:'Who sits in the himmela?', answer:'The musicians', choices:['The musicians', 'The actors', 'The spirits', 'The racers'] },
];

/* ---------------------------------------------------------------
   UNIT CONFIG — run by unit-engine.js
--------------------------------------------------------------- */
window.UNIT = {
  key:'unit-4',
  title:'Unit 4',
  next:{ href:'unit5.html', label:'Go to Unit 5' },
  steps:[
    { type:'learn', title:'Ritual words', desc:'Words from <a class="text-link" href="bhoota-kola.html">Bhoota Kola</a>, <a class="text-link" href="paddana-tradition.html">the Paddana tradition</a> and <a class="text-link" href="nagaradhane.html">Nagaradhane</a>.', items:RITUAL_WORDS },
    { type:'match', title:'Match the ritual words', desc:'Tap a word, then its meaning.', pairs:RITUAL_WORDS },
    { type:'learn', title:'Festivals & food', desc:'Words from <a class="text-link" href="festivals.html">Festivals</a>, <a class="text-link" href="pili-nalike.html">Pili Nalike</a> and <a class="text-link" href="everyday-cuisine.html">Everyday Cuisine</a>.', items:[...FESTIVAL_WORDS, ...FOOD_WORDS] },
    { type:'drag', title:'Festivals & food', desc:'Drag each word onto its meaning.', pairs:[...FESTIVAL_WORDS, ...FOOD_WORDS] },
    { type:'learn', title:'On the Yakshagana stage', desc:'Who\'s who at an all-night <a class="text-link" href="yakshagana.html">Yakshagana</a>.', items:STAGE_WORDS },
    { type:'match', title:'Match the stage words', desc:'Tap a word, then its meaning.', pairs:STAGE_WORDS },
    { type:'sort', title:'Where does it belong?', desc:'Tap a word, then tap its group.',
      bins:[
        { key:'ritual', label:'Rituals & worship' },
        { key:'festival', label:'Festivals & food' },
        { key:'stage', label:'Yakshagana stage' },
      ],
      items:[
        { tulu:'daiva', en:'deity or spirit', bin:'ritual' },
        { tulu:'sthana', en:'shrine', bin:'ritual' },
        { tulu:'naga kallu', en:'naga stones', bin:'ritual' },
        { tulu:'Bisu Parba', en:'Tulu New Year', bin:'festival' },
        { tulu:'Aati', en:'monsoon month', bin:'festival' },
        { tulu:'kori', en:'chicken curry', bin:'festival' },
        { tulu:'chende', en:'drum', bin:'stage' },
        { tulu:'mela', en:'troupe', bin:'stage' },
        { tulu:'prasanga', en:'play', bin:'stage' },
      ],
      note:'Paddana listening practice will be added once we have recordings of the chants.' },
    { type:'quiz', title:'Culture quiz', desc:'How much do you remember?', questions:QUIZ },
  ],
};
