# Activity 22: Garbage Collection

## Overview
JavaScript manages memory automatically through **garbage collection (GC)**. The modern algorithm is **mark-and-sweep**: the engine marks all objects reachable from "roots" (global scope, call stack, active closures), then sweeps away everything not marked. An object is eligible for collection the moment it becomes **unreachable** — when no variable, closure, or data structure holds a reference to it. Understanding reachability helps you reason about when memory is released.

## Learning Objectives
- Describe the mark-and-sweep garbage collection algorithm
- Define "reachable" in terms of roots and reference chains
- Explain why circular references between two objects are not a memory leak in modern engines
- Identify how closures extend the lifetime of variables beyond a function's return

## Instructions

The examples in `script.js` demonstrate circular references and a closure that unintentionally keeps a large object alive. Study each example and its comments. Then complete the TODOs.

### TODO 1 — Circular References and Reachability
Write a function that creates two objects with a circular reference (`a.ref = b; b.ref = a`). Assign them to outer variables, then set both outer variables to `null`. Add a comment at each step explaining whether the objects are still reachable and at what point they become eligible for garbage collection.

> **Hint:** The key question is: after you set `a = null` and `b = null`, is there any root (global variable, active closure, call stack frame) that still holds a reference to either object? If not, both are unreachable — even though they still reference *each other*. Mark-and-sweep handles this correctly because it starts from roots, not from reference counts.

### TODO 2 — Event Listener Leak (Before and After)
Write a "before" version of a common memory leak: a callback registry array that accumulates listener functions, where each listener closes over a large data object. The large data stays in memory because the closure holds a reference. Write an "after" version that removes the listener from the registry when done, allowing both the listener and the large data to be collected.

> **Hint:** The leak pattern:
> ```js
> const listeners = [];
> function addListener() {
>   const bigData = new Array(10000).fill("data");
>   listeners.push(() => console.log(bigData.length));
>   // bigData can never be collected — the closure in 'listeners' holds it
> }
> ```
> The fix: provide a `removeListener` that splices the function out of the array. Once the closure is removed, `bigData` is no longer referenced and can be collected.

## What You Learned
- Mark-and-sweep starts from roots and marks everything reachable — objects unreachable from roots are collected
- Circular references between two objects are NOT a leak in modern engines — if neither is reachable from a root, both are collected
- Closures keep their closed-over variables alive as long as the closure itself is reachable
- The fix for most leaks is ensuring that references are explicitly removed when they are no longer needed

## Stretch Challenges
1. Research "generational garbage collection" — why does V8 use a young/old generation split and what does it mean for short-lived objects?
2. Explore `WeakRef` — write an example that observes (indirectly) whether an object has been collected by checking if `weakRef.deref()` returns `undefined`
3. Research the `FinalizationRegistry` API — use it to log a message when an object is collected, demonstrating the GC lifecycle
