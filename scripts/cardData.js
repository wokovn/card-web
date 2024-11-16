// --- cardData.js ---
export async function loadCardData(filename) {
    const response = await fetch(filename);
    return response.json();
}

export let totalCards = 0, totalNormal = 0, totalRare = 0, totalSpecial = 0, totalLegendary = 0;

export const NORMAL = .75;
export const RARE = .90;
export const SPECIAL = .98;


export async function genCardArray() {
    let cards = [];
    const normalCards = await loadCardData('json/normal.json');
    const rareCards = await loadCardData('json/rare.json');
    const specialCards = await loadCardData('json/special.json');
    const legendaryCards = await loadCardData('json/legendary.json');


    for (let i = 0; i < 10; i++) {
        let rate = Math.random();
        if (rate <= NORMAL) {
            cards[i] = normalCards[Math.floor(Math.random() * normalCards.length)];
        } else if (rate > NORMAL && rate < RARE) {
            cards[i] = rareCards[Math.floor(Math.random() * rareCards.length)];
        } else if (rate >= RARE && rate < SPECIAL) {
            cards[i] = specialCards[Math.floor(Math.random() * specialCards.length)];
        } else {
            cards[i] = legendaryCards[Math.floor(Math.random() * legendaryCards.length)];
        }
    }

    totalNormal = normalCards.length;
    totalRare = rareCards.length;
    totalSpecial = specialCards.length;
    totalLegendary = legendaryCards.length;
    totalCards = totalNormal + totalRare + totalSpecial + totalLegendary;

    return cards;
}