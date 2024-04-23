import { Card } from './Card.js';

window.onload = function() {

    const card = new Card("card-item", "wrapper");
}

const swipeCard = (e) => {
    
};

const resetCard = (e) => {
    const card = document.querySelector('.card-dragging');

    card.style.left = '50%';
    card.style.top = '50%';
    card.style.transition = "1s ease";

    setTimeout(() => {
        card.style.transition = "none";
    }, 1000);
};