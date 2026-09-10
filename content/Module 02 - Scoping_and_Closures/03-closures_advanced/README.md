# Activity 07: Advanced Closures — Loops and Currying

## Overview
Two classic closure pitfalls and patterns: the **`var` in a loop bug** (where all loop callbacks capture the same variable instead of their own copy) and **currying** (splitting a multi-argument function into a chain of single-argument functions using nested closures). Both reveal how closures capture *bindings*, not *values* — and how `let` block scoping solves the loop problem elegantly.

## Learning Objectives
- Explain why callbacks created in a `var` loop all share the same counter variable
- Fix the loop closure bug using `let` block scoping
- Write curried functions using nested arrow functions
- Create partial applications by calling a curried function with fewer arguments than it expects

## Instructions

Study the loop bug example and the currying examples in `script.js`. Pay close attention to the difference between `var` (function-scoped — one binding for the whole loop) and `let` (block-scoped — one new binding per iteration). Then complete the TODOs.

### TODO 1 — Five Functions, Five Indexes
Create an array of five functions. Each function, when called, should log its own index (0 through 4). Use `let` in the loop to ensure each function captures its own index. After filling the array, call each function.

> **Hint:** A `for` loop with `let i` creates a new `i` binding on each iteration — so each function's closure captures a *different* `i`. Compare this to `var i`, which creates a *single* `i` shared across all iterations (all closures would see the same final value of `i` after the loop ends).
>
> ```js
> const fns = [];
> for (let i = 0; i < 5; i++) {
>   fns.push( /* a function that logs i */ );
> }
> ```

### TODO 2 — Curried Multiply
Write a curried `multiply` function that takes two arguments one at a time: `multiply(a)` returns a function that takes `b` and returns `a * b`. Then create a `triple` partial by calling `multiply(3)`. Demonstrate `triple(7)` and `triple(10)`.

> **Hint:** A curried function using arrow syntax looks like: `const multiply = a => b => a * b;`
> — the outer arrow function takes `a`, the inner arrow function takes `b` and closes over `a`.
> `multiply(3)` returns the inner function with `a` locked in as `3`.
> Storing that returned function as `triple` creates a reusable partial application.

## What You Learned
- Closures capture *variable bindings*, not values at the moment of creation — the binding is shared
- `let` in a `for` loop creates a new binding per iteration, giving each closure its own copy
- Currying transforms `f(a, b)` into `f(a)(b)` using nested closures to remember earlier arguments
- Partial application (fixing some arguments now, supplying the rest later) is a natural consequence of currying

## Stretch Challenges
1. Write a general `curry(fn)` function that automatically curries any function of any arity — it should work for 2-argument, 3-argument, and 4-argument functions
2. Rewrite the loop bug example using an IIFE (Immediately Invoked Function Expression) instead of `let` — this was the pre-ES6 fix and shows the same concept from a different angle
3. Research "partial application" vs. "currying" — they are related but not the same thing. Write an example of each and explain the difference
