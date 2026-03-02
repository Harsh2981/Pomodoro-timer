// --- BACKGROUND SCENES ---
const images = [
     'Green water.jpg',
     'Grey Mountains.jpg',
     'The street.jpg',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070',
    'https://images.unsplash.com/photo-1516331138075-f3ad1576e0c1?q=80&w=2000',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000'
];
let currentImageIndex = 0;

function changeBackground() {
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${images[currentImageIndex]}')`;
    currentImageIndex = (currentImageIndex + 1) % images.length;
}
changeBackground();

// --- POMODORO TIMER ---
let startingTime = 25 * 60; 
let timeLeft = startingTime; 
let timerInterval = null;
let sessionsCompleted = 0;

const display = document.getElementById('timer-display');
const sessionDisplay = document.getElementById('session-count');

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
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            sessionsCompleted++;
            sessionDisplay.innerText = sessionsCompleted;
            alert("Focus session complete!");
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

function setCustomTime() {
    const input = document.getElementById('user-minutes');
    if (input.value > 0) {
        pauseTimer();
        startingTime = input.value * 60;
        timeLeft = startingTime;
        updateDisplay();
        input.value = '';
    }
}

// --- FOCUS MUSIC PLAYER ---
const tracks = ['Alpha waves 1.mp3', 'White Noise 1.mp3']; 
let currentTrackIndex = 0;
let isPlaying = false;
let isRepeating = false;
let audio = new Audio(tracks[currentTrackIndex]);

const playBtn = document.getElementById('play-pause-btn');
const repeatBtn = document.getElementById('repeat-btn');
const trackLabel = document.getElementById('track-label');

function formatTrackName(filename) {
    return filename.replace('.m4a', '').toUpperCase();
}

function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerText = '▶';
    } else {
        audio.play().catch(e => console.log("Interaction needed for play"));
        playBtn.innerText = '⏸';
    }
    isPlaying = !isPlaying;
}

function toggleRepeat() {
    isRepeating = !isRepeating;
    repeatBtn.style.opacity = isRepeating ? "1" : "0.5";
    repeatBtn.style.textShadow = isRepeating ? "0 0 10px white" : "none";
}

function handleTrackEnd() {
    if (isRepeating) {
        audio.currentTime = 0;
        audio.play();
    } else {
        nextTrack();
    }
}

function loadTrack(index) {
    audio.pause();
    currentTrackIndex = index;
    audio = new Audio(tracks[currentTrackIndex]);
    trackLabel.innerText = formatTrackName(tracks[currentTrackIndex]);
    
    audio.onended = () => handleTrackEnd();
    
    if (isPlaying) {
        audio.play().catch(e => console.log("Playback error"));
    }
}

function nextTrack() {
    loadTrack((currentTrackIndex + 1) % tracks.length);
}

function prevTrack() {
    loadTrack((currentTrackIndex - 1 + tracks.length) % tracks.length);
}

// Initial Listener
audio.onended = () => handleTrackEnd();
