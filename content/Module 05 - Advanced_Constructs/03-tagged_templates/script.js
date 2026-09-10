// ─── Tagged Template Literals ─────────────────────────────────────────────────

// EXAMPLE 1: highlight tag — wraps interpolated values in ** markers
console.log("--- Example 1: highlight tag ---");

function highlight(strings, ...values) {
  // strings: ["Hello ", ", you have ", " messages"]
  // values:  ["Alice", 5]
  // strings.length === values.length + 1 — always
  return strings.reduce((result, str, i) => {
    const val = i > 0 ? `**${values[i - 1]}**` : "";
    return result + val + str;
  });
}

const name  = "Alice";
const count = 5;
const msg   = highlight`Hello ${name}, you have ${count} messages`;
console.log(msg); // "Hello **Alice**, you have **5** messages"


// ─── EXAMPLE 2: safeHtml tag — escapes user-controlled interpolations ─────────
console.log("\n--- Example 2: safeHtml tag ---");

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeHtml(strings, ...values) {
  // Static parts are trusted (written by the developer).
  // Interpolated values are untrusted (could be user input).
  return strings.reduce((result, str, i) => {
    const val = i > 0 ? escapeHtml(values[i - 1]) : "";
    return result + val + str;
  });
}

const userInput = '<script>alert("XSS")</script>';
const html = safeHtml`<p>Hello, ${userInput}!</p>`;
console.log(html);
// <p>Hello, &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;!</p>
// — the script tag is safely escaped, not executable


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: currency Tag
// Write a currency tag function that formats interpolated numbers as USD.
// Use: number.toLocaleString("en-US", { style: "currency", currency: "USD" })
// Leave non-numeric interpolated values unchanged.
// Test: currency`Your total is ${149.99} and you saved ${12.50}`

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: debug Tag
// Write a debug tag that:
//   1. Logs each static string piece as: "string: <piece>"
//   2. Logs each interpolated value as: "value: <val>"
//   3. Returns the fully assembled string (same as a normal template literal)
// Test it with a template containing at least two interpolated values.

// Write your code here:
