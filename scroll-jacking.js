document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector('.scroll-jack-wrapper');
    const track = document.getElementById('horizontal-track');
    
    if (!wrapper || !track) return;
    
    window.addEventListener('scroll', () => {
        
        const wrapperTop = wrapper.offsetTop;
        const scrollPosition = window.scrollY - wrapperTop;
        
        
        const maxScroll = wrapper.scrollHeight - window.innerHeight;
        
        if (scrollPosition < 0) {
            
            track.style.transform = `translateX(0px)`;
        } else if (scrollPosition > maxScroll) {
            
            const maxTranslate = track.scrollWidth - window.innerWidth;
            track.style.transform = `translateX(-${maxTranslate}px)`;
        } else {
            
            const percentage = scrollPosition / maxScroll;
            const maxTranslate = track.scrollWidth - window.innerWidth;
            track.style.transform = `translateX(-${maxTranslate * percentage}px)`;
        }
    });
});
