import { generateFullDeck } from './cardData.js';
import { createCards, flipCards, addCardClickHandlers, getCardValue } from './cardUtils.js';
import { player } from './playerInfo.js';
import { updatePlayerInfo, updateDeckProgress, updateButtonStates, updateWeaponCardDisplay } from './ui.js';

let cards = [];
let cardPositions = [];
let fullDeck = [];
let cardsToShow = [];
const numCards = 4;

let cardContainerElem;
export let justFled = false;
export let selectedCardIds = [];
let pendingEffects = [];
export let weaponCardStack = [];

export function startGame() {
    cardContainerElem = document.querySelector('.card-container');
    player.hp = 20;
    player.attack = 0;
    player.rounds = 0;
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

    updatePlayerInfo();
    updateDeckProgress();
    updateButtonStates();
    startRound();
}

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

    // Animate shuffle
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
        }, 400);
    }, 700);
}

export function handleCardClick(card) {
    const cardId = card.id;
    if (!selectedCardIds.includes(cardId) && selectedCardIds.length < 3) {
        selectedCardIds.push(cardId);
        card.classList.add('selected');
        applyAndStoreEffect(card);
        updateButtonStates();
    }
}

function applyAndStoreEffect(card) {
    const cardId = parseInt(card.id, 10);
    const cardObj = cardsToShow.find(c => c.id === cardId);
    if (!cardObj) return;

    const value = getCardValue(cardObj.rank);
    let effect = null;

    if (cardObj.suit === 'D') {
        effect = { type: 'attack', prev: player.attack, prevCard: player.attackCard, prevStack: [...weaponCardStack] };
        player.attack = value;
        player.attackCard = cardObj;
        weaponCardStack = [cardObj];
        updateWeaponCardDisplay();
    } else if (cardObj.suit === 'H') {
        effect = { type: 'hp', prev: player.hp };
        player.hp = Math.min(player.hp + value, 20);
    } else if (cardObj.suit === 'S' || cardObj.suit === 'C') {
        if (value > player.attack) {
            effect = { type: 'hp', prev: player.hp, prevStack: [...weaponCardStack] };
            player.hp = Math.max(player.hp - (value - player.attack), 0);
            updateWeaponCardDisplay(undefined, cardObj); 
        } else {
            effect = { type: 'attack', prev: player.attack, prevCard: player.attackCard, prevStack: [...weaponCardStack] };
            player.attack = value;
            player.attackCard = cardObj;
            weaponCardStack.push(cardObj); // <-- Stack enemy card
            updateWeaponCardDisplay();
        }
    }

    if (effect) pendingEffects.push(effect);
    updatePlayerInfo();
}

export function finishRound() {
    if (selectedCardIds.length !== 3) {
        alert("Please select exactly 3 cards before proceeding.");
        return;
    }
    justFled = false;
    pendingEffects = [];

    const unclickedCard = cardsToShow.find(card => !selectedCardIds.includes(card.id.toString()));
    fullDeck = fullDeck.filter(card =>
        !selectedCardIds.includes(card.id.toString()) && card.id !== unclickedCard.id
    );

    let nextCards = [unclickedCard, ...fullDeck.slice(0, 3)];
    if (nextCards.length < 4) {
        alert("No more cards left! Game over.");
        return;
    }
    cardsToShow = nextCards;
    selectedCardIds = [];

    updateDeckProgress();
    updateWeaponCardDisplay(player.attackCard);
    initializeNewRound();
}

export function fleeRound() {
    if (justFled) {
        alert("You can't flee two rounds in a row!");
        return;
    }
    justFled = true;

    cards.forEach(card => card.classList.remove('selected'));
    selectedCardIds = [];

    for (let i = pendingEffects.length - 1; i >= 0; i--) {
        const effect = pendingEffects[i];
        if (effect.prevStack) {
            weaponCardStack = [...effect.prevStack];
            break;
        }
    }
    for (let i = pendingEffects.length - 1; i >= 0; i--) {
        const effect = pendingEffects[i];
        if (effect.type === 'attack') player.attack = effect.prev;
        if (effect.type === 'hp') player.hp = effect.prev;
    }
    pendingEffects = [];

    const moved = fullDeck.splice(0, numCards);
    fullDeck = fullDeck.concat(moved);
    cardsToShow = fullDeck.slice(0, numCards);

    updateDeckProgress();
    updatePlayerInfo();
    updateWeaponCardDisplay(player.attackCard);
    initializeNewRound();
}

function clearCards() {
    document.querySelectorAll('.card').forEach(card => card.remove());
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}