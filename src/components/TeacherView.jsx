import { useState } from "react";
import { Icon } from "./Icon";
import {
  addDays, keyOf, fromKey, fmtLong, fmtShort, diffDays, pctCrowded, suggestDay, weekday,
} from "../utils";

function firstBusyDay(tasks, today) {
  const map = {};
  tasks.forEach((t) => {
    const d = diffDays(t.due, today);
    if (d >= 1 && d <= 14) map[keyOf(t.due)] = (map[keyOf(t.due)] || 0) + 1;
  });
  const hit = Object.entries(map).filter(([, n]) => n >= 3).sort()[0];
  return hit ? hit[0] : keyOf(addDays(today, 5));
}

export default function TeacherView({ tasks, today, courses, students, custom, onPost, onRemove }) {
  const [courseId, setCourseId] = useState("phys");
  const [title, setTitle] = useState("");
  const [hours, setHours] = useState(2);
  const [dateKey, setDateKey] = useState(() => firstBusyDay(tasks, today));
  const [keptKey, setKeptKey] = useState(null);

  const course = courses.find((c) => c.id === courseId);
  const date = fromKey(dateKey);
  const enrolled = students.filter((s) => s.includes(courseId)).length;
  const pct = pctCrowded(courseId, date, tasks, students);
  const suggestion = suggestDay(courseId, date, tasks, students, today);
  const crowded = pct >= 50 && keptKey !== `${courseId}|${dateKey}`;

  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i + 1));

  const post = () => {
    if (!title.trim()) return;
    const h = Math.max(0.5, Number(hours) || 1);
    onPost({
      id: `c${Date.now()}`,
      course: courseId,
      title: title.trim(),
      type: "Assignment",
      points: 20,
      dueKey: dateKey,
      hours: [Math.max(0.5, h - 0.5), h + 0.5],
      description: "Posted from the teacher view of this prototype.",
    }, date);
    setTitle("");
  };

  let nudge;
  if (crowded) {
    nudge = (
      <div className="nudge warn">
        <Icon name="warning" size={22} />
        <div>
          <strong>{pct}% of your students already have 2 or more deadlines on {weekday(date)}.</strong>
          {suggestion ? (
            <p>
              {fmtShort(suggestion.date)} is much calmer
              {suggestion.pct <= 5 ? ": almost nobody has anything else due." : `: only ${suggestion.pct}% would be doubled up.`}{" "}
              Want to move it?
            </p>
          ) : (
            <p>There isn't a clearly calmer weekday nearby, so you might keep it, or give a little extra notice.</p>
          )}
          {suggestion && (
            <div className="nudge-actions">
              <button className="btn btn-primary" onClick={() => setDateKey(keyOf(suggestion.date))}>
                Use {weekday(suggestion.date)}
              </button>
              <button className="btn btn-ghost" onClick={() => setKeptKey(`${courseId}|${dateKey}`)}>Keep {weekday(date)}</button>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    nudge = (
      <div className="nudge ok">
        <Icon name="check" size={22} />
        <div>
          <strong>{pct >= 50 ? `Keeping ${weekday(date)}.` : "That day looks comfortable."}</strong>
          <p>
            {pct >= 50
              ? `${pct}% of students will have a busy day, and their trackers will show a crunch-day warning so they can plan ahead.`
              : `Only ${pct}% of your students already have 2 or more deadlines on ${weekday(date)}.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>
            Schedule work <span className="new-chip">New</span>
          </h1>
          <p className="sub">
            A small heads-up when a due date lands on a day your students are already stretched.
          </p>
        </div>
      </div>

      <div className="teacher-grid">
        <section className="card form">
          <h2>New assignment</h2>
          <label>
            Class
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.teacher})</option>
              ))}
            </select>
          </label>
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Wave optics worksheet" />
          </label>
          <div className="form-row">
            <label>
              Due date
              <input type="date" min={keyOf(addDays(today, 1))} value={dateKey} onChange={(e) => e.target.value && setDateKey(e.target.value)} />
            </label>
            <label>
              Rough time (hours)
              <input type="number" min="0.5" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} />
            </label>
          </div>
          <div className="due-line">Due {fmtLong(date)}</div>
          {nudge}
          <button className="btn btn-primary wide" onClick={post} disabled={!title.trim()}>
            Assign to {enrolled} students
          </button>
          <p className="privacy">
            Teachers only see counts like these. They never see an individual student's workload.
          </p>
        </section>

        <div className="teacher-side">
          <section className="card">
            <div className="card-head">
              <h2>How busy are {course.name} students?</h2>
              <p>Share of students with 2 or more other deadlines. Tap a bar to try that day.</p>
            </div>
            <div className="bars" role="list">
              {days.map((d) => {
                const k = keyOf(d);
                const p = pctCrowded(courseId, d, tasks, students);
                const tone = p >= 60 ? "red" : p >= 30 ? "amber" : "green";
                return (
                  <button
                    key={k}
                    role="listitem"
                    className={`bar-col ${k === dateKey ? "picked" : ""}`}
                    onClick={() => setDateKey(k)}
                    title={`${fmtShort(d)}: ${p}% of students have 2+ deadlines`}
                    aria-label={`${fmtShort(d)}: ${p} percent`}
                  >
                    <span className="bar-val">{p}%</span>
                    <span className="bar-track">
                      <span className={`bar ${tone}`} style={{ height: `${Math.max(4, p)}%` }} />
                    </span>
                    <span className="bar-lbl">{d.toLocaleDateString("en-IN", { weekday: "narrow" })}</span>
                    <span className="bar-date">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="card">
            <div className="card-head">
              <h2>Assigned in this session</h2>
              <p>These show up straight away in the student's My Tracker.</p>
            </div>
            {custom.length === 0 ? (
              <p className="muted">Nothing yet. Post one on the left and switch to Student view to see it land.</p>
            ) : (
              <ul className="posted">
                {custom.map((a) => {
                  const c = courses.find((x) => x.id === a.course);
                  return (
                    <li key={a.id}>
                      <span className="plan-dot" style={{ background: c.color }} />
                      <span className="plan-name">{a.title} <em>· {c.name} · due {fmtShort(fromKey(a.dueKey))}</em></span>
                      <button className="icon-btn small" onClick={() => onRemove(a.id)} aria-label={`Remove ${a.title}`}>
                        <Icon name="trash" size={18} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
