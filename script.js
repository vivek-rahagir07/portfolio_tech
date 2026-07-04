document.addEventListener('DOMContentLoaded', () => {
    // Scratch Card Logic
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('scratch-container');
    const instructionUi = document.getElementById('scratch-instruction-ui');
    
    // Load overlay image
    const overlayImg = new Image();
    overlayImg.src = 'photos/overlay.png'; // Make sure this image exists in the same directory
    
    let isDrawing = false;
    let scratchedPixels = 0;
    let totalPixels = 0;
    
    // Setup canvas size
    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Redraw overlay
        if (overlayImg.complete) {
            drawOverlay();
        }
    }
    
    function drawOverlay() {
        ctx.globalCompositeOperation = 'source-over';
        
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
        
        // Calculate total pixels for percentage
        totalPixels = canvas.width * canvas.height;
    }
    
    overlayImg.onload = () => {
        resizeCanvas();
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
        ctx.arc(x, y, 40, 0, Math.PI * 2); // 40px radius brush
        ctx.fill();
    }
    
    // Event Listeners for drawing
    const startScratch = (e) => {
        isDrawing = true;
        instructionUi.style.opacity = '0'; // Hide instructions when scratching starts
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
});
