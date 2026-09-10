# Activity 29: Type Coercion

## Overview
JavaScript's type system is **dynamic and weakly typed** — values are automatically converted between types when an operation requires a different type. This **implicit coercion** follows rules defined in the ECMAScript spec via abstract operations: `ToPrimitive`, `ToBoolean`, `ToNumber`, and `ToString`. Most JavaScript bugs involving coercion come from not knowing these rules — and most surprising `==` results come from the same place.

## Learning Objectives
- Describe the `ToPrimitive`, `ToBoolean`, `ToNumber`, and `ToString` abstract operations
- Predict the output of common implicit coercion expressions
- Explain the dual nature of the `+` operator (addition vs. string concatenation)
- Use `valueOf()` to customize how an object converts to a primitive

## Instructions

Study the coercion table and the `ToPrimitive` examples in `script.js`. The goal is to internalize the rules, not memorize every case. Then complete the TODOs.

### TODO 1 — Predict and Verify
Ten coercion expressions are provided in `script.js` as commented-out `console.log` calls. Before uncommenting them, write your predicted output next to each one as a comment. Then uncomment them and run the file to verify. Add a comment next to any that surprised you explaining the rule that produced the result.

> **Hint:** Apply the rules in order:
> - `+` with a string on either side → concatenation (both coerced to string first via `ToString`)
> - `-`, `*`, `/` → numeric (both coerced via `ToNumber`)
> - `ToNumber([])` is `0`, `ToNumber("")` is `0`, `ToNumber(null)` is `0`, `ToNumber(undefined)` is `NaN`
> - `ToString([])` is `""`, `ToString({})` is `"[object Object]"`
> Study Example 1 in `script.js` first — it has the most common surprises annotated.

### TODO 2 — Fraction Class with valueOf
Write a class `Fraction` with `numerator` and `denominator` properties. Add a `valueOf()` method that returns the numeric result (`numerator / denominator`), and a `toString()` method that returns `"n/d"` format. Show that `new Fraction(1, 2) + new Fraction(1, 4)` produces `0.75` via `valueOf`.

> **Hint:**
> ```js
> class Fraction {
>   constructor(n, d) { this.numerator = n; this.denominator = d; }
>   valueOf() { return this.numerator / this.denominator; }
>   toString() { return `${this.numerator}/${this.denominator}`; }
> }
> ```
> When you use `+` between two `Fraction` objects, JavaScript calls `ToPrimitive` on each. `ToPrimitive` with a "number" hint calls `valueOf()` first. Both fractions convert to numbers, then numeric addition happens.

## What You Learned
- JavaScript coerces values automatically when an operator requires a specific type
- The `+` operator is overloaded: if either operand is a string after `ToPrimitive`, it concatenates
- `ToPrimitive` checks `valueOf()` then `toString()` (for numeric hint) — you can customize this
- Understanding coercion rules removes the "magic" from surprising `+` and comparison results

## Stretch Challenges
1. Research the full `ToPrimitive` abstract operation in the ECMAScript spec — what is the "hint" parameter and what are its three possible values?
2. Write an object that has both `valueOf()` and `Symbol.toPrimitive` defined — verify that `Symbol.toPrimitive` takes precedence
3. Create a `BigInt` and attempt to add it to a regular number — observe the error and explain why JavaScript does not auto-coerce between `number` and `bigint`
