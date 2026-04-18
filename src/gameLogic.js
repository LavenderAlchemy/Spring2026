'use strict';

export const NUMBER_OF_DOMINOS = 20;
export const STARTING_LIVES = 5;
export const HALF_CLEARED_COUNT = NUMBER_OF_DOMINOS / 2;

export class Domino {
    constructor(leftPips, rightPips) {
        this.leftPips = leftPips;
        this.rightPips = rightPips;
    }
}

export class GameLogic {
    constructor() {
        this.dominos = [];
        this.currentTargetIndex = NUMBER_OF_DOMINOS;
        this.currentPick = -1;
        this.removedCount = 0;
        this.lives = STARTING_LIVES;
        this.hasUsedFreeWarning = false;
    }

    fillDominos() {
        this.dominos = [];
        this.currentPick = -1;
        this.currentTargetIndex = NUMBER_OF_DOMINOS;
        this.removedCount = 0;
        this.lives = STARTING_LIVES;
        this.hasUsedFreeWarning = false;

        for (let i = 0; i < NUMBER_OF_DOMINOS; i++) {
            const left = Math.floor(Math.random() * 7);
            const right = Math.floor(Math.random() * 7);
            this.dominos.push(new Domino(left, right));
        }

        const targetTotal = Math.floor(Math.random() * 5) + 6;

        const minLeft = Math.max(0, targetTotal - 6);
        const maxLeft = Math.min(6, targetTotal);
        const targetLeft = Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;
        const targetRight = targetTotal - targetLeft;

        this.dominos.push(new Domino(targetLeft, targetRight));
    }

    shuffleGridDominos() {
        for (let i = NUMBER_OF_DOMINOS - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.dominos[i], this.dominos[j]] = [this.dominos[j], this.dominos[i]];
        }
    }

    pickDomino(index) {
        this.currentPick = index;
    }

    getTotalPips(domino) {
        const { leftPips, rightPips } = domino;
        return leftPips + rightPips;
    }

    isHigherThanTarget() {
        const pickedDomino = this.dominos[this.currentPick];
        const targetDomino = this.dominos[this.currentTargetIndex];
        return this.getTotalPips(pickedDomino) > this.getTotalPips(targetDomino);
    }

    acceptPick() {
        this.removedCount++;

        if (this.removedCount > HALF_CLEARED_COUNT) {
            const targetTotal = this.getTotalPips(this.dominos[this.currentTargetIndex]);
            const reducedTargetTotal = Math.max(0, targetTotal - 1);

            const reducedLeft = Math.min(6, reducedTargetTotal);
            const reducedRight = reducedTargetTotal - reducedLeft;

            this.dominos[this.currentTargetIndex] = new Domino(reducedLeft, reducedRight);
            return true;
        }

        return false;
    }

    rejectPick() {
        if (this.hasUsedFreeWarning) {
            this.lives--;
            return true;
        }

        this.hasUsedFreeWarning = true;
        return false;
    }

    hasClearedBoard() {
        return this.removedCount === NUMBER_OF_DOMINOS;
    }

    isOutOfLives() {
        return this.lives <= 0;
    }

    resetPick() {
        this.currentPick = -1;
    }
};