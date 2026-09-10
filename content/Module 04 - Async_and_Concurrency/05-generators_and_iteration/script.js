// ─── Generators and the Iterator Protocol ────────────────────────────────────

// EXAMPLE 1: Manual iterable implementing the iterator protocol
console.log("--- Example 1: Manual iterator protocol ---");

// An object is iterable if it has Symbol.iterator that returns an iterator.
// An iterator has a next() method returning { value, done }.
const countUpTo = {
  [Symbol.iterator](max = 5) {
    let current = 1;
    return {
      next() {
        if (current <= max) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

// for...of uses the iterator protocol automatically
for (const n of { [Symbol.iterator]: () => countUpTo[Symbol.iterator](3) }) {
  process.stdout.write(n + " "); // 1 2 3
}
console.log();


// ─── EXAMPLE 2: Generator function — Fibonacci sequence ──────────────────────
console.log("\n--- Example 2: Infinite Fibonacci generator ---");

function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {  // infinite — only computes when pulled
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
const first10 = [];
for (let i = 0; i < 10; i++) {
  first10.push(fib.next().value);
}
console.log("first 10 fibonacci:", first10);
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

// Generators work with for...of (with a break to stop the infinite loop):
console.log("fibonacci via for...of:");
let count = 0;
for (const n of fibonacci()) {
  if (count++ >= 7) break;
  process.stdout.write(n + " ");
}
console.log();


// ─── EXAMPLE 3: Generator with return — finite sequence ──────────────────────
console.log("\n--- Example 3: Finite generator ---");

function* letters() {
  yield "a";
  yield "b";
  yield "c";
  // implicit return — done becomes true after "c"
}

console.log("spread generator:", [...letters()]); // ["a", "b", "c"]

const gen = letters();
console.log(gen.next()); // { value: "a", done: false }
console.log(gen.next()); // { value: "b", done: false }
console.log(gen.next()); // { value: "c", done: false }
console.log(gen.next()); // { value: undefined, done: true }


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Range Generator
// Write a generator function range(start, end, step) that yields numbers
// from start up to (but not including) end, incrementing by step.
// Use for...of to log all values of range(0, 20, 3).
// Expected: 0 3 6 9 12 15 18

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: ID Generator
// Write an infinite generator idGenerator(prefix) that yields IDs:
//   "prefix_1", "prefix_2", "prefix_3", ...
// Pull the first FIVE IDs using .next() (not for...of — it would loop forever).
// Log each one.

// Write your code here:
