import { addChildElement } from './cardUtils.js';

export function addCardToGridCell(card, index){
    const cellClasses = ['.card-pos-a', '.card-pos-b', '.card-pos-c', '.card-pos-d'];
    const cardPosElem = document.querySelector(cellClasses[index]);
    addChildElement(cardPosElem, card);
}