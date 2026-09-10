// ─── Dynamic Typing Pitfalls ──────────────────────────────────────────────────

// EXAMPLE 1: typeof edge cases
console.log("--- Example 1: typeof edge cases ---");

console.log(typeof null);           // "object" — historical bug (not "null")
console.log(typeof undefined);      // "undefined"
console.log(typeof 42);             // "number"
console.log(typeof "hello");        // "string"
console.log(typeof true);           // "boolean"
console.log(typeof Symbol());       // "symbol"
console.log(typeof 42n);            // "bigint"
console.log(typeof function(){});   // "function" — special case
console.log(typeof {});             // "object"
console.log(typeof []);             // "object" — NOT "array"!

// Safe null check:
const val = null;
console.log(val === null);          // true — correct way to check for null


// ─── EXAMPLE 2: NaN pitfalls ─────────────────────────────────────────────────
console.log("\n--- Example 2: NaN detection ---");

// Global isNaN() coerces before checking — very misleading
console.log(isNaN("hello"));       // true  — "hello" coerced to NaN first
console.log(isNaN(undefined));     // true  — undefined coerced to NaN
console.log(isNaN("123"));         // false — "123" coerced to 123

// Number.isNaN() does NOT coerce — only true for actual NaN
console.log(Number.isNaN(NaN));    // true  — correct
console.log(Number.isNaN("hello")); // false — no coercion, "hello" is not NaN
console.log(Number.isNaN(undefined)); // false — undefined is not NaN

// Similarly, Number.isFinite() is safer than global isFinite():
console.log(isFinite("123"));       // true  — coerces "123" to 123 first
console.log(Number.isFinite("123")); // false — no coercion, string is not finite


// ─── EXAMPLE 3: instanceof pitfalls and better alternatives ──────────────────
console.log("\n--- Example 3: instanceof alternatives ---");

console.log([] instanceof Array);   // true (in same realm)
console.log(Array.isArray([]));     // true — works across realms too

// instanceof fails on primitives:
try {
  console.log("hello" instanceof String); // false — primitive, not String object
} catch (e) {
  console.error(e.message);
}

// Object.prototype.toString — most reliable type detection:
function rawType(v) {
  return Object.prototype.toString.call(v);
}
console.log(rawType([]));          // "[object Array]"
console.log(rawType(null));        // "[object Null]"
console.log(rawType(/regex/));     // "[object RegExp]"
console.log(rawType(new Date())); // "[object Date]"
console.log(rawType(new Map()));  // "[object Map]"


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: safeParseInt
// Write safeParseInt(value) that returns null if value cannot be parsed to a
// finite integer. Return the integer if it can.
// Use Number.isFinite() and Number.isInteger().
// Test with: "42", "3.7", "abc", null, undefined, Infinity, NaN, true.

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: getType
// Write getType(value) using Object.prototype.toString.call(value) that returns
// precise lowercase type strings: "null", "array", "date", "regexp", etc.
// Test with: null, undefined, [], {}, new Date(), /regex/, 42, "str", () => {}.

// Write your code here:
