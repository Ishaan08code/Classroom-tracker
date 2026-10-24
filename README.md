# Classroom "My Tracker" (concept prototype)

A feature concept for **Google Classroom**, built for the *Hack to the Future* hackathon.

> Not affiliated with Google. This is a prototype with **made-up data**. The real Classroom API needs school accounts, so everything you see here is fake.

## The problem

Students in 5 to 8 classes find their deadlines scattered across separate class streams. Classroom's To-do page lists work, but it doesn't help you see that three things land on the same Thursday, or when you should actually start. Teachers post due dates one class at a time, so nobody sees the whole load.

## What this adds

**For students (Student view)**

- **My Tracker**: every assignment from every class in one list, with a "days left" badge (red, amber, green).
- **Status you control**: Not started, In progress, Done. Saved in your browser.
- **Crunch-day warning**: "Thursday looks heavy", when three or more things land on one day.
- **Start-by dates**: based on how long a task takes and how many hours a day you can give.
- **Effort estimates as ranges** ("about 3–5h") that you can correct.
- **Four-week heatmap** showing how much work lands on each day. Tap a day to filter.
- **Tonight's plan**: a realistic slice of work that fits your daily pace.
- **Weekly progress ring** and **Add to calendar** (.ics export that works with Google Calendar).

**For teachers (Teacher view, the twist)**

When a teacher picks a due date, a small heads-up appears: *"62% of your students already have 2 or more deadlines on that day. Fri 30 Oct is calmer."* One click moves the date. Assigned work shows up in the student's tracker straight away.

Teachers only ever see aggregated percentages, never an individual student's workload.

## Run it

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev      # opens at http://localhost:5173
npm test         # checks the date and collision logic
npm run build    # production build in dist/
```

## Try this in the demo

1. Open **Student view**. Note the amber "looks heavy" banner and the dark heatmap square.
2. Tap **Show them**, then open a card and change the time estimate. The start-by date follows.
3. Tick a task. The ring and counts update, and the choice survives a refresh.
4. Switch to **Teacher view**, choose Physics and give the assignment a title. See the nudge, click **Use Friday**, and assign it.
5. Switch back to **Student view**. The new work is there.

Use **Reset demo data** (bottom of the sidebar) to start again.

## How it works

| Piece | Tool |
|---|---|
| UI | React 18 + Vite |
| Styling | Plain CSS, Classroom-inspired |
| Data | Fake courses and assignments in `src/data.js` |
| Saving your progress | Browser `localStorage` (no backend) |
| Crunch days, start-by dates, plan, heatmap | Plain JavaScript in `src/utils.js` |
| Teacher percentages | A seeded fake class of 28 students |
| Calendar export | Generated `.ics` file |

**About the effort estimates:** in this prototype they are written into the data by hand, as ranges. In a real rollout a language model would read each assignment's text and suggest the range, and the student could still adjust it, which is what the edit box here shows.

## How Google could roll it out

Classroom already holds every course, due date and enrolment, so the tracker needs no new data. The teacher heads-up would use aggregated counts only (never individual workloads), computed server-side, and could be switched on per school by an admin.

## Project layout

```
src/
  data.js          fake courses, assignments, class roster
  utils.js         date and deadline logic
  hooks.js         localStorage hook
  App.jsx          state and layout
  components/      Topbar, Sidebar, Tracker, TaskCard, Heatmap, Summary, TeacherView
tests/logic.test.mjs
```

## Team

Add your names and emails here to match your registration.
