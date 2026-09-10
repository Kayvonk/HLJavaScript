// ─── Memory Leaks ─────────────────────────────────────────────────────────────

// EXAMPLE 1: Forgotten interval — leaking vs fixed
console.log("--- Example 1: Forgotten interval ---");

// BEFORE (leaking):
// let data = [];
// setInterval(() => {
//   data.push({ time: Date.now(), reading: Math.random() });
//   // data grows forever — interval never clears, closure never releases
// }, 100);

// AFTER (fixed):
let intervalId = null;
let readings = [];

function startMonitor() {
  intervalId = setInterval(() => {
    readings.push({ time: Date.now(), reading: Math.random() });
  }, 50);
  console.log("Monitor started");
}

function stopMonitor() {
  clearInterval(intervalId); // stop the interval from firing
  intervalId = null;
  readings = [];             // release the accumulated data
  console.log("Monitor stopped and data cleared");
}

startMonitor();
setTimeout(() => {
  stopMonitor();
  console.log("readings after stop:", readings.length); // 0
}, 200);


// ─── EXAMPLE 2: Detached reference — holding removed objects alive ─────────────
console.log("\n--- Example 2: Detached reference ---");

// Simulated node cache (like a detached DOM node cache)
const nodeCache = {};

function createNode(id) {
  return { id, data: new Array(100).fill(id) };
}

// BEFORE (leaking):
function addNodeBefore(id) {
  nodeCache[id] = createNode(id);
  // "Remove" from active use, but nodeCache still holds the reference:
  // return { removed: true };
}

// AFTER (fixed):
function addNodeAfter(id) {
  const node = createNode(id);
  return {
    getNode: () => node,
    dispose: () => {
      delete nodeCache[id]; // explicitly remove the reference
      console.log(`Node ${id} disposed`);
    }
  };
}

const handle = addNodeAfter("n1");
console.log("node id:", handle.getNode().id);
handle.dispose(); // now the node is eligible for GC
console.log("nodeCache after dispose:", Object.keys(nodeCache).length); // 0


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Data Poller (start and stop)
// Write startDataPoller(interval) — starts a setInterval that pushes
// { timestamp, value } entries into an array every `interval` ms.
// Write stopDataPoller() — clears the interval and empties the array.
// Start the poller, let it run briefly (use setTimeout to stop it after 300ms).
// Add a comment explaining what would happen to memory without stopDataPoller.

// Write your code here:
console.log("\n--- TODO 1: Data Poller ---");

// A running setInterval is a live root: the timer keeps its callback alive,
// which keeps every variable the callback closes over alive too. Without a
// paired stop function, `pollerData` would grow indefinitely and the closure
// (plus whatever else it captured) could never be collected.
let pollerId = null;
let pollerData = [];

function startDataPoller(interval) {
  pollerId = setInterval(() => {
    pollerData.push({ timestamp: Date.now(), value: Math.random() });
  }, interval);
  console.log("Data poller started");
}

function stopDataPoller() {
  clearInterval(pollerId); // remove the interval root
  pollerId = null;
  pollerData = [];         // drop accumulated readings so they can be GC'd
  console.log("Data poller stopped, entries after stop:", pollerData.length);
}

startDataPoller(50);
setTimeout(() => {
  console.log("entries before stop:", pollerData.length);
  stopDataPoller();
}, 300);

// Without stopDataPoller(): the interval fires forever, pollerData grows
// unbounded, and the callback closure keeps everything alive → classic leak.



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Listener Accumulation
// Create a store object with a 'listeners' array.
// Register 3 listener functions (each can close over some local data).
// Then write a clearListeners() function that empties the array.
// Call clearListeners() and log the count after.
// Add a comment explaining what the closures capture and why clearing matters.

// Write your code here:
console.log("\n--- TODO 2: Listener Accumulation ---");

// Each listener is a closure. The closure captures the local variables in
// scope at creation (here: `payload`, an array). While the closure sits in
// `store.listeners`, the array is reachable via the store root → cannot be
// GC'd. Emptying `listeners` removes the last strong reference to each
// closure, which in turn releases the captured payloads.
const store = {
  listeners: [],
  clearListeners() {
    this.listeners.length = 0;
  }
};

function registerListenerWithPayload(label) {
  const payload = new Array(1000).fill(label); // captured by the closure
  store.listeners.push(() => {
    console.log(`listener "${label}" sees payload length`, payload.length);
  });
}

registerListenerWithPayload("A");
registerListenerWithPayload("B");
registerListenerWithPayload("C");
console.log("listener count before clear:", store.listeners.length);

store.clearListeners();
console.log("listener count after clear:", store.listeners.length);
// After clear: no strong reference to the closures → their captured payload
// arrays are eligible for garbage collection.
