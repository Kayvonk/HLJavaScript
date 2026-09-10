// ─── Type Coercion ────────────────────────────────────────────────────────────

// EXAMPLE 1: Classic coercion surprises — read the comments before running
console.log("--- Example 1: Common coercion results ---");

console.log(1 + "2");          // "12"  — + with a string = concatenation
console.log("3" - 1);          // 2     — - always numeric, "3" → 3
console.log(true + true);      // 2     — ToNumber(true) = 1
console.log(false + 1);        // 1     — ToNumber(false) = 0
console.log(null + 1);         // 1     — ToNumber(null) = 0
console.log(undefined + 1);    // NaN   — ToNumber(undefined) = NaN
console.log("" + 0);           // "0"   — + with string = concat, ToString(0) = "0"
console.log([] + []);          // ""    — ToString([]) = "", concat = ""
console.log([] + {});          // "[object Object]"
console.log({} + []);          // "[object Object]" (when in expression context)

// Truthy/falsy: ToBoolean
console.log("\n--- Truthy/Falsy ---");
// Falsy: false, 0, -0, 0n, "", '', ``, null, undefined, NaN
// Everything else is truthy (including [], {}, "0", -1)
console.log(Boolean(0));         // false
console.log(Boolean(""));        // false
console.log(Boolean(null));      // false
console.log(Boolean([]));        // true  — empty array is truthy!
console.log(Boolean({}));        // true  — empty object is truthy!
console.log(Boolean("0"));       // true  — non-empty string is truthy!


// ─── EXAMPLE 2: ToPrimitive — custom valueOf ──────────────────────────────────
console.log("\n--- Example 2: Custom valueOf ---");

class Money {
  constructor(amount, currency) {
    this.amount   = amount;
    this.currency = currency;
  }
  valueOf()  { return this.amount; }          // numeric hint
  toString() { return `${this.currency}${this.amount.toFixed(2)}`; }
}

const price   = new Money(9.99, "$");
const tax     = new Money(0.80, "$");
const total   = price + tax;
console.log("total:", total);               // 10.79 (number — valueOf used)
console.log(`Price: ${price}`);             // "Price: $9.99" (string hint — toString used)
console.log(price > 5);                     // true (comparison uses valueOf)


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Predict and Verify
// Below are 10 coercion expressions. BEFORE uncommenting them:
//   - Write your predicted output as a comment next to each line
// Then uncomment and run. Add an explanation next to any that surprised you.

// console.log(0 == false);         // predicted: ___
// console.log("" == false);        // predicted: ___
// console.log(null == undefined);  // predicted: ___
// console.log(null == 0);          // predicted: ___
// console.log(NaN == NaN);         // predicted: ___
// console.log("5" * 2);            // predicted: ___
// console.log(+"42");              // predicted: ___
// console.log(+true);              // predicted: ___
// console.log([1] + [2]);          // predicted: ___
// console.log(1 + 2 + "3");        // predicted: ___



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Fraction Class with valueOf
// Write a Fraction class with:
//   - constructor(numerator, denominator)
//   - valueOf() returning numerator / denominator
//   - toString() returning "numerator/denominator"
// Show that new Fraction(1, 2) + new Fraction(1, 4) produces 0.75.
// Also show that `${new Fraction(3, 4)}` produces "3/4".

// Write your code here:
