const out = document.getElementById("out");
const log = (msg) => (out.textContent += msg + "\n");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function day1() {
    log("Waiting 2 seconds...");
    await delay(2000);
    log("This prints after 2 seconds");
}

function randomStep(name) {
    const ms = Math.floor(Math.random() * 1000) + 200;
    return new Promise((resolve) => setTimeout(() => { log(`${name} done (${ms}ms)`); resolve(name); }, ms));
}

function day2() {
    const start = performance.now();
    randomStep("Step 1")
        .then(() => randomStep("Step 2"))
        .then(() => randomStep("Step 3"))
        .then(() => log(`Total: ${Math.round(performance.now() - start)}ms`));
}

async function getUserOrDefault(id) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (response.status === 404) {
        return { id, name: "Unknown User", email: "n/a" };
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

async function day3() {
    log("User 1: " + JSON.stringify(await getUserOrDefault(1)));
    log("User 9999: " + JSON.stringify(await getUserOrDefault(9999)));
}

function loadUserCb(id, callback) {
    setTimeout(() => callback({ id, name: "User " + id }), 500);
}
function loadUserAsync(id) {
    return new Promise((resolve) => loadUserCb(id, resolve));
}
async function day4() {
    const user = await loadUserAsync(7);
    log("Loaded with async/await: " + JSON.stringify(user));
}

async function day5() {
    const base = "https://jsonplaceholder.typicode.com";
    const requests = [
        fetch(`${base}/users/1`).then((r) => r.json()).then((d) => { log("Finished: user " + d.name); return d; }),
        fetch(`${base}/posts/1`).then((r) => r.json()).then((d) => { log("Finished: post " + d.title); return d; }),
        fetch(`${base}/todos/1`).then((r) => r.json()).then((d) => { log("Finished: todo " + d.title); return d; }),
    ];
    const results = await Promise.allSettled(requests);
    results.forEach((r, i) => log(`Request ${i + 1}: ${r.status}`));
}

const days = { 1: day1, 2: day2, 3: day3, 4: day4, 5: day5 };
document.querySelectorAll("button[data-day]").forEach((btn) => {
    btn.addEventListener("click", () => {
        out.textContent = "";
        days[btn.dataset.day]();
    });
});