/* ===================================================================
   TULU LIPI (Tulu-Tigalari) — shared script data + converters.
   Used by tulu-lipi.html (alphabet / tracing / quiz) and
   transliterator.html (roman → Kannada → Tulu Lipi + keyboard).

   Code points come from the Unicode 16.0 "Tulu-Tigalari" block
   (U+11380–U+113FF). The Kannada ↔ Tigalari pairs below were generated
   by matching character names in UnicodeData.txt (e.g. KANNADA LETTER
   KA ↔ TULU-TIGALARI LETTER KA), not typed by hand.

   Note: the Tigalari block has no separate short e / short o — Kannada
   ಎ/ಏ both map to EE, and ಒ/ಓ both map to OO.
=================================================================== */

const tg = (cp) => String.fromCodePoint(cp);

/* ---------- alphabet for lessons ---------- */
const LIPI_VOWELS = [
  { tg:tg(0x11380), kn:'ಅ', rom:'a',  key:'a'  },
  { tg:tg(0x11381), kn:'ಆ', rom:'ā',  key:'A'  },
  { tg:tg(0x11382), kn:'ಇ', rom:'i',  key:'i'  },
  { tg:tg(0x11383), kn:'ಈ', rom:'ī',  key:'I'  },
  { tg:tg(0x11384), kn:'ಉ', rom:'u',  key:'u'  },
  { tg:tg(0x11385), kn:'ಊ', rom:'ū',  key:'U'  },
  { tg:tg(0x11386), kn:'ಋ', rom:'ṛ',  key:'RRi'},
  { tg:tg(0x1138B), kn:'ಏ', rom:'e / ē', key:'E' },
  { tg:tg(0x1138E), kn:'ಐ', rom:'ai', key:'ai' },
  { tg:tg(0x11390), kn:'ಓ', rom:'o / ō', key:'O' },
  { tg:tg(0x11391), kn:'ಔ', rom:'au', key:'au' },
];

const LIPI_CONSONANT_GROUPS = [
  { name:'Velar (throat)', items:[
    { tg:tg(0x11392), kn:'ಕ', rom:'ka',  key:'k'  },
    { tg:tg(0x11393), kn:'ಖ', rom:'kha', key:'kh' },
    { tg:tg(0x11394), kn:'ಗ', rom:'ga',  key:'g'  },
    { tg:tg(0x11395), kn:'ಘ', rom:'gha', key:'gh' },
    { tg:tg(0x11396), kn:'ಙ', rom:'ṅa',  key:'~N' },
  ]},
  { name:'Palatal (roof of mouth)', items:[
    { tg:tg(0x11397), kn:'ಚ', rom:'ca',  key:'ch' },
    { tg:tg(0x11398), kn:'ಛ', rom:'cha', key:'Ch' },
    { tg:tg(0x11399), kn:'ಜ', rom:'ja',  key:'j'  },
    { tg:tg(0x1139A), kn:'ಝ', rom:'jha', key:'jh' },
    { tg:tg(0x1139B), kn:'ಞ', rom:'ña',  key:'~n' },
  ]},
  { name:'Retroflex (tongue curled back)', items:[
    { tg:tg(0x1139C), kn:'ಟ', rom:'ṭa',  key:'T'  },
    { tg:tg(0x1139D), kn:'ಠ', rom:'ṭha', key:'Th' },
    { tg:tg(0x1139E), kn:'ಡ', rom:'ḍa',  key:'D'  },
    { tg:tg(0x1139F), kn:'ಢ', rom:'ḍha', key:'Dh' },
    { tg:tg(0x113A0), kn:'ಣ', rom:'ṇa',  key:'N'  },
  ]},
  { name:'Dental (tongue on teeth)', items:[
    { tg:tg(0x113A1), kn:'ತ', rom:'ta',  key:'t'  },
    { tg:tg(0x113A2), kn:'ಥ', rom:'tha', key:'th' },
    { tg:tg(0x113A3), kn:'ದ', rom:'da',  key:'d'  },
    { tg:tg(0x113A4), kn:'ಧ', rom:'dha', key:'dh' },
    { tg:tg(0x113A5), kn:'ನ', rom:'na',  key:'n'  },
  ]},
  { name:'Labial (lips)', items:[
    { tg:tg(0x113A6), kn:'ಪ', rom:'pa',  key:'p'  },
    { tg:tg(0x113A7), kn:'ಫ', rom:'pha', key:'ph' },
    { tg:tg(0x113A8), kn:'ಬ', rom:'ba',  key:'b'  },
    { tg:tg(0x113A9), kn:'ಭ', rom:'bha', key:'bh' },
    { tg:tg(0x113AA), kn:'ಮ', rom:'ma',  key:'m'  },
  ]},
  { name:'The rest', items:[
    { tg:tg(0x113AB), kn:'ಯ', rom:'ya',  key:'y'  },
    { tg:tg(0x113AC), kn:'ರ', rom:'ra',  key:'r'  },
    { tg:tg(0x113AD), kn:'ಲ', rom:'la',  key:'l'  },
    { tg:tg(0x113AE), kn:'ವ', rom:'va',  key:'v'  },
    { tg:tg(0x113AF), kn:'ಶ', rom:'śa',  key:'sh' },
    { tg:tg(0x113B0), kn:'ಷ', rom:'ṣa',  key:'Sh' },
    { tg:tg(0x113B1), kn:'ಸ', rom:'sa',  key:'s'  },
    { tg:tg(0x113B2), kn:'ಹ', rom:'ha',  key:'h'  },
    { tg:tg(0x113B3), kn:'ಳ', rom:'ḷa',  key:'L'  },
  ]},
];

/* vowel signs shown on the "build a syllable" strip, in order */
const LIPI_VOWEL_SIGNS = [
  { rom:'a',  kn:'',  tg:'' },
  { rom:'ā',  kn:'ಾ', tg:tg(0x113B8) },
  { rom:'i',  kn:'ಿ', tg:tg(0x113B9) },
  { rom:'ī',  kn:'ೀ', tg:tg(0x113BA) },
  { rom:'u',  kn:'ು', tg:tg(0x113BB) },
  { rom:'ū',  kn:'ೂ', tg:tg(0x113BC) },
  { rom:'e',  kn:'ೇ', tg:tg(0x113C2) },
  { rom:'ai', kn:'ೈ', tg:tg(0x113C5) },
  { rom:'o',  kn:'ೋ', tg:tg(0x113C7) },
  { rom:'au', kn:'ೌ', tg:tg(0x113C8) },
  { rom:'aṃ', kn:'ಂ', tg:tg(0x113CC) },
  { rom:'aḥ', kn:'ಃ', tg:tg(0x113CD) },
];

const LIPI_ALL_LETTERS = [
  ...LIPI_VOWELS,
  ...LIPI_CONSONANT_GROUPS.flatMap(g => g.items),
];

/* ---------- Kannada → Tulu-Tigalari, one code point at a time ---------- */
const KN_TO_TG = {
  0x0C82:0x113CC, 0x0C83:0x113CD,
  0x0C85:0x11380, 0x0C86:0x11381, 0x0C87:0x11382, 0x0C88:0x11383,
  0x0C89:0x11384, 0x0C8A:0x11385, 0x0C8B:0x11386, 0x0C8C:0x11388,
  0x0C8E:0x1138B, 0x0C8F:0x1138B, 0x0C90:0x1138E,
  0x0C92:0x11390, 0x0C93:0x11390, 0x0C94:0x11391,
  0x0C95:0x11392, 0x0C96:0x11393, 0x0C97:0x11394, 0x0C98:0x11395, 0x0C99:0x11396,
  0x0C9A:0x11397, 0x0C9B:0x11398, 0x0C9C:0x11399, 0x0C9D:0x1139A, 0x0C9E:0x1139B,
  0x0C9F:0x1139C, 0x0CA0:0x1139D, 0x0CA1:0x1139E, 0x0CA2:0x1139F, 0x0CA3:0x113A0,
  0x0CA4:0x113A1, 0x0CA5:0x113A2, 0x0CA6:0x113A3, 0x0CA7:0x113A4, 0x0CA8:0x113A5,
  0x0CAA:0x113A6, 0x0CAB:0x113A7, 0x0CAC:0x113A8, 0x0CAD:0x113A9, 0x0CAE:0x113AA,
  0x0CAF:0x113AB, 0x0CB0:0x113AC, 0x0CB1:0x113B4, 0x0CB2:0x113AD, 0x0CB3:0x113B3,
  0x0CB5:0x113AE, 0x0CB6:0x113AF, 0x0CB7:0x113B0, 0x0CB8:0x113B1, 0x0CB9:0x113B2,
  0x0CBD:0x113B7,
  0x0CBE:0x113B8, 0x0CBF:0x113B9, 0x0CC0:0x113BA, 0x0CC1:0x113BB, 0x0CC2:0x113BC,
  0x0CC3:0x113BD, 0x0CC4:0x113BE, 0x0CC6:0x113C2, 0x0CC7:0x113C2, 0x0CC8:0x113C5,
  0x0CCA:0x113C7, 0x0CCB:0x113C7, 0x0CCC:0x113C8, 0x0CCD:0x113CE,
  0x0CDE:0x113B5, // ೞ (historic LLLA; Unicode still names it "FA")
  0x0CE0:0x11387, 0x0CE1:0x11389, 0x0CE2:0x113BF, 0x0CE3:0x113C0,
};

function kannadaToTigalari(text){
  let out = '';
  for (const ch of text){
    const mapped = KN_TO_TG[ch.codePointAt(0)];
    out += mapped ? String.fromCodePoint(mapped) : ch;
  }
  return out;
}

/* ---------- Roman (ITRANS-style) → Kannada ----------
   Case matters: A = ā, T = ṭ, N = ṇ, L = ḷ, Sh = ṣ.
   Casual spellings also work: ee = ī, oo = ū (as in "neer", "noonji").
   A consonant with no vowel after it gets a virama (patt → ಪತ್ತ್). */
const ROMAN_CONSONANTS = {
  'k':'ಕ','kh':'ಖ','g':'ಗ','gh':'ಘ','~N':'ಙ','N^':'ಙ',
  'c':'ಚ','ch':'ಚ','Ch':'ಛ','chh':'ಛ','j':'ಜ','jh':'ಝ','~n':'ಞ','JN':'ಞ',
  'T':'ಟ','Th':'ಠ','D':'ಡ','Dh':'ಢ','N':'ಣ',
  't':'ತ','th':'ಥ','d':'ದ','dh':'ಧ','n':'ನ',
  'p':'ಪ','ph':'ಫ','f':'ಫ','b':'ಬ','bh':'ಭ','m':'ಮ',
  'y':'ಯ','r':'ರ','l':'ಲ','v':'ವ','w':'ವ',
  'sh':'ಶ','Sh':'ಷ','s':'ಸ','h':'ಹ','L':'ಳ',
};
const ROMAN_VOWELS = {
  // key: [independent, sign]
  'a':['ಅ',''], 'A':['ಆ','ಾ'], 'aa':['ಆ','ಾ'],
  'i':['ಇ','ಿ'], 'I':['ಈ','ೀ'], 'ii':['ಈ','ೀ'], 'ee':['ಈ','ೀ'],
  'u':['ಉ','ು'], 'U':['ಊ','ೂ'], 'uu':['ಊ','ೂ'], 'oo':['ಊ','ೂ'],
  'RRi':['ಋ','ೃ'], 'R^i':['ಋ','ೃ'],
  'e':['ಎ','ೆ'], 'E':['ಏ','ೇ'],
  'ai':['ಐ','ೈ'],
  'o':['ಒ','ೊ'], 'O':['ಓ','ೋ'],
  'au':['ಔ','ೌ'],
};
const ROMAN_MARKS = { 'M':'ಂ', '.n':'ಂ', 'H':'ಃ', '.a':'ಽ' };
const KN_VIRAMA = '್';

const ROMAN_TOKENS = [
  ...Object.keys(ROMAN_CONSONANTS).map(k => ({ k, type:'c' })),
  ...Object.keys(ROMAN_VOWELS).map(k => ({ k, type:'v' })),
  ...Object.keys(ROMAN_MARKS).map(k => ({ k, type:'m' })),
].sort((a, b) => b.k.length - a.k.length); // longest match first

function romanToKannada(text, { ignoreCase = false } = {}){
  const src = ignoreCase ? text.toLowerCase() : text;
  let out = '';
  let pending = false; // last output was a bare consonant (no vowel yet)
  let i = 0;

  while (i < src.length){
    const tok = ROMAN_TOKENS.find(t => src.startsWith(t.k, i));
    if (!tok){
      if (pending){ out += KN_VIRAMA; pending = false; }
      out += src[i];
      i++;
      continue;
    }
    if (tok.type === 'c'){
      if (pending) out += KN_VIRAMA;
      out += ROMAN_CONSONANTS[tok.k];
      pending = true;
    } else if (tok.type === 'v'){
      const [indep, sign] = ROMAN_VOWELS[tok.k];
      out += pending ? sign : indep;
      pending = false;
    } else {
      if (pending){ out += KN_VIRAMA; pending = false; }
      out += ROMAN_MARKS[tok.k];
    }
    i += tok.k.length;
  }
  if (pending) out += KN_VIRAMA;
  return out;
}

/* ---------- does this device have a Tigalari font? ----------
   Measures two Tigalari letters against an unassigned code point
   (always the "missing glyph" box). If every one is exactly as wide as
   the box, there's no font installed. */
function hasTigalariFont(){
  try {
    const ctx = document.createElement('canvas').getContext('2d');
    const stack = getComputedStyle(document.documentElement).getPropertyValue('--font-tg').trim() || 'serif';
    ctx.font = `48px ${stack}`;
    const missing = ctx.measureText(tg(0x113FF)).width;
    return [0x11392, 0x11380].some(cp => ctx.measureText(tg(cp)).width !== missing);
  } catch (e){
    return true; // can't tell — don't nag
  }
}
