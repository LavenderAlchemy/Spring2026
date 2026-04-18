'use strict';

export class UI {
    constructor() {
        this.dominoElements = [];
        this.targetElement = null;
        this.statusElement = null;
    }

    cacheDominoElements(numberOfDominos) {
        this.dominoElements = [];

        for (let i = 0; i < numberOfDominos; i++) {
            this.dominoElements.push(document.getElementById(i));
        }

        this.targetElement = document.getElementById('target-domino');
        this.statusElement = document.getElementById('status');
    }

    formatDominoText(domino) {
        const { leftPips, rightPips } = domino;
        return `${leftPips} | ${rightPips}`;
    }

    showAllBacks() {
        for (const domino of this.dominoElements) {
            domino.classList.remove('removed');
            domino.classList.add('back');
            domino.textContent = '';
            domino.style.cursor = 'pointer';
        }
    }

    showDominoBack(index) {
        const domino = this.dominoElements[index];
        domino.classList.remove('removed');
        domino.classList.add('back');
        domino.textContent = '';
    }

    showGridDominoFace(index, dominoObj) {
        const domino = this.dominoElements[index];
        domino.classList.remove('back');
        domino.textContent = this.formatDominoText(dominoObj);
    }

    updateTarget(dominoObj) {
        this.targetElement.textContent = this.formatDominoText(dominoObj);
    }

    disableDomino(index) {
        const domino = this.dominoElements[index];
        domino.onclick = null;
        domino.style.cursor = 'default';
    }

    disableAllDominos() {
        for (const domino of this.dominoElements) {
            domino.onclick = null;
            domino.style.cursor = 'default';
        }
    }

    enableAllDominos(clickHandler, onlyRemaining = false) {
        for (const domino of this.dominoElements) {
            const isRemoved = domino.classList.contains('removed');

            if (!onlyRemaining || !isRemoved) {
                domino.onclick = clickHandler;
                domino.style.cursor = isRemoved ? 'default' : 'pointer';
            }
        }
    }

    removeDomino(index) {
        const domino = this.dominoElements[index];
        domino.classList.remove('back');
        domino.classList.add('removed');
        domino.textContent = '';
        domino.onclick = null;
        domino.style.cursor = 'default';
    }

    updateStatus(lives, removedCount, totalDominos, message = '') {
        let statusText = `Lives: ${lives} Removed: ${removedCount}/${totalDominos}`;

        if (message !== '') {
            statusText += ` | ${message}`;
        }

        this.statusElement.textContent = statusText;
    }
}