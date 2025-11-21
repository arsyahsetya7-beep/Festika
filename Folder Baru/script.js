const WORD_LIST_ID = [
    "KOTAK", "WAJAH", "KURSI", "PINTU", "LAMPU", 
    "BUNGA", "MUARA", "KAPAL", "BERAT", "CEPAT", 
    "PAPAN", "HAPUS", "KUNCI", "SIHIR", "GELAS", 
    "SALAH", "BENAR", "KANAN", "HITAM", "PUTIH", 
    "LILIN", "PASAR", "SAYUR", "PASIR", "HARGA", 
    "RUMAH", "MOBIL", "SENJA", "MALAM", "POHON", 
    "SAWAH", "LAPAR", "SENIN", "SELAT", "GARIS", 
    "WARNA", "LEBAR", "PELAN", "SUATU", "BUBUR", 
    "CATUR", "MUSIK", "LUKIS", "CERAH", "ANGIN", 
    "JERUK", "TULIS", "KERJA", "TEMAN", "DUDUK", 
    "NAFAS", "AKHIR", "MIMPI", "SEHAT", "KELAS", 
    "PESTA", "SUARA", "BULAN", "TAHUN", "JAMBU", 
    "CINTA", "KECIL", "BESAR", "MANIS", "PEDAS", 
    "HIJAU", "PENUH", "TITIK", "SINAR"
];

const WORD_LIST_EN = [
    "APPLE", "CANDY", "FIGHT", "GRASS", "HOUSE", 
    "LUCKY", "OCEAN", "POWER", "QUICK", "ROBOT", 
    "SHIFT", "SMART", "TIGER", "WATER", "YOUTH", 
    "BLINK", "CRANE", "DREAM", "FLAME", "GREAT", 
    "LIGHT", "CHAIR", "TABLE", "MONEY", "BREAD", 
    "SLEEP", "GREEN", "BLACK", "WHITE", "HAPPY", 
    "ANGRY", "MUSIC", "WORLD", "NEVER", "UNDER", 
    "SMALL", "LARGE", "HEART", "SMILE", "LAUGH", 
    "FRUIT", "BEACH", "RIVER", "CLOUD", "STARS", 
    "DANCE", "TRAIN", "PLANE", "EAGLE", "ZEBRA",
    "LEMON", "MANGO", "PEACH", "CHESS", "BRUSH",
    "PAINT", "FLOOR", "BRICK", "SHARP", "OUTER",
    "SHINE"
];

const NUM_ROWS = 6;
const NUM_COLS = 5;

let currentScore = 0; 
let highScore = localStorage.getItem('wordleHighScore') ? parseInt(localStorage.getItem('wordleHighScore')) : 0; 

let TARGET_WORD = '';
let TARGET_WORD_LIST = []; 
let currentLanguage = ''; 

let currentRow = 0;
let currentCol = 0;
let isGameOver = false;
let currentLevel = 1;

const keyboardMap = {};
const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
];


function updateThemeButtonText() {
    const isLight = document.body.classList.contains('light-mode');
    
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.textContent = isLight ? '🌙 Tema' : '☀️ Tema';
    }
    
    const themeToggleHomeDiv = document.getElementById('theme-toggle-home');
    if (themeToggleHomeDiv) {
        const button = themeToggleHomeDiv.querySelector('button');
        if (button) {
             button.textContent = isLight ? '🌙 Ganti Tema ☀️' : '☀️ Ganti Tema 🌙';
        }
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    } else if (!savedTheme) {
        localStorage.setItem('theme', 'dark'); 
    }
    updateThemeButtonText();
}

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-mode');
    localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
    updateThemeButtonText();
}


function showModal(title, message) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').innerHTML = message; 
    document.getElementById('game-modal').classList.remove('hidden');
    
    document.getElementById('keyboard').classList.add('hidden');
    showMessage("");
}

function hideModal() {
    document.getElementById('game-modal').classList.add('hidden');
    document.getElementById('keyboard').classList.remove('hidden');
}



function goToHome() {
    document.getElementById('level-selection').classList.remove('hidden');
    document.getElementById('game-container').classList.add('hidden');
    
    currentScore = 0;
    currentLevel = 1;
    updateScoreDisplay(); 
}

function startGame(language) {
    currentLanguage = language;

    if (language === 'ID') {
        TARGET_WORD_LIST = WORD_LIST_ID;
    } else {
        TARGET_WORD_LIST = WORD_LIST_EN;
    }

    document.getElementById('level-selection').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');

    currentLevel = 1;
    currentScore = 0; 
    
    initializeGame();
}

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    createGrid();
    createKeyboard();
    document.addEventListener('keydown', handleKeyPress);
});


function initializeGame() {
    TARGET_WORD = TARGET_WORD_LIST[Math.floor(Math.random() * TARGET_WORD_LIST.length)];
    
    currentRow = 0;
    currentCol = 0;
    isGameOver = false;
    
    hideModal(); 
    updateLevelDisplay();
    updateScoreDisplay();
    clearGrid();
    clearKeyboard();
    showMessage("");
    
    updateThemeButtonText();
}



function updateLevelDisplay() {
    const titleElement = document.querySelector('#game-container h1');
    const modeName = currentLanguage === 'ID' ? 'BAHASA INDONESIA' : 'BAHASA INGGRIS';
    titleElement.textContent = `Tebak Kata (${modeName})`;
}

function updateScoreDisplay() {
    const scoreDiv = document.getElementById('score-info');
    scoreDiv.innerHTML = `
        Streak: 🏆 ${currentScore} | 
        Tertinggi: ⭐ ${highScore}
    `;
}

function clearGrid() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.setAttribute('data-letter', ''); 
        tile.className = 'tile'; 
    });
}

function clearKeyboard() {
    Object.values(keyboardMap).forEach(keyButton => {
        keyButton.className = 'key';
        if (keyButton.textContent === 'ENTER' || keyButton.textContent === 'DEL') {
            keyButton.classList.add('large-key');
        }
    });
}

function createGrid() {
    const grid = document.getElementById('grid');
    if (!grid) return;
    for (let i = 0; i < NUM_ROWS; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (let j = 0; j < NUM_COLS; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.id = `tile-${i}-${j}`;
            tile.setAttribute('data-letter', ''); 
            row.appendChild(tile);
        }
        grid.appendChild(row);
    }
}

function createKeyboard() {
    const keyboardDiv = document.getElementById('keyboard');
    if (!keyboardDiv) return;
    
    keyboardLayout.forEach(rowKeys => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('keyboard-row');
        rowKeys.forEach(keyText => {
            const keyButton = document.createElement('button');
            keyButton.classList.add('key');
            keyButton.textContent = keyText;
            keyButton.id = `key-${keyText}`;
            keyboardMap[keyText] = keyButton; 

            if (keyText === 'ENTER' || keyText === 'DEL') {
                keyButton.classList.add('large-key');
            }

            keyButton.addEventListener('click', (event) => {
                if (keyText === 'ENTER') {
                    event.preventDefault(); 
                }
                handleKeyInput(keyText); 
            });
            rowDiv.appendChild(keyButton);
        });
        keyboardDiv.appendChild(rowDiv);
    });
}


function handleKeyPress(event) {
    if (isGameOver || document.getElementById('game-container').classList.contains('hidden') || !document.getElementById('game-modal').classList.contains('hidden')) return;
    
    const key = event.key.toUpperCase();
    
    if (key === 'ENTER') {
        handleKeyInput('ENTER');
    } else if (key === 'BACKSPACE') {
        handleKeyInput('DEL');
    } else if (key.length === 1 && key >= 'A' && key <= 'Z') {
        handleKeyInput(key);
    }
}

function handleKeyInput(key) {
    if (isGameOver) return;
    
    if (key === 'ENTER') {
        if (currentCol === NUM_COLS) {
            checkGuess(); 
        } else {
            shakeRow(currentRow);
            showMessage("Kata belum lengkap!");
        }
    } else if (key === 'DEL') {
        deleteLetter();
    } else if (key.length === 1 && key >= 'A' && key <= 'Z') {
        enterLetter(key);
    }
}

function enterLetter(letter) {
    if (currentCol < NUM_COLS) {
        const tile = document.getElementById(`tile-${currentRow}-${currentCol}`);
        tile.setAttribute('data-letter', letter);
        currentCol++;
    }
}

function deleteLetter() {
    if (currentCol > 0) {
        currentCol--;
        const tile = document.getElementById(`tile-${currentRow}-${currentCol}`);
        tile.setAttribute('data-letter', '');
    }
}

function checkGuess() {
    const guess = getCurrentGuess();
    const target = TARGET_WORD;
    
    if (guess.length < NUM_COLS) {
        shakeRow(currentRow);
        showMessage("Kata belum lengkap!");
        return;
    }
    
    const feedback = new Array(NUM_COLS).fill('absent');
    let targetLetters = target.split('');
    const guessedLetters = guess.split('');

    // Cek Correct
    for (let i = 0; i < NUM_COLS; i++) {
        if (guessedLetters[i] === targetLetters[i]) {
            feedback[i] = 'correct';
            targetLetters[i] = null; 
        }
    }
    // Cek Present
    for (let i = 0; i < NUM_COLS; i++) {
        if (feedback[i] !== 'correct') {
            const targetIndex = targetLetters.indexOf(guessedLetters[i]);
            if (targetIndex !== -1) {
                feedback[i] = 'present';
                targetLetters[targetIndex] = null; 
            }
        }
    }
    
    applyFeedback(guess, feedback);
    
    setTimeout(() => { 
        if (guess === target) {
            currentScore++; 
            if (currentScore > highScore) {
                highScore = currentScore;
                localStorage.setItem('wordleHighScore', highScore);
            }
            
            updateScoreDisplay(); 
            showMessage(`🎉 Kata Benar! Melanjutkan ke game berikutnya...`);
            
            setTimeout(() => {
                 initializeGame(); 
            }, 1500); 
            
            return; 
            
        } else if (currentRow === NUM_ROWS - 1) {
            const finalScore = currentScore;
            currentScore = 0;
            isGameOver = true;
            updateScoreDisplay(); 

            showModal(
                "😢 GAME OVER", 
                `Kata yang benar: **${target}**. Streak terbaik Anda di sesi ini: **${finalScore}**.`
            );
            
            return; 
            
        } else {
            currentRow++;
            currentCol = 0;
        }
        
    }, NUM_COLS * 500); 
}

function getCurrentGuess() {
    let guess = '';
    for (let i = 0; i < NUM_COLS; i++) {
        const tile = document.getElementById(`tile-${currentRow}-${i}`);
        guess += tile.getAttribute('data-letter');
    }
    return guess;
}

function applyFeedback(guess, feedback) {
    for (let i = 0; i < NUM_COLS; i++) {
        const tile = document.getElementById(`tile-${currentRow}-${i}`);
        const letter = guess[i];
        const status = feedback[i];
        setTimeout(() => {
            tile.classList.add('flip');
            tile.classList.add(status);
            
            const keyButton = keyboardMap[letter];
            if (keyButton) {
                if (status === 'correct') {
                    if (!keyButton.classList.contains('correct')) {
                         keyButton.className = 'key correct';
                    }
                } else if (status === 'present' && !keyButton.classList.contains('correct')) {
                    keyButton.className = 'key present';
                } else if (status === 'absent' && !keyButton.classList.contains('correct') && !keyButton.classList.contains('present')) {
                    keyButton.classList.add('absent');
                }
            }
        }, i * 500); 
    }
}

function shakeRow(row) {
    const rowElement = document.getElementById(`tile-${row}-0`).parentElement;
    rowElement.classList.add('shake');
    
    rowElement.addEventListener('animationend', () => {
        rowElement.classList.remove('shake');
    }, { once: true });
}

function showMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = message; 
    
    if (message.length > 0 && !isGameOver) { 
        setTimeout(() => {
            messageDiv.textContent = '';
        }, 1500);
    }
}