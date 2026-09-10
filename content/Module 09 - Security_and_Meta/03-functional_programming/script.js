// ─── Functional Programming ───────────────────────────────────────────────────

// EXAMPLE 1: Pure functions and side effects
console.log("--- Example 1: Pure vs impure functions ---");

// IMPURE: reads from and writes to external state
let total = 0;
function addToTotalImpure(n) {
  total += n;           // side effect — modifies external state
  return total;         // output depends on external state
}

// PURE: output depends only on input, no side effects
function addPure(a, b) {
  return a + b;         // same inputs always produce same output
}

console.log(addPure(3, 4)); // 7 — always
console.log(addPure(3, 4)); // 7 — guaranteed
// Pure functions are trivially testable and safely parallelizable


// ─── EXAMPLE 2: Pipeline with pipe ───────────────────────────────────────────
console.log("\n--- Example 2: pipe pipeline ---");

// A simple pipe implementation:
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

// Each step is a pure, single-purpose function:
const trim         = str => str.trim();
const toLower      = str => str.toLowerCase();
const removeExtraSpaces = str => str.replace(/\s+/g, " ");
const capitalize   = str => str.charAt(0).toUpperCase() + str.slice(1);

const normalizeTitle = pipe(trim, toLower, removeExtraSpaces, capitalize);

console.log(normalizeTitle("  hello   WORLD  ")); // "Hello world"
console.log(normalizeTitle("  JAVASCRIPT  IS  GREAT  ")); // "Javascript is great"


// ─── EXAMPLE 3: Point-free style ─────────────────────────────────────────────
console.log("\n--- Example 3: Point-free ---");

// With explicit parameter (pointful):
const doubleAllPointful = arr => arr.map(x => x * 2);

// Point-free: function reference, no explicit 'x' or 'arr' parameter
const double    = x => x * 2;
const doubleAll = arr => arr.map(double);
// Or even more point-free using a curried map:
// const curryMap = fn => arr => arr.map(fn);
// const doubleAll = curryMap(double);

console.log(doubleAll([1, 2, 3, 4, 5])); // [2, 4, 6, 8, 10]


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: pipe(...fns)
// Implement pipe(...fns) => x => apply each fn left-to-right to x.
// Create a pipeline of 4 string transformations:
//   1. trim whitespace
//   2. lowercase
//   3. replace spaces with dashes
//   4. add "slug-" prefix
// Test: pipe(trim, lower, dashify, prefix)("  Hello World  ") → "slug-hello-world"

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: compose(...fns)
// Implement compose(...fns) => x => apply each fn RIGHT-to-LEFT to x.
// Use the SAME 4 transforms from TODO 1 in REVERSE order.
// Verify that compose(prefix, dashify, lower, trim)("  Hello World  ")
// produces the same result as the pipe version.

// Write your code here:
