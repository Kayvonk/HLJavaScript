# Activity 32: Prototype Pollution

## Overview
**Prototype pollution** is a class of JavaScript attack where user-controlled data — typically a JSON payload — is used to modify `Object.prototype`, injecting properties that appear on every object in the application. A vulnerable "deep merge" function that blindly copies a `__proto__` key from user input is the classic vector. Understanding this attack and its defenses is essential for any code that handles untrusted data.

## Learning Objectives
- Explain how setting `obj.__proto__.key = value` modifies every object's prototype
- Identify a vulnerable deep merge function
- Write a `safeMerge` that defends against prototype pollution by skipping dangerous keys
- Use `Object.create(null)` to create dictionaries with no prototype to pollute

## Instructions

Study the vulnerable deep merge and the contamination demo in `script.js`. Notice how a single malicious call makes `({}).isAdmin` return `true` for every object in the runtime. Then complete the TODOs.

### TODO 1 — safeMerge
Write a `safeMerge(target, source)` function that deep-merges `source` into `target` but **skips any key** named `__proto__`, `constructor`, or `prototype`. Test it with a malicious source payload (`{ "__proto__": { "isAdmin": true } }`) and confirm that `({}).isAdmin` remains `undefined` after the merge.

> **Hint:**
> ```js
> function safeMerge(target, source) {
>   for (const key of Object.keys(source)) {
>     if (key === "__proto__" || key === "constructor" || key === "prototype") {
>       continue; // skip dangerous keys
>     }
>     if (typeof source[key] === "object" && source[key] !== null) {
>       target[key] = target[key] ?? {};
>       safeMerge(target[key], source[key]);
>     } else {
>       target[key] = source[key];
>     }
>   }
>   return target;
> }
> ```
> After calling `safeMerge({}, JSON.parse('{"__proto__":{"isAdmin":true}}'))`, check `({}).isAdmin` — it should be `undefined`.

### TODO 2 — Object.create(null) Dictionary
Create an object using `Object.create(null)` and demonstrate that it has no `toString`, `hasOwnProperty`, or `constructor` methods. Explain in a comment why this makes it immune to prototype pollution. Show a practical use as a safe dictionary by adding and reading keys normally.

> **Hint:**
> ```js
> const dict = Object.create(null);
> dict.name = "Alice";
> ```
> `dict.toString` is `undefined` because the object has no `[[Prototype]]` — there is nothing to inherit from. Any `__proto__` key merged into it is treated as a regular string property, not a prototype link, because the prototype slot is `null`. This is why `Object.create(null)` objects are used as safe maps in security-sensitive code.

## What You Learned
- Prototype pollution modifies `Object.prototype`, injecting properties visible on every ordinary object
- The attack vector is usually a deep merge function that doesn't filter `__proto__`, `constructor`, or `prototype` keys
- `safeMerge` defends by explicitly skipping those keys before recursing
- `Object.create(null)` creates prototype-free objects — they are immune to prototype pollution

## Stretch Challenges
1. Research `Object.freeze(Object.prototype)` as a defense — what does it protect against and what does it break?
2. Write a test that demonstrates the vulnerability being exploited before the fix and clean after the fix
3. Research `hasOwnProperty` as an attack vector — why is `Object.prototype.hasOwnProperty.call(obj, key)` safer than `obj.hasOwnProperty(key)` after potential prototype pollution?
