# Activity 05: Lexical Scope and the Scope Chain

## Overview
Lexical scope means that a function's access to variables is determined by *where it is written in the source code*, not where it is called from. When a variable can't be found in the current scope, JavaScript walks up the **scope chain** through enclosing scopes until it finds the variable or reaches the global scope. Understanding this is foundational to closures, module design, and avoiding unintended variable sharing.

## Learning Objectives
- Define lexical scope and explain why it is also called "static scope"
- Trace the scope chain to predict which variable binding a function will find
- Explain why two sibling functions cannot access each other's local variables
- Demonstrate that scope is determined at author-time, not call-time

## Instructions

Read the two working examples in `script.js`. They show scope chain traversal and lexical vs. dynamic scope behavior. Then complete the TODOs.

### TODO 1 — Greeting Factory
Write a function `makeGreeting(greeting)` that returns an inner function `greet(name)`. The inner function should log the `greeting` and `name` together (e.g., `"Hello, World!"`). The inner function reads `greeting` from the outer function's scope — it does not receive it as an argument.

> **Hint:** The inner function `greet` closes over the `greeting` parameter. When you call `makeGreeting("Hello")`, it returns a new function. That returned function still has access to the `greeting` variable from the outer call — even after `makeGreeting` has returned. This is lexical scope at work: the inner function's scope chain includes `makeGreeting`'s local scope.

### TODO 2 — Lexical vs. Dynamic Scope
Define a variable `x = "outer"` at the top level. Define a function `readX()` that logs `x`. Then inside a *separate* function `changeX()`, declare a local `let x = "inner"` and call `readX()` from there. Add a comment predicting and explaining the output.

> **Hint:** JavaScript uses lexical scope — `readX` looks up `x` based on where *`readX` was defined*, not where it was *called from*. Even though `readX` is called from inside `changeX` (which has its own `x`), `readX` will find the `x` from the scope where it was written. The local `x` inside `changeX` is invisible to `readX`.

## What You Learned
- Scope is determined at author-time (lexically), not at call-time (dynamically)
- The scope chain links each function's scope to its enclosing scope at the point of definition
- Inner functions can read variables from outer scopes; sibling functions cannot share each other's locals
- This predictability is what makes JavaScript code reasoning possible — a function always sees the same variables

## Stretch Challenges
1. Write a deeply nested function (5 levels deep) where the innermost function reads a variable defined at the outermost level — count how many scope chain links JavaScript must follow to find it
2. Research what `with` (a deprecated statement) does to the scope chain and why it was removed from strict mode
3. Explore how ES modules create their own module scope — a variable declared at the top level of a module is NOT on the global scope, unlike a `<script>` tag
