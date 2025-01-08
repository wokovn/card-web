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
    const inventoryPopupContent = document.querySelector('.inventory-cards-holder');
    //inventoryPopupContent.innerHTML = '';
    const normalGrid = document.querySelector(".inventory.normal-holder");
    const rareGrid = document.querySelector(".inventory.rare-holder");
    const specialGrid = document.querySelector(".inventory.special-holder");
    const legendaryGrid = document.querySelector(".inventory.legendary-holder");

    const inventorySection = document.querySelector('.inventory-section');
    const normalSection = document.querySelector('.normal-section');
    const rareSection = document.querySelector('.rare-section');
    const specialSection = document.querySelector('.special-section');
    const legendarySection = document.querySelector('.legendary-section');

    let collectedNormal = 0, collectedRare = 0, collectedSpecial = 0, collectedLegendary = 0;

    normalGrid.innerHTML = '';
    rareGrid.innerHTML = '';
    specialGrid.innerHTML = '';
    legendaryGrid.innerHTML = '';

    let storedCards = JSON.parse(localStorage.getItem('cardsCollection')) || [];

    storedCards.sort((a, b) => a.card.id.localeCompare(b.card.id));
    storedCards.forEach(item => {
        const cardHolder = document.createElement('div');
        //cardHolder.className = `card-holder ${item.card.rarity}`;
        cardHolder.className = `card-holder`;

        const img = document.createElement('img');
        img.src = `images/${item.card.rarity}/${item.card.image}` || 'images/1.png';
        img.className = `inventory-card`;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.zIndex = "-1";
        const effect = document.createElement('div');
        
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

        //inventoryDiv.appendChild(cardHolder);
        if(item.card.rarity == "normal") {
            normalGrid.appendChild(cardHolder);
            collectedNormal++;
        } else if(item.card.rarity == "rare") {
            rareGrid.appendChild(cardHolder);
            collectedRare++;
        } else if(item.card.rarity == "special") {
            specialGrid.appendChild(cardHolder);
            collectedSpecial++;
        } else if(item.card.rarity == "legendary") {
            legendaryGrid.appendChild(cardHolder);
            collectedLegendary++;
        }
    });


    inventorySection.innerHTML = `Total ${storedCards.length}/${totalCards}`;
    normalSection.innerHTML = `Normal ${collectedNormal}/${totalNormal}`;
    rareSection.innerHTML = `Rare ${collectedRare}/${totalRare}`;
    specialSection.innerHTML = `Special ${collectedSpecial}/${totalSpecial}`;
    legendarySection.innerHTML = `Legendary ${collectedLegendary}/${totalLegendary}`;

}