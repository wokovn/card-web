// --- inventory.js ---
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


export function displayInventory(totalNormal, totalRare, totalSpecial, totalLegendary, totalCards) {
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

    storedCards.forEach(item => {
        const cardHolder = document.createElement('div');
        cardHolder.className = `card-holder ${item.card.rarity}`;

        const img = document.createElement('img');
        img.src = `images/${item.card.rarity}/${item.card.image}` || 'images/1.png';
        img.className = `inventory-card`;
        const effect = document.createElement('div');
        
        cardHolder.appendChild(img);
        

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