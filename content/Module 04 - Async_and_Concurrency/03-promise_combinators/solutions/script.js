// ─── Promise Combinators ──────────────────────────────────────────────────────

// Helper: create a Promise that resolves after ms with a label
function resolve(label, ms) {
  return new Promise(r => setTimeout(() => r(label), ms));
}

// Helper: create a Promise that rejects after ms with a reason
function reject(reason, ms) {
  return new Promise((_, r) => setTimeout(() => r(new Error(reason)), ms));
}


// EXAMPLE 1: Promise.all — all must succeed
console.log("--- Example 1: Promise.all ---");

// All succeed:
Promise.all([resolve("users", 50), resolve("posts", 80), resolve("settings", 30)])
  .then(results => console.log("all.fulfilled:", results))
  .catch(err => console.error("all.rejected:", err.message));

// One rejects — the entire .catch fires immediately:
Promise.all([resolve("users", 50), reject("not found", 30), resolve("settings", 80)])
  .then(results => console.log("should not print"))
  .catch(err => console.error("all short-circuit:", err.message)); // "not found"


// ─── EXAMPLE 2: Promise.allSettled — collects all outcomes ───────────────────
console.log("\n--- Example 2: Promise.allSettled ---");

Promise.allSettled([
  resolve("users", 50),
  reject("posts unavailable", 30),
  resolve("settings", 80)
]).then(results => {
  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      console.log(`  [${i}] fulfilled:`, r.value);
    } else {
      console.log(`  [${i}] rejected:`, r.reason.message);
    }
  });
});
// allSettled never rejects — it always gives you the complete picture.


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Promise.race() for Timeout
// Create three Promises resolving after different timeouts: 50ms, 100ms, 200ms.
// Use Promise.race() to log whichever resolves first.
// Add a comment explaining the "timeout pattern" use case for Promise.race().

// Write your code here:
// Promise.race settles as soon as ANY input Promise settles (fulfilled OR rejected).
// Timeout pattern: race a real work Promise against a Promise that rejects
// after N ms — whichever settles first wins, giving you a built-in deadline
// on operations that don't natively support timeouts (like plain fetch).
Promise.race([
  resolve("fast (50ms)", 50),
  resolve("medium (100ms)", 100),
  resolve("slow (200ms)", 200)
]).then(winner => console.log("race winner:", winner));



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Promise.any()
// Create three Promises where two reject and one fulfills.
// Use Promise.any() and log the result.
// Add a comment explaining how Promise.any() differs from Promise.race()
// when rejections are involved.

// Write your code here:
// Promise.any resolves with the FIRST fulfilled Promise and ignores rejections
// until every input has rejected (then it rejects with AggregateError).
// Contrast with Promise.race, which settles on the first SETTLED Promise —
// so an early rejection immediately propagates in race, but is skipped in any.
Promise.any([
  reject("primary down", 30),
  reject("secondary down", 60),
  resolve("backup ok", 90)
]).then(first => console.log("any winner:", first))
  .catch(err => console.error("any error:", err));
