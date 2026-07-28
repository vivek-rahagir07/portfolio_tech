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
    
    
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
    
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
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


(function initMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-rain';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-2';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.15'; 
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    const fontSize = 16;
    let columns = width / fontSize;
    const drops = [];
    
    for (let x = 0; x < columns; x++) {
        drops[x] = Math.random() * -100; 
    }
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = width / fontSize;
        for (let x = 0; x < columns; x++) {
            if (drops[x] === undefined) drops[x] = Math.random() * -100;
        }
    });

    function draw() {
        
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            
            
            ctx.fillStyle = '#00FF41';
            
            
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            
            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            
            drops[i]++;
        }
    }
    
    setInterval(draw, 50); 
})();
