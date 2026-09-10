// ─── JIT Compilation and Hot Paths ───────────────────────────────────────────

// EXAMPLE 1: Timing a tight numeric loop
// The JIT will recognize this as a hot path and compile it to machine code.
console.log("--- Example 1: Timing a hot numeric loop ---");

function sumArray(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}

const numbers = Array.from({ length: 1000 }, (_, i) => i + 1);

const start1 = performance.now();
let result1 = 0;
for (let i = 0; i < 10000; i++) {
  result1 = sumArray(numbers);
}
const end1 = performance.now();

console.log(`Result: ${result1}`);
console.log(`Elapsed: ${(end1 - start1).toFixed(2)}ms`);
// The engine sees the same numeric types on every call — a perfect
// candidate for JIT optimization. Later calls are faster than the first.


// ─── EXAMPLE 2: What deoptimization looks like in theory ─────────────────────
console.log("\n--- Example 2: Type-stable vs. type-unstable ---");

// Type-stable: always adding numbers — JIT stays happy
function addStable(a, b) {
  return a + b;
}

const start2 = performance.now();
let sum2 = 0;
for (let i = 0; i < 500000; i++) {
  sum2 = addStable(i, i + 1);
}
const end2 = performance.now();
console.log(`Stable result: ${sum2}, time: ${(end2 - start2).toFixed(2)}ms`);

// Type-unstable: mixing numbers and strings
// The JIT compiles expecting numbers, then encounters a string at iteration 250000
// and must deoptimize — falling back to slower interpreted execution.
function addUnstable(a, b) {
  return a + b;
}

const start3 = performance.now();
let sum3;
for (let i = 0; i < 500000; i++) {
  if (i === 250000) {
    sum3 = addUnstable("oops", i); // type change mid-loop
  } else {
    sum3 = addUnstable(i, i + 1);
  }
}
const end3 = performance.now();
console.log(`Unstable result: ${sum3}, time: ${(end3 - start3).toFixed(2)}ms`);
// The unstable version is often measurably slower — the type violation
// forces the engine to bail out of its optimized code path.


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Time a Hot Loop
// Write a function that sums all numbers in an array.
// Call it 100,000 times inside a performance.now() timing wrapper.
// Log the elapsed time in milliseconds.
// Add a comment: would the JIT optimize this function? Why or why not?

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Type Instability
// Create a version of the same summing loop, but halfway through the iterations
// pass a string value instead of a number.
// Add a comment predicting whether this affects performance vs. TODO 1 and why.
// Run both and compare the timings.

// Write your code here:
