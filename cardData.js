export function generateFullDeck() {
    const suits = ['H', 'D', 'S', 'C'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let deck = [];
    let id = 1;
    for (const suit of suits) {
        for (const rank of ranks) {
            if ((suit === 'H' || suit === 'D') && (rank === 'A' || rank === 'J')) continue;
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