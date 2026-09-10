# Activity 20: Tagged Template Literals

## Overview
A **tagged template literal** is a template string called with a leading function name: `` tag`Hello ${name}` ``. The tag function receives the static string pieces as an array and the interpolated values as separate arguments. This lets you control how the final string is assembled — enabling HTML sanitization, currency formatting, localization, and other DSL-style patterns that regular string concatenation can't express safely.

## Learning Objectives
- Describe the signature of a tag function: `(strings, ...values)`
- Explain the relationship between `strings` length and `values` length
- Write tag functions that process interpolated values before assembling the result
- Apply tagging to sanitization and formatting use cases

## Instructions

The working examples in `script.js` show a `highlight` tag and a `safeHtml` tag. Study how the tag function interleaves static strings with processed values. Then complete the TODOs.

### TODO 1 — currency Tag
Write a `currency` tag function that formats any interpolated number as USD (using `toLocaleString("en-US", { style: "currency", currency: "USD" })`), while leaving static string portions unchanged. Test it with a sentence containing two numeric values.

> **Hint:** A tag function signature is `(strings, ...values)`. The relationship is always: `strings.length === values.length + 1`. To assemble the result, interleave them:
> ```js
> function currency(strings, ...values) {
>   return strings.reduce((result, str, i) => {
>     const val = values[i - 1];
>     const formatted = typeof val === "number"
>       ? val.toLocaleString("en-US", { style: "currency", currency: "USD" })
>       : val;
>     return result + formatted + str;
>   });
> }
> ```
> Test: `` currency`Your total is ${149.99} and you saved ${12.50}` ``

### TODO 2 — debug Tag
Write a `debug` tag function that logs each static string piece and each interpolated value on its own labeled line (`"string: ..."`, `"value: ..."`), then returns the fully assembled string. This is a development tool for inspecting the parts of a template literal.

> **Hint:** The tag function has full access to both arrays before assembling the string. Log them first, then reduce/join to produce the final result. The output might look like:
> ```
> string: "Hello, "
> value: "Alice"
> string: "! You have "
> value: 5
> string: " messages."
> ```
> Then return `"Hello, Alice! You have 5 messages."`.

## What You Learned
- A tag function intercepts template literal evaluation before the string is assembled
- `strings` is a frozen array of static pieces; `values` contains the interpolated expressions' results
- `strings.length` is always exactly one more than `values.length`
- Tagged templates enable safe HTML, SQL query building, i18n, styled components, and more — all without new syntax

## Stretch Challenges
1. Research `String.raw` — it is a built-in tag function. Use it to write a Windows file path without needing to escape backslashes
2. Write an `sql` tag function that sanitizes all interpolated values using `?` placeholders, returning a `{ query, params }` object safe for a parameterized query
3. Write an `i18n` tag that looks up translations: given a dictionary `{ "Hello, {0}!": "Hola, {0}!" }`, the tag replaces the static string pattern with its translation and fills in the interpolated values
