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
console.log("\n--- TODO 1: Time a Hot Loop ---");

// A tight numeric loop like this is exactly what V8's TurboFan wants to see:
// same shape of input on every call, same numeric type throughout, no bailouts.
// Being called 100,000 times pushes it well past the hotness threshold.
function sumNumbers(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}

const dataForTodo1 = Array.from({ length: 1000 }, (_, i) => i + 1);

const startTodo1 = performance.now();
let resultTodo1 = 0;
for (let i = 0; i < 100000; i++) {
  resultTodo1 = sumNumbers(dataForTodo1);
}
const endTodo1 = performance.now();

console.log(`Result: ${resultTodo1}`);
console.log(`Elapsed: ${(endTodo1 - startTodo1).toFixed(2)}ms`);

// Would the JIT optimize this? YES.
// - It is a "hot" function — called far more than the ~10k threshold V8 uses.
// - Argument types never change (always an array of small integers), so the
//   engine can specialize on the array's hidden class and the numeric type.
// - The body has no polymorphic operations, no try/catch overhead, no
//   with/eval. That means the optimized machine code stays live for the
//   full run without deoptimizations.


// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Type Instability
// Create a version of the same summing loop, but halfway through the iterations
// pass a string value instead of a number.
// Add a comment predicting whether this affects performance vs. TODO 1 and why.
// Run both and compare the timings.

// Write your code here:
console.log("\n--- TODO 2: Type Instability ---");

// Prediction: this loop will be measurably SLOWER than TODO 1.
// Reason: once the string sneaks into the array, `total += arr[i]` stops being
// pure numeric addition and becomes string concatenation. The optimized code
// that assumed "numbers only" is invalidated — V8 deoptimizes the function
// back to a slower generic version. From that point on, the tight machine-code
// path is gone.
function sumMixed(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}

const mixedData = Array.from({ length: 1000 }, (_, i) => i + 1);
mixedData[500] = "oops"; // type violation right in the middle

const startTodo2 = performance.now();
let resultTodo2 = 0;
for (let i = 0; i < 100000; i++) {
  resultTodo2 = sumMixed(mixedData);
}
const endTodo2 = performance.now();

console.log(`Result: ${resultTodo2}`); // note: this is now a concatenated string
console.log(`Elapsed: ${(endTodo2 - startTodo2).toFixed(2)}ms`);

// Comparison note:
// The mixed-type run typically takes longer because after the first string
// concatenation the engine can no longer treat `+` as an integer op — it must
// fall back to the general-purpose ToPrimitive/ToString path on every element
// that follows. Even one type change per array poisons the optimization.
