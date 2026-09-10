// ─── The Module Pattern ───────────────────────────────────────────────────────

// EXAMPLE 1: IIFE module — ShoppingCart with private state
console.log("--- Example 1: IIFE module ---");

const ShoppingCart = (() => {
  // private — not accessible outside
  let items = [];
  let nextId = 1;

  return {
    add(name, price) {
      items.push({ id: nextId++, name, price });
      console.log(`Added: ${name} ($${price})`);
    },
    remove(id) {
      items = items.filter(item => item.id !== id);
      console.log(`Removed item ${id}`);
    },
    total() {
      return items.reduce((sum, item) => sum + item.price, 0);
    },
    list() {
      return [...items]; // return a copy — prevent external mutation
    }
  };
})();

ShoppingCart.add("Coffee", 4.50);
ShoppingCart.add("Bagel", 2.75);
console.log("total:", ShoppingCart.total().toFixed(2));  // 7.25
console.log("items:", ShoppingCart.list().map(i => i.name));

// Private state is inaccessible:
console.log("ShoppingCart.items:", ShoppingCart.items); // undefined


// ─── EXAMPLE 2: Revealing module — same logic, explicit exposure ──────────────
console.log("\n--- Example 2: Revealing module ---");

const Counter = (() => {
  let count = 0;

  function increment()      { count++; }
  function decrement()      { count--; }
  function reset()          { count = 0; }
  function getCount()       { return count; }
  function isPositive()     { return count > 0; }

  // Only these names are revealed:
  return { increment, decrement, reset, getCount };
  // isPositive is NOT revealed — it is private helper logic
})();

Counter.increment();
Counter.increment();
Counter.increment();
Counter.decrement();
console.log("count:", Counter.getCount()); // 2
console.log("Counter.isPositive:", Counter.isPositive); // undefined — private


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: EventBus IIFE Module
// Create an IIFE-based EventBus with:
//   - private listeners Map (or object)
//   - on(event, fn) — subscribe fn to event
//   - off(event, fn) — unsubscribe fn from event
//   - emit(event, data) — call all listeners for event with data
// Test: subscribe two listeners to "userLogin", emit the event, verify both fire.
// Then call off() to remove one and emit again — only one should fire.

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: ES Module Export Conversion (Syntax Example)
// Write the EventBus as it would look in an ES module file.
// No IIFE — just top-level declarations and named exports.
// Add a comment explaining why this is equivalent to the IIFE pattern.
//
// Note: this is a syntax example — mark it with the comment below.
// In a real ES module file (.mjs or package with "type":"module"):

// Write your code here (as commented-out ES module syntax or in a block comment):
