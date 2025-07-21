// --- inventory.js ---
import {loadCardData } from './cardData.js';

export let totalCards = 0, totalNormal = 0, totalRare = 0, totalSpecial = 0, totalLegendary = 0;

export function saveCardsToLocalStorage(cards) {
    let storedCards = JSON.parse(localStorage.getItem('cardsCollection')) || [];
    for (let card of cards) {
        let existingEntry = storedCards.find(item => item.card.id === card.id);
        if (existingEntry) {
            existingEntry.duplicateIndex += 1;
        } else {
            storedCards.push({ card: card, duplicateIndex: 1 });
        }
    }
    localStorage.setItem('cardsCollection', JSON.stringify(storedCards));
}

async function loadTotalCards()
{
    const normalCards = await loadCardData('json/normal.json');
    const rareCards = await loadCardData('json/rare.json');
    const specialCards = await loadCardData('json/special.json');
    const legendaryCards = await loadCardData('json/legendary.json');

    totalNormal = normalCards.length;
    totalRare = rareCards.length;
    totalSpecial = specialCards.length;
    totalLegendary = legendaryCards.length;
    totalCards = totalNormal + totalRare + totalSpecial + totalLegendary;
}

export async function initialize() {
    if (totalCards == 0) {
        await loadTotalCards();
    }
}

export async function displayInventory(totalNormal, totalRare, totalSpecial, totalLegendary, totalCards) {
    const normalGrid = document.querySelector(".inventory.normal-holder");
    const rareGrid = document.querySelector(".inventory.rare-holder");
    const specialGrid = document.querySelector(".inventory.special-holder");
    const legendaryGrid = document.querySelector(".inventory.legendary-holder");

    let collectedNormal = 0, collectedRare = 0, collectedSpecial = 0, collectedLegendary = 0;

    normalGrid.innerHTML = '';
    rareGrid.innerHTML = '';
    specialGrid.innerHTML = '';
    legendaryGrid.innerHTML = '';

    // Load all available cards
    const normalCards = await loadCardData('json/normal.json');
    const rareCards = await loadCardData('json/rare.json');
    const specialCards = await loadCardData('json/special.json');
    const legendaryCards = await loadCardData('json/legendary.json');

    let storedCards = JSON.parse(localStorage.getItem('cardsCollection')) || [];

    // Helper function to create skeleton card
    function createSkeletonCard(rarity) {
        const cardHolder = document.createElement('div');
        cardHolder.className = 'card-holder';
        
        const skeletonCard = document.createElement('div');
        skeletonCard.className = `skeleton-card ${rarity}`;
        
        const skeletonIcon = document.createElement('div');
        skeletonIcon.className = 'skeleton-icon';
        
        const skeletonText = document.createElement('div');
        skeletonText.className = 'skeleton-text';
        skeletonText.textContent = 'Not Found';
        
        // Set rarity-specific icons
        switch(rarity) {
            case 'normal':
                skeletonIcon.textContent = '⚡';
                break;
            case 'rare':
                skeletonIcon.textContent = '💎';
                break;
            case 'special':
                skeletonIcon.textContent = '✨';
                break;
            case 'legendary':
                skeletonIcon.textContent = '👑';
                break;
        }
        
        skeletonCard.appendChild(skeletonIcon);
        skeletonCard.appendChild(skeletonText);
        cardHolder.appendChild(skeletonCard);
        
        return cardHolder;
    }

    // Helper function to create collected card
    function createCollectedCard(item) {
        const cardHolder = document.createElement('div');
        cardHolder.className = 'card-holder';

        const img = document.createElement('img');
        img.src = `images/${item.card.rarity}/${item.card.image}` || 'images/1.png';
        img.className = 'inventory-card';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.zIndex = "-1";
        
        cardHolder.appendChild(img);
        cardHolder.addEventListener('click', () => {
            const popup = document.createElement('div');
            popup.className = 'image-popup';
            popup.style.position = 'fixed';
            popup.style.top = '0';
            popup.style.left = '0';
            popup.style.width = '100%';
            popup.style.height = '100%';
            popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            popup.style.display = 'flex';
            popup.style.justifyContent = 'center';
            popup.style.alignItems = 'center';
            popup.style.zIndex = '1000';
            popup.style.draggable = 'false';
            popup.style.grab = 'none';

            const popupImage = document.createElement('img');
            popupImage.src = img.src;
            popupImage.style.width = '90%';
            popupImage.style.height = '90%';
            popupImage.style.objectFit = 'contain';
            popupImage.style.draggable = 'false';
            popupImage.style.pointerEvents = 'none';

            popup.appendChild(popupImage);
            document.body.appendChild(popup);

            popup.addEventListener('click', () => {
                document.body.removeChild(popup);
            });
        });

        if (item.duplicateIndex > 1) {
            const duplicateCircle = document.createElement('div');
            duplicateCircle.className = 'duplicate-circle';
            duplicateCircle.textContent = item.duplicateIndex;
            cardHolder.appendChild(duplicateCircle);
        }

        return cardHolder;
    }

    // Display cards for each rarity
    function displayRarityCards(allCards, grid, rarity) {
        let collectedCount = 0;
        
        allCards.forEach(card => {
            const collectedCard = storedCards.find(item => item.card.id === card.id);
            
            if (collectedCard) {
                const cardElement = createCollectedCard(collectedCard);
                grid.appendChild(cardElement);
                collectedCount++;
            } else {
                const skeletonElement = createSkeletonCard(rarity);
                grid.appendChild(skeletonElement);
            }
        });
        
        return collectedCount;
    }

    // Display all cards with skeletons
    collectedNormal = displayRarityCards(normalCards, normalGrid, 'normal');
    collectedRare = displayRarityCards(rareCards, rareGrid, 'rare');
    collectedSpecial = displayRarityCards(specialCards, specialGrid, 'special');
    collectedLegendary = displayRarityCards(legendaryCards, legendaryGrid, 'legendary');

    // Update the card counts in the new HTML structure
    const inventoryTitle = document.querySelector('.inventory-title');
    const normalCount = document.getElementById('normal-count');
    const rareCount = document.getElementById('rare-count');
    const specialCount = document.getElementById('special-count');
    const legendaryCount = document.getElementById('legendary-count');

    if (inventoryTitle) {
        // Update the main inventory title to show total count
        const totalCollected = collectedNormal + collectedRare + collectedSpecial + collectedLegendary;
        inventoryTitle.innerHTML = `
            <span class="title-icon">🎴</span>
            Card Collection
            <span class="title-accent">Inventory (${totalCollected}/${totalCards})</span>
        `;
    }

    if (normalCount) normalCount.textContent = `${collectedNormal}/${totalNormal}`;
    if (rareCount) rareCount.textContent = `${collectedRare}/${totalRare}`;
    if (specialCount) specialCount.textContent = `${collectedSpecial}/${totalSpecial}`;
    if (legendaryCount) legendaryCount.textContent = `${collectedLegendary}/${totalLegendary}`;

}