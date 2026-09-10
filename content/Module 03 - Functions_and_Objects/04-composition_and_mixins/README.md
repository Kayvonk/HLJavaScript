# Activity 11: Composition and Mixins

## Overview
Deep class hierarchies create brittle code — a `FlyingSwimmingAnimal` that needs both `canFly` and `canSwim` doesn't fit neatly into a single inheritance tree. **Composition** solves this by assembling behavior from small, focused objects rather than inheriting it. **Mixins** extend this idea to classes, letting you inject reusable behavior onto a prototype without creating inheritance chains.

## Learning Objectives
- Explain why "composition over inheritance" is a guiding principle in software design
- Assemble objects from behavior pieces using `Object.assign()`
- Apply a mixin to a class prototype using `Object.assign(MyClass.prototype, mixin)`
- Identify when composition is more flexible than inheritance

## Instructions

Study both examples in `script.js`. The first shows behavior objects composed with `Object.assign`. The second shows a mixin applied directly to a class prototype. Then complete the TODOs.

### TODO 1 — Compose Three Behaviors
Create three behavior objects: `canGreet` (with a `greet()` method that logs `"Hello, I am " + this.name`), `canCalculate` (with an `add(a, b)` method that returns `a + b`), and `canLog` (with a `log(msg)` method that logs the message). Compose them into a single `assistant` object that also has a `name` property. Call all three methods on `assistant`.

> **Hint:** Use `Object.assign({}, canGreet, canCalculate, canLog, { name: "HAL" })` to merge all behaviors into a new object. The methods use `this.name` — make sure `name` is part of the final object. Note that `Object.assign` copies properties *shallowly* — methods are copied directly, not inherited.

### TODO 2 — Timestamped Mixin
Define a `Timestamped` mixin object with two properties: `createdAt` (a function that returns the current ISO timestamp) and a `getAge()` method that logs `"Created at: " + this.createdAt()`. Apply it to a class `Document` using `Object.assign(Document.prototype, Timestamped)`. Create a `Document` instance and call `getAge()`.

> **Hint:**
> ```js
> const Timestamped = {
>   createdAt() { return new Date().toISOString(); },
>   getAge() { console.log("Created at: " + this.createdAt()); }
> };
> class Document { constructor(title) { this.title = title; } }
> Object.assign(Document.prototype, Timestamped);
> ```
> After applying the mixin, all `Document` instances will have `createdAt` and `getAge` on their prototype — without `Document` extending any other class.

## What You Learned
- Composition assembles behavior from small, focused objects rather than inheriting from a hierarchy
- `Object.assign(target, ...sources)` copies all enumerable own properties from sources into target
- Mixins apply shared behavior to a class prototype without using `extends`
- Composition is more flexible than inheritance: you can mix any combination of behaviors without restructuring a class tree

## Stretch Challenges
1. Create a conflict scenario: two behavior objects with the same method name — observe how `Object.assign` handles it (last write wins) and think about how you'd resolve conflicts intentionally
2. Research the "diamond problem" in multiple inheritance — explain how composition avoids it
3. Write a `createMixin(...behaviors)` factory that takes multiple behavior objects and returns a class decorator function that applies all of them to a class prototype
