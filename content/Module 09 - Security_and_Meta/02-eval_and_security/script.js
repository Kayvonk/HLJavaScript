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
