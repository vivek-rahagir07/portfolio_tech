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
                <div class="dock-glider" id="dockGlider"></div>
                <a href="index.html" class="dock-item" data-tab="home" aria-label="Home">
                    <div class="dock-icon-wrap">
                        <i class="fa-solid fa-house dock-icon"></i>
                        <img src="photos/navbar.png" alt="Home Tab" class="dock-avatar-img">
                    </div>
                    <span class="dock-label">Home</span>
                </a>
                <a href="projects.html" class="dock-item" data-tab="projects" aria-label="Projects">
                    <div class="dock-icon-wrap">
                        <i class="fa-solid fa-layer-group dock-icon"></i>
                        <img src="photos/navbar.png" alt="Projects Tab" class="dock-avatar-img">
                    </div>
                    <span class="dock-label">Projects</span>
                </a>
                <a href="gallery.html" class="dock-item" data-tab="gallery" aria-label="Gallery">
                    <div class="dock-icon-wrap">
                        <i class="fa-solid fa-images dock-icon"></i>
                        <img src="photos/navbar.png" alt="Gallery Tab" class="dock-avatar-img">
                    </div>
                    <span class="dock-label">Gallery</span>
                </a>
                <a href="skills.html" class="dock-item" data-tab="skills" aria-label="Skills">
                    <div class="dock-icon-wrap">
                        <i class="fa-solid fa-code dock-icon"></i>
                        <img src="photos/navbar.png" alt="Skills Tab" class="dock-avatar-img">
                    </div>
                    <span class="dock-label">Skills</span>
                </a>
                <button type="button" class="dock-item" data-tab="profile" id="dock-profile-tab" aria-label="Profile & More">
                    <div class="dock-icon-wrap">
                        <i class="fa-solid fa-user dock-icon"></i>
                        <img src="photos/navbar.png" alt="Profile Tab" class="dock-avatar-img">
                    </div>
                    <span class="dock-label">Profile</span>
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

                    <!-- 3D Card Flipper Container -->
                    <div class="profile-flipper-container" id="profileFlipper">
                        <div class="profile-flipper-inner">

                            <!-- FRONT FACE: Standard Profile View -->
                            <div class="flipper-face flipper-front">
                                <!-- Cover Banner -->
                                <div class="profile-cover-section">
                                    <img src="collage/1.png" alt="Vivek Yadav – Professional Portrait" class="profile-cover-img">
                                    <div class="profile-cover-gradient"></div>
                                    <div class="profile-top-actions">
                                        <button type="button" class="profile-back-btn" id="closeProfileSheet" aria-label="Close Profile">
                                            <i class="fa-solid fa-chevron-left"></i>
                                        </button>
                                        <button type="button" class="profile-nfc-toggle-btn" id="headerNfcToggleBtn" aria-label="View NFC Digital Card">
                                            <i class="fa-solid fa-id-card"></i> <span>NFC / QR</span>
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

                                    <!-- 🟢 Live Status Pill -->
                                    <div class="profile-live-status-pill">
                                        <span class="pls-dot-radar">
                                            <span class="pls-dot-core"></span>
                                            <span class="pls-dot-ring"></span>
                                        </span>
                                        <span class="pls-text">Available for freelance / full-time • New Delhi (IST)</span>
                                    </div>

                                    <!-- ⚡ 1-Tap Quick Action Row -->
                                    <div class="profile-quick-actions-bar">
                                        <button type="button" class="quick-action-pill copy-email-pill" id="quickCopyEmailBtn" aria-label="Copy Email">
                                            <i class="fa-regular fa-copy"></i>
                                            <span>Copy Email</span>
                                        </button>
                                        <a href="https://wa.me/919996445592?text=Hi%20Vivek%2C%20I%20came%20across%20your%20portfolio%20and%20would%20like%20to%20connect!" target="_blank" rel="noopener noreferrer" class="quick-action-pill whatsapp-pill" aria-label="WhatsApp Chat">
                                            <i class="fa-brands fa-whatsapp"></i>
                                            <span>WhatsApp</span>
                                        </a>
                                        <button type="button" class="quick-action-pill nfc-pill" id="triggerCardFlipBtn" aria-label="View NFC Digital Card">
                                            <i class="fa-solid fa-qrcode"></i>
                                            <span>NFC / QR</span>
                                        </button>
                                    </div>

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
                            </div>

                            <!-- BACK FACE: 3D Holographic Metal NFC Card -->
                            <div class="flipper-face flipper-back">
                                <div class="nfc-card-body">
                                    <div class="nfc-card-shimmer"></div>
                                    
                                    <div class="nfc-card-top-bar">
                                        <div class="nfc-chip-badge">
                                            <i class="fa-solid fa-microchip"></i>
                                            <span class="nfc-wave-icon"><i class="fa-solid fa-wifi"></i></span>
                                        </div>
                                        <span class="nfc-card-brand">VIVEK YADAV • RAHAGIR</span>
                                        <button type="button" class="nfc-flip-back-btn" id="flipBackBtn" aria-label="Flip back to bio">
                                            <i class="fa-solid fa-rotate-left"></i>
                                        </button>
                                    </div>

                                    <div class="nfc-card-center">
                                        <div class="nfc-qr-wrapper">
                                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fvivek-rahagir.com%2F&color=d4af37&bgcolor=0d0d11&margin=4" alt="Scan to connect" class="nfc-qr-code">
                                            <div class="qr-glow-corner top-left"></div>
                                            <div class="qr-glow-corner top-right"></div>
                                            <div class="qr-glow-corner bottom-left"></div>
                                            <div class="qr-glow-corner bottom-right"></div>
                                        </div>
                                        <p class="nfc-scan-hint"><i class="fa-solid fa-camera"></i> Scan with camera to open portfolio</p>
                                        <div class="nfc-holder-info">
                                            <h4 class="nfc-name">Vivek Yadav</h4>
                                            <p class="nfc-role">Full Stack Developer & Creative Technologist</p>
                                            <p class="nfc-contact-snippet">vivekhr36.2007@gmail.com • +91 9996445592</p>
                                        </div>
                                    </div>

                                    <div class="nfc-card-bottom-actions">
                                        <button type="button" class="nfc-action-btn vcf-btn" id="nfcSaveContactBtn">
                                            <i class="fa-solid fa-address-card"></i> Save Contact to Phone (.vcf)
                                        </button>
                                        <button type="button" class="nfc-action-btn flip-btn" id="nfcFlipBackSecondaryBtn">
                                            <i class="fa-solid fa-user"></i> View Profile Bio
                                        </button>
                                    </div>
                                </div>
                            </div>

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

            // Setup Profile Toast Helper
            function showProfileToast(message) {
                let toast = document.getElementById('profileToast');
                if (!toast) {
                    toast = document.createElement('div');
                    toast.id = 'profileToast';
                    toast.className = 'profile-floating-toast';
                    document.body.appendChild(toast);
                }
                toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
                toast.classList.remove('show');
                void toast.offsetWidth;
                toast.classList.add('show');
                if (navigator.vibrate) {
                    try { navigator.vibrate([15, 30]); } catch (err) {}
                }
                clearTimeout(toast._timer);
                toast._timer = setTimeout(() => {
                    toast.classList.remove('show');
                }, 2800);
            }
            window.showProfileToast = showProfileToast;

            // Setup .vcf Download
            function downloadVivekVCF() {
                const vcard = [
                    'BEGIN:VCARD',
                    'VERSION:3.0',
                    'N:Yadav;Vivek;;;',
                    'FN:Vivek Yadav (Rahagir)',
                    'ORG:Vivek Yadav Portfolio',
                    'TITLE:Full Stack Developer & Creative Technologist',
                    'TEL;TYPE=CELL,VOICE:+919996445592',
                    'EMAIL;TYPE=INTERNET,HOME:vivekhr36.2007@gmail.com',
                    'URL:https://vivek-rahagir.com/',
                    'URL;TYPE=GitHub:https://github.com/vivek-rahagir07',
                    'URL;TYPE=LinkedIn:https://linkedin.com/in/vivek-yadav-1142213a0/',
                    'NOTE:Full Stack Developer specializing in Node.js, Laravel, React, PostgreSQL, and IoT Systems.',
                    'END:VCARD'
                ].join('\r\n');

                const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'Vivek_Yadav.vcf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                showProfileToast('Contact file (Vivek_Yadav.vcf) downloaded! 📇');
            }

            // Setup Email Copy
            function copyEmailToClipboard() {
                const email = 'vivekhr36.2007@gmail.com';
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(email).then(() => {
                        showProfileToast('vivekhr36.2007@gmail.com copied! ✨');
                    }).catch(() => {
                        fallbackCopy(email);
                    });
                } else {
                    fallbackCopy(email);
                }
            }

            function fallbackCopy(text) {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    showProfileToast('vivekhr36.2007@gmail.com copied! ✨');
                } catch (err) {
                    showProfileToast('Email: vivekhr36.2007@gmail.com');
                }
                document.body.removeChild(textArea);
            }

            // 3D Card Flip Handler
            const flipper = document.getElementById('profileFlipper');
            function toggleCardFlip(forceState) {
                if (!flipper) return;
                if (typeof forceState === 'boolean') {
                    flipper.classList.toggle('is-flipped', forceState);
                } else {
                    flipper.classList.toggle('is-flipped');
                }
                if (navigator.vibrate) {
                    try { navigator.vibrate(20); } catch (err) {}
                }
            }

            const headerNfcBtn = document.getElementById('headerNfcToggleBtn');
            if (headerNfcBtn) {
                headerNfcBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    toggleCardFlip(true);
                });
            }

            const triggerCardFlipBtn = document.getElementById('triggerCardFlipBtn');
            if (triggerCardFlipBtn) {
                triggerCardFlipBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    toggleCardFlip(true);
                });
            }

            const flipBackBtn = document.getElementById('flipBackBtn');
            if (flipBackBtn) {
                flipBackBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    toggleCardFlip(false);
                });
            }

            const nfcFlipBackSecondaryBtn = document.getElementById('nfcFlipBackSecondaryBtn');
            if (nfcFlipBackSecondaryBtn) {
                nfcFlipBackSecondaryBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    toggleCardFlip(false);
                });
            }

            const quickCopyBtn = document.getElementById('quickCopyEmailBtn');
            if (quickCopyBtn) {
                quickCopyBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    copyEmailToClipboard();
                });
            }

            const nfcSaveContactBtn = document.getElementById('nfcSaveContactBtn');
            if (nfcSaveContactBtn) {
                nfcSaveContactBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    downloadVivekVCF();
                });
            }

            const likeBtn = document.getElementById('profileLikeBtn');
            if (likeBtn) {
                likeBtn.addEventListener('click', () => {
                    const icon = likeBtn.querySelector('i');
                    if (icon.classList.contains('fa-regular')) {
                        icon.classList.remove('fa-regular');
                        icon.classList.add('fa-solid');
                        icon.style.color = '#e74c3c';
                        likeBtn.innerHTML = '<i class="fa-solid fa-heart" style="color:#e74c3c;font-size:1rem"></i> Liked';
                        showProfileToast('Thank you for the support! ❤️');
                    } else {
                        likeBtn.innerHTML = '<i class="fa-regular fa-heart" style="font-size:1rem"></i> Like';
                    }
                });
            }
        }

        function updateMobileDockActive(targetPathOrTab) {
            const dock = document.getElementById('mobileBottomDock');
            if (!dock) return;
            const dockItems = dock.querySelectorAll('.dock-item');
            dockItems.forEach(item => item.classList.remove('active'));

            let activeEl = null;
            if (typeof targetPathOrTab === 'string') {
                const lower = targetPathOrTab.toLowerCase();
                if (lower === 'projects' || lower.includes('project')) {
                    activeEl = dock.querySelector('[data-tab="projects"]');
                } else if (lower === 'gallery' || lower.includes('gallery')) {
                    activeEl = dock.querySelector('[data-tab="gallery"]');
                } else if (lower === 'skills' || lower.includes('skills')) {
                    activeEl = dock.querySelector('[data-tab="skills"]');
                } else if (lower === 'profile' || lower.includes('about') || lower.includes('contact') || lower.includes('developer-guide') || lower.includes('iot') || lower.includes('terminal')) {
                    activeEl = dock.querySelector('[data-tab="profile"]');
                } else {
                    activeEl = dock.querySelector('[data-tab="home"]');
                }
            } else if (targetPathOrTab instanceof HTMLElement) {
                activeEl = targetPathOrTab.closest('.dock-item');
            }

            if (!activeEl) {
                activeEl = dock.querySelector('[data-tab="home"]');
            }

            if (activeEl) {
                activeEl.classList.add('active');

                const glider = document.getElementById('dockGlider');
                if (glider) {
                    const dockRect = dock.getBoundingClientRect();
                    const itemRect = activeEl.getBoundingClientRect();
                    if (itemRect.width > 0) {
                        const centerX = (itemRect.left - dockRect.left) + (itemRect.width / 2);
                        glider.style.left = `${centerX}px`;
                        glider.style.opacity = '1';
                    }
                }
            }
        }
        window.updateMobileDockActive = updateMobileDockActive;

        setTimeout(() => updateMobileDockActive(window.location.pathname), 50);
        window.addEventListener('resize', () => updateMobileDockActive(window.location.pathname));

        bottomDock.querySelectorAll('.dock-item').forEach(item => {
            item.addEventListener('click', function() {
                updateMobileDockActive(this);
            });
        });

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

                    if (window.updateMobileDockActive) {
                        window.updateMobileDockActive(newPath);
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

/* ============================================================
   GLOBAL COMMAND PALETTE (CMD + K / SPOTLIGHT SEARCH)
   ============================================================ */
(function initCommandPalette() {
    const COMMANDS = [
        // Quick Actions
        {
            id: 'action-cv',
            category: 'Quick Actions',
            title: 'Download CV / Resume',
            subtitle: "Get Vivek Yadav's latest resume (PNG/PDF)",
            icon: 'fa-solid fa-file-arrow-down',
            badge: 'Action',
            keywords: 'resume cv download hiring hire profile experience biodata job',
            action: () => {
                const link = document.createElement('a');
                link.href = 'photos/cv.png';
                link.download = 'Vivek_Yadav_CV.png';
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showToast("Downloading Vivek's CV... 📄");
            }
        },
        {
            id: 'action-email',
            category: 'Quick Actions',
            title: 'Copy Email Address',
            subtitle: 'vivekhr36.2007@gmail.com',
            icon: 'fa-solid fa-envelope',
            badge: 'Copy',
            keywords: 'email mail contact get in touch message hire write collaborate',
            action: () => {
                navigator.clipboard.writeText('vivekhr36.2007@gmail.com').then(() => {
                    showToast('Email copied to clipboard! 📋');
                }).catch(() => {
                    showToast('vivekhr36.2007@gmail.com');
                });
            }
        },
        {
            id: 'action-phone',
            category: 'Quick Actions',
            title: 'Copy Phone Number',
            subtitle: '+91 9996445592',
            icon: 'fa-solid fa-phone',
            badge: 'Copy',
            keywords: 'phone call mobile whatsapp contact number talk direct',
            action: () => {
                navigator.clipboard.writeText('+919996445592').then(() => {
                    showToast('Phone number copied to clipboard! 📞');
                }).catch(() => {
                    showToast('+91 9996445592');
                });
            }
        },
        {
            id: 'action-telegram',
            category: 'Quick Actions',
            title: 'Chat on Telegram',
            subtitle: '@rahagirrr — Instant direct messaging',
            icon: 'fa-brands fa-telegram',
            badge: 'External',
            keywords: 'telegram chat dm message rahul direct rahagir connect',
            action: () => {
                window.open('https://t.me/rahagirrr', '_blank');
            }
        },
        {
            id: 'action-github',
            category: 'Quick Actions',
            title: 'Visit GitHub Profile',
            subtitle: 'github.com/vivek-rahagir07 — 800+ contributions',
            icon: 'fa-brands fa-github',
            badge: 'External',
            keywords: 'github code repo repository open source git commits projects',
            action: () => {
                window.open('https://github.com/vivek-rahagir07', '_blank');
            }
        },
        {
            id: 'action-linkedin',
            category: 'Quick Actions',
            title: 'Visit LinkedIn Profile',
            subtitle: 'linkedin.com/in/vivek-yadav-1142213a0',
            icon: 'fa-brands fa-linkedin-in',
            badge: 'External',
            keywords: 'linkedin profile network connect professional career work recruiter',
            action: () => {
                window.open('https://linkedin.com/in/vivek-yadav-1142213a0/', '_blank');
            }
        },

        // Featured Projects
        {
            id: 'proj-cognitoattend',
            category: 'Projects & Case Studies',
            title: 'CognitoAttend — AI Attendance System',
            subtitle: 'Facial recognition, real-time analytics & automated attendance tracking',
            icon: 'fa-solid fa-user-check',
            badge: 'Project',
            keywords: 'cognitoattend cognito attendance face recognition ai machine learning analytics python opencv',
            url: 'project-cognitoattend.html'
        },
        {
            id: 'proj-neoride',
            category: 'Projects & Case Studies',
            title: 'NeoRide — Smart Cab & Ride Booking',
            subtitle: 'Fleet management, dynamic routing & real-time passenger fare engine',
            icon: 'fa-solid fa-car',
            badge: 'Project',
            keywords: 'neoride uber ola cab taxi ride booking maps gps route fare transport booking',
            url: 'project-neoride.html'
        },
        {
            id: 'proj-neostream',
            category: 'Projects & Case Studies',
            title: 'NeoStream (NeoMusic) — Audio Web App',
            subtitle: 'High-fidelity audio streaming, queue management & interactive visualizer',
            icon: 'fa-solid fa-music',
            badge: 'Project',
            keywords: 'neostream neomusic music song audio player spotify sound stream playlist visualizer',
            url: 'project-neostream.html'
        },
        {
            id: 'proj-jhatpatsewa',
            category: 'Projects & Case Studies',
            title: 'JhatpatSewa — Hyperlocal Services',
            subtitle: 'On-demand service booking, verified technician matching & dispatch',
            icon: 'fa-solid fa-bolt',
            badge: 'Project',
            keywords: 'jhatpatsewa jhatpat sewa services electrician plumber repair urban company booking hyperlocal',
            url: 'project-jhatpatsewa.html'
        },
        {
            id: 'proj-mediaconverter',
            category: 'Projects & Case Studies',
            title: 'MediaConverter — High-Speed File Converter',
            subtitle: 'Client-side media conversion, transcoding & compression utility',
            icon: 'fa-solid fa-rotate',
            badge: 'Project',
            keywords: 'mediaconverter media convert converter video audio mp4 mp3 mkv transcode ffmpeg tool',
            url: 'project-mediaconverter.html'
        },
        {
            id: 'proj-starcadet',
            category: 'Projects & Case Studies',
            title: 'Star Cadet — Retro 2D Space Arcade Game',
            subtitle: 'HTML5 Canvas, custom particle physics & retro space shooter gameplay',
            icon: 'fa-solid fa-rocket',
            badge: 'Game',
            keywords: 'star cadet arcade game space shooter retro canvas 2d gaming asteroids physics play',
            url: 'project-starcadet.html'
        },
        {
            id: 'proj-portfolio',
            category: 'Projects & Case Studies',
            title: 'Portfolio Architecture & Case Study',
            subtitle: 'Deep-dive into Vanilla JS performance, physics & scroll-jacking',
            icon: 'fa-solid fa-code',
            badge: 'Case Study',
            keywords: 'portfolio website case study architecture design vanilla js css performance engineering',
            url: 'project-portfolio.html'
        },

        // Navigation & Portals
        {
            id: 'nav-home',
            category: 'Navigation',
            title: 'Home Overview',
            subtitle: 'Hero, interactive particle reveal, featured highlights',
            icon: 'fa-solid fa-house',
            badge: 'Page',
            keywords: 'home index main landing hero intro start overview',
            url: 'index.html'
        },
        {
            id: 'nav-about',
            category: 'Navigation',
            title: 'About Vivek & Journey',
            subtitle: 'Philosophy, background, video highlights & leadership',
            icon: 'fa-solid fa-user-astronaut',
            badge: 'Page',
            keywords: 'about me bio profile story education bml munjal university savera club leadership journey',
            url: 'about.html'
        },
        {
            id: 'nav-skills',
            category: 'Navigation',
            title: 'Technical Skills & Stack',
            subtitle: 'React, Node, Laravel, PostgreSQL, Firebase, Supabase, Cloud',
            icon: 'fa-solid fa-layer-group',
            badge: 'Page',
            keywords: 'skills tech stack technologies javascript react node php laravel sql postgresql mongodb firebase architecture',
            url: 'skills.html'
        },
        {
            id: 'nav-projects',
            category: 'Navigation',
            title: 'All Projects Gallery',
            subtitle: 'Explore full catalog of web applications & case studies',
            icon: 'fa-solid fa-laptop-code',
            badge: 'Page',
            keywords: 'projects works builds apps applications portfolio live demo showcase catalog',
            url: 'projects.html'
        },
        {
            id: 'nav-terminal',
            category: 'Navigation',
            title: 'Interactive Hacker Terminal (CLI)',
            subtitle: 'Matrix digital rain, live commands, system emulator',
            icon: 'fa-solid fa-terminal',
            badge: 'CLI',
            keywords: 'terminal cli command line matrix bash shell hacker console prompt linux dev',
            url: 'terminal.html'
        },
        {
            id: 'nav-devguide',
            category: 'Navigation',
            title: 'Developer Guide & Mindmap',
            subtitle: 'Full-stack learning roadmap, curated guides & interactive canvas',
            icon: 'fa-solid fa-sitemap',
            badge: 'Roadmap',
            keywords: 'developer guide roadmap dev guide mindmap resources documentation learning full stack syllabus',
            url: 'developer-guide.html'
        },
        {
            id: 'nav-iot',
            category: 'Navigation',
            title: 'IoT & Robotics Systems',
            subtitle: 'ESP32, Arduino, sensor telemetry & hardware cloud dashboards',
            icon: 'fa-solid fa-microchip',
            badge: 'Hardware',
            keywords: 'iot internet of things robotics hardware esp32 arduino raspberry pi sensors telemetry automation',
            url: 'iot.html'
        },
        {
            id: 'nav-gallery',
            category: 'Navigation',
            title: 'Photo Gallery & Memories',
            subtitle: 'Moments, hackathons, university life & tech snapshots',
            icon: 'fa-solid fa-images',
            badge: 'Media',
            keywords: 'gallery photos images pictures collage moments memories life events awards',
            url: 'gallery.html'
        },
        {
            id: 'nav-contact',
            category: 'Navigation',
            title: 'Contact & Hire Vivek',
            subtitle: 'Direct messaging, collaboration inquiry & social connections',
            icon: 'fa-solid fa-paper-plane',
            badge: 'Contact',
            keywords: 'contact message form hire talk collaborate email inquiry reach out consultation',
            url: 'contact.html'
        }
    ];

    let backdrop = null;
    let input = null;
    let resultsContainer = null;
    let clearBtn = null;
    let toast = null;
    let activeIndex = 0;
    let filteredCommands = [];

    function createPaletteDOM() {
        if (document.getElementById('cmdPaletteBackdrop')) return;

        backdrop = document.createElement('div');
        backdrop.id = 'cmdPaletteBackdrop';
        backdrop.className = 'cmd-palette-backdrop';
        backdrop.setAttribute('role', 'dialog');
        backdrop.setAttribute('aria-modal', 'true');
        backdrop.setAttribute('aria-label', 'Global Command Palette');

        backdrop.innerHTML = `
            <div class="cmd-palette-modal" id="cmdPaletteModal">
                <div class="cmd-search-header">
                    <div class="cmd-search-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
                    <input type="text" class="cmd-search-input" id="cmdSearchInput" placeholder="Type a command, project, or page (e.g., CV, Cognito, Dev Guide)..." autocomplete="off" spellcheck="false">
                    <button type="button" class="cmd-clear-btn" id="cmdClearBtn" aria-label="Clear Search"><i class="fa-solid fa-xmark"></i></button>
                    <span class="cmd-esc-badge" id="cmdCloseBadge">ESC</span>
                </div>
                <div class="cmd-palette-body" id="cmdPaletteBody">
                    <!-- Results rendered dynamically -->
                </div>
                <div class="cmd-palette-footer">
                    <div class="cmd-shortcuts">
                        <span class="cmd-shortcut-item"><span class="cmd-key">↑</span><span class="cmd-key">↓</span> Navigate</span>
                        <span class="cmd-shortcut-item"><span class="cmd-key">↵</span> Select</span>
                        <span class="cmd-shortcut-item"><span class="cmd-key">ESC</span> Close</span>
                    </div>
                    <div class="cmd-branding">Vivek Yadav Command Palette</div>
                </div>
            </div>
        `;

        document.body.appendChild(backdrop);

        // Toast container
        toast = document.createElement('div');
        toast.className = 'cmd-palette-toast';
        toast.id = 'cmdPaletteToast';
        document.body.appendChild(toast);

        input = document.getElementById('cmdSearchInput');
        resultsContainer = document.getElementById('cmdPaletteBody');
        clearBtn = document.getElementById('cmdClearBtn');

        // Event listeners
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closePalette();
            }
        });

        const closeBadge = document.getElementById('cmdCloseBadge');
        if (closeBadge) {
            closeBadge.addEventListener('click', closePalette);
        }

        clearBtn.addEventListener('click', () => {
            input.value = '';
            clearBtn.style.display = 'none';
            input.focus();
            renderResults('');
        });

        input.addEventListener('input', (e) => {
            const query = e.target.value;
            clearBtn.style.display = query.trim().length > 0 ? 'flex' : 'none';
            renderResults(query);
        });

        input.addEventListener('keydown', handleKeyNavigation);

        // Add Quick Search button to Navbars
        injectNavTriggerButtons();
    }

    function injectNavTriggerButtons() {
        const navButtonsContainers = document.querySelectorAll('.nav-buttons');
        navButtonsContainers.forEach(container => {
            if (!container.querySelector('.nav-search-trigger')) {
                const trigger = document.createElement('button');
                trigger.type = 'button';
                trigger.className = 'nav-search-trigger';
                trigger.setAttribute('aria-label', 'Open Command Palette (Cmd + K)');
                trigger.title = 'Quick Search & Actions (Cmd + K)';
                const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
                trigger.innerHTML = `<i class="fa-solid fa-magnifying-glass" style="font-size:0.85rem;color:var(--accent,#d4af37);"></i> <span class="search-text">Search</span> <span class="search-kbd">${isMac ? '⌘K' : 'Ctrl+K'}</span>`;
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    openPalette();
                });
                container.insertBefore(trigger, container.firstChild);
            }
        });
    }

    function showToast(message) {
        if (!toast) return;
        toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#2ecc71;"></i> <span>${message}</span>`;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2800);
    }

    function openPalette() {
        createPaletteDOM();
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
        input.value = '';
        if (clearBtn) clearBtn.style.display = 'none';
        renderResults('');
        setTimeout(() => {
            input.focus();
        }, 50);
    }

    function closePalette() {
        if (!backdrop) return;
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
        if (input) input.blur();
    }

    function renderResults(query = '') {
        const q = query.toLowerCase().trim();

        if (!q) {
            filteredCommands = [...COMMANDS];
        } else {
            filteredCommands = COMMANDS.filter(cmd => {
                const titleMatch = cmd.title.toLowerCase().includes(q);
                const subMatch = cmd.subtitle.toLowerCase().includes(q);
                const catMatch = cmd.category.toLowerCase().includes(q);
                const keyMatch = cmd.keywords && cmd.keywords.toLowerCase().includes(q);
                return titleMatch || subMatch || catMatch || keyMatch;
            });
        }

        activeIndex = 0;

        if (filteredCommands.length === 0) {
            resultsContainer.innerHTML = `
                <div class="cmd-empty-state">
                    <i class="fa-solid fa-ghost"></i>
                    <p>No results found for "<strong>${escapeHTML(query)}</strong>"</p>
                    <p style="font-size:0.78rem;color:rgba(255,255,255,0.3);margin-top:6px;">Try searching for "CV", "CognitoAttend", "Skills", or "Contact"</p>
                </div>
            `;
            return;
        }

        // Group by category
        const groups = {};
        filteredCommands.forEach(cmd => {
            if (!groups[cmd.category]) groups[cmd.category] = [];
            groups[cmd.category].push(cmd);
        });

        let html = '';
        let globalIndex = 0;

        Object.keys(groups).forEach(categoryName => {
            html += `<div class="cmd-group-title">${categoryName}</div>`;
            groups[categoryName].forEach(cmd => {
                const isSelected = globalIndex === activeIndex;
                html += `
                    <div class="cmd-item ${isSelected ? 'active' : ''}" data-cmd-index="${globalIndex}" role="button" tabindex="0">
                        <div class="cmd-item-left">
                            <div class="cmd-item-icon"><i class="${cmd.icon}"></i></div>
                            <div class="cmd-item-info">
                                <div class="cmd-item-title">${highlightMatch(cmd.title, q)}</div>
                                <div class="cmd-item-subtitle">${highlightMatch(cmd.subtitle, q)}</div>
                            </div>
                        </div>
                        <span class="cmd-item-badge">${cmd.badge}</span>
                    </div>
                `;
                globalIndex++;
            });
        });

        resultsContainer.innerHTML = html;

        // Attach click listeners to rendered items
        const renderedItems = resultsContainer.querySelectorAll('.cmd-item');
        renderedItems.forEach(item => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.getAttribute('data-cmd-index'), 10);
                executeCommand(idx);
            });
            item.addEventListener('mouseenter', () => {
                renderedItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                activeIndex = parseInt(item.getAttribute('data-cmd-index'), 10);
            });
        });
    }

    function highlightMatch(text, query) {
        if (!query) return escapeHTML(text);
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return escapeHTML(text).replace(regex, '<span style="color:var(--accent,#d4af37);text-decoration:underline;">$1</span>');
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag));
    }

    function handleKeyNavigation(e) {
        const items = resultsContainer.querySelectorAll('.cmd-item');
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = (activeIndex + 1) % items.length;
            updateActiveItem(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = (activeIndex - 1 + items.length) % items.length;
            updateActiveItem(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            executeCommand(activeIndex);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            closePalette();
        }
    }

    function updateActiveItem(items) {
        items.forEach((item, idx) => {
            if (idx === activeIndex) {
                item.classList.add('active');
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                item.classList.remove('active');
            }
        });
    }

    function executeCommand(index) {
        if (index < 0 || index >= filteredCommands.length) return;
        const cmd = filteredCommands[index];
        closePalette();

        if (cmd.action) {
            cmd.action();
        } else if (cmd.url) {
            window.location.href = cmd.url;
        }
    }

    // Global Key Listener for Cmd+K / Ctrl+K and '/'
    window.addEventListener('keydown', (e) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const isCmdK = (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k';
        const isSlash = e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) && !document.activeElement.isContentEditable;

        if (isCmdK || isSlash) {
            e.preventDefault();
            if (backdrop && backdrop.classList.contains('active')) {
                closePalette();
            } else {
                openPalette();
            }
        } else if (e.key === 'Escape') {
            if (backdrop && backdrop.classList.contains('active')) {
                closePalette();
            }
        }
    });

    // Expose global methods
    window.openCommandPalette = openPalette;
    window.closeCommandPalette = closePalette;

    // Initialize once DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createPaletteDOM);
    } else {
        createPaletteDOM();
    }
})();

/* ==========================================================================
   INTERACTIVE OVERLAPPING STACKING CARDS DECK (MY JOURNEY)
   ========================================================================== */
(function initInteractiveStackingJourney() {
    function setupStackingDeck() {
        const section = document.getElementById('my-journey');
        const cards = document.querySelectorAll('.journey-stack-card');
        const indicators = document.querySelectorAll('.journey-indicator-pill');
        const deckViewport = document.getElementById('journeyDeckViewport');

        if (!section || cards.length === 0) return;

        const totalCards = cards.length;
        let currentActiveIndex = 0;
        let mouseX = 0.5;
        let mouseY = 0.5;
        let isHovered = false;
        let isTicking = false;

        function updateCardStack() {
            const sectionRect = section.getBoundingClientRect();
            const sectionTop = sectionRect.top;
            const sectionHeight = section.offsetHeight;
            const viewportHeight = window.innerHeight;
            const scrollDistance = sectionHeight - viewportHeight;

            if (scrollDistance <= 0) return;

            // Calculate progress from 0.0 to (totalCards - 1)
            const scrolledWithin = -sectionTop;
            const rawProgress = (scrolledWithin / scrollDistance) * (totalCards - 1);
            const progress = Math.max(0, Math.min(totalCards - 1, rawProgress));

            const activeIdx = Math.round(progress);
            if (activeIdx !== currentActiveIndex) {
                currentActiveIndex = activeIdx;
            }

            cards.forEach((card, i) => {
                const diff = progress - i;
                card.style.zIndex = 10 + i;

                if (diff < 0) {
                    // Card is below the active deck
                    const offset = -diff; // > 0

                    if (offset >= 1.05) {
                        card.style.transform = 'translate3d(0, 120%, 0) scale(0.96)';
                        card.style.opacity = '0';
                        card.style.visibility = 'hidden';
                        card.style.pointerEvents = 'none';
                        card.classList.remove('is-current-phase');
                    } else {
                        // Gliding smoothly from 105% to 0%
                        const translateYPercent = offset * 105;
                        const scale = 0.96 + (1 - offset) * 0.04;

                        card.style.transform = `translate3d(0, ${translateYPercent.toFixed(2)}%, 0) scale(${scale.toFixed(3)})`;
                        card.style.opacity = '1';
                        card.style.visibility = 'visible';
                        card.style.filter = 'brightness(1)';
                        card.style.pointerEvents = 'none';
                        card.classList.remove('is-current-phase');
                    }
                } else {
                    // Card is currently active or covered by subsequent cards
                    const stackLevel = diff;
                    const isFullyCovered = stackLevel >= 1.8;

                    if (isFullyCovered) {
                        card.style.transform = `translate3d(0, -16px, 0) scale(0.92)`;
                        card.style.opacity = '0';
                        card.style.visibility = 'hidden';
                        card.style.pointerEvents = 'none';
                        card.classList.remove('is-current-phase');
                    } else {
                        const translateYPx = -(Math.min(1.5, stackLevel) * 8);
                        const scale = Math.max(0.94, 1 - stackLevel * 0.03);
                        const brightness = Math.max(0.4, 1 - stackLevel * 0.25);
                        const opacity = Math.max(0.1, 1 - stackLevel * 0.45);

                        // Subtle 3D mouse tilt for the active top card
                        let tiltTransform = '';
                        if (stackLevel < 0.35 && isHovered) {
                            const tiltX = (mouseY - 0.5) * -8;
                            const tiltY = (mouseX - 0.5) * 8;
                            tiltTransform = ` rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
                        }

                        card.style.transform = `translate3d(0, ${translateYPx.toFixed(1)}px, 0) scale(${scale.toFixed(3)})${tiltTransform}`;
                        card.style.opacity = opacity.toFixed(3);
                        card.style.filter = `brightness(${brightness.toFixed(2)})`;
                        card.style.visibility = 'visible';
                        card.style.pointerEvents = (stackLevel < 0.4) ? 'auto' : 'none';

                        if (stackLevel < 0.5) {
                            card.classList.add('is-current-phase');
                        } else {
                            card.classList.remove('is-current-phase');
                        }
                    }
                }
            });

            isTicking = false;
        }

        function requestStackUpdate() {
            if (!isTicking) {
                requestAnimationFrame(updateCardStack);
                isTicking = true;
            }
        }

        // 3D Perspective Tilt & Spotlight Sheen on Mouse Movement
        if (deckViewport) {
            deckViewport.addEventListener('mouseenter', () => {
                isHovered = true;
            });

            deckViewport.addEventListener('mousemove', (e) => {
                const rect = deckViewport.getBoundingClientRect();
                mouseX = (e.clientX - rect.left) / rect.width;
                mouseY = (e.clientY - rect.top) / rect.height;

                const activeCard = cards[currentActiveIndex];
                if (activeCard) {
                    const cardRect = activeCard.getBoundingClientRect();
                    const cardMouseX = e.clientX - cardRect.left;
                    const cardMouseY = e.clientY - cardRect.top;
                    activeCard.style.setProperty('--mouse-x', `${cardMouseX}px`);
                    activeCard.style.setProperty('--mouse-y', `${cardMouseY}px`);
                }

                requestStackUpdate();
            });

            deckViewport.addEventListener('mouseleave', () => {
                isHovered = false;
                mouseX = 0.5;
                mouseY = 0.5;
                requestStackUpdate();
            });
        }

        // Scroll listener for sticky deck
        window.addEventListener('scroll', requestStackUpdate, { passive: true });
        window.addEventListener('resize', requestStackUpdate, { passive: true });

        // Initial trigger
        updateCardStack();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupStackingDeck);
    } else {
        setupStackingDeck();
    }
})();



