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
console.log("\n--- TODO 1: Hoisting Prediction ---");

// During the creation phase, the engine scans the scope for `var` declarations
// and binds each identifier to `undefined` BEFORE any code executes.
// So `favoriteNumber` already exists as a slot in memory — it just has no value yet.
console.log(favoriteNumber); // undefined — the binding exists, the assignment has not run
var favoriteNumber = 42;
console.log(favoriteNumber); // 42 — assignment ran on this line

// WHY undefined and not ReferenceError:
// A ReferenceError means "this identifier is not declared anywhere in the scope chain."
// Because `var` is hoisted at creation phase, the identifier IS declared — just
// uninitialized in the source sense. The engine returns its pre-assigned value: undefined.


// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Three-Level Call Stack
// Write three functions: outer, middle, and inner.
// - outer calls middle, middle calls inner
// - Each function logs when it is entered and when it is about to return
// After writing the code, add comments showing the call stack state at each step.

// Write your code here:
console.log("\n--- TODO 2: Three-Level Call Stack ---");

// Each function invocation creates a new execution context that is pushed
// onto the call stack. The stack is LIFO — the last one pushed is the first popped.
function outer() {
  console.log("outer: entered");
  middle();
  console.log("outer: about to return");
}

function middle() {
  console.log("  middle: entered");
  inner();
  console.log("  middle: about to return");
}

function inner() {
  console.log("    inner: entered");
  console.log("    inner: about to return");
}

outer();

// Call stack state at each step:
// 1. [global]                              — before outer() is called
// 2. [global] → outer()                    — outer pushed, logs "entered"
// 3. [global] → outer() → middle()         — middle pushed, logs "entered"
// 4. [global] → outer() → middle() → inner() — inner pushed, logs both messages
// 5. [global] → outer() → middle()         — inner returns and is popped
// 6. [global] → outer()                    — middle returns and is popped
// 7. [global]                              — outer returns and is popped
