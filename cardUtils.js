import { cardBackImgPath } from './cardData.js';

export function createCards(cardArray){
    return cardArray.map((cardItem, index) => createCard(cardItem, index));
}

function createCard(cardItem, index) {
    const cardElem = document.createElement('div');
    const cardInnerElem = document.createElement('div');
    const cardFrontElem = document.createElement('div');
    const cardBackElem = document.createElement('div');

    const cardFrontImg = document.createElement('img');
    const cardBackImg = document.createElement('img');

    cardElem.classList.add('card');
    cardElem.id = cardItem.id;

    cardInnerElem.classList.add('card-inner');
    cardFrontElem.classList.add('card-front');
    cardBackElem.classList.add('card-back');

    cardBackImg.src = cardBackImgPath;
    cardFrontImg.src = cardItem.imagePath;

    cardBackImg.classList.add('card-img');
    cardFrontImg.classList.add('card-img');

    cardBackElem.appendChild(cardBackImg);
    cardFrontElem.appendChild(cardFrontImg);

    cardInnerElem.appendChild(cardFrontElem);
    cardInnerElem.appendChild(cardBackElem);

    cardElem.appendChild(cardInnerElem);
    
    cardElem.addEventListener('mouseenter', () => {
        document.getElementById('info-box').textContent = getCardExplanation(cardItem);
    });
    cardElem.addEventListener('mouseleave', () => {
        document.getElementById('info-box').textContent = 'Hover over a card to see its effect.';
    });

    return cardElem;
}

export function flipCard(card, flipToBack) {
    const inner = card.querySelector('.card-inner');
    if (flipToBack) {
        inner.classList.add('flip-it');
    } else {
        inner.classList.remove('flip-it');
    }
}

export function flipCards(cards, flipToBack) {
    cards.forEach(card => flipCard(card, flipToBack));
}

export function getCardValue(rank) {
    return parseInt(rank, 10) ||
        (rank === 'A' ? 14 : rank === 'J' ? 11 : rank === 'Q' ? 12 : rank === 'K' ? 13 : 0);
}

export function addCardClickHandlers(cards, onClick) {
    cards.forEach(card => {
        card.addEventListener('click', () => onClick(card));
    });
}

export function getCardExplanation(cardObj) {
    if (cardObj.suit === 'D') {
        if (isFace(cardObj)) {
            return `Blacksmith: Removes enemy deterioration from your weapon. If your weapon is in tip-top shape, it gets an upgrade!`;
        } else {
            return `Weapon: Pick up a new weapon.`;
        }
    } else if (cardObj.suit === 'H') {
        if (isFace(cardObj)) {
            return `Merchant: Sell your weapon for a health potion.`;
        } else {
            return `Health Potion: Heals you by this card's value (up to max HP).`;
        }
    } else if (cardObj.suit === 'S' || cardObj.suit === 'C') {
        return `Enemy: Battle this enemy to get rid of this card. But watch out, it will attack back!`;
    }
    return '';
}

export function clearCards() {
    document.querySelectorAll('.card').forEach(card => card.remove());
}

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function isFace(cardObj) {
    return ['J', 'Q', 'K', 'A'].includes(cardObj.rank);
}