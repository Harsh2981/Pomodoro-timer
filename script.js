// 1. Background Logic
const images = ["Green water.jpg", "Grey Mountains.jpg", "The street.jpg"];
let currentImg = 0;
function changeBackground() {
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${images[currentImg]}')`;
    currentImg = (currentImg + 1) % images.length;
}
changeBackground();
let isStopwatch = false; // New state
let stopwatchSecs = 0;   // New counter

function toggleTimerMode() {
    pauseTimer();
    isStopwatch = !isStopwatch;
    
    // Update UI labels
    document.getElementById('pomo-label').classList.toggle('active-mode');
    document.getElementById('stopwatch-label').classList.toggle('active-mode');
    
    // Reset display
    if (isStopwatch) {
        stopwatchSecs = 0;
        document.getElementById('timer-display').innerText = "0:00";
    } else {
        timeLeft = focusMins * 60;
        updateDisplay();
    }
}

function startTimer() {
    if (timerVar) return;
    timerVar = setInterval(() => {
        if (isStopwatch) {
            // STOPWATCH MODE (Count Up)
            stopwatchSecs++;
            const m = Math.floor(stopwatchSecs / 60);
            const s = stopwatchSecs % 60;
            document.getElementById('timer-display').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
            
            // Still track focus stats
            focusSecs++; 
            document.getElementById('focus-total').innerText = `${Math.floor(focusSecs/60)}m ${focusSecs%60}s`;
            
        } else {
            // POMODORO MODE (Count Down)
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
                if (!isBreak) { 
                    focusSecs++; 
                    document.getElementById('focus-total').innerText = `${Math.floor(focusSecs/60)}m ${focusSecs%60}s`;
                } else { 
                    breakSecs++; 
                    document.getElementById('break-total').innerText = `${Math.floor(breakSecs/60)}m ${breakSecs%60}s`;
                }
            } else {
                pauseTimer();
                alert(isBreak ? "Break Over!" : "Focus Done!");
            }
        }
    }, 1000);
}

// 2. Timer Variables
let focusMins = 25;
let breakMins = 5;
let timeLeft = focusMins * 60;
let timerVar = null;
let isBreak = false;
let focusSecs = 0, breakSecs = 0;

function updateDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.getElementById('timer-display').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
}

// 3. Settings Logic
function togglePanel(id) {
    document.getElementById(id).classList.toggle('active');
}

function applySettings() {
    pauseTimer();
    focusMins = parseInt(document.getElementById('focus-input').value) || 25;
    breakMins = parseInt(document.getElementById('break-input').value) || 5;
    isBreak = false;
    timeLeft = focusMins * 60;
    updateDisplay();
    togglePanel('settings-panel'); // Close panel after applying
}

// 4. Timer Controls
function startTimer() {
    if (timerVar) return;
    timerVar = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
            if (!isBreak) { 
                focusSecs++; 
                document.getElementById('focus-total').innerText = `${Math.floor(focusSecs/60)}m ${focusSecs%60}s`;
            } else { 
                breakSecs++; 
                document.getElementById('break-total').innerText = `${Math.floor(breakSecs/60)}m ${breakSecs%60}s`;
            }
        } else {
            pauseTimer();
            alert(isBreak ? "Break Over!" : "Focus Done!");
        }
    }, 1000);
}

function pauseTimer() { clearInterval(timerVar); timerVar = null; }
function resetTimer() { pauseTimer(); isBreak = false; timeLeft = focusMins * 60; updateDisplay(); }
function runBreak() { pauseTimer(); isBreak = true; timeLeft = breakMins * 60; updateDisplay(); startTimer(); }
function resetStats() { focusSecs = 0; breakSecs = 0; document.getElementById('focus-total').innerText = "0m 0s"; document.getElementById('break-total').innerText = "0m 0s"; }

// 5. To-Do Logic
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

function toggleMusic() {
    if (playing) { audio.pause(); document.getElementById('play-pause-btn').innerText = '▶'; }
    else { audio.play().catch(()=>{}); document.getElementById('play-pause-btn').innerText = '⏸'; }
    playing = !playing;
}

function loadTrack(idx) {
    audio.pause();
    currentTrack = idx;
    audio = new Audio(tracks[currentTrack]);
    document.getElementById('track-label').innerText = tracks[currentTrack].replace('.mp3', '').toUpperCase();
    if (playing) audio.play();
}

function nextTrack() { loadTrack((currentTrack + 1) % tracks.length); }
function prevTrack() { loadTrack((currentTrack - 1 + tracks.length) % tracks.length); }

