/**
 * ╔══════════════════════════════════════════╗
 * ║   SHATTER & HACK – Easter Egg Engine    ║
 * ║   Type "HACK" anywhere to trigger       ║
 * ╚══════════════════════════════════════════╝
 * 
 * When triggered:
 * 1. A glitch effect shakes the page
 * 2. The UI shatters into glass pieces with physics
 * 3. A fully functional terminal is revealed underneath
 * 4. Press ESC or click "EXIT" to reassemble
 */

(function() {
    'use strict';

    const TRIGGER_WORD = 'HACK';
    let typedBuffer = '';
    let bufferTimeout;
    let isShattered = false;
    let shards = [];
    let shatterCanvas, shatterCtx;
    let terminalOverlay, exitBtn, hackSequenceUI;
    let animationFrame;
    let pageScreenshot = null;
    let staticCanvas, staticCtx;

    // ─── Create DOM Elements ────────────────────────
    function init() {
        // Terminal overlay (loads terminal.html in iframe)
        terminalOverlay = document.createElement('div');
        terminalOverlay.className = 'terminal-overlay';
        terminalOverlay.innerHTML = '<iframe src="terminal.html" title="Hack Terminal"></iframe>';
        document.body.appendChild(terminalOverlay);

        // Exit button
        exitBtn = document.createElement('button');
        exitBtn.className = 'exit-terminal-btn';
        exitBtn.innerHTML = '[ ESC ] EXIT TERMINAL';
        exitBtn.addEventListener('click', reassemble);
        document.body.appendChild(exitBtn);

        // Shatter canvas
        shatterCanvas = document.createElement('canvas');
        shatterCanvas.className = 'shatter-canvas';
        shatterCanvas.width = window.innerWidth;
        shatterCanvas.height = window.innerHeight;
        document.body.appendChild(shatterCanvas);
        shatterCtx = shatterCanvas.getContext('2d');

        // Hack sequence indicator (H-A-C-K boxes)
        hackSequenceUI = document.createElement('div');
        hackSequenceUI.className = 'hack-sequence';
        for (let i = 0; i < TRIGGER_WORD.length; i++) {
            const letter = document.createElement('span');
            letter.className = 'seq-letter';
            letter.textContent = TRIGGER_WORD[i];
            hackSequenceUI.appendChild(letter);
        }
        document.body.appendChild(hackSequenceUI);

        // Hack hint (shows after 60s on page)
        const hackHint = document.createElement('div');
        hackHint.className = 'hack-hint';
        hackHint.innerHTML = 'Try typing <span class="key">H</span><span class="key">A</span><span class="key">C</span><span class="key">K</span>';
        document.body.appendChild(hackHint);

        // Show hint after 60 seconds
        setTimeout(() => {
            hackHint.classList.add('visible');
            setTimeout(() => hackHint.classList.remove('visible'), 5000);
        }, 60000);

        // Listen for keypresses
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('resize', handleResize);
    }

    // ─── Keyboard Handler ───────────────────────────
    function handleKeydown(e) {
        if (isShattered) {
            if (e.key === 'Escape') {
                reassemble();
            }
            return;
        }

        // Ignore if user is typing in an input/textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const key = e.key.toUpperCase();
        
        // Only track letters
        if (key.length !== 1 || !/[A-Z]/.test(key)) return;

        typedBuffer += key;
        clearTimeout(bufferTimeout);
        bufferTimeout = setTimeout(() => {
            typedBuffer = '';
            updateSequenceUI(0);
            hackSequenceUI.classList.remove('visible');
        }, 2000);

        // Update visual sequence indicator
        let matchLen = 0;
        for (let i = 0; i < typedBuffer.length; i++) {
            if (typedBuffer[typedBuffer.length - TRIGGER_WORD.length + i] === TRIGGER_WORD[i]) {
                matchLen = i + 1;
            }
        }

        // Check if the last N chars match the trigger
        const recent = typedBuffer.slice(-TRIGGER_WORD.length);
        let consecutiveMatch = 0;
        for (let i = 0; i < recent.length; i++) {
            if (recent[i] === TRIGGER_WORD[i]) {
                consecutiveMatch = i + 1;
            } else {
                consecutiveMatch = 0;
            }
        }

        if (consecutiveMatch > 0) {
            hackSequenceUI.classList.add('visible');
            updateSequenceUI(consecutiveMatch);
        }

        if (recent === TRIGGER_WORD) {
            typedBuffer = '';
            // Only start animation after complete sequence
            drawGlitchLines(1000); // Glitch for 1 second
            setTimeout(() => {
                triggerShatter();
            }, 1000);
        }
    }

    function updateSequenceUI(count) {
        const letters = hackSequenceUI.querySelectorAll('.seq-letter');
        letters.forEach((el, i) => {
            if (i < count) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }

    let glitchAnimFrame = null;
    let glitchEndTime = 0;
    let lastGlitchDraw = 0;

    function drawGlitchLines(duration) {
        glitchEndTime = performance.now() + duration;
        
        if (!glitchAnimFrame) {
            const flicker = (time) => {
                if (isShattered) {
                    glitchAnimFrame = null;
                    return;
                }
                
                if (time > glitchEndTime) {
                    shatterCtx.clearRect(0, 0, shatterCanvas.width, shatterCanvas.height);
                    glitchAnimFrame = null;
                    return;
                }

                if (time - lastGlitchDraw > 40) { // ~25fps flicker rate
                    lastGlitchDraw = time;
                    
                    shatterCtx.clearRect(0, 0, shatterCanvas.width, shatterCanvas.height);
                    const w = shatterCanvas.width;
                    const h = shatterCanvas.height;
                    
                    // Very thin vertical lines from top to bottom
                    const numVLines = 200 + Math.random() * 200;
                    const colors = [
                        'rgba(0, 255, 255, 0.9)', // Cyan
                        'rgba(255, 255, 255, 0.9)', // White
                        'rgba(0, 0, 0, 0.9)', // Black
                        'rgba(17, 17, 17, 0.9)', // Dark grey
                        'rgba(0, 136, 255, 0.8)', // Blue
                        'rgba(255, 0, 51, 0.6)' // Red
                    ];
                    
                    for (let i = 0; i < numVLines; i++) {
                        shatterCtx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                        // Make them very very thin
                        const lineWidth = Math.random() * 0.8 + 0.1;
                        const x = Math.random() * w;
                        // Complete line up to down
                        shatterCtx.fillRect(x, 0, lineWidth, h);
                    }
                    
                    // Very thin horizontal lines from left to right
                    const numHLines = 50 + Math.random() * 50;
                    for (let i = 0; i < numHLines; i++) {
                        shatterCtx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)';
                        const barHeight = Math.random() * 0.8 + 0.1;
                        const y = Math.random() * h;
                        // Complete line left to right
                        shatterCtx.fillRect(0, y, w, barHeight);
                    }
                }

                glitchAnimFrame = requestAnimationFrame(flicker);
            };
            
            glitchAnimFrame = requestAnimationFrame(flicker);
        }
    }

    // ─── Capture Screen ─────────────────────────────
    function captureScreen() {
        return new Promise((resolve) => {
            const executeCapture = () => {
                html2canvas(document.body, {
                    backgroundColor: '#000000',
                    scale: window.devicePixelRatio || 1,
                    ignoreElements: (el) => 
                        el.classList.contains('shatter-canvas') || 
                        el.classList.contains('hack-sequence') || 
                        el.classList.contains('hack-hint') ||
                        el.classList.contains('terminal-overlay') ||
                        el.classList.contains('exit-terminal-btn')
                }).then(canvas => resolve(canvas));
            };

            if (window.html2canvas) {
                executeCapture();
            } else {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                script.onload = executeCapture;
                document.head.appendChild(script);
            }
        });
    }

    // ─── Glass Shard Class ──────────────────────────
    class Shard {
        constructor(points, center, imageData) {
            this.points = points; // Array of {x, y}
            this.imageData = imageData;
            
            // Calculate bounding box and centroid
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            let sumX = 0, sumY = 0;
            this.points.forEach(p => {
                minX = Math.min(minX, p.x);
                maxX = Math.max(maxX, p.x);
                minY = Math.min(minY, p.y);
                maxY = Math.max(maxY, p.y);
                sumX += p.x;
                sumY += p.y;
            });
            
            this.cx = sumX / this.points.length;
            this.cy = sumY / this.points.length;
            this.w = maxX - minX;
            this.h = maxY - minY;
            this.minX = minX;
            this.minY = minY;
            
            this.x = 0;
            this.y = 0;
            
            // Physics
            const dx = this.cx - center.x;
            const dy = this.cy - center.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const angle = Math.atan2(dy, dx);
            
            const force = Math.max(2, 20 - dist / 50); 
            this.vx = Math.cos(angle) * force + (Math.random() - 0.5) * 4;
            this.vy = Math.sin(angle) * force + (Math.random() - 0.5) * 4 - 2;
            
            this.gravity = 0.4 + Math.random() * 0.2;
            this.rotation = 0;
            this.rotationSpeed = (Math.random() - 0.5) * (0.05 + 10/dist);
            this.opacity = 1;
            this.fadeSpeed = 0.003 + Math.random() * 0.005;
            
            this.delay = dist * 0.001;
            this.started = false;
        }

        update() {
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;
            this.opacity -= this.fadeSpeed;
            
            this.vx *= 0.99;
            this.vy *= 0.99;
        }

        draw(ctx, drawStatic = false) {
            if (this.opacity <= 0) return;

            ctx.save();
            
            if (!drawStatic) {
                ctx.translate(this.cx + this.x, this.cy + this.y);
                ctx.rotate(this.rotation);
                ctx.translate(-this.cx, -this.cy);
                ctx.globalAlpha = this.opacity;
            }
            
            ctx.beginPath();
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for (let i = 1; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
            ctx.closePath();
            
            ctx.save();
            ctx.clip();
            try {
                ctx.drawImage(this.imageData, 0, 0);
            } catch(e) {
                ctx.fillStyle = 'rgba(20, 20, 30, 0.8)';
                ctx.fill();
            }
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 * this.opacity})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();

            ctx.beginPath();
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for (let i = 1; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
            ctx.closePath();
            
            const reflGrad = ctx.createLinearGradient(this.minX, this.minY, this.minX + this.w, this.minY + this.h);
            reflGrad.addColorStop(0, `rgba(255, 255, 255, ${0.15 * this.opacity})`);
            reflGrad.addColorStop(0.5, 'transparent');
            reflGrad.addColorStop(1, `rgba(255, 255, 255, ${0.05 * this.opacity})`);
            ctx.fillStyle = reflGrad;
            ctx.fill();

            ctx.restore();
        }

        isDead() {
            return this.opacity <= 0 || (this.cy + this.y - this.h) > window.innerHeight + 200;
        }
    }

    // ─── Trigger the Shatter ────────────────────────
    async function triggerShatter() {
        if (isShattered) return;
        isShattered = true;

        // Hide the sequence UI
        hackSequenceUI.classList.remove('visible');
        updateSequenceUI(0);

        // 1. Glitch the page
        document.body.classList.add('glitching');

        // Play a subtle "crack" sound effect (generated programmatically)
        playCrackSound();

        // 2. Capture the screen
        pageScreenshot = await captureScreen();

        // 3. Wait for glitch to finish
        await sleep(900);
        document.body.classList.remove('glitching');

        // 4. Resize shatter canvas
        shatterCanvas.width = window.innerWidth;
        shatterCanvas.height = window.innerHeight;

        staticCanvas = document.createElement('canvas');
        staticCanvas.width = shatterCanvas.width;
        staticCanvas.height = shatterCanvas.height;
        staticCtx = staticCanvas.getContext('2d', { willReadFrequently: true });
        staticCtx.drawImage(pageScreenshot, 0, 0);

        // 5. Create shards
        createShards();
        
        staticCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        staticCtx.lineWidth = 1.5;
        shards.forEach(shard => {
            staticCtx.beginPath();
            staticCtx.moveTo(shard.points[0].x, shard.points[0].y);
            for(let i = 1; i < shard.points.length; i++) {
                staticCtx.lineTo(shard.points[i].x, shard.points[i].y);
            }
            staticCtx.closePath();
            staticCtx.stroke();
        });

        // 6. Hide the actual page content
        const mainContent = document.getElementById('main-content') || document.querySelector('main');
        if (mainContent) {
            mainContent.style.visibility = 'hidden';
        }

        // 7. Show terminal behind
        setTimeout(() => {
            terminalOverlay.classList.add('active');
            exitBtn.classList.add('active');
            
            // Focus the terminal input after it loads
            setTimeout(() => {
                const iframe = terminalOverlay.querySelector('iframe');
                if (iframe && iframe.contentDocument) {
                    const input = iframe.contentDocument.getElementById('terminal-input');
                    if (input) input.focus();
                }
            }, 500);
        }, 300);

        // 8. Animate shards
        animateShatter();
    }

    function createShards() {
        shards = [];
        const w = window.innerWidth;
        const h = window.innerHeight;
        
        // Off-center impact
        const cx = Math.random() > 0.5 ? w * (0.8 + Math.random() * 0.1) : w * (0.1 + Math.random() * 0.1);
        const cy = Math.random() > 0.5 ? h * (0.8 + Math.random() * 0.1) : h * (0.1 + Math.random() * 0.1);
        const center = {x: cx, y: cy};
        
        // Blocky large chunks
        const numRays = 20 + Math.floor(Math.random() * 10);
        let angles = [];
        for (let i = 0; i < numRays; i++) {
            angles.push((Math.PI * 2 * i) / numRays + (Math.random() - 0.5) * 0.2);
        }
        angles.sort((a, b) => a - b);
        
        const numRings = 10 + Math.floor(Math.random() * 5);
        let rings = [0]; 
        const maxRadius = Math.sqrt(w*w + h*h); 
        let currentRadius = 0;
        
        for (let i = 1; i <= numRings; i++) {
            const step = (maxRadius / numRings); 
            currentRadius += step + (Math.random() - 0.5) * 40;
            if (currentRadius < 0) currentRadius = 10;
            rings.push(currentRadius);
        }
        rings.push(maxRadius * 1.5);  
        
        const getPoint = (aIdx, rIdx) => {
            if (rIdx === 0) return {x: cx, y: cy};
            
            const r = rings[rIdx];
            let a = angles[aIdx % numRays];
            
            const jitterR = r * (0.8 + Math.random() * 0.4);
            const jitterA = a + (Math.random() - 0.5) * 0.1;
            
            return {
                x: cx + Math.cos(jitterA) * jitterR,
                y: cy + Math.sin(jitterA) * jitterR
            };
        };
        
        const points = [];
        for (let r = 0; r < rings.length; r++) {
            points[r] = [];
            for (let a = 0; a < numRays; a++) {
                points[r][a] = getPoint(a, r);
            }
        }
        
        for (let r = 0; r < rings.length - 1; r++) {
            for (let a = 0; a < numRays; a++) {
                const p1 = points[r][a];
                const p2 = points[r][(a + 1) % numRays];
                const p3 = points[r + 1][(a + 1) % numRays];
                const p4 = points[r + 1][a];
                
                const shardPoints = (r === 0) ? [p1, p3, p4] : [p1, p2, p3, p4];
                
                let isOutside = true;
                shardPoints.forEach(p => {
                    if (p.x > -100 && p.x < w + 100 && p.y > -100 && p.y < h + 100) {
                        isOutside = false;
                    }
                });
                
                if (!isOutside) {
                    shards.push(new Shard(shardPoints, center, pageScreenshot));
                }
            }
        }
    }

    function animateShatter() {
        const startTime = performance.now();
        
        function frame() {
            const elapsed = (performance.now() - startTime) / 1000;
            
            shatterCtx.clearRect(0, 0, shatterCanvas.width, shatterCanvas.height);
            
            if (staticCanvas) {
                shatterCtx.drawImage(staticCanvas, 0, 0);
            }

            let aliveCount = 0;
            shards.forEach(shard => {
                if (elapsed < shard.delay) {
                    aliveCount++;
                    return;
                }
                
                if (!shard.started) {
                    shard.started = true;
                    if (staticCtx) {
                        staticCtx.save();
                        staticCtx.globalCompositeOperation = 'destination-out';
                        staticCtx.beginPath();
                        staticCtx.moveTo(shard.points[0].x, shard.points[0].y);
                        for (let i = 1; i < shard.points.length; i++) {
                            staticCtx.lineTo(shard.points[i].x, shard.points[i].y);
                        }
                        staticCtx.closePath();
                        staticCtx.fill();
                        staticCtx.restore();
                    }
                }

                shard.update();
                shard.draw(shatterCtx, false); 
                
                if (!shard.isDead()) {
                    aliveCount++;
                }
            });

            if (aliveCount > 0) {
                animationFrame = requestAnimationFrame(frame);
            } else {
                shatterCtx.clearRect(0, 0, shatterCanvas.width, shatterCanvas.height);
                staticCanvas = null;
                staticCtx = null;
            }
        }

        animationFrame = requestAnimationFrame(frame);
    }

    // ─── Reassemble (Exit Terminal) ─────────────────
    function reassemble() {
        if (!isShattered) return;
        
        // Cancel any ongoing animation
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }

        // Clear shatter canvas
        shatterCtx.clearRect(0, 0, shatterCanvas.width, shatterCanvas.height);
        shards = [];

        // Hide terminal
        terminalOverlay.classList.remove('active');
        exitBtn.classList.remove('active');

        // Show main content again
        const mainContent = document.getElementById('main-content') || document.querySelector('main');
        if (mainContent) {
            mainContent.style.visibility = 'visible';
            mainContent.style.animation = 'none';
            // Trigger reflow
            void mainContent.offsetWidth;
            mainContent.style.animation = 'reassemble 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }

        isShattered = false;
    }

    // ─── Sound Effect (Web Audio API) ───────────────
    function playCrackSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create a "crack/shatter" noise burst
            const duration = 0.4;
            const sampleRate = audioCtx.sampleRate;
            const buffer = audioCtx.createBuffer(1, sampleRate * duration, sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < data.length; i++) {
                const t = i / sampleRate;
                // Sharp attack, fast decay noise
                const envelope = Math.exp(-t * 15) * (1 - t / duration);
                data[i] = (Math.random() * 2 - 1) * envelope * 0.3;
                
                // Add some "cracking" transients
                if (Math.random() < 0.001) {
                    data[i] += (Math.random() - 0.5) * envelope * 0.8;
                }
            }

            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            
            // Add a lowpass filter for a more "glass" sound
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 2000;
            
            source.connect(filter);
            filter.connect(audioCtx.destination);
            source.start();
            
            // Cleanup
            source.onended = () => audioCtx.close();
        } catch(e) {
            // Audio not supported, silently continue
        }
    }

    // ─── Utilities ──────────────────────────────────
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function handleResize() {
        if (shatterCanvas) {
            shatterCanvas.width = window.innerWidth;
            shatterCanvas.height = window.innerHeight;
        }
    }

    // ─── Add reassemble keyframe to page ────────────
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes reassemble {
            0% { 
                opacity: 0; 
                transform: scale(0.95); 
                filter: blur(10px) brightness(2); 
            }
            50% { 
                filter: blur(2px) brightness(1.2); 
            }
            100% { 
                opacity: 1; 
                transform: scale(1); 
                filter: blur(0) brightness(1); 
            }
        }
    `;
    document.head.appendChild(styleSheet);

    // ─── Initialize on DOM ready ────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
