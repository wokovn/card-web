// --- cardData.js ---
import { totalCards, totalNormal, totalLegendary, totalRare, totalSpecial } from "./inventory.js";

export async function loadCardData(filename) {
    const response = await fetch(filename);
    return response.json();
}


export const NORMAL = .7;
export const RARE = .90;
export const SPECIAL = .98;

export const rarityOrder = {
    'normal': 1,
    'rare': 2,
    'special': 3,
    'legendary': 4
};

export async function genCardArray() {
    let cards = [];
    const normalCards = await loadCardData('json/normal.json');
    const rareCards = await loadCardData('json/rare.json');
    const specialCards = await loadCardData('json/special.json');
    const legendaryCards = await loadCardData('json/legendary.json');

    for (let i = 0; i < 10; i++) {
        let rate = Math.random();
        if (rate <= NORMAL) {
            cards[i] = { ...normalCards[Math.floor(Math.random() * normalCards.length)], rarity: 'normal' };
        } else if (rate > NORMAL && rate < RARE) {
            cards[i] = { ...rareCards[Math.floor(Math.random() * rareCards.length)], rarity: 'rare' };
        } else if (rate >= RARE && rate < SPECIAL) {
            cards[i] = { ...specialCards[Math.floor(Math.random() * specialCards.length)], rarity: 'special' };
        } else {
            cards[i] = { ...legendaryCards[Math.floor(Math.random() * legendaryCards.length)], rarity: 'legendary' };
        }
    }
    
    // Sort cards by rarity
    cards.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

    return cards;
}