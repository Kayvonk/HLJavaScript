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
console.log("\n--- TODO 1: Bank Account Factory ---");

// `balance` lives in makeBankAccount's activation record. The returned methods
// all close over that same binding, so they share state. Nothing outside the
// returned object can reach `balance` — that's data hiding via closure.
function makeBankAccount(initialBalance) {
  let balance = initialBalance;

  return {
    deposit(amount) {
      balance += amount;
    },
    withdraw(amount) {
      // Guard against negative balances — reject the full amount if not enough.
      if (amount > balance) {
        console.log(`  (withdraw ${amount} rejected — insufficient funds)`);
        return;
      }
      balance -= amount;
    },
    getBalance() {
      return balance;
    }
  };
}

const account = makeBankAccount(100);
console.log("start:", account.getBalance()); // 100

account.deposit(50);
console.log("after deposit 50:", account.getBalance()); // 150

account.withdraw(30);
console.log("after withdraw 30:", account.getBalance()); // 120

account.withdraw(9999); // rejected — would drop below 0
console.log("after failed withdraw:", account.getBalance()); // 120

// `balance` is private — it lives only in the closure, not as a property.
console.log("account.balance is:", account.balance); // undefined


// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Logger Factory
// Write makeLogger(prefix) that returns a logging function.
// When the returned function is called with a message, it logs: "[prefix] message"
// Create two loggers with different prefixes and call each — verify they are independent.

// Write your code here:
console.log("\n--- TODO 2: Logger Factory ---");

// Each call to makeLogger creates a new lexical environment. The returned
// arrow function closes over THIS call's `prefix`, so two loggers never
// interfere with each other — independent closures, independent state.
function makeLogger(prefix) {
  return (message) => console.log(`[${prefix}] ${message}`);
}

const infoLog = makeLogger("INFO");
const errorLog = makeLogger("ERROR");

infoLog("server started");        // [INFO] server started
errorLog("connection refused");   // [ERROR] connection refused
infoLog("request handled");       // [INFO] request handled — still uses "INFO"
