let dragging = false;
let moveData = [];

window.onload = function() {

    const wrapper = document.getElementById('wrapper');
    const rect = wrapper.getBoundingClientRect();

    const range = {
        from: rect.left + (wrapper.offsetWidth / 3),
        to: rect.right - (wrapper.offsetWidth / 3)
    }

    wrapper.addEventListener('mousedown', function(e) {
        const target = e.target;

        if (target.classList.contains('card')) {
            dragging = true;
            target.classList.add('card-dragging');
        }
    });

    wrapper.addEventListener('mousemove', function(e) {
        e.preventDefault();
        if (dragging) {
            const target = document.querySelector('.card-dragging');
            target.style.left = e.clientX + 'px';
            target.style.top = e.clientY + 'px';

            moveData.push({
                x: e.clientX,
                y: e.clientY
            });
        }
    });

    wrapper.addEventListener('mouseup', function(e) {
        if (dragging) {
            const target = document.querySelector('.card-dragging');

            if (e.clientX < range.from || e.clientX > range.to) {
                swipeCard(e);
            } else {
                resetCard(e);
            }

            target.classList.remove('card-dragging');
            dragging = false;
        }
    });

}

const swipeCard = (e) => {
    const card = document.querySelector('.card-dragging');

    if (moveData.length >= 2) {
        const lastMove = moveData[moveData.length - 1];
        const firstMove = moveData[0];

        const dx = lastMove.x - firstMove.x;
        const dy = lastMove.y - firstMove.y;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const acceleration = distance / moveData.length;
        const direction = { x: dx / distance, y: dy / distance };

        const cardPosition = { x: parseInt(card.style.left), y: parseInt(card.style.top) };
        
        // 애니메이션 속도 계수 (가속도에 따라 조절)
        let speedFactor = 10;
        
        // 카드 애니메이션 함수
        function animateCard() {
            // 카드 위치 업데이트
            cardPosition.x += direction.x * acceleration * speedFactor;
            cardPosition.y += direction.y * acceleration * speedFactor;

            const cardRect = card.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            
            if (cardRect.right < 0 || cardRect.left > screenWidth || cardRect.bottom < 0 || cardRect.top > screenHeight) {
                // 화면을 벗어난 경우 애니메이션 종료
                clearInterval(animationInterval);
                card.style.display = 'none'; // 카드 숨기기
            }

            // 카드 위치 적용
            card.style.left = cardPosition.x + 'px';
            card.style.top = cardPosition.y + 'px';

            speedFactor *= 0.99; // 속도 감속
        }
        
        // 일정 시간마다 카드 애니메이션 함수 호출하여 애니메이션 실행
        var animationInterval = setInterval(animateCard, 20);
    }

    moveData = [];
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