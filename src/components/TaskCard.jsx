import { useState } from "react";
import { Icon } from "./Icon";
import {
  diffDays, dueBadge, fmtShort, fmtHours, startByDate, atRisk, avg,
} from "../utils";

const STATUSES = [
  ["todo", "Not started"],
  ["inprogress", "In progress"],
  ["done", "Done"],
];

export default function TaskCard({ task, course, today, capacity, open, onToggle, setStatus, setEffort, crunch }) {
  const d = diffDays(task.due, today);
  const badge = dueBadge(d);
  const done = task.status === "done";
  const risky = atRisk(task, today);
  const sb = startByDate(task, capacity, today);

  let startText = null;
  if (!done) {
    if (d < 0) startText = "Best to finish this one today";
    else if (diffDays(sb, today) <= 0) startText = "Start today";
    else startText = `Start by ${fmtShort(sb)}`;
  }

  const [lo, hi] = task.hours;
  const setLo = (v) => {
    if (Number.isNaN(v) || v < 0.5) return;
    setEffort(task.id, [v, Math.max(v, hi)]);
  };
  const setHi = (v) => {
    if (Number.isNaN(v) || v < 0.5) return;
    setEffort(task.id, [Math.min(lo, v), v]);
  };

  return (
    <article className={`task ${done ? "is-done" : ""} ${crunch && !done ? "is-crunch" : ""}`}>
      <div className="task-row">
        <button
          className={`check ${done ? "on" : ""}`}
          onClick={() => setStatus(task.id, done ? "todo" : "done")}
          aria-label={done ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as done`}
          title={done ? "Mark as not done" : "Mark as done"}
        >
          {done && <Icon name="check" size={16} />}
        </button>

        <button className="task-main" onClick={onToggle} aria-expanded={open}>
          <span className="task-icon" style={{ background: course.color }}>
            <Icon name="assignment" size={20} />
          </span>
          <span className="task-body">
            <span className="task-title">{task.title}</span>
            <span className="task-meta">
              {course.name} · {task.type}
              {task.points ? ` · ${task.points} pts` : ""}
            </span>
            <span className="task-chips">
              <span className="chip">
                <Icon name="clock" size={14} /> about {fmtHours(task.hours)}
                {task.edited && <em> · your estimate</em>}
              </span>
              {startText && <span className="chip chip-soft">{startText}</span>}
              {task.status === "inprogress" && <span className="chip chip-blue">In progress</span>}
              {risky && <span className="chip chip-red">Big one, not started yet</span>}
            </span>
          </span>
          <span className="task-due">
            <span className={`badge ${done ? "grey" : badge.tone}`}>{done ? "Done" : badge.text}</span>
            <span className="due-date">{fmtShort(task.due)}</span>
          </span>
          <span className={`chev ${open ? "up" : ""}`}>
            <Icon name="expand" size={20} />
          </span>
        </button>
      </div>

      {open && (
        <div className="task-detail">
          <p className="desc">{task.description}</p>

          <div className="detail-grid">
            <div>
              <div className="label">Where are you with it?</div>
              <div className="seg" role="group" aria-label="Status">
                {STATUSES.map(([k, label]) => (
                  <button key={k} className={task.status === k ? "on" : ""} onClick={() => setStatus(task.id, k)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="label">How long will this take you?</div>
              <div className="effort">
                <input type="number" min="0.5" step="0.5" value={lo} onChange={(e) => setLo(parseFloat(e.target.value))} aria-label="Fewest hours" />
                <span>to</span>
                <input type="number" min="0.5" step="0.5" value={hi} onChange={(e) => setHi(parseFloat(e.target.value))} aria-label="Most hours" />
                <span>hours</span>
                {task.edited && (
                  <button className="link" onClick={() => setEffort(task.id, null)}>
                    Reset
                  </button>
                )}
              </div>
              <div className="hint">
                {task.edited
                  ? "Using your numbers. Start-by dates follow them."
                  : "This is only a guess from the assignment text. Change it if you know better."}
              </div>
            </div>
          </div>

          {!done && (
            <div className="hint plan-hint">
              At about {capacity}h a day, this needs roughly {Math.max(1, Math.ceil(avg(task.hours) / capacity))}{" "}
              {Math.max(1, Math.ceil(avg(task.hours) / capacity)) === 1 ? "day" : "days"} of work.
            </div>
          )}
        </div>
      )}
    </article>
  );
}
