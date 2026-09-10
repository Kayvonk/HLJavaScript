// ─── Immutability and Structural Sharing ─────────────────────────────────────

// EXAMPLE 1: Mutable vs immutable state updates
console.log("--- Example 1: Mutable vs immutable ---");

const originalState = {
  user: { name: "Alice", email: "alice@example.com" },
  theme: "dark",
  count: 0
};

// MUTABLE (bad): modifies the original
function updateMutable(state, newName) {
  state.user.name = newName; // directly mutates — original is changed!
  return state;
}

// IMMUTABLE (good): creates a new object, shares unchanged parts
function updateImmutable(state, newName) {
  return {
    ...state,                        // copy top-level properties
    user: { ...state.user, name: newName }  // only replace what changed
  };
}

const mutableResult = updateMutable(originalState, "Bob");
console.log("after mutable update, original.user.name:", originalState.user.name); // "Bob" ← mutated!

const immutableState = { user: { name: "Alice", email: "alice@example.com" }, theme: "dark", count: 0 };
const nextState = updateImmutable(immutableState, "Bob");
console.log("original after immutable update:", immutableState.user.name); // "Alice" ← preserved
console.log("nextState.user.name:", nextState.user.name);                  // "Bob"
console.log("structural sharing — same theme ref:", immutableState.theme === nextState.theme); // true


// ─── EXAMPLE 2: Object.freeze — shallow immutability ─────────────────────────
console.log("\n--- Example 2: freeze (shallow) ---");

const config = Object.freeze({
  host: "localhost",
  port: 3000,
  db: { name: "mydb" }  // nested — NOT frozen by Object.freeze alone
});

config.host = "production"; // silently ignored — frozen
console.log("config.host:", config.host); // "localhost" — unchanged

config.db.name = "prod-db"; // ALLOWED — db is nested and NOT frozen
console.log("config.db.name:", config.db.name); // "prod-db" ← shallow freeze missed this


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Immutable Array Update
// Write updateItem(list, index, updates) that:
//   - returns a NEW array
//   - the item at `index` is replaced with { ...oldItem, ...updates }
//   - the original array and other items are unchanged
// Test: create an array of user objects, update one user's email,
// and verify the original array still has the old email.

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: deepFreeze
// Write deepFreeze(obj) that recursively calls Object.freeze() on the object
// and all nested object values.
// Test: create a nested config object, deepFreeze it, then try to modify a
// deeply nested property. Verify it cannot be changed.
// Add a comment explaining the difference between Object.freeze (shallow)
// and deepFreeze (recursive).

// Write your code here:
