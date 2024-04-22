let dragging = false;

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
        }
    });

    wrapper.addEventListener('mouseup', function(e) {
        if (dragging) {
            const target = document.querySelector('.card-dragging');

            if (e.clientX < range.from || e.clientX > range.to) {
                swipeCard(e);
            }

            target.classList.remove('card-dragging');
            dragging = false;
        }
    });

}

const swipeCard = (e) => {
    const card = document.querySelector('.card-dragging');

    
};