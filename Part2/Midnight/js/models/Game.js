import DiceSet from './DiceSet.js';
import Player from './Player.js';

// Written by Brian Bird, 4/10/2026 using Gemini 3.1 in Antigravity.
// Updated by Cherin Smith for Lab 3 Production Version, 4/19/2026

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
        this.rollCount = 0;
        this.lastRollHeldCount = 0;
        this.diceSet.reset();
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    canRoll() {
        if (this.diceSet.getHeldCount() === 6) {
            return 'All 6 dice are already held. End your turn.';
        }

        if (this.rollCount > 0 && this.diceSet.getHeldCount() <= this.lastRollHeldCount) {
            return 'You must hold at least 1 new die before rolling again.';
        }

        return true;
    }

    rollDice() {
        if (this.canRoll() === true) {
            this.diceSet.rollAll();
            this.rollCount++;
            this.lastRollHeldCount = this.diceSet.getHeldCount();
        }
    }

    isTurnOver() {
        return this.diceSet.getHeldCount() === 6;
    }

    getTurnScore() {
        return this.diceSet.getCurrentCargoScore();
    }

    endTurn() {
        if (!this.isTurnOver()) {
            return;
        }

        const currentPlayer = this.getCurrentPlayer();
        currentPlayer.setScore(this.getTurnScore());

        this.currentPlayerIndex++;

        if (this.currentPlayerIndex >= this.players.length) {
            this.isGameOver = true;
        } else {
            this.resetTurnState();
        }
    }

    getWinners() {
        if (!this.isGameOver) {
            return [];
        }

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