// ─── Factory Functions and Singleton Pattern ──────────────────────────────────

// EXAMPLE 1: Factory function — no new, no this, private state via closure
console.log("--- Example 1: createUser factory ---");

function createUser(name, role) {
  // private — not on the returned object
  let loginCount = 0;
  const createdAt = new Date().toISOString();

  return {
    getName()    { return name; },
    getRole()    { return role; },
    login()      { loginCount++; console.log(`${name} logged in (${loginCount}x)`); },
    getStats()   { return { loginCount, createdAt }; }
  };
}

const alice = createUser("Alice", "admin");
const bob   = createUser("Bob", "viewer");

alice.login(); // Alice logged in (1x)
alice.login(); // Alice logged in (2x)
bob.login();   // Bob logged in (1x)

// Private state is genuinely inaccessible:
console.log("alice.loginCount:", alice.loginCount); // undefined
console.log("alice stats:", alice.getStats().loginCount); // 2
console.log("bob stats:", bob.getStats().loginCount);     // 1 (independent)


// ─── EXAMPLE 2: Singleton — one instance globally ────────────────────────────
console.log("\n--- Example 2: createDatabase singleton ---");

let _dbInstance = null;

function createDatabase() {
  if (_dbInstance !== null) return _dbInstance;

  // Only runs once — subsequent calls skip this block
  console.log("Initializing database connection...");
  _dbInstance = {
    host: "localhost",
    port: 5432,
    query(sql) {
      console.log(`[DB] ${sql}`);
      return [];
    }
  };

  return _dbInstance;
}

const db1 = createDatabase(); // "Initializing..."
const db2 = createDatabase(); // (nothing logged — returns cached instance)
const db3 = createDatabase(); // (same)

console.log("db1 === db2:", db1 === db2); // true
console.log("db2 === db3:", db2 === db3); // true
db1.query("SELECT 1");  // [DB] SELECT 1


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: createTimer Factory
// Write createTimer() that returns { start(), stop(), elapsed() }.
// Use closure for startTime and running — no 'this'.
// - start(): records the current time and marks as running
// - stop(): marks as not running
// - elapsed(): returns ms since start (0 if not running)
// Create two timers and show they track time independently.

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: createLogger Singleton
// Implement createLogger() so that:
//   - the first call creates a logger with log(msg) that prepends a timestamp
//   - subsequent calls return the exact same object
// Verify: createLogger() === createLogger() must be true.
// Call log() on both references and show they use the same object.

// Write your code here:
