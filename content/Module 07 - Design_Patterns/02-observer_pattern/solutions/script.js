// ─── Observer and Pub-Sub Patterns ───────────────────────────────────────────

// EXAMPLE 1: EventEmitter class
console.log("--- Example 1: EventEmitter ---");

class EventEmitter {
  constructor() {
    this._listeners = new Map();
  }

  on(event, fn) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    this._listeners.get(event).push(fn);
    return this; // allow chaining
  }

  off(event, fn) {
    const fns = this._listeners.get(event);
    if (fns) {
      this._listeners.set(event, fns.filter(f => f !== fn));
    }
    return this;
  }

  emit(event, ...args) {
    const fns = this._listeners.get(event) ?? [];
    fns.forEach(fn => fn(...args));
    return this;
  }
}

const emitter = new EventEmitter();
const handlerA = data => console.log("handlerA received:", data);
const handlerB = data => console.log("handlerB received:", data);

emitter.on("data", handlerA);
emitter.on("data", handlerB);
emitter.emit("data", { value: 42 }); // both fire

emitter.off("data", handlerA);
emitter.emit("data", { value: 99 }); // only handlerB fires


// ─── EXAMPLE 2: Pub-Sub broker (no direct publisher/subscriber coupling) ─────
console.log("\n--- Example 2: Pub-Sub broker ---");

const pubSub = (() => {
  const channels = new Map();
  return {
    subscribe(channel, fn) {
      if (!channels.has(channel)) channels.set(channel, []);
      channels.get(channel).push(fn);
      return () => {
        channels.set(channel, channels.get(channel).filter(f => f !== fn));
      };
    },
    publish(channel, payload) {
      (channels.get(channel) ?? []).forEach(fn => fn(payload));
    }
  };
})();

// Publisher and subscribers have zero direct dependency on each other
const unsub = pubSub.subscribe("user:login", ({ userId }) => {
  console.log("Analytics: user logged in:", userId);
});
pubSub.subscribe("user:login", ({ userId }) => {
  console.log("Welcome email queued for:", userId);
});

pubSub.publish("user:login", { userId: 42 });
unsub(); // remove first subscriber
pubSub.publish("user:login", { userId: 43 }); // only second fires


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Store with setState
// Build a Store class that:
//   - holds a 'state' object
//   - has setState(partial) that merges partial and emits "change"
//   - has onChange(fn) that subscribes fn to "change"
// Create two independent subscribers:
//   1. logs state.count
//   2. logs state.message
// Call setState twice with different updates and verify both subscribers fire.
// You can extend EventEmitter or use it as a dependency.

// Write your code here:
console.log("\n--- TODO 1: Store with setState ---");

// Observer pattern: the Store owns the list of subscribers and notifies them
// on state change. Extending EventEmitter reuses the pub/sub plumbing so
// Store just adds a state slot and a setState method that emits "change".
class Store extends EventEmitter {
  constructor(initialState = {}) {
    super();
    this.state = initialState;
  }

  setState(partial) {
    // Merge (not replace) to preserve untouched keys — immutable update.
    this.state = { ...this.state, ...partial };
    this.emit("change", this.state);
  }

  onChange(fn) {
    this.on("change", fn);
  }
}

const store = new Store({ count: 0, message: "hello" });

store.onChange(s => console.log("count subscriber sees count =", s.count));
store.onChange(s => console.log("message subscriber sees message =", s.message));

store.setState({ count: 1 });                   // both subscribers fire
store.setState({ message: "goodbye", count: 2 }); // both subscribers fire



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: once() Listener
// Add a once(event, fn) method to EventEmitter (or your Store) that:
//   - subscribes fn wrapped so it auto-unsubscribes after first fire
// Test: register a once-listener and a regular listener on the same event.
// Emit twice — the once-listener fires only on the first emit.

// Write your code here:
console.log("\n--- TODO 2: once() Listener ---");

// Self-removing wrapper: we register `wrapper` (not fn) so off() can find and
// remove exactly the wrapper closure after the first fire. The named wrapper
// gives `off` a stable reference — anonymous inline fns would be unremovable.
EventEmitter.prototype.once = function (event, fn) {
  const wrapper = (...args) => {
    this.off(event, wrapper);
    fn(...args);
  };
  this.on(event, wrapper);
  return this;
};

const bus = new EventEmitter();
bus.on("ping", n => console.log("regular listener heard ping", n));
bus.once("ping", n => console.log("once listener heard ping", n));

bus.emit("ping", 1); // both fire
bus.emit("ping", 2); // only the regular listener fires
