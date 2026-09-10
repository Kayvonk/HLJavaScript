# Activity 25: The Module Pattern

## Overview
Before ES modules, JavaScript had no built-in module system. The **module pattern** solved this using an **IIFE** (Immediately Invoked Function Expression) to create a private scope and return only a public API. The **revealing module** variant defines everything inside the IIFE and selectively exposes names in the return object. Both patterns use closures for encapsulation — the same principle that `export`/`import` formalizes in ES modules.

## Learning Objectives
- Explain why IIFEs create a private scope and how the returned object exposes a public API
- Implement the IIFE module pattern with private state and public methods
- Implement the revealing module variant
- Explain how ES module `export`/`import` is the modern equivalent of the module pattern

## Instructions

Study both examples in `script.js` — a shopping cart IIFE module and its revealing module variant. Note how private state (`items`) is never directly accessible. Then complete the TODOs.

### TODO 1 — EventBus IIFE Module
Create an IIFE-based `EventBus` module with a private `listeners` Map (or plain object) and a public API: `on(event, fn)` to subscribe, `off(event, fn)` to unsubscribe, and `emit(event, data)` to notify all subscribers. Test by subscribing two listeners to the same event and emitting it once.

> **Hint:** Structure:
> ```js
> const EventBus = (() => {
>   const listeners = new Map();
>   function on(event, fn) { /* add fn to listeners[event] array */ }
>   function off(event, fn) { /* remove fn from listeners[event] */ }
>   function emit(event, data) { /* call all fns in listeners[event] */ }
>   return { on, off, emit };
> })();
> ```
> The `listeners` Map is private — `EventBus.listeners` returns `undefined`. Only `on`, `off`, and `emit` are public.

### TODO 2 — ES Module Export Conversion (Syntax Example)
Write the same EventBus using ES module syntax: declare `listeners`, `on`, `off`, and `emit` as top-level declarations (no IIFE wrapper), and export only `on`, `off`, and `emit` using named exports. Add a comment explaining how this is conceptually equivalent to the IIFE pattern — the module file's top-level scope IS the private scope.

> **Hint:** An ES module file's top-level scope is private by default — variables declared there are not on the global object. Only `export`ed names are public. The IIFE pattern manually simulates this with a function scope. This is not runnable directly as a `.js` file — note it as a code example with a comment like `// In an ES module file (.mjs or "type": "module"):`.

## What You Learned
- The IIFE module pattern creates a private scope by immediately invoking a function and returning only the public API
- The revealing module variant defines everything in the private scope and explicitly lists public names in the return
- ES modules are the standardized version: the file's top-level scope is private; `export` declares the public API
- All three patterns achieve the same goal: encapsulation with a minimal, explicit public interface

## Stretch Challenges
1. Research the **AMD** (Asynchronous Module Definition) format and **CommonJS** `require`/`module.exports` — explain how they differ from ES modules in loading behavior
2. Add a `count()` method to your EventBus that returns the number of listeners registered for a specific event — this is a public method that reads private state
3. Write an IIFE module for a simple `localStorage`-backed key-value store — `get(key)`, `set(key, value)`, `remove(key)`, `clear()` — abstracting the raw API behind a cleaner interface
