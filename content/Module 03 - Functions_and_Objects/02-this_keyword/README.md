# Activity 09: The `this` Keyword

## Overview
`this` in JavaScript is not a fixed value — it is determined at **call time** by how a function is invoked, not where it is defined. There are four binding rules: **default** (global or `undefined` in strict mode), **implicit** (the object before the dot), **explicit** (via `.call()`, `.apply()`, `.bind()`), and **new** (constructor calls). Arrow functions are the exception — they have no own `this` and inherit it lexically from their enclosing scope.

## Learning Objectives
- Describe the four `this` binding rules and when each applies
- Explain why extracting a method from an object loses its `this` binding
- Fix lost `this` using `.bind()` or arrow functions
- Use `.call()` and `.apply()` to explicitly set `this` and understand the argument difference between them

## Instructions

The two working examples in `script.js` show the `this`-loss bug and the `.call`/`.apply`/`.bind` API. Read them carefully, noting the difference between regular functions and arrow functions. Then complete the TODOs.

### TODO 1 — Lost `this` and `.bind()`
Create an object `calculator` with numeric properties `a` and `b` and a method `sum()` that returns `this.a + this.b`. Extract `sum` into a standalone variable and call it — observe that `this` is no longer the calculator object. Fix the broken call using `.bind(calculator)`.

> **Hint:**
> ```js
> const calculator = { a: 10, b: 5, sum() { return this.a + this.b; } };
> const extractedSum = calculator.sum;
> extractedSum(); // this is undefined (strict) or global — not calculator
> ```
> When you extract the method, you lose the implicit binding. `.bind(calculator)` returns a *new* function with `this` permanently set to `calculator`.

### TODO 2 — `.call()` vs `.apply()`
Write a standalone function `greet(greeting, punctuation)` that logs `greeting + ", " + this.name + punctuation`. Use `.call()` to invoke it with one object (passing `greeting` and `punctuation` as separate arguments), and `.apply()` to invoke it with a different object (passing arguments as an array).

> **Hint:** The only difference between `.call()` and `.apply()` is how you pass arguments:
> - `.call(thisArg, arg1, arg2)` — arguments listed individually
> - `.apply(thisArg, [arg1, arg2])` — arguments in an array
> Both set `this` to `thisArg` for that single call.

## What You Learned
- `this` is dynamically determined at call time — it depends on *how* the function is called, not where it is defined
- Extracting a method from an object loses the implicit `this` binding
- `.bind(obj)` returns a new function with `this` permanently locked — useful for callbacks
- Arrow functions inherit `this` from their enclosing lexical scope — they never have their own `this`

## Stretch Challenges
1. Research `new` binding — write a constructor function and show that when called with `new`, `this` refers to the newly created object
2. Research `Function.prototype.bind` internals — why does a bound function ignore subsequent `.bind()` calls or `new` calls (mostly)?
3. Write a `debounce(fn, delay)` decorator that uses an arrow function for the inner `setTimeout` callback to preserve `this` from the outer context
