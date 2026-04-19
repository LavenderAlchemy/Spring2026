import Die from './Die.js';

export default class DiceSet {
    constructor() {
        this.dice = [];

        for (let i = 0; i < 6; i++) {
            this.dice.push(new Die());
        }

        this.hasOne = false;
        this.hasFour = false;
    }

    rollAll() {
        for (const die of this.dice) {
            die.roll();
        }

        this.evaluateDice();
    }

    evaluateDice() {
        this.hasOne = false;
        this.hasFour = false;

        for (const die of this.dice) {
            if (die.isHeld) {
                if (die.value === 1) {
                    this.hasOne = true;
                }

                if (die.value === 4) {
                    this.hasFour = true;
                }
            }
        }
    }

    isQualified() {
        return this.hasOne && this.hasFour;
    }

    getHeldCount() {
        let heldCount = 0;

        for (const die of this.dice) {
            if (die.isHeld) {
                heldCount++;
            }
        }

        return heldCount;
    }

    getCurrentCargoScore() {
        if (!this.isQualified()) {
            return 0;
        }

        let total = 0;
        let usedOne = false;
        let usedFour = false;

        for (const die of this.dice) {
            if (die.isHeld) {
                if (die.value === 1 && !usedOne) {
                    usedOne = true;
                } else if (die.value === 4 && !usedFour) {
                    usedFour = true;
                } else {
                    total += die.value;
                }
            }
        }

        return total;
    }

    reset() {
        this.hasOne = false;
        this.hasFour = false;

        for (const die of this.dice) {
            die.reset();
        }
    }
}