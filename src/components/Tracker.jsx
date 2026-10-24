import { useState } from "react";
import { Icon } from "./Icon";
import Heatmap from "./Heatmap";
import TaskCard from "./TaskCard";
import { WeekCard, TonightCard } from "./Summary";
import { STUDENT } from "../data";
import {
  crunchDays, diffDays, keyOf, fromKey, fmtShort, fmtHours, weekday, buildICS, downloadFile, greeting,
} from "../utils";

const FILTERS = [
  ["todo", "To do"],
  ["overdue", "Overdue"],
  ["done", "Done"],
  ["all", "All"],
];

const EMPTY = {
  todo: "You're all caught up. Nothing left to do here.",
  overdue: "Nothing overdue. Nicely done.",
  done: "Nothing ticked off yet. Your first one will feel good.",
  all: "No work to show.",
};

function bucket(t, today) {
  const d = diffDays(t.due, today);
  if (d < 0) return t.status === "done" ? "Earlier (done)" : "Overdue";
  if (d <= 6) return "Next 7 days";
  if (d <= 13) return "The week after";
  return "Later";
}
const ORDER = ["Overdue", "Next 7 days", "The week after", "Later", "Earlier (done)"];

export default function Tracker({
  tasks, courses, today, capacity, setCapacity, setStatus, setEffort, courseFilter, setCourseFilter, notify,
}) {
  const [filter, setFilter] = useState("todo");
  const [dayKey, setDayKey] = useState(null);
  const [openId, setOpenId] = useState(null);

  const courseOf = (id) => courses.find((c) => c.id === id);
  const activeCourse = courseFilter ? courseOf(courseFilter) : null;

  const scoped = tasks.filter((t) => !courseFilter || t.course === courseFilter);
  const counts = {
    todo: scoped.filter((t) => t.status !== "done").length,
    overdue: scoped.filter((t) => t.status !== "done" && diffDays(t.due, today) < 0).length,
    done: scoped.filter((t) => t.status === "done").length,
    all: scoped.length,
  };

  const visible = scoped.filter((t) => {
    if (dayKey && keyOf(t.due) !== dayKey) return false;
    if (filter === "todo") return t.status !== "done";
    if (filter === "done") return t.status === "done";
    if (filter === "overdue") return t.status !== "done" && diffDays(t.due, today) < 0;
    return true;
  });

  const groups = ORDER.map((label) => ({
    label,
    items: visible.filter((t) => bucket(t, today) === label),
  })).filter((g) => g.items.length);

  const crunch = crunchDays(tasks, today).filter((c) => diffDays(c.date, today) <= 14).slice(0, 2);
  const crunchKeys = new Set(crunchDays(tasks, today).map((c) => c.key));

  const week = tasks.filter((t) => {
    const d = diffDays(t.due, today);
    return d >= 0 && d <= 6;
  });
  const weekDone = week.filter((t) => t.status === "done").length;

  const hour = new Date().getHours();
  const label = hour >= 17 ? "Tonight" : "Today";

  const exportCalendar = () => {
    const pending = tasks.filter((t) => t.status !== "done");
    downloadFile("my-classroom-deadlines.ics", buildICS(pending, courses), "text/calendar");
    notify(`Saved ${pending.length} deadlines. Open the file to add them to Google Calendar.`);
  };

  const pickDay = (k) => {
    setDayKey(k);
    if (k) setFilter("todo");
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>
            My Tracker <span className="new-chip">New</span>
          </h1>
          <p className="sub">Everything due across all your classes, in one place.</p>
        </div>
        <button className="btn" onClick={exportCalendar}>
          <Icon name="download" size={18} /> Add to calendar
        </button>
      </div>

      <div className="top-grid">
        <WeekCard name={STUDENT.name} greet={greeting()} done={weekDone} total={week.length} />
        <TonightCard tasks={tasks} today={today} capacity={capacity} setCapacity={setCapacity} label={label} />
      </div>

      {crunch.map((c) => (
        <div className="banner" key={c.key}>
          <span className="banner-icon"><Icon name="warning" size={22} /></span>
          <div className="banner-text">
            <strong>{weekday(c.date)} looks heavy.</strong>{" "}
            {c.items.length} things land on {fmtShort(c.date)} ({c.items.map((t) => t.title).join(", ")}). Together that's
            roughly {fmtHours(c.hours)} of work, so starting a day or two early will help.
          </div>
          <button className="btn btn-ghost" onClick={() => pickDay(c.key)}>Show them</button>
        </div>
      ))}

      <Heatmap tasks={tasks} today={today} dayKey={dayKey} onPick={pickDay} />

      <div className="list-head">
        <div className="filters" role="tablist" aria-label="Filter work">
          {FILTERS.map(([k, name]) => (
            <button key={k} role="tab" aria-selected={filter === k} className={filter === k ? "on" : ""} onClick={() => setFilter(k)}>
              {name} <span className="count">{counts[k]}</span>
            </button>
          ))}
        </div>
        <div className="active-filters">
          {activeCourse && (
            <button className="tag" onClick={() => setCourseFilter(null)}>
              <i style={{ background: activeCourse.color }} /> {activeCourse.name} <Icon name="close" size={14} />
            </button>
          )}
          {dayKey && (
            <button className="tag" onClick={() => setDayKey(null)}>
              {fmtShort(fromKey(dayKey))} <Icon name="close" size={14} />
            </button>
          )}
        </div>
      </div>

      {groups.length === 0 && (
        <div className="empty">
          <Icon name="check" size={36} />
          <p>{EMPTY[filter]}</p>
        </div>
      )}

      {groups.map((g) => (
        <section className="group" key={g.label}>
          <h3>
            {g.label} <span className="count">{g.items.length}</span>
          </h3>
          {g.items.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              course={courseOf(t.course)}
              today={today}
              capacity={capacity}
              open={openId === t.id}
              onToggle={() => setOpenId(openId === t.id ? null : t.id)}
              setStatus={setStatus}
              setEffort={setEffort}
              crunch={crunchKeys.has(keyOf(t.due))}
            />
          ))}
        </section>
      ))}
    </div>
  );
}
