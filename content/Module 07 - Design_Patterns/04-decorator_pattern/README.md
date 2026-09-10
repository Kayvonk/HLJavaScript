# Activity 28: The Decorator Pattern

## Overview
A **decorator** is a function that wraps another function to add behavior — logging, timing, memoization, retrying — without modifying the original. This is pure functional composition applied to behavior: the decorator receives the original function and returns a new one with enhanced capabilities. Decorators are used throughout production JavaScript for cross-cutting concerns like performance monitoring, error recovery, and rate limiting.

## Learning Objectives
- Write a function decorator that wraps another function with additional behavior
- Implement `withLogging` to log function arguments and return values
- Implement `throttle` to limit how often a function can be called
- Explain how decorators support the Open/Closed Principle (add behavior without modifying the original)

## Instructions

Study the `memoize` and `withRetry` decorators in `script.js`. Notice how each accepts a function and returns a new function — the original is never modified. Then complete the TODOs.

### TODO 1 — withLogging
Write a `withLogging(fn, name)` decorator that returns a new function. When the returned function is called, it logs `"calling [name] with [args]"` before delegating to `fn`, then logs `"[name] returned [result]"` after. Apply it to a simple `add(a, b)` function and call the decorated version twice.

> **Hint:**
> ```js
> function withLogging(fn, name) {
>   return function (...args) {
>     console.log(`calling ${name} with`, args);
>     const result = fn(...args);
>     console.log(`${name} returned`, result);
>     return result;
>   };
> }
> const loggedAdd = withLogging((a, b) => a + b, "add");
> loggedAdd(3, 4);  // logs before and after
> ```

### TODO 2 — throttle
Write a `throttle(fn, limitMs)` decorator that ensures `fn` is called at most once per `limitMs` milliseconds, regardless of how many times the returned function is invoked. Calls that arrive during the "cooldown" period are ignored. Test by calling the throttled function 5 times in quick succession with `setTimeout` calls spaced 50ms apart, using a `limitMs` of 200ms.

> **Hint:** Track the last time the function was actually called:
> ```js
> function throttle(fn, limitMs) {
>   let lastCalled = 0;
>   return function (...args) {
>     const now = Date.now();
>     if (now - lastCalled >= limitMs) {
>       lastCalled = now;
>       return fn(...args);
>     }
>     // else: silently skip this call
>   };
> }
> ```
> With 5 calls at 50ms intervals and a 200ms limit: call 1 fires immediately (t=0), calls 2-4 are skipped (t=50, 100, 150 are within the 200ms window), call 5 fires at t=200 when the window expires.

## What You Learned
- A decorator wraps a function with additional behavior without modifying the original
- Decorators use closures to maintain state between calls (memoize cache, throttle timestamp, retry count)
- Decorators are composable — you can apply multiple decorators: `throttle(withLogging(fn), 200)`
- The Open/Closed Principle: a decorator adds behavior to existing functions without modifying them

## Stretch Challenges
1. Write a `debounce(fn, delay)` decorator — unlike throttle (which fires immediately and blocks), debounce waits for `delay` ms of silence before firing. Use `clearTimeout`/`setTimeout` to implement it
2. Write a `withTimeout(fn, ms)` decorator that wraps a Promise-returning function — if the Promise doesn't settle within `ms` milliseconds, it rejects with a timeout error
3. Compose three decorators together: `throttle(memoize(withLogging(expensiveFn, "calc")), 1000)` — describe the order in which each decorator's logic executes on a call
