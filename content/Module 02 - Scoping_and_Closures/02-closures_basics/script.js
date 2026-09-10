// ─── Closures: Data Hiding and Factory Functions ─────────────────────────────

// EXAMPLE 1: Counter with private state
// The 'count' variable is private — only accessible through the returned methods.
console.log("--- Example 1: Counter factory ---");

function makeCounter(startAt = 0) {
  let count = startAt; // private — not accessible outside

  return {
    increment() { count++; },
    decrement() { count--; },
    reset()     { count = startAt; },
    getCount()  { return count; }
  };
}

const counterA = makeCounter();
const counterB = makeCounter(10);

counterA.increment();
counterA.increment();
counterA.increment();
console.log("counterA:", counterA.getCount()); // 3
console.log("counterA.count:", counterA.count); // undefined — truly private

counterB.decrement();
console.log("counterB:", counterB.getCount()); // 9

// Each factory call creates an independent closure — counterA and counterB
// do NOT share the 'count' variable.


// ─── EXAMPLE 2: Multiplier factory ───────────────────────────────────────────
console.log("\n--- Example 2: Multiplier factory ---");

function makeMultiplier(factor) {
  // 'factor' is captured by the returned function's closure
  return (number) => number * factor;
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);
const tenX   = makeMultiplier(10);

console.log(double(5));  // 10
console.log(triple(5));  // 15
console.log(tenX(5));    // 50

// 'double', 'triple', and 'tenX' are three independent closures,
// each capturing a different 'factor' value.


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Bank Account Factory
// Write makeBankAccount(initialBalance) that closes over a private 'balance'.
// Return an object with: deposit(amount), withdraw(amount), getBalance().
// - deposit adds to balance
// - withdraw subtracts, but balance should never go below 0
// - getBalance returns the current balance
// Test with at least 3 operations and log the balance after each.
// Verify that account.balance is undefined (the variable is private).

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Logger Factory
// Write makeLogger(prefix) that returns a logging function.
// When the returned function is called with a message, it logs: "[prefix] message"
// Create two loggers with different prefixes and call each — verify they are independent.

// Write your code here:
