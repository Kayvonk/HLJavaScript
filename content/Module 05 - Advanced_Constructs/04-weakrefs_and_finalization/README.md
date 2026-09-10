# Activity 21: WeakMap, WeakSet, and WeakRef

## Overview
Normal JavaScript references in Maps and Sets **prevent garbage collection** — the collection keeps referenced objects alive indefinitely. `WeakMap`, `WeakSet`, and `WeakRef` hold **weak references** that don't prevent GC. This makes them ideal for caches, per-object metadata, and membership tracking where you don't want to artificially extend object lifetimes. When the referenced object is collected, the weak reference entry disappears automatically.

## Learning Objectives
- Explain the difference between strong and weak references in terms of garbage collection eligibility
- Use `WeakMap` to associate per-object private data without preventing GC
- Use `WeakSet` to track membership without holding strong references
- Describe when to use each weak collection and what makes them different from `Map` and `Set`

## Instructions

The two examples in `script.js` show `WeakMap` for private per-instance data and a `WeakRef` cache. Study how the lack of a strong reference changes object lifetime. Then complete the TODOs.

### TODO 1 — Per-Object Visit Counter
Use a `WeakMap` to implement a visit counter for objects. Write a `recordVisit(obj)` function that increments a counter stored in the WeakMap for that object. Write a `getVisitCount(obj)` function that returns the count. Test by calling `recordVisit` several times on the same object and logging the count.

> **Hint:**
> ```js
> const visitCounts = new WeakMap();
>
> function recordVisit(obj) {
>   const current = visitCounts.get(obj) ?? 0;
>   visitCounts.set(obj, current + 1);
> }
>
> function getVisitCount(obj) {
>   return visitCounts.get(obj) ?? 0;
> }
> ```
> The `WeakMap` stores the counter with the object as the key. When the object is eventually GC'd (after all strong references are gone), the WeakMap entry disappears automatically — no manual cleanup needed.

### TODO 2 — Processed Objects Set
Create a `WeakSet` to track "processed" objects. Write a `process(obj)` function that checks if the object is already in the WeakSet — if so, log `"already processed"`; otherwise, log the object's contents and add it to the WeakSet. Test with the same object twice and a different object once.

> **Hint:**
> ```js
> const processed = new WeakSet();
>
> function process(obj) {
>   if (processed.has(obj)) {
>     console.log("already processed");
>     return;
>   }
>   console.log("processing:", obj);
>   processed.add(obj);
> }
> ```
> Calling `process(obj)` twice with the same object should log the contents on the first call and `"already processed"` on the second.

## What You Learned
- `WeakMap` and `WeakSet` hold weak references — they don't prevent garbage collection of their keys/values
- Unlike `Map`/`Set`, weak collections are not iterable — you can't enumerate their contents
- `WeakMap` is ideal for per-object metadata (private data, caches) that should live only as long as the object
- `WeakSet` is ideal for membership tracking without permanently holding references to tracked objects

## Stretch Challenges
1. Research `WeakRef` and `FinalizationRegistry` — write an example that registers a cleanup callback to fire when an object is collected (note: GC timing is non-deterministic, so this requires careful testing)
2. Implement a `memoize(fn)` function that uses `WeakMap` for caching — only works for functions whose first argument is an object, but the cache entries are automatically cleaned up when the object is GC'd
3. Explain why `WeakMap` keys must be objects (not primitives) — what property of weak references requires this constraint?
