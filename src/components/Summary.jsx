import { Icon } from "./Icon";
import { fmtHours, fmtShort, diffDays, tonightPlan } from "../utils";

export function Ring({ done, total }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const f = total ? done / total : 0;
  return (
    <svg className="ring" viewBox="0 0 80 80" role="img" aria-label={`${done} of ${total} done this week`}>
      <circle cx="40" cy="40" r={r} className="ring-bg" />
      <circle
        cx="40" cy="40" r={r} className="ring-fg"
        strokeDasharray={c} strokeDashoffset={c * (1 - f)} transform="rotate(-90 40 40)"
      />
      <text x="40" y="45" textAnchor="middle">{done}/{total}</text>
    </svg>
  );
}

export function WeekCard({ name, greet, done, total }) {
  let line;
  if (total === 0) line = "Nothing is due in the next 7 days. Enjoy the breathing room.";
  else if (done === total) line = "Everything due this week is done. Properly well done. Take a real break.";
  else if (done === 0) line = `${total} ${total === 1 ? "thing is" : "things are"} due this week. One small start today makes the rest feel lighter.`;
  else line = `${total - done} more to go this week. You're already ${Math.round((done / total) * 100)}% of the way there.`;

  return (
    <section className="card week">
      <Ring done={done} total={total} />
      <div>
        <h2>{greet}, {name}</h2>
        <p>{line}</p>
      </div>
    </section>
  );
}

export function TonightCard({ tasks, today, capacity, setCapacity, label }) {
  const plan = tonightPlan(tasks, capacity, today);
  const next = tasks.filter((t) => t.status !== "done").sort((a, b) => a.due - b.due)[0];

  return (
    <section className="card tonight">
      <div className="tonight-head">
        <h2>{label}'s plan</h2>
        <div className="pace" title="How many hours you can realistically give to school work in a day">
          <span>My pace</span>
          <button onClick={() => setCapacity(Math.max(1, capacity - 0.5))} aria-label="Less time per day">−</button>
          <strong>{capacity}h/day</strong>
          <button onClick={() => setCapacity(Math.min(8, capacity + 0.5))} aria-label="More time per day">+</button>
        </div>
      </div>

      {plan.items.length === 0 ? (
        <p className="muted">
          Nothing urgent right now.
          {next ? ` A good moment to get a head start on "${next.title}", due ${fmtShort(next.due)}.` : " You're all caught up."}
        </p>
      ) : (
        <>
          <ul className="plan-list">
            {plan.items.map(({ task, hours, overdue }) => (
              <li key={task.id}>
                <span className="plan-dot" style={{ background: task.color }} />
                <span className="plan-name">
                  {task.title}
                  {overdue && <em> · catch up</em>}
                  {!overdue && diffDays(task.due, today) === 0 && <em> · due today</em>}
                </span>
                <span className="plan-h">{fmtHours([hours, hours])}</span>
              </li>
            ))}
          </ul>
          <p className="muted small">
            <Icon name="clock" size={14} /> That's {fmtHours([plan.total, plan.total])}.{" "}
            {plan.left > 0 ? `You'd still have about ${fmtHours([plan.left, plan.left])} free.` : "A full but realistic session."}
          </p>
        </>
      )}
    </section>
  );
}
