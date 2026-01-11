/**
 * Automated Schedule Logic
 * 1. Fetches ./data/schedule.csv
 * 2. Detects current day of the month
 * 3. Highlights the 'bar' red for 1 second when the time matches exactly
 * 4. Shows the next upcoming time for each bar
 */

const CSV_PATH = './data/schedule.csv';
let presetData = {};
let selectedDay = new Date().getDate(); // Automatically gets current day (1-31)

// 1. Initialize the application
async function init() {
    console.log("System Initializing...");

    // Automatically load the CSV file from your /data/ folder
    await loadCSVData();

    // Set the UI Title
    const titleElement = document.getElementById('dayTitle');
    if (titleElement) {
        titleElement.textContent = `Day ${selectedDay} Schedule`;
    }

    // Generate the HTML for the 6 bars
    createBars();

    // Start the 1-second interval loop
    setInterval(updateClock, 1000);
}

// 2. Fetch and Parse CSV
async function loadCSVData() {
    try {
        const response = await fetch(CSV_PATH);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const text = await response.text();
        presetData = parseCSV(text);

        const statusElement = document.getElementById('status');
        if (statusElement) statusElement.textContent = "Data Synced";
        console.log("CSV Data Loaded:", presetData);
    } catch (e) {
        console.error("Could not load CSV:", e);
        const statusElement = document.getElementById('status');
        if (statusElement) statusElement.textContent = "CSV Error: Not Found";
    }
}

function parseCSV(text) {
    const lines = text.trim().split('\n');
    const data = {};

    // Skip header row (i=1)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [day, bar, h, m, s] = line.split(',').map(item => parseInt(item.trim()));

        if (isNaN(day)) continue;

        if (!data[day]) data[day] = {};
        const key = `bar${bar}`;
        if (!data[day][key]) data[day][key] = [];

        data[day][key].push({ h, m, s });
    }
    return data;
}

// 3. Logic to find the Next Scheduled Time
function getNextTime(timesArray, now) {
    const currentTotalSeconds = (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();

    let nextTime = null;
    let minDiff = Infinity;

    for (let timeData of timesArray) {
        const presetTotalSeconds = (timeData.h * 3600) + (timeData.m * 60) + timeData.s;
        const diff = presetTotalSeconds - currentTotalSeconds;

        // Check for the soonest time in the future
        if (diff > 0 && diff < minDiff) {
            minDiff = diff;
            nextTime = timeData;
        }
    }

    // If no more times today, loop back to the first time of the day
    if (!nextTime && timesArray.length > 0) {
        nextTime = timesArray[0];
    }

    return nextTime;
}

// 4. UI Rendering and Updates
function createBars() {
    const container = document.getElementById('barsContainer');
    if (!container) return;

    container.innerHTML = '';
    // Create bars 6 down to 1
    for (let i = 6; i >= 1; i--) {
        const div = document.createElement('div');
        div.className = 'bar';
        div.id = `bar${i}`;
        div.innerHTML = `
            <div class="bar-left">
                <span class="bar-number">${i}</span>
                <div class="bar-divider"></div>
            </div>
            <div class="bar-center">
                <span class="bar-time" id="time${i}">--:--:--</span>
            </div>
            <div class="bar-status" id="status${i}">○ IDLE</div>
        `;
        container.appendChild(div);
    }
}

function updateClock() {
    const now = new Date();

    // Update the main digital clock
    const timeString = [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map(v => String(v).padStart(2, '0'))
        .join(':');

    const clockElement = document.getElementById('clock');
    if (clockElement) clockElement.textContent = timeString;

    // Run the schedule check
    updateBars(now);
}

function updateBars(now) {
    const dayData = presetData[selectedDay] || {};

    for (let i = 1; i <= 6; i++) {
        const barDiv = document.getElementById(`bar${i}`);
        if (!barDiv) continue;

        const times = dayData[`bar${i}`] || [];

        // Match current time to toggle Active state
        const isActive = times.some(t =>
            t.h === now.getHours() &&
            t.m === now.getMinutes() &&
            t.s === now.getSeconds()
        );

        const nextTime = getNextTime(times, now);
        const timeDisplay = document.getElementById(`time${i}`);
        const statusDisplay = document.getElementById(`status${i}`);

        // Update the time shown in the bar
        if (nextTime) {
            const formattedTime = [nextTime.h, nextTime.m, nextTime.s]
                .map(v => String(v).padStart(2, '0'))
                .join(':');
            timeDisplay.textContent = formattedTime;
        } else {
            timeDisplay.textContent = "No Schedule";
        }

        // Toggle visual active state
        if (isActive) {
            barDiv.classList.add('active');
            statusDisplay.textContent = '● ACTIVE';
        } else {
            barDiv.classList.remove('active');
            statusDisplay.textContent = '○ IDLE';
        }
    }
}

// Start everything
init();
