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
console.log("\n--- TODO 1: EventBus IIFE Module ---");

// IIFE encapsulation: the immediately-invoked function creates a fresh scope
// that only the returned object's methods can access via closure. `listeners`
// is unreachable from outside — a true private field before class-private #.
const EventBus = (() => {
  const listeners = new Map();

  function on(event, fn) {
    if (!listeners.has(event)) listeners.set(event, []);
    listeners.get(event).push(fn);
  }

  function off(event, fn) {
    const fns = listeners.get(event);
    if (!fns) return;
    listeners.set(event, fns.filter(f => f !== fn));
  }

  function emit(event, data) {
    const fns = listeners.get(event) ?? [];
    fns.forEach(fn => fn(data));
  }

  return { on, off, emit };
})();

const onLoginA = data => console.log("A: login for", data.userId);
const onLoginB = data => console.log("B: login for", data.userId);

EventBus.on("userLogin", onLoginA);
EventBus.on("userLogin", onLoginB);
EventBus.emit("userLogin", { userId: 1 });   // both fire

EventBus.off("userLogin", onLoginA);
EventBus.emit("userLogin", { userId: 2 });   // only B fires

console.log("EventBus.listeners:", EventBus.listeners); // undefined — private



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: ES Module Export Conversion (Syntax Example)
// Write the EventBus as it would look in an ES module file.
// No IIFE — just top-level declarations and named exports.
// Add a comment explaining why this is equivalent to the IIFE pattern.
//
// Note: this is a syntax example — mark it with the comment below.
// In a real ES module file (.mjs or package with "type":"module"):

// Write your code here (as commented-out ES module syntax or in a block comment):
console.log("\n--- TODO 2: ES Module syntax example (comment-only) ---");

/*
  In a real ES module file (.mjs or a package with "type": "module"), the
  file's top-level scope IS already private — nothing leaks to the global
  object, and only names decorated with `export` are visible to importers.
  That is exactly what an IIFE simulates manually with a function scope: the
  IIFE's inner variables are hidden, the returned object is the public API.
  In ES modules, the file's own top-level bindings are hidden, and the
  exported names are the public API.

  // ---- EventBus.mjs ----
  const listeners = new Map();

  export function on(event, fn) {
    if (!listeners.has(event)) listeners.set(event, []);
    listeners.get(event).push(fn);
  }

  export function off(event, fn) {
    const fns = listeners.get(event);
    if (!fns) return;
    listeners.set(event, fns.filter(f => f !== fn));
  }

  export function emit(event, data) {
    const fns = listeners.get(event) ?? [];
    fns.forEach(fn => fn(data));
  }
  // `listeners` is NOT exported — importers cannot see it, just like the
  // IIFE version. Encapsulation is enforced by the module boundary itself.

  // ---- consumer.mjs ----
  // import { on, emit } from "./EventBus.mjs";
*/
