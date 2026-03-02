// --- BACKGROUNDS (Matches your filenames exactly) ---
const images = [
    'Green water.jpg',
    'Grey Mountains.jpg',
    'The street.jpg'
];
let currentImageIndex = 0;

function changeBackground() {
    // We add a dark overlay so the white text is always readable
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${images[currentImageIndex]}')`;
    currentImageIndex = (currentImageIndex + 1) % images.length;
}
// Run once on load
changeBackground();

// --- TIMER & TRACKING ---
let startingTime = 25 * 60;
let timeLeft = startingTime;
let timerInterval = null;
let isBreakMode = false;
let focusSeconds = 0;
let breakSeconds = 0;

const display = document.getElementById('timer-display');
const focusDisplay = document.getElementById('focus-total');
const breakDisplay = document.getElementById('break-total');

function formatStatsTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
            if (!isBreakMode) {
                focusSeconds++;
                focusDisplay.innerText = formatStatsTime(focusSeconds);
            } else {
                breakSeconds++;
                breakDisplay.innerText = formatStatsTime(breakSeconds);
            }
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            alert(isBreakMode ? "Break Over!" : "Focus Over!");
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    pauseTimer();
    timeLeft = startingTime;
    updateDisplay();
}

function startBreak(mins) {
    pauseTimer();
    isBreakMode = true;
    startingTime = mins * 60;
    timeLeft = startingTime;
    updateDisplay();
    startTimer();
}

function setCustomTime() {
    const input = document.getElementById('user-minutes');
    if (input.value > 0) {
        pauseTimer();
        isBreakMode = false;
        startingTime = input.value * 60;
        timeLeft = startingTime;
        updateDisplay();
        input.value = '';
    }
}

function resetStats() {
    focusSeconds = 0;
    breakSeconds = 0;
    focusDisplay.innerText = "0m 0s";
    breakDisplay.innerText = "0m 0s";
}

// --- MUSIC PLAYER (Matches your .mp3 filenames) ---
const tracks = ['Alpha waves 1.mp3', 'White Noise 1.mp3'];
let currentTrackIndex = 0;
let isPlaying = false;
let isRepeating = false;
let audio = new Audio(tracks[currentTrackIndex]);

const playBtn = document.getElementById('play-pause-btn');
const repeatBtn = document.getElementById('repeat-btn');
const trackLabel = document.getElementById('track-label');

function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerText = '▶';
    } else {
        audio.play().catch(e => console.log("Blocked: Click the page first."));
        playBtn.innerText = '⏸';
    }
    isPlaying = !isPlaying;
}

function toggleRepeat() {
    isRepeating = !isRepeating;
    repeatBtn.style.opacity = isRepeating ? "1" : "0.5";
}

function loadTrack(index) {
    audio.pause();
    currentTrackIndex = index;
    audio = new Audio(tracks[currentTrackIndex]);
    trackLabel.innerText = tracks[currentTrackIndex].replace('.mp3', '').toUpperCase();
    audio.onended = () => { if (isRepeating) { audio.currentTime = 0; audio.play(); } else { nextTrack(); } };
    if (isPlaying) audio.play();
}

function nextTrack() { loadTrack((currentTrackIndex + 1) % tracks.length); }
function prevTrack() { loadTrack((currentTrackIndex - 1 + tracks.length) % tracks.length); }

audio.onended = () => { if (isRepeating) { audio.currentTime = 0; audio.play(); } else { nextTrack(); } };
