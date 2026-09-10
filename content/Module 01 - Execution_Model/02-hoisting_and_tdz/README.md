# Activity 02: Hoisting and the Temporal Dead Zone

## Overview
Hoisting describes how JavaScript moves declarations to the top of their scope during the creation phase. While `var` and function declarations are hoisted with usable values, `let` and `const` are hoisted differently — they exist in memory but are locked in the **Temporal Dead Zone (TDZ)** until their declaration line is reached, causing a `ReferenceError` if accessed too early.

## Learning Objectives
- Explain why `var` produces `undefined` when accessed before its declaration but `let`/`const` throw a `ReferenceError`
- Define the Temporal Dead Zone and describe when it begins and ends
- Distinguish between function declaration hoisting and function expression hoisting
- Predict the output of code containing mixed hoisting scenarios

## Instructions

Read through the working examples in `script.js` to see each hoisting behavior demonstrated with expected output. Then complete the TODOs.

### TODO 1 — TDZ in Action
Access a `const` variable before its declaration inside a `try/catch` block. Catch the error, log `error.name`, and add a comment explaining what the Temporal Dead Zone means in plain language — not just a definition, but *why* the engine enforces it.

> **Hint:** Wrap the early access in `try { console.log(myConst); } catch (e) { console.log(e.name); }` and then declare `const myConst = "hello"` after the try/catch. The error name will be `ReferenceError`. Your comment should explain the difference between "exists but is inaccessible" (TDZ) and "does not exist yet" (undeclared).

### TODO 2 — Function Declaration vs. Function Expression
Try calling a **function declaration** before its line, and try calling a **`const` function expression** before its line. Place each attempt in a `try/catch` and log what happens. Add comments explaining why the two behaviors differ.

> **Hint:** A function declaration (`function sayHi() {}`) is fully hoisted — the entire body is available immediately. A function expression stored in `const` (`const sayHi = function() {}`) is in the TDZ until that line executes. Think about what the engine "stores" for each during the creation phase.

## What You Learned
- `var` is hoisted and initialized to `undefined` — accessible but valueless before its assignment line
- `let` and `const` are hoisted but placed in the TDZ — accessing them before their declaration throws a `ReferenceError`
- Function declarations are fully hoisted (name and body available immediately)
- Function expressions assigned to `const`/`let` follow `const`/`let` TDZ rules — not callable before the line

## Stretch Challenges
1. Research why the TDZ was intentionally designed into `let`/`const` — what category of bugs does it prevent that `var` allowed?
2. Write a function where a `let` parameter shadows an outer `var` with the same name — observe and explain which value each scope sees
3. Explore class hoisting: try instantiating a class before its declaration and note the error — classes are also in the TDZ
