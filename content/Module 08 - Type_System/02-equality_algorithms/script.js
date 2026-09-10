// ─── Equality Algorithms ──────────────────────────────────────────────────────

// EXAMPLE 1: Abstract equality (==) — with coercion
console.log("--- Example 1: Abstract equality (==) ---");

// Special case: null == undefined (and nothing else)
console.log(null == undefined);  // true   — special rule in the spec
console.log(null == 0);          // false  — null only == undefined
console.log(null == false);      // false  — same

// String <-> Number: the string is converted to a number
console.log("1" == 1);           // true   — "1" → 1
console.log("0" == false);       // true   — "0" → 0, false → 0
console.log("" == false);        // true   — "" → 0, false → 0
console.log(" " == 0);           // true   — " " → 0 (whitespace trims)

// Object vs primitive: ToPrimitive is called on the object
console.log([1] == 1);           // true   — [1] → "1" → 1
console.log([] == false);        // true   — [] → "" → 0, false → 0
console.log([] == ![]);          // true   (famous puzzle — ![] = false, [] == false = true)


// ─── EXAMPLE 2: Strict equality (===) edge cases ─────────────────────────────
console.log("\n--- Example 2: Strict equality edge cases ---");

// NaN is the only value not equal to itself
console.log(NaN === NaN);        // false  — the famous quirk
console.log(NaN !== NaN);        // true

// +0 and -0 are === equal but Object.is distinguishes them
console.log(+0 === -0);          // true
console.log(Object.is(+0, -0)); // false  — different values

// Object.is for NaN
console.log(Object.is(NaN, NaN)); // true  — correctly handles NaN

// Practical use case: Redux/React change detection uses Object.is
// to tell if a value actually changed:
function hasChanged(prev, next) {
  return !Object.is(prev, next);
}
console.log("hasChanged(NaN, NaN):", hasChanged(NaN, NaN)); // false — same value
console.log("hasChanged(+0, -0):", hasChanged(+0, -0));    // true — different values!


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: strictSameValue
// Write strictSameValue(a, b) without using Object.is() that:
//   - returns true for (NaN, NaN)
//   - returns false for (+0, -0)
//   - returns the same as === for all other values
// Then verify your function against Object.is() for the edge cases.

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: SameValueZero in Set
// 1. Create a Set and add NaN to it.
// 2. Check set.has(NaN) — explain why it returns true despite NaN !== NaN.
// 3. Add both +0 and -0 to a Set and log the set's size — explain the result.
// Add comments for both observations explaining the SameValueZero algorithm.

// Write your code here:
