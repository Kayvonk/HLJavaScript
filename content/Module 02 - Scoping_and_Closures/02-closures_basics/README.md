# Activity 06: Closures — Data Hiding and Factory Functions

## Overview
A **closure** is a function that retains access to its lexical scope even after the outer function has returned. This means inner functions can "close over" variables from their enclosing scope, keeping those variables alive and private. Closures are one of the most powerful patterns in JavaScript — enabling data hiding, factory functions, and stateful callbacks without needing classes.

## Learning Objectives
- Define a closure and explain why the closed-over variable stays alive after the outer function returns
- Implement private state using closures (variables that cannot be accessed from outside)
- Write factory functions that return objects with methods sharing a closed-over private variable
- Create multiple independent instances from the same factory without shared state

## Instructions

Study the two factory function examples in `script.js`. Notice how each instance gets its own private variable and how the returned methods share access to it. Then complete the TODOs.

### TODO 1 — Bank Account Factory
Write a `makeBankAccount(initialBalance)` function that closes over a private `balance` variable. Return an object with three methods: `deposit(amount)`, `withdraw(amount)`, and `getBalance()`. The `balance` variable should never be directly accessible from outside — only through these methods. Test it with at least three operations.

> **Hint:** Start with:
> ```js
> function makeBankAccount(initialBalance) {
>   let balance = initialBalance;
>   return {
>     deposit(amount) { /* add to balance */ },
>     withdraw(amount) { /* subtract, but don't go below 0 */ },
>     getBalance() { /* return balance */ }
>   };
> }
> ```
> After calling `const account = makeBankAccount(100)`, you should find that `account.balance` is `undefined` — the variable is private. The only way to interact with it is through the returned methods.

### TODO 2 — Logger Factory
Write a `makeLogger(prefix)` function that returns a logging function. Every time the returned function is called with a message, it should log `[prefix] message`. Create two loggers with different prefixes and call each one — verify they don't interfere with each other.

> **Hint:** The returned function is a closure that captures `prefix`. The key insight: two calls to `makeLogger` create two *independent* closures, each with its own `prefix` value. They do not share state.

## What You Learned
- A closure is formed when a function references variables from an enclosing scope that has already returned
- Closed-over variables remain in memory as long as at least one closure references them
- Factory functions create independent closure instances — calling the factory twice creates two independent private scopes
- This pattern is the foundation of the module pattern and many design patterns in JavaScript

## Stretch Challenges
1. Add a `transaction history` feature to `makeBankAccount` — a private array that records every deposit and withdrawal, accessible via a `getHistory()` method
2. Write a `makeStack()` factory that implements a stack data structure (push, pop, peek, size) using a closure-private array
3. Research how closures relate to memory — if you create 10,000 logger instances, what does each one hold in memory?
