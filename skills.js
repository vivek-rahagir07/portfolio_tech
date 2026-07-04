document.addEventListener('DOMContentLoaded', () => {
    const ring = document.getElementById('orbit-ring');
    const items = document.querySelectorAll('.orbit-item-half');
    const centerTitle = document.getElementById('center-title');
    const centerDesc = document.getElementById('center-desc');
    const centerIcon = document.getElementById('center-icon');
    const nextBtn = document.getElementById('btn-next-skill');

    if (!ring || items.length === 0) return;

    // Radius of the circle path (should match half the width of orbit-wrapper)
    const radius = 325; 
    const totalItems = items.length;
    let currentIndex = 0;
    let autoRotateInterval;

    function positionItems(activeIndex) {
        // We want the activeIndex item to be at the top center (-Math.PI/2)
        // If angle = (index / total) * 2PI + angleOffset
        // -PI/2 = (activeIndex / total) * 2PI + angleOffset
        const angleOffset = -Math.PI / 2 - (activeIndex / totalItems) * Math.PI * 2;

        items.forEach((item, index) => {
            const angle = (index / totalItems) * Math.PI * 2 + angleOffset;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            // Apply coordinates
            item.style.left = `calc(50% + ${x}px)`;
            item.style.top = `calc(50% + ${y}px)`;
            
            // Highlight the active item
            const iconBg = item.querySelector('.hexagon-icon');
            if (index === activeIndex) {
                item.style.transform = `translate(-50%, -50%) scale(1.3)`;
                item.style.zIndex = 10;
                if(iconBg) iconBg.style.filter = 'brightness(1.5)';
                
                // Update center display
                centerTitle.textContent = item.dataset.title;
                centerDesc.textContent = item.dataset.desc;
                centerIcon.className = item.dataset.icon + ' center-icon-half';
                centerIcon.style.color = item.dataset.color;
                
                centerIcon.classList.remove('pop');
                void centerIcon.offsetWidth; 
                centerIcon.classList.add('pop');
            } else {
                item.style.transform = `translate(-50%, -50%) scale(1)`;
                item.style.zIndex = 1;
                if(iconBg) iconBg.style.filter = 'brightness(1)';
            }
        });
    }

    function nextSkill() {
        currentIndex = (currentIndex + 1) % totalItems;
        positionItems(currentIndex);
    }

    function startAutoRotate() {
        clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(() => {
            nextSkill();
        }, 4000); // Stop for 4 seconds on each tech stack
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextSkill();
            startAutoRotate(); // Reset timer on manual click
        });
    }

    items.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            positionItems(currentIndex);
            startAutoRotate();
        });
    });

    // Initialize
    positionItems(currentIndex);
    startAutoRotate();
});
