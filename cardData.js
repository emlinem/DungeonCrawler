export function generateFullDeck() {
    // Example: returns an array of card objects with id, suit, rank, imagePath
    const suits = ['H', 'D', 'S', 'C'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let deck = [];
    let id = 1;
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({
                id: id++,
                suit,
                rank,
                imagePath: `images/${suit}${rank}.png`
            });
        }
    }
    return deck;
}

export const cardBackImgPath = 'images/back.png';