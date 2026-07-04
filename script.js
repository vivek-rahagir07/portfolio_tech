document.addEventListener('DOMContentLoaded', () => {
    // Mobile Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
    // Scratch Card Logic
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('scratch-container');
    
    // Load overlay image
    const overlayImg = new Image();
    overlayImg.src = 'photos/image.png'; // Make sure this image exists in the same directory
    
    let isDrawing = false;
    let scratchedPixels = 0;
    let totalPixels = 0;
    let hasInteracted = false;
    
    // Setup canvas size
    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Redraw overlay
        if (overlayImg.complete) {
            drawOverlay(1.0); // Draw fully opaque
        }
    }
    
    function drawOverlay(alpha = 1.0) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = alpha;
        
        // Mimic object-fit: cover to perfectly align with the CSS of the under-image
        const imgRatio = overlayImg.width / overlayImg.height;
        const canvasRatio = canvas.width / canvas.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (imgRatio > canvasRatio) {
            // Image is wider than canvas
            drawHeight = canvas.height;
            drawWidth = overlayImg.width * (canvas.height / overlayImg.height);
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        } else {
            // Image is taller than canvas
            drawWidth = canvas.width;
            drawHeight = overlayImg.height * (canvas.width / overlayImg.width);
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        }
        
        ctx.drawImage(overlayImg, offsetX, offsetY, drawWidth, drawHeight);
        ctx.globalAlpha = 1.0; // reset
    }
    
    // Magnetic Healing Effect
    function healLoop() {
        if (!isDrawing && hasInteracted) {
            // Gradually draw the overlay back on with low opacity
            drawOverlay(0.04);
        }
        requestAnimationFrame(healLoop);
    }
    
    overlayImg.onload = () => {
        resizeCanvas();
        healLoop(); // Start the healing loop
    };
    
    window.addEventListener('resize', resizeCanvas);
    
    // Get cursor position relative to canvas
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
        ctx.arc(x, y, 50, 0, Math.PI * 2); // 50px radius brush
        ctx.fill();
    }
    
    // Event Listeners for drawing
    const startScratch = (e) => {
        isDrawing = true;
        hasInteracted = true;
        const pos = getPointerPos(e);
        scratch(pos.x, pos.y);
    };
    
    const moveScratch = (e) => {
        if (!isDrawing) return;
        e.preventDefault(); // Prevent scrolling on touch
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
    
    // Smooth scrolling for navigation links
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

    // 1. Typewriter Effect
    const typeWriterElement = document.getElementById('typewriter');
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
            typingSpeed = 50; // faster when deleting
        } else {
            typeWriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1500; // pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // pause before typing new word
        }

        setTimeout(type, typingSpeed);
    }
    
    // Start typing after a short delay to match entry animations
    setTimeout(type, 1500);

    // 3. Background Particles Network
    const partCanvas = document.getElementById('particles-canvas');
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

            // Collision detection - mouse position / particle position
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
});
