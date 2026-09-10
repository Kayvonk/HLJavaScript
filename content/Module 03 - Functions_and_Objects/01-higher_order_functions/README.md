# Activity 08: Higher-Order Functions

## Overview
A **higher-order function** is one that either takes a function as an argument or returns a function as a result. This is possible because JavaScript treats functions as first-class values — they can be passed around, stored in variables, and returned just like numbers or strings. Understanding higher-order functions unlocks powerful abstractions like `map`, `filter`, `reduce`, and function composition.

## Learning Objectives
- Explain what "first-class functions" and "higher-order functions" mean
- Implement custom versions of `map`, `filter`, and `reduce` to understand their mechanics
- Write a `compose` function that chains two functions together
- Write a `repeat` utility that calls a function a specified number of times

## Instructions

The working examples in `script.js` build `myMap`, `myFilter`, and `myReduce` from scratch, then chain them together. Study how each one accepts a callback function and applies it. Then complete the TODOs.

### TODO 1 — compose
Write a `compose(f, g)` function that returns a new function. When called with a value `x`, the returned function applies `g` first, then passes the result to `f` (right-to-left application — the mathematical convention). Test it by composing `x => x * 2` (double) and `x => x + 1` (addOne), and verify that `compose(double, addOne)(5)` returns `12`.

> **Hint:** The composed function should look like: `x => f(g(x))`. Note the order — `g` runs first, `f` runs second. So `compose(double, addOne)(5)` computes `addOne(5)` first (→ 6), then `double(6)` (→ 12). Many libraries call right-to-left application `compose` and left-to-right application `pipe`.

### TODO 2 — repeat
Write a `repeat(n, fn)` function that calls `fn` exactly `n` times, passing the current iteration index (starting at 0) each time. Use it to log `"Hello #0"` through `"Hello #4"`.

> **Hint:** `repeat` is itself a higher-order function — it takes `fn` as an argument and calls it. The simplest implementation uses a `for` loop that calls `fn(i)` on each iteration. You could also implement it with recursion if you want a challenge.

## What You Learned
- Functions are first-class values in JavaScript — they can be passed as arguments and returned as results
- Higher-order functions abstract over *actions* rather than just data, enabling powerful reusable patterns
- `map`, `filter`, and `reduce` are all higher-order functions — they accept a callback that defines the operation
- `compose` enables building complex behavior by chaining simple, single-purpose functions

## Stretch Challenges
1. Implement `pipe(...fns)` — the left-to-right version of compose — using `Array.prototype.reduce`
2. Write a `once(fn)` higher-order function that wraps `fn` and ensures it can only be called once — subsequent calls return the result of the first call without re-executing `fn`
3. Implement `memoize(fn)` — a wrapper that caches results by input value so expensive functions aren't recomputed for the same arguments
