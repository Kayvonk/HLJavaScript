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
console.log("\n--- TODO 1: TDZ in Action ---");

// The TDZ is the region of code between the start of a block and the line where
// a `let`/`const` is initialized. The binding *exists* during this window
// (so it is not a "not declared" error) but the engine deliberately refuses to
// let you read or write it — reading throws a ReferenceError.
try {
  console.log(apiKey); // ReferenceError — apiKey exists but is in the TDZ
} catch (e) {
  console.log(e.name); // "ReferenceError"
}

const apiKey = "secret-123";
console.log(apiKey); // "secret-123" — past the TDZ now

// Plain-language explanation of the TDZ:
// The variable is "reserved" from the top of its block but is not yet "usable"
// until execution reaches its declaration line. This differs from a missing
// variable (undeclared) in that the identifier DOES exist in the scope — it is
// simply locked. The engine enforces this so `const`/`let` can guarantee that
// a variable is never observed before its initializer runs.


// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Function Declaration vs. Function Expression
// 1. Call a function DECLARATION before its line — it should work fine.
// 2. Call a const FUNCTION EXPRESSION before its line inside a try/catch — log what happens.
// Add comments explaining why the behavior differs between the two.

// Write your code here:
console.log("\n--- TODO 2: Function Declaration vs. Function Expression ---");

// Function declarations are fully hoisted: both the name AND the body are
// available at the top of the scope, so calling before the source line works.
declaredFn(); // works — logs message

function declaredFn() {
  console.log("declaredFn: called before its source line");
}

// A const function expression follows const's TDZ rules. The identifier is
// hoisted but locked until the assignment line, so calling early throws
// a ReferenceError (not a TypeError like a var-based expression would).
try {
  expressionFn(); // ReferenceError — expressionFn is in the TDZ
} catch (e) {
  console.log(e.name + ": expressionFn could not be called before its line");
}

const expressionFn = function () {
  console.log("expressionFn: works after the assignment line");
};

expressionFn(); // works — past the TDZ

// WHY the behaviors differ:
// - `function declaredFn() {}` is processed during the creation phase; the
//   engine allocates the full function object immediately, so the identifier
//   is bound to a callable value from the very start of the scope.
// - `const expressionFn = function () {}` uses a const binding that is in the
//   TDZ until its initializer runs. The engine knows the name exists but
//   refuses any access until the assignment executes.
