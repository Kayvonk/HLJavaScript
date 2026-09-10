// ─── Property Descriptors ─────────────────────────────────────────────────────

// EXAMPLE 1: Object.defineProperty() with full descriptor control
console.log("--- Example 1: Object.defineProperty ---");

const config = {};

Object.defineProperty(config, "MAX_RETRIES", {
  value: 3,
  writable: false,      // cannot be reassigned
  enumerable: true,     // shows up in Object.keys
  configurable: false   // descriptor cannot be changed; property cannot be deleted
});

Object.defineProperty(config, "internalId", {
  value: "abc-123",
  writable: false,
  enumerable: false,    // hidden from Object.keys, for...in, JSON.stringify
  configurable: false
});

console.log("config.MAX_RETRIES:", config.MAX_RETRIES); // 3
console.log("config.internalId:", config.internalId);   // "abc-123"
console.log("Object.keys(config):", Object.keys(config)); // ["MAX_RETRIES"] — internalId hidden

// Attempting to reassign in sloppy mode — silently fails
config.MAX_RETRIES = 99;
console.log("after reassign attempt:", config.MAX_RETRIES); // still 3

// Inspect the full descriptor
console.log("descriptor:", Object.getOwnPropertyDescriptor(config, "MAX_RETRIES"));
// { value: 3, writable: false, enumerable: true, configurable: false }


// ─── EXAMPLE 2: Object.freeze() vs Object.seal() ─────────────────────────────
console.log("\n--- Example 2: freeze vs seal ---");

const frozenObj = Object.freeze({ a: 1, b: 2 });
frozenObj.a = 99;    // silently ignored in sloppy mode
frozenObj.c = 3;     // silently ignored
delete frozenObj.b;  // silently ignored
console.log("frozenObj:", frozenObj); // { a: 1, b: 2 } — unchanged

const sealedObj = Object.seal({ x: 10, y: 20 });
sealedObj.x = 99;   // ALLOWED — existing values can still be changed
sealedObj.z = 30;   // silently ignored — new properties cannot be added
delete sealedObj.y; // silently ignored — properties cannot be deleted
console.log("sealedObj:", sealedObj); // { x: 99, y: 20 } — x was modified


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Non-Enumerable Property
// 1. Create an object 'settings' with a regular 'theme' property set to "dark".
// 2. Use Object.defineProperty() to add a 'version' property:
//    - readable (has a value)
//    - not writable
//    - not enumerable
// 3. Log Object.keys(settings) — version should NOT appear.
// 4. Log settings.version — it should still be readable.

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: freeze Behavior
// 1. Create an object with at least 2 properties.
// 2. Call Object.freeze() on it.
// 3. Attempt to: add a new property, modify an existing property, delete a property.
// 4. Log the object after each attempt.
// Add a comment next to each attempt explaining:
//   - what happens in sloppy mode (default)
//   - what would happen in strict mode ("use strict")

// Write your code here:
