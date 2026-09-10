# Activity 12: Property Descriptors

## Overview
Every property on a JavaScript object has a **property descriptor** — a set of attributes that control how the property behaves. The three key flags are `writable` (can the value be changed?), `enumerable` (does it show up in loops and `Object.keys`?), and `configurable` (can the descriptor itself be changed or the property deleted?). `Object.defineProperty()` lets you set these precisely. `Object.freeze()` and `Object.seal()` apply them in bulk.

## Learning Objectives
- Describe the three property descriptor flags: `writable`, `enumerable`, `configurable`
- Use `Object.defineProperty()` to create properties with specific descriptor settings
- Use `Object.getOwnPropertyDescriptor()` to inspect a property's descriptor
- Explain the difference between `Object.freeze()` (no changes at all) and `Object.seal()` (no add/delete, but values can change)

## Instructions

The working examples in `script.js` demonstrate `Object.defineProperty()` with full descriptor control, then `freeze` vs. `seal`. Study the output comments carefully. Then complete the TODOs.

### TODO 1 — Non-Enumerable Property
Create an object `settings` with a regular `theme` property. Use `Object.defineProperty()` to add a `version` property that is **readable** but **not writable** and **not enumerable**. Log `Object.keys(settings)` to show `version` does not appear in enumeration, then log `settings.version` to show it is still accessible.

> **Hint:**
> ```js
> Object.defineProperty(settings, "version", {
>   value: "1.0.0",
>   writable: false,
>   enumerable: false,
>   configurable: false
> });
> ```
> `Object.keys()` only returns enumerable string-keyed own properties — so `version` will be invisible to it. But `settings.version` still works because property access doesn't care about enumerability.

### TODO 2 — freeze vs. sloppy mode
Create an object, call `Object.freeze()` on it, then attempt to add a property, modify an existing property, and delete a property. Add a comment next to each attempt explaining whether it will succeed or silently fail in sloppy mode, and what happens in strict mode (`"use strict"`).

> **Hint:** In sloppy mode (the default in Node.js scripts without `"use strict"`), violations of `freeze` fail *silently* — no error is thrown and the change simply doesn't happen. In strict mode, violations throw a `TypeError`. Add a `"use strict"` directive at the top of a block to test the strict-mode behavior.

## What You Learned
- Property descriptors give fine-grained control over property behavior beyond just value assignment
- Non-enumerable properties are invisible to `Object.keys()`, `for...in`, and `JSON.stringify()` but still accessible by name
- `Object.freeze()` sets all properties to `writable: false, configurable: false` and prevents new properties
- `Object.seal()` prevents adding/deleting properties but still allows modifying existing writable values

## Stretch Challenges
1. Use `Object.defineProperty()` to create a **getter/setter** property — a `temperature` property that stores Celsius internally but exposes a Fahrenheit getter
2. Write a function `makeImmutable(obj)` that calls `Object.freeze()` shallowly and log what happens when you try to modify a nested object (explaining why `freeze` is shallow)
3. Research `Object.getOwnPropertyDescriptors()` (note the plural) — use it to copy an object including all property descriptor metadata, not just values
