const DIGIT_COUNT = 5;

// Single source of truth for how each difficulty behaves, instead of
// scattered magic numbers (currentRow === 5, currentRow === 7, etc.)
const LEVELS = {
    1: { attempts: 6, rowGap: '25px', showIndicators: false, showPerDigitFeedback: true },
    2: { attempts: 8, rowGap: '10px', showIndicators: true, showPerDigitFeedback: false },
    3: { attempts: 6, rowGap: '10px', showIndicators: true, showPerDigitFeedback: false },
};

const grid = document.querySelector('.grid');
const resultDisplay = document.getElementById('game-result');
const restartButton = document.querySelector('.restart-button');
const rulesModal = document.querySelector('.rules-modal');
const skipButton = document.querySelector('.skip-button');
const levelButtons = document.querySelectorAll('.level-buttons');
const levelRules = document.querySelectorAll('.level-rules');

let currentLevel = 1;
let secretNumber = generateSecretNumber();
let currentRow = 0;
let currentGuess = [];
let gameOver = false;
let gameStarted = false; // input is ignored until the rules modal is dismissed

function generateSecretNumber() {
    let number = '';
    for (let i = 0; i < DIGIT_COUNT; i++) {
        number += Math.floor(Math.random() * 10);
    }
    return number;
}

function buildGrid(level) {
    const config = LEVELS[level];
    grid.innerHTML = '';

    for (let r = 0; r < config.attempts; r++) {
        const row = document.createElement('div');
        row.classList.add('row');
        row.style.gap = config.rowGap;

        for (let c = 0; c < DIGIT_COUNT; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            row.appendChild(cell);
        }

        if (config.showIndicators) {
            const correctIndicator = document.createElement('div');
            correctIndicator.classList.add('cell', 'indicator', 'indicator-correct');
            row.appendChild(correctIndicator);

            const presentIndicator = document.createElement('div');
            presentIndicator.classList.add('cell', 'indicator', 'indicator-present');
            row.appendChild(presentIndicator);
        }

        grid.appendChild(row);
    }
}

function updateGrid() {
    const cells = grid.querySelectorAll('.row')[currentRow].querySelectorAll('.cell:not(.indicator)');
    cells.forEach((cell, index) => {
        cell.textContent = currentGuess[index] || '';
    });
}

function checkGuess() {
    const config = LEVELS[currentLevel];
    const row = grid.querySelectorAll('.row')[currentRow];
    const cells = row.querySelectorAll('.cell:not(.indicator)');

    let correctPositions = 0;
    let correctNumbers = 0;
    const secretDigits = secretNumber.split('');
    const guessDigits = [...currentGuess];

    guessDigits.forEach((digit, index) => {
        if (digit === secretDigits[index]) {
            correctPositions++;
            secretDigits[index] = null; // Mark as used
            guessDigits[index] = null;
            if (config.showPerDigitFeedback) {
                cells[index].classList.add('correct'); // Digit is in the correct position
            }
        }
    });

    guessDigits.forEach((digit, index) => {
        if (digit && secretDigits.includes(digit)) {
            correctNumbers++;
            const secretIndex = secretDigits.indexOf(digit);
            secretDigits[secretIndex] = null; // Mark as used
            if (config.showPerDigitFeedback) {
                cells[index].classList.add('present'); // Digit exists but is in the wrong position
            }
        }
    });

    if (config.showIndicators) {
        row.querySelector('.indicator-correct').textContent = correctPositions;
        row.querySelector('.indicator-present').textContent = correctNumbers;
    }

    if (correctPositions === DIGIT_COUNT) {
        endGame(true);
    } else if (currentRow === config.attempts - 1) {
        endGame(false);
    } else {
        currentRow++;
        currentGuess = [];
    }
}

function endGame(won) {
    gameOver = true;
    resultDisplay.textContent = won ? 'You Won! 🎉' : `You Lost! 😞 The number was ${secretNumber}.`;
    resultDisplay.classList.add('visible');
}

function handleRestart() {
    secretNumber = generateSecretNumber();
    currentRow = 0;
    currentGuess = [];
    gameOver = false;
    buildGrid(currentLevel);
    resultDisplay.classList.remove('visible');
    restartButton.blur();
}

levelButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        levelButtons.forEach((btn) => btn.classList.remove('active'));
        levelRules.forEach((rule) => rule.classList.remove('active'));
        button.classList.add('active');
        levelRules[index].classList.add('active');
        currentLevel = index + 1;
    });
});

document.addEventListener('keydown', (e) => {
    if (!gameStarted || gameOver) return;

    if (e.key >= '0' && e.key <= '9') {
        if (currentGuess.length < DIGIT_COUNT) {
            currentGuess.push(e.key);
            updateGrid();
        }
    } else if (e.key === 'Backspace') {
        currentGuess.pop();
        updateGrid();
    } else if (e.key === 'Enter' && currentGuess.length === DIGIT_COUNT) {
        checkGuess();
    }
});

restartButton.addEventListener('click', handleRestart);

const modeToggle = document.querySelector('.mode-tog');
const darkMode = document.querySelector('.dark-mode');
const THEME_ANIMATION_MS = 600;
let isThemeAnimating = false;

function toggleDarkMode() {
    if (isThemeAnimating) return;

    isThemeAnimating = true;
    const switchingToDark = !modeToggle.classList.contains('active');

    darkMode.classList.toggle('active');
    modeToggle.classList.toggle('active');

    setTimeout(() => {
        document.body.classList.toggle('dark-theme', switchingToDark);
        isThemeAnimating = false;
    }, THEME_ANIMATION_MS);
}

modeToggle.addEventListener('click', toggleDarkMode);
modeToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDarkMode();
    }
});

skipButton.addEventListener('click', () => {
    rulesModal.classList.remove('expand');
    rulesModal.classList.add('shrink');
    buildGrid(currentLevel);
    gameStarted = true;

    setTimeout(() => {
        rulesModal.style.display = 'none';
    }, 300);
});

window.addEventListener('load', () => {
    rulesModal.classList.add('expand');
    rulesModal.style.display = 'flex';
});
