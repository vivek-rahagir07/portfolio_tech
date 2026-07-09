/**
 * ╔══════════════════════════════════════════╗
 * ║   HACK – Easter Egg Engine              ║
 * ║   Type "HACK" anywhere to trigger       ║
 * ╚══════════════════════════════════════════╝
 * 
 * When triggered:
 * 1. Matrix digital rain fills the screen
 * 2. A realistic ransomware warning appears
 * 3. Click dismiss to restore the page
 */

(function() {
    'use strict';

    const TRIGGER_WORD = 'HACK';
    let typedBuffer = '';
    let bufferTimeout;
    let isHacked = false;
    let glitchCanvas, glitchCtx;
    let hackSequenceUI, ransomwareModal;

    // ─── Create DOM Elements ────────────────────────
    function init() {
        // Glitch canvas
        glitchCanvas = document.createElement('canvas');
        glitchCanvas.className = 'shatter-canvas';
        glitchCanvas.width = window.innerWidth;
        glitchCanvas.height = window.innerHeight;
        document.body.appendChild(glitchCanvas);
        glitchCtx = glitchCanvas.getContext('2d');

        // Ransomware Modal — realistic, dark, subtle
        ransomwareModal = document.createElement('div');
        ransomwareModal.id = 'ransomware-overlay';
        ransomwareModal.innerHTML = `
            <div id="ransomware-box">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
                    <span style="font-size:2rem;">⚠</span>
                    <h2 style="margin:0;font-size:1.1rem;font-weight:600;color:#e8e8e8;letter-spacing:0.5px;">YOUR FILES HAVE BEEN ENCRYPTED</h2>
                </div>
                <p style="color:#aaa;font-size:0.85rem;line-height:1.6;margin:0 0 18px 0;">
                    All your documents, photos, databases and other important files have been encrypted with strongest encryption and unique key. The only method of recovering files is to purchase decrypt tool and unique key for you.
                </p>
                <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:14px 18px;margin-bottom:20px;">
                    <p style="color:#888;font-size:0.75rem;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:1px;">Payment required</p>
                    <p style="color:#e74c3c;font-size:1.8rem;font-weight:700;margin:0;font-family:'JetBrains Mono',monospace;">$500.00 <span style="color:#555;font-size:0.8rem;font-weight:400;">in Bitcoin</span></p>
                </div>
                <p style="color:#555;font-size:0.7rem;margin:0 0 20px 0;font-style:italic;">(This is just an easter egg. Your files are safe 😄)</p>
                <button id="ransomware-unlock">Dismiss</button>
            </div>
        `;
        Object.assign(ransomwareModal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            zIndex: '100020',
            background: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'none'
        });
        document.body.appendChild(ransomwareModal);

        // Style the inner box
        const boxStyle = `
            #ransomware-overlay { display: none !important; }
            #ransomware-overlay.active { display: flex !important; }
            #ransomware-box {
                background: rgba(18, 18, 22, 0.97);
                border: 1px solid rgba(255, 255, 255, 0.06);
                border-radius: 12px;
                padding: 32px 36px;
                max-width: 460px;
                width: 90%;
                font-family: 'Inter', -apple-system, sans-serif;
                box-shadow: 0 25px 80px rgba(0,0,0,0.7), 0 0 1px rgba(255,255,255,0.1);
                animation: modalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            #ransomware-unlock {
                background: transparent;
                color: #888;
                border: 1px solid rgba(255,255,255,0.1);
                padding: 10px 24px;
                font-size: 0.8rem;
                font-family: 'Inter', -apple-system, sans-serif;
                cursor: pointer;
                border-radius: 6px;
                transition: all 0.2s;
                letter-spacing: 0.5px;
            }
            #ransomware-unlock:hover {
                background: rgba(255,255,255,0.05);
                color: #ccc;
                border-color: rgba(255,255,255,0.2);
            }
            @keyframes modalSlideIn {
                from { opacity: 0; transform: translateY(20px) scale(0.97); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
        `;
        const modalStyle = document.createElement('style');
        modalStyle.textContent = boxStyle;
        document.head.appendChild(modalStyle);

        // Ransomware unlock button
        document.getElementById('ransomware-unlock').addEventListener('click', () => {
            reassemble();
        });

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
        if (isHacked) {
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
            triggerHack();
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

    // ─── Matrix Rain ─────────────────────────────
    let matrixAnimFrame = null;
    let matrixDrops = [];
    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ';
    
    function startMatrixRain() {
        const fontSize = 14;
        const columns = Math.ceil(glitchCanvas.width / fontSize);
        matrixDrops = [];
        for (let x = 0; x < columns; x++) {
            matrixDrops[x] = Math.random() * -80;
        }
        
        let lastMatrixDraw = performance.now();
        
        const drawMatrix = (time) => {
            if (!isHacked) {
                matrixAnimFrame = null;
                return;
            }
            
            if (time - lastMatrixDraw > 45) { // ~22fps
                lastMatrixDraw = time;
                
                // Slow fade trail
                glitchCtx.fillStyle = 'rgba(0, 0, 0, 0.06)';
                glitchCtx.fillRect(0, 0, glitchCanvas.width, glitchCanvas.height);
                
                for (let i = 0; i < matrixDrops.length; i++) {
                    if (matrixDrops[i] >= 0) {
                        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
                        const yPos = matrixDrops[i] * fontSize;
                        
                        // Lead character: bright white-green
                        glitchCtx.fillStyle = 'rgba(180, 255, 180, 0.95)';
                        glitchCtx.font = `${fontSize}px monospace`;
                        glitchCtx.fillText(text, i * fontSize, yPos);
                        
                        // Trailing char behind: dimmer green
                        if (matrixDrops[i] > 1) {
                            const trailText = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
                            glitchCtx.fillStyle = `rgba(0, ${150 + Math.random() * 105}, 0, 0.7)`;
                            glitchCtx.fillText(trailText, i * fontSize, yPos - fontSize);
                        }
                    }
                    
                    if (matrixDrops[i] * fontSize > glitchCanvas.height && Math.random() > 0.975) {
                        matrixDrops[i] = 0;
                    }
                    matrixDrops[i]++;
                }
            }
            
            matrixAnimFrame = requestAnimationFrame(drawMatrix);
        };
        
        matrixAnimFrame = requestAnimationFrame(drawMatrix);
    }

    // ─── Trigger the Hack ────────────────────────
    async function triggerHack() {
        if (isHacked) return;
        isHacked = true;

        // Hide the sequence UI
        hackSequenceUI.classList.remove('visible');
        updateSequenceUI(0);

        // Brief body glitch
        document.body.classList.add('glitching');

        // Play glitch sound
        playGlitchSound();

        await sleep(300);
        document.body.classList.remove('glitching');

        // Bring custom cursor on top of the hack overlay
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorRing = document.querySelector('.cursor-ring');
        if (cursorDot) cursorDot.style.zIndex = '100030';
        if (cursorRing) cursorRing.style.zIndex = '100029';

        // Hide the actual page content
        const mainContent = document.getElementById('main-content') || document.querySelector('main');
        if (mainContent) {
            mainContent.style.visibility = 'hidden';
        }
        
        // Start Matrix Rain & Show Ransomware
        startMatrixRain();
        setTimeout(() => {
            if (isHacked) {
                ransomwareModal.classList.add('active');
            }
        }, 2000);
    }

    // ─── Reassemble (Exit Hack) ─────────────────
    function reassemble() {
        if (!isHacked) return;
        
        // Clear glitch canvas and hide modal
        glitchCtx.clearRect(0, 0, glitchCanvas.width, glitchCanvas.height);
        ransomwareModal.classList.remove('active');
        
        if (matrixAnimFrame) {
            cancelAnimationFrame(matrixAnimFrame);
            matrixAnimFrame = null;
        }

        // Restore cursor z-index
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorRing = document.querySelector('.cursor-ring');
        if (cursorDot) cursorDot.style.zIndex = '100000';
        if (cursorRing) cursorRing.style.zIndex = '99999';

        // Show main content again
        const mainContent = document.getElementById('main-content') || document.querySelector('main');
        if (mainContent) {
            mainContent.style.visibility = 'visible';
            mainContent.style.animation = 'none';
            void mainContent.offsetWidth;
            mainContent.style.animation = 'reassemble 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }

        isHacked = false;
    }

    // ─── Sound Effect (Web Audio API) ───────────────
    function playGlitchSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            
            const duration = 0.8;
            const sampleRate = audioCtx.sampleRate;
            const buffer = audioCtx.createBuffer(1, sampleRate * duration, sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < data.length; i++) {
                const t = i / sampleRate;
                let envelope = Math.exp(-t * 10);
                if (t < 0.1) envelope += (0.1 - t) * 10;
                data[i] = (Math.random() * 2 - 1) * envelope * 0.5;
                if (Math.random() < 0.005 && t < 0.8) {
                    data[i] += (Math.random() * 2 - 1) * Math.exp(-t * 3);
                }
            }

            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 4500;
            filter.Q.value = 0.5;
            
            const boomFilter = audioCtx.createBiquadFilter();
            boomFilter.type = 'lowpass';
            boomFilter.frequency.value = 150;
            
            const boomSource = audioCtx.createBufferSource();
            boomSource.buffer = buffer;
            
            source.connect(filter);
            filter.connect(audioCtx.destination);
            
            boomSource.connect(boomFilter);
            boomFilter.connect(audioCtx.destination);
            
            source.start();
            boomSource.start();
            
            source.onended = () => audioCtx.close();
        } catch(e) {}
    }

    // ─── Utilities ──────────────────────────────────
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function handleResize() {
        if (glitchCanvas) {
            glitchCanvas.width = window.innerWidth;
            glitchCanvas.height = window.innerHeight;
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

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
