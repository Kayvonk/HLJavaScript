# Activity 15: Promise Combinators

## Overview
Running multiple async operations independently is faster than running them sequentially. JavaScript provides four **Promise combinators** to coordinate multiple Promises: `Promise.all` (all must succeed), `Promise.allSettled` (collect all outcomes), `Promise.race` (first to settle wins), and `Promise.any` (first to fulfill wins, ignoring rejections). Choosing the right one depends on whether you need all results, can tolerate partial failure, or just want the fastest response.

## Learning Objectives
- Describe the behavior and failure semantics of all four Promise combinators
- Use `Promise.all()` for operations where all must succeed
- Use `Promise.allSettled()` to collect results regardless of individual failures
- Use `Promise.race()` for timeout patterns and `Promise.any()` for redundant sources

## Instructions

The working examples in `script.js` demonstrate `Promise.all()` and `Promise.allSettled()` with both success and failure scenarios. Study the logged output carefully. Then complete the TODOs.

### TODO 1 — Promise.race() for Timeout
Create three simulated fetch functions that resolve after different timeouts (50ms, 100ms, 200ms). Use `Promise.race()` to log whichever resolves first. Add a comment explaining a common real-world use case for `Promise.race()` — the **timeout pattern** (racing a fetch against a `Promise that rejects after N milliseconds`).

> **Hint:**
> ```js
> function delay(ms, value) {
>   return new Promise(resolve => setTimeout(() => resolve(value), ms));
> }
> Promise.race([delay(200, "slow"), delay(50, "fast"), delay(100, "medium")])
>   .then(winner => console.log("winner:", winner)); // "fast"
> ```
> The timeout pattern wraps `Promise.race([actualFetch, timeoutPromise])` where `timeoutPromise` rejects after N ms — whichever settles first wins.

### TODO 2 — Promise.any()
Use `Promise.any()` on a set of three Promises where two reject and one fulfills. Log the result and add a comment explaining how `Promise.any()` differs from `Promise.race()` when rejections are involved.

> **Hint:** `Promise.any()` ignores rejections — it only cares about the first *fulfillment*. If all Promises reject, it throws an `AggregateError`. `Promise.race()`, by contrast, settles as soon as *any* Promise settles (fulfilled or rejected) — so a fast rejection beats a slow fulfillment. This makes `Promise.any()` ideal when you have multiple redundant sources and just need any one to succeed.

## What You Learned
- `Promise.all([...])` — waits for all to fulfill; short-circuits on the first rejection
- `Promise.allSettled([...])` — waits for all to settle; never rejects; returns `{status, value/reason}` for each
- `Promise.race([...])` — settles with the first to settle (fulfilled or rejected)
- `Promise.any([...])` — fulfills with the first fulfillment; rejects with `AggregateError` only if all reject

## Stretch Challenges
1. Implement a `timeout(promise, ms)` utility using `Promise.race()` — it races the input promise against a rejecting promise that fires after `ms` milliseconds
2. Use `Promise.allSettled()` to implement a "batch fetch with partial failure" pattern — process all results and separate successes from failures
3. Research `AggregateError` — what information does it carry and how do you extract individual rejection reasons from it?
