# Activity 19: Proxy and Reflect

## Overview
`Proxy` lets you intercept and redefine fundamental operations on objects — property reads, writes, deletions, `in` checks, and more. Each interception point is called a **trap**. The `Reflect` API provides the default behavior for every trap, making it easy to add custom logic while still delegating normally. Together, Proxy + Reflect enable validation layers, logging, virtual properties, and observable objects.

## Learning Objectives
- Describe what a Proxy trap is and list the most common traps (`get`, `set`, `has`, `deleteProperty`)
- Use `Reflect.get()` and `Reflect.set()` to delegate to default behavior inside traps
- Build a validation proxy that enforces type constraints on property assignments
- Build a `createReadOnly()` utility that makes any object immutable via a Proxy

## Instructions

Study the two working examples in `script.js` — a validation proxy and a read-tracking proxy. Notice how every trap calls its `Reflect` counterpart after the custom logic. Then complete the TODOs.

### TODO 1 — Case-Insensitive Config Proxy
Create a proxy around a configuration object that normalizes all property names to lowercase in both `get` and `set` traps. This way `config.Theme`, `config.theme`, and `config.THEME` all read and write the same underlying slot. Test with mixed-case reads and writes.

> **Hint:** In both the `get` and `set` traps, call `key.toLowerCase()` on the property key before delegating to `Reflect`:
> ```js
> get(target, key) {
>   return Reflect.get(target, key.toLowerCase());
> },
> set(target, key, value) {
>   return Reflect.set(target, key.toLowerCase(), value);
> }
> ```
> Start with an initial config: `{ theme: "dark", language: "en" }`. Then write `config.THEME = "light"` and verify `config.theme` is now `"light"`.

### TODO 2 — createReadOnly
Write a `createReadOnly(obj)` function that wraps any object in a Proxy where the `set` trap and `deleteProperty` trap always throw a `TypeError` with a descriptive message. Test it by attempting to modify and delete a property on a wrapped object.

> **Hint:** In a `set` trap, throw instead of delegating:
> ```js
> set(target, key) {
>   throw new TypeError(`Property "${key}" is read-only`);
> }
> ```
> Wrap the attempts in `try/catch` to show the error is thrown, then verify the object's original values are unchanged.

## What You Learned
- A Proxy wraps an object and intercepts operations via named trap functions in a handler object
- Always call the corresponding `Reflect` method inside traps to preserve default behavior — avoids subtle bugs
- `Proxy` is transparent to the wrapped object — the target sees all normal operations
- Proxy + Reflect enable cross-cutting concerns (validation, logging, access control) without modifying the target object

## Stretch Challenges
1. Build a "lazy evaluation" proxy — a `LazyObject` where property values are functions that compute the value on first access and cache the result, without the consumer knowing
2. Research the `apply` trap — write a proxy around a function that logs arguments and return values on every call
3. Research the `has` trap — write a proxy where `"key" in proxy` always returns `false` for any key starting with `"_"` (simulating "private" properties)
