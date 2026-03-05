// 1. Background & Setup
const images = ["Green water.jpg", "Grey Mountains.jpg", "The street.jpg"];
let currentImg = 0;
function changeBackground() {
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${images[currentImg]}')`;
    currentImg = (currentImg + 1) % images.length;
}
changeBackground();

// 2. Timer Variables
let focusMins = 25;
let breakMins = 5;
let timeLeft = focusMins * 60;
let stopwatchSecs = 0;
let timerVar = null;
let isBreak = false;
let isStopwatch = false;
let focusSecs = 0, breakSecs = 0;

// To handle background tab freezing
let startTime;
let timeAtPause = 0;

function updateDisplay() {
    let m, s;
    if (isStopwatch) {
        m = Math.floor(stopwatchSecs / 60);
        s = stopwatchSecs % 60;
    } else {
        m = Math.floor(timeLeft / 60);
        s = timeLeft % 60;
    }
    const display = `${m}:${s < 10 ? '0' : ''}${s}`;
    document.getElementById('timer-display').innerText = display;
    document.title = `${display} | Cozy Pomo 🌊`; // Shows time in the tab title!
}

// 3. UI Panels
function togglePanel(id) {
    const panel = document.getElementById(id);
    if (panel.classList.contains('active')) {
        panel.classList.remove('active');
    } else {
        document.querySelectorAll('.side-panel').forEach(p => p.classList.remove('active'));
        panel.classList.add('active');
    }
}

function toggleTimerMode() {
    pauseTimer();
    isStopwatch = !isStopwatch;
    document.getElementById('pomo-label').classList.toggle('active-mode');
    document.getElementById('stopwatch-label').classList.toggle('active-mode');
    document.getElementById('break-btn').style.display = isStopwatch ? 'none' : 'inline-block';
    resetTimer();
}

function applySettings() {
    pauseTimer();
    focusMins = parseInt(document.getElementById('focus-input').value) || 25;
    breakMins = parseInt(document.getElementById('break-input').value) || 5;
    isStopwatch = false; 
    isBreak = false;
    timeLeft = focusMins * 60;
    updateDisplay();
    document.querySelectorAll('.side-panel').forEach(p => p.classList.remove('active'));
}

// 4. Core Timer Logic (Tab-Switch Proof)
function startTimer() {
    if (timerVar) return;

    // Record the timestamp when we started or resumed
    startTime = Date.now();
    
    // Remember where we left off (either timeLeft or stopwatchSecs)
    let initialTime = isStopwatch ? stopwatchSecs : timeLeft;

    timerVar = setInterval(() => {
        const currentTime = Date.now();
        const secondsPassed = Math.floor((currentTime - startTime) / 1000);

        if (isStopwatch) {
            // STOPWATCH MODE: Count Up
            stopwatchSecs = initialTime + secondsPassed;
            // Track total focus stats (this increments every second the timer runs)
            focusSecs++; 
        } else {
            // POMODORO MODE: Count Down
            timeLeft = initialTime - secondsPassed;

            // Track stats based on whether we are in focus or break mode
            if (!isBreak) {
                focusSecs++;
            } else {
                breakSecs++;
            }

            // CHECK IF FINISHED
            if (timeLeft <= 0) {
                timeLeft = 0;
                updateDisplay();
                pauseTimer();
                
                // 1. Start the repeating alarm
                playAlarm(); 
                
                // 2. Show the alert (Blocks code here until OK is clicked)
                alert(isBreak ? "Break's over! Ready to focus? 🌊" : "Focus session done! Take a break. ☕");
                
                // 3. Stop the alarm immediately after OK is clicked
                stopAlarm(); 
                return;
            }
        }

        // Update the numbers on screen AND the browser tab title
        updateDisplay();
        
        // Update the Stats Island display
        document.getElementById('focus-total').innerText = `${Math.floor(focusSecs/60)}m ${focusSecs%60}s`;
        document.getElementById('break-total').innerText = `${Math.floor(breakSecs/60)}m ${breakSecs%60}s`;
        
    }, 1000);
}
function pauseTimer() {
    clearInterval(timerVar);
    timerVar = null;
}

function resetTimer() {
    pauseTimer();
    if (isStopwatch) stopwatchSecs = 0; 
    else {
        isBreak = false;
        timeLeft = focusMins * 60;
    }
    updateDisplay();
}

function runBreak() {
    if (isStopwatch) return;
    pauseTimer();
    isBreak = true;
    timeLeft = breakMins * 60;
    updateDisplay();
    startTimer();
}

function resetStats() {
    focusSecs = 0; breakSecs = 0;
    document.getElementById('focus-total').innerText = "0m 0s";
    document.getElementById('break-total').innerText = "0m 0s";
}

// 5. Tasks
function addTask() {
    const input = document.getElementById('todo-input');
    if (input.value.trim() === "") return;
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `<span>${input.value}</span><button style="color:#ff6b6b; background:none; border:none; cursor:pointer;" onclick="this.parentElement.remove()">✕</button>`;
    document.getElementById('todo-list').appendChild(li);
    input.value = "";
}

// 6. Music Logic
const tracks = ["Alpha waves 1.mp3", "White Noise 1.mp3"];
let currentTrack = 0, playing = false;
let audio = new Audio(tracks[currentTrack]);
audio.loop = true; // Keeps the focus music going!

function toggleMusic() {
    if (playing) {
        audio.pause();
        document.getElementById('play-pause-btn').innerText = '▶';
    } else {
        audio.play().catch(() => { console.log("User must interact with page first"); });
        document.getElementById('play-pause-btn').innerText = '⏸';
    }
    playing = !playing;
}

function loadTrack(idx) {
    audio.pause();
    currentTrack = idx;
    audio = new Audio(tracks[currentTrack]);
    audio.loop = true;
    document.getElementById('track-label').innerText = tracks[currentTrack].replace('.mp3', '').toUpperCase();
    if (playing) audio.play();
}

function nextTrack() { loadTrack((currentTrack + 1) % tracks.length); }
function prevTrack() { loadTrack((currentTrack - 1 + tracks.length) % tracks.length); }

// 7. Alarm Logic (Repeating Version)

let isMuted = false;
const alarmSound = new Audio("beep alarm final.mp3"); 
alarmSound.loop = true; // This makes it repeat forever until stopped

function toggleMute() {
    isMuted = !isMuted;
    const btn = document.getElementById('mute-btn');
    btn.innerText = isMuted ? "OFF 🔇" : "ON 🔊";
    btn.style.color = isMuted ? "#ff6b6b" : "#afffaf";
}

function playAlarm() {
    if (!isMuted) {
        alarmSound.currentTime = 0; // Restart from beginning
        alarmSound.play().catch(e => console.log("Click the page once to enable audio."));
    }
}

function stopAlarm() {
    alarmSound.pause();
    alarmSound.currentTime = 0;
}
