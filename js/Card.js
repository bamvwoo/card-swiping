class Card {
    constructor(className, wrapperId) {
        this._range = { from: 0, to: 0 };
        this._dragging = false;
        this._moveData = [];
        this._className = className;
        this._wrapper = document;
        if (wrapperId) {
            const wrapper = document.getElementById(wrapperId);
            if (wrapper)
                this._wrapper = wrapper;
        }
        this.setRange();
        this.applyMouseEvent(this);
    }
    setRange() {
        if (this._wrapper === document) {
            this._range = {
                from: (window.innerWidth / 3),
                to: window.innerWidth - (window.innerWidth / 3)
            };
        }
        else {
            const rect = this._wrapper.getBoundingClientRect();
            this._range = {
                from: rect.left + (this._wrapper.offsetWidth / 3),
                to: rect.right - (this._wrapper.offsetWidth / 3)
            };
        }
    }
    applyMouseEvent(that) {
        this._wrapper.addEventListener('mousedown', function (e) {
            const target = e.target;
            if (target.classList.contains(that._className)) {
                that._dragging = true;
                target.classList.add(`${that._className}-dragging`);
            }
        });
        this._wrapper.addEventListener('mousemove', function (e) {
            e.preventDefault();
            if (that._dragging) {
                const target = document.querySelector(`.${that._className}-dragging`);
                const clientX = e.clientX;
                const clientY = e.clientY;
                target.style.left = clientX + 'px';
                target.style.top = clientY + 'px';
                that._moveData.push({
                    x: clientX,
                    y: clientY
                });
            }
        });
        this._wrapper.addEventListener('mouseup', function (e) {
            if (that._dragging) {
                that._dragging = false;
                const target = document.querySelector(`.${that._className}-dragging`);
                const clientX = e.clientX;
                const clientY = e.clientY;
                if (clientX < that._range.from || clientX > that._range.to) {
                    that.swipeCard(e);
                }
                else {
                    that.resetCard(e);
                }
                target.classList.remove(`${that._className}-dragging`);
            }
        });
    }
    swipeCard(e) {
        const card = document.querySelector(`.${this._className}-dragging`);
        if (this._moveData.length >= 2) {
            const lastMove = this._moveData[this._moveData.length - 1];
            const firstMove = this._moveData[0];
            const dx = lastMove.x - firstMove.x;
            const dy = lastMove.y - firstMove.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const acceleration = distance / this._moveData.length;
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
        this._moveData = [];
    }
    resetCard(e) {
        const card = document.querySelector(`.${this._className}-dragging`);
        card.style.left = '50%';
        card.style.top = '50%';
        card.style.transition = "1s ease";
        setTimeout(() => {
            card.style.transition = "none";
        }, 1000);
    }
}
export { Card };
