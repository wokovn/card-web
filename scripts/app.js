import { createCard } from './card.js';
import { loadCardData, genCardArray, NORMAL, RARE, SPECIAL} from './cardData.js';
import {  initialize, saveCardsToLocalStorage, displayInventory, totalCards, totalNormal, totalRare, totalSpecial, totalLegendary } from './inventory.js';

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

const legendarySfx = new Audio('sound/legendary-sfx.mp3');

const rarityOrder = {
    'normal': 1,
    'rare': 2,
    'special': 3,
    'legendary': 4
};

let isOnCooldown = false;
let isNextCardOnCooldown = false;
function addEffectSpecial(front,card) {
    card.style.animation = 'fastShake 1s ease-out 0.3s';
    if (!front.querySelector('.reveal-cover')) {
        const revealCoverTop = document.createElement('div');
        revealCoverTop.className = 'reveal-cover-special reveal-cover-top-special';
        revealCoverTop.style.overflow = 'hidden';
        front.appendChild(revealCoverTop);
    }

    if (!front.querySelector('.reveal-cover-bottom-special')) {
        const revealCoverBottom = document.createElement('div');
        revealCoverBottom.className = 'reveal-cover-special reveal-cover-bottom-special';
        revealCoverBottom.style.overflow = 'hidden';
        front.appendChild(revealCoverBottom);
    }

    if (!card.querySelector('.reveal-glow-special')) {
        const revealGlow = document.createElement('div');
        revealGlow.className = 'reveal-glow-special';
        card.appendChild(revealGlow);
    }
}
function addEffectLegendary(front,card) {
    card.style.animation = 'fastShake 1s ease-out 3 0.3s';
    legendarySfx.currentTime = 0.7;
    legendarySfx.volume = 0;
    legendarySfx.addEventListener('canplaythrough', () => {
        legendarySfx.play();
        let fadeInInterval = setInterval(() => {
            if (legendarySfx.volume < 1) {
                legendarySfx.volume += 0.05;
            } else {
                clearInterval(fadeInInterval);
            }
        }, 100);
    }, { once: true });
    legendarySfx.load();

    if (!front.querySelector('.reveal-cover-right-legendary')) {
        const revealCoverTop = document.createElement('div');
        revealCoverTop.className = 'reveal-cover-legendary reveal-cover-right-legendary';
        revealCoverTop.style.overflow = 'hidden';
        front.appendChild(revealCoverTop);
    }

    if (!front.querySelector('.reveal-cover-left-legendary')) {
        const revealCoverBottom = document.createElement('div');
        revealCoverBottom.className = 'reveal-cover-legendary reveal-cover-left-legendary';
        revealCoverBottom.style.overflow = 'hidden';
        front.appendChild(revealCoverBottom);
    }

    if (!front.querySelector('.reveal-cover')) {
        const revealCoverTop = document.createElement('div');
        revealCoverTop.className = 'reveal-cover-special reveal-cover-top-special';
        revealCoverTop.style.overflow = 'hidden';
        front.appendChild(revealCoverTop);
    }

    if (!front.querySelector('.reveal-cover-bottom-special')) {
        const revealCoverBottom = document.createElement('div');
        revealCoverBottom.className = 'reveal-cover-special reveal-cover-bottom-special';
        revealCoverBottom.style.overflow = 'hidden';
        front.appendChild(revealCoverBottom);
    }

    if (!card.querySelector('.reveal-glow-legendary')) {
        const revealGlow = document.createElement('div');
        revealGlow.className = 'reveal-glow-legendary';
        card.appendChild(revealGlow);
    }
}


function addCardEventListeners(card) {
    let isDragging = false;
    let startX, startY;
    let currentX = 0;
    let currentY = 0;
    let isFlipped = true;
    let front = card.querySelector('.card__face--front');
    let isSpecial = front.classList.contains('special') ? true : false;
    let isLegendary = front.classList.contains('legendary') ? true : false;
    let addedEffect = false;

    card.addEventListener('mousedown', (e) => {
        if (!card.classList.contains('top')) return;
        isDragging = true;
        startX = e.pageX - currentX;
        startY = e.pageY - currentY;
        card.style.cursor = 'grabbing';
        if (!addedEffect && (isSpecial || isLegendary)) {
            addedEffect = true;
            if (isSpecial) {
                addEffectSpecial(front,card);
            }
            else if (isLegendary) {
                addEffectLegendary(front,card);
            }
        }
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

        if (currentX < -50) {
            nextCardButton.click();
        }
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

        if (currentX < -50) {
            nextCardButton.click();
        }
    });

    card.addEventListener('dblclick', () => {
        if (!card.classList.contains('top')) return;
        isFlipped = !isFlipped;
        card.classList.toggle('flipped');
    });

    card.addEventListener('touchstart', (e) => {
        if (!card.classList.contains('top')) return;
        isDragging = true;
        startX = e.touches[0].pageX - currentX;
        startY = e.touches[0].pageY - currentY;
        card.style.cursor = 'grabbing';
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.touches[0].pageX - startX;
        currentY = e.touches[0].pageY - startY;
        card.style.transform = `rotateY(${currentX / 5}deg) rotateX(${-currentY / 5}deg)`;
    });

    document.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        card.style.cursor = 'grab';
        if (!isFlipped) {
            isFlipped = true;
            card.classList.add('flipped');
        }
        card.style.transform = 'rotateY(0deg) rotateX(0deg)';

        if (currentX < -50) {
            nextCardButton.click();
        }
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

    cards.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

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

async function playSwipeSound() {
    const sound = swipeSound[Math.floor(Math.random() * swipeSound.length)];
    sound.currentTime = 0;
    sound.addEventListener('canplaythrough', () => {
        sound.play();
    }, { once: true });
    sound.load();
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

initialize();