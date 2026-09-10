// ─── Symbols and Well-Known Symbols ──────────────────────────────────────────

// EXAMPLE 1: Symbol uniqueness and the global registry
console.log("--- Example 1: Symbol uniqueness ---");

const sym1 = Symbol("label");
const sym2 = Symbol("label");

console.log(sym1 === sym2);        // false — always unique
console.log(typeof sym1);          // "symbol"
console.log(sym1.toString());      // "Symbol(label)"
console.log(sym1.description);     // "label"

// Global registry — Symbol.for shares across code units
const shared1 = Symbol.for("app.theme");
const shared2 = Symbol.for("app.theme");
console.log(shared1 === shared2);  // true — same registry entry

console.log(Symbol.keyFor(shared1)); // "app.theme"
console.log(Symbol.keyFor(sym1));    // undefined — not in global registry

// Symbol as a property key — non-enumerable by default
const SECRET = Symbol("secret");
const config = {
  host: "localhost",
  port: 3000,
  [SECRET]: "hunter2"
};

console.log("\nObject.keys:", Object.keys(config));           // ["host", "port"]
console.log("Symbol key:", config[SECRET]);                   // "hunter2"
console.log("getOwnPropertySymbols:", Object.getOwnPropertySymbols(config)); // [Symbol(secret)]


// ─── EXAMPLE 2: Symbol.toPrimitive — customize type coercion ─────────────────
console.log("\n--- Example 2: Symbol.toPrimitive ---");

class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === "number") return this.celsius;
    if (hint === "string") return `${this.celsius}°C`;
    return this.celsius; // default
  }
}

const temp = new Temperature(25);
console.log(`Temperature: ${temp}`);   // "Temperature: 25°C" (string hint)
console.log(temp + 5);                 // 30 (number hint)
console.log(temp > 20);                // true (number hint)


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Collision-Free Property Keys
// Create two separate objects that both logically want an 'id' property.
// Use a Symbol("id") as the key on each object.
// Log Object.keys() to show the Symbol key is hidden.
// Log Object.getOwnPropertySymbols() to show the Symbol IS accessible that way.

// Write your code here:
console.log("\n--- TODO 1: Collision-Free Property Keys ---");

// Each Symbol() call produces a brand-new, guaranteed-unique value — so even
// two Symbol("id") values do NOT collide. Symbol-keyed properties are also
// excluded from Object.keys()/for...in/JSON.stringify enumeration.
const ID_USER = Symbol("id");
const ID_ORDER = Symbol("id");

const user = { name: "Alice", [ID_USER]: 1 };
const order = { total: 42.50, [ID_ORDER]: 1001 };

console.log("Object.keys(user):", Object.keys(user));   // ["name"] — Symbol hidden
console.log("Object.keys(order):", Object.keys(order)); // ["total"] — Symbol hidden

console.log("getOwnPropertySymbols(user):", Object.getOwnPropertySymbols(user));
console.log("getOwnPropertySymbols(order):", Object.getOwnPropertySymbols(order));

console.log("user id:", user[ID_USER]);    // 1
console.log("order id:", order[ID_ORDER]); // 1001



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Make a Plain Object Iterable
// Add Symbol.iterator to a colorPalette object with properties:
//   primary, secondary, accent
// Make it iterable so for...of yields each color value in order.
// Verify with a for...of loop.

// Write your code here:
console.log("\n--- TODO 2: Iterable colorPalette ---");

// Symbol.iterator is a "well-known Symbol" — implementing it tells built-in
// language constructs (for...of, spread, destructuring) how to walk the object.
// The method must return an iterator (something with .next()). Delegating to
// an array's own iterator is the simplest way to satisfy the protocol.
const colorPalette = {
  primary: "blue",
  secondary: "green",
  accent: "orange",
  [Symbol.iterator]() {
    const values = [this.primary, this.secondary, this.accent];
    return values[Symbol.iterator]();
  }
};

for (const color of colorPalette) {
  console.log("color:", color);
}

// Spread also uses Symbol.iterator under the hood:
console.log("spread:", [...colorPalette]);
