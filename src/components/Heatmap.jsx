import { addDays, keyOf, avg, fmtHours, fmtShort } from "../utils";

const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function level(h) {
  if (h === 0) return 0;
  if (h <= 2) return 1;
  if (h <= 4) return 2;
  if (h <= 6) return 3;
  return 4;
}

export default function Heatmap({ tasks, today, dayKey, onPick }) {
  const monday = addDays(today, -((today.getDay() + 6) % 7));
  const cells = Array.from({ length: 28 }, (_, i) => addDays(monday, i));

  const byKey = {};
  tasks
    .filter((t) => t.status !== "done")
    .forEach((t) => {
      const k = keyOf(t.due);
      const m = byKey[k] || (byKey[k] = { n: 0, lo: 0, hi: 0, h: 0 });
      m.n += 1;
      m.lo += t.hours[0];
      m.hi += t.hours[1];
      m.h += avg(t.hours);
    });

  return (
    <section className="card heat">
      <div className="card-head">
        <h2>The next four weeks</h2>
        <p>Darker days mean more hours of work landing at once. Tap a day to see what's due.</p>
      </div>

      <div className="heat-grid" role="grid">
        {DOW.map((d) => (
          <div key={d} className="heat-dow">{d}</div>
        ))}
        {cells.map((d) => {
          const k = keyOf(d);
          const m = byKey[k];
          const past = d < today;
          const isToday = k === keyOf(today);
          const lv = m ? level(m.h) : 0;
          const label = m
            ? `${fmtShort(d)}: ${m.n} ${m.n === 1 ? "deadline" : "deadlines"}, about ${fmtHours([m.lo, m.hi])}`
            : `${fmtShort(d)}: nothing due`;
          return (
            <button
              key={k}
              className={`heat-cell l${lv} ${past ? "past" : ""} ${isToday ? "today" : ""} ${dayKey === k ? "picked" : ""}`}
              onClick={() => onPick(dayKey === k ? null : k)}
              disabled={!m || past}
              title={label}
              aria-label={label}
            >
              <span className="hc-day">
                {d.getDate() === 1 || d === cells[0] ? d.toLocaleDateString("en-IN", { month: "short" }) + " " : ""}
                {d.getDate()}
              </span>
              {m && !past && (
                <span className="hc-info">
                  {m.n}× · {Math.round(m.h)}h
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="heat-legend" aria-hidden="true">
        <span>Lighter</span>
        <i className="l0" /><i className="l1" /><i className="l2" /><i className="l3" /><i className="l4" />
        <span>Heavier</span>
      </div>
    </section>
  );
}
