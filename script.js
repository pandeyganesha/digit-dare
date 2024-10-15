// auto focus on grid after pressing restart
// pop out from screen like effect for boxes
// create three levels, changing number of rows, or may be even telling which of them are correct and which are correct but not at right place
// push on git
// can also add a sun that follows the path from real time sun position and scattering the light on the screen.
// will have to code the sun as images wont give the desired effect. Or may this can be a completely different project.
// when complete, host somewhere, may be on riju's server, or get my own, or may be on play store.
// also we can create a new project with similar boxes covering the whole screen but the size would be much smaller and they tranlates on z axis when hovered.
// or may be the in the direction from where the mouse is coming. it might create a good effect.
// or may we can use small round circles instead of boxes or may be we can gives options to the user for choosing traingle, circle or square.

const grid = document.querySelector('.grid');
const resultDisplay = document.getElementById('game-result');
const restartButton = document.querySelector('.restart-button');
const indicatorColor = grid.querySelectorAll('.row')[0].querySelectorAll('.indicator')[0].style.backgroundColor;

let secretNumber = generateSecretNumber();
let currentRow = 0;
let currentGuess = [];
let gameOver = false;

function generateSecretNumber() {
    let number = '';
    for (let i = 0; i < 5; i++) {
        number += Math.floor(Math.random() * 10); // Generate a random number between 0 and 9
    }
    console.log("Secret Number:", number); // For debugging purposes
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

    guessDigits.forEach((digit, index) => {
        if (digit === secretDigits[index]) {
            correctPositions++;
            secretDigits[index] = null; // Mark as used
            guessDigits[index] = null;
        }
    });

    guessDigits.forEach(digit => {
        if (digit && secretDigits.includes(digit)) {
            correctNumbers++;
            secretDigits[secretDigits.indexOf(digit)] = null; // Mark as used
        }
    });

    rowIndicators[0].textContent = correctPositions;
    rowIndicators[0].style.backgroundColor = 'lightgreen'
    rowIndicators[1].textContent = correctNumbers;
    rowIndicators[1].style.backgroundColor = 'orange'

    if (correctPositions === 5) {
        endGame(true); // Player won
    } else if (currentRow === 5) {
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
    grid.querySelectorAll('.cell').forEach(cell => cell.textContent = '');
    grid.querySelectorAll('.indicator').forEach(indicator => indicator.style.backgroundColor = indicatorColor)
    resultDisplay.style.display = 'none';
    // restartButton.style.display = 'none';
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
