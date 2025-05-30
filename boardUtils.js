export function transformGridArea(cardContainerElem, areas){
    cardContainerElem.style.gridTemplateAreas = areas;
}

export function addCardsToGridAreaCell(cards, cellPositionClassName){
    const cellPositionElem = document.querySelector(cellPositionClassName);
    cards.forEach(card => {
        cellPositionElem.appendChild(card);
    });
}

export function addCardsToAppropriateCell(cards){
    const cellClasses = ['.card-pos-a', '.card-pos-b', '.card-pos-c', '.card-pos-d'];
    cards.forEach((card, index) => {
        const cellElem = document.querySelector(cellClasses[index]);
        if (cellElem) cellElem.appendChild(card);
    });
}

export function collectCards(cardContainerElem, cards){
    transformGridArea(cardContainerElem, '"a a a a"');
    addCardsToGridAreaCell(cards, '.card-pos-a');
}

export function dealCards(cardContainerElem, cards){
    addCardsToAppropriateCell(cards);
    const areaTemplate = returnGridAreasMappedToCardPos();
    transformGridArea(cardContainerElem, areaTemplate);
}

export function returnGridAreasMappedToCardPos(){
    return '"a b c d"';
}