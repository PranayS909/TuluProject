/* ===================================================================
   PROGRESS — saves finished units.
   Always remembers them on this device; if the learner is signed in,
   also calls the complete_unit() database function (see
   supabase-schema-progress.sql), which awards XP and updates the streak.
   Needs the Supabase script tag loaded before this file.
=================================================================== */
const TuluProgress = (() => {
  const SUPABASE_URL = "https://qgeejjbwhpfuhscidogc.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_e-HVubc_pv-VIK504oBDlA_cD_BaPm5";
  const LOCAL_KEY = 'tuluUnitsDone';

  let client = null;
  function getClient(){
    if (client) return client;
    if (!window.supabase || !window.supabase.createClient) return null;
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return client;
  }

  function localDone(){
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch (e){ return []; }
  }
  function rememberLocally(unitKey){
    const done = localDone();
    if (done.includes(unitKey)) return;
    done.push(unitKey);
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(done)); } catch (e){ /* private mode */ }
  }

  // Resolves to { saved:true, xp, total, streak, firstTime }
  //          or { saved:false, reason:'signed-out' | 'offline' | 'error' }
  async function completeUnit(unitKey){
    rememberLocally(unitKey);
    const c = getClient();
    if (!c) return { saved:false, reason:'offline' };
    try {
      const { data:{ session } } = await c.auth.getSession();
      if (!session) return { saved:false, reason:'signed-out' };
      const { data, error } = await c.rpc('complete_unit', { p_unit_key: unitKey });
      if (error) throw error;
      return {
        saved:true,
        xp: data && data.xp_awarded || 0,
        total: data && data.xp_total,
        streak: data && data.streak,
        firstTime: !!(data && data.first_time),
      };
    } catch (err){
      console.warn('Could not save progress:', err.message || err);
      return { saved:false, reason:'error' };
    }
  }

  return { completeUnit, localDone };
})();
