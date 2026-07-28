document.addEventListener('DOMContentLoaded', () => {
    function setupParticleReveal(canvasId) {
        if (window.skipPreloader) return;
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        let particlesArray = [];
        let animationFrameId;
        let revealY = 0;
        let fillStarted = false;
        let fillRevealY = 0;
        
        
        const mouse = {
            x: null,
            y: null,
            radius: 70
        };
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        
        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
        
        function resizeCanvas() {
            const parent = canvas.parentElement;
            let cssWidth, cssHeight;
            if (parent.clientWidth > 0 && parent.clientHeight > 0) {
                cssWidth = parent.clientWidth;
                cssHeight = parent.clientHeight;
            } else {
                
                cssWidth = window.innerWidth;
                cssHeight = window.innerHeight;
            }
            
            const dpr = window.devicePixelRatio || 1;
            canvas.style.width = cssWidth + 'px';
            canvas.style.height = cssHeight + 'px';
            canvas.width = Math.floor(cssWidth * dpr);
            canvas.height = Math.floor(cssHeight * dpr);
            
            canvas.logicalWidth = cssWidth;
            canvas.logicalHeight = cssHeight;
            canvas.dpr = dpr;
        }
        
        window.addEventListener('resize', () => {
            if (particlesArray.length === 0) {
                resizeCanvas();
            }
        });
        resizeCanvas();
        
        function initAnimation(imageSource) {
            const image = new Image();
            image.src = imageSource;
            
            image.addEventListener('load', () => {
                const logicalWidth = canvas.logicalWidth || canvas.width;
                const logicalHeight = canvas.logicalHeight || canvas.height;
                if (logicalWidth === 0 || logicalHeight === 0) return;
                
                
                let targetWidth = Math.min(logicalWidth * 0.9, 1000);
                let scale = targetWidth / image.width;
                let targetHeight = image.height * scale;
                
                
                const maxAllowedHeight = logicalHeight * 0.75;
                if (targetHeight > maxAllowedHeight) {
                    targetHeight = maxAllowedHeight;
                    scale = targetHeight / image.height;
                    targetWidth = image.width * scale;
                }
                
                const offsetX = (logicalWidth - targetWidth) / 2;
                const offsetY = (logicalHeight - targetHeight) / 2;
                
                const offscreen = document.createElement('canvas');
                offscreen.width = targetWidth;
                offscreen.height = targetHeight;
                const offCtx = offscreen.getContext('2d');
                
                offCtx.drawImage(image, 0, 0, targetWidth, targetHeight);
                
                const pixels = offCtx.getImageData(0, 0, targetWidth, targetHeight);
                createParticles(pixels, targetWidth, targetHeight, offsetX, offsetY);
            });
        }
        
        function createParticles(pixels, width, height, offsetX, offsetY) {
            particlesArray = [];
            revealY = offsetY - 50; 
            fillStarted = false;
            fillRevealY = offsetY - 50;
            
            const gap = 2; 
            width = Math.floor(width);
            height = Math.floor(height);
            
            const bgMap = new Uint8Array(width * height);
            const getIndex = (x, y) => (y * width + x);
            const getPixel = (idx) => {
                const i = idx * 4;
                return {r: pixels.data[i], g: pixels.data[i+1], b: pixels.data[i+2], a: pixels.data[i+3]};
            };
            
            let validCorners = 0;
            let sumR = 0, sumG = 0, sumB = 0;
            const corners = [
                getPixel(getIndex(0, 0)), getPixel(getIndex(width - 1, 0)),
                getPixel(getIndex(0, height - 1)), getPixel(getIndex(width - 1, height - 1))
            ];
            for (let c of corners) {
                if (c.a > 10) { 
                    sumR += c.r; sumG += c.g; sumB += c.b;
                    validCorners++;
                }
            }
            const bgR = validCorners > 0 ? sumR / validCorners : 0;
            const bgG = validCorners > 0 ? sumG / validCorners : 0;
            const bgB = validCorners > 0 ? sumB / validCorners : 0;
            
            const stackX = new Int32Array(width * height);
            const stackY = new Int32Array(width * height);
            let stackLen = 0;
            let head = 0;
            
            const push = (x, y) => {
                stackX[stackLen] = x;
                stackY[stackLen] = y;
                stackLen++;
            };
            
            push(0, 0); push(width - 1, 0); push(0, height - 1); push(width - 1, height - 1);
            bgMap[getIndex(0, 0)] = 1;
            bgMap[getIndex(width - 1, 0)] = 1;
            bgMap[getIndex(0, height - 1)] = 1;
            bgMap[getIndex(width - 1, height - 1)] = 1;
            
            while (head < stackLen) {
                const cx = stackX[head];
                const cy = stackY[head];
                head++;
                
                const neighbors = [ [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1] ];
                
                for (let i = 0; i < 4; i++) {
                    const nx = neighbors[i][0];
                    const ny = neighbors[i][1];
                    
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const nIdx = getIndex(nx, ny);
                        if (bgMap[nIdx] === 0) {
                            const p = getPixel(nIdx);
                            
                            let isBg = false;
                            if (p.a < 10) {
                                isBg = true;
                            } else if (validCorners > 0) {
                                const diff = Math.abs(p.r - bgR) + Math.abs(p.g - bgG) + Math.abs(p.b - bgB);
                                if (diff < 150) isBg = true;
                            }
                            
                            if (isBg) {
                                bgMap[nIdx] = 1; 
                                push(nx, ny);
                            } else {
                                bgMap[nIdx] = 2; 
                            }
                        }
                    }
                }
            }
            
            for (let y = 0; y < height; y += gap) {
                for (let x = 0; x < width; x += gap) {
                    const index = getIndex(x, y);
                    const isPerson = bgMap[index] !== 1;
                    
                    if (isPerson) {
                        let isEdge = false;
                        if (x > gap && x < width - gap && y > gap && y < height - gap) {
                            const rightBg = bgMap[getIndex(x + gap, y)] === 1;
                            const bottomBg = bgMap[getIndex(x, y + gap)] === 1;
                            const leftBg = bgMap[getIndex(x - gap, y)] === 1;
                            const topBg = bgMap[getIndex(x, y - gap)] === 1;
                            
                            if (rightBg || bottomBg || leftBg || topBg) {
                                isEdge = true;
                            }
                        } else {
                            isEdge = true; 
                        }
                        
                        const p = getPixel(index);
                        const size = gap * 0.5; 
                        const color = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.a / 255})`; 
                        particlesArray.push(new Particle(x + offsetX, y + offsetY, size, color, isEdge));
                    }
                }
            }
            
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animate();
        }
        
        class Particle {
            constructor(x, y, size, color, isEdge) {
                this.originX = x;
                this.originY = y;
                this.size = size;
                this.color = color;
                this.isEdge = isEdge;
                
                this.revealed = false;
                this.opacity = 0;
                
                if (this.isEdge) {
                    this.x = x;
                    this.y = y;
                } else {
                    this.x = x + (Math.random() - 0.5) * 400;
                    this.y = y - Math.random() * 200 - 100;
                    this.vx = 0;
                    this.vy = 0;
                }
            }
            
            updateEdge(currentRevealY) {
                if (this.isEdge) {
                    if (!this.revealed && this.originY < currentRevealY) {
                        this.revealed = true;
                    }
                    if (this.revealed) {
                        this.opacity = 1;
                    }
                }
            }
        
            updateFill(currentRevealY) {
                if (!this.isEdge) {
                    if (!this.revealed && this.originY < currentRevealY) {
                        this.revealed = true;
                    }
                    if (this.revealed) {
                        this.opacity = Math.min(1, this.opacity + 0.02);
                        
                        const dx = this.originX - this.x;
                        const dy = this.originY - this.y;
                        
                        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
                            this.x = this.originX;
                            this.y = this.originY;
                        } else {
                            this.x += dx * 0.08;
                            this.y += dy * 0.08;
                        }
                    }
                }
            }
            
            draw() {
                if (this.opacity > 0) {
                    ctx.save();
                    ctx.globalAlpha = this.opacity;
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }
        }
        
        function animate() {
            
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            
            const dpr = canvas.dpr || 1;
            ctx.scale(dpr, dpr);
            
            
            if (!canvas.signatureStarted) {
                canvas.signatureStarted = true;
                const parent = canvas.parentElement;
                if (parent) {
                    const quote = parent.querySelector('.particle-quote');
                    if (quote) {
                        quote.style.color = 'rgba(255, 255, 255, 0.85)';
                    }
                    const sigQuote = parent.querySelector('.signature-quote');
                    if (sigQuote) {
                        sigQuote.style.opacity = '1';
                        sigQuote.classList.add('reveal');
                    }
                }
            }
            
            revealY += 10; 
            
            let allEdgesDone = true;
            let allFillsDone = true;
            let hasFills = false;
        
            for (let i = 0; i < particlesArray.length; i++) {
                const p = particlesArray[i];
                if (p.isEdge) {
                    p.updateEdge(revealY);
                    p.draw();
                    if (!p.revealed) {
                        allEdgesDone = false;
                    }
                } else if (fillStarted) {
                    hasFills = true;
                    p.updateFill(fillRevealY);
                    p.draw();
                    if (!p.revealed) {
                        allFillsDone = false;
                    }
                } else {
                    allFillsDone = false;
                }
            }
            
            if (allEdgesDone) {
                fillStarted = true;
                fillRevealY += 5; 
            }
            
            
            if (fillStarted && hasFills && allFillsDone) {
                if (canvasId === 'particle-reveal-canvas-index' && !canvas.fadeOutTriggered) {
                    canvas.fadeOutTriggered = true;
                    
                    setTimeout(() => {
                        const overlay = document.getElementById('intro-overlay');
                        if (overlay) {
                            overlay.style.opacity = '0';
                            overlay.style.visibility = 'hidden';
                            setTimeout(() => overlay.remove(), 1500); 
                        }
                    }, 800); 
                }
            }
            
            animationFrameId = requestAnimationFrame(animate);
        }
        
        initAnimation('image.png');
    }

    setupParticleReveal('particle-reveal-canvas-index');
    setupParticleReveal('particle-reveal-canvas-desktop');
    setupParticleReveal('particle-reveal-canvas-mobile');
});
