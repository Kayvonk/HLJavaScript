# Activity 03: The Event Loop — Microtasks vs. Macrotasks

## Overview
JavaScript is single-threaded, yet it handles asynchronous operations without blocking. The event loop orchestrates this by draining two queues in a specific order: **microtasks** (Promise `.then` callbacks, `queueMicrotask`) always fully drain before the next **macrotask** (`setTimeout`, `setInterval`) begins. Understanding this ordering is essential for predicting async behavior and debugging subtle timing bugs.

## Learning Objectives
- Describe the role of the event loop in a single-threaded runtime
- Distinguish between the microtask queue and the macrotask queue
- Predict the output order of code mixing synchronous statements, Promises, and `setTimeout`
- Explain why microtasks always execute before the next `setTimeout` callback

## Instructions

Study the ordering examples in `script.js` carefully — each one has expected output annotated in comments. Then write your own ordering puzzles in the TODOs.

### TODO 1 — Write Your Own Ordering Puzzle
Write a snippet that includes at least one `setTimeout(..., 0)`, one `Promise.resolve().then(...)`, and two synchronous `console.log` calls. **Before running it**, write the expected output order as a comment. Then run it with `node script.js` and verify.

> **Hint:** Work through it mentally in three passes: (1) What runs synchronously right now? (2) What is in the microtask queue after sync code finishes? (3) What is in the macrotask queue after microtasks drain? Sync → microtasks → macrotasks is the order every time.

### TODO 2 — queueMicrotask
Use `queueMicrotask(() => console.log("microtask"))` alongside a `setTimeout(..., 0)` and one synchronous log. Predict the output order in a comment, then run it. Add a comment explaining *why* `queueMicrotask` fires before `setTimeout` even when both are already registered.

> **Hint:** `queueMicrotask` places its callback directly into the microtask queue — the same queue that Promise `.then` callbacks use. The macrotask queue (where `setTimeout` callbacks wait) is only checked after the microtask queue is completely empty.

## What You Learned
- The event loop processes one macrotask at a time, but drains all microtasks between each macrotask
- `Promise.resolve().then(fn)` and `queueMicrotask(fn)` both enqueue to the microtask queue
- `setTimeout(fn, 0)` enqueues to the macrotask queue — it never runs before pending microtasks
- Synchronous code always runs to completion before any queued callbacks fire

## Stretch Challenges
1. Nest a `Promise.resolve().then()` inside another `.then()` — how many microtask queue cycles does it take to run them both? Trace through it step by step
2. Research `setImmediate` (Node.js only) and where it fits in the queue order relative to `setTimeout(fn, 0)` and Promises
3. Write code that creates a "microtask starvation" scenario — a loop that keeps adding microtasks so that `setTimeout` callbacks never get a chance to run
