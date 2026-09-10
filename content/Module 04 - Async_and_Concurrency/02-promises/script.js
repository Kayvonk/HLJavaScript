// ─── Promises In Depth ────────────────────────────────────────────────────────

// EXAMPLE 1: Full .then / .catch / .finally chain
console.log("--- Example 1: Promise chain ---");

function fetchUserData(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: "Alice", email: "alice@example.com" });
      } else {
        reject(new Error(`User ${id} not found`));
      }
    }, 50);
  });
}

function fetchUserPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ title: "Post A" }, { title: "Post B" }]);
    }, 50);
  });
}

fetchUserData(1)
  .then(user => {
    console.log("Got user:", user.name);
    return fetchUserPosts(user.id); // returning a Promise flattens the chain
  })
  .then(posts => {
    console.log("Got posts:", posts.map(p => p.title));
    return posts.length;
  })
  .then(count => {
    console.log("Post count:", count);
  })
  .catch(err => {
    console.error("Error in chain:", err.message);
  })
  .finally(() => {
    console.log("Chain finished (finally)");
  });

// Error path:
fetchUserData(-1)
  .then(user => console.log("Should not reach here"))
  .catch(err => console.error("Error caught:", err.message));


// ─── EXAMPLE 2: Chain flattening — returning a Promise from .then ─────────────
console.log("\n--- Example 2: Chain flattening ---");

// When .then returns a new Promise, the chain waits for THAT Promise
// before continuing — it does not nest.
const chain = Promise.resolve("start")
  .then(val => {
    console.log("val:", val); // "start"
    return new Promise(resolve => setTimeout(() => resolve("after async"), 50));
  })
  .then(val => {
    console.log("val:", val); // "after async" — NOT a nested Promise
    return val.toUpperCase();
  })
  .then(val => console.log("val:", val)); // "AFTER ASYNC"


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: validateAge Promise
// Write validateAge(age) that returns a Promise:
//   - resolves with "valid" if age >= 18
//   - rejects with "too young" otherwise
// Chain .then() and .catch() to log appropriate messages.
// Test with both a passing and a failing age.

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Three-Step Transformation Chain
// Start with Promise.resolve("  42  ") and write a 3-step .then() chain.
// Each step should transform the value and log the intermediate result:
//   Step 1: trim whitespace
//   Step 2: parse to a number
//   Step 3: double it
// Verify each intermediate value with console.log inside each .then().

// Write your code here:
