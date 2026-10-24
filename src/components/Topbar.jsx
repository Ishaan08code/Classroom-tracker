import { Icon } from "./Icon";
import { STUDENT } from "../data";

export default function Topbar({ role, setRole, onMenu, notify }) {
  return (
    <header className="topbar">
      <button className="icon-btn" onClick={onMenu} aria-label="Main menu">
        <Icon name="menu" />
      </button>
      <div className="brand">
        <span className="brand-mark">C</span>
        <span className="brand-name">Classroom</span>
        <span className="brand-tag">My Tracker · concept</span>
      </div>
      <div className="spacer" />
      <div className="role-switch" role="tablist" aria-label="Demo view">
        <button role="tab" aria-selected={role === "student"} className={role === "student" ? "on" : ""} onClick={() => setRole("student")}>
          Student view
        </button>
        <button role="tab" aria-selected={role === "teacher"} className={role === "teacher" ? "on" : ""} onClick={() => setRole("teacher")}>
          Teacher view
        </button>
      </div>
      <button className="icon-btn hide-sm" onClick={() => notify("Creating and joining classes isn't part of this prototype.")} aria-label="Create or join a class">
        <Icon name="add" />
      </button>
      <div className="avatar" title={role === "student" ? STUDENT.full : "Ms. Rao"}>
        {role === "student" ? "A" : "R"}
      </div>
    </header>
  );
}
