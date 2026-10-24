// Run with: npm test
import assert from "node:assert/strict";
import { courses, baseAssignments, students, INITIAL_STATUS } from "../src/data.js";
import {
  startOfDay, addDays, diffDays, keyOf, fromKey, dueBadge, startByDate, atRisk,
  crunchDays, tonightPlan, pctCrowded, suggestDay, buildICS, fmtHours,
} from "../src/utils.js";

const today = startOfDay();
const tasks = baseAssignments.map((a) => ({
  ...a,
  due: addDays(today, a.dueInDays),
  status: INITIAL_STATUS[a.id] || "todo",
}));

let n = 0;
const test = (name, fn) => {
  fn();
  n += 1;
  console.log(`  ok  ${name}`);
};

test("assignment ids are unique and every course exists", () => {
  assert.equal(new Set(baseAssignments.map((a) => a.id)).size, baseAssignments.length);
  baseAssignments.forEach((a) => assert.ok(courses.some((c) => c.id === a.course), a.id));
});

test("date helpers round-trip", () => {
  assert.equal(diffDays(addDays(today, 5), today), 5);
  assert.equal(keyOf(fromKey(keyOf(today))), keyOf(today));
});

test("days-left badge colours", () => {
  assert.equal(dueBadge(-1).tone, "red");
  assert.equal(dueBadge(0).text, "Due today");
  assert.equal(dueBadge(1).tone, "red");
  assert.equal(dueBadge(3).tone, "amber");
  assert.equal(dueBadge(4).tone, "green");
});

test("the stacked day is flagged as a crunch day with 3 items", () => {
  const c = crunchDays(tasks, today);
  assert.equal(c.length, 1);
  assert.equal(diffDays(c[0].date, today), 5);
  assert.equal(c[0].items.length, 3);
});

test("finishing one of the three clears the crunch warning", () => {
  const t2 = tasks.map((t) => (t.id === "a5" ? { ...t, status: "done" } : t));
  assert.equal(crunchDays(t2, today).length, 0);
});

test("start-by date is never in the past and moves earlier for bigger tasks", () => {
  const big = tasks.find((t) => t.id === "a3"); // 3-5h, due in 5 days
  const small = tasks.find((t) => t.id === "a14"); // 1-1.5h, due tomorrow
  assert.ok(startByDate(big, 3, today) >= today);
  assert.ok(startByDate(big, 3, today) < big.due);
  assert.ok(startByDate(small, 3, today) >= today);
  assert.ok(diffDays(startByDate(big, 1, today), today) <= diffDays(startByDate(big, 6, today), today));
});

test("at-risk only fires for big, close, not-started work", () => {
  const near = { ...tasks.find((t) => t.id === "a3"), due: addDays(today, 2), status: "todo" };
  assert.equal(atRisk(near, today), true);
  assert.equal(atRisk({ ...near, status: "inprogress" }, today), false);
  assert.equal(atRisk({ ...near, due: addDays(today, 6) }, today), false);
});

test("tonight's plan respects the daily pace", () => {
  [1, 2, 3, 5].forEach((cap) => {
    const p = tonightPlan(tasks, cap, today);
    assert.ok(p.total <= cap + 1e-9, `cap ${cap}`);
    assert.ok(p.items.every((i) => i.task.status !== "done"));
  });
  const p = tonightPlan(tasks, 3, today);
  assert.equal(p.items[0].task.id, "a2"); // the overdue one comes first
});

test("teacher nudge: stacked day is crowded, suggested day is calmer and a weekday", () => {
  const busy = addDays(today, 5);
  const pct = pctCrowded("phys", busy, tasks, students);
  assert.ok(pct >= 50, `expected a crowded day, got ${pct}%`);
  const s = suggestDay("phys", busy, tasks, students, today);
  assert.ok(s, "expected a suggestion");
  assert.ok(s.pct < pct);
  assert.ok(![0, 6].includes(s.date.getDay()));
  assert.ok(s.date > today);
});

test("calendar export has one event per task", () => {
  const ics = buildICS(tasks, courses);
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, tasks.length);
  assert.ok(ics.startsWith("BEGIN:VCALENDAR"));
});

test("hours format", () => {
  assert.equal(fmtHours([2, 3]), "2–3h");
  assert.equal(fmtHours([1.5, 1.5]), "1.5h");
});

console.log(`\n${n} checks passed`);
