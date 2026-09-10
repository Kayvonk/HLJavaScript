// ─── Callbacks and the Callback Pattern ──────────────────────────────────────

// EXAMPLE 1: Error-first callback convention
console.log("--- Example 1: Error-first callbacks ---");

// Simulated async fetch using setTimeout + error-first convention
function fetchUser(id, callback) {
  setTimeout(() => {
    if (id <= 0) {
      callback(new Error(`Invalid user id: ${id}`), null);
    } else {
      callback(null, { id, name: "Alice", role: "admin" });
    }
  }, 50);
}

function fetchPosts(userId, callback) {
  setTimeout(() => {
    callback(null, [
      { id: 1, title: "Hello World", userId },
      { id: 2, title: "JS Closures", userId }
    ]);
  }, 50);
}

// Two-level chain — error handled at each level
fetchUser(1, (err, user) => {
  if (err) { console.error("user error:", err.message); return; }
  console.log("got user:", user.name);

  fetchPosts(user.id, (err, posts) => {
    if (err) { console.error("posts error:", err.message); return; }
    console.log("got posts:", posts.map(p => p.title));
  });
});

// Error case:
fetchUser(-1, (err, user) => {
  if (err) { console.error("user error caught:", err.message); return; }
});


// ─── EXAMPLE 2: The pyramid of doom (conceptual — four levels deep) ───────────
console.log("\n--- Example 2: Pyramid of doom (shape only) ---");

// This is what callback hell looks like at 4 levels:
//
// fetchUser(1, (err, user) => {
//   fetchPosts(user.id, (err, posts) => {
//     fetchComments(posts[0].id, (err, comments) => {
//       fetchAuthor(comments[0].authorId, (err, author) => {
//         console.log("final result:", author.name);  // 4 levels deep
//       });
//     });
//   });
// });
//
// Problems:
// - Each error must be handled separately (easy to forget one)
// - Logic flows diagonally, not linearly — hard to read
// - Adding a step means adding another nesting level

console.log("(pyramid of doom shown in comments above)");


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Delay Chain
// Write a delay(ms, callback) function that calls callback() after ms milliseconds.
// Use it to chain THREE sequential steps:
//   - Step 1 completes, then starts step 2
//   - Step 2 completes, then starts step 3
//   - Step 3 logs "all done"
// Log a message at each step.

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: withErrorHandling Wrapper
// Write withErrorHandling(fn, onError) that:
//   - calls fn()
//   - if fn() throws, calls onError(err) instead of propagating
//   - if fn() succeeds, logs the result
// Write riskyOperation() that randomly throws or returns a success string.
// Pass it to withErrorHandling and demonstrate both outcomes.

// Write your code here:
