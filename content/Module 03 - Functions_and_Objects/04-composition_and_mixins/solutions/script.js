// ─── Composition and Mixins ───────────────────────────────────────────────────

// EXAMPLE 1: Behavior objects composed with Object.assign
console.log("--- Example 1: Role-based composition ---");

const canFly = {
  fly() { console.log(`${this.name} is flying`); }
};

const canSwim = {
  swim() { console.log(`${this.name} is swimming`); }
};

const canRun = {
  run() { console.log(`${this.name} is running`); }
};

// A duck can fly, swim, and run — no inheritance chain needed
const duck = Object.assign({}, canFly, canSwim, canRun, { name: "Donald" });

duck.fly();   // Donald is flying
duck.swim();  // Donald is swimming
duck.run();   // Donald is running

// A fish only gets the swimming behavior
const fish = Object.assign({}, canSwim, { name: "Nemo" });
fish.swim();  // Nemo is swimming
// fish.fly() would throw — canFly was not composed in


// ─── EXAMPLE 2: Mixin applied to a class prototype ───────────────────────────
console.log("\n--- Example 2: Mixin on a class prototype ---");

const Serializable = {
  toJSON() {
    return JSON.stringify(this);
  },
  fromJSON(jsonStr) {
    return JSON.parse(jsonStr);
  }
};

class User {
  constructor(name, email) {
    this.name  = name;
    this.email = email;
  }
}

// Apply the mixin — all User instances now have toJSON and fromJSON
Object.assign(User.prototype, Serializable);

const user = new User("Alice", "alice@example.com");
const json = user.toJSON();
console.log("serialized:", json);
console.log("parsed:", user.fromJSON(json));
// User did not extend Serializable — behavior was mixed in


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Compose Three Behaviors
// Create three behavior objects:
//   - canGreet: greet() logs "Hello, I am " + this.name
//   - canCalculate: add(a, b) returns a + b
//   - canLog: log(msg) logs the message
// Compose them into an 'assistant' object that also has a name property.
// Call all three methods on assistant.

// Write your code here:
// Composition favors "has-a" over "is-a". Instead of a rigid inheritance chain,
// we assemble capabilities from independent role objects — flexible and avoids
// the diamond/fragile-base-class problems of deep hierarchies.
const canGreet = {
  greet() { console.log("Hello, I am " + this.name); }
};

const canCalculate = {
  add(a, b) { return a + b; }
};

const canLog = {
  log(msg) { console.log(msg); }
};

const assistant = Object.assign(
  {},
  canGreet,
  canCalculate,
  canLog,
  { name: "Aria" }
);

assistant.greet();
console.log("assistant.add(2, 3):", assistant.add(2, 3));
assistant.log("assistant is logging a message");



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Timestamped Mixin
// Define a Timestamped mixin with:
//   - createdAt(): returns new Date().toISOString()
//   - getAge(): logs "Created at: " + this.createdAt()
// Apply it to a Document class using Object.assign(Document.prototype, Timestamped).
// Create a Document instance and call getAge() to verify the mixin works.

// Write your code here:
// A mixin copied onto a class prototype is shared by every instance without
// occupying the single [[Prototype]] slot — leaving `extends` free for real
// hierarchies. The mixin methods still use `this`, so they bind to the instance.
const Timestamped = {
  createdAt() { return new Date().toISOString(); },
  getAge() { console.log("Created at: " + this.createdAt()); }
};

class Document {
  constructor(title) {
    this.title = title;
  }
}

Object.assign(Document.prototype, Timestamped);

const doc = new Document("Report");
doc.getAge();
