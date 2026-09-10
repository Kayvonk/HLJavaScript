// ─── Advanced Closures: Loops and Currying ────────────────────────────────────

// EXAMPLE 1: The classic var-in-loop closure bug
console.log("--- Example 1: var loop bug ---");

// BROKEN: all callbacks share the same 'i' binding
const broken = [];
for (var i = 0; i < 3; i++) {
  broken.push(() => console.log("broken:", i));
}
// By the time these run, the loop has finished and i === 3
broken[0](); // 3 — not 0!
broken[1](); // 3
broken[2](); // 3

// FIXED: 'let' creates a new binding for each iteration
const fixed = [];
for (let j = 0; j < 3; j++) {
  fixed.push(() => console.log("fixed:", j));
}
fixed[0](); // 0 ✓
fixed[1](); // 1 ✓
fixed[2](); // 2 ✓

// Why? let j is block-scoped to the loop body — each iteration creates
// a fresh 'j' binding. Each closure captures a different binding.


// ─── EXAMPLE 2: Currying with nested arrow functions ─────────────────────────
console.log("\n--- Example 2: Currying ---");

// Curried add: takes 'a', returns a function that takes 'b'
const add = a => b => a + b;

console.log(add(3)(4));   // 7

// Partial application: fix 'a' to create a specialized function
const add10 = add(10);
console.log(add10(5));   // 15
console.log(add10(20));  // 30

// Three-argument currying
const clamp = min => max => value => Math.min(Math.max(value, min), max);
const clamp0to100 = clamp(0)(100);

console.log(clamp0to100(50));   // 50
console.log(clamp0to100(-10));  // 0
console.log(clamp0to100(150));  // 100


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Five Functions, Five Indexes
// Create an array of 5 functions using a loop.
// Each function should log its own index (0 through 4) when called.
// Use 'let' in the loop so each closure captures its own index.
// After filling the array, call each function and verify the output.

// Write your code here:
console.log("\n--- TODO 1: Five Functions, Five Indexes ---");

// Using `let` in the for-header creates a FRESH binding of `i` on every
// iteration, so each pushed arrow function closes over its own `i` value.
// (If we used `var i` here, all five closures would share one binding and
// each would log 5 — the final value after the loop finishes.)
const fns = [];
for (let i = 0; i < 5; i++) {
  fns.push(() => console.log("index:", i));
}

fns[0](); // index: 0
fns[1](); // index: 1
fns[2](); // index: 2
fns[3](); // index: 3
fns[4](); // index: 4


// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Curried Multiply
// Write a curried multiply function: multiply(a) returns a function taking b,
// which returns a * b.
// Create a 'triple' partial by calling multiply(3).
// Demonstrate triple(7) and triple(10).

// Write your code here:
console.log("\n--- TODO 2: Curried Multiply ---");

// Currying uses nested closures: the outer function captures `a`, and the
// inner function keeps that capture alive so it can combine `a` with a
// later-supplied `b`. `multiply(3)` performs partial application — it fixes
// `a` and returns a specialized function.
const multiply = a => b => a * b;

const triple = multiply(3);

console.log(triple(7));  // 21
console.log(triple(10)); // 30

// Bonus check: `multiply` itself is unchanged and reusable.
const quadruple = multiply(4);
console.log(quadruple(5)); // 20
