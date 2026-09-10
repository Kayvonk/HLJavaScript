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
