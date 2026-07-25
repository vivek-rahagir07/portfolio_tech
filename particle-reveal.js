document.addEventListener('DOMContentLoaded', () => {
    function setupParticleReveal(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        let particlesArray = [];
        let animationFrameId;
        let revealY = 0;
        let fillStarted = false;
        let fillRevealY = 0;
        
        // Mouse interaction object
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
            if (parent.clientWidth > 0 && parent.clientHeight > 0) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            } else {
                // Fallback to window size if hidden
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
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
                if (canvas.width === 0 || canvas.height === 0) return;
                
                // Base size on width, but restrict by height to prevent vertical overflow
                let targetWidth = Math.min(canvas.width * 0.9, 1000);
                let scale = targetWidth / image.width;
                let targetHeight = image.height * scale;
                
                // Constrain height to leave room for quote and navbar
                const maxAllowedHeight = canvas.height * 0.75;
                if (targetHeight > maxAllowedHeight) {
                    targetHeight = maxAllowedHeight;
                    scale = targetHeight / image.height;
                    targetWidth = image.width * scale;
                }
                
                const offsetX = (canvas.width - targetWidth) / 2;
                const offsetY = (canvas.height - targetHeight) / 2;
                
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
                                bgMap[nIdx] = 1; // background
                                push(nx, ny);
                            } else {
                                bgMap[nIdx] = 2; // edge of person
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
                    ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
                    ctx.restore();
                }
            }
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            revealY += 10; 
            
            let allEdgesDone = true;
        
            for (let i = 0; i < particlesArray.length; i++) {
                const p = particlesArray[i];
                if (p.isEdge) {
                    p.updateEdge(revealY);
                    p.draw();
                    if (!p.revealed) {
                        allEdgesDone = false;
                    }
                }
            }
            
            if (allEdgesDone) {
                fillStarted = true;
            }
            
            if (fillStarted) {
                // Reveal the quote text
                const parent = canvas.parentElement;
                if (parent) {
                    const quote = parent.querySelector('.particle-quote');
                    if (quote) {
                        quote.style.color = 'rgba(255, 255, 255, 0.85)';
                    }
                }
                
                fillRevealY += 4; 
                for (let i = 0; i < particlesArray.length; i++) {
                    const p = particlesArray[i];
                    if (!p.isEdge) {
                        p.updateFill(fillRevealY);
                        p.draw();
                    }
                }
            }
            
            animationFrameId = requestAnimationFrame(animate);
        }
        
        initAnimation('image.png');
    }

    setupParticleReveal('particle-reveal-canvas-desktop');
    setupParticleReveal('particle-reveal-canvas-mobile');
});
