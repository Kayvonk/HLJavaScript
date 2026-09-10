# Activity 24: Immutability and Structural Sharing

## Overview
**Immutability** means never modifying data in place — instead, you create new data structures with the desired changes applied. **Structural sharing** makes this efficient: new versions share unchanged parts with old versions rather than copying everything. This pattern underlies React's state updates, Redux reducers, and functional programming at large. It also eliminates an entire category of bugs: shared mutable state causing unexpected side effects.

## Learning Objectives
- Explain why mutating shared state causes bugs and how immutability prevents them
- Write immutable update patterns using spread (`...`) and `Object.assign()`
- Implement `Object.freeze()` for shallow immutability
- Write a `deepFreeze()` utility that recursively freezes nested objects

## Instructions

The two examples in `script.js` demonstrate mutable vs. immutable state updates, then a `deepFreeze` utility. Study how structural sharing preserves the original state. Then complete the TODOs.

### TODO 1 — Immutable Array Update
Write an `updateItem(list, index, updates)` function that returns a **new** array with the item at `index` replaced by a spread-merged version of the old item and `updates`, without mutating the original array. Test with an array of user objects — update one user's `email` and verify the original array is unchanged.

> **Hint:** Use the spread operator to build a new array:
> ```js
> function updateItem(list, index, updates) {
>   return list.map((item, i) =>
>     i === index ? { ...item, ...updates } : item
>   );
> }
> ```
> Or equivalently with array spread:
> ```js
> return [
>   ...list.slice(0, index),
>   { ...list[index], ...updates },
>   ...list.slice(index + 1)
> ];
> ```
> Both approaches return a new array. The items at other indexes are the same object references (structural sharing — not copies).

### TODO 2 — deepFreeze
Write a `deepFreeze(obj)` function that recursively calls `Object.freeze()` on an object and all of its nested object values (going as deep as necessary). Test it on a nested config object — attempt to modify a deeply nested property and verify it fails (silently in sloppy mode, with a TypeError in strict mode).

> **Hint:** Call `Object.freeze(obj)` first, then recurse into each value:
> ```js
> function deepFreeze(obj) {
>   Object.freeze(obj);
>   Object.keys(obj).forEach(key => {
>     if (typeof obj[key] === "object" && obj[key] !== null) {
>       deepFreeze(obj[key]);
>     }
>   });
>   return obj;
> }
> ```
> Note: `Object.freeze()` alone is *shallow* — it only freezes the top-level properties. Nested objects are not frozen. `deepFreeze` handles the recursion.

## What You Learned
- Mutating shared objects causes hard-to-trace bugs — immutable updates make data flow predictable
- Structural sharing (unchanged parts are shared references) makes immutable updates efficient
- `Object.freeze()` is shallow — only top-level properties are frozen; nested objects remain mutable
- `deepFreeze` recursively applies `Object.freeze` to all nested objects for deep immutability

## Stretch Challenges
1. Write an `immutablePush(arr, item)` and `immutablePop(arr)` that return new arrays — no mutation allowed
2. Research how Immer.js works — it uses Proxy to let you write "mutating" code that is automatically converted to immutable updates
3. Write a `createImmutableReducer(initialState, handlers)` factory that creates a Redux-style reducer — the state is deep-frozen before being passed to each handler so accidental mutations throw immediately
