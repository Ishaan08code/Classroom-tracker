import { Icon } from "./Icon";

export default function Sidebar({ open, role, courses, counts, courseFilter, onPickCourse, onHome, onReset, notify, onClose }) {
  const soon = (what) => () => notify(`${what} isn't part of this prototype. Only My Tracker is new.`);
  const trackerActive = role === "teacher" ? false : !courseFilter;

  return (
    <>
      {open && <div className="scrim" onClick={onClose} />}
      <aside className={`sidebar ${open ? "open" : ""}`} aria-label="Navigation">
        <nav>
          <button className="nav-item" onClick={soon("Home")}>
            <Icon name="home" /> Home
          </button>
          <button className="nav-item" onClick={soon("Calendar")}>
            <Icon name="calendar" /> Calendar
          </button>
          <hr />
          <button className={`nav-item ${trackerActive ? "active" : ""}`} onClick={onHome}>
            <Icon name="tracker" /> My Tracker <span className="new-chip tiny">New</span>
          </button>
          <hr />
          <div className="nav-head">{role === "teacher" ? "Teaching" : "Enrolled"}</div>
          {courses.map((c) => (
            <button
              key={c.id}
              className={`nav-item ${role === "student" && courseFilter === c.id ? "active" : ""}`}
              onClick={() => onPickCourse(c.id)}
              title={`${c.name} · ${c.teacher}`}
            >
              <span className="dot" style={{ background: c.color }}>{c.name[0]}</span>
              <span className="nav-text">
                <span>{c.name}</span>
                <small>{c.teacher}</small>
              </span>
              {role === "student" && counts[c.id] > 0 && <span className="count">{counts[c.id]}</span>}
            </button>
          ))}
        </nav>
        <div className="side-foot">
          <button className="link" onClick={onReset}>
            <Icon name="refresh" size={16} /> Reset demo data
          </button>
          <p>Prototype with made-up data. Not affiliated with Google.</p>
        </div>
      </aside>
    </>
  );
}
