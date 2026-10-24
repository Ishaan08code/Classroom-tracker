import { useMemo, useState, useEffect, useCallback } from "react";
import { courses, baseAssignments, students, INITIAL_STATUS } from "./data";
import { useLocalState } from "./hooks";
import { startOfDay, addDays, fromKey, fmtShort } from "./utils";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Tracker from "./components/Tracker";
import TeacherView from "./components/TeacherView";

export default function App() {
  const today = useMemo(() => startOfDay(), []);

  const [statusMap, setStatusMap] = useLocalState("ct.status", INITIAL_STATUS);
  const [effortMap, setEffortMap] = useLocalState("ct.effort", {});
  const [capacity, setCapacity] = useLocalState("ct.capacity", 3);
  const [custom, setCustom] = useLocalState("ct.custom", []);

  const [role, setRole] = useState("student");
  const [courseFilter, setCourseFilter] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = useCallback((msg) => setToast({ msg, id: Date.now() }), []);
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3600);
    return () => clearTimeout(t);
  }, [toast]);

  const tasks = useMemo(
    () =>
      [...baseAssignments, ...custom]
        .map((a) => {
          const c = courses.find((x) => x.id === a.course);
          return {
            ...a,
            color: c.color,
            due: a.dueKey ? fromKey(a.dueKey) : addDays(today, a.dueInDays),
            hours: effortMap[a.id] || a.hours,
            edited: Boolean(effortMap[a.id]),
            status: statusMap[a.id] || "todo",
          };
        })
        .sort((a, b) => a.due - b.due || String(a.id).localeCompare(String(b.id))),
    [custom, effortMap, statusMap, today]
  );

  const setStatus = (id, status) => {
    setStatusMap((m) => {
      const next = { ...m };
      if (status === "todo") delete next[id];
      else next[id] = status;
      return next;
    });
    if (status === "done") notify("Nice, one less thing to think about.");
  };

  const setEffort = (id, hours) =>
    setEffortMap((m) => {
      const next = { ...m };
      if (!hours) delete next[id];
      else next[id] = hours;
      return next;
    });

  const pendingByCourse = {};
  tasks.forEach((t) => {
    if (t.status !== "done") pendingByCourse[t.course] = (pendingByCourse[t.course] || 0) + 1;
  });

  const postAssignment = (a, date) => {
    setCustom((c) => [...c, a]);
    notify(`Assigned "${a.title}" for ${fmtShort(date)}. Switch to Student view to see it land.`);
  };

  const reset = () => {
    setStatusMap(INITIAL_STATUS);
    setEffortMap({});
    setCapacity(3);
    setCustom([]);
    setCourseFilter(null);
    notify("Demo data reset.");
  };

  const pickCourse = (id) => {
    if (role === "teacher") {
      notify("Switch to Student view to filter your tracker by class.");
    } else {
      setCourseFilter((cur) => (cur === id ? null : id));
    }
    setMenuOpen(false);
  };

  return (
    <>
      <Topbar role={role} setRole={setRole} onMenu={() => setMenuOpen((o) => !o)} notify={notify} />
      <div className="shell">
        <Sidebar
          open={menuOpen}
          role={role}
          courses={courses}
          counts={pendingByCourse}
          courseFilter={courseFilter}
          onPickCourse={pickCourse}
          onHome={() => {
            setRole("student");
            setCourseFilter(null);
            setMenuOpen(false);
          }}
          onReset={reset}
          notify={notify}
          onClose={() => setMenuOpen(false)}
        />
        <main className="content">
          {role === "student" ? (
            <Tracker
              tasks={tasks}
              courses={courses}
              today={today}
              capacity={capacity}
              setCapacity={setCapacity}
              setStatus={setStatus}
              setEffort={setEffort}
              courseFilter={courseFilter}
              setCourseFilter={setCourseFilter}
              notify={notify}
            />
          ) : (
            <TeacherView
              tasks={tasks}
              today={today}
              courses={courses}
              students={students}
              custom={custom}
              onPost={postAssignment}
              onRemove={(id) => setCustom((c) => c.filter((x) => x.id !== id))}
            />
          )}
        </main>
      </div>
      {toast && (
        <div className="toast" role="status" key={toast.id}>
          {toast.msg}
        </div>
      )}
    </>
  );
}
