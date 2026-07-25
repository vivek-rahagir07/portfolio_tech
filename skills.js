document.addEventListener('DOMContentLoaded', () => {
    const ring = document.getElementById('orbit-ring');
    const items = document.querySelectorAll('.orbit-item-half');
    const centerTitle = document.getElementById('center-title');
    const centerDesc = document.getElementById('center-desc');
    const centerIcon = document.getElementById('center-icon');
    const nextBtn = document.getElementById('btn-next-skill');

    if (!ring || items.length === 0) return;

    // Radius of the circle path (should match half the width of orbit-wrapper)
    let radius = adjustForMobile(); 
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
                item.style.transform = `translate(-50%, -50%) scale(1.25)`;
                item.style.zIndex = 10;
                if(iconBg) iconBg.style.filter = 'brightness(1.4)';
                
                // Update center display with smooth animation
                centerTitle.classList.add('fade-out');
                centerDesc.classList.add('fade-out');
                
                setTimeout(() => {
                    centerTitle.textContent = item.dataset.title;
                    centerDesc.textContent = item.dataset.desc;
                    centerIcon.className = item.dataset.icon + ' center-icon-half';
                    centerIcon.style.color = item.dataset.color;
                    
                    // Add dynamic glow
                    centerIcon.style.filter = `drop-shadow(0 0 20px ${item.dataset.color})`;
                    
                    centerTitle.classList.remove('fade-out');
                    centerTitle.classList.add('fade-in');
                    centerDesc.classList.remove('fade-out');
                    centerDesc.classList.add('fade-in');
                    
                    setTimeout(() => {
                        centerTitle.classList.remove('fade-in');
                        centerDesc.classList.remove('fade-in');
                    }, 500);
                }, 300);
                
                // Update long description on the left
                const longDescEl = document.getElementById('skills-long-desc');
                if(longDescEl && item.dataset.experience) {
                    longDescEl.textContent = item.dataset.experience;
                    // trigger simple fade animation
                    longDescEl.style.animation = 'none';
                    void longDescEl.offsetWidth;
                    longDescEl.style.animation = 'fadeInUp 0.5s ease forwards';
                }
                
                centerIcon.classList.remove('pop');
                void centerIcon.offsetWidth; 
                centerIcon.classList.add('pop');
            } else {
                item.style.transform = `translate(-50%, -50%) scale(0.65)`;
                item.style.zIndex = 1;
                if(iconBg) iconBg.style.filter = 'brightness(0.8)';
            }
        });
    }

    // Adjust radius for mobile
    function adjustForMobile() {
        if (window.innerWidth < 768) {
            return 140; // Smaller radius for mobile
        }
        return 350; // Desktop radius
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
    
    function startFastRotate() {
        clearInterval(autoRotateInterval);
        
        const orbitRing = document.getElementById('orbit-ring');
        
        // Reset rotation state
        orbitRing.style.transition = 'none';
        orbitRing.style.transform = 'rotate(0deg)';
        void orbitRing.offsetWidth; // Force reflow
        
        // Calculate smooth full rotation + random offset
        const totalSpins = Math.floor(Math.random() * 5) + 5;
        const randomSkillOffset = Math.floor(Math.random() * totalItems);
        // We add negative degrees to simulate counter-clockwise movement which shifts top index
        const targetRotation = (totalSpins * 360) + (randomSkillOffset * (360 / totalItems));
        
        orbitRing.style.transition = 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)'; 
        orbitRing.style.transform = `rotate(${targetRotation}deg)`;
        
        setTimeout(() => {
            orbitRing.style.transition = 'none';
            orbitRing.style.transform = 'rotate(0deg)';
            
            // Adjust currentIndex based on the final rotation offset
            currentIndex = (currentIndex - randomSkillOffset + (totalItems * 10)) % totalItems;
            
            positionItems(currentIndex);
            startAutoRotate();
        }, 3000);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextSkill();
            startAutoRotate(); // Reset timer on manual click
        });
    }
    
    // Fast rotate button
    const fastRotateBtn = document.getElementById('btn-fast-rotate');
    if (fastRotateBtn) {
        fastRotateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            startFastRotate();
        });
    }

    items.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            positionItems(currentIndex);
            startAutoRotate();
        });
        item.addEventListener('keydown', (e) => {
            if(e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                currentIndex = index;
                positionItems(currentIndex);
                startAutoRotate();
            }
        });
    });

    // Initialize
    positionItems(currentIndex);
    startAutoRotate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        radius = adjustForMobile();
        positionItems(currentIndex);
    });
});
