# Activity 35: Metaprogramming with Reflect

## Overview
**Metaprogramming** is writing code that inspects or modifies other code at runtime. The `Reflect` API provides a complete set of low-level operations corresponding to every JavaScript fundamental behavior — `Reflect.get`, `Reflect.set`, `Reflect.defineProperty`, `Reflect.ownKeys`, etc. Unlike their Object counterparts, Reflect methods have consistent return values and work predictably with Proxies. Together, they enable observable objects, schema validators, and dynamic property systems.

## Learning Objectives
- Describe how `Reflect.ownKeys()` differs from `Object.keys()`, `Object.getOwnPropertyNames()`, and `Object.getOwnPropertySymbols()`
- Use `Reflect.defineProperty()` to add properties with controlled descriptors
- Build a schema-based validation proxy using `Reflect.set()` in the set trap
- Explain why Proxy traps should use `Reflect` methods rather than direct target operations

## Instructions

Study the `Reflect.ownKeys` comparison and the `observable()` factory in `script.js`. Notice how every Proxy trap delegates to the corresponding `Reflect` method. Then complete the TODOs.

### TODO 1 — defineHidden
Write a `defineHidden(obj, key, value)` utility using `Reflect.defineProperty()` that adds a non-enumerable, non-configurable property. Verify with `Reflect.ownKeys()` that the property appears (it lists ALL own keys including non-enumerable ones and Symbols), and with `Object.keys()` that it does not appear (only enumerable string keys).

> **Hint:**
> ```js
> function defineHidden(obj, key, value) {
>   Reflect.defineProperty(obj, key, {
>     value,
>     writable: false,
>     enumerable: false,
>     configurable: false
>   });
>   return obj;
> }
> ```
> After calling `defineHidden(obj, "version", "1.0")`:
> - `Reflect.ownKeys(obj)` includes `"version"` — it lists ALL own keys
> - `Object.keys(obj)` does NOT include `"version"` — only enumerable string keys

### TODO 2 — createValidator Proxy
Build a `createValidator(schema)` function that returns a Proxy. The `schema` is an object mapping property names to validator functions (returning `true`/`false`). The Proxy's `set` trap should check the incoming value against the schema — if the validator returns `false`, throw a `TypeError`; if it passes, use `Reflect.set()` to commit the value.

> **Hint:**
> ```js
> function createValidator(schema) {
>   return new Proxy({}, {
>     set(target, key, value) {
>       if (schema[key] && !schema[key](value)) {
>         throw new TypeError(`Validation failed for "${key}": ${JSON.stringify(value)}`);
>       }
>       return Reflect.set(target, key, value);
>     }
>   });
> }
> ```
> Create a schema: `{ age: v => typeof v === "number" && v > 0, name: v => typeof v === "string" }`. Test with valid and invalid values.

## What You Learned
- `Reflect.ownKeys()` returns ALL own keys: non-enumerable strings, enumerable strings, and Symbols
- `Reflect.defineProperty()` returns `true`/`false` instead of throwing — consistent for error handling
- Proxy set traps should use `Reflect.set()` to commit changes — it correctly handles prototype chains and setters
- Metaprogramming via Proxy + Reflect enables schema validation, observable objects, and access control at the object level

## Stretch Challenges
1. Extend `createValidator` to validate on `get` as well — throw if a required property hasn't been set yet
2. Build an `observable(obj)` factory using Proxy + Reflect that fires a registered `onChange(key, oldVal, newVal)` callback whenever any property changes
3. Research `Reflect.apply(fn, thisArg, args)` vs `fn.apply(thisArg, args)` — what is the difference in behavior for non-standard function objects?
