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
console.log("\n--- TODO 1: Immutable Array Update ---");

// `map` returns a NEW array; untouched indexes carry the same object
// references forward — that's structural sharing (cheap, no deep copy). Only
// the changed element is spread into a new object.
function updateItem(list, index, updates) {
  return list.map((item, i) =>
    i === index ? { ...item, ...updates } : item
  );
}

const users = [
  { id: 1, name: "Alice", email: "alice@old.com" },
  { id: 2, name: "Bob",   email: "bob@old.com" },
  { id: 3, name: "Cara",  email: "cara@old.com" }
];

const updatedUsers = updateItem(users, 1, { email: "bob@new.com" });

console.log("original users[1].email:", users[1].email);         // bob@old.com
console.log("updated  users[1].email:", updatedUsers[1].email);  // bob@new.com
console.log("users === updatedUsers:", users === updatedUsers);  // false
console.log("users[0] shared ref:", users[0] === updatedUsers[0]); // true (structural sharing)



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: deepFreeze
// Write deepFreeze(obj) that recursively calls Object.freeze() on the object
// and all nested object values.
// Test: create a nested config object, deepFreeze it, then try to modify a
// deeply nested property. Verify it cannot be changed.
// Add a comment explaining the difference between Object.freeze (shallow)
// and deepFreeze (recursive).

// Write your code here:
console.log("\n--- TODO 2: deepFreeze ---");

// Object.freeze is SHALLOW — it only locks the immediate properties. Nested
// objects remain mutable unless you recurse into them. deepFreeze walks the
// tree, freezing every object it finds so no property at any depth can be
// reassigned or deleted.
function deepFreeze(obj) {
  Object.freeze(obj);
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }
  return obj;
}

const appConfig = deepFreeze({
  api: {
    baseUrl: "https://api.example.com",
    auth: { token: "abc123" }
  },
  featureFlags: { newUi: true }
});

// Attempt deep mutation — silently ignored in sloppy mode, TypeError in strict.
try {
  appConfig.api.auth.token = "hacked";
} catch (e) {
  console.log("strict-mode error caught:", e.message);
}

console.log("token unchanged:", appConfig.api.auth.token); // "abc123"
console.log("baseUrl unchanged:", appConfig.api.baseUrl);   // "https://api.example.com"
console.log("Object.isFrozen(appConfig.api.auth):", Object.isFrozen(appConfig.api.auth)); // true
