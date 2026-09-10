// ─── Garbage Collection ───────────────────────────────────────────────────────

// EXAMPLE 1: Circular references — NOT a leak in modern engines
console.log("--- Example 1: Circular references ---");

function createCircularPair() {
  const nodeA = { name: "A" };
  const nodeB = { name: "B" };

  nodeA.partner = nodeB; // A references B
  nodeB.partner = nodeA; // B references A — circular!

  // While inside this function: both are reachable via nodeA and nodeB.
  // Old reference-counting engines would leak this — the count never reaches 0.
  // Mark-and-sweep: when createCircularPair() returns, nodeA and nodeB
  // go out of scope — there are no more roots holding them.
  // Both become unreachable (even though they still point at each other)
  // and are eligible for collection.
  console.log("created circular pair:", nodeA.name, "<->", nodeB.name);
}

createCircularPair();
// After this call returns, nodeA and nodeB have no references from any root.
// The circular link between them doesn't prevent collection.


// ─── EXAMPLE 2: Closure extending object lifetime ────────────────────────────
console.log("\n--- Example 2: Closure keeps variable alive ---");

function makeProcessor() {
  const data = { items: [1, 2, 3, 4, 5] };

  // This closure captures 'data' from makeProcessor's scope.
  // As long as the returned function is reachable, 'data' stays in memory.
  return function process() {
    console.log("processing", data.items.length, "items");
  };
}

let processor = makeProcessor();
// 'data' inside makeProcessor is still alive — processor's closure holds it.
processor();   // "processing 5 items"

processor = null;
// Now the closure is unreachable. 'data' inside it is also unreachable.
// Both the closure and 'data' are eligible for GC.
console.log("processor set to null — closure and its data are now collectible");


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Circular References and Reachability
// 1. Write a function that creates two objects with a circular reference.
// 2. Assign them to outer variables (let a, let b).
// 3. Set both to null.
// Add a comment at each step explaining reachability:
//   - after creation: are they reachable?
//   - after a = null but before b = null: is b still reachable?
//   - after both are null: are they reachable?

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Event Listener Leak — Before and After
// BEFORE (leaking version):
//   - Create a 'listeners' array.
//   - Write addListener() that: creates a large data array, pushes a closure
//     over that data into 'listeners'. The data can't be collected.
//
// AFTER (fixed version):
//   - Write removeListener(fn) that removes the specific function from 'listeners'.
//   - After removal, the closure (and bigData) become collectible.
//
// Add comments explaining what holds bigData in memory and what releases it.

// Write your code here:
