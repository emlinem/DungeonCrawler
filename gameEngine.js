import { generateFullDeck } from './cardData.js';
import { createCards, flipCards, addCardClickHandlers, getCardValue, shuffleArray, clearCards, isFace } from './cardUtils.js';
import { player } from './playerInfo.js';
import { updatePlayerInfo, updateButtonStates, updateWeaponCardDisplay, showPopupMessage, updateDeckProgress } from './ui.js';

const BLACKSMITH_REMOVALS = { J: 1, Q: 2, K: 3, A: 4 };
const BLACKSMITH_BONUS    = { J: 1, Q: 2, K: 3, A: 4 };
const MERCHANT_BONUS      = { J: 0, Q: 1, K: 3, A: 5 };

let cards = [];
export let fullDeck = [];
let cardsToShow = [];
let cardPositions = [];
const numCards = 4;

let cardContainerElem;
export let justFled = false;
export let selectedCardIds = [];
let pendingEffects = [];
export let weaponCardStack = [];
let weaponCardStackStartOfRound = [];
let baseAttack = 0;
let hpAtStartOfRound = 0;

// --- Game Initialization ---
export function startGame() {
    cardContainerElem = document.querySelector('.card-container');
    player.hp = 20;
    player.attack = 0;
    player.rounds = 0;
    player.bonus = 0;
    weaponCardStack = [];
    weaponCardStackStartOfRound = [];
    baseAttack = 0;
    hpAtStartOfRound = 0;
    fullDeck = generateFullDeck();
    shuffleArray(fullDeck);
    cardsToShow = fullDeck.slice(0, numCards);

    clearCards();
    cards = createCards(cardsToShow);
    cards.forEach(card => cardContainerElem.appendChild(card));
    cardPositions = Array.from(cards).map(card => card.id);
    selectedCardIds = [];
    addCardClickHandlers(cards, handleCardClick);
    flipCards(cards, true);

    updateWeaponCardDisplay();
    updatePlayerInfo();
    updateButtonStates();
    startRound();
}

// --- Round Management ---
export function startRound() {
    justFled = false;
    player.rounds += 1;
    initializeNewRound();
    updatePlayerInfo();
    updateButtonStates();
}

function initializeNewRound() {
    document.getElementById('finish-round-btn').disabled = true;
    document.getElementById('flee-btn').disabled = true;
    weaponCardStackStartOfRound = [...weaponCardStack];
    baseAttack = player.attack;
    hpAtStartOfRound = player.hp;

    flipCards(cards, true);
    setTimeout(() => {
        clearCards();
        cards = createCards(cardsToShow);
        cards.forEach(card => cardContainerElem.appendChild(card));
        cardPositions = Array.from(cards).map(card => card.id);
        addCardClickHandlers(cards, handleCardClick);
        cards.forEach(card => card.classList.remove('selected'));
        flipCards(cards, true);
        setTimeout(() => {
            flipCards(cards, false);
            updateButtonStates();
            updateDeckProgress();
        }, 400);
    }, 700);
}

// --- Card Click Handler ---
export function handleCardClick(card) {
    const cardId = card.id;
    if (!selectedCardIds.includes(cardId) && selectedCardIds.length < 3) {
        selectedCardIds.push(cardId);
        card.classList.add('selected');
        applyAndStoreEffect(card);
        updateButtonStates();
    }
}

// --- Card Effect Logic ---
function applyAndStoreEffect(card) {
    const cardId = parseInt(card.id, 10);
    const cardObj = cardsToShow.find(c => c.id === cardId);
    if (!cardObj) return;

    const value = getCardValue(cardObj.rank);

    // --- Diamonds ---
    if (cardObj.suit === 'D') {
        if (isFace(cardObj)) {
            // Blacksmith logic
            let enemyIdxs = [];
            for (let i = weaponCardStack.length - 1; i >= 0; i--) {
                const s = weaponCardStack[i].suit;
                if (s === 'S' || s === 'C') enemyIdxs.push(i);
            }
            if (enemyIdxs.length) {
                let toRemove = BLACKSMITH_REMOVALS[cardObj.rank];
                for (let n = 0; n < toRemove && enemyIdxs.length; n++) {
                    const idx = enemyIdxs.shift();
                    weaponCardStack.splice(idx, 1);
                }
                // Recalculate attack: top card in stack or 0 if empty
                if (weaponCardStack.length > 0) {
                    const topCard = weaponCardStack[weaponCardStack.length - 1];
                    player.attack = getCardValue(topCard.rank);
                } else {
                    player.attack = 0;
                }
            } else {
                // No enemy cards: grant permanent bonus
                const bonus = BLACKSMITH_BONUS[cardObj.rank];
                player.attack += bonus;
            }
            weaponCardStack = [...weaponCardStack, cardObj]; // keep record of smiths
        } else {
            weaponCardStack = [];
            weaponCardStack.push(cardObj);
            player.attack = value; 
            player.attackCard = cardObj;
            baseAttack = player.attack;
        }
        updateWeaponCardDisplay();
        showPopupMessage('Switched weapon!');

    // --- Hearts ---
    } else if (cardObj.suit === 'H') {
        if (isFace(cardObj)) {
            // Merchant logic
            const enemyCount = weaponCardStack.filter(c => c.suit === 'S' || c.suit === 'C').length;
            const merchantBonus = MERCHANT_BONUS[cardObj.rank];
            const healRaw = player.attack - enemyCount + merchantBonus;
            const heal = Math.max(0, Math.min(healRaw, 20 - player.hp));
            player.hp += heal;
            weaponCardStack = [];
            player.attack = 0;   
            updateWeaponCardDisplay();
            showPopupMessage(`Healed! (+${heal})`);
        } else {
            player.hp = Math.min(player.hp + value, 20);
            showPopupMessage('Healed!');
        }

    // --- Spades/Clubs ---
    } else if (cardObj.suit === 'S' || cardObj.suit === 'C') {
        if (player.attack >= value) {
            weaponCardStack = [...weaponCardStack, cardObj];
            player.attack = value;
            updateWeaponCardDisplay();
            showPopupMessage('Weapon deteriorated!');
        } else {
            player.hp = Math.max(player.hp - (value - player.attack), 0);
            weaponCardStack = [...weaponCardStack, cardObj];
            updateWeaponCardDisplay();
            showPopupMessage('Took damage!');
        }
    }

    updatePlayerInfo();
}

// --- Round Finish Logic ---
export function finishRound() {
    // If this is the last round (4 or fewer cards left), require all remaining cards to be clicked
    if (fullDeck.length <= 4) {
        if (selectedCardIds.length !== cardsToShow.length) {
            alert(`Please select all remaining cards (${cardsToShow.length}) before proceeding.`);
            return;
        }
    } else {
        // Otherwise, require exactly 3 cards
        if (selectedCardIds.length !== 3) {
            alert("Please select exactly 3 cards before proceeding.");
            return;
        }
    }
    justFled = false;
    pendingEffects = [];

    const unclickedCard = cardsToShow.find(card => !selectedCardIds.includes(card.id.toString()));
    fullDeck = fullDeck.filter(card =>
        !selectedCardIds.includes(card.id.toString()) && (!unclickedCard || card.id !== unclickedCard.id)
    );

    // Game over if player HP is 0 or less
    if (player.hp <= 0) {
        showGameOverModal("You have been defeated.");
        return;
    }

    // If this was the last round, end the game
    if (fullDeck.length === 0) {
        showGameOverModal("No more cards left! Game over.");
        return;
    }

    // Prepare next set of cards
    let nextCards;
    if (unclickedCard) {
        nextCards = [unclickedCard, ...fullDeck.slice(0, 3)];
    } else {
        nextCards = fullDeck.slice(0, 4);
    }
    cardsToShow = nextCards;
    selectedCardIds = [];

    updateWeaponCardDisplay();
    initializeNewRound();
}

// --- Flee Logic ---
export function fleeRound() {
    if (justFled) {
        alert("You can't flee two rounds in a row!");
        return;
    }
    justFled = true;

    cards.forEach(card => card.classList.remove('selected'));
    selectedCardIds = [];

    // Restore stack and player state to the beginning of the round
    weaponCardStack = [...weaponCardStackStartOfRound];
    player.attack = baseAttack;
    player.hp = hpAtStartOfRound;

    // Move current cards to the back of the deck
    const fleeingCardIds = cardsToShow.map(card => card.id);
    const fleeingCards = fullDeck.filter(card => fleeingCardIds.includes(card.id));
    fullDeck = fullDeck.filter(card => !fleeingCardIds.includes(card.id));
    fullDeck = [...fullDeck, ...fleeingCards];

    // Draw new cards for next round
    cardsToShow = fullDeck.slice(0, 4);

    updatePlayerInfo();
    updateWeaponCardDisplay();
    initializeNewRound();
}

function showGameOverModal(message) {
    const modal = document.getElementById('game-over-modal');
    const msgElem = document.getElementById('game-over-message');
    msgElem.textContent = message;
    modal.style.display = 'flex';
}

function hideGameOverModal() {
    document.getElementById('game-over-modal').style.display = 'none';
}

// Attach event listener for play again button
document.addEventListener('DOMContentLoaded', () => {
    const playAgainBtn = document.getElementById('play-again-btn');
    if (playAgainBtn) {
        playAgainBtn.onclick = () => {
            hideGameOverModal();
            startGame();
        };
    }
});
