document.addEventListener('DOMContentLoaded', () => {
    
    let deferredPrompt;
    const installBtn = document.getElementById('install-btn');
    
    
    window.addEventListener('beforeinstallprompt', (e) => {
        
        e.preventDefault();
        
        deferredPrompt = e;
        
        if (installBtn) {
            installBtn.style.display = 'inline-block';
        }
    });
    
    
    if (installBtn) {
        installBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (deferredPrompt) {
                deferredPrompt.prompt();
                
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt');
                        installBtn.style.display = 'none';
                    } else {
                        console.log('User dismissed the A2HS prompt');
                    }
                    deferredPrompt = null;
                });
            } else {
                
                
                alert('PWA installation is not available on this device or the app is already installed.');
            }
        });
    }
    
    
    const cvDownloadBtn = document.getElementById('cv-download-btn');
    if (cvDownloadBtn) {
        cvDownloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const cvPath = 'photos/cv.png';
            
            
            const link = document.createElement('a');
            link.href = cvPath;
            link.download = 'cv.png';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('CV download initiated');
        });
    }
    
    
    function initHackerLiveClock() {
        const topNav = document.querySelector('nav:not(.mobile-bottom-dock)');
        if (!topNav) return;

        let timePill = document.getElementById('navTimePill');
        if (!timePill) {
            timePill = document.createElement('div');
            timePill.id = 'navTimePill';
            timePill.className = 'nav-hacker-clock';
            timePill.setAttribute('role', 'timer');
            timePill.setAttribute('aria-label', 'System Live Time');
            timePill.innerHTML = `
                <span class="hacker-clock-prompt">&gt;_</span>
                <span class="hacker-clock-time">00:00:00</span>
                <span class="hacker-clock-ampm">AM</span>
                <span class="hacker-clock-pulse"></span>
            `;

            const logo = topNav.querySelector('.logo');
            if (logo && logo.nextSibling) {
                topNav.insertBefore(timePill, logo.nextSibling);
            } else {
                topNav.appendChild(timePill);
            }
        }

        function updateClock() {
            const now = new Date();
            const hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = String(hours % 12 || 12).padStart(2, '0');

            const timeEl = timePill.querySelector('.hacker-clock-time');
            const ampmEl = timePill.querySelector('.hacker-clock-ampm');

            if (timeEl) timeEl.textContent = `${displayHours}:${minutes}:${seconds}`;
            if (ampmEl) ampmEl.textContent = ampm;
        }

        updateClock();
        setInterval(updateClock, 1000);
    }

    initHackerLiveClock();

    function initMobileNavigation() {
        const topNav = document.querySelector('nav:not(.mobile-bottom-dock)');
        if (topNav && !document.getElementById('mobile-dots-trigger')) {
            const dotsBtn = document.createElement('button');
            dotsBtn.type = 'button';
            dotsBtn.id = 'mobile-dots-trigger';
            dotsBtn.className = 'mobile-dots-btn';
            dotsBtn.setAttribute('aria-label', 'Open Profile Menu');
            dotsBtn.innerHTML = '<i class="fa-solid fa-ellipsis"></i>';
            topNav.appendChild(dotsBtn);
        }

        let bottomDock = document.getElementById('mobileBottomDock');
        if (!bottomDock) {
            bottomDock = document.createElement('nav');
            bottomDock.id = 'mobileBottomDock';
            bottomDock.className = 'mobile-bottom-dock';
            bottomDock.setAttribute('aria-label', 'Mobile Navigation');
            bottomDock.innerHTML = `
                <a href="index.html" class="dock-item" data-tab="home" aria-label="Home">
                    <div class="dock-icon-wrap"><i class="fa-solid fa-house"></i></div>
                    <span class="dock-label">Home</span>
                </a>
                <a href="projects.html" class="dock-item" data-tab="projects" aria-label="Projects">
                    <div class="dock-icon-wrap"><i class="fa-solid fa-layer-group"></i></div>
                    <span class="dock-label">Projects</span>
                </a>
                <a href="gallery.html" class="dock-item" data-tab="gallery" aria-label="Gallery">
                    <div class="dock-icon-wrap"><i class="fa-solid fa-images"></i></div>
                    <span class="dock-label">Gallery</span>
                </a>
                <a href="skills.html" class="dock-item" data-tab="skills" aria-label="Skills">
                    <div class="dock-icon-wrap"><i class="fa-solid fa-code"></i></div>
                    <span class="dock-label">Skills</span>
                </a>
                <button type="button" class="dock-item" data-tab="profile" id="dock-profile-tab" aria-label="Profile & More">
                    <div class="dock-icon-wrap"><i class="fa-solid fa-user"></i></div>
                    <span class="dock-label">Profil</span>
                </button>
            `;
            document.body.appendChild(bottomDock);
        }

        let profileSheet = document.getElementById('profileSheet');
        if (!profileSheet) {
            profileSheet = document.createElement('div');
            profileSheet.id = 'profileSheet';
            profileSheet.className = 'profile-sheet-overlay';
            profileSheet.setAttribute('role', 'dialog');
            profileSheet.setAttribute('aria-modal', 'true');
            profileSheet.setAttribute('aria-label', 'Vivek Yadav Profile');
            profileSheet.innerHTML = `
                <div class="profile-sheet-content">
                    <div class="sheet-drag-handle"></div>

                    <!-- Cover Banner -->
                    <div class="profile-cover-section">
                        <img src="collage/1.png" alt="Vivek Yadav – Professional Portrait" class="profile-cover-img">
                        <div class="profile-cover-gradient"></div>
                        <div class="profile-top-actions">
                            <button type="button" class="profile-back-btn" id="closeProfileSheet" aria-label="Close Profile">
                                <i class="fa-solid fa-chevron-left"></i>
                            </button>
                            <button type="button" class="profile-more-btn" aria-label="More Options">
                                <i class="fa-solid fa-ellipsis"></i>
                            </button>
                        </div>
                        <div class="profile-like-float" id="profileLikeBtn">
                            <i class="fa-regular fa-heart"></i> Like
                        </div>
                    </div>

                    <!-- Avatar + Quick Stats Row -->
                    <div class="profile-avatar-stats-row">
                        <div class="profile-avatar-ring">
                            <img src="collage/15.jpg" alt="Vivek Yadav">
                            <div class="profile-online-dot"></div>
                        </div>
                        <div class="profile-quick-stats">
                            <div class="profile-quick-stat">
                                <span class="pqs-val">15+</span>
                                <span class="pqs-lbl">projects</span>
                            </div>
                            <div class="pqs-dot"></div>
                            <div class="profile-quick-stat">
                                <span class="pqs-val">1.2k</span>
                                <span class="pqs-lbl">likes</span>
                            </div>
                        </div>
                    </div>

                    <!-- Identity -->
                    <div class="profile-identity-section">
                        <div class="profile-name-row">
                            <h3 class="profile-user-name">Vivek Yadav</h3>
                            <div class="profile-verified-badge">
                                <i class="fa-solid fa-check"></i>
                            </div>
                        </div>
                        <p class="profile-user-handle">@rahagir07</p>
                        <p class="profile-bio-text">
                            Full Stack Developer & Creative Technologist. Building digital experiences that inspire, from IoT hardware to beautiful web interfaces.
                        </p>
                        <div class="profile-rating-row">
                            <div class="profile-stars">
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                            </div>
                            <span class="profile-rating-count">26 reviews</span>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="profile-action-row">
                        <a href="contact.html" class="profile-action-btn primary">
                            <i class="fa-solid fa-paper-plane"></i> Hire Me
                        </a>
                        <a href="photos/cv.png" download="cv.png" class="profile-action-btn secondary" id="sheet-cv-download">
                            <i class="fa-solid fa-file-arrow-down"></i> Download CV
                        </a>
                    </div>

                    <!-- Highlight Cards -->
                    <div class="profile-highlights-grid">
                        <div class="profile-highlight-card">
                            <div class="phc-icon gold"><i class="fa-solid fa-layer-group"></i></div>
                            <span class="phc-val">15+</span>
                            <span class="phc-lbl">Projects</span>
                        </div>
                        <div class="profile-highlight-card">
                            <div class="phc-icon blue"><i class="fa-solid fa-clock"></i></div>
                            <span class="phc-val">3+</span>
                            <span class="phc-lbl">Yrs Exp</span>
                        </div>
                        <div class="profile-highlight-card">
                            <div class="phc-icon green"><i class="fa-solid fa-bullseye"></i></div>
                            <span class="phc-val">100%</span>
                            <span class="phc-lbl">Dedication</span>
                        </div>
                    </div>

                    <!-- Menu Card -->
                    <div class="profile-menu-card">
                        <a href="about.html" class="profile-menu-item">
                            <div class="pmi-left">
                                <div class="pmi-icon-box amber"><i class="fa-solid fa-user-tie"></i></div>
                                <span>About & Story</span>
                            </div>
                            <i class="fa-solid fa-chevron-right"></i>
                        </a>
                        <a href="gallery.html" class="profile-menu-item">
                            <div class="pmi-left">
                                <div class="pmi-icon-box purple"><i class="fa-regular fa-images"></i></div>
                                <span>Visual Gallery</span>
                            </div>
                            <i class="fa-solid fa-chevron-right"></i>
                        </a>
                        <a href="developer-guide.html" class="profile-menu-item">
                            <div class="pmi-left">
                                <div class="pmi-icon-box cyan"><i class="fa-solid fa-compass"></i></div>
                                <span>Developer Roadmap</span>
                            </div>
                            <i class="fa-solid fa-chevron-right"></i>
                        </a>
                        <a href="iot.html" class="profile-menu-item">
                            <div class="pmi-left">
                                <div class="pmi-icon-box rose"><i class="fa-solid fa-microchip"></i></div>
                                <span>IoT & Hardware Lab</span>
                            </div>
                            <i class="fa-solid fa-chevron-right"></i>
                        </a>
                        <a href="terminal.html" class="profile-menu-item">
                            <div class="pmi-left">
                                <div class="pmi-icon-box emerald"><i class="fa-solid fa-terminal"></i></div>
                                <span>Interactive Terminal</span>
                            </div>
                            <i class="fa-solid fa-chevron-right"></i>
                        </a>
                        <a href="skills.html" class="profile-menu-item">
                            <div class="pmi-left">
                                <div class="pmi-icon-box sky"><i class="fa-solid fa-code"></i></div>
                                <span>Skills & Technologies</span>
                            </div>
                            <i class="fa-solid fa-chevron-right"></i>
                        </a>
                        <a href="contact.html" class="profile-menu-item">
                            <div class="pmi-left">
                                <div class="pmi-icon-box orange"><i class="fa-solid fa-paper-plane"></i></div>
                                <span>Contact & Inquiries</span>
                            </div>
                            <i class="fa-solid fa-chevron-right"></i>
                        </a>
                    </div>

                    <!-- Socials -->
                    <div class="profile-socials-row">
                        <a href="https://github.com/vivek-rahagir07" target="_blank" rel="noopener noreferrer" class="profile-social-link" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
                        <a href="https://linkedin.com/in/vivek-yadav-1142213a0/" target="_blank" rel="noopener noreferrer" class="profile-social-link" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                        <a href="mailto:vivekhr36.2007@gmail.com" class="profile-social-link" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
                        <a href="tel:+919996445592" class="profile-social-link" aria-label="Phone"><i class="fa-solid fa-phone"></i></a>
                    </div>
                </div>
            `;
            document.body.appendChild(profileSheet);

            const likeBtn = document.getElementById('profileLikeBtn');
            if (likeBtn) {
                likeBtn.addEventListener('click', () => {
                    const icon = likeBtn.querySelector('i');
                    if (icon.classList.contains('fa-regular')) {
                        icon.classList.remove('fa-regular');
                        icon.classList.add('fa-solid');
                        icon.style.color = '#e74c3c';
                        likeBtn.innerHTML = '<i class="fa-solid fa-heart" style="color:#e74c3c;font-size:1rem"></i> Liked';
                    } else {
                        likeBtn.innerHTML = '<i class="fa-regular fa-heart" style="font-size:1rem"></i> Like';
                    }
                });
            }
        }

        const currentPath = window.location.pathname.toLowerCase();
        const dockItems = bottomDock.querySelectorAll('.dock-item');
        dockItems.forEach(item => item.classList.remove('active'));

        if (currentPath.includes('projects') || currentPath.includes('project-')) {
            const el = bottomDock.querySelector('[data-tab="projects"]');
            if (el) el.classList.add('active');
        } else if (currentPath.includes('gallery')) {
            const el = bottomDock.querySelector('[data-tab="gallery"]');
            if (el) el.classList.add('active');
        } else if (currentPath.includes('skills')) {
            const el = bottomDock.querySelector('[data-tab="skills"]');
            if (el) el.classList.add('active');
        } else if (currentPath.includes('about') || currentPath.includes('contact') || currentPath.includes('developer-guide') || currentPath.includes('iot')) {
            const el = bottomDock.querySelector('[data-tab="profile"]');
            if (el) el.classList.add('active');
        } else {
            const el = bottomDock.querySelector('[data-tab="home"]');
            if (el) el.classList.add('active');
        }

        function openProfile() {
            if (profileSheet) {
                profileSheet.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeProfile() {
            if (profileSheet) {
                profileSheet.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        const dotsTrigger = document.getElementById('mobile-dots-trigger');
        if (dotsTrigger) {
            dotsTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                openProfile();
            });
        }

        const dockProfileTab = document.getElementById('dock-profile-tab');
        if (dockProfileTab) {
            dockProfileTab.addEventListener('click', (e) => {
                e.preventDefault();
                openProfile();
            });
        }

        const closeBtn = document.getElementById('closeProfileSheet');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closeProfile();
            });
        }

        const sheetCvBtn = document.getElementById('sheet-cv-download');
        if (sheetCvBtn) {
            sheetCvBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const link = document.createElement('a');
                link.href = 'photos/cv.png';
                link.download = 'cv.png';
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }

        let startY = 0;
        const sheetContent = profileSheet ? profileSheet.querySelector('.profile-sheet-content') : null;
        if (sheetContent) {
            sheetContent.addEventListener('touchstart', (e) => {
                if (sheetContent.scrollTop === 0) {
                    startY = e.touches[0].clientY;
                }
            }, { passive: true });

            sheetContent.addEventListener('touchmove', (e) => {
                if (startY > 0 && sheetContent.scrollTop === 0) {
                    const currentY = e.touches[0].clientY;
                    const diffY = currentY - startY;
                    if (diffY > 80) {
                        closeProfile();
                        startY = 0;
                    }
                }
            }, { passive: true });

            sheetContent.addEventListener('touchend', () => {
                startY = 0;
            });
        }

        if (profileSheet) {
            profileSheet.addEventListener('click', (e) => {
                if (e.target === profileSheet) {
                    closeProfile();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && profileSheet && profileSheet.classList.contains('active')) {
                closeProfile();
            }
        });
    }

    initMobileNavigation();
    
    
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
    animatedElements.forEach(el => observer.observe(el));
    
    (function initScratchCard() {
        const canvas = document.getElementById('scratch-canvas');
        const container = document.getElementById('scratch-container');
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d');
    
    
    const overlayImg = new Image();
    overlayImg.src = 'photos/image.png'; 
    
    let isDrawing = false;
    let scratchedPixels = 0;
    let totalPixels = 0;
    let hasInteracted = false;
    
    
    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        
        if (overlayImg.complete) {
            drawOverlay(1.0); 
        }
    }
    
    function drawOverlay(alpha = 1.0) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = alpha;
        
        
        const imgRatio = overlayImg.width / overlayImg.height;
        const canvasRatio = canvas.width / canvas.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (imgRatio > canvasRatio) {
            
            drawHeight = canvas.height;
            drawWidth = overlayImg.width * (canvas.height / overlayImg.height);
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        } else {
            
            drawWidth = canvas.width;
            drawHeight = overlayImg.height * (canvas.width / overlayImg.width);
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        }
        
        ctx.drawImage(overlayImg, offsetX, offsetY, drawWidth, drawHeight);
        ctx.globalAlpha = 1.0; 
    }
    
    
    function healLoop() {
        if (!isDrawing && hasInteracted) {
            
            drawOverlay(0.04);
        }
        requestAnimationFrame(healLoop);
    }
    
    overlayImg.onload = () => {
        resizeCanvas();
        healLoop(); 
    };
    
    window.addEventListener('resize', resizeCanvas);
    
    
    function getPointerPos(e) {
        const rect = canvas.getBoundingClientRect();
        let clientX = e.clientX;
        let clientY = e.clientY;
        
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
    
    function scratch(x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, Math.PI * 2); 
        ctx.fill();
    }
    
    
    const startScratch = (e) => {
        isDrawing = true;
        hasInteracted = true;
        const pos = getPointerPos(e);
        scratch(pos.x, pos.y);
    };
    
    const moveScratch = (e) => {
        if (!isDrawing) return;
        e.preventDefault(); 
        const pos = getPointerPos(e);
        scratch(pos.x, pos.y);
    };
    
    const endScratch = () => {
        isDrawing = false;
    };
    
    canvas.addEventListener('mousedown', startScratch);
    canvas.addEventListener('mousemove', moveScratch);
    canvas.addEventListener('mouseup', endScratch);
    canvas.addEventListener('mouseleave', endScratch);
    
    canvas.addEventListener('touchstart', startScratch, { passive: false });
    canvas.addEventListener('touchmove', moveScratch, { passive: false });
    canvas.addEventListener('touchend', endScratch);
    })();
    
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    
    (function initTypewriter() {
        const typeWriterElement = document.getElementById('typewriter');
        if (!typeWriterElement) return;
    const roles = [
        "Full Stack Developer",
        "AI Developer",
        "UI Designer",
        "Laravel Expert",
        "React Developer"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typeWriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; 
        } else {
            typeWriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1500; 
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; 
        }

        setTimeout(type, typingSpeed);
    }
    
    
    setTimeout(type, 1500);
    })();

    
    (function initParticlesNetwork() {
        const partCanvas = document.getElementById('particles-canvas');
        if (!partCanvas) return;
        const pCtx = partCanvas.getContext('2d');
    let particlesArray = [];
    
    partCanvas.width = window.innerWidth;
    partCanvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        partCanvas.width = window.innerWidth;
        partCanvas.height = window.innerHeight;
        initParticles();
    });
    
    let mouse = { x: null, y: null, radius: 150 };
    
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        draw() {
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            pCtx.fillStyle = this.color;
            pCtx.fill();
        }
        update() {
            if (this.x > partCanvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > partCanvas.height || this.y < 0) this.directionY = -this.directionY;

            
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < partCanvas.width - this.size * 10) this.x += 2;
                if (mouse.x > this.x && this.x > this.size * 10) this.x -= 2;
                if (mouse.y < this.y && this.y < partCanvas.height - this.size * 10) this.y += 2;
                if (mouse.y > this.y && this.y > this.size * 10) this.y -= 2;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (partCanvas.height * partCanvas.width) / 15000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = 'rgba(255, 255, 255, 0.2)';
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        pCtx.clearRect(0, 0, innerWidth, innerHeight);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }

    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < (partCanvas.width/7) * (partCanvas.height/7)) {
                    opacityValue = 1 - (distance / 15000);
                    pCtx.strokeStyle = 'rgba(59, 130, 246, ' + opacityValue * 0.2 + ')';
                    pCtx.lineWidth = 1;
                    pCtx.beginPath();
                    pCtx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    pCtx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    pCtx.stroke();
                }
            }
        }
    }

    initParticles();
    animateParticles();
    })();




const videos = document.querySelectorAll('.horizontal-panel video, .mobile-video-container video, .project-video video');
if (videos.length > 0 && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.play();
            } else {
                entry.target.pause();
            }
        });
    }, { threshold: 0.1 });
    
    videos.forEach(v => {
        v.removeAttribute('autoplay');
        v.pause();
        videoObserver.observe(v);
    });
}


const noise = document.createElement('div');
noise.className = 'noise-overlay';
document.body.appendChild(noise);


if (window.matchMedia("(pointer: fine)").matches) {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const aura = document.createElement('div');
    aura.className = 'cursor-aura';
    document.body.appendChild(dot);
    document.body.appendChild(aura);
    
    window.addEventListener('mousemove', (e) => {
        
        const transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
        dot.style.transform = transform;
        aura.style.transform = transform;
    });
    
    
    const interactives = document.querySelectorAll('a, button, .interactive, input, textarea');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('hover');
            aura.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('hover');
            aura.classList.remove('hover');
        });
    });
}


const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
});


document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
        
        if (link.hostname === window.location.hostname && 
            !link.href.includes('#') && 
            link.target !== '_blank' &&
            document.startViewTransition) {
            
            e.preventDefault();
            const destination = link.href;
            
            document.startViewTransition(() => {
                window.location.href = destination;
            });
        }
    });
});


const currentPath = window.location.pathname.split('/').pop() || 'index.html';
const navigationAnchors = document.querySelectorAll('.nav-links a');
navigationAnchors.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
        link.classList.add('active-nav');
    }
});


const backToTopBtn = document.createElement('button');
backToTopBtn.className = 'back-to-top';
backToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

});



(function initNativeViewTransitions() {
    if (!window.fetch || !window.DOMParser) return;

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || link.hasAttribute('download') || link.target === '_blank') {
            return;
        }

        const targetUrl = new URL(link.href, window.location.href);
        if (targetUrl.origin !== window.location.origin) return;

        if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) {
            if (targetUrl.hash) return;
        }

        e.preventDefault();

        const profileSheet = document.getElementById('profileSheet');
        if (profileSheet && profileSheet.classList.contains('active')) {
            profileSheet.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (navigator.vibrate) {
            navigator.vibrate(8);
        }

        const navigateTo = async (url) => {
            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error('Network error');
                const htmlText = await res.text();
                const parser = new DOMParser();
                const newDoc = parser.parseFromString(htmlText, 'text/html');

                const updateDOM = () => {
                    document.title = newDoc.title;

                    const oldMain = document.getElementById('main-content');
                    const newMain = newDoc.getElementById('main-content');
                    if (oldMain && newMain) {
                        oldMain.innerHTML = newMain.innerHTML;
                    }

                    const currentNavLinks = document.querySelectorAll('.nav-links a');
                    const newPath = new URL(url, window.location.href).pathname.toLowerCase();
                    currentNavLinks.forEach(a => {
                        const hrefVal = (a.getAttribute('href') || '').toLowerCase();
                        if (newPath.endsWith(hrefVal) || (hrefVal === 'index.html' && (newPath.endsWith('/') || newPath.endsWith('index.html')))) {
                            a.classList.add('active');
                        } else {
                            a.classList.remove('active');
                        }
                    });

                    const bottomDock = document.getElementById('mobileBottomDock');
                    if (bottomDock) {
                        const dockItems = bottomDock.querySelectorAll('.dock-item');
                        dockItems.forEach(item => item.classList.remove('active'));

                        if (newPath.includes('projects') || newPath.includes('project-')) {
                            const el = bottomDock.querySelector('[data-tab="projects"]');
                            if (el) el.classList.add('active');
                        } else if (newPath.includes('gallery')) {
                            const el = bottomDock.querySelector('[data-tab="gallery"]');
                            if (el) el.classList.add('active');
                        } else if (newPath.includes('skills')) {
                            const el = bottomDock.querySelector('[data-tab="skills"]');
                            if (el) el.classList.add('active');
                        } else if (newPath.includes('about') || newPath.includes('contact') || newPath.includes('developer-guide') || newPath.includes('iot')) {
                            const el = bottomDock.querySelector('[data-tab="profile"]');
                            if (el) el.classList.add('active');
                        } else {
                            const el = bottomDock.querySelector('[data-tab="home"]');
                            if (el) el.classList.add('active');
                        }
                    }

                    window.history.pushState({}, '', url);
                    window.scrollTo({ top: 0, behavior: 'instant' });

                    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
                    const observerOptions = { threshold: 0.05, rootMargin: '0px 0px -20px 0px' };
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) entry.target.classList.add('visible');
                        });
                    }, observerOptions);
                    animatedElements.forEach(el => observer.observe(el));
                };

                if (document.startViewTransition) {
                    document.startViewTransition(() => {
                        updateDOM();
                    });
                } else {
                    updateDOM();
                }
            } catch (err) {
                window.location.href = url;
            }
        };

        navigateTo(targetUrl.href);
    });

    window.addEventListener('popstate', () => {
        window.location.reload();
    });
})();

