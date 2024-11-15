
const createCardsButton = document.getElementById('createCards');
const nextCardButton = document.getElementById('nextCard');
const cardContainer = document.querySelector('.card-container');
const cardsElements = [];
let currentCardIndex = 0;

const NORMAL = .75;
const RARE = .90;
const SPECIAL = .98;

let cards = [];

function createCard(info) {
    
    const scene = document.createElement('div');
    scene.className = 'scene';

    const card = document.createElement('div');
    card.className = 'card flipped'; // Start flipped

    const front = document.createElement('div');
    front.className = info.rarity ? `card__face card__face--front ${info.rarity}` : 'card__face card__face--front normal';
    const frontImg = document.createElement('img');
    frontImg.className = 'front-img';
    frontImg.src = `images/${info.rarity}/${info.image}` || 'images/1.png';
    frontImg.draggable = false; // Prevent image dragging
    front.appendChild(frontImg);

    const back = document.createElement('div');
    back.className = 'card__face card__face--back';
    const backImg = document.createElement('img');
    backImg.className = 'back-img';
    backImg.src = 'images/back.png';
    backImg.draggable = false; // Prevent image dragging
    back.appendChild(backImg);

    const left = document.createElement('div');
    left.className = 'card__face card__face--left';

    const right = document.createElement('div');
    right.className = 'card__face card__face--right';

    const top = document.createElement('div');
    top.className = 'card__face card__face--top';

    const bottom = document.createElement('div');
    bottom.className = 'card__face card__face--bottom';

    card.appendChild(front);
    card.appendChild(back);
    card.appendChild(left);
    card.appendChild(right);
    card.appendChild(top);
    card.appendChild(bottom);
    scene.appendChild(card);



    let isDragging = false;
    let startX, startY;
    let currentX = 0;
    let currentY = 0;
    let isFlipped = true; // Initialize isFlipped here


    function addDoubleClick() {  // Function to add the double-click listener
        card.addEventListener('dblclick', () => {
            if (cardsElements.indexOf(scene) === currentCardIndex) { // Only if it's the top card
                isFlipped = !isFlipped;
                card.classList.toggle('flipped');
            }
        });
    }


    card.addEventListener('mousedown', (e) => {
        if (cardsElements.indexOf(scene) !== currentCardIndex) return; // Only drag top card
        if (isDragging) return;
        isDragging = true;
        startX = e.pageX - currentX;
        startY = e.pageY - currentY;
        card.style.cursor = 'grabbing';

    });

    document.addEventListener('mousemove', (e) => {
        if (cardsElements.indexOf(scene) !== currentCardIndex) return; // Only drag/rotate top card
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.pageX - startX;
        currentY = e.pageY - startY;
        card.style.transform = `rotateY(${currentX / 5}deg) rotateX(${-currentY / 5}deg)`;
    });

    document.addEventListener('mouseup', () => {
        if (cardsElements.indexOf(scene) !== currentCardIndex) return; // Only for top card
        if (!isDragging) return;
        isDragging = false;
        card.style.cursor = 'grab';
        if (!isFlipped) {
            isFlipped = true;
            card.classList.add('flipped');
        }
        card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });



    addDoubleClick(); // Call to add the listener
    return scene;
}

// createCardsButton.addEventListener('click', () => {
//     gridContainer.innerHTML = ''; // Clear previous cards

//     for (let i = 0; i < 10; i++) {
//         const cardScene = createCard(cards[i % cards.length]);
//         gridContainer.appendChild(cardScene);

//         // Animation after a short delay for each card
//         setTimeout(() => {
//             cardScene.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
//             cardScene.style.opacity = 1;
//             cardScene.style.transform = 'translateY(0)';
//         }, i * 100); // 100ms delay between each card
//     }
// });


async function loadCardData(filename) {
    const response = await fetch(filename);
    return response.json();
}

async function genCardArray(cards) {
    cards = [];
    const normalCards = await loadCardData('JSON/normal.json');
    const rareCards = await loadCardData('JSON/rare.json');
    const specialCards = await loadCardData('JSON/special.json');
    const legendaryCards = await loadCardData('JSON/legendary.json');

    console.log(normalCards);
    console.log(rareCards);
    console.log(specialCards);
    console.log(legendaryCards);


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
    console.log(cards);
    return cards;
}

createCardsButton.addEventListener('click', async () => {
    cardContainer.innerHTML = '';
    cardsElements.length = 0;
    currentCardIndex = 0;
    cards = await genCardArray(cards);
    for (let i = 0; i < cards.length; i++) {
        const cardScene = createCard(cards[i]);
        cardScene.classList.add('scene');
        cardContainer.appendChild(cardScene);
        cardsElements.push(cardScene);
        cardScene.style.opacity = 1;
        cardScene.style.transform = 'translateY(0)';
    }

    saveCardsToLocalStorage();
    positionCards();
    updateButtonVisibility(); // Call the function to initially set button visibility
});


function positionCards() {
    const offset = 30;
    cardsElements.forEach((card, index) => {
        card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        card.style.opacity = 1;
        if (index <= currentCardIndex) {
            card.style.transform = `translateY(${index * offset}px) `;
            card.style.zIndex = cardsElements.length - index;
        } else {
            card.style.transform = `translateX(${currentCardIndex * offset + offset}px)`;
            card.style.zIndex = 0;
        }
    });
}


nextCardButton.addEventListener('click', () => {
    if (currentCardIndex < cardsElements.length) {
        const currentCard = cardsElements[currentCardIndex];
        currentCard.style.transform = `translateX(-100vw) translateY(50vw) scale(0.5)`;
        currentCard.style.opacity = 0;

        setTimeout(() => {
            cardContainer.removeChild(currentCard);
            cardsElements.splice(currentCardIndex, 1);
            if (cardsElements.length > 0) { // Check before repositioning
                positionCards();
            }
            updateButtonVisibility(); // Update button visibility after removing card
        }, 500);
        if (cardsElements.length > currentCardIndex) { // Check if there's a new top card
            let newTopCardScene = cardsElements[currentCardIndex];
            let newTopCard = newTopCardScene.querySelector('.card'); // Get the card element

            if (newTopCard) {  // Make sure newTopCard exists
                let isFlipped = true;
                newTopCard.addEventListener('dblclick', () => { // Add the listener
                    if (newTopCard.parentNode && cardsElements.indexOf(newTopCard.parentNode) === currentCardIndex) {
                        isFlipped = !isFlipped;
                        newTopCard.classList.toggle('flipped');
                    }
                });
            }

        }
    }
    
});

function updateButtonVisibility() {
    if (cardsElements.length > 0) {
        createCardsButton.style.display = 'none';
        nextCardButton.style.display = 'block';
    } else {
        createCardsButton.style.display = 'block';
        nextCardButton.style.display = 'none';
    }
}

// Initial button state (Create button visible, Next button hidden):
nextCardButton.style.display = 'none';

// Get the inventory popup and close button
const inventoryPopup = document.querySelector('.inventory-popup');
const closePopup = document.querySelector('.inventory-popup .close');
const inventoryButton = document.getElementById('inventoryButton');

// Function to open the inventory popup
function openInventory() {
    inventoryPopup.style.display = 'block';
}

// Function to close the inventory popup
function closeInventory() {
    inventoryPopup.style.display = 'none';
}

// Event listeners
inventoryButton.addEventListener('click', () => {
    openInventory();
    displayInventory();
});
closePopup.addEventListener('click', closeInventory);

function saveCardsToLocalStorage() {
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

function displayInventory() {
    const inventoryPopupContent = document.querySelector('.inventory-cards-holder');
    inventoryPopupContent.innerHTML = '';

    let storedCards = JSON.parse(localStorage.getItem('cardsCollection')) || [];

    const inventoryDiv = document.createElement('div');
    inventoryDiv.className = 'inventory';
    inventoryDiv.style.marginTop = '40px';

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

        inventoryDiv.appendChild(cardHolder);
    });

    inventoryPopupContent.appendChild(inventoryDiv);

}

document.querySelector('.ClearInventory').addEventListener('click', function() {
    localStorage.removeItem('cardsCollection');
    alert('Inventory cleared!');
    displayInventory(); // Refresh the inventory display
});

