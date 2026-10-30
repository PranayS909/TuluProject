/* ===================================================================
   LEARNING DASHBOARD
   Requires a logged-in Supabase session. Reads streak/xp from the
   `profiles` row created automatically on sign-up (see
   supabase-schema.sql) and unit status from `enrollments`, which
   complete_unit() marks 'complete' (see supabase-schema-progress.sql).
   Badges are derived client-side from xp/streak thresholds.
=================================================================== */
const SUPABASE_URL = "https://qgeejjbwhpfuhscidogc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_e-HVubc_pv-VIK504oBDlA_cD_BaPm5";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const XP_PER_LEVEL = 500;

const BADGES = [
  { key: "welcome",   name: "Welcome Aboard",  desc: "Created your account",    test: () => true },
  { key: "started",   name: "Getting Started", desc: "Earn 50 XP",              test: (p) => p.xp >= 50 },
  { key: "onfire",    name: "On a Roll",       desc: "3-day streak",            test: (p) => p.streak >= 3 },
  { key: "week",      name: "Week Warrior",    desc: "7-day streak",            test: (p) => p.streak >= 7 },
  { key: "xphunter",  name: "XP Hunter",       desc: "Reach Level 2 (500 XP)",  test: (p) => p.xp >= 500 },
  { key: "dedicated", name: "Dedicated",       desc: "30-day streak",           test: (p) => p.streak >= 30 },
  { key: "scholar",   name: "Coastal Scholar", desc: "Reach 2,000 XP",          test: (p) => p.xp >= 2000 },
];

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

// Mirrors the units on the homepage course list (script.js ROADMAP_UNITS).
const COURSES = [
  { key: "unit-1", name: "Unit 1", title: "First Words",       href: "unit1.html" },
  { key: "unit-2", name: "Unit 2", title: "Everyday Tulu",     href: "unit2.html" },
  { key: "unit-3", name: "Unit 3", title: "Reading Tulu",      href: "unit3.html" },
  { key: "unit-4", name: "Unit 4", title: "Culture Deep-Dive", href: "unit4.html" },
  { key: "unit-5", name: "Unit 5", title: "Out and About",     href: "unit5.html" },
];

document.addEventListener("DOMContentLoaded", init);

async function init() {
  document.getElementById("logoutBtn").addEventListener("click", logout);

  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "register.html";
    return;
  }

  const user = session.user;

  let profile = await fetchProfile(user.id);

  // Fallback in case the DB trigger hasn't run yet / profile is missing.
  if (!profile) {
    profile = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      xp: 0,
      streak: 0,
    };
  }

  const enrollments = await fetchEnrollments(user.id);

  render(user, profile, enrollments);
}

async function fetchProfile(userId) {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("full_name, email, xp, streak")
    .eq("id", userId)
    .single();

  if (error) {
    console.warn("Could not load profile:", error.message);
    return null;
  }
  return data;
}

// Map of unit_key → 'in_progress' | 'complete'
async function fetchEnrollments(userId) {
  const { data, error } = await supabaseClient
    .from("enrollments")
    .select("unit_key, status")
    .eq("user_id", userId);

  if (error) {
    console.warn("Could not load enrollments:", error.message);
    return new Map();
  }
  return new Map(data.map((row) => [row.unit_key, row.status]));
}

function render(user, profile, enrollments) {
  const name = profile.full_name || profile.email?.split("@")[0] || "there";
  const xp = profile.xp || 0;
  const streak = profile.streak || 0;

  document.getElementById("dashAvatar").textContent = name.charAt(0).toUpperCase();
  document.getElementById("dashHello").textContent = `Welcome back, ${name}.`;

  document.getElementById("statStreak").textContent = streak;
  document.getElementById("statXp").textContent = xp.toLocaleString();

  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = xp % XP_PER_LEVEL;
  const pct = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100);

  document.getElementById("statLevel").textContent = level;
  document.getElementById("levelNow").textContent = level;
  document.getElementById("levelXpLabel").textContent = `${xpIntoLevel} / ${XP_PER_LEVEL} XP`;
  document.getElementById("levelHint").textContent =
    `Earn ${XP_PER_LEVEL - xpIntoLevel} more XP to reach Level ${level + 1}.`;

  renderWeek(streak);
  renderBadges(profile);
  renderCourses(user.id, enrollments);

  document.getElementById("dashLoading").hidden = true;
  document.getElementById("dashContent").hidden = false;
  requestAnimationFrame(() => { document.getElementById("levelFill").style.width = pct + "%"; });
}

// Heuristic weekly view: marks the last `streak` days (capped at 7,
// ending today) as complete. Swap this for a real per-day activity
// log once lesson completion is tracked day by day.
function renderWeek(streak) {
  const week = document.getElementById("dashWeek");
  week.innerHTML = "";
  const today = new Date().getDay(); // 0 = Sunday

  for (let i = 6; i >= 0; i--) {
    const dayIndex = (today - i + 7) % 7;
    const isToday = i === 0;
    const isDone = i < Math.min(streak, 7);

    const cell = document.createElement("div");
    cell.className = "dash-day";
    cell.innerHTML = `
      <span class="dash-day-label">${DAY_LABELS[dayIndex]}</span>
      <span class="dash-day-dot ${isDone ? "is-done" : ""} ${isToday ? "is-today" : ""}"></span>
    `;
    week.appendChild(cell);
  }

  document.getElementById("weekStreakLabel").textContent =
    `${streak} day${streak === 1 ? "" : "s"} streak`;
}

function renderBadges(profile) {
  const wrap = document.getElementById("dashBadges");
  wrap.innerHTML = "";
  let earnedCount = 0;

  BADGES.forEach((badge) => {
    const earned = badge.test(profile);
    if (earned) earnedCount++;

    const el = document.createElement("div");
    el.className = `dash-badge ${earned ? "is-earned" : "is-locked"}`;
    el.innerHTML = `
      <span class="dash-badge-icon" aria-hidden="true"></span>
      <span class="dash-badge-name">${badge.name}</span>
      <span class="dash-badge-desc">${earned ? badge.desc : `Not yet: ${badge.desc.toLowerCase()}`}</span>
    `;
    wrap.appendChild(el);
  });

  document.getElementById("badgeCount").textContent = `${earnedCount} / ${BADGES.length} earned`;
}

function renderCourses(userId, enrollments) {
  const wrap = document.getElementById("dashCourses");
  wrap.innerHTML = "";

  COURSES.forEach((course, i) => {
    const status = enrollments.get(course.key);

    const row = document.createElement("div");
    row.className = `dash-course${status === "complete" ? " is-complete" : ""}`;
    row.innerHTML = `
      <span class="dash-course-icon" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
      <span class="dash-course-body">
        <span class="dash-course-name">${course.name}${status === "complete" ? " · complete" : ""}</span>
        <span class="dash-course-title">${course.title}</span>
      </span>
    `;

    const btn = document.createElement("button");
    btn.type = "button";

    if (status === "complete") {
      btn.className = "dash-course-btn is-review";
      btn.textContent = "Review";
      btn.addEventListener("click", () => { window.location.href = course.href; });
    } else if (status) {
      btn.className = "dash-course-btn is-continue";
      btn.textContent = "Continue →";
      btn.addEventListener("click", () => { window.location.href = course.href; });
    } else {
      btn.className = "dash-course-btn is-add";
      btn.textContent = "Start";
      btn.addEventListener("click", () => enrollInCourse(userId, course, btn));
    }

    row.appendChild(btn);
    wrap.appendChild(row);
  });

  document.getElementById("courseCount").textContent =
    `${[...enrollments.values()].filter((s) => s === "complete").length} / ${COURSES.length} complete`;

  // "Continue learning" goes to the first unit not yet complete.
  const next = COURSES.find((c) => enrollments.get(c.key) !== "complete");
  const cta = document.getElementById("dashCta");
  if (cta) {
    cta.href = next ? next.href : COURSES[0].href;
    cta.firstChild.textContent = next ? `Continue: ${next.name} ` : "Review the course ";
  }
}

async function enrollInCourse(userId, course, btn) {
  btn.disabled = true;
  btn.textContent = "Starting…";

  const { error } = await supabaseClient
    .from("enrollments")
    .upsert({ user_id: userId, unit_key: course.key }, { onConflict: "user_id,unit_key" });

  if (error) {
    console.warn("Could not start unit:", error.message);
    btn.disabled = false;
    btn.textContent = "Start";
    return;
  }

  window.location.href = course.href;
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}
