// ─── WeakMap, WeakSet, and WeakRef ────────────────────────────────────────────

// EXAMPLE 1: WeakMap for private per-instance data
console.log("--- Example 1: WeakMap private data ---");

// Private data store — keyed by instance, not accessible from outside
const _private = new WeakMap();

class SecureBox {
  constructor(secret) {
    _private.set(this, { secret, accessCount: 0 });
  }

  open(password) {
    const data = _private.get(this);
    data.accessCount++;
    if (password === data.secret) {
      console.log(`Opened! Accessed ${data.accessCount} time(s).`);
      return true;
    }
    console.log("Wrong password.");
    return false;
  }
}

const box = new SecureBox("hunter2");
box.open("wrong");    // Wrong password.
box.open("hunter2");  // Opened! Accessed 2 time(s).

// The private data is inaccessible directly:
console.log("box._private:", box._private);  // undefined
// When `box` goes out of scope, _private's entry is eligible for GC automatically.


// ─── EXAMPLE 2: WeakRef for an opt-in cache ───────────────────────────────────
console.log("\n--- Example 2: WeakRef cache ---");

// A cache that doesn't prevent GC of cached objects
const cache = new WeakMap();

function getOrCompute(key, computeFn) {
  const existing = cache.get(key);
  if (existing !== undefined) {
    console.log("  cache hit");
    return existing;
  }
  console.log("  cache miss — computing");
  const value = computeFn();
  cache.set(key, value);
  return value;
}

const keyObj = { id: 1 };
getOrCompute(keyObj, () => "expensive result");  // cache miss
getOrCompute(keyObj, () => "expensive result");  // cache hit


// ─── EXAMPLE 3: WeakSet for "seen" tracking ───────────────────────────────────
console.log("\n--- Example 3: WeakSet membership ---");

const seen = new WeakSet();

function process(obj) {
  if (seen.has(obj)) {
    console.log("already seen:", obj.id);
    return;
  }
  console.log("processing:", obj.id);
  seen.add(obj);
}

const item1 = { id: "a" };
const item2 = { id: "b" };

process(item1); // processing: a
process(item1); // already seen: a
process(item2); // processing: b


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Per-Object Visit Counter
// Use a WeakMap to implement a visit counter.
// Write recordVisit(obj) that increments the counter for that object.
// Write getVisitCount(obj) that returns the current count.
// Test: call recordVisit 3 times on one object and log the count after each call.

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Processed Objects Set
// Create a WeakSet to track processed objects.
// Write process(obj) that:
//   - logs "already processed" if obj is in the set
//   - otherwise logs the object's contents and adds it to the set
// Test: call process() twice with the same object and once with a different object.

// Write your code here:
