/*  Overview
    Domino Drop presents a grid of face-down dominos and one visible target domino.
    Click a face-down domino to reveal it. If its total pips are strictly greater
    than the target total, it is removed. After more than half of the dominos
    have been cleared, each successful removal also reduces the target total by 1.
    Otherwise, the domino flips back down. The first time a specific too-low domino
    is clicked, no life is lost. Clicking that same too-low domino again loses a life.

    Written by Brian Bird, 3/29/2026, using GitHub Copilot
    Lab 2
    Cherin Smith
    4/10/26
    Ver. Production
    Visual Studio Code
*/

'use strict';

import { GameLogic, NUMBER_OF_DOMINOS, STARTING_LIVES } from './gameLogic.js';
import { UI } from './ui.js';

const gameLogic = new GameLogic();
const ui = new UI();

const CHECK_DELAY_MS = 1500;

const init = () => {
    ui.cacheDominoElements(NUMBER_OF_DOMINOS);
    gameLogic.fillDominos();
    gameLogic.shuffleGridDominos();
    ui.showAllBacks();
    ui.updateTarget(gameLogic.dominos[gameLogic.currentTargetIndex]);
    ui.updateStatus(STARTING_LIVES, 0, NUMBER_OF_DOMINOS);
    ui.enableAllDominos(handleClick);
};

const handleClick = function () {
    const index = Number(this.id);

    gameLogic.pickDomino(index);
    ui.showGridDominoFace(index, gameLogic.dominos[index]);
    ui.disableDomino(index);
    ui.disableAllDominos();

    setTimeout(resolvePick, CHECK_DELAY_MS);
};

const resolvePick = () => {
    const pickIndex = gameLogic.currentPick;

    if (pickIndex === -1) {
        return;
    }

    if (gameLogic.isHigherThanTarget()) {
        const didReduceTarget = gameLogic.acceptPick();
        ui.removeDomino(pickIndex);
        ui.updateTarget(gameLogic.dominos[gameLogic.currentTargetIndex]);

        if (didReduceTarget) {
            ui.updateStatus(
                gameLogic.lives,
                gameLogic.removedCount,
                NUMBER_OF_DOMINOS,
                'Great! Target reduced by 1.'
            );
        } else {
            ui.updateStatus(
                gameLogic.lives,
                gameLogic.removedCount,
                NUMBER_OF_DOMINOS,
                'Great! Domino removed.'
            );
        }
    } else {
        const lostLife = gameLogic.rejectPick();
        ui.showDominoBack(pickIndex);

        if (lostLife) {
            ui.updateStatus(
                gameLogic.lives,
                gameLogic.removedCount,
                NUMBER_OF_DOMINOS,
                'Too low again. Life lost.'
            );
        } else {
            ui.updateStatus(
                gameLogic.lives,
                gameLogic.removedCount,
                NUMBER_OF_DOMINOS,
                'Too low. First warning, no life lost.'
            );
        }
    }

    const hasWon = gameLogic.hasClearedBoard();
    const hasLost = gameLogic.isOutOfLives();

    if (hasWon) {
        ui.updateStatus(
            gameLogic.lives,
            gameLogic.removedCount,
            NUMBER_OF_DOMINOS,
            'You win! Board cleared.'
        );
        ui.disableAllDominos();
    } else if (hasLost) {
        ui.updateStatus(
            gameLogic.lives,
            gameLogic.removedCount,
            NUMBER_OF_DOMINOS,
            'Game over. No lives left.'
        );
        ui.disableAllDominos();
    } else {
        ui.enableAllDominos(handleClick, true);
    }

    gameLogic.resetPick();
};

window.addEventListener('load', init);