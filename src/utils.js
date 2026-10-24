// Small helpers: dates, deadlines, crunch days, the evening plan, calendar export.

export const DAY = 86400000;

export const startOfDay = (d = new Date()) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
export const addDays = (d, n) => {
  const x = startOfDay(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const diffDays = (a, b) => Math.round((startOfDay(a) - startOfDay(b)) / DAY);

const p2 = (n) => String(n).padStart(2, "0");
export const keyOf = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
export const fromKey = (k) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const fmtShort = (d) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
export const fmtLong = (d) => d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
export const weekday = (d) => d.toLocaleDateString("en-IN", { weekday: "long" });

const n1 = (x) => (Number.isInteger(x) ? String(x) : x.toFixed(1));
export const fmtHours = ([a, b]) => (a === b ? `${n1(a)}h` : `${n1(a)}–${n1(b)}h`);
export const avg = ([a, b]) => (a + b) / 2;
export const roundHalf = (x) => Math.round(x * 2) / 2;

export function greeting(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// The coloured "3 days left" badge.
export function dueBadge(days) {
  if (days < 0) return { text: days === -1 ? "Overdue by 1 day" : `Overdue by ${-days} days`, tone: "red" };
  if (days === 0) return { text: "Due today", tone: "red" };
  if (days === 1) return { text: "Due tomorrow", tone: "red" };
  if (days <= 3) return { text: `${days} days left`, tone: "amber" };
  return { text: `${days} days left`, tone: "green" };
}

// How many days of work a task needs at your daily pace, and when to begin.
export const daysNeeded = (task, capacity) => Math.max(1, Math.ceil(avg(task.hours) / capacity));
export function startByDate(task, capacity, today) {
  const s = addDays(task.due, -daysNeeded(task, capacity));
  return s < today ? today : s;
}

// Big, not started, and close: worth a gentle nudge.
export function atRisk(task, today) {
  const d = diffDays(task.due, today);
  return task.status === "todo" && d >= 0 && d <= 2 && avg(task.hours) >= 3;
}

// Days where 3 or more unfinished things land together.
export function crunchDays(tasks, today) {
  const map = {};
  tasks
    .filter((t) => t.status !== "done" && diffDays(t.due, today) >= 0)
    .forEach((t) => {
      const k = keyOf(t.due);
      const m = map[k] || (map[k] = { key: k, date: t.due, items: [], hours: [0, 0] });
      m.items.push(t);
      m.hours[0] += t.hours[0];
      m.hours[1] += t.hours[1];
    });
  return Object.values(map)
    .filter((m) => m.items.length >= 3)
    .sort((a, b) => a.date - b.date);
}

// A realistic slice of work for today: things you should have started, in order of urgency.
export function tonightPlan(tasks, capacity, today) {
  const cand = tasks
    .filter((t) => t.status !== "done")
    .map((t) => ({ t, d: diffDays(t.due, today) }))
    .filter(({ t, d }) => d <= 0 || startByDate(t, capacity, today) <= today)
    .sort((a, b) => a.d - b.d);
  let left = capacity;
  const items = [];
  for (const { t, d } of cand) {
    if (left <= 0) break;
    const need = avg(t.hours);
    const share = d <= 0 ? need : Math.max(0.5, roundHalf(need / Math.max(1, d)));
    const h = Math.min(share, left);
    items.push({ task: t, hours: h, overdue: d < 0 });
    left -= h;
  }
  return { items, total: capacity - left, left };
}

// Teacher side: what share of a course's students already have 2+ other deadlines that day?
export function pctCrowded(courseId, date, tasks, students) {
  const enrolled = students.filter((s) => s.includes(courseId));
  if (!enrolled.length) return 0;
  const k = keyOf(date);
  const n = enrolled.filter((s) => tasks.filter((t) => s.includes(t.course) && keyOf(t.due) === k).length >= 2).length;
  return Math.round((100 * n) / enrolled.length);
}

// Find a calmer weekday within 3 days either side.
export function suggestDay(courseId, date, tasks, students, today) {
  const current = pctCrowded(courseId, date, tasks, students);
  let best = null;
  for (const off of [-3, -2, -1, 1, 2, 3]) {
    const d = addDays(date, off);
    if (d <= today) continue;
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const pct = pctCrowded(courseId, d, tasks, students);
    const better =
      !best ||
      pct < best.pct ||
      (pct === best.pct && Math.abs(off) < Math.abs(best.off)) ||
      (pct === best.pct && Math.abs(off) === Math.abs(best.off) && off > best.off);
    if (better) best = { date: d, pct, off };
  }
  return best && best.pct < current ? best : null;
}

// Download your deadlines as a calendar file (works with Google Calendar).
export function buildICS(tasks, courses) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const esc = (s) => s.replace(/([,;\\])/g, "\\$1");
  const events = tasks.flatMap((t) => {
    const c = courses.find((x) => x.id === t.course);
    const start = keyOf(t.due).replaceAll("-", "");
    const end = keyOf(addDays(t.due, 1)).replaceAll("-", "");
    return [
      "BEGIN:VEVENT",
      `UID:${t.id}@my-tracker-concept`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      `SUMMARY:${esc(`${c ? c.name : "Class"}: ${t.title}`)}`,
      `DESCRIPTION:${esc(`About ${fmtHours(t.hours)} of work.`)}`,
      "END:VEVENT",
    ];
  });
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Classroom My Tracker concept//EN", ...events, "END:VCALENDAR"].join("\r\n");
}

export function downloadFile(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
