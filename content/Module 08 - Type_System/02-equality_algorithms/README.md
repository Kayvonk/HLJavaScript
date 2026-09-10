# Activity 30: Equality Algorithms

## Overview
JavaScript has three distinct equality algorithms — and each serves a different purpose. **Abstract equality** (`==`) applies coercion before comparing. **Strict equality** (`===`) compares without coercion but has two edge cases: `NaN !== NaN` and `+0 === -0`. **SameValue** (`Object.is()`) handles those edge cases correctly. **SameValueZero** (used by `Map`, `Set`, and `Array.includes`) is like SameValue but treats `+0` and `-0` as equal. Knowing which algorithm a built-in uses explains many subtle behaviors.

## Learning Objectives
- Describe the coercion rules for abstract equality (`==`)
- Explain the two cases where `===` differs from `Object.is()`: `NaN` and `±0`
- Implement `strictSameValue` manually without using `Object.is()`
- Demonstrate SameValueZero behavior in `Set` and `Array.includes`

## Instructions

The examples in `script.js` show `==` coercion rules and the `NaN`/`±0` edge cases. Study the annotated output carefully — especially the `null`/`undefined` special case in `==`. Then complete the TODOs.

### TODO 1 — strictSameValue
Write a `strictSameValue(a, b)` function that returns `true` when `a` and `b` are the "same value" — correctly handling `NaN` (should return `true` for `NaN, NaN`) and `±0` (should return `false` for `+0, -0`) — without using `Object.is()`. Then verify your implementation against `Object.is()` for the edge cases.

> **Hint:** Two checks handle the edge cases:
> - `NaN` is the only value in JavaScript that is not equal to itself: `a !== a` is only true when `a` is `NaN`. So `NaN` check: `if (a !== a) return b !== b`
> - `+0` and `-0`: they are `===` equal but have different signs. Check: `if (a === 0 && b === 0) return 1/a === 1/b` (because `1/+0 === Infinity` and `1/-0 === -Infinity`)
> For all other values, fall back to `a === b`.

### TODO 2 — SameValueZero in Set
Add `NaN` to a `Set`, then check `set.has(NaN)`. Add a comment explaining why `set.has(NaN)` returns `true` even though `NaN !== NaN`. Then add both `+0` and `-0` to a Set and observe that only one entry is created — explaining the SameValueZero rule.

> **Hint:** `Set` uses SameValueZero internally, which is like `===` except `NaN` is considered equal to itself (unlike `===`). This is why `set.has(NaN)` is `true`. The `+0`/`-0` behavior in SameValueZero matches `===` (they are equal), so adding both only stores one entry.

## What You Learned
- `==` (abstract equality) coerces operands — `null == undefined` is `true`, `"0" == 0` is `true`
- `===` (strict equality) does not coerce — but `NaN !== NaN` and `+0 === -0` are the edge cases
- `Object.is()` (SameValue) correctly returns `false` for `+0 === -0` and `true` for `NaN === NaN`
- `Set`, `Map`, and `Array.includes` use SameValueZero: like `===` but `NaN === NaN`

## Stretch Challenges
1. Research the full abstract equality algorithm in MDN or the ECMAScript spec — write out the decision tree as pseudocode
2. Implement `Map` lookup using `Object.is()` semantics — verify that `NaN` can be used as a Map key and retrieved correctly
3. Write a `deepEqual(a, b)` function that handles nested objects and arrays using SameValue for primitive comparisons
