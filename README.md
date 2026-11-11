# iyf-s12-week-6-joepavinmuturi-dotcom

# Week 6: Asynchronous JavaScript – Weather Dashboard

## Author
- **Name:** Joepavin Muturi
- **GitHub:** [@joepavinmuturi-dotcom](https://github.com/joepavinmuturi-dotcom)
- **Date:** November 10, 2026

## Project Description
A weather dashboard that fetches live data from the OpenWeatherMap API using async/await. The repo also contains my Lesson 11–12 practice (callbacks, promises, fetch, a user directory) and the five daily challenges.

## Technologies Used
- HTML5
- CSS3
- JavaScript (fetch, Promises, async/await, localStorage)
- OpenWeatherMap API
- GitHub Actions + GitHub Pages

## Features
- Search weather by city (handles names with spaces via `encodeURIComponent`)
- Shows city, icon, temperature (°C), description, feels like, humidity, wind, pressure
- Loading state and clear errors for unknown city, invalid key and network failure
- Last 5 searches saved in localStorage; click one to search again
- API key kept out of git (git-ignored `config.js`, injected at deploy time from a GitHub secret)

## How to Run
1. Clone this repository
2. Copy `config.example.js` to `config.js` and put your OpenWeatherMap API key in it
3. Open `index.html` in your browser

Other pages: `async-practice.html` (open the console), `users.html`, `daily-challenges/index.html`.

## Lessons Learned
- Await pauses inside the function but doesn't block the page; Promise.all runs requests in parallel instead of one after another
- checking response.ok matters because fetch only rejects on network failure, not on a 404
- Why secrets must never enter git history, and how a GitHub Actions secret solves it for deployment.

## Challenges Faced
-  A 401 right after signup because new API keys take time to activate

## Live Demo
[View Live Demo](https://joepavinmuturi-dotcom.github.io/iyf-s12-week-06-joepavinmuturi-dotcom/)