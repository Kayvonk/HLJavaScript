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
// SameValue algorithm reimplemented: NaN is the only value where x !== x
// is true, so we detect it via self-comparison. +0 and -0 are === but
// 1/+0 (Infinity) !== 1/-0 (-Infinity), which is how we distinguish signed zeros.
function strictSameValue(a, b) {
  if (a !== a) return b !== b;                 // NaN case
  if (a === 0 && b === 0) return 1 / a === 1 / b; // ±0 case
  return a === b;                              // everything else
}

console.log("\n--- TODO 1: strictSameValue ---");
console.log(strictSameValue(NaN, NaN));      // true
console.log(strictSameValue(+0, -0));        // false
console.log(strictSameValue(1, 1));          // true
console.log(strictSameValue("a", "a"));      // true
console.log(strictSameValue({}, {}));        // false — different references
// Cross-check with Object.is
console.log(strictSameValue(NaN, NaN) === Object.is(NaN, NaN)); // true
console.log(strictSameValue(+0, -0) === Object.is(+0, -0));     // true


// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: SameValueZero in Set
// 1. Create a Set and add NaN to it.
// 2. Check set.has(NaN) — explain why it returns true despite NaN !== NaN.
// 3. Add both +0 and -0 to a Set and log the set's size — explain the result.
// Add comments for both observations explaining the SameValueZero algorithm.

// Write your code here:
// Set / Map / Array.includes use the SameValueZero algorithm: like === but
// NaN is considered equal to itself. Unlike Object.is (SameValue), it treats
// +0 and -0 as equal — the "Zero" in the name refers to this collapsing.
console.log("\n--- TODO 2: SameValueZero in Set ---");

const nanSet = new Set();
nanSet.add(NaN);
// set.has(NaN) is true because SameValueZero specifically treats NaN as
// equal to NaN, even though the === operator does not.
console.log("nanSet.has(NaN):", nanSet.has(NaN)); // true

const zeroSet = new Set();
zeroSet.add(+0);
zeroSet.add(-0);
// Size is 1 because SameValueZero treats +0 and -0 as the same key —
// only the first zero is stored; -0 is considered already-present.
console.log("zeroSet.size:", zeroSet.size);       // 1
