# Activity 34: Functional Programming

## Overview
Functional programming (FP) treats computation as the evaluation of **pure functions** — functions with no side effects that always return the same output for the same input. **Function composition** chains pure functions into pipelines, and **point-free style** removes explicit data parameters to create reusable transformers. These techniques produce code that is easier to test, reason about, and parallelize. JavaScript supports FP natively through first-class functions and closures.

## Learning Objectives
- Define a pure function and identify side effects that violate purity
- Implement a `pipe` utility that composes functions left-to-right
- Implement a `compose` utility that composes functions right-to-left
- Write and verify that `pipe` and `compose` produce the same result given reversed argument order

## Instructions

The working examples in `script.js` show a pure function pipeline built with `pipe`, and a point-free style refactoring. Study how data flows through each step. Then complete the TODOs.

### TODO 1 — pipe(...fns)
Implement a `pipe(...fns)` function that takes any number of functions and returns a new function. When the returned function is called with a value, it passes that value through each function left-to-right. Test it with a pipeline of at least four string transformation steps: trim, lowercase, replace spaces with dashes, and add a `"slug-"` prefix.

> **Hint:** Use `Array.prototype.reduce` to apply each function in sequence:
> ```js
> const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
> ```
> Test:
> ```js
> const toSlug = pipe(
>   str => str.trim(),
>   str => str.toLowerCase(),
>   str => str.replace(/\s+/g, "-"),
>   str => "slug-" + str
> );
> console.log(toSlug("  Hello World  ")); // "slug-hello-world"
> ```

### TODO 2 — compose(...fns)
Implement a `compose(...fns)` function that applies functions right-to-left (the mathematical convention). Verify that `compose(f, g, h)(x)` equals `f(g(h(x)))`. Use the same four string transforms from TODO 1 in **reverse** order and verify the result is identical.

> **Hint:**
> ```js
> const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
> ```
> `compose(addPrefix, replaceDashes, lowercase, trim)("  Hello World  ")` should equal `pipe(trim, lowercase, replaceDashes, addPrefix)("  Hello World  ")`. The transforms are the same — just listed in the opposite order.

## What You Learned
- Pure functions always produce the same output for the same input and have no side effects — they are testable in isolation
- `pipe` composes left-to-right (data flows in reading order)
- `compose` composes right-to-left (mathematical convention: the rightmost function runs first)
- Point-free style eliminates the explicit `x =>` parameter, making pipelines read as a list of operations

## Stretch Challenges
1. Write a `curry(fn)` utility that automatically curries a function of any arity, then use it to create point-free versions of array operations: `const double = map(x => x * 2)` where `map` is a curried version of `Array.prototype.map`
2. Research **functors** — explain why `Array.prototype.map` satisfies the functor laws (identity and composition)
3. Research **monads** in JavaScript — explain how Promises are a monad and how `.then` chains satisfy the monad bind operation
