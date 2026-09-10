# Activity 26: Observer and Pub-Sub Patterns

## Overview
The **Observer pattern** decouples an object (the subject/publisher) from code that reacts to its changes (observers/listeners). The classic form has subjects maintaining a direct list of observers. **Pub-Sub** introduces a **broker** (event channel) between publishers and subscribers — publishers don't know who is subscribed, and subscribers don't know who published. Both patterns are foundational to event-driven architectures, UI state management, and real-time systems.

## Learning Objectives
- Implement an `EventEmitter` class with `on`, `off`, and `emit` methods
- Build a stateful `Store` that emits change events when state is updated
- Explain the difference between observer (direct coupling) and pub-sub (broker intermediary)
- Implement a `once(event, fn)` listener that auto-unsubscribes after the first event

## Instructions

Study the `EventEmitter` class and the `Store` using it in `script.js`. Notice how multiple subscribers react independently to the same state change. Then complete the TODOs.

### TODO 1 — Store with setState
Build a `Store` class that holds a `state` object, provides a `setState(partial)` method that merges the partial state and emits a `"change"` event, and allows subscribing with `onChange(fn)`. Create two independent subscribers — one that logs `state.count`, another that logs `state.message` — and call `setState` twice with different updates.

> **Hint:** `Store` can extend `EventEmitter` or hold one as a private field. `setState` should merge (not replace) the new state using spread, then emit `"change"` with the new state:
> ```js
> setState(partial) {
>   this.state = { ...this.state, ...partial };
>   this.emit("change", this.state);
> }
> onChange(fn) {
>   this.on("change", fn);
> }
> ```
> Two subscribers to `"change"` both fire every time `setState` is called — they are independent.

### TODO 2 — once() Listener
Add a `once(event, fn)` method to `EventEmitter` that automatically unsubscribes after the first time the event fires. Verify the listener fires on the first emit and does NOT fire on the second emit.

> **Hint:** Create a wrapper function that calls `fn` and then immediately calls `this.off(event, wrapper)`:
> ```js
> once(event, fn) {
>   const wrapper = (...args) => {
>     fn(...args);
>     this.off(event, wrapper);
>   };
>   this.on(event, wrapper);
> }
> ```
> The `off` call removes the *wrapper* — so the wrapper must be stored somewhere that `off` can find it.

## What You Learned
- EventEmitter decouples producers and consumers — adding a new subscriber doesn't change the emitter
- Observer pattern: the subject holds direct references to its observers
- Pub-Sub pattern: a broker/channel sits between publishers and subscribers — total decoupling
- `once()` is a natural extension: register → fire once → auto-unregister

## Stretch Challenges
1. Add error handling to `EventEmitter.emit()` — if a listener throws, catch the error, log it, and continue calling the remaining listeners
2. Implement a `removeAllListeners(event?)` method — removes all listeners for a specific event (or all events if called without arguments)
3. Research how Node.js's built-in `EventEmitter` works and compare it to your implementation — what edge cases does the Node version handle?
