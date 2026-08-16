document.addEventListener('DOMContentLoaded', () => {
    const ring = document.getElementById('orbit-ring');
    const items = document.querySelectorAll('.orbit-item-half');
    const centerTitle = document.getElementById('center-title');
    const centerDesc = document.getElementById('center-desc');
    const centerIcon = document.getElementById('center-icon');
    const nextBtn = document.getElementById('btn-next-skill');

    if (!ring || items.length === 0) return;

    
    let radius = adjustForMobile(); 
    const totalItems = items.length;
    let currentIndex = 0;
    let autoRotateInterval;

    function positionItems(activeIndex) {
        
        
        
        const angleOffset = -Math.PI / 2 - (activeIndex / totalItems) * Math.PI * 2;

        items.forEach((item, index) => {
            const angle = (index / totalItems) * Math.PI * 2 + angleOffset;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            
            item.style.left = `calc(50% + ${x}px)`;
            item.style.top = `calc(50% + ${y}px)`;
            
            
            const iconBg = item.querySelector('.hexagon-icon');
            if (index === activeIndex) {
                item.style.transform = `translate(-50%, -50%) scale(1.25)`;
                item.style.zIndex = 10;
                if(iconBg) iconBg.style.filter = 'brightness(1.4)';
                
                
                centerTitle.classList.add('fade-out');
                centerDesc.classList.add('fade-out');
                
                setTimeout(() => {
                    centerTitle.textContent = item.dataset.title;
                    centerDesc.textContent = item.dataset.desc;
                    centerIcon.className = item.dataset.icon + ' center-icon-half';
                    centerIcon.style.color = item.dataset.color;
                    
                    
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
                
                
                const longDescEl = document.getElementById('skills-long-desc');
                if(longDescEl && item.dataset.experience) {
                    longDescEl.textContent = item.dataset.experience;
                    
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

    
    function adjustForMobile() {
        const ringEl = document.getElementById('orbit-ring');
        if (window.innerWidth <= 1024) {
            if (ringEl && ringEl.clientWidth > 0) {
                return (ringEl.clientWidth / 2) - 22;
            }
            if (window.innerWidth < 400) {
                return 118;
            } else if (window.innerWidth < 768) {
                return 125;
            }
            return 140;
        }
        return 350;
    }

    function nextSkill() {
        currentIndex = (currentIndex + 1) % totalItems;
        positionItems(currentIndex);
    }

    function startAutoRotate() {
        clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(() => {
            nextSkill();
        }, 4000); 
    }
    
    function startFastRotate() {
        clearInterval(autoRotateInterval);
        
        const orbitRing = document.getElementById('orbit-ring');
        
        
        orbitRing.style.transition = 'none';
        orbitRing.style.transform = 'rotate(0deg)';
        void orbitRing.offsetWidth; 
        
        
        const totalSpins = Math.floor(Math.random() * 5) + 5;
        const randomSkillOffset = Math.floor(Math.random() * totalItems);
        
        const targetRotation = (totalSpins * 360) + (randomSkillOffset * (360 / totalItems));
        
        orbitRing.style.transition = 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)'; 
        orbitRing.style.transform = `rotate(${targetRotation}deg)`;
        
        setTimeout(() => {
            orbitRing.style.transition = 'none';
            orbitRing.style.transform = 'rotate(0deg)';
            
            
            currentIndex = (currentIndex - randomSkillOffset + (totalItems * 10)) % totalItems;
            
            positionItems(currentIndex);
            startAutoRotate();
        }, 3000);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextSkill();
            startAutoRotate(); 
        });
    }
    
    
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

    
    positionItems(currentIndex);
    startAutoRotate();
    
    
    window.addEventListener('resize', () => {
        radius = adjustForMobile();
        positionItems(currentIndex);
    });
});
