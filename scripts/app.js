import { createCard } from './card.js';
import { loadCardData, genCardArray, NORMAL, RARE, SPECIAL, totalCards, totalNormal, totalRare, totalSpecial, totalLegendary } from './cardData.js';
import { saveCardsToLocalStorage, displayInventory } from './inventory.js';

const createCardsButton = document.getElementById('createCards');
const nextCardButton = document.getElementById('nextCard');
const cardContainer = document.querySelector('.card-container');
let cardsElements = [];
let currentCardIndex = 0;

let cards = [];
const swipeSound = [
    new Audio('sound/next-1.mp3'),
    new Audio('sound/next-2.mp3'),
    new Audio('sound/next-3.mp3'),
    new Audio('sound/next-4.mp3')
];

let isOnCooldown = false;
let isNextCardOnCooldown = false;

function addCardEventListeners(card) {
    let isDragging = false;
    let startX, startY;
    let currentX = 0;
    let currentY = 0;
    let isFlipped = true;

    card.addEventListener('mousedown', (e) => {
        if (!card.classList.contains('top')) return;
        isDragging = true;
        startX = e.pageX - currentX;
        startY = e.pageY - currentY;
        card.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.pageX - startX;
        currentY = e.pageY - startY;
        card.style.transform = `rotateY(${currentX / 5}deg) rotateX(${-currentY / 5}deg)`;
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        card.style.cursor = 'grab';
        if (!isFlipped) {
            isFlipped = true;
            card.classList.add('flipped');
        }
        card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });

    card.addEventListener('dblclick', () => {
        if (!card.classList.contains('top')) return;
        isFlipped = !isFlipped;
        card.classList.toggle('flipped');
    });
}

createCardsButton.addEventListener('click', async () => {
    if (isOnCooldown) return;
    isOnCooldown = true;
    createCardsButton.disabled = true;

    cardContainer.innerHTML = '';
    cardsElements = [];
    currentCardIndex = 0;
    cards = await genCardArray();

    for (let i = 0; i < cards.length; i++) {
        const { scene, card } = createCard(cards[i]);
        cardContainer.appendChild(scene);
        cardsElements.push(scene);
        scene.style.opacity = 1;
        scene.style.transform = 'translateY(0)';
    }

    // Add event listeners to the top card
    const topCard = cardsElements[currentCardIndex].querySelector('.card');
    addCardEventListeners(topCard);

    saveCardsToLocalStorage(cards);
    positionCards();
    updateButtonVisibility();

    setTimeout(() => {
        isOnCooldown = false;
        createCardsButton.disabled = false;
    }, 2000);
});

function positionCards() {
    const offset = 30;
    cardsElements.forEach((scene, index) => {
        scene.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        scene.style.opacity = 1;
        scene.classList.remove('top');
        if (index === currentCardIndex) {
            scene.classList.add('top');
        }
        if (index <= currentCardIndex) {
            scene.style.transform = `translateY(${index * offset}px)`;
            scene.style.zIndex = cardsElements.length - index;
        } else {
            scene.style.transform = `translateX(${currentCardIndex * offset + offset}px)`;
            scene.style.zIndex = 0;
        }
    });

    // After positioning, update event listeners
    cardsElements.forEach((scene, index) => {
        const card = scene.querySelector('.card');
        if (index === currentCardIndex) {
            card.classList.add('top');
            addCardEventListeners(card);
        } else {
            card.classList.remove('top');
            // Optionally, remove event listeners if not the top card
        }
    });
}

function playSwipeSound() {
    const sound = swipeSound[Math.floor(Math.random() * swipeSound.length)];
    sound.currentTime = 0; // Reset the sound to the beginning for consecutive plays
    sound.play();
}

nextCardButton.addEventListener('click', () => {
    if (isNextCardOnCooldown) return;
    isNextCardOnCooldown = true;
    nextCardButton.disabled = true;

    if (currentCardIndex < cardsElements.length) {
        const currentCard = cardsElements[currentCardIndex];
        currentCard.style.transform = `translateX(-100vw) translateY(50vw) scale(0.5)`;
        currentCard.style.opacity = 0;

        playSwipeSound();

        setTimeout(() => {
            cardContainer.removeChild(currentCard);
            cardsElements.splice(currentCardIndex, 1);

            positionCards();
            updateButtonVisibility();

            // Update event listeners for the new top card
            const topCard = cardsElements[currentCardIndex]?.querySelector('.card');
            if (topCard) {
                addCardEventListeners(topCard);
            }

            // Reset cooldown after card removal and state update
            isNextCardOnCooldown = false;
            nextCardButton.disabled = false;
        }, 500); // This timeout matches the card removal animation duration
    } else {
        // If there are no more cards, reset cooldown immediately
        isNextCardOnCooldown = false;
        nextCardButton.disabled = false;
    }

    // Remove the previous cooldown reset
    // setTimeout(() => {
    //     isNextCardOnCooldown = false;
    //     nextCardButton.disabled = false;
    // }, 300);
});

function updateButtonVisibility() {
    nextCardButton.style.display = cardsElements.length > 0 ? 'block' : 'none';
    createCardsButton.style.display = cardsElements.length > 0 ? 'none' : 'block';
}

nextCardButton.style.display = 'none';


// Inventory related code (unchanged from previous versions)
const inventoryPopup = document.querySelector('.inventory-popup');
const closePopup = document.querySelector('.inventory-popup .close');
const inventoryButton = document.getElementById('inventoryButton');

function openInventory() {
    inventoryPopup.style.display = 'block';
}

function closeInventory() {
    inventoryPopup.style.display = 'none';
}

inventoryButton.addEventListener('click', () => {
    openInventory();
    displayInventory(totalNormal, totalRare, totalSpecial, totalLegendary, totalCards);
});

closePopup.addEventListener('click', closeInventory);

document.querySelector('.ClearInventory').addEventListener('click', function () {
    localStorage.removeItem('cardsCollection');
    alert('Inventory cleared!');
    displayInventory(totalNormal, totalRare, totalSpecial, totalLegendary, totalCards);
});