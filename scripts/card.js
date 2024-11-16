// --- card.js ---
export function createCard(info) {
    const scene = document.createElement('div');
    scene.className = 'scene';

    const card = document.createElement('div');
    card.className = 'card flipped';

    const front = document.createElement('div');
    front.className = info.rarity ? `card__face card__face--front ${info.rarity}` : 'card__face card__face--front normal';
    const frontImg = document.createElement('img');
    frontImg.className = 'front-img';
    frontImg.src = `images/${info.rarity}/${info.image}` || 'images/1.png';
    frontImg.draggable = false;
    front.appendChild(frontImg);

    const back = document.createElement('div');
    back.className = 'card__face card__face--back';
    const backImg = document.createElement('img');
    backImg.className = 'back-img';
    backImg.src = 'images/back.png';
    backImg.draggable = false;
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

    // Return both scene and card elements
    return { scene, card };
}