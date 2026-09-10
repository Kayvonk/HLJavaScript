# Activity 16: async/await Internals

## Overview
`async`/`await` is syntactic sugar over Promises — it lets you write asynchronous code that *looks* synchronous. Under the hood, an `async` function returns a Promise, and `await` suspends execution inside the function until the awaited Promise settles (without blocking the thread). Understanding the underlying Promise mechanics helps you avoid pitfalls like accidental sequential execution when parallel execution would be faster.

## Learning Objectives
- Explain that `async` functions always return a Promise and `await` pauses only the current async function
- Write proper `try/catch` and `finally` error handling for `async` functions
- Identify when operations can be parallelized with `await Promise.all([...])`
- Measure and compare sequential vs. parallel async execution time

## Instructions

The two working examples in `script.js` show the async/await equivalent of a Promise chain, then sequential vs. parallel timing. Study both carefully. Then complete the TODOs.

### TODO 1 — loadDashboard (sequential)
Write an `async` function `loadDashboard()` that sequentially fetches a user, then their profile, then their notifications using the provided simulation functions. Use `try/catch/finally` — the `catch` should log any error, and the `finally` should log `"loading complete"`. Call `loadDashboard()` at the bottom.

> **Hint:**
> ```js
> async function loadDashboard() {
>   try {
>     const user = await getUser();
>     const profile = await getProfile(user.id);
>     const notifications = await getNotifications(user.id);
>     console.log("dashboard ready:", { user, profile, notifications });
>   } catch (err) {
>     console.error("dashboard error:", err.message);
>   } finally {
>     console.log("loading complete");
>   }
> }
> ```
> Each `await` pauses the function until that Promise settles. The total time is roughly the sum of all three operation times.

### TODO 2 — loadDashboard (parallel)
Refactor `loadDashboard()` so that `getProfile` and `getNotifications` run **in parallel** using `await Promise.all([...])`. Profile and notifications don't depend on each other — only both depend on the user. Add `performance.now()` timing to both versions and log the improvement.

> **Hint:** After getting the user, run independent operations together:
> ```js
> const [profile, notifications] = await Promise.all([
>   getProfile(user.id),
>   getNotifications(user.id)
> ]);
> ```
> The total time is now `getUser time + max(getProfile, getNotifications)` instead of the sum of all three.

## What You Learned
- `async` functions always return a Promise — `await` pauses only the current async stack frame, not the event loop
- `try/catch` inside async functions catches both synchronous throws and rejected awaited Promises
- Awaiting operations sequentially when they are independent wastes time — use `Promise.all` for parallelism
- `await Promise.all([...])` with array destructuring is idiomatic for fetching multiple independent resources

## Stretch Challenges
1. Research what happens when you `await` a non-Promise value (e.g., `await 42`) — why does this work?
2. Write an `asyncMap(arr, asyncFn)` utility that maps an async function over an array in parallel (using `Promise.all`) vs. sequentially — compare the timing for an array of 5 items each taking 100ms
3. Research "async iteration" (`for await...of`) — write an example that lazily pulls values from an async generator
