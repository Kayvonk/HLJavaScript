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



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Listener Accumulation
// Create a store object with a 'listeners' array.
// Register 3 listener functions (each can close over some local data).
// Then write a clearListeners() function that empties the array.
// Call clearListeners() and log the count after.
// Add a comment explaining what the closures capture and why clearing matters.

// Write your code here:
