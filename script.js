const grid = document.querySelector('.grid');
const resultDisplay = document.getElementById('game-result');
const restartButton = document.querySelector('.restart-button');
const indicatorColor = grid.querySelectorAll('.row')[0].querySelectorAll('.indicator')[0].style.backgroundColor;

let secretNumber = generateSecretNumber();
let currentRow = 0;
let currentGuess = [];
let gameOver = false;

let currentLevel = 1; // Default level
// START FOR CHANGING THEME MODE
let modeToggle = document.querySelector('.mode-tog');
let darkMode = document.querySelector('.dark-mode');

modeToggle.addEventListener('click', () => {
    darkMode.classList.toggle('active');
    modeToggle.classList.toggle('active');
})
// END FOR CHANGING THEME MODE

function generateSecretNumber() {
    let number = '';
    for (let i = 0; i < 5; i++) {
        number += Math.floor(Math.random() * 10); // Generate a random number between 0 and 9
    }
    return number;
}

function updateGrid() {
    const rowCells = grid.querySelectorAll('.row')[currentRow].querySelectorAll('.cell');
    rowCells.forEach((cell, index) => {
        cell.textContent = currentGuess[index] || '';
    });
}

function checkGuess() {
    const rowIndicators = grid.querySelectorAll('.row')[currentRow].querySelectorAll('.indicator');
    let correctPositions = 0;
    let correctNumbers = 0;
    let secretDigits = secretNumber.split('');
    let guessDigits = [...currentGuess];

    let row = grid.querySelectorAll('.row')[currentRow];

    guessDigits.forEach((digit, index) => {
        if (digit === secretDigits[index]) {
            correctPositions++;
            secretDigits[index] = null; // Mark as used
            guessDigits[index] = null;
            if (currentLevel ===1){ 
                row.querySelectorAll(".cell")[index].style.backgroundColor = "lightblue"; // Let player know which digit is in correct position
            }
        }
    });

    guessDigits.forEach((digit, index) => {
        if (digit && secretDigits.includes(digit)) {
            correctNumbers++;
            let secretIndex = secretDigits.indexOf(digit);
            secretDigits[secretIndex] = null; // Mark as used
            if (currentLevel === 1){
               row.querySelectorAll(".cell")[index].style.backgroundColor = "orange"; // Let player know which digit is correct but in wrong position
            }
        }
    });

    rowIndicators[0].textContent = correctPositions;
    rowIndicators[0].style.backgroundColor = 'lightblue';
    rowIndicators[1].textContent = correctNumbers;
    rowIndicators[1].style.backgroundColor = 'orange'

    if (correctPositions === 5) {
      endGame(true); // Player won
    } else if ((currentLevel === 1 || currentLevel === 3) && currentRow === 5) {
      endGame(false); // Player lost
    } else if (currentLevel === 2 && currentRow === 7) { // Only Medium level has 8 attempts (rows)
      endGame(false); // Player lost
    } else {
      currentRow++;
      currentGuess = [];
    }
}

function endGame(won) {
    gameOver = true;
    resultDisplay.textContent = won ? 'You Won! 🎉' : `You Lost! 😞 The number was ${secretNumber}.`;
    resultDisplay.style.display = 'block'; // Show the result message
    restartButton.style.display = 'block'; // Show the restart button
}

function handleRestart() {
    secretNumber = generateSecretNumber();
    currentRow = 0;
    currentGuess = [];
    gameOver = false;
    grid.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = "#3a3a3c"; // Change to default background color
    });
    grid.querySelectorAll('.indicator').forEach(indicator => indicator.style.backgroundColor = indicatorColor)
    resultDisplay.style.display = 'none';

    // Remove focus from the restart button
    restartButton.blur();
}

// Let player choose level
const level_buttons = document.querySelectorAll('.level-buttons');
const level_rules = document.querySelectorAll('.level-rules');

level_buttons.forEach((button, index) => {
  button.addEventListener("click", function () {
    level_buttons.forEach((btn) => btn.classList.remove("active"));
    level_rules.forEach((lv) => lv.style.display = 'none');
    this.classList.add("active");
    level_rules[index].style.display = 'flex';
    currentLevel = index + 1;
  });
});

function applyRules (){
    // Level Medium: same as level Hard but add two more attempts
    if (currentLevel === 2) {
        for (let i = 0; i < 2; i++) {
            const newRow = document.createElement("div");
            newRow.classList.add("row");
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                if (j >= 5) {
                cell.classList.add("indicator");
                }
                newRow.appendChild(cell);
            }
            document.querySelector(".grid").appendChild(newRow);
        }
    } else if (currentLevel === 1){
        const rows = document.querySelectorAll(".row");
        rows.forEach(row => {
            const indicators = row.querySelectorAll(".cell.indicator");
            indicators.forEach(indicator => {
                indicator.style.display = "none";
            });
            row.style.gap = '25px';
        });
    }
}

document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    if (e.key >= '0' && e.key <= '9') {
        if (currentGuess.length < 5) {
            currentGuess.push(e.key);
            updateGrid();
        }
    } else if (e.key === 'Backspace') {
        currentGuess.pop();
        updateGrid();
    } else if (e.key === 'Enter' && currentGuess.length === 5) {
        checkGuess();
    }
});

restartButton.addEventListener('click', handleRestart);

window.addEventListener('load', () => {
    const rulesModal = document.querySelector('.rules-modal');
    rulesModal.classList.add('expand');
    rulesModal.style.display = 'flex';
});

const skipButton = document.querySelector('.skip-button');
const rulesModal = document.querySelector('.rules-modal');

skipButton.addEventListener('click', () => {
    if (rulesModal.classList.contains('expand')) {
        rulesModal.classList.remove('expand');
    }

    rulesModal.classList.add('shrink');
    applyRules();
    setTimeout(() => {
        rulesModal.style.display = 'none';
    }, 300);
});