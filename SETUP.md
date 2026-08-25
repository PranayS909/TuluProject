# Setting up Supabase for the Tulu registration page

This connects `register.html` (email/password signup + "Continue with
Google") to a real backend that stores your users.

## 1. Create the project

1. Go to https://supabase.com and sign in (GitHub login is easiest).
2. Click **New project**.
3. Pick an organization, give the project a name (e.g. `tulu-app`),
   set a database password (save it somewhere), pick a region close
   to your users, and click **Create new project**. Wait ~2 minutes
   for it to provision.

## 2. Get your API key

1. In the project, go to **Project Settings** (gear icon) → **API**.
2. Copy the **Project URL** and the **anon / public** key.
3. Open `auth.js` and paste them in at the top:
   ```js
   const SUPABASE_URL = "https://xxxxxxxx.supabase.co";
   const SUPABASE_ANON_KEY = "eyJhbGciOi...";
   ```
   The anon key is meant to be public/client-side — it's restricted
   by the Row Level Security rules you set up in step 4.

## 3. Create the database table

1. In the dashboard, open **SQL Editor** → **New query**.
2. Paste in the contents of `supabase-schema.sql` (included alongside
   this file) and click **Run**.
3. This creates a `profiles` table, locks it down with Row Level
   Security, and adds a trigger so that **every new sign-up
   (email/password or Google) automatically gets a row** — you don't
   need any extra code in the app to "add the user" yourself.

## 4. Turn on email/password auth (on by default)

1. Go to **Authentication** → **Providers**.
2. Confirm **Email** is enabled.
3. Under **Authentication** → **Settings**, decide whether you want
   **Confirm email** on or off:
   - **On** (default, recommended): users get a confirmation email
     before they can log in. `register.html` already handles this —
     it shows "Check your email to confirm."
   - **Off**: users are logged in immediately after signing up.

## 5. Turn on Google login

1. **Create a Google OAuth client:**
   - Go to https://console.cloud.google.com/apis/credentials
   - Create a project (or pick an existing one).
   - Click **Create credentials** → **OAuth client ID**.
   - If prompted, configure the **OAuth consent screen** first
     (External, add your app name + your email, no special scopes needed).
   - Application type: **Web application**.
   - Under **Authorized redirect URIs**, add:
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
     (Find `<your-project-ref>` in your Supabase Project URL.)
   - Click **Create**. Copy the **Client ID** and **Client secret**.

2. **Add them to Supabase:**
   - In Supabase: **Authentication** → **Providers** → **Google**.
   - Toggle it on, paste in the **Client ID** and **Client secret**
     from Google, and click **Save**.

3. **Set your site URLs** (so redirects after login go to the right
   place):
   - **Authentication** → **URL Configuration**.
   - **Site URL**: your production URL (e.g. `https://your-site.com`).
   - **Redirect URLs**: add both your production URL and, while
     testing locally, something like `http://localhost:5500` or
     wherever you serve the files from (whatever `index.html`'s URL
     is during local testing).

## 6. Test it

1. Serve the folder locally (e.g. `npx serve`, or the VS Code "Live
   Server" extension — opening `index.html` directly as a `file://`
   URL won't work with OAuth redirects).
2. Click **GET STARTED** on the homepage → you land on
   `register.html`.
3. Try creating an account with email/password, and try **Continue
   with Google**.
4. In the Supabase dashboard, check **Authentication** → **Users**
   (the login exists) and **Table Editor** → `profiles` (the profile
   row was auto-created by the trigger).

## 7. The dashboard

`register.html` now redirects to **`dashboard.html`** after a
successful sign-up or login (instead of straight to the homepage).

- `dashboard.js` uses the same `SUPABASE_URL` / `SUPABASE_ANON_KEY` —
  paste them in there too.
- It checks for a logged-in session on load and bounces back to
  `register.html` if there isn't one, so it's not publicly viewable.
- It reads `xp` and `streak` straight from the `profiles` row and
  computes **Level** as `floor(xp / 500) + 1`.
- **Badges** are computed client-side from xp/streak thresholds
  (defined at the top of `dashboard.js`) — no extra table needed yet.
- The **weekly streak row** is a visual approximation built from the
  `streak` number (marks the last N days). For a fully accurate
  calendar you'd want a `daily_activity` table logging one row per
  active day — happy to add that when lesson completion is wired up.

**Important gap to know about:** nothing currently *increments*
`xp` or `streak` in the database — the roadmap/lessons on the
homepage are still static front-end data, not connected to Supabase.
Right now every new user's dashboard will show `0` for both until you
add that logic (e.g. an update to `profiles.xp`/`profiles.streak`
whenever a lesson node is completed). Ask me when you're ready to
wire that up.

## 8. Courses on the dashboard

The dashboard now has a **Courses** card listing the four homepage
units, with an **＋ Add course** button on Unit 1 (the others show
🔒 Locked until unit progression is wired up).

1. Run `supabase-schema-enrollments.sql` in the SQL Editor (same way
   as the first schema file) — it adds an `enrollments` table with
   RLS so users can only see/add their own rows.
2. Clicking **＋ Add course** on Unit 1 inserts a row into
   `enrollments` for that user, then takes them to
   `index.html#roadmap`. Next time they visit the dashboard, that
   course shows a **Continue →** button instead.

## Notes

- Never commit your **service role** key anywhere in this front-end
  code — only the **anon** key belongs in `auth.js` and `dashboard.js`.
- In **Authentication → URL Configuration → Redirect URLs**, make sure
  both `dashboard.html` and `index.html` are covered (add the full
  URLs for each, or a wildcard like `https://your-site.com/*`).
- If you rename or move `dashboard.html`, update `REDIRECT_AFTER_AUTH`
  in `auth.js` to match.
