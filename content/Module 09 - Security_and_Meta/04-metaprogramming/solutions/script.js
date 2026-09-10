// ─── Metaprogramming with Reflect ────────────────────────────────────────────

// EXAMPLE 1: Reflect.ownKeys vs Object.keys — what each includes
console.log("--- Example 1: Key enumeration APIs ---");

const SYM = Symbol("sym");
const obj = {};

Object.defineProperty(obj, "hidden",   { value: 1, enumerable: false });
Object.defineProperty(obj, "visible",  { value: 2, enumerable: true });
obj[SYM]  = 3;
obj.normal = 4;

console.log("Object.keys:", Object.keys(obj));
// ["visible", "normal"] — only enumerable STRING keys

console.log("Object.getOwnPropertyNames:", Object.getOwnPropertyNames(obj));
// ["hidden", "visible", "normal"] — all string keys including non-enumerable

console.log("Object.getOwnPropertySymbols:", Object.getOwnPropertySymbols(obj));
// [Symbol(sym)] — only Symbol keys

console.log("Reflect.ownKeys:", Reflect.ownKeys(obj));
// ["hidden", "visible", "normal", Symbol(sym)] — EVERYTHING


// ─── EXAMPLE 2: observable() — Proxy + Reflect for change tracking ─────────
console.log("\n--- Example 2: observable factory ---");

function observable(target, onChange) {
  return new Proxy(target, {
    set(target, key, value) {
      const oldValue = Reflect.get(target, key);
      const result   = Reflect.set(target, key, value); // delegate to default behavior
      if (result) onChange(key, oldValue, value);
      return result;
    }
  });
}

const state = observable({ count: 0, name: "init" }, (key, oldVal, newVal) => {
  console.log(`  state.${key}: ${JSON.stringify(oldVal)} → ${JSON.stringify(newVal)}`);
});

state.count = 1;       // logs: state.count: 0 → 1
state.name  = "ready"; // logs: state.name: "init" → "ready"
state.count = 2;       // logs: state.count: 1 → 2


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: defineHidden
// Write defineHidden(obj, key, value) using Reflect.defineProperty() that adds:
//   - non-enumerable, non-configurable, non-writable property
// Verify:
//   - Reflect.ownKeys(obj) includes the key
//   - Object.keys(obj) does NOT include the key
//   - obj[key] still reads the value correctly

// Write your code here:
// Reflect.defineProperty is the functional twin of Object.defineProperty but
// returns a boolean instead of throwing — nicer for programmatic checks.
// Setting all three descriptor attributes to false creates a permanent, sealed,
// non-listable slot (like a private/internal constant on the object).
function defineHidden(target, key, value) {
  Reflect.defineProperty(target, key, {
    value,
    writable: false,
    enumerable: false,
    configurable: false
  });
  return target;
}

console.log("\n--- TODO 1: defineHidden ---");
const cfg = {};
defineHidden(cfg, "version", "1.0");
cfg.public = "hi";

console.log("Reflect.ownKeys:", Reflect.ownKeys(cfg));  // includes "version"
console.log("Object.keys:",     Object.keys(cfg));      // does NOT include "version"
console.log("cfg.version:",     cfg.version);           // "1.0"


// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: createValidator Proxy
// Write createValidator(schema) that returns a Proxy.
// The schema maps property names to validator functions (return true/false).
// In the set trap:
//   - if schema[key] exists and validator returns false: throw TypeError
//   - if valid: use Reflect.set() to commit the value
// Create a schema: { age: v => typeof v === "number" && v > 0,
//                    name: v => typeof v === "string" && v.length > 0 }
// Test with valid values (should work) and invalid values (should throw).

// Write your code here:
// Proxy intercepts fundamental object operations; the `set` trap is invoked
// on every property assignment. Delegating through Reflect.set preserves
// the default behavior (respects setters on the prototype chain, correct
// receiver semantics) — the golden rule for well-behaved Proxies.
function createValidator(schema) {
  return new Proxy({}, {
    set(target, key, value, receiver) {
      if (schema[key] && !schema[key](value)) {
        throw new TypeError(
          `Validation failed for "${String(key)}": ${JSON.stringify(value)}`
        );
      }
      return Reflect.set(target, key, value, receiver);
    }
  });
}

console.log("\n--- TODO 2: createValidator ---");
const person = createValidator({
  age:  v => typeof v === "number" && v > 0,
  name: v => typeof v === "string" && v.length > 0
});

person.age  = 30;       // ok
person.name = "Alice";  // ok
console.log("person.age:", person.age);
console.log("person.name:", person.name);

try { person.age = -5;  } catch (e) { console.log("rejected:", e.message); }
try { person.name = ""; } catch (e) { console.log("rejected:", e.message); }
