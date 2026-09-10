// ─── Execution Contexts and the Call Stack ───────────────────────────────────

// EXAMPLE 1: var hoisting — creation phase sets var to undefined before execution
console.log("--- Example 1: var hoisting ---");

console.log(city); // undefined — NOT a ReferenceError
var city = "Seattle";
console.log(city); // "Seattle"

// Function declarations are fully hoisted (name + body), so this works:
greet(); // "Hello!" — callable before the declaration line

function greet() {
  console.log("Hello!");
}

// ─── EXAMPLE 2: The call stack ────────────────────────────────────────────────
console.log("\n--- Example 2: Call stack trace ---");

// Each function call pushes a new execution context onto the stack.
// When it returns, that context is popped off.

function a() {
  console.log("a: entered");
  b();
  console.log("a: back from b, about to return");
}

function b() {
  console.log("  b: entered");
  c();
  console.log("  b: back from c, about to return");
}

function c() {
  console.log("    c: entered");
  console.log("    c: about to return");
}

a();

// Stack trace (top = most recent):
// 1. [global] — always at the bottom
// 2. [global] → a()  — a is pushed
// 3. [global] → a() → b()  — b is pushed on top
// 4. [global] → a() → b() → c()  — c is pushed on top
// 5. [global] → a() → b()  — c returns, is popped
// 6. [global] → a()  — b returns, is popped
// 7. [global]  — a returns, is popped


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Hoisting Prediction
// Access a var variable BEFORE the line where it is declared.
// Predict the output, then run it to confirm.
// Add a comment below explaining WHY the output is `undefined` and not a ReferenceError.

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Three-Level Call Stack
// Write three functions: outer, middle, and inner.
// - outer calls middle, middle calls inner
// - Each function logs when it is entered and when it is about to return
// After writing the code, add comments showing the call stack state at each step.

// Write your code here:
