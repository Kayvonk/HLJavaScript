# Activity 23: Memory Leaks

## Overview
Even with garbage collection, JavaScript programs can leak memory through four classic patterns: **forgotten timers** (setInterval accumulating data indefinitely), **detached references** (objects removed from active use but still referenced in a cache or closure), **closures capturing large data** unnecessarily, and **global variable accumulation**. Recognizing these patterns — and knowing how to fix them — is a critical production JavaScript skill.

## Learning Objectives
- Identify the four classic JavaScript memory leak patterns
- Write a `startDataPoller` / `stopDataPoller` pair that correctly cleans up a setInterval
- Demonstrate how closures can unintentionally hold large objects in memory
- Write the "fixed" version of each leak pattern

## Instructions

The two examples in `script.js` show a leaking interval and a detached reference pattern. Study the "before" (leaking) and "after" (fixed) side-by-side comments. Then complete the TODOs.

### TODO 1 — Data Poller (start and stop)
Write a `startDataPoller(interval)` function that starts a `setInterval` accumulating entries into an array. Write a corresponding `stopDataPoller()` that clears the interval and empties the array. Call `startDataPoller`, let it run briefly, then call `stopDataPoller`. Add a comment explaining what would happen to memory if `stopDataPoller` were never called.

> **Hint:** Store the interval ID and the array in an outer scope so `stopDataPoller` can access them:
> ```js
> let pollerId = null;
> let pollerData = [];
>
> function startDataPoller(interval) {
>   pollerId = setInterval(() => {
>     pollerData.push({ timestamp: Date.now(), value: Math.random() });
>   }, interval);
> }
>
> function stopDataPoller() {
>   clearInterval(pollerId);
>   pollerId = null;
>   pollerData = [];
> }
> ```
> Without `stopDataPoller`, the interval fires forever, `pollerData` grows indefinitely, and the closure keeps everything alive.

### TODO 2 — Listener Accumulation
Create a `store` object that accumulates event listener registrations in an array. Register 3 listeners (each a function that closes over some data). Then demonstrate removing them by clearing the array. Add a comment explaining what the closures capture and why removing them from the array is necessary to release the captured data.

> **Hint:** The key insight: each listener function is a closure that may capture local variables from the scope where it was defined. As long as the listener is in the array, those captured variables stay in memory. Removing the listeners (clearing the array or splicing out specific functions) removes the closures, which in turn releases their captured variables.

## What You Learned
- `setInterval` callbacks and their closures stay in memory until `clearInterval` is called
- Objects that are "logically removed" from an application still live in memory if any reference to them remains
- Closures capture the *binding* of closed-over variables — large objects captured by closures are not eligible for GC
- The fix for most leaks is the same: explicitly remove references when they are no longer needed

## Stretch Challenges
1. Research how browser DevTools' Memory panel works — what does a "heap snapshot" show and how would you identify a growing detached DOM tree?
2. Write a `createPool(factory, size)` function that creates a fixed-size pool of reusable objects — pooling avoids the GC overhead of creating and destroying many short-lived objects
3. Simulate a "stale closure" bug: a React-style component where a `setInterval` callback captures an old value of a variable and never sees updates — explain why this happens and how `useRef` solves it
