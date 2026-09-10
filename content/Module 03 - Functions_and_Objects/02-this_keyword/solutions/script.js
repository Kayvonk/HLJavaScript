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
// `this` is determined by HOW a function is called, not where it is defined.
// When we detach a method (`const s = calculator.sum`) and call it as `s()`,
// the implicit object binding is lost — `this` falls back to undefined/global.
// .bind() creates a new function with `this` permanently locked to a value.
const calculator = {
  a: 10,
  b: 5,
  sum() {
    return this.a + this.b;
  }
};

const brokenSum = calculator.sum;
try {
  console.log("broken sum:", brokenSum()); // NaN or throws in strict mode
} catch (err) {
  console.log("broken sum threw:", err.message);
}

const fixedSum = calculator.sum.bind(calculator);
console.log("fixed sum:", fixedSum()); // 15



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: .call() vs .apply()
// Write a standalone function greet(greeting, punctuation) that logs:
//   greeting + ", " + this.name + punctuation
// Use .call() to invoke it with one object (pass arguments individually).
// Use .apply() to invoke it with a different object (pass arguments as an array).

// Write your code here:
// .call and .apply do the SAME thing (invoke with an explicit `this`) but differ
// in how they take arguments: .call takes them individually, .apply takes an array.
// Mnemonic: A for Array (apply), C for Comma-separated (call).
function greet(greeting, punctuation) {
  console.log(greeting + ", " + this.name + punctuation);
}

const carol = { name: "Carol" };
const dave  = { name: "Dave" };

greet.call(carol, "Hello", "!");           // Hello, Carol!
greet.apply(dave, ["Hi", "?"]);            // Hi, Dave?
