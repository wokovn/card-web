
let cardElm = document.querySelector('.scene');

const card = document.querySelector('.card');



let isDragging = false;
let startX, startY;
let currentX = 0;
let currentY = 0;

card.addEventListener('mousedown', (e) => {
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
  isDragging = false;
  card.style.cursor = 'grab';
});