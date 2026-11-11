function predictOutput() {
    console.log("A");
    setTimeout(() => console.log("B"), 0);
    console.log("C");
    setTimeout(() => console.log("D"), 100);
    console.log("E");
}

function loadUser(userId, callback) {
    setTimeout(() => callback({ id: userId, name: "User " + userId }), 1500);
}

function getUserDataCb(userId, callback) {
    setTimeout(() => callback({ id: userId, name: "John" }), 1000);
}
function getUserPostsCb(userId, callback) {
    setTimeout(() => callback([{ id: 1, title: "Post 1" }, { id: 2, title: "Post 2" }]), 1000);
}
function getPostCommentsCb(postId, callback) {
    setTimeout(() => callback([{ id: 1, text: "Great post!" }, { id: 2, text: "Thanks for sharing" }]), 1000);
}
function callbackHell() {
    getUserDataCb(1, (user) => {
        console.log("User:", user);
        getUserPostsCb(user.id, (posts) => {
            console.log("Posts:", posts);
            getPostCommentsCb(posts[0].id, (comments) => {
                console.log("Comments:", comments);
            });
        });
    });
}

function getUserData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) resolve({ id: userId, name: "User " + userId });
            else reject("Invalid user ID");
        }, 1000);
    });
}
function getUserPosts(userId) {
    return new Promise((resolve) => {
        setTimeout(() => resolve([{ id: 1, title: "Post 1" }, { id: 2, title: "Post 2" }]), 1000);
    });
}
function getPostComments(postId) {
    return new Promise((resolve) => {
        setTimeout(() => resolve([{ id: 1, text: "Great post!" }, { id: 2, text: "Thanks for sharing" }]), 1000);
    });
}

function promiseChain() {
    return getUserData(1)
        .then((user) => { console.log("User:", user); return getUserPosts(user.id); })
        .then((posts) => { console.log("Posts:", posts); return getPostComments(posts[0].id); })
        .then((comments) => console.log("Comments:", comments))
        .catch((err) => console.error("Error:", err));
}

function promiseAll() {
    return Promise.all([getUserData(1), getUserData(2), getUserData(3)])
        .then((users) => console.log("All users:", users))
        .catch((err) => console.error("One failed:", err));
}

function promiseRace() {
    const fast = new Promise((resolve) => setTimeout(() => resolve("Fast!"), 100));
    const slow = new Promise((resolve) => setTimeout(() => resolve("Slow!"), 500));
    return Promise.race([fast, slow]).then((winner) => console.log("Winner:", winner));
}

async function getDataWithAsync() {
    const user = await getUserData(1);
    const posts = await getUserPosts(user.id);
    const comments = await getPostComments(posts[0].id);
    return comments;
}

async function fetchUserData(userId) {
    try {
        const user = await getUserData(userId);
        const posts = await getUserPosts(user.id);
        return { user, posts };
    } catch (error) {
        console.error("Failed to fetch:", error);
        throw error;
    }
}

async function getAllUsers() {
    console.time("parallel");
    const users = await Promise.all([getUserData(1), getUserData(2), getUserData(3)]);
    console.timeEnd("parallel"); 
    return users;
}

async function main() {
    console.log("--- predictOutput ---");
    predictOutput();
    await new Promise((r) => setTimeout(r, 300));

    console.log("--- callbacks ---");
    loadUser(1, (user) => console.log("Loaded:", user));
    await new Promise((r) => setTimeout(r, 1700));
    callbackHell();
    await new Promise((r) => setTimeout(r, 3300));

    console.log("--- promises ---");
    await promiseChain();
    await promiseAll();
    await promiseRace();

    console.log("--- async/await ---");
    console.log("Comments:", await getDataWithAsync());
    console.log("fetchUserData:", await fetchUserData(1));
    try { await fetchUserData(-1); } catch (e) { console.log("Caught:", e); }
    console.log("getAllUsers:", await getAllUsers());
}
main();