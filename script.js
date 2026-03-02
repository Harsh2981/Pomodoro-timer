// 1. Background Logic (Matches your .jpg files)
const images = [
    "Green water.jpg",
    "Grey Mountains.jpg",
    "The street.jpg"
];
let currentImg = 0;

function changeBackground() {
    const url = images[currentImg];
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${url}')`;
    currentImg = (currentImg + 1) % images.length;
}
changeBackground();

// 2. Timer & Stats Logic
let focusMins = 25;
let breakMins = 5;
let timeLeft = focusMins * 60;
let timerVar = null;
let isBreak = false;
let focusSecs = 0;
let breakSecs = 0;

function updateDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.getElementById('timer-display').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
}

function applySettings() {
    pauseTimer();
    focusMins = parseInt(document.getElementById('focus-input').value) || 25;
    breakMins = parseInt(document.getElementById('break-input').value) || 5;
    isBreak = false;
    timeLeft = focusMins * 60;
    updateDisplay();
}

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
            alert(isBreak ? "Break over!" : "Focus session done!");
        }
    }, 1000);
}

function pauseTimer() { 
    clearInterval(timerVar); 
    timerVar = null; 
}

function resetTimer() { 
    pauseTimer(); 
    isBreak = false;
    timeLeft = focusMins * 60; 
    updateDisplay(); 
}

function runBreak() {
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

// 3. Music Logic (Matches your .mp3 files)
const tracks = ["Alpha waves 1.mp3", "White Noise 1.mp3"];
let currentTrack = 0;
let playing = false;
let loop = false;
let audio = new Audio(tracks[currentTrack]);

function toggleMusic() {
    if (playing) { 
        audio.pause(); 
        document.getElementById('play-pause-btn').innerText = '▶'; 
    } else { 
        audio.play().catch(() => {}); 
        document.getElementById('play-pause-btn').innerText = '⏸'; 
    }
    playing = !playing;
}

function toggleRepeat() {
    loop = !loop;
    document.getElementById('repeat-btn').style.opacity = loop ? "1" : "0.5";
}

function loadTrack(idx) {
    audio.pause();
    currentTrack = idx;
    audio = new Audio(tracks[currentTrack]);
    document.getElementById('track-label').innerText = tracks[currentTrack].replace('.mp3', '').toUpperCase();
    audio.onended = () => { if(loop) { audio.currentTime = 0; audio.play(); } else { nextTrack(); } };
    if (playing) audio.play();
}

function nextTrack() { loadTrack((currentTrack + 1) % tracks.length); }
function prevTrack() { loadTrack((currentTrack - 1 + tracks.length) % tracks.length); }

audio.onended = () => { if(loop) { audio.currentTime = 0; audio.play(); } else { nextTrack(); } };
