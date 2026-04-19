import Game from './models/Game.js';

// Written by Brian Bird, 4/10/2026 with AI assistance from Gemini 3.1 in Antigravity.

const game = new Game();

// Setup Screen Elements
const setupScreen = document.getElementById('setup-screen');
const player1Input = document.getElementById('player1-name');
const player2Input = document.getElementById('player2-name');
const startGameBtn = document.getElementById('start-game-btn');

// Game Screen Elements
const gameScreen = document.getElementById('game-screen');
const currentPlayerDisplay = document.getElementById('current-player-display');
const messageDisplay = document.getElementById('message-display');
const diceContainer = document.getElementById('dice-container');
const rollBtn = document.getElementById('roll-btn');
const nextTurnBtn = document.getElementById('next-turn-btn');

// Scoreboard Screen Elements
const scoreboardScreen = document.getElementById('scoreboard-screen');
const winnerDisplay = document.getElementById('winner-display');
const scoreList = document.getElementById('score-list');
const newGameBtn = document.getElementById('new-game-btn');

function init() {
    startGameBtn.addEventListener('click', handleStartGame);
    rollBtn.addEventListener('click', handleRollClick);
    nextTurnBtn.addEventListener('click', handleNextTurnClick);
    newGameBtn.addEventListener('click', handleNewGameClick);
}

function handleStartGame() {
    const p1 = player1Input.value.trim() || 'Player 1';
    const p2 = player2Input.value.trim() || 'Player 2';

    if (p1 === p2) {
        alert('Please enter distinct names for players.');
        return;
    }

    game.startNewGame([p1, p2]);

    switchScreen(setupScreen, gameScreen);
    renderDice();
    updateUI();
}

function handleRollClick() {
    const validation = game.canRoll();

    if (validation !== true) {
        showMessage(validation);
        return;
    }

    showMessage('');
    game.rollDice();
    renderDice();
    updateUI();
}

function handleNextTurnClick() {
    game.endTurn();

    if (game.isGameOver) {
        showScoreboard();
    } else {
        renderDice();
        updateUI();
    }
}

function handleNewGameClick() {
    switchScreen(scoreboardScreen, setupScreen);
}

function showMessage(text) {
    messageDisplay.textContent = text;

    setTimeout(() => {
        if (messageDisplay.textContent === text) {
            messageDisplay.textContent = '';
        }
    }, 3000);
}

function updateUI() {
    const currentPlayer = game.getCurrentPlayer();

    currentPlayerDisplay.textContent = `${currentPlayer.name}'s Turn`;
    rollBtn.textContent = `Roll Dice (${game.rollsLeft} left)`;

    rollBtn.classList.toggle('hidden', game.isTurnOver());
    nextTurnBtn.classList.toggle('hidden', game.rollsLeft === 3);

    if (game.diceSet.isQualified()) {
        const score = game.diceSet.getCurrentCargoScore();
        nextTurnBtn.textContent = `Keep Score: ${score} & End Turn`;
    } else {
        nextTurnBtn.textContent = 'End Turn (Score: 0)';
    }
}

function renderDice() {
    diceContainer.innerHTML = '';

    const isFirstRoll = game.rollsLeft === 3;
    const diceEntities = ['?', '&#9856;', '&#9857;', '&#9858;', '&#9859;', '&#9860;', '&#9861;'];

    for (const die of game.diceSet.dice) {
        const dieEl = document.createElement('div');
        dieEl.className = 'die';

        dieEl.addEventListener('click', () => {
            if (isFirstRoll) return;
            if (game.isTurnOver()) return;

            die.toggleHold();
            game.diceSet.evaluateDice();

            renderDice();
            updateUI();
        });

        if (die.isHeld) {
            dieEl.classList.add('held');
        } else if (game.diceSet.isQualified()) {
            dieEl.classList.add('cargo');
        } else if (game.hasBusted()) {
            dieEl.classList.add('failed');
        }

        if (isFirstRoll) {
            dieEl.textContent = '?';
        } else {
            dieEl.innerHTML = diceEntities[die.value];
        }

        diceContainer.appendChild(dieEl);
    }
}

function showScoreboard() {
    switchScreen(gameScreen, scoreboardScreen);

    scoreList.innerHTML = '';

    for (const player of game.players) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${player.name}</span> <strong>${player.score}</strong>`;
        scoreList.appendChild(li);
    }

    const winners = game.getWinners();
    if (winners.length > 1) {
        winnerDisplay.textContent = "It's a Tie!";
    } else {
        winnerDisplay.textContent = `${winners[0].name} Wins!`;
    }
}

function switchScreen(hideScreen, showScreen) {
    hideScreen.classList.remove('active');
    hideScreen.classList.add('hidden');

    showScreen.classList.remove('hidden');
    showScreen.classList.add('active');
}

init();