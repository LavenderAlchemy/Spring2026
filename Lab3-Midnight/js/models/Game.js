import DiceSet from './DiceSet.js';
import Player from './Player.js';

// Written by Brian Bird, 4/10/2026 using Gemini 3.1 in Antigravity.

export default class Game {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.diceSet = new DiceSet();
        this.isGameOver = false;

        this.resetTurnState();
    }

    startNewGame(playerNames) {
        this.players = [];
        for (const name of playerNames) {
            this.players.push(new Player(name));
        }

        this.currentPlayerIndex = 0;
        this.isGameOver = false;
        this.resetTurnState();
    }

    resetTurnState() {
        this.rollsLeft = 3;
        this.diceSet.reset();
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    canRoll() {
        if (this.rollsLeft <= 0) {
            return 'No rolls left.';
        }

        if (this.rollsLeft < 3 && this.diceSet.getHeldCount() === 0) {
            return 'You must hold at least 1 die before rolling again.';
        }

        return true;
    }

    rollDice() {
        if (this.canRoll() === true) {
            this.diceSet.rollAll();
            this.rollsLeft--;
        }
    }

    isTurnOver() {
        return this.rollsLeft === 0;
    }

    hasBusted() {
        return this.isTurnOver() && !this.diceSet.isQualified();
    }

    endTurn() {
        const currentPlayer = this.getCurrentPlayer();
        currentPlayer.setScore(this.diceSet.getCurrentCargoScore());

        this.currentPlayerIndex++;
        if (this.currentPlayerIndex >= this.players.length) {
            this.isGameOver = true;
        } else {
            this.resetTurnState();
        }
    }

    getWinners() {
        if (!this.isGameOver) return [];

        let maxScore = -1;
        let winners = [];

        for (const player of this.players) {
            if (player.score > maxScore) {
                maxScore = player.score;
                winners = [player];
            } else if (player.score === maxScore) {
                winners.push(player);
            }
        }

        return winners;
    }
}