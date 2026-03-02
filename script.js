// 1. Background Logic
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

function updateDisplay() {
    if (isStopwatch) {
        const m = Math.floor(stopwatchSecs / 60);
        const s = stopwatchSecs % 60;
        document.getElementById('timer-display').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
    } else {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        document.getElementById('timer-display').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
    }
}

// 3. Mode Toggle
function toggleTimerMode() {
    pauseTimer();
    isStopwatch = !isStopwatch;
    document.getElementById('pomo-label').classList.toggle('active-mode');
    document.getElementById('stopwatch-label').classList.toggle('active-mode');
    document.getElementById('break-btn').style.display = isStopwatch ? 'none' : 'inline-block';
    
    if (isStopwatch) {
        stopwatchSecs = 0;
    } else {
        timeLeft = focusMins * 60;
        isBreak = false;
    }
    updateDisplay();
}

// 4. UI Panels
function togglePanel(id) {
    const panel = document.getElementById(id);
    if (panel.classList.contains('active')) {
        panel.classList.remove('active');
    } else {
        document.querySelectorAll('.side-panel').forEach(p => p.classList.remove('active'));
        panel.classList.add('active');
    }
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

// 5. Timer Controls
function startTimer() {
    if (timerVar) return;
    timerVar = setInterval(() => {
        if (isStopwatch) {
            stopwatchSecs++;
            focusSecs++;
            updateDisplay();
        } else {
            if (timeLeft > 0) {
                timeLeft--;
                if (!isBreak) focusSecs++; else breakSecs++;
                updateDisplay();
            } else {
                pauseTimer();
                alert(isBreak ? "Break's over!" : "Focus session done!");
            }
        }
        document.getElementById('focus-total').innerText = `${Math.floor(focusSecs/60)}m ${focusSecs%60}s`;
        document.getElementById('break-total').innerText = `${Math.floor(breakSecs/60)}m ${breakSecs%60}s`;
    }, 1000);
}

function pauseTimer() { clearInterval(timerVar); timerVar = null; }
function resetTimer() { 
    pauseTimer(); 
    if (isStopwatch) stopwatchSecs = 0; else timeLeft = focusMins * 60; 
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
function resetStats() { focusSecs = 0; breakSecs = 0; document.getElementById('focus-total').innerText = "0m 0s"; document.getElementById('break-total').innerText = "0m 0s"; }

// 6. Tasks
function addTask() {
    const input = document.getElementById('todo-input');
    if (input.value.trim() === "") return;
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `<span>${input.value}</span><button style="color:#ff6b6b; background:none; border:none;" onclick="this.parentElement.remove()">✕</button>`;
    document.getElementById('todo-list').appendChild(li);
    input.value = "";
}

// 7. Music
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
