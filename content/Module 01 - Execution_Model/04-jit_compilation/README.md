# Activity 04: JIT Compilation and Hot Paths

## Overview
JavaScript engines like V8 don't simply interpret your code line by line — they watch for **hot paths** (code that runs many times) and compile them to optimized machine code on the fly. This Just-In-Time (JIT) compilation is why JavaScript can run surprisingly fast. However, the engine makes assumptions based on the types it observes. When those assumptions are violated — such as changing a variable from a number to a string mid-loop — the engine **deoptimizes**, throwing away its optimized code and starting over.

## Learning Objectives
- Explain what JIT compilation is and why it speeds up JavaScript execution
- Describe what makes a function a "hot path" and why the engine optimizes it
- Identify code patterns that can trigger JIT deoptimization (type instability, hidden class changes)
- Use `performance.now()` to measure and compare execution time

## Instructions

The working examples in `script.js` show timing patterns with `performance.now()`. Run the file with `node script.js` to see actual timings. Then complete the TODOs.

### TODO 1 — Time a Hot Loop
Write a function that sums all numbers in an array and call it 100,000 times inside a `performance.now()` timing wrapper. Log the elapsed time in milliseconds. After running it, add a comment predicting: do you think the JIT would have optimized this loop? Why or why not?

> **Hint:** Wrap your timing like this:
> ```js
> const start = performance.now();
> // ... your loop here ...
> const end = performance.now();
> console.log(`Elapsed: ${(end - start).toFixed(2)}ms`);
> ```
> A loop that always works with the same types (all numbers) is a good candidate for JIT optimization.

### TODO 2 — Type Instability
Create a version of the same summing loop, but halfway through the iterations pass a string value instead of a number. Add a comment predicting whether this will affect performance compared to TODO 1, and why. Run both and compare the timings.

> **Hint:** You don't need to measure this precisely — the goal is to understand *why* type changes matter. When the JIT compiles code assuming "this will always be a number," then encounters a string, it must deoptimize (discard the compiled version) and re-run in interpreted mode. This extra work shows up as slower execution.

## What You Learned
- JIT compilers profile code at runtime and compile frequently-executed paths to machine code
- Type-stable code (consistent argument types) allows the engine to produce tightly optimized machine code
- Changing types mid-execution forces deoptimization — the engine discards its work and falls back to slower interpreted execution
- `performance.now()` provides high-resolution timing for measuring JavaScript performance

## Stretch Challenges
1. Research "hidden classes" in V8 — how does adding properties to an object after creation affect optimization?
2. Look up `--trace-opt` and `--trace-deopt` Node.js flags — these log when V8 optimizes and deoptimizes functions
3. Write a benchmark comparing a loop that creates new objects each iteration vs. one that reuses a single object — explain the performance difference in terms of hidden classes
