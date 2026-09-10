# Activity 33: eval() and Security

## Overview
`eval(string)` executes arbitrary JavaScript code in the current scope — giving it access to all local variables, enabling injection attacks, and preventing JIT optimization of the surrounding function. `new Function(...)` is "indirect eval" — safer because it only has access to global scope, not local variables — but still dangerous with untrusted input. Understanding these risks and their safer alternatives is essential for production-quality JavaScript.

## Learning Objectives
- Explain why `eval()` is considered dangerous (scope access, injection, JIT inhibition)
- Describe how `new Function()` differs from `eval` in scope access
- Write a `safeEvaluateExpression` function that evaluates simple math without eval
- Compare all three approaches (eval, new Function, plain function) on their security profiles

## Instructions

Study the `eval` scope access demo and the `new Function` scope comparison in `script.js`. Note specifically which scope each one can see. Then complete the TODOs.

### TODO 1 — safeEvaluateExpression
Write a `safeEvaluateExpression(expression)` function that evaluates simple arithmetic expressions like `"3 + 4 * 2"` **without using `eval`**. Use a regex guard that only allows digits, spaces, and `+`, `-`, `*`, `/`, `(`, `)` characters — reject anything else. Then parse and compute the result manually or use a simple approach within the validated character set.

> **Hint:** First validate the input with a regex allowlist:
> ```js
> function safeEvaluateExpression(expr) {
>   if (!/^[\d\s+\-*/().]+$/.test(expr)) {
>     throw new Error(`Invalid expression: ${expr}`);
>   }
>   // Safe to use Function here because we've validated the input
>   // contains ONLY numbers and operators — no identifiers, no code
>   return new Function(`return (${expr})`)();
> }
> ```
> This is a common real-world pattern: whitelist-validate first, then evaluate the safe subset. The regex ensures only arithmetic characters pass — `alert(1)` would fail immediately.

### TODO 2 — Security Profile Comparison
Write three versions of a function that adds two numbers:
1. Using `eval("function add(a,b){return a+b}")`
2. Using `new Function("a", "b", "return a+b")`
3. A plain arrow function

For each, add a comment describing its scope access level (local scope, global scope, none) and security profile.

> **Hint:** Create a local variable `secret = "password"` before defining each version. In the `eval` version, try to access `secret` inside the eval string — it works. In the `new Function` version, try the same — it cannot access `secret`. The arrow function obviously has full lexical access to the surrounding scope. These three comparisons illustrate the security spectrum from most dangerous to safest.

## What You Learned
- `eval()` has access to the local scope — untrusted input can read or modify any local variable
- `new Function()` only has global scope access — it cannot see local variables, making it safer (but not safe with untrusted input)
- Both inhibit JIT optimization of the surrounding function (V8 can't optimize if scope might be mutated)
- The safe pattern for user-supplied expressions: regex allowlist → validated eval or a parser

## Stretch Challenges
1. Research **Content Security Policy (CSP)** — specifically the `script-src` directive and why `'unsafe-eval'` must be explicitly permitted for eval to work
2. Implement a proper expression parser (recursive descent or shunting-yard algorithm) for `+`, `-`, `*`, `/` — no eval at all, just string parsing and arithmetic
3. Research OWASP's definition of "code injection" — explain how user-controlled strings reaching `eval()` constitute a code injection vulnerability
