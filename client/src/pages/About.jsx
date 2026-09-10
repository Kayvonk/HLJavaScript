export default function About() {
  return (
    <div className="page">
      <h1>About</h1>
      <p>
        <strong>High-Level JS</strong> is a curriculum on how JavaScript actually works — execution model,
        closures, async, patterns, and beyond. Each lesson pairs a written explanation with runnable code and a
        solution.
      </p>
      <h2>How to use this site</h2>
      <ul>
        <li>Pick a module from the home page, then open a lesson.</li>
        <li>Read the <strong>README</strong> for context; the <strong>Code</strong> tab has the runnable exercise.</li>
        <li>Try the TODOs yourself before revealing the <strong>Solution</strong>.</li>
        <li>Use the 🔊 buttons to have the material read aloud — pair listening with reading for retention.</li>
        <li>Mark lessons complete as you go; progress is saved in your browser.</li>
      </ul>
      <h2>Reading assistance</h2>
      <p>
        The reader uses your browser's built-in speech synthesis. On the <strong>Code</strong> tab you can toggle
        between the full source and a "comments only" view — the reader will speak whichever is visible.
      </p>
      <h2>Progress and privacy</h2>
      <p>
        Completion, preferences, and reveal state are stored in <code>localStorage</code> under one key. There's no
        account and no server storage — clearing your browser data resets your progress.
      </p>
    </div>
  );
}
