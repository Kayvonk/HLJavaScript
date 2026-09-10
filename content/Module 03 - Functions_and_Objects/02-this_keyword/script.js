// ─── The `this` Keyword ───────────────────────────────────────────────────────

// EXAMPLE 1: this-loss bug with setTimeout — arrow function fix
console.log("--- Example 1: Losing and preserving this ---");

const timer = {
  seconds: 0,
  // BROKEN: regular function callback loses `this`
  startBroken() {
    setTimeout(function () {
      this.seconds++; // `this` is undefined (strict) or global — NOT timer
      console.log("broken seconds:", this.seconds); // NaN or error
    }, 0);
  },
  // FIXED: arrow function inherits `this` from startFixed's context
  startFixed() {
    setTimeout(() => {
      this.seconds++;
      console.log("fixed seconds:", this.seconds); // 1
    }, 0);
  }
};

timer.startBroken();
timer.startFixed();


// ─── EXAMPLE 2: .call(), .apply(), and .bind() ───────────────────────────────
console.log("\n--- Example 2: Explicit binding ---");

function introduce(title, hobby) {
  console.log(`${title} ${this.name} enjoys ${hobby}.`);
}

const alice = { name: "Alice" };
const bob   = { name: "Bob" };

// .call — arguments listed individually
introduce.call(alice, "Dr.", "reading");   // Dr. Alice enjoys reading.

// .apply — arguments passed as an array
introduce.apply(bob, ["Mr.", "cycling"]);  // Mr. Bob enjoys cycling.

// .bind — returns a NEW function with this locked in
const aliceIntro = introduce.bind(alice);
aliceIntro("Prof.", "hiking"); // Prof. Alice enjoys hiking.

// The bound function can be called later, passed as a callback, etc.
// `this` is permanently set to `alice` regardless of how it is called.


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Lost this and .bind()
// 1. Create an object 'calculator' with properties a, b, and a method sum()
//    that returns this.a + this.b.
// 2. Extract the sum method into a variable and call it — observe the broken result.
// 3. Fix it using .bind(calculator) and call the bound version.
// Log the results of the broken and fixed calls.

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: .call() vs .apply()
// Write a standalone function greet(greeting, punctuation) that logs:
//   greeting + ", " + this.name + punctuation
// Use .call() to invoke it with one object (pass arguments individually).
// Use .apply() to invoke it with a different object (pass arguments as an array).

// Write your code here:
