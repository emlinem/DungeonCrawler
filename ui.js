import { player } from './playerInfo.js';
import { selectedCardIds, justFled, weaponCardStack, fullDeck } from './gameEngine.js';
import { generateFullDeck } from './cardData.js';

export function updatePlayerInfo() {
    const infoElem = document.getElementById('player-info');
    infoElem.innerHTML = `
        <strong>Round:</strong> ${player.rounds} <br>    
        <strong>HP:</strong> ${player.hp} <br>
        <strong>Attack:</strong> ${player.attack} <br>
    `;
}

export function updateButtonStates() {
    const finishBtn = document.getElementById('finish-round-btn');
    const fleeBtn = document.getElementById('flee-btn');

    // Enable Finish Round only if 3 cards are selected
    if (selectedCardIds.length === 3) {
        finishBtn.disabled = false;
        finishBtn.classList.remove('disabled');
    } else {
        finishBtn.disabled = true;
        finishBtn.classList.add('disabled');
    }

    // Disable Flee if just fled last round
    if (justFled) {
        fleeBtn.disabled = true;
        fleeBtn.classList.add('disabled');
    } else {
        fleeBtn.disabled = false;
        fleeBtn.classList.remove('disabled');
    }
}

export function updateWeaponCardDisplay(attackCard, overlayCard) {
    const container = document.getElementById('weapon-card-container');
    container.innerHTML = '';

    const cardOffset = 18;
    const cardWidth = 80;
    const stack = weaponCardStack;
    const stackLength = stack.length;
    let totalCards = stackLength + (overlayCard ? 1 : 0);
    container.style.width = `${cardWidth + cardOffset * (totalCards - 1)}px`;

    stack.forEach((card, i) => {
        const img = document.createElement('img');
        img.src = card.imagePath;
        img.className = 'weapon-card-img';
        img.style.left = `${i * cardOffset}px`;
        img.style.zIndex = i;
        container.appendChild(img);
    });

    if (overlayCard) {
        const img2 = document.createElement('img');
        img2.src = overlayCard.imagePath;
        img2.className = 'weapon-card-img overlap';
        img2.style.left = `${stackLength * cardOffset}px`;
        img2.style.zIndex = stackLength + 1;
        container.appendChild(img2);
    }
}

export function showPopupMessage(msg) {
    const popup = document.getElementById('popup-message');
    if (!popup) return;
    popup.textContent = msg;
    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
    }, 1000); // 1 second
}

export function updateDeckProgress() {
    const deckProgress = document.getElementById('deck-progress');
    const deckProgressText = document.getElementById('deck-progress-text');
    const max = generateFullDeck().length;
    const value = fullDeck.length;
    deckProgress.max = max;
    animateProgressBar(value); 
    deckProgressText.textContent = `${value} / ${max}`;
}

export function animateProgressBar(targetValue) {
    const progress = document.getElementById('deck-progress');
    if (!progress) return;
    const current = Number(progress.value);
    const step = (targetValue - current) / 20; // 20 frames for smoothness
    let frame = 0;

    function animate() {
        frame++;
        const newValue = current + step * frame;
        if ((step > 0 && newValue >= targetValue) || (step < 0 && newValue <= targetValue)) {
            progress.value = targetValue;
        } else {
            progress.value = newValue;
            requestAnimationFrame(animate);
        }
    }
    animate();
}