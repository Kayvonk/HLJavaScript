// ─── Prototype Pollution ──────────────────────────────────────────────────────

// EXAMPLE 1: How prototype pollution works
console.log("--- Example 1: How prototype pollution works ---");

// A vulnerable deep merge that blindly copies all keys including __proto__
function vulnerableMerge(target, source) {
  for (const key in source) {
    if (typeof source[key] === "object" && source[key] !== null) {
      target[key] = target[key] ?? {};
      vulnerableMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Simulated malicious user input (as if parsed from untrusted JSON)
const maliciousPayload = JSON.parse('{"__proto__": {"isAdmin": true}}');

// BEFORE pollution:
console.log("before — plain object isAdmin:", ({}).isAdmin); // undefined

vulnerableMerge({}, maliciousPayload); // DANGEROUS — mutates Object.prototype

// AFTER pollution — EVERY object is now an "admin"
console.log("after — plain object isAdmin:", ({}).isAdmin);  // true — contaminated!
console.log("after — array isAdmin:", ([]).isAdmin);          // true — same prototype chain!

// Cleanup (for this demo only — not something you'd do in real code):
delete Object.prototype.isAdmin;
console.log("after cleanup:", ({}).isAdmin); // undefined again


// ─── EXAMPLE 2: Object.create(null) — no prototype to pollute ────────────────
console.log("\n--- Example 2: Null-prototype objects ---");

const normalObj = {};
const safeDict  = Object.create(null);

console.log("normalObj.toString:", typeof normalObj.toString);  // "function" — inherited
console.log("safeDict.toString:", typeof safeDict.toString);    // "undefined" — no prototype

// safeDict can be used as a key-value store:
safeDict["alice"] = { role: "admin" };
safeDict["bob"]   = { role: "viewer" };
console.log("safeDict entries:", JSON.stringify(safeDict)); // {"alice":...,"bob":...}

// No inherited methods means no pollution vector:
safeDict["__proto__"] = { isAdmin: true }; // just a string key, not a prototype link
console.log("safeDict.__proto__:", safeDict["__proto__"]);       // { isAdmin: true } — regular prop
console.log("normalObj isAdmin after:", ({}).isAdmin);            // undefined — no contamination


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: safeMerge
// Write safeMerge(target, source) that deep-merges but skips keys:
//   "__proto__", "constructor", "prototype"
// Test with a malicious payload: JSON.parse('{"__proto__":{"isAdmin":true}}')
// After the merge, verify ({}).isAdmin is still undefined.

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Object.create(null) Dictionary
// Create a dict using Object.create(null).
// Demonstrate it has no toString, hasOwnProperty, or constructor.
// Add some key-value pairs and read them back.
// Add a comment explaining why this is immune to prototype pollution.

// Write your code here:
