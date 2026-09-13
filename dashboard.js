/* ===================================================================
   LEARNING DASHBOARD
   Requires a logged-in Supabase session. Reads streak/xp from the
   `profiles` row created automatically on sign-up (see
   supabase-schema.sql). Badges are derived client-side from
   xp/streak thresholds — once lesson completion is wired up to
   Supabase, these could move to their own `user_badges` table.
=================================================================== */
const SUPABASE_URL = "https://qgeejjbwhpfuhscidogc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_e-HVubc_pv-VIK504oBDlA_cD_BaPm5";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
 
const XP_PER_LEVEL = 500;
 
const BADGES = [
  { key: "welcome",   icon: "🎉", name: "Welcome Aboard", desc: "Created your account",     test: () => true },
  { key: "started",   icon: "🌱", name: "Getting Started", desc: "Earn 50 XP",              test: (p) => p.xp >= 50 },
  { key: "onfire",     icon: "🔥", name: "On Fire",         desc: "3-day streak",            test: (p) => p.streak >= 3 },
  { key: "week",       icon: "📅", name: "Week Warrior",    desc: "7-day streak",            test: (p) => p.streak >= 7 },
  { key: "xphunter",   icon: "💎", name: "XP Hunter",       desc: "Reach Level 2 (500 XP)",  test: (p) => p.xp >= 500 },
  { key: "dedicated",  icon: "🏆", name: "Dedicated",       desc: "30-day streak",           test: (p) => p.streak >= 30 },
  { key: "scholar",    icon: "📖", name: "Coastal Scholar", desc: "Reach 2,000 XP",          test: (p) => p.xp >= 2000 },
];
 
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
 
// Mirrors the units on the homepage roadmap (see script.js ROADMAP_UNITS).
// `unlocked: true` means the user can enroll directly from the dashboard;
// the rest stay locked until unit progression is wired up.
const COURSES = [
  { key: "unit-1", icon: "🌱", name: "Unit 1", title: "First Words", color: "var(--e1)", unlocked: true },
  { key: "unit-2", icon: "🌊", name: "Unit 2", title: "Everyday Tulu", color: "var(--e2)", unlocked: false },
  { key: "unit-3", icon: "📖", name: "Unit 3", title: "Reading Tulu", color: "var(--e3)", unlocked: false },
  { key: "unit-4", icon: "🎭", name: "Unit 4", title: "Culture Deep-Dive", color: "var(--e4)", unlocked: false },
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
 
  const enrolledKeys = await fetchEnrollments(user.id);
 
  render(user, profile, enrolledKeys);
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
 
async function fetchEnrollments(userId) {
  const { data, error } = await supabaseClient
    .from("enrollments")
    .select("unit_key")
    .eq("user_id", userId);
 
  if (error) {
    console.warn("Could not load enrollments:", error.message);
    return new Set();
  }
  return new Set(data.map((row) => row.unit_key));
}
 
function render(user, profile, enrolledKeys) {
  const name = profile.full_name || profile.email?.split("@")[0] || "there";
  const xp = profile.xp || 0;
  const streak = profile.streak || 0;
 
  document.getElementById("dashAvatar").textContent = name.charAt(0).toUpperCase() || "🦜";
  document.getElementById("dashHello").textContent = `Hey, ${name}! 👋`;
 
  document.getElementById("statStreak").textContent = streak;
  document.getElementById("statXp").textContent = xp.toLocaleString();
 
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = xp % XP_PER_LEVEL;
  const pct = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100);
 
  document.getElementById("statLevel").textContent = level;
  document.getElementById("levelNow").textContent = level;
  document.getElementById("levelXpLabel").textContent = `${xpIntoLevel} / ${XP_PER_LEVEL} XP`;
  document.getElementById("levelFill").style.width = pct + "%";
  document.getElementById("levelHint").textContent =
    `Earn ${XP_PER_LEVEL - xpIntoLevel} more XP to reach Level ${level + 1}.`;
 
  renderWeek(streak);
  renderBadges(profile);
  renderCourses(user.id, enrolledKeys);
 
  document.getElementById("dashLoading").hidden = true;
  document.getElementById("dashContent").hidden = false;
}
 
// Heuristic weekly view: marks the last `streak` days (capped at 7,
// ending today) as complete. Swap this for a real per-day activity
// log table once lesson completion is tracked in the DB.
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
      <span class="dash-day-dot ${isDone ? "is-done" : ""} ${isToday ? "is-today" : ""}">
        ${isDone ? "🔥" : ""}
      </span>
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
      <span class="dash-badge-icon">${earned ? badge.icon : "🔒"}</span>
      <span class="dash-badge-name">${badge.name}</span>
      <span class="dash-badge-desc">${badge.desc}</span>
    `;
    wrap.appendChild(el);
  });
 
  document.getElementById("badgeCount").textContent = `${earnedCount} / ${BADGES.length} earned`;
}
 
function renderCourses(userId, enrolledKeys) {
  const wrap = document.getElementById("dashCourses");
  wrap.innerHTML = "";
 
  COURSES.forEach((course) => {
    const isEnrolled = enrolledKeys.has(course.key);
 
    const row = document.createElement("div");
    row.className = "dash-course";
    row.innerHTML = `
      <span class="dash-course-icon" style="--cc:${course.color}">${course.icon}</span>
      <span class="dash-course-body">
        <span class="dash-course-name">${course.name}</span>
        <span class="dash-course-title">${course.title}</span>
      </span>
    `;
 
    const btn = document.createElement("button");
    btn.type = "button";
 
    if (isEnrolled) {
      btn.className = "dash-course-btn is-continue";
      btn.textContent = "Continue →";
      btn.addEventListener("click", () => {
        const target = course.key === "unit-1" ? "unit1.html" : course.key === "unit-2" ? "unit2.html" : "index.html#roadmap";
        window.location.href = target;
      });
    } else if (course.unlocked) {
      btn.className = "dash-course-btn is-add";
      btn.textContent = "＋ Add course";
      btn.addEventListener("click", () => enrollInCourse(userId, course.key, btn));
    } else {
      btn.className = "dash-course-btn is-locked";
      btn.textContent = "🔒 Locked";
      btn.disabled = true;
    }
 
    row.appendChild(btn);
    wrap.appendChild(row);
  });
 
  document.getElementById("courseCount").textContent =
    `${enrolledKeys.size} / ${COURSES.length} started`;
}
 
async function enrollInCourse(userId, unitKey, btn) {
  btn.disabled = true;
  btn.textContent = "Adding…";
 
  const { error } = await supabaseClient
    .from("enrollments")
    .upsert({ user_id: userId, unit_key: unitKey }, { onConflict: "user_id,unit_key" });
 
  if (error) {
    console.warn("Could not add course:", error.message);
    btn.disabled = false;
    btn.textContent = "＋ Add course";
    return;
  }
 
  btn.className = "dash-course-btn is-continue";
  btn.textContent = "Added! Opening →";
  setTimeout(() => {
    const target = unitKey === "unit-1" ? "unit1.html" : unitKey === "unit-2" ? "unit2.html" : "index.html#roadmap";
    window.location.href = target;
  }, 500);
}
 
async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}
 