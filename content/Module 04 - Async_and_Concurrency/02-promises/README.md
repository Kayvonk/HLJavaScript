# Activity 14: Promises In Depth

## Overview
A **Promise** is an object representing the eventual completion or failure of an asynchronous operation. It has three states: **pending** (initial), **fulfilled** (resolved with a value), and **rejected** (failed with a reason). Promises solve callback hell by enabling linear `.then()` chains — each handler returns a value or a new Promise, keeping the chain flat regardless of nesting depth.

## Learning Objectives
- Describe the three Promise states and their transitions
- Chain `.then()` handlers, passing transformed values down the chain
- Propagate and catch errors using `.catch()` and understand where in the chain errors are caught
- Use `.finally()` for cleanup logic that runs regardless of outcome

## Instructions

Study the two working examples in `script.js`. The first shows a complete `.then`/`.catch`/`.finally` chain. The second demonstrates chain flattening — returning a Promise from inside `.then()`. Then complete the TODOs.

### TODO 1 — validateAge Promise
Write a function `validateAge(age)` that returns a Promise. The Promise should resolve with the string `"valid"` if `age >= 18`, and reject with `"too young"` otherwise. Chain `.then()` and `.catch()` handlers that log appropriate messages for each outcome. Test with both a valid and an invalid age.

> **Hint:**
> ```js
> function validateAge(age) {
>   return new Promise((resolve, reject) => {
>     if (age >= 18) {
>       resolve("valid");
>     } else {
>       reject("too young");
>     }
>   });
> }
> ```
> Call `validateAge(20).then(msg => ...).catch(err => ...)` and also `validateAge(15).then(...).catch(...)`.

### TODO 2 — Three-Step Transformation Chain
Write a `.then()` chain of at least three steps. Each step should transform the value from the previous step. For example: start with a string `"  42  "`, trim whitespace in step 1, parse to a number in step 2, and double it in step 3. Log the value at each step to verify the transformation.

> **Hint:** You can start a chain from an already-resolved Promise:
> ```js
> Promise.resolve("  42  ")
>   .then(str => { console.log("step 1:", str); return str.trim(); })
>   .then(trimmed => { console.log("step 2:", trimmed); return parseInt(trimmed, 10); })
>   .then(num => { /* transform again */ });
> ```
> Each `.then()` handler receives the return value of the previous handler. Returning a plain value wraps it in `Promise.resolve(value)` automatically.

## What You Learned
- A Promise transitions from `pending` to either `fulfilled` or `rejected` exactly once — the state never goes back
- `.then(fn)` registers a handler for fulfillment — the handler's return value becomes the next link in the chain
- `.catch(fn)` handles any rejection in the chain up to that point — it is equivalent to `.then(null, fn)`
- `.finally(fn)` runs whether the Promise fulfilled or rejected — useful for cleanup like hiding loading spinners

## Stretch Challenges
1. Write a Promise chain that intentionally throws an error inside a `.then()` handler — trace where `.catch()` must be placed to handle it
2. Research Promise microtask scheduling: why does `.then()` always fire *after* the current synchronous code, even if the Promise is already fulfilled?
3. Write a `promisify(fn)` utility that wraps a Node.js-style error-first callback function and returns a Promise-returning version
