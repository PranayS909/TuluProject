/* ===================================================================
   CONTRIBUTE PAGE — "suggest a word" form → Supabase `suggestions`
   table. Run supabase-schema-suggestions.sql first (see SETUP.md).
=================================================================== */
const SUPABASE_URL = "https://qgeejjbwhpfuhscidogc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_e-HVubc_pv-VIK504oBDlA_cD_BaPm5";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const contribForm = document.getElementById('contribForm');
const contribMsg = document.getElementById('contribMsg');
const contribSubmit = document.getElementById('contribSubmit');

function showContribMessage(text, type){
  contribMsg.textContent = text;
  contribMsg.className = `contrib-msg ${type === 'error' ? 'is-error' : 'is-success'}`;
}

// feedback doesn't need the word/meaning boxes
contribForm.querySelectorAll('input[name="kind"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const feedback = contribForm.kind.value === 'feedback';
    document.getElementById('wordFields').hidden = feedback;
    document.getElementById('notesLabel').textContent = feedback
      ? 'Your feedback'
      : 'Notes (optional): usage, example sentence, which page has the mistake…';
  });
});

contribForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = contribForm;
  const clean = (v) => v.trim() || null;

  if (f.website.value) return; // bot filled the hidden field

  const kind = f.kind.value;
  const row = {
    kind,
    tulu: kind === 'feedback' ? null : clean(f.tulu.value),
    meaning: kind === 'feedback' ? null : clean(f.meaning.value),
    region: clean(f.region.value),
    notes: clean(f.notes.value),
    display_name: clean(f.display_name.value),
  };

  if (kind === 'feedback' && !row.notes) return showContribMessage('Please write your feedback first.', 'error');
  if (kind !== 'feedback' && !row.tulu && !row.notes) return showContribMessage('Please add the Tulu word (or describe the correction in Notes).', 'error');

  contribSubmit.disabled = true;
  contribSubmit.textContent = 'Sending…';

  try {
    const { data:{ session } } = await supabaseClient.auth.getSession();
    if (session) row.user_id = session.user.id;

    const { error } = await supabaseClient.from('suggestions').insert(row);
    if (error) throw error;

    f.reset();
    f.querySelector('input[name="kind"]:checked').dispatchEvent(new Event('change'));
    showContribMessage('Solmelu! 🙏 Thank you, your suggestion has been sent.', 'success');
  } catch (err){
    console.error(err);
    showContribMessage('Sorry, that didn\'t send. Please try again in a moment.', 'error');
  } finally {
    contribSubmit.disabled = false;
    contribSubmit.textContent = 'SEND SUGGESTION';
  }
});
