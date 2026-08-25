/* ===================================================================
   SUPABASE AUTH
   Fill in your project's URL + anon key below (Supabase dashboard ->
   Project Settings -> API). The anon key is safe to expose in
   client-side code — it only works within the Row Level Security
   rules you define. See SETUP.md for full project setup steps.
=================================================================== */
const SUPABASE_URL = "https://qgeejjbwhpfuhscidogc.supabase.co"; // e.g. https://abcdefgh.supabase.co
const SUPABASE_ANON_KEY = "sb_publishable_e-HVubc_pv-VIK504oBDlA_cD_BaPm5";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Where to send users after a successful login/signup.
const REDIRECT_AFTER_AUTH = new URL("dashboard.html", window.location.href).toString();

const form = document.getElementById("authForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const msgEl = document.getElementById("authMsg");
const submitBtn = document.getElementById("submitBtn");
const googleBtn = document.getElementById("googleBtn");
const switchBtn = document.getElementById("switchBtn");
const switchText = document.getElementById("switchText");
const authTitle = document.getElementById("authTitle");
const authSub = document.getElementById("authSub");

let mode = "signup"; // "signup" | "login"

function showMessage(text, type) {
  msgEl.textContent = text;
  msgEl.className = "auth-msg " + (type === "error" ? "is-error" : "is-success");
}

function clearMessage() {
  msgEl.textContent = "";
  msgEl.className = "auth-msg";
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  googleBtn.disabled = isLoading;
  submitBtn.textContent = isLoading
    ? "Please wait…"
    : mode === "signup"
      ? "Create account"
      : "Log in";
}

function setMode(nextMode) {
  mode = nextMode;
  clearMessage();
  if (mode === "signup") {
    form.classList.remove("is-login");
    authTitle.textContent = "Create your account";
    authSub.textContent = "Start your Tulu journey — it's free.";
    submitBtn.textContent = "Create account";
    switchText.textContent = "Already have an account?";
    switchBtn.textContent = "Log in";
  } else {
    form.classList.add("is-login");
    authTitle.textContent = "Welcome back";
    authSub.textContent = "Log in to keep your streak going.";
    submitBtn.textContent = "Log in";
    switchText.textContent = "New here?";
    switchBtn.textContent = "Create an account";
  }
}

switchBtn.addEventListener("click", () => {
  setMode(mode === "signup" ? "login" : "signup");
});

googleBtn.addEventListener("click", async () => {
  clearMessage();
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: REDIRECT_AFTER_AUTH },
  });
  if (error) showMessage(error.message, "error");
  // On success the browser is redirected to Google, then back to
  // REDIRECT_AFTER_AUTH — no further code runs here.
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const name = nameInput.value.trim();

  if (!email || !password) {
    showMessage("Please fill in email and password.", "error");
    return;
  }
  if (password.length < 6) {
    showMessage("Password must be at least 6 characters.", "error");
    return;
  }

  setLoading(true);

  if (mode === "signup") {
    // `data` here is stored as auth.users.raw_user_meta_data.
    // The DB trigger in SETUP.md copies it into the public.profiles
    // table automatically — no separate client-side insert needed
    // (and a client-side insert would need its own RLS policy anyway).
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: { data: { full_name: name || null } },
    });

    setLoading(false);

    if (error) {
      showMessage(error.message, "error");
      return;
    }

    if (data.session) {
      // Email confirmation is OFF in your Supabase Auth settings —
      // the user is signed in immediately.
      showMessage("Account created! Redirecting…", "success");
      setTimeout(() => (window.location.href = REDIRECT_AFTER_AUTH), 800);
    } else {
      // Email confirmation is ON — they must click the link we sent.
      showMessage("Check your email to confirm your account.", "success");
    }
  } else {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      showMessage(error.message, "error");
      return;
    }
    showMessage("Logged in! Redirecting…", "success");
    setTimeout(() => (window.location.href = REDIRECT_AFTER_AUTH), 500);
  }
});

// If the user is already signed in (e.g. came back via a Google OAuth
// redirect straight to this page), send them on to the app.
supabaseClient.auth.getSession().then(({ data }) => {
  if (data.session) window.location.href = REDIRECT_AFTER_AUTH;
});