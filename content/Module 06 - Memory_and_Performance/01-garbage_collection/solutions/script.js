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
console.log("\n--- TODO 1: Circular References and Reachability ---");

// Mark-and-sweep starts from ROOTS (globals, active stack frames, live
// closures) and marks everything transitively reachable. Circular references
// only matter if some root can still reach the cycle — the loop itself is
// invisible to the GC. Nothing marked = collected.
function makeCyclicPair() {
  const objA = { name: "A" };
  const objB = { name: "B" };
  objA.ref = objB;
  objB.ref = objA;
  return [objA, objB];
}

let [a, b] = makeCyclicPair();
// STEP 1 — after creation: both objects are reachable via the outer `a` and
// `b` bindings. Neither is eligible for collection.
console.log("after creation:", a.name, "<->", b.ref.name);

a = null;
// STEP 2 — after a = null but before b = null: object A is still reachable,
// but ONLY through b.ref (b -> A). B itself is reachable through the `b`
// binding. So both objects remain alive; nothing is collectible yet.
console.log("after a=null: b still reachable, and b.ref (A) reachable via b.");

b = null;
// STEP 3 — after both are null: no root points at either object. The A<->B
// cycle is now an isolated island. Mark-and-sweep never marks them, so both
// are eligible for garbage collection despite still referencing each other.
console.log("after b=null: both objects unreachable and collectible");



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
console.log("\n--- TODO 2: Event Listener Leak (Before / After) ---");

// BEFORE — the array is a live root. Every closure it holds keeps its captured
// `bigData` alive too, because closures retain their environment record. The
// array grows without bound and none of the bigData arrays can be collected.
const listeners = [];

function addListener() {
  const bigData = new Array(10000).fill("data");
  const listener = () => console.log("listener sees length:", bigData.length);
  listeners.push(listener);
  return listener; // return so caller can remove later (needed for the fix)
}

const l1 = addListener();
const l2 = addListener();
console.log("listener count after 2 adds:", listeners.length);
// bigData for l1 and l2 is retained: listeners[] -> closure -> [[env]] -> bigData

// AFTER — provide an explicit removal. Splicing the closure out of `listeners`
// drops the only strong reference to it. Once the closure is unreachable, its
// captured `bigData` has no root either, so both become collectible.
function removeListener(fn) {
  const idx = listeners.indexOf(fn);
  if (idx !== -1) listeners.splice(idx, 1);
}

removeListener(l1);
removeListener(l2);
console.log("listener count after removal:", listeners.length);
// Now bigData arrays for l1/l2 are eligible for GC — no root retains them.
