// ─── async/await Internals ────────────────────────────────────────────────────

// Simulated async operations (each returns a Promise after a delay)
function getUser() {
  return new Promise(resolve => setTimeout(() => resolve({ id: 1, name: "Alice" }), 100));
}
function getProfile(userId) {
  return new Promise(resolve => setTimeout(() => resolve({ userId, bio: "Engineer" }), 150));
}
function getNotifications(userId) {
  return new Promise(resolve => setTimeout(() => resolve([{ msg: "Welcome!" }]), 120));
}


// EXAMPLE 1: async/await vs Promise chain — same behavior, cleaner syntax
console.log("--- Example 1: async/await vs Promise chain ---");

// Promise chain version:
function loadWithPromises() {
  return getUser()
    .then(user => getProfile(user.id).then(profile => ({ user, profile })))
    .then(({ user, profile }) =>
      getNotifications(user.id).then(notifs => ({ user, profile, notifs }))
    )
    .then(result => console.log("promise chain result:", result.user.name));
}

// async/await version — reads like synchronous code:
async function loadWithAwait() {
  const user    = await getUser();
  const profile = await getProfile(user.id);
  const notifs  = await getNotifications(user.id);
  console.log("async/await result:", user.name);
}

loadWithPromises();
loadWithAwait();


// ─── EXAMPLE 2: Sequential vs parallel — timing comparison ───────────────────
console.log("\n--- Example 2: Sequential vs parallel timing ---");

async function sequential() {
  const t0 = performance.now();
  const profile = await getProfile(1);  // waits ~150ms
  const notifs  = await getNotifications(1); // waits another ~120ms
  const elapsed = (performance.now() - t0).toFixed(0);
  console.log(`sequential: ~${elapsed}ms`); // ~270ms (sum of both)
}

async function parallel() {
  const t0 = performance.now();
  const [profile, notifs] = await Promise.all([
    getProfile(1),       // both start at the same time
    getNotifications(1)  // both resolve independently
  ]);
  const elapsed = (performance.now() - t0).toFixed(0);
  console.log(`parallel: ~${elapsed}ms`); // ~150ms (max of both)
}

sequential();
parallel();


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: loadDashboard (sequential)
// Write an async function loadDashboard() that:
//   1. Awaits getUser()
//   2. Awaits getProfile(user.id)
//   3. Awaits getNotifications(user.id)
// Use try/catch/finally:
//   - catch logs any error
//   - finally always logs "loading complete"
// Call loadDashboard() at the end.

// Write your code here:
// `async` guarantees the function returns a Promise; `await` pauses inside the
// function until the awaited Promise settles, then resumes with its resolved
// value (or throws its rejection). try/catch on await works because a rejected
// Promise is desugared into a thrown exception at the await point.
async function loadDashboard() {
  try {
    const user    = await getUser();
    const profile = await getProfile(user.id);
    const notifs  = await getNotifications(user.id);
    console.log("dashboard (sequential):", user.name, profile.bio, notifs.length, "notif(s)");
  } catch (err) {
    console.error("dashboard error:", err.message);
  } finally {
    console.log("loading complete");
  }
}

loadDashboard();



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: loadDashboard (parallel)
// Refactor loadDashboard() so getProfile and getNotifications run in parallel.
// They don't depend on each other — only both depend on the user.
// Use await Promise.all([...]) and array destructuring.
// Add performance.now() timing and log the elapsed ms for both versions.

// Write your code here:
// Sequential await = waterfall: each request waits for the previous one.
// Kick off independent Promises FIRST, then await Promise.all — the runtime
// then waits for the SLOWEST of them (max), not the sum. This is the single
// biggest perf win with async/await.
async function loadDashboardParallel() {
  const t0 = performance.now();
  try {
    const user = await getUser();
    const [profile, notifs] = await Promise.all([
      getProfile(user.id),
      getNotifications(user.id)
    ]);
    const elapsed = (performance.now() - t0).toFixed(0);
    console.log(`dashboard (parallel) ~${elapsed}ms:`, user.name, profile.bio, notifs.length, "notif(s)");
  } catch (err) {
    console.error("dashboard error:", err.message);
  } finally {
    console.log("loading complete (parallel)");
  }
}

async function loadDashboardSequentialTimed() {
  const t0 = performance.now();
  const user    = await getUser();
  const profile = await getProfile(user.id);
  const notifs  = await getNotifications(user.id);
  const elapsed = (performance.now() - t0).toFixed(0);
  console.log(`dashboard (sequential-timed) ~${elapsed}ms:`, user.name, profile.bio, notifs.length, "notif(s)");
}

loadDashboardSequentialTimed();
loadDashboardParallel();
