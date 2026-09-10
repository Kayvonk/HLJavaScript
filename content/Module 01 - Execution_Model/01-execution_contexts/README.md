# Activity 01: Execution Contexts and the Call Stack

## Overview
Every time JavaScript runs code, it creates an execution context — a structured environment that tracks variables, scope, and the current instruction pointer. Understanding how contexts are created, stacked, and destroyed explains hoisting, scope, and why code runs in the order it does.

## Learning Objectives
- Describe the difference between the global execution context and function execution contexts
- Explain the two phases of execution context creation (creation phase vs. execution phase)
- Trace the call stack as functions are called and returned
- Predict why `var` declarations are `undefined` before their line rather than throwing an error

## Instructions

Read through the working examples in `script.js`. They demonstrate context creation and the call stack in action. Then complete the TODOs at the bottom.

### TODO 1 — Hoisting Prediction
Access a `var` variable before the line where it is declared. Predict what the output will be, run it, and add a comment explaining *why* the output is `undefined` rather than a `ReferenceError`.

> **Hint:** During the creation phase, JavaScript scans for all `var` declarations and sets them to `undefined` before any code runs. The assignment only happens when execution reaches that line. Ask yourself: what does the engine "know" about the variable before it executes that line?

### TODO 2 — Three-Level Call Stack
Write three functions — `outer`, `middle`, and `inner` — where `outer` calls `middle` and `middle` calls `inner`. Each function should log a message when it is entered and when it is about to return. After writing the code, add comments tracing the call stack state at each step (what is pushed, what is popped).

> **Hint:** The call stack is LIFO (last in, first out). When `outer` is called, it gets pushed. When `outer` calls `middle`, `middle` is pushed on top. When `inner` finishes, it is popped first. Sketch the stack on paper first, then write the code to match your sketch.

## What You Learned
- JavaScript creates a new execution context for every function call, each with its own variable environment
- The creation phase runs before any code executes, which is why `var` declarations are hoisted as `undefined`
- The call stack is a LIFO structure — the most recently called function is always the first to finish
- Function declarations are fully hoisted (name and body); `var` declarations are hoisted as `undefined`

## Stretch Challenges
1. Look up what a "stack overflow" error is and write code that intentionally causes one (a function that calls itself infinitely) — then explain in a comment why JavaScript throws rather than running forever
2. Research what the "execution context record" stores beyond just variable bindings (hint: `this` binding, outer environment reference) and add a comment block summarizing the three components
3. Explore what happens to `let` and `const` during the creation phase — test accessing them before their declaration and compare the error to what `var` produces
