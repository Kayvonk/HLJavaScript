# Activity 18: Symbols and Well-Known Symbols

## Overview
`Symbol()` creates a **guaranteed-unique primitive** — no two Symbol values are ever equal. This makes Symbols perfect for property keys that must not collide with other code's properties. The global **Symbol registry** (`Symbol.for()`) allows sharing Symbols across code units. **Well-known Symbols** like `Symbol.iterator` and `Symbol.toPrimitive` are hooks that let you customize built-in JavaScript behaviors for your objects.

## Learning Objectives
- Explain why Symbols are guaranteed unique and how this prevents property key collisions
- Use `Symbol.for()` and `Symbol.keyFor()` to work with the global Symbol registry
- Use well-known Symbols to customize object behavior (`Symbol.toPrimitive`, `Symbol.iterator`)
- Demonstrate that Symbol-keyed properties are hidden from `Object.keys()` but visible to `Object.getOwnPropertySymbols()`

## Instructions

Study both working examples in `script.js`. The first shows Symbol uniqueness and the global registry. The second shows `Symbol.toPrimitive` customizing type conversion. Then complete the TODOs.

### TODO 1 — Collision-Free Property Keys
Create two separate objects that both logically want an `id` property — use a `Symbol("id")` as the key on each to prevent collision. Show that `Object.keys()` does not reveal the Symbol key, but `Object.getOwnPropertySymbols()` does.

> **Hint:**
> ```js
> const ID = Symbol("id");
> const user = { name: "Alice", [ID]: 1 };
> ```
> `Object.keys(user)` returns `["name"]` — the Symbol key is invisible to enumeration.
> `Object.getOwnPropertySymbols(user)` returns `[Symbol(id)]` — the only way to see it.
> Note: two objects each with their own `Symbol("id")` have *different* symbols — they don't share the same key.

### TODO 2 — Make a Plain Object Iterable with Symbol.iterator
Add `Symbol.iterator` to a plain object `colorPalette` that has properties `primary`, `secondary`, and `accent`. Make it iterable so `for...of` yields each color value in order.

> **Hint:** `Symbol.iterator` should be a method that returns an iterator object. The simplest approach: convert the values you want to yield into an array inside the method, then return that array's iterator:
> ```js
> const colorPalette = {
>   primary: "blue",
>   secondary: "green",
>   accent: "orange",
>   [Symbol.iterator]() {
>     const values = [this.primary, this.secondary, this.accent];
>     return values[Symbol.iterator](); // delegate to Array's built-in iterator
>   }
> };
> ```

## What You Learned
- `Symbol()` always creates a unique value — even `Symbol("id") !== Symbol("id")`
- `Symbol.for("key")` creates/retrieves from a global registry — two calls with the same string return the same Symbol
- Symbol-keyed properties are non-enumerable by default — invisible to `Object.keys`, `for...in`, and `JSON.stringify`
- Well-known Symbols are engine hooks — implementing them on your objects customizes JavaScript's built-in behaviors

## Stretch Challenges
1. Implement `Symbol.toPrimitive` on a custom `Vector` class so that `vector + 5` adds 5 to the vector's magnitude and `String(vector)` returns a readable representation
2. Research `Symbol.hasInstance` — implement it on a class to customize how `instanceof` behaves
3. Explore `Symbol.species` — research why it exists and write an example showing how it affects `Array.prototype.map` when called on a subclass of Array
