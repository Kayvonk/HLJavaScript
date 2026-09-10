// ─── Proxy and Reflect ────────────────────────────────────────────────────────

// EXAMPLE 1: Validation proxy — enforce type constraints on set
console.log("--- Example 1: Validation proxy ---");

function createValidatedUser(initialData) {
  const validators = {
    age:  v => typeof v === "number" && v > 0,
    name: v => typeof v === "string" && v.length > 0
  };

  return new Proxy(initialData, {
    set(target, key, value) {
      if (validators[key] && !validators[key](value)) {
        throw new TypeError(`Invalid value for "${key}": ${JSON.stringify(value)}`);
      }
      return Reflect.set(target, key, value); // delegate to default after validation
    }
  });
}

const user = createValidatedUser({ name: "Alice", age: 30 });

user.name = "Bob";          // valid
user.age  = 25;             // valid
console.log(user.name, user.age); // Bob 25

try {
  user.age = -5;            // invalid — throws TypeError
} catch (e) {
  console.error(e.message); // Invalid value for "age": -5
}

try {
  user.name = 123;          // invalid — throws TypeError
} catch (e) {
  console.error(e.message); // Invalid value for "name": 123
}


// ─── EXAMPLE 2: Read-tracking proxy — log every property access ──────────────
console.log("\n--- Example 2: Read-tracking proxy ---");

function createReadTracker(obj) {
  return new Proxy(obj, {
    get(target, key) {
      const value = Reflect.get(target, key);
      console.log(`  [access] .${String(key)} → ${JSON.stringify(value)}`);
      return value;
    }
  });
}

const tracked = createReadTracker({ host: "localhost", port: 3000, env: "dev" });
const host = tracked.host;  // logs: [access] .host → "localhost"
const port = tracked.port;  // logs: [access] .port → 3000


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Case-Insensitive Config Proxy
// Create a proxy around a config object { theme: "dark", language: "en" }.
// The get and set traps should normalize the property key to lowercase.
// Test that config.Theme, config.THEME, and config.theme all read/write the same slot.

// Write your code here:
console.log("\n--- TODO 1: Case-Insensitive Config Proxy ---");

// The get/set traps intercept property access and delegate to Reflect after
// normalizing the key. Reflect mirrors the default behavior so we don't lose
// anything by intercepting — we simply rewrite the key before forwarding.
const config = new Proxy(
  { theme: "dark", language: "en" },
  {
    get(target, key) {
      return Reflect.get(target, typeof key === "string" ? key.toLowerCase() : key);
    },
    set(target, key, value) {
      return Reflect.set(target, typeof key === "string" ? key.toLowerCase() : key, value);
    }
  }
);

console.log("config.Theme:", config.Theme);     // "dark"
console.log("config.THEME:", config.THEME);     // "dark"
console.log("config.theme:", config.theme);     // "dark"

config.THEME = "light";
console.log("after config.THEME = 'light' → config.theme:", config.theme); // "light"

config.Language = "fr";
console.log("after config.Language = 'fr' → config.language:", config.language); // "fr"



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: createReadOnly
// Write createReadOnly(obj) that wraps obj in a Proxy where:
//   - set trap throws TypeError: `Property "key" is read-only`
//   - deleteProperty trap throws TypeError: `Property "key" cannot be deleted`
// Test by wrapping an object, then attempting modification and deletion in try/catch.
// Verify the original values are unchanged after the failed attempts.

// Write your code here:
console.log("\n--- TODO 2: createReadOnly ---");

// Rather than forwarding to Reflect, these traps intentionally throw. Because
// the target is never touched, the wrapped object's values stay pristine even
// after a caller tries to write or delete.
function createReadOnly(obj) {
  return new Proxy(obj, {
    set(target, key) {
      throw new TypeError(`Property "${String(key)}" is read-only`);
    },
    deleteProperty(target, key) {
      throw new TypeError(`Property "${String(key)}" cannot be deleted`);
    }
  });
}

const settings = createReadOnly({ apiUrl: "https://api.example.com", retries: 3 });

try {
  settings.apiUrl = "https://evil.example.com";
} catch (e) {
  console.error("caught:", e.message);
}

try {
  delete settings.retries;
} catch (e) {
  console.error("caught:", e.message);
}

console.log("apiUrl unchanged:", settings.apiUrl); // "https://api.example.com"
console.log("retries unchanged:", settings.retries); // 3
