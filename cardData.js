export function generateFullDeck() {
    const suits = ['H', 'D', 'C', 'S']; // Hearts, Diamonds, Clubs, Spades
    const ranks = [
        {name: '2', value: 1},
        {name: '3', value: 2},
        {name: '4', value: 3},
        {name: '5', value: 4},
        {name: '6', value: 5},
        {name: '7', value: 6},
        {name: '8', value: 7},
        {name: '9', value: 8},
        {name: '10', value: 9},
        {name: 'J', value: 10},
        {name: 'Q', value: 11},
        {name: 'K', value: 12},
        {name: 'A', value: 13}
    ];
    let deck = [];
    let id = 1;
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({
                id: id++,
                suit,
                rank: rank.name,
                imagePath: `/images/${suit}${rank.name}.png`
            });
        }
    }
    return deck;
}

export const cardBackImgPath = '/images/back.png';