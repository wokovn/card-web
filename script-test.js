let rambo = { id: 'rambo', rarelity:'', name: '', description: '', image: 'images/rambo.png' };
let djchip = { id: 'rambo', rarelity:'', name: '', description: '', image: 'images/djchip.png' };
let snake = { id: 'rambo', rarelity:'', name: '', description: '', image: 'images/snake.png' };
let jikey = { id: 'rambo', rarelity:'', name: '', description: '', image: 'images/jikey.png' };
let nhism = { id: 'rambo', rarelity:'', name: '', description: '', image: 'images/nhism.png' };
let qnt = { id: 'rambo', rarelity:'', name: '', description: '', image: 'images/qnt.png' };
let mixi = { id: 'rambo', rarelity:'', name: '', description: '', image: 'images/mixi.png' };

let cards = [rambo, djchip, snake, jikey, nhism, qnt];

let gridContainer = document.querySelector('.grid-container');
const createCardsButton = document.getElementById('createCards');


function createCard(info) {
    const scene = document.createElement('div');
    scene.className = 'scene';

    const card = document.createElement('div');
    card.className = 'card special flipped'; // Start flipped

    const front = document.createElement('div');
    front.className = 'card__face card__face--front';
    const frontImg = document.createElement('img');
    frontImg.className = 'front-img';
    frontImg.src = info.image || 'images/1.png';
    frontImg.draggable = false; // Prevent image dragging
    front.appendChild(frontImg);


    const back = document.createElement('div');
    back.className = 'card__face card__face--back';
    const backImg = document.createElement('img');
    backImg.className = 'back-img';
    backImg.src = 'images/back.png';
    backImg.draggable = false; // Prevent image dragging
    back.appendChild(backImg);

    // Add other faces if needed (left, right, top, bottom) - omitted for brevity
    const left = document.createElement('div');
    left.className = 'card__face card__face--left';
    card.appendChild(left);

    const right = document.createElement('div');
    right.className = 'card__face card__face--right';
    card.appendChild(right);

    const top = document.createElement('div');
    top.className = 'card__face card__face--top';
    card.appendChild(top);

    const bottom = document.createElement('div');
    bottom.className = 'card__face card__face--bottom';
    card.appendChild(bottom);

    card.appendChild(front);
    card.appendChild(back);
    scene.appendChild(card);



    let isDragging = false;
    let startX, startY;
    let currentX = 0;
    let currentY = 0;

    card.addEventListener('mousedown', (e) => {
        if (isDragging) return; // Prevent multiple drags
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

        // Return to front after dragging:
        if (!isFlipped) { // Only flip if not already on the front
            isFlipped = true;
            card.classList.add('flipped');
        }

        card.style.transform = 'rotateY(0deg) rotateX(0deg)'; // Reset rotation
    });

    let isFlipped = true;
    card.addEventListener('dblclick', () => {
        isFlipped = !isFlipped;
        if (isFlipped) {
            card.classList.add('flipped');
        } else {
            card.classList.remove('flipped');
        }
    });

    scene.style.opacity = 0;  // Initially hidden
    scene.style.transform = 'translateY(-20px)'; // Start position above

    return scene;
}

createCardsButton.addEventListener('click', () => {
    gridContainer.innerHTML = ''; // Clear previous cards

    for (let i = 0; i < 10; i++) {
        const cardScene = createCard(cards[i % cards.length]);
        gridContainer.appendChild(cardScene);

        // Animation after a short delay for each card
        setTimeout(() => {
            cardScene.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            cardScene.style.opacity = 1;
            cardScene.style.transform = 'translateY(0)';
        }, i * 100); // 100ms delay between each card
    }
});