import { startGame, finishRound, fleeRound, handleCardClick } from './gameEngine.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('finish-round-btn').addEventListener('click', finishRound);
    document.getElementById('flee-btn').addEventListener('click', fleeRound);
    startGame();
});