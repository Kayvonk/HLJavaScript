// ─── The Decorator Pattern ────────────────────────────────────────────────────

// EXAMPLE 1: memoize — cache results by serialized arguments
console.log("--- Example 1: memoize decorator ---");

function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Slow recursive fibonacci (exponential without memoization)
function slowFib(n) {
  if (n <= 1) return n;
  return slowFib(n - 1) + slowFib(n - 2);
}

const fastFib = memoize(function fib(n) {
  if (n <= 1) return n;
  return fastFib(n - 1) + fastFib(n - 2);
});

const t1 = performance.now();
console.log("fib(40):", fastFib(40)); // 102334155
console.log(`memoized time: ${(performance.now() - t1).toFixed(2)}ms`);


// ─── EXAMPLE 2: withRetry — retry a failing async operation ──────────────────
console.log("\n--- Example 2: withRetry decorator ---");

function withRetry(fn, maxAttempts = 3) {
  return async function (...args) {
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn(...args);
      } catch (err) {
        lastError = err;
        const delay = attempt * 100;
        console.log(`  attempt ${attempt} failed — retrying in ${delay}ms`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
    throw lastError; // all attempts exhausted
  };
}

let callCount = 0;
async function flakyFetch() {
  callCount++;
  if (callCount < 3) throw new Error("network error");
  return "success";
}

const robustFetch = withRetry(flakyFetch, 3);
robustFetch()
  .then(result => console.log("robustFetch result:", result))
  .catch(err => console.error("robustFetch failed:", err.message));


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: withLogging
// Write withLogging(fn, name) that returns a new function.
// Before calling fn: log "calling [name] with [args]"
// After calling fn: log "[name] returned [result]"
// Apply it to add(a, b) => a + b and call the decorated version twice.

// Write your code here:
console.log("\n--- TODO 1: withLogging ---");

// A decorator is a function that takes a function and returns a new function
// with extra behavior wrapped around the original call. The original `fn` is
// never modified — Open/Closed Principle applied to functions.
function withLogging(fn, name) {
  return function (...args) {
    console.log(`calling ${name} with`, args);
    const result = fn(...args);
    console.log(`${name} returned`, result);
    return result;
  };
}

const add = (a, b) => a + b;
const loggedAdd = withLogging(add, "add");

loggedAdd(3, 4);
loggedAdd(10, 20);



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: throttle
// Write throttle(fn, limitMs) that ensures fn is called at most once per limitMs.
// Calls within the cooldown period are silently ignored.
// Test: create a throttled function with limitMs=200.
// Schedule 5 calls at 0, 50, 100, 150, and 200ms using setTimeout.
// Add a comment predicting which calls will fire.

// Write your code here:
console.log("\n--- TODO 2: throttle ---");

// Throttle uses a closed-over `lastCalled` timestamp to remember the most
// recent successful invocation. Calls arriving before `limitMs` has elapsed
// are silently dropped — great for rate-limiting scroll/resize handlers.
function throttle(fn, limitMs) {
  let lastCalled = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCalled >= limitMs) {
      lastCalled = now;
      return fn(...args);
    }
    // otherwise: drop the call
  };
}

const throttledLog = throttle(label => {
  console.log(`  throttled fire: ${label} @ ${Date.now() - startAt}ms`);
}, 200);

// Prediction with limitMs=200 and calls at 0, 50, 100, 150, 200ms:
//   t=0   → fires (first ever call)
//   t=50  → dropped (only 50ms since last)
//   t=100 → dropped (100ms since last)
//   t=150 → dropped (150ms since last)
//   t=200 → fires (>=200ms since last)
const startAt = Date.now();
[0, 50, 100, 150, 200].forEach(delay => {
  setTimeout(() => throttledLog(`call@${delay}`), delay);
});
