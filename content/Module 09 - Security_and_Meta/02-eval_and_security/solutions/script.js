// ─── eval() and Security ──────────────────────────────────────────────────────

// EXAMPLE 1: eval has access to the LOCAL scope — dangerous!
console.log("--- Example 1: eval scope access ---");

function demonstrateEvalScopeAccess() {
  const privateData = "super-secret-token-123";
  const userInput = "privateData"; // imagine this came from user input

  // eval can read local variables — a massive security risk if input is untrusted
  const leaked = eval(userInput);
  console.log("eval leaked:", leaked); // "super-secret-token-123"
  // If userInput were "require('fs').readFileSync('/etc/passwd','utf8')"
  // and this ran in Node.js, the file would be read. Never eval untrusted input.
}

demonstrateEvalScopeAccess();


// ─── EXAMPLE 2: new Function — global scope only, not local ──────────────────
console.log("\n--- Example 2: new Function scope ---");

function demonstrateNewFunctionScope() {
  const localSecret = "local-only";
  const globalLikeVar = "I exist globally in this demo";

  // new Function only accesses global scope — cannot see localSecret
  const fnFromString = new Function("return typeof localSecret");
  console.log("new Function sees localSecret?", fnFromString()); // "undefined"

  // eval CAN see localSecret:
  console.log("eval sees localSecret?", typeof eval("localSecret")); // "string"
}

demonstrateNewFunctionScope();

// new Function for a simple addition (safer than eval for math):
const dynamicAdd = new Function("a", "b", "return a + b");
console.log("dynamicAdd(3, 4):", dynamicAdd(3, 4)); // 7


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: safeEvaluateExpression
// Write safeEvaluateExpression(expr) that evaluates simple arithmetic like "3 + 4 * 2"
// WITHOUT using raw eval on unvalidated input.
// Use a regex allowlist: only allow digits, spaces, +, -, *, /, (, ).
// Throw an error for anything else.
// Test with: "3 + 4 * 2", "10 / 2 + 3", and a malicious string like "alert(1)".

// Write your code here:
// Defense-in-depth pattern: whitelist-validate the input surface FIRST, then
// hand the already-restricted string to new Function. Because the allowed
// character set contains no identifiers, dots, quotes, or brackets, the string
// cannot invoke `alert`, `require`, property access, etc. — it can only form
// arithmetic. new Function is used (not eval) so no local scope leaks either.
function safeEvaluateExpression(expr) {
  if (!/^[\d\s+\-*/().]+$/.test(expr)) {
    throw new Error(`Invalid expression: ${expr}`);
  }
  return new Function(`return (${expr})`)();
}

console.log("\n--- TODO 1: safeEvaluateExpression ---");
console.log(safeEvaluateExpression("3 + 4 * 2")); // 11
console.log(safeEvaluateExpression("10 / 2 + 3")); // 8
try {
  safeEvaluateExpression("alert(1)");
} catch (e) {
  console.log("rejected:", e.message);
}


// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Security Profile Comparison
// Create a local variable 'secret' before the three versions.
// Write three versions that add two numbers:
//   1. Using eval() — can it access 'secret'?
//   2. Using new Function() — can it access 'secret'?
//   3. A plain arrow function — can it access 'secret'?
// Add a comment for each explaining:
//   - what scope it can access
//   - its security profile

// Write your code here:
// Wrap in a function so 'secret' really is a LOCAL binding — that's the whole
// point of comparing scope access. If declared at module top level, `secret`
// might behave differently in some hosts.
function securityProfileDemo() {
  const secret = "password";

  // 1. eval — SCOPE: direct eval sees the full local scope, including `secret`.
  //    SECURITY PROFILE: MOST DANGEROUS. Untrusted input passed here can read
  //    or overwrite ANY local variable, call any in-scope function, exfiltrate
  //    tokens, mutate closure state, and even disable JIT optimization.
  eval("var addViaEval = (a, b) => a + b");
  console.log("eval add:",       addViaEval(2, 3));
  console.log("eval sees secret:", eval("secret")); // "password"

  // 2. new Function — SCOPE: only the GLOBAL scope. It cannot see `secret`.
  //    SECURITY PROFILE: DANGEROUS but less than eval. Untrusted input still
  //    executes arbitrary code (e.g., `require('fs')` in Node), but at least
  //    it cannot inspect the calling function's locals or closures.
  const addViaNewFunction = new Function("a", "b", "return a + b");
  console.log("new Function add:", addViaNewFunction(2, 3));
  const seesSecret = new Function("return typeof secret");
  console.log("new Function sees secret:", seesSecret()); // "undefined"

  // 3. Plain arrow function — SCOPE: full lexical closure over `secret`, but
  //    the BODY is fixed at author time — no string is being interpreted.
  //    SECURITY PROFILE: SAFE. There is no code-from-string path here, so
  //    there is no injection surface regardless of what user input arrives.
  const addPlain = (a, b) => a + b;
  console.log("plain add:", addPlain(2, 3));
  console.log("plain sees secret (lexical):", secret); // "password"
}

console.log("\n--- TODO 2: Security Profile Comparison ---");
securityProfileDemo();
