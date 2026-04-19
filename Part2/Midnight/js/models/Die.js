export default class Die {
    constructor() {
        this.value = 1;
        this.isHeld = false;
    }

    roll() {
        if (!this.isHeld) {
            this.value = Math.floor(Math.random() * 6) + 1;
        }

        return this.value;
    }

    toggleHold() {
        this.isHeld = !this.isHeld;
    }

    hold() {
        this.isHeld = true;
    }

    reset() {
        this.isHeld = false;
        this.value = 1;
    }
}