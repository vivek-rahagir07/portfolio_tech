document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector('.scroll-jack-wrapper');
    const track = document.getElementById('horizontal-track');
    
    if (!wrapper || !track) return;
    
    window.addEventListener('scroll', () => {
        // Calculate how far down the wrapper we have scrolled
        const wrapperTop = wrapper.offsetTop;
        const scrollPosition = window.scrollY - wrapperTop;
        
        // The total scrollable distance inside the wrapper
        const maxScroll = wrapper.scrollHeight - window.innerHeight;
        
        if (scrollPosition < 0) {
            // Above the wrapper, track is at 0
            track.style.transform = `translateX(0px)`;
        } else if (scrollPosition > maxScroll) {
            // Below the wrapper, track is at max offset
            const maxTranslate = track.scrollWidth - window.innerWidth;
            track.style.transform = `translateX(-${maxTranslate}px)`;
        } else {
            // Inside the wrapper, calculate percentage
            const percentage = scrollPosition / maxScroll;
            const maxTranslate = track.scrollWidth - window.innerWidth;
            track.style.transform = `translateX(-${maxTranslate * percentage}px)`;
        }
    });
});
