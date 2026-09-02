const secretSequence = ["2", "年", "8", "組"];
let currentInput = [];
let totalLength = 0;

const rect = document.getElementById("svg-rect");
const display = document.getElementById("display");
const messageDiv = document.getElementById("message");

window.addEventListener("DOMContentLoaded", () => {
    totalLength = rect.getTotalLength();
    rect.style.strokeDasharray = totalLength;
    rect.style.strokeDashoffset = totalLength;
});

// 効果音再生の共通化
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, duration, type = 'sine', delay = 0) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime + delay;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + duration);
}

const playTapSound = () => playTone(800, 0.05);
const playSuccessSound = () => { playTone(1046.5, 0.4); playTone(1318.5, 0.5, 'sine', 0.15); };
const playErrorSound = () => playTone(150, 0.5, 'sawtooth');

// メイン処理
function pressButton(val) {
    if (currentInput.length >= secretSequence.length) return;

    playTapSound();
    currentInput.push(val);
    display.textContent = currentInput.join(" - ");

    const progress = currentInput.length / secretSequence.length;
    rect.style.strokeDashoffset = totalLength * (1 - progress);

    if (currentInput.length === secretSequence.length) {
        setTimeout(checkUnlock, 200);
    }
}

function checkUnlock() {
    const isCorrect = currentInput.every((val, i) => val === secretSequence[i]);

    if (isCorrect) {
        playSuccessSound();
        rect.classList.add("success");
        messageDiv.style.color = "#00d2ff";
        messageDiv.textContent = "🔓 解放されました！";
        setTimeout(resetInput, 2000);
    } else {
        playErrorSound();
        rect.classList.add("error");
        messageDiv.style.color = "#dc3545";
        messageDiv.textContent = "🔒 違います";
        setTimeout(resetInput, 1200);
    }
}

function resetInput() {
    currentInput = [];
    display.textContent = "入力待ち...";
    messageDiv.textContent = "";
    rect.classList.remove("success", "error");
    rect.style.strokeDashoffset = totalLength;
}
