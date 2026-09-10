// ─── Higher-Order Functions ───────────────────────────────────────────────────

// EXAMPLE 1: Custom map, filter, reduce built from scratch
console.log("--- Example 1: Custom map / filter / reduce ---");

function myMap(arr, fn) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(fn(arr[i], i, arr));
  }
  return result;
}

function myFilter(arr, predicate) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i, arr)) result.push(arr[i]);
  }
  return result;
}

function myReduce(arr, fn, initial) {
  let acc = initial;
  for (let i = 0; i < arr.length; i++) {
    acc = fn(acc, arr[i], i, arr);
  }
  return acc;
}

const nums = [1, 2, 3, 4, 5];

const doubled   = myMap(nums, x => x * 2);
const evens     = myFilter(nums, x => x % 2 === 0);
const total     = myReduce(nums, (acc, x) => acc + x, 0);

console.log("doubled:", doubled);   // [2, 4, 6, 8, 10]
console.log("evens:", evens);       // [2, 4]
console.log("total:", total);       // 15


// EXAMPLE 2: Chaining custom HOFs
console.log("\n--- Example 2: Chaining HOFs ---");

// Double all numbers, keep only those > 4, then sum them
const result = myReduce(
  myFilter(
    myMap([1, 2, 3, 4, 5], x => x * 2),
    x => x > 4
  ),
  (acc, x) => acc + x,
  0
);

console.log("chain result:", result); // 6+8+10 = 24

// Functions are first-class — we can store them and pass them around:
const isEven = x => x % 2 === 0;
const square = x => x * x;

console.log(myFilter(nums, isEven));      // [2, 4]
console.log(myMap(nums, square));         // [1, 4, 9, 16, 25]


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: compose
// Write compose(f, g) that returns a new function applying g first, then f.
// The returned function: x => f(g(x))
// Test: compose(double, addOne)(5) should return 12
//   addOne(5) = 6, then double(6) = 12

const double  = x => x * 2;
const addOne  = x => x + 1;

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: repeat
// Write repeat(n, fn) that calls fn exactly n times, passing the iteration index.
// Use it to log "Hello #0" through "Hello #4".

// Write your code here:
