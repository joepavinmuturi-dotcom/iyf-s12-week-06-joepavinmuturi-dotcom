const API = "https://jsonplaceholder.typicode.com";

const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const container = document.getElementById("users-container");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const cityFilter = document.getElementById("city-filter");

let allUsers = [];

async function getUser(id) {
    try {
        const response = await fetch(`${API}/users/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user:", error);
    }
}
async function practice() {
    console.log("User 1:", await getUser(1));
    const all = await (await fetch(`${API}/users`)).json();
    console.log("All users:", all);
    const posts = await (await fetch(`${API}/users/1/posts`)).json();
    console.log("Posts for user 1:", posts);
}
practice();

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

async function fetchUsers() {
    const response = await fetch(`${API}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
}

function displayUsers(users) {
    if (users.length === 0) {
        container.textContent = "No users match your search.";
        return;
    }
    container.innerHTML = users.map((user) => `
        <div class="user-card">
            <h2>${escapeHtml(user.name)}</h2>
            <p>📧 ${escapeHtml(user.email)}</p>
            <p>🏢 ${escapeHtml(user.company.name)}</p>
            <p>📍 ${escapeHtml(user.address.city)}</p>
        </div>`).join("");
}

function applyFilters() {
    const query = searchInput.value.toLowerCase();
    const city = cityFilter.value;

    const result = allUsers
        .filter((u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query))
        .filter((u) => !city || u.address.city === city)
        .sort((a, b) => a.name.localeCompare(b.name));

    if (sortSelect.value === "desc") result.reverse();
    displayUsers(result);
}

function fillCityOptions() {
    const cities = [...new Set(allUsers.map((u) => u.address.city))].sort();
    cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
    });
}

async function init() {
    try {
        allUsers = await fetchUsers();
        fillCityOptions();
        applyFilters();
    } catch (error) {
        errorDiv.textContent = `Error: ${error.message}`;
        errorDiv.classList.remove("hidden");
    } finally {
        loading.classList.add("hidden");
    }
}

searchInput.addEventListener("input", applyFilters);
sortSelect.addEventListener("change", applyFilters);
cityFilter.addEventListener("change", applyFilters);
init();

async function createPost(title, body, userId) {
    const response = await fetch(`${API}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, userId }),
    });
    if (!response.ok) throw new Error("Failed to create post");
    return response.json();
}

document.getElementById("post-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const result = document.getElementById("post-result");
    try {
        const post = await createPost(
            document.getElementById("post-title").value.trim(),
            document.getElementById("post-body").value.trim(),
            1
        );
        result.textContent = "Created:\n" + JSON.stringify(post, null, 2);
        event.target.reset();
    } catch (error) {
        result.textContent = "Error: " + error.message;
    }
});