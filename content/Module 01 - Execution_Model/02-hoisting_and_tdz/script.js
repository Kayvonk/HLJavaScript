// ─── Hoisting and the Temporal Dead Zone ─────────────────────────────────────

// EXAMPLE 1: var hoisting vs let/const TDZ
console.log("--- Example 1: var vs let hoisting ---");

// var is hoisted and initialized to undefined — no error, but no value yet
console.log(score); // undefined
var score = 100;
console.log(score); // 100

// Accessing a let variable before its declaration causes a ReferenceError.
// Uncomment the line below to see the error:
// console.log(level); // ReferenceError: Cannot access 'level' before initialization
let level = 5;
console.log(level); // 5

// ─── EXAMPLE 2: TDZ caught with try/catch ────────────────────────────────────
console.log("\n--- Example 2: TDZ caught safely ---");

try {
  console.log(username); // ReferenceError — username is in the TDZ
} catch (e) {
  console.log(e.name);    // "ReferenceError"
  console.log("username is in the TDZ — it exists in memory but cannot be read yet");
}

const username = "alex";
console.log(username);  // "alex" — past the TDZ now

// ─── EXAMPLE 3: Function declaration vs var function expression ───────────────
console.log("\n--- Example 3: Function declaration hoisting ---");

// Function declaration: fully hoisted — callable before its line
sayHello(); // "Hello!"

function sayHello() {
  console.log("Hello!");
}

// var function expression: the var is hoisted as undefined, not as the function
try {
  sayBye(); // TypeError: sayBye is not a function
} catch (e) {
  console.log(e.name); // "TypeError" — var is undefined, calling undefined() throws
}

var sayBye = function () {
  console.log("Bye!");
};

sayBye(); // "Bye!" — works fine after the assignment line


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: TDZ in Action
// Access a const variable BEFORE its declaration inside a try/catch block.
// Log the error name, then declare the variable and log its value.
// Add a comment explaining what the Temporal Dead Zone means in plain language.

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Function Declaration vs. Function Expression
// 1. Call a function DECLARATION before its line — it should work fine.
// 2. Call a const FUNCTION EXPRESSION before its line inside a try/catch — log what happens.
// Add comments explaining why the behavior differs between the two.

// Write your code here:
