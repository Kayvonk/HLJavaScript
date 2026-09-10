# Activity 10: The Prototype Chain

## Overview
Every JavaScript object has an internal `[[Prototype]]` link pointing to another object (or `null`). When you access a property, JavaScript first checks the object itself; if not found, it follows the `[[Prototype]]` link — walking the **prototype chain** until it finds the property or reaches `null`. This is JavaScript's inheritance mechanism, and it underlies both `Object.create()` and `class` syntax.

## Learning Objectives
- Describe how property lookup traverses the prototype chain
- Use `Object.create(proto)` to manually set an object's prototype
- Distinguish own properties from inherited properties using `hasOwnProperty()`
- Explain how `class` syntax maps to prototype wiring under the hood

## Instructions

Study the two examples in `script.js` — one using `Object.create()` and one using class syntax — noting that both produce the same prototype relationship. Then complete the TODOs.

### TODO 1 — Object.create() Prototype Chain
Create a `vehicle` prototype object with a `describe()` method that logs `"I am a vehicle"`. Use `Object.create(vehicle)` to create a `car` object and add a `make` property to it. Call `car.describe()` (inherited) and verify with `car.hasOwnProperty("describe")` that the method is inherited, not owned by `car`.

> **Hint:**
> ```js
> const vehicle = {
>   describe() { console.log("I am a vehicle"); }
> };
> const car = Object.create(vehicle);
> car.make = "Toyota";
> ```
> `car.describe()` works because JavaScript walks up the chain to `vehicle`.
> `car.hasOwnProperty("describe")` returns `false` — `describe` lives on `vehicle`, not `car`.
> `car.hasOwnProperty("make")` returns `true` — `make` was assigned directly to `car`.

### TODO 2 — Class Syntax and Prototype Verification
Using class syntax, create a `Shape` class with a `getArea()` method that returns `0`. Extend it with a `Circle` class that overrides `getArea()` to return `Math.PI * this.radius ** 2`. Then log `Object.getPrototypeOf(Circle.prototype) === Shape.prototype` to confirm the prototype chain is wired correctly.

> **Hint:** `class Circle extends Shape` tells JavaScript to set `Circle.prototype.__proto__ = Shape.prototype`. You can verify this with `Object.getPrototypeOf(Circle.prototype)`. This is exactly what `Object.create(Shape.prototype)` would do manually — `class` is syntactic sugar over the same prototype chain wiring.

## What You Learned
- Property lookup follows the `[[Prototype]]` chain from the object upward until found or `null` is reached
- `Object.create(proto)` creates a new object whose `[[Prototype]]` is `proto`
- `hasOwnProperty(key)` returns `true` only for properties directly on the object — not inherited ones
- `class extends` wires `SubClass.prototype.__proto__ = SuperClass.prototype` automatically

## Stretch Challenges
1. Write a utility function `getFullPrototypeChain(obj)` that returns an array of all prototypes from `obj` up to (but not including) `null`
2. Research `Object.setPrototypeOf()` — when would you use it vs. `Object.create()`? Why is it discouraged for performance-critical code?
3. Explore what `instanceof` actually checks — it walks the prototype chain looking for the constructor's `.prototype` property. Write a manual implementation of `instanceof`
