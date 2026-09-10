# Activity 17: Generators and the Iterator Protocol

## Overview
The **iterator protocol** defines a standard way for JavaScript to produce sequences of values: any object with a `next()` method returning `{value, done}` is an iterator. **Generator functions** (`function*`) make creating iterators easy — they can `yield` values one at a time, pausing execution between yields. This enables **lazy evaluation**: values are computed only when requested, making infinite sequences practical.

## Learning Objectives
- Describe the iterator protocol: `Symbol.iterator`, `next()`, `{value, done}`
- Write a generator function using `function*` and `yield`
- Consume generators with `for...of`, spread, and `.next()` calls
- Use generators to create lazy sequences (including infinite ones)

## Instructions

The two working examples in `script.js` show a manually implemented iterable and an infinite Fibonacci generator. Study how `{value, done}` signals when iteration is complete. Then complete the TODOs.

### TODO 1 — Range Generator
Write a generator function `range(start, end, step)` that yields numbers from `start` up to (but not including) `end`, incrementing by `step` each time. Use `for...of` to consume and log all values of `range(0, 20, 3)`. Expected output: 0, 3, 6, 9, 12, 15, 18.

> **Hint:**
> ```js
> function* range(start, end, step) {
>   for (let i = start; i < end; i += step) {
>     yield i;
>   }
> }
> ```
> The generator pauses at each `yield` and resumes when the consumer calls `.next()`. `for...of` does this automatically, calling `.next()` until `done` is `true`.

### TODO 2 — ID Generator
Write a generator `idGenerator(prefix)` that yields infinitely incrementing IDs like `"user_1"`, `"user_2"`, `"user_3"`, etc. Pull the first five IDs using `.next()` and log them. **Don't use `for...of` for this one** — an infinite generator would loop forever without a `break` condition.

> **Hint:** An infinite generator never returns — it just keeps yielding:
> ```js
> function* idGenerator(prefix) {
>   let count = 1;
>   while (true) {
>     yield `${prefix}_${count++}`;
>   }
> }
> const gen = idGenerator("user");
> console.log(gen.next().value); // "user_1"
> ```
> Calling `gen.next()` pulls one value at a time. The generator is paused between calls — it only runs when asked.

## What You Learned
- The iterator protocol (`Symbol.iterator` + `next()` + `{value, done}`) is the standard interface `for...of` uses
- Generator functions produce iterators automatically — `yield` pauses execution and sends a value to the consumer
- Generators are lazy: computation happens only when the consumer pulls the next value
- Infinite sequences are safe as generators because they only compute the next value when asked

## Stretch Challenges
1. Implement `take(n, iterable)` — a function that pulls the first `n` values from any iterable (array, generator, custom iterator) and returns them as an array
2. Write a generator that `yield*` delegates to another generator — compose a `range(0, 5)` and `range(10, 15)` into a single sequence using `yield*`
3. Research `return(value)` and `throw(error)` on generators — these allow the consumer to terminate or inject errors into a generator from outside
