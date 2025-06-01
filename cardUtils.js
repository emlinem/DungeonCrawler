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