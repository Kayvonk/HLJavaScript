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

// The + operator concatenates when either operand is a string post-ToPrimitive;
// -, *, / always coerce via ToNumber. == triggers coercion via the abstract
// equality algorithm (null == undefined is a special-cased pair).
console.log(0 == false);         // predicted: true   — false → 0, 0 == 0
console.log("" == false);        // predicted: true   — both coerce to 0 via ToNumber
console.log(null == undefined);  // predicted: true   — spec special-cases this pair
console.log(null == 0);          // predicted: false  — null only == undefined, no ToNumber
console.log(NaN == NaN);         // predicted: false  — NaN is never equal to anything
console.log("5" * 2);            // predicted: 10     — * forces ToNumber on "5"
console.log(+"42");              // predicted: 42     — unary + is ToNumber
console.log(+true);              // predicted: 1      — ToNumber(true) = 1
console.log([1] + [2]);          // predicted: "12"   — arrays → "1" and "2", then concat
console.log(1 + 2 + "3");        // predicted: "33"   — left-to-right: (1+2)=3, 3+"3"="33"



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Fraction Class with valueOf
// Write a Fraction class with:
//   - constructor(numerator, denominator)
//   - valueOf() returning numerator / denominator
//   - toString() returning "numerator/denominator"
// Show that new Fraction(1, 2) + new Fraction(1, 4) produces 0.75.
// Also show that `${new Fraction(3, 4)}` produces "3/4".

// Write your code here:
// ToPrimitive with the "number" hint (triggered by +) calls valueOf() first;
// with the "string" hint (template literal) it calls toString() first. Defining
// both lets one object serve numeric AND string contexts naturally.
class Fraction {
  constructor(numerator, denominator) {
    this.numerator   = numerator;
    this.denominator = denominator;
  }
  valueOf()  { return this.numerator / this.denominator; }
  toString() { return `${this.numerator}/${this.denominator}`; }
}

console.log("\n--- TODO 2: Fraction ---");
console.log(new Fraction(1, 2) + new Fraction(1, 4)); // 0.75 (valueOf → numeric add)
console.log(`${new Fraction(3, 4)}`);                 // "3/4" (toString → string hint)
