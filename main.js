import { generateFullDeck } from './cardData.js';
import { createCards, flipCards } from './cardUtils.js';
import { collectCards, dealCards } from './boardUtils.js';
import { player } from './playerInfo.js';

let cards = [];
let cardPositions = [];
let fullDeck = [];
let cardsToShow = [];
const numCards = 4;

let cardContainerElem;
let playGameButtonElem;
let currentGameStatusElem;

document.addEventListener('DOMContentLoaded', loadGame);

function loadGame() {
    playGameButtonElem = document.getElementById('playGame');
    cardContainerElem = document.querySelector('.card-container');
    currentGameStatusElem = document.querySelector('.current-status');

    fullDeck = generateFullDeck();
    shuffleArray(fullDeck);
    cardsToShow = fullDeck.slice(0, numCards);

    createCards(cardsToShow);
    cards = document.querySelectorAll('.card');
    cardPositions = Array.from(cards).map(card => card.id);
    addCardClickHandlers();
    flipCards(cards, true);

    // Start the game automatically
    startGame();

    document.getElementById('finish-round-btn').addEventListener('click', finishRound);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startGame() {
    initializeNewGame();
    startRound();
}

function initializeNewGame() {
    // Reset player or game state if needed
}

function startRound() {
    initializeNewRound();
    updatePlayerInfo();

    // Start with all cards together, backs showing
    collectCards(cardContainerElem, cards);
    flipCards(cards, true);

    setTimeout(() => {
        dealCards(cardContainerElem, cards);
        setTimeout(() => {
            flipCards(cards, false);
        }, 500);
    }, 700);
}

function initializeNewRound() {
    // Any round-specific setup
}

function addCardClickHandlers() {
    cards.forEach(card => {
        card.addEventListener('click', () => {
            evaluateCardChoice(card);
        });
    });
}

function evaluateCardChoice(card) {
    const cardId = parseInt(card.id, 10);
    const cardObj = cardsToShow.find(c => c.id === cardId);
    if (!cardObj) return;

    // Helper to get card value
    const getValue = (rank) =>
        parseInt(rank, 10) ||
        (rank === 'A' ? 14 : rank === 'J' ? 11 : rank === 'Q' ? 12 : rank === 'K' ? 13 : 0);

    const value = getValue(cardObj.rank);

    // Diamonds: set player.attack to the card's value
    if (cardObj.suit === 'D') {
        player.attack = value;
    }
    // Hearts: add the card's value to player.hp, but max 20
    else if (cardObj.suit === 'H') {
        player.hp = Math.min(player.hp + value, 20);
    }
    // Spades or Clubs: enemy encounter
    else if (cardObj.suit === 'S' || cardObj.suit === 'C') {
        if (value > player.attack) {
            // Player takes damage
            const damage = value - player.attack;
            player.hp = Math.max(player.hp - damage, 0);
        }
        // Weapon durability goes down: player's attack becomes enemy's value
        player.attack = value;
    }

    updatePlayerInfo();
}

function updatePlayerInfo() {
    const infoElem = document.getElementById('player-info');
    infoElem.innerHTML = `
        <strong>Round:</strong> ${player.rounds} <br>    
        <strong>HP:</strong> ${player.hp} <br>
        <strong>Attack:</strong> ${player.attack} <br>
    `;
}

function finishRound() {
    flipCards(cards, true);
    setTimeout(() => {
        // Move first four cards to end
        const moved = fullDeck.splice(0, numCards);
        fullDeck = fullDeck.concat(moved);
        cardsToShow = fullDeck.slice(0, numCards);

        // Remove old cards from DOM
        document.querySelectorAll('.card').forEach(card => card.remove());

        // Create new cards and update references
        createCards(cardsToShow);
        cards = document.querySelectorAll('.card');
        cardPositions = Array.from(cards).map(card => card.id);
        addCardClickHandlers();

        flipCards(cards, true);

        setTimeout(() => {
            collectCards(cardContainerElem, cards);
            setTimeout(() => {
                dealCards(cardContainerElem, cards);
                setTimeout(() => {
                    flipCards(cards, false);
                }, 500);
            }, 400);
        }, 100);
    }, 500);
}