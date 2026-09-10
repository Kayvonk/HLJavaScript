# Activity 27: Factory Functions and Singleton Pattern

## Overview
**Factory functions** create and return objects without using `new` or `class`. They use closures for private state, making each instance's internals genuinely inaccessible. The **singleton pattern** ensures only one instance of something exists globally — subsequent "creation" calls return the same object. Both patterns have trade-offs around testability, memory, and coupling that are worth understanding.

## Learning Objectives
- Write a factory function that returns objects with private state via closures (no `this`)
- Explain why factory functions avoid `this`-binding bugs
- Implement a singleton that returns the same instance on every call
- Create two independent factory instances and verify they don't share state

## Instructions

Study the `createUser` factory and the `createDatabase` singleton in `script.js`. Notice that factory instances don't share state, and the singleton always returns `===` the same object. Then complete the TODOs.

### TODO 1 — createTimer Factory
Write a `createTimer()` factory that returns an object with `start()`, `stop()`, and `elapsed()` methods. Use closure to store `startTime` and `running` state — no `this`. Create two independent timers and demonstrate they don't share state by starting and stopping them at different times.

> **Hint:**
> ```js
> function createTimer() {
>   let startTime = null;
>   let running   = false;
>
>   return {
>     start()   { if (!running) { startTime = Date.now(); running = true; } },
>     stop()    { running = false; },
>     elapsed() { return running ? Date.now() - startTime : 0; }
>   };
> }
> ```
> Two calls to `createTimer()` produce two completely independent objects — their `startTime` and `running` variables are in separate closure scopes.

### TODO 2 — createLogger Singleton
Implement a `createLogger` singleton. The first call creates a logger object with a `log(msg)` method that prepends a timestamp to each message. Subsequent calls return the exact same object. Verify by calling `createLogger()` twice and checking `===` equality.

> **Hint:** Use a module-level variable to cache the instance:
> ```js
> let _instance = null;
>
> function createLogger() {
>   if (_instance) return _instance;
>   _instance = {
>     log(msg) { console.log(`[${new Date().toISOString()}] ${msg}`); }
>   };
>   return _instance;
> }
> ```
> `createLogger() === createLogger()` must be `true`. The singleton ensures all code shares one logger.

## What You Learned
- Factory functions create objects via plain function calls — no `new`, no `this`, no prototype complexity
- Closure-based private state in factories is genuinely private — not just conventionally private like `_prop`
- Two factory calls produce two independent instances — closures don't share variables across calls
- Singleton pattern uses a cached module-level variable — the first call initializes, subsequent calls return the cache

## Stretch Challenges
1. Research the testability trade-off with singletons — why are singletons considered an anti-pattern in unit testing, and what technique (dependency injection) is used to work around them?
2. Write a `createPool(factory, size)` where a fixed number of instances are created once and recycled — a variation of the singleton concept for pooled resources
3. Add a `reset()` method to the singleton that clears the cached instance (useful for testing) — then explain why production code should never call `reset()`
