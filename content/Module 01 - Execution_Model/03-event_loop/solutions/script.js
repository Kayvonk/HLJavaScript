// ─── The Event Loop: Microtasks vs. Macrotasks ───────────────────────────────

// EXAMPLE 1: Classic ordering — sync → microtask → macrotask
console.log("--- Example 1: Classic ordering ---");

console.log("1 sync");                                 // runs immediately

setTimeout(() => console.log("3 macrotask"), 0);       // macrotask queue

Promise.resolve().then(() => console.log("2 microtask")); // microtask queue

// Expected output order:
// 1 sync
// 2 microtask
// 3 macrotask
//
// Why: synchronous code runs first, then ALL microtasks drain before
// the event loop picks up the next macrotask.


// ─── EXAMPLE 2: More complex ordering puzzle ─────────────────────────────────
console.log("\n--- Example 2: Interleaved queues ---");

setTimeout(() => console.log("A — macrotask 1"), 0);

Promise.resolve()
  .then(() => console.log("B — microtask 1"))
  .then(() => console.log("C — microtask 2"));

setTimeout(() => console.log("D — macrotask 2"), 0);

Promise.resolve().then(() => console.log("E — microtask 3"));

console.log("F — sync");

// Expected output order:
// F — sync         (synchronous, runs first)
// B — microtask 1  (microtask queue drains before any macrotask)
// E — microtask 3  (still microtask queue)
// C — microtask 2  (chained .then — queued when B resolved)
// A — macrotask 1  (first macrotask fires after all microtasks)
// D — macrotask 2  (second macrotask)


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Write Your Own Ordering Puzzle
// Write a snippet with:
//   - at least one setTimeout(..., 0)
//   - at least one Promise.resolve().then(...)
//   - at least two synchronous console.log calls
// BEFORE running it, write the expected output order as a comment.
// Then run `node script.js` to verify your prediction.

// Your prediction (write this first!):
// Expected output:
// 1. sync start
// 2. sync end
// 3. microtask fired
// 4. timeout fired

// Write your code here:
console.log("\n--- TODO 1: Ordering Puzzle ---");

// Sync code runs immediately — nothing async can preempt it.
console.log("sync start");

// setTimeout(fn, 0) enqueues fn onto the macrotask queue.
setTimeout(() => console.log("timeout fired"), 0);

// Promise .then callbacks go onto the microtask queue, which is fully drained
// after each macrotask (including the initial script run) but BEFORE the next.
Promise.resolve().then(() => console.log("microtask fired"));

console.log("sync end");



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: queueMicrotask
// Use queueMicrotask() alongside a setTimeout(..., 0) and one synchronous log.
// Predict the output order in a comment, then run it.
// Add a comment explaining why queueMicrotask fires before setTimeout.

// Your prediction:
// Expected output:
// 1. sync log
// 2. from queueMicrotask
// 3. from setTimeout

// Write your code here:
console.log("\n--- TODO 2: queueMicrotask ---");

// queueMicrotask() places its callback directly onto the microtask queue —
// the same queue that Promise .then callbacks use.
setTimeout(() => console.log("from setTimeout"), 0);
queueMicrotask(() => console.log("from queueMicrotask"));
console.log("sync log");

// WHY queueMicrotask fires before setTimeout:
// After the current synchronous script finishes, the event loop ALWAYS drains
// the entire microtask queue before picking up the next macrotask.
// setTimeout callbacks live on the macrotask queue, so any microtask that is
// already queued will run first — even if the setTimeout was scheduled earlier
// in the source code.
