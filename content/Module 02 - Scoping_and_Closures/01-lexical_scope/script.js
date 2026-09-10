// ─── Lexical Scope and the Scope Chain ───────────────────────────────────────

// EXAMPLE 1: Scope chain traversal
// The innermost function can read variables from every enclosing scope.
console.log("--- Example 1: Scope chain ---");

const appName = "MyApp"; // global (module) scope

function outerFn() {
  const outerVar = "I am outer";

  function middleFn() {
    const middleVar = "I am middle";

    function innerFn() {
      const innerVar = "I am inner";
      // innerFn can read from all three enclosing scopes:
      console.log(innerVar);  // own scope
      console.log(middleVar); // middle scope
      console.log(outerVar);  // outer scope
      console.log(appName);   // module scope
    }

    innerFn();
  }

  middleFn();
}

outerFn();

// Sibling functions do NOT share each other's locals:
function siblingA() {
  const secretA = "A's secret";
}

function siblingB() {
  // console.log(secretA); // ReferenceError — secretA is not in siblingB's scope chain
  console.log("siblingB cannot see siblingA's local variables");
}

siblingA();
siblingB();


// ─── EXAMPLE 2: Scope is fixed at author-time (lexical), not call-time ───────
console.log("\n--- Example 2: Lexical vs dynamic scope ---");

const color = "blue";

function printColor() {
  // This function always looks up 'color' where it was DEFINED,
  // not where it is called from.
  console.log(color);
}

function useRedTheme() {
  const color = "red"; // local shadow — does NOT affect printColor
  printColor();        // still logs "blue"
}

printColor();    // "blue"
useRedTheme();   // "blue" — even though called from inside a scope with color = "red"


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Greeting Factory
// Write a function makeGreeting(greeting) that returns an inner function greet(name).
// greet(name) should log the greeting and name together, e.g. "Hello, World!"
// The inner function must read 'greeting' from the outer scope — not as a parameter.
// Call makeGreeting("Hello") and store the result, then call it with a name.

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Lexical vs. Dynamic Scope
// 1. Define x = "outer" at this (module) level.
// 2. Define readX() that logs x.
// 3. Inside a separate function changeX(), declare let x = "inner" and call readX().
// 4. Call changeX() and observe the output.
// Add a comment predicting and explaining the output BEFORE running it.

// Your prediction: readX() will log _________ because _________

// Write your code here:
