# Activity 31: Dynamic Typing Pitfalls

## Overview
JavaScript's dynamic type system is flexible but full of traps. `typeof` has a historical bug (`typeof null === "object"`), `instanceof` fails across different JavaScript realms and doesn't work with primitives, and `NaN` is not caught by `typeof` or basic equality checks. Knowing the **safe alternatives** — `Array.isArray()`, `Number.isNaN()`, `Number.isFinite()`, and `Object.prototype.toString.call()` — is essential for writing robust code that handles real-world input.

## Learning Objectives
- Identify the edge cases in `typeof` and `instanceof`
- Use `Number.isNaN()` instead of global `isNaN()` for accurate NaN detection
- Write a `safeParseInt` function that returns `null` for unparseable inputs
- Write a `getType` function using `Object.prototype.toString.call()` for precise type strings

## Instructions

Study the edge case examples in `script.js`. Notice the difference between global `isNaN()` (which coerces first) and `Number.isNaN()` (which does not coerce). Then complete the TODOs.

### TODO 1 — safeParseInt
Write a `safeParseInt(value)` function that returns `null` if the value cannot be parsed to a finite integer (handling strings like `"abc"`, `null`, `undefined`, objects, `NaN`, `Infinity`, and `"3.7"`). Use `Number.isFinite()` and `Number.isInteger()` in the implementation.

> **Hint:** The approach:
> ```js
> function safeParseInt(value) {
>   const n = Number(value); // first try converting to number
>   if (!Number.isFinite(n)) return null; // rejects NaN, Infinity
>   if (!Number.isInteger(n)) return null; // rejects 3.7
>   return n;
> }
> ```
> Or use `parseInt(value, 10)` and then validate the result. Test with: `"42"`, `"3.7"`, `"abc"`, `null`, `undefined`, `Infinity`, `NaN`, `true`.

### TODO 2 — getType
Write a `getType(value)` function that returns precise type strings like `"null"`, `"array"`, `"date"`, `"regexp"`, `"object"`, `"number"`, `"string"`, etc. — more precise than `typeof` alone. Use `Object.prototype.toString.call(value)` to extract the internal `[[Class]]` tag, then clean it up.

> **Hint:** `Object.prototype.toString.call(value)` returns strings like `"[object Array]"`, `"[object Null]"`, `"[object Date]"`. You can extract just the type name:
> ```js
> function getType(value) {
>   const raw = Object.prototype.toString.call(value);
>   return raw.slice(8, -1).toLowerCase(); // "[object Array]" → "array"
> }
> ```
> Test with: `null`, `undefined`, `[]`, `{}`, `new Date()`, `/regex/`, `42`, `"str"`, `() => {}`.

## What You Learned
- `typeof null === "object"` is a 30-year-old bug in the language — always use explicit `=== null` checks
- `typeof function(){}` returns `"function"` as a special case (not `"object"`)
- `Number.isNaN()` only returns `true` for actual `NaN` — unlike global `isNaN()` which coerces first
- `Object.prototype.toString.call()` gives the most accurate type information, bypassing all the edge cases

## Stretch Challenges
1. Write a `typeGuard(value, expectedType)` function that uses `getType()` and throws a `TypeError` if the type doesn't match — useful for validating function arguments
2. Research why `instanceof` fails across iframes/realms — what is a "realm" in JavaScript and why does `Array.isArray()` work across realms when `instanceof Array` doesn't?
3. Write a `isPlainObject(value)` function that returns `true` only for objects created with `{}` or `Object.create(null)` — excluding arrays, dates, maps, and class instances
