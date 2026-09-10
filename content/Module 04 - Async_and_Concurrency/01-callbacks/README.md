# Activity 13: Callbacks and the Callback Pattern

## Overview
Before Promises, JavaScript async code relied entirely on **callbacks** — functions passed as arguments to be called when an operation completes. The **error-first callback convention** (popularized by Node.js) standardizes the signature: the first argument is always an error (or `null` on success), and the second is the result. While callbacks work, deeply nested ones create the infamous "pyramid of doom" that makes code hard to read and maintain.

## Learning Objectives
- Explain the error-first callback convention and why it was standardized
- Write and chain asynchronous operations using callbacks
- Identify the structural problem with deeply nested callback chains ("callback hell")
- Write a wrapper function that handles errors from a callback-based operation

## Instructions

The working examples in `script.js` show the error-first convention and a two-level callback chain. Study the "pyramid of doom" comment to understand what the problem looks like at scale. Then complete the TODOs.

### TODO 1 — Delay Chain
Write a `delay(ms, callback)` function that calls `callback()` after `ms` milliseconds. Use it to chain three sequential operations: the second starts only after the first completes, and the third starts only after the second. Log a message at each step.

> **Hint:** Each step's callback starts the next operation:
> ```js
> delay(500, () => {
>   console.log("step 1 done");
>   delay(500, () => {
>     console.log("step 2 done");
>     delay(500, () => { console.log("step 3 done"); });
>   });
> });
> ```
> Notice the indentation — this nesting is what "callback hell" looks like even at just 3 levels. Each additional level of dependency adds another level of indentation.

### TODO 2 — withErrorHandling Wrapper
Write a `withErrorHandling(fn, onError)` function that calls `fn()`. If `fn` throws synchronously, it calls `onError(err)` instead of letting the error propagate. Then write a function `riskyOperation()` that uses `Math.random()` to either return a success message or throw an error. Pass it to `withErrorHandling` and demonstrate both outcomes.

> **Hint:** Use a try/catch inside `withErrorHandling`:
> ```js
> function withErrorHandling(fn, onError) {
>   try {
>     const result = fn();
>     console.log("Success:", result);
>   } catch (err) {
>     onError(err);
>   }
> }
> ```
> For `riskyOperation`, use `if (Math.random() < 0.5) throw new Error("random failure")`. Run the script a few times to see both outcomes.

## What You Learned
- Callbacks are the foundation of async JavaScript — they allow "call me when done" patterns
- The error-first convention (`(err, result)`) standardizes error handling across async APIs
- Deeply nested callbacks are hard to read, debug, and refactor — this is why Promises were introduced
- A wrapper function can centralize error handling, keeping individual callbacks focused on the success path

## Stretch Challenges
1. Implement a `sequence(operations)` function that takes an array of callback-based async functions and runs them one after another — solving callback hell by flattening the nesting
2. Research why the Node.js standard library chose error-first callbacks over other conventions (e.g., separate success/error callbacks)
3. Convert the three-step `delay` chain into a version that uses an array of delays `[300, 500, 200]` and runs them sequentially using recursion
