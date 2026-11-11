const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const HISTORY_KEY = "recent";
const MAX_HISTORY = 5;

const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const weatherDisplay = document.getElementById("weather-display");

const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const historyList = document.getElementById("search-history");

async function getWeather(city) {
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    try {
        showLoading();
        hideError();

        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) throw new Error("City not found");
            if (response.status === 401) throw new Error("API key not valid yet — new keys can take an hour to activate");
            throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        displayWeather(data);
        saveToHistory(data.name);
    } catch (err) {
        showError(err.name === "TypeError" ? "Network error — check your connection" : err.message);
    } finally {
        hideLoading();
    }
}

function displayWeather(data) {
    const weather = data.weather[0];
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
    weatherIcon.alt = weather.description;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = weather.description;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;

    weatherDisplay.classList.remove("hidden");
}

function showLoading() {
    loading.classList.remove("hidden");
    weatherDisplay.classList.add("hidden");
}
function hideLoading() { loading.classList.add("hidden"); }
function showError(message) {
    error.textContent = message;
    error.classList.remove("hidden");
}
function hideError() { error.classList.add("hidden"); }

function readHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveToHistory(city) {
    let recent = readHistory().filter((c) => c.toLowerCase() !== city.toLowerCase());
    recent.unshift(city);
    recent = recent.slice(0, MAX_HISTORY);
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(recent));
    } catch (e) {}
    loadHistory();
}

function loadHistory() {
    historyList.replaceChildren(
        ...readHistory().map((city) => {
            const li = document.createElement("li");
            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = city;
            btn.dataset.city = city;
            li.appendChild(btn);
            return li;
        })
    );
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) getWeather(city);
});

historyList.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-city]");
    if (!btn) return;
    cityInput.value = btn.dataset.city;
    getWeather(btn.dataset.city);
});

loadHistory();