// All data here is made up. The real Classroom API needs school accounts,
// so this prototype runs on a fake class so anyone can try it.

export const STUDENT = {
  name: "Aarav",
  full: "Aarav Sharma",
};

export const courses = [
  { id: "math", name: "Mathematics", section: "Grade 11 · Section B", teacher: "Mr. Iyer", color: "#1a73e8" },
  { id: "phys", name: "Physics", section: "Grade 11 · Section B", teacher: "Ms. Rao", color: "#d93025" },
  { id: "chem", name: "Chemistry", section: "Grade 11 · Section B", teacher: "Dr. Mehta", color: "#e37400" },
  { id: "eng", name: "English Literature", section: "Grade 11 · Section B", teacher: "Ms. D'Souza", color: "#188038" },
  { id: "cs", name: "Computer Science", section: "Grade 11 · Section B", teacher: "Mr. Nair", color: "#129eaf" },
  { id: "hist", name: "History", section: "Grade 11 · Section B", teacher: "Mrs. Kapoor", color: "#9334e6" },
];

// dueInDays = how many days from "today" the work is due, so the demo never goes stale.
// Day 5 is deliberately stacked (a lab report, an essay and a quiz) to show the crunch warning.
// hours = [lowest guess, highest guess]
export const baseAssignments = [
  { id: "a1", course: "math", title: "Algebra worksheet 5", type: "Assignment", points: 20, dueInDays: 2, hours: [1, 2],
    description: "Solve problems 1 to 20 from the worksheet. Show every step of your working, especially for the factorising questions." },
  { id: "a2", course: "math", title: "Geometry problem set", type: "Assignment", points: 25, dueInDays: -1, hours: [1.5, 2.5],
    description: "Circle theorems, questions 1 to 15. Attach clear photos of your handwritten work." },
  { id: "a3", course: "phys", title: "Lab report: Simple pendulum", type: "Assignment", points: 50, dueInDays: 5, hours: [3, 5],
    description: "Write up your pendulum experiment: aim, method, results table, a graph of T² against length, and a short conclusion with sources of error." },
  { id: "a4", course: "eng", title: "Essay: Climate and society", type: "Assignment", points: 40, dueInDays: 5, hours: [3, 4],
    description: "A 900-word argumentative essay. Use at least two sources from the reading list and cite them properly." },
  { id: "a5", course: "chem", title: "Quiz 4: Organic basics", type: "Quiz", points: 30, dueInDays: 5, hours: [1.5, 2.5],
    description: "Closed-book quiz on naming hydrocarbons and functional groups. Revise chapters 11 and 12 first." },
  { id: "a6", course: "hist", title: "Timeline project", type: "Project", points: 60, dueInDays: 9, hours: [4, 6],
    description: "Build an illustrated timeline of the causes of the First World War with at least 12 events and a one-line explanation for each." },
  { id: "a7", course: "cs", title: "Python exercises 1 to 10", type: "Assignment", points: 30, dueInDays: 4, hours: [2, 3],
    description: "Loops and lists practice. Submit one .py file with a comment above each solution." },
  { id: "a8", course: "eng", title: "Book review: To Kill a Mockingbird", type: "Assignment", points: 30, dueInDays: 11, hours: [3, 4],
    description: "600 words. Cover theme, one character you found compelling, and whether you would recommend it." },
  { id: "a9", course: "phys", title: "Numericals: Chapter 6", type: "Assignment", points: 20, dueInDays: 8, hours: [1.5, 2.5],
    description: "Work, energy and power numericals, questions 6.1 to 6.14." },
  { id: "a10", course: "hist", title: "Reading notes: Chapter 4", type: "Assignment", points: 10, dueInDays: 3, hours: [1, 1.5],
    description: "Bullet-point notes on chapter 4. One page is plenty." },
  { id: "a11", course: "math", title: "Trigonometry practice set", type: "Assignment", points: 20, dueInDays: 7, hours: [2, 3],
    description: "Identities and heights-and-distances problems, sections B and C." },
  { id: "a12", course: "chem", title: "Titration lab write-up", type: "Assignment", points: 40, dueInDays: 10, hours: [2, 3],
    description: "Include your burette readings, the calculation of concentration, and a note on accuracy." },
  { id: "a13", course: "cs", title: "Mini project: Quiz game", type: "Project", points: 80, dueInDays: 14, hours: [6, 8],
    description: "Build a command-line quiz game with at least 10 questions, a score counter and a high-score file." },
  { id: "a14", course: "eng", title: "Poetry analysis paragraph", type: "Assignment", points: 10, dueInDays: 1, hours: [1, 1.5],
    description: "One strong paragraph analysing imagery in the poem we read on Friday." },
  { id: "a15", course: "math", title: "Chapter 7 mock test", type: "Quiz", points: 50, dueInDays: 12, hours: [2, 3],
    description: "Timed mock test. Attempt it in one sitting, then upload your answer sheet." },
  { id: "a16", course: "phys", title: "Video reflection: Waves", type: "Assignment", points: 10, dueInDays: 6, hours: [1, 1.5],
    description: "Watch the linked video and write half a page on what surprised you." },
  { id: "a17", course: "hist", title: "Source analysis worksheet", type: "Assignment", points: 20, dueInDays: 13, hours: [2, 3],
    description: "Read the two primary sources and answer the provenance questions." },
  { id: "a18", course: "chem", title: "Periodic table flashcards", type: "Assignment", points: 15, dueInDays: 15, hours: [1, 2],
    description: "Make flashcards for the first 30 elements: symbol, group, and one real-world use." },
  { id: "a19", course: "cs", title: "Flowchart worksheet", type: "Assignment", points: 10, dueInDays: 1, hours: [0.5, 1],
    description: "Draw flowcharts for the three scenarios on the sheet." },
  { id: "a20", course: "eng", title: "Vocabulary quiz", type: "Quiz", points: 15, dueInDays: 8, hours: [0.5, 1],
    description: "Unit 5 word list. Meanings and usage in a sentence." },
  { id: "a21", course: "math", title: "Word problems, Set C", type: "Assignment", points: 15, dueInDays: 16, hours: [1.5, 2],
    description: "Eight word problems on simultaneous equations." },
  { id: "a22", course: "phys", title: "Group project: Solar oven plan", type: "Project", points: 70, dueInDays: 18, hours: [4, 6],
    description: "Plan, sketch and cost a simple solar oven with your group. One shared slide deck is enough." },
  { id: "a23", course: "hist", title: "Map labelling", type: "Assignment", points: 10, dueInDays: 4, hours: [0.5, 1],
    description: "Label the countries and alliances on the 1914 map." },
  { id: "a24", course: "cs", title: "Debugging challenge", type: "Assignment", points: 25, dueInDays: 12, hours: [1.5, 2.5],
    description: "Five broken programs. Fix each one and note what the bug was." },
];

// What the demo student has already done when the page first loads.
export const INITIAL_STATUS = { a7: "inprogress", a10: "done", a19: "done" };

// A made-up class of 28 students, each taking most of the six subjects.
// Only the teacher view uses this, and only to compute percentages.
function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const students = (() => {
  const r = rng(2026);
  return Array.from({ length: 28 }, () => {
    const ids = courses.map((c) => c.id).filter(() => r() < 0.72);
    return ids.length >= 3 ? ids : courses.slice(0, 3 + Math.floor(r() * 3)).map((c) => c.id);
  });
})();
