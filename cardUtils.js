import { cardBackImgPath } from './cardData.js'
import { addCardToGridCell } from './cardGrid.js'

export function createCards(cardArray){
    cardArray.forEach((cardItem, index)=>{
        createCard(cardItem, index);
    });
}

function createCard(cardItem, index) {
    const cardElem = createElement('div')
    const cardInnerElem = createElement('div')
    const cardFrontElem = createElement('div')
    const cardBackElem = createElement('div')

    const cardFrontImg = createElement('img')
    const cardBackImg = createElement('img')

    addClassToElement(cardElem, 'card')
    addIdToElement(cardElem, cardItem.id)

    addClassToElement(cardInnerElem, 'card-inner')
    addClassToElement(cardFrontElem, 'card-front')
    addClassToElement(cardBackElem, 'card-back')

    addSrcToImageElement(cardBackImg, cardBackImgPath)
    addSrcToImageElement(cardFrontImg, cardItem.imagePath)

    addClassToElement(cardBackImg, 'card-img')
    addClassToElement(cardFrontImg, 'card-img')

    cardBackElem.appendChild(cardBackImg)
    cardFrontElem.appendChild(cardFrontImg)

    cardInnerElem.appendChild(cardFrontElem)
    cardInnerElem.appendChild(cardBackElem)

    cardElem.appendChild(cardInnerElem)

    addCardToGridCell(cardElem, index);
}

function createElement(elemType){ return document.createElement(elemType); }
function addClassToElement(elem, className) { elem.classList.add(className); }
function addIdToElement(elem, id) { elem.id = id; }
function addSrcToImageElement(elem, src) { elem.src = src; }

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

export function addChildElement(parentElem, childElem) {
    parentElem.appendChild(childElem);
}