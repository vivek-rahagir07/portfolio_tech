document.addEventListener("DOMContentLoaded", () => {
    const terminalBody = document.getElementById("terminal-body");
    const terminalInput = document.getElementById("terminal-input");
    const terminalWindow = document.getElementById("terminalWindow");
    const matrixCanvas = document.getElementById("matrixCanvas");
    const terminalMatrixCanvas = document.getElementById("terminalMatrixCanvas");
    const popupOverlay = document.getElementById("popupOverlay");
    const currentTimeElement = document.getElementById("currentTime");

    // Matrix Rain Animation (Background)
    function initMatrixRain() {
        const ctx = matrixCanvas.getContext('2d');
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;

        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
        const fontSize = 14;
        const columns = matrixCanvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            ctx.fillStyle = '#0f0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(draw, 33);

        window.addEventListener('resize', () => {
            matrixCanvas.width = window.innerWidth;
            matrixCanvas.height = window.innerHeight;
        });
    }

    // Matrix Rain Animation (Inside Terminal)
    function initTerminalMatrixRain() {
        const ctx = terminalMatrixCanvas.getContext('2d');
        
        function resizeTerminalCanvas() {
            terminalMatrixCanvas.width = terminalWindow.offsetWidth;
            terminalMatrixCanvas.height = terminalWindow.offsetHeight;
        }
        resizeTerminalCanvas();

        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
        const fontSize = 12;
        let columns, drops;

        function initDrops() {
            columns = Math.floor(terminalMatrixCanvas.width / fontSize);
            drops = Array(columns).fill(1);
        }
        initDrops();

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, terminalMatrixCanvas.width, terminalMatrixCanvas.height);

            ctx.fillStyle = '#00ff00';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > terminalMatrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(draw, 40);

        window.addEventListener('resize', () => {
            resizeTerminalCanvas();
            initDrops();
        });
    }

    // Real-time Clock
    function updateClock() {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour12: false });
        currentTimeElement.textContent = time;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Popup Modal System
    function showPopup(title, content, onConfirm = null, onCancel = null) {
        document.getElementById('popupTitle').textContent = title;
        document.getElementById('popupContent').innerHTML = content;
        
        const confirmBtn = document.getElementById('popupConfirm');
        const cancelBtn = document.getElementById('popupCancel');
        const closeBtn = document.getElementById('popupClose');

        if (onConfirm) {
            confirmBtn.style.display = 'inline-block';
            confirmBtn.onclick = () => {
                hidePopup();
                onConfirm();
            };
        } else {
            confirmBtn.style.display = 'none';
        }

        if (onCancel) {
            cancelBtn.style.display = 'inline-block';
            cancelBtn.onclick = () => {
                hidePopup();
                onCancel();
            };
        } else {
            cancelBtn.style.display = 'none';
        }

        closeBtn.onclick = hidePopup;
        popupOverlay.classList.add('active');
    }

    function hidePopup() {
        popupOverlay.classList.remove('active');
    }

    // Sound simulation (visual feedback only)
    function playTypingSound() {
        // Visual feedback for typing sound
        terminalWindow.style.boxShadow = '0 0 40px rgba(0, 255, 255, 0.3)';
        setTimeout(() => {
            terminalWindow.style.boxShadow = '';
        }, 50);
    }

    const bootSequence = `
<div class="text-white">WELCOME TO VIVEK_YADAV TERMINAL v2.0.0</div>
<div class="text-white">========================================</div>
<br>
<div class="text-magenta">[ SYSTEM INITIALIZATION ]</div>
<div class="text-cyan">Loading kernel modules...</div>
<div class="text-cyan">Initializing display driver...</div>
<div class="text-cyan">Mounting filesystem...</div>
<div class="text-green">✓ System ready</div>
<br>
<div class="text-magenta">[ VIVEK RAHAGIR SYSTEM -- v2.0.0 ]</div>
<div class="text-cyan">========================================</div>
<div class="text-cyan">SYSTEM: <span class="text-magenta">VivekRahagir v.2.0.0</span></div>
<div class="text-cyan">STATUS: <span class="text-green">Operational</span></div>
<div class="text-cyan">DESCRIPTION: <span class="text-magenta">Full-Stack Web Developer</span> & Products Thinker powered by modern web technologies.</div>
<br>
<div class="text-cyan">ENGINEERING STACK:</div>
<div class="text-cyan">- Core: JavaScript (ES6+)</div>
<div class="text-cyan">- Backend: Node.js / Laravel / PHP</div>
<div class="text-cyan">- Frontend: React.js / HTML5 / CSS3</div>
<div class="text-cyan">- Tools: Git / Firebase / MongoDB</div>
<br>
<div class="text-cyan">CORE CAPABILITIES:</div>
<div class="text-cyan">- Scalable Web Applications</div>
<div class="text-cyan">- Real-time Systems</div>
<div class="text-cyan">- Social Impact Products</div>
<div class="text-cyan">- Cross-platform PWA support</div>
<br>
`;

    let isTyping = false;
    let outputQueue = [];
    let commandHistory = [];
    let historyIndex = -1;
    let currentDirectory = '~';
    
    // Achievement System
    const achievements = {
        'first_command': { name: 'First Steps', description: 'Execute your first command', unlocked: false, icon: '🎯' },
        'explorer': { name: 'Explorer', description: 'Use 5 different commands', unlocked: false, icon: '🧭', progress: 0, required: 5 },
        'file_navigator': { name: 'File Navigator', description: 'Navigate through the file system', unlocked: false, icon: '📁' },
        'joke_master': { name: 'Joke Master', description: 'Tell 3 jokes', unlocked: false, icon: '😂', progress: 0, required: 3 },
        'social_butterfly': { name: 'Social Butterfly', description: 'Open GitHub and LinkedIn', unlocked: false, icon: '🦋' },
        'command_master': { name: 'Command Master', description: 'Use 10 different commands', unlocked: false, icon: '🏆', progress: 0, required: 10 },
        'file_reader': { name: 'File Reader', description: 'Read 3 files with cat command', unlocked: false, icon: '📖', progress: 0, required: 3 },
        'directory_master': { name: 'Directory Master', description: 'List directory contents 5 times', unlocked: false, icon: '🗂️', progress: 0, required: 5 }
    };
    
    let usedCommands = new Set();
    let jokesTold = 0;
    let filesRead = 0;
    let directoryLists = 0;
    let githubOpened = false;
    let linkedinOpened = false;
    
    // Virtual File System
    const fileSystem = {
        '~': {
            type: 'dir',
            contents: {
                'projects': {
                    type: 'dir',
                    contents: {
                        'cognitoattend.txt': {
                            type: 'file',
                            content: 'CognitoAttend - Cognitive Attendance System\n========================================\n\nDescription:\nA cognitive attendance system designed for smart, frictionless tracking.\n\nTechnology Stack:\n- Frontend: React.js, Redux, Material-UI\n- Backend: Node.js, Express.js\n- Database: MongoDB with Mongoose\n- Authentication: JWT, OAuth 2.0\n- Real-time: Socket.io for live updates\n\nKey Features:\n- Biometric fingerprint integration\n- Real-time attendance tracking\n- Automated report generation\n- Multi-location support\n- Mobile-responsive dashboard\n- Email/SMS notifications\n- Export to PDF/Excel\n- Admin analytics dashboard\n\nAchievements:\n- Reduced manual attendance time by 90%\n- Implemented for 500+ students\n- 99.9% uptime reliability\n\nGitHub: github.com/vivek-rahagir07/cognitoattend'
                        },
                        'neostream.txt': {
                            type: 'file',
                            content: 'NeoMusic - Music Platform\n===========================\n\nDescription:\nA music website built specifically to deliver a great, immersive experience in music listening.\n\nTechnology Stack:\n- Frontend: React.js, Next.js 14\n- Audio: Web Audio API, Howler.js\n- Backend: Node.js, Express\n- Database: PostgreSQL, Redis\n- Streaming: HLS, DASH protocols\n- Cloud: AWS S3, CloudFront CDN\n\nKey Features:\n- AI-powered music recommendations\n- Real-time audio visualization\n- Offline mode support\n- Social sharing and playlists\n- High-quality audio streaming (320kbps)\n- Cross-platform support (Web, Mobile)\n- Artist profiles and analytics\n- Podcast integration\n\nPerformance Metrics:\n- <100ms audio latency\n- 99.95% uptime\n- Support for 10,000+ concurrent users\n- 500K+ songs in library\n\nGitHub: github.com/vivek-rahagir07/neostream'
                        },
                        'neoride.txt': {
                            type: 'file',
                            content: 'NeoRide - UI Graphics Experiment Game\n===============================\n\nDescription:\nA game made purely for enjoyment to test the limits of what I could build with UI elements alone, without using any graphics.\n\nTechnology Stack:\n- Frontend: React Native, React.js\n- Backend: Node.js, GraphQL\n- Database: MongoDB, PostgreSQL\n- Maps: Google Maps API, Mapbox\n- Payments: Stripe, Razorpay\n- IoT: GPS tracking integration\n- Real-time: Socket.io, Firebase\n\nKey Features:\n- Real-time bike availability tracking\n- GPS-based fleet management\n- Smart lock integration\n- Mobile app for users\n- Admin dashboard for fleet operators\n- Dynamic pricing based on demand\n- Route optimization\n- Maintenance scheduling\n- User ratings and reviews\n\nBusiness Impact:\n- 50% reduction in operational costs\n- 95% fleet utilization rate\n- 10,000+ monthly active users\n- 200+ bikes in fleet\n- 24/7 customer support\n\nGitHub: github.com/vivek-rahagir07/neoride'
                        },
                        'starcadet.txt': {
                            type: 'file',
                            content: 'Star Cadet - Educational Game\n==============================\n\nDescription:\nInteractive educational game platform for cadets with gamified learning modules and progress tracking.\n\nTechnology Stack:\n- Frontend: JavaScript, HTML5 Canvas\n- Game Engine: Custom Canvas-based engine\n- Backend: Node.js, Express\n- Database: MongoDB\n- Real-time: Socket.io\n- Authentication: JWT\n\nKey Features:\n- Gamified learning modules\n- Real-time multiplayer challenges\n- Progress tracking and analytics\n- Leaderboards and achievements\n- Interactive quizzes and puzzles\n- Story-based missions\n- Character customization\n- Parent/teacher dashboard\n\nEducational Impact:\n- 85% improvement in engagement\n- 200+ learning modules\n- 5,000+ student users\n- 40+ educational institutions\n- STEM-focused curriculum\n\nGitHub: github.com/vivek-rahagir07/starcadet'
                        }
                    }
                },
                'skills': {
                    type: 'dir',
                    contents: {
                        'frontend.txt': {
                            type: 'file',
                            content: 'Frontend Development Skills\n===========================\n\nFrameworks & Libraries:\n- React.js (Hooks, Context, Redux)\n- Next.js (SSR, SSG, API Routes)\n- Vue.js (Composition API, Pinia)\n- Angular (Services, RxJS)\n\nCore Technologies:\n- HTML5 (Semantic, Canvas, WebSockets)\n- CSS3 (Flexbox, Grid, Animations)\n- JavaScript (ES6+, Async/Await, DOM)\n- TypeScript (Interfaces, Generics, Decorators)\n\nStyling Solutions:\n- TailwindCSS (Utility-first, Custom config)\n- SCSS/SASS (Variables, Mixins, Nesting)\n- CSS-in-JS (Styled Components, Emotion)\n- Bootstrap, Material-UI, Chakra UI\n\nGraphics & Animation:\n- Three.js (3D scenes, WebGL)\n- GSAP (Complex animations)\n- Framer Motion (React animations)\n- Canvas API (2D graphics)\n- SVG animations\n\nPerformance Optimization:\n- Code splitting & lazy loading\n- Image optimization (WebP, AVIF)\n- Bundle size reduction\n- Core Web Vitals optimization\n- Service Workers & PWA\n\nTools & Workflow:\n- Webpack, Vite, Parcel\n- ESLint, Prettier\n- Jest, Cypress, Testing Library\n- Git, GitHub Actions\n- Docker for development'
                        },
                        'backend.txt': {
                            type: 'file',
                            content: 'Backend Development Skills\n===========================\n\nNode.js Ecosystem:\n- Express.js (REST APIs, Middleware)\n- NestJS (Enterprise architecture)\n- Koa.js (Lightweight framework)\n- Socket.io (Real-time communication)\n- GraphQL (Apollo Server, Subscriptions)\n\nPHP Ecosystem:\n- Laravel (MVC, Eloquent, Queues)\n- Lumen (Microservices)\n- Native PHP (OOP, Design Patterns)\n- Composer (Package management)\n\nArchitecture Patterns:\n- RESTful APIs\n- GraphQL APIs\n- Microservices\n- Serverless (AWS Lambda)\n- Event-driven architecture\n- CQRS pattern\n\nDatabases:\n- MongoDB (Aggregation, Indexing)\n- PostgreSQL (Complex queries, JSONB)\n- MySQL (Optimization, Replication)\n- Redis (Caching, Pub/Sub)\n- Firebase Firestore\n\nAuthentication & Security:\n- JWT (Access/Refresh tokens)\n- OAuth 2.0 (Google, GitHub)\n- Session management\n- Rate limiting\n- Input validation\n- SQL injection prevention\n- XSS protection\n\nDevOps & Deployment:\n- Docker (Containers, Compose)\n- Kubernetes (Orchestration)\n- AWS (EC2, S3, RDS, Lambda)\n- CI/CD (GitHub Actions, Jenkins)\n- Nginx (Reverse proxy, Load balancing)\n- PM2 (Process management)\n\nAPI Documentation:\n- Swagger/OpenAPI\n- Postman collections\n- API versioning\n- Rate limiting documentation'
                        },
                        'database.txt': {
                            type: 'file',
                            content: 'Database Management Skills\n===========================\n\nNoSQL Databases:\n- MongoDB\n  - Schema design and modeling\n  - Aggregation pipelines\n  - Indexing strategies\n  - Sharding and replication\n  - Mongoose ODM\n  - Performance tuning\n  - Transactions\n\n- Firebase Firestore\n  - Real-time listeners\n  - Offline support\n  - Security rules\n  - Cloud Functions\n  - Analytics integration\n\nRelational Databases:\n- PostgreSQL\n  - Complex queries and joins\n  - JSONB data types\n  - Stored procedures\n  - Triggers and functions\n  - Full-text search\n  - Partitioning\n  - Connection pooling\n\n- MySQL\n  - Query optimization\n  - Index design\n  - Replication setup\n  - Backup strategies\n  - Performance monitoring\n  - MyISAM vs InnoDB\n\nCaching Solutions:\n- Redis\n  - Data structures (Strings, Lists, Sets)\n  - Pub/Sub messaging\n  - Caching strategies\n  - Session storage\n  - Rate limiting\n  - Leaderboards\n\n- Memcached\n  - Distributed caching\n  - Memory optimization\n\nDatabase Design:\n- Normalization (1NF, 2NF, 3NF)\n- Denormalization for performance\n- ER modeling\n- Data migration strategies\n- Backup and recovery\n- Data integrity constraints\n\nORM & Query Builders:\n- Mongoose (MongoDB)\n- Sequelize (SQL)\n- TypeORM (TypeScript)\n- Prisma (Modern ORM)\n- Knex.js (Query builder)'
                        },
                        'devops.txt': {
                            type: 'file',
                            content: 'DevOps & Infrastructure Skills\n================================\n\nVersion Control:\n- Git (Branching, Merging, Rebase)\n- GitHub (PRs, Actions, Issues)\n- GitLab (CI/CD, Registry)\n- Bitbucket (Pipelines)\n- Git flow workflows\n\nContainerization:\n- Docker\n  - Dockerfiles optimization\n  - Docker Compose\n  - Multi-stage builds\n  - Container orchestration\n  - Image registry\n\n- Kubernetes\n  - Pods, Services, Deployments\n  - Helm charts\n  - ConfigMaps, Secrets\n  - Ingress controllers\n  - Horizontal Pod Autoscaling\n\nCloud Platforms:\n- AWS\n  - EC2, S3, RDS, Lambda\n  - CloudFront, Route 53\n  - VPC, Security Groups\n  - IAM policies\n  - CloudWatch monitoring\n\n- Google Cloud\n  - Compute Engine, Cloud Storage\n  - Cloud Functions\n  - Firebase services\n\nCI/CD Pipelines:\n- GitHub Actions\n  - Workflow automation\n  - Self-hosted runners\n  - Matrix builds\n  - Artifact caching\n\n- Jenkins\n  - Pipeline as code\n  - Plugin ecosystem\n  - Distributed builds\n\nMonitoring & Logging:\n- Prometheus (Metrics collection)\n- Grafana (Visualization)\n- ELK Stack (Logging)\n- Datadog (APM)\n- New Relic (Performance)\n\nInfrastructure as Code:\n- Terraform\n  - Resource management\n  - State handling\n  - Modules and workspaces\n\n- Ansible\n  - Configuration management\n  - Playbooks and roles'
                        }
                    }
                },
                'about.txt': {
                    type: 'file',
                    content: 'About Vivek Yadav\n================\n\nIdentity:\nName: Vivek Yadav\nAlias: Rahagir\nRole: Full-Stack Developer & Products Thinker\nLocation: India\nAvailability: Remote Worldwide\n\nPhilosophy:\n"Building real systems under real constraints"\n\nI believe in creating practical solutions that solve real problems. My work sits at the intersection of:\n- Web Engineering\n- Seamless UI/UX\n- Human-Centric Design\n- Scalable Architecture\n\nExperience:\n- 3+ years in full-stack development\n- Built 15+ production applications\n- Worked with startups and enterprises\n- Led teams of 3-5 developers\n- Contributed to open-source projects\n\nCore Values:\n- Quality over speed\n- User-centric approach\n- Continuous learning\n- Clean code practices\n- Collaborative mindset\n\nInterests:\n- Internet of Things (IoT)\n- Computer Vision & AI\n- Real-time systems\n- Progressive Web Apps\n- Open-source contribution\n\nEducation:\n- Bachelor of Technology in Computer Science\n- Multiple certifications in cloud and web technologies\n- Continuous self-learning through online courses\n\nLanguages:\n- English (Professional)\n- Hindi (Native)\n- JavaScript (Fluent)\n- Python (Intermediate)\n\nContact:\nEmail: vivekhr36.2007@gmail.com\nGitHub: github.com/vivek-rahagir07\nLinkedIn: linkedin.com/in/vivek-yadav-1142213a0'
                },
                'contact.txt': {
                    type: 'file',
                    content: 'Contact Information\n==================\n\nPrimary Contact:\nEmail: vivekhr36.2007@gmail.com\nResponse Time: Within 24 hours\n\nProfessional Profiles:\nGitHub: github.com/vivek-rahagir07\n- 50+ repositories\n- 1000+ contributions\n- Active in open-source\n\nLinkedIn: linkedin.com/in/vivek-yadav-1142213a0\n- 500+ connections\n- Endorsements in web technologies\n- Professional network\n\nTwitter: @vivek_rahagir\n- Tech tweets and insights\n- Community engagement\n\nLocation & Availability:\nLocation: India\nTimezone: IST (UTC+5:30)\nAvailability: Remote Worldwide\nHours: Flexible (40h/week)\n\nServices Offered:\n- Full-stack web development\n- API design and implementation\n- Database architecture\n- UI/UX consultation\n- Technical mentoring\n- Code review and optimization\n\nProject Types:\n- SaaS applications\n- E-commerce platforms\n- Real-time systems\n- Progressive Web Apps\n- IoT integrations\n- Educational platforms\n\nCollaboration Preferences:\n- Agile methodology\n- Git-based workflow\n- Regular communication\n- Documentation-first approach\n- Code review culture\n\nRates:\n- Project-based: Negotiable\n- Hourly: $25-50/hour\n- Open to equity partnerships for startups\n\nResponse Policy:\n- Initial response: Within 24 hours\n- Project quotes: Within 3 business days\n- Emergency support: Available for retainer clients'
                },
                'readme.txt': {
                    type: 'file',
                    content: 'Vivek Yadav Terminal v2.0.0\n==============================\n\nWelcome to the interactive terminal portfolio!\n\nGetting Started:\nType "help" to see all available commands\nUse arrow keys (↑/↓) to navigate command history\nTab completion coming soon!\n\nAvailable Commands:\n\nNavigation:\n- help: Show all available commands\n- ls: List files in current directory\n- cd [dir]: Change directory (supports ".." for parent)\n- cat [file]: Display file contents\n- clear: Clear the terminal output\n- home: Return to main homepage\n\nInformation:\n- about: Display developer information\n- skills: View technical expertise\n- projects: Explore featured case studies\n- contact: Get contact information\n- devguide: Developer playbook documentation\n- gallery: Photo gallery and memories\n- iot: Internet of Things projects\n\nSocial & External:\n- github: Open GitHub profile in new tab\n- linkedin: Open LinkedIn profile in new tab\n\nFun & Entertainment:\n- joke: Tell a random developer joke\n\nNavigation:\n- nav: Interactive navigation menu\n\nAchievement System:\nUnlock badges by using commands:\n- 🎯 First Steps: Execute your first command\n- 🧭 Explorer: Use 5 different commands\n- 📁 File Navigator: Navigate the file system\n- 😂 Joke Master: Tell 3 jokes\n- 🦋 Social Butterfly: Open GitHub & LinkedIn\n- 🏆 Command Master: Use 10 different commands\n- 📖 File Reader: Read 3 files with cat\n- 🗂️ Directory Master: List directory 5 times\n\nEaster Eggs:\n- Konami Code: ↑↑↓↓←→←→BA\n- More secrets to discover!\n\nTips:\n- Use "cd projects" to explore project files\n- "cat readme.txt" for detailed information\n- "cd skills && ls" to view skill categories\n- Try "cd .." to go back to parent directory\n\nVersion History:\nv2.0.0 - Added achievements, file system, new commands\nv1.0.0 - Initial terminal implementation\n\nBuilt with:\n- Vanilla JavaScript\n- HTML5 Canvas for matrix rain\n- CSS3 animations\n- No external dependencies\n\n© 2026 Vivek Yadav - Built with ❤️'
                }
            }
        }
    };

    function scrollToBottom() {
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function getDirectory(path) {
        if (path === '~') return fileSystem['~'];
        const parts = path.replace('~/', '').split('/');
        let current = fileSystem['~'];
        for (const part of parts) {
            if (current && current.contents && current.contents[part]) {
                current = current.contents[part];
            } else {
                return null;
            }
        }
        return current;
    }

    function unlockAchievement(key) {
        if (achievements[key] && !achievements[key].unlocked) {
            achievements[key].unlocked = true;
            appendOutput(`
<div class="achievement-unlock">
    <div class="achievement-icon">${achievements[key].icon}</div>
    <div class="achievement-text">
        <div class="achievement-title">🏆 Achievement Unlocked!</div>
        <div class="achievement-name">${achievements[key].name}</div>
        <div class="achievement-desc">${achievements[key].description}</div>
    </div>
</div>
            `);
        }
    }

    function updateAchievementProgress(key, increment = 1) {
        if (achievements[key] && !achievements[key].unlocked) {
            achievements[key].progress = (achievements[key].progress || 0) + increment;
            if (achievements[key].progress >= achievements[key].required) {
                unlockAchievement(key);
            }
        }
    }

    function typeHTML(html, container, speed, callback) {
        container.innerHTML = html;
        const textNodes = [];
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while(node = walker.nextNode()) {
            if (node.nodeValue.trim() !== '') {
                textNodes.push({
                    node: node,
                    words: node.nodeValue.split(/(\s+)/)
                });
                node.nodeValue = ''; 
            }
        }
        
        let nodeIndex = 0;
        let wordIndex = 0;
        
        function typeNextWord() {
            if (nodeIndex >= textNodes.length) {
                if (callback) callback();
                return;
            }
            
            let currentNode = textNodes[nodeIndex];
            if (wordIndex < currentNode.words.length) {
                const word = currentNode.words[wordIndex];
                currentNode.node.nodeValue += word;
                wordIndex++;
                scrollToBottom();
                playTypingSound();
                
                if (word.trim() === '') {
                    typeNextWord();
                } else {
                    setTimeout(typeNextWord, speed);
                }
            } else {
                nodeIndex++;
                wordIndex = 0;
                typeNextWord();
            }
        }
        
        typeNextWord();
    }

    function processQueue() {
        if (isTyping || outputQueue.length === 0) return;
        isTyping = true;
        
        const html = outputQueue.shift();
        const div = document.createElement("div");
        terminalBody.appendChild(div);
        
        typeHTML(html, div, 50, () => {
            isTyping = false;
            processQueue();
        });
    }

    function appendOutput(html) {
        outputQueue.push(html);
        processQueue();
    }

    function printPrompt(command = "") {
        const div = document.createElement("div");
        div.innerHTML = `<span class="prompt">guest@vivek-rahagir:~$</span> <span class="text-white">${command}</span>`;
        terminalBody.appendChild(div);
    }

    function processCommand(cmd) {
        const normalizedCmd = cmd.trim().toLowerCase();
        
        if (normalizedCmd === "") return;
        
        // Track first command achievement
        if (usedCommands.size === 0) {
            unlockAchievement('first_command');
        }
        
        // Track command usage for achievements
        usedCommands.add(normalizedCmd);
        updateAchievementProgress('explorer');
        updateAchievementProgress('command_master');
        
        switch (normalizedCmd) {
            case "help":
                appendOutput(`
<div class="text-cyan">Available commands:</div>
<div class="text-white">  about        <span class="text-cyan">- Display information about Vivek Yadav</span></div>
<div class="text-white">  about developer <span class="text-cyan">- Deep dive into developer details</span></div>
<div class="text-white">  skills       <span class="text-cyan">- View technical skills & expertise</span></div>
<div class="text-white">  projects     <span class="text-cyan">- Explore recent works and projects</span></div>
<div class="text-white">  gallery      <span class="text-cyan">- View photo gallery and memories</span></div>
<div class="text-white">  iot          <span class="text-cyan">- Internet of Things projects</span></div>
<div class="text-white">  devguide     <span class="text-cyan">- Developer Guide and documentation</span></div>
<div class="text-white">  contact      <span class="text-cyan">- Get my contact information</span></div>
<div class="text-white">  nav          <span class="text-cyan">- Navigate to different pages of the portfolio</span></div>
<div class="text-white">  clear        <span class="text-cyan">- Clear the terminal output</span></div>
<div class="text-white">  home         <span class="text-cyan">- Go back to the main homepage</span></div>
<div class="text-white">  github       <span class="text-cyan">- Open GitHub profile</span></div>
<div class="text-white">  linkedin     <span class="text-cyan">- Open LinkedIn profile</span></div>
<div class="text-white">  joke         <span class="text-cyan">- Tell a random developer joke</span></div>
<div class="text-white">  ls           <span class="text-cyan">- List files in current directory</span></div>
<div class="text-white">  cd           <span class="text-cyan">- Change directory</span></div>
<div class="text-white">  cat          <span class="text-cyan">- Display file contents</span></div>
                `);
                break;
            case "about":
            case "about developer":
                appendOutput(`
<pre class="ascii-art">
   __  __                     _       _ 
  |  \/  | ___ _ __  ___  ___| |__   | |
  | |\/| |/ _ \ '_ \/ __|/ __| '_ \  | |
  | |  | |  __/ | | \__ \ (__| | | | |_|
  |_|  |_|\___|_| |_|___/\___|_| |_|_(_)
</pre>
<div class="dev-image-container">
    <img src="photos/vivek.png" alt="Vivek Yadav" class="dev-image">
</div>
<div class="text-cyan dev-desc">
    Vivek Yadav aka <span class="text-magenta">Rahagir</span>, is a self-driven <span class="text-green">full-stack developer</span> and products thinker who believes in building real systems under real constraints. His work sits at the intersection of web engineering, seamless UI/UX, and <span class="text-green">human-centric design</span>.
</div>
                `);
                break;
            case "skills":
                appendOutput(`
<pre class="ascii-art">
   _____ _       _ _____ _____ _____ 
  |     |_|___ _|_|     |   __|_   _|
  | | | | |   | | |  |  |__   | |  
  |_|_|_|_|_|_|_|_|_____|_____| |_|
</pre>
<div class="text-cyan">=========================================</div>
<div class="text-cyan">          TECHNICAL EXPERTISE            </div>
<div class="text-cyan">=========================================</div>
<br>
<div class="text-white"><span class="text-magenta">[Frontend Architecture]</span></div>
<div class="text-white">  - Frameworks: React.js, Next.js, HTML5, CSS3</div>
<div class="text-white">  - Styling: TailwindCSS, SCSS, Framer Motion</div>
<div class="text-white">  - Visuals: Three.js (3D graphics), WebGL, Canvas API</div>
<br>
<div class="text-white"><span class="text-magenta">[Backend & Infrastructure]</span></div>
<div class="text-white">  - Environments: Node.js, Express, Python</div>
<div class="text-white">  - PHP Ecosystem: Laravel, Native PHP</div>
<div class="text-white">  - Architecture: RESTful APIs, Microservices, Serverless</div>
<br>
<div class="text-white"><span class="text-magenta">[Database Systems]</span></div>
<div class="text-white">  - NoSQL: MongoDB (Mongoose, Aggregation Pipelines), Firebase Firestore</div>
<div class="text-white">  - Relational: PostgreSQL, MySQL</div>
<br>
<div class="text-white"><span class="text-magenta">[DevOps & Tooling]</span></div>
<div class="text-white">  - Version Control: Git, GitHub Actions (CI/CD)</div>
<div class="text-white">  - Deployment: AWS, Docker, Vercel, Firebase Hosting</div>
<div class="text-white">  - UI/UX: Figma, Adobe XD</div>
<br>
<div class="command-help">Type 'nav' and click '/skills' for the interactive visual timeline.</div>
                `);
                break;
            case "projects":
                appendOutput(`
<pre class="ascii-art">
   _____  _____ _____ _____ _____    ___ 
  | __  ||  _  |  ___|  _  |   __|  |   |
  |    -|     |     |   __|__   |  |   |
  |__|__|__|__|_____|__|  |_____|  |___|
</pre>
<div class="text-cyan">=========================================</div>
<div class="text-cyan">         FEATURED CASE STUDIES           </div>
<div class="text-cyan">=========================================</div>
<br>
<div class="text-white"><span class="text-green">1. CognitoAttend [Smart Attendance]</span></div>
<div class="text-white">   A cognitive attendance system designed for smart, frictionless tracking.</div>
<div class="text-white">   - Stack: React, Node.js, MongoDB.</div>
<br>
<div class="text-white"><span class="text-green">2. NeoMusic [Music Platform]</span></div>
<div class="text-white">   A music website built specifically to deliver a great, immersive experience in music listening.</div>
<div class="text-white">   - Stack: React, Next.js, Web Audio API.</div>
<br>
<div class="text-white"><span class="text-green">3. NeoRide [Bike Rental]</span></div>
<div class="text-white">   A game made purely for enjoyment to test the limits of what I could build with UI elements alone, without using any graphics.</div>
<div class="text-white">   - Stack: React, Node.js, MongoDB.</div>
<br>
<div class="text-white"><span class="text-green">4. Star Cadet [Educational Game]</span></div>
<div class="text-white">   Interactive educational game platform for cadets with gamified learning modules and progress tracking.</div>
<div class="text-white">   - Stack: JavaScript, Canvas API, Node.js.</div>
<br>
<div class="text-white"><span class="text-green">5. JhatpatSewa & Media Converter</span></div>
<div class="text-white">   Service marketplace (React/Laravel) and browser-based video converter (FFmpeg.wasm).</div>
<br>
<div class="command-help">Type 'nav' and click '/projects' to view live demos and source code.</div>
                `);
                break;
            case "gallery":
                appendOutput(`
<div class="text-cyan">=========================================</div>
<div class="text-cyan">         MEMORIES & MILESTONES           </div>
<div class="text-cyan">=========================================</div>
<br>
<div class="text-white">Beyond the code, this gallery is a collection of my journey in tech.</div>
<div class="text-white">It features photos from:</div>
<div class="text-white">  - <span class="text-magenta">Hackathons:</span> 48-hour coding sprints and team victories.</div>
<div class="text-white">  - <span class="text-magenta">Tech Meetups:</span> Networking, giving talks, and community building.</div>
<div class="text-white">  - <span class="text-magenta">Workspace Setups:</span> The evolution of my battle station over the years.</div>
<div class="text-white">  - <span class="text-magenta">Conferences:</span> Insights from global developer summits.</div>
<br>
<div class="command-help">Type 'nav' and click '/gallery' to visually explore my journey.</div>
                `);
                break;
            case "iot":
                appendOutput(`
<div class="text-cyan">=========================================</div>
<div class="text-cyan">         INTERNET OF THINGS (IoT)        </div>
<div class="text-cyan">=========================================</div>
<br>
<div class="text-white">Beyond the screen, IoT and robotics are my ultimate playground. I thrive on bringing code into the physical world.</div>
<br>
<div class="text-white"><span class="text-green">Key Project: AI Based Traffic Light System</span></div>
<div class="text-white">  An intelligent traffic management system leveraging computer vision.</div>
<div class="text-white">  It replaces static timers with dynamic, real-time vehicle counting to optimize lane flow.</div>
<br>
<div class="text-white"><span class="text-magenta">[Hardware Architecture]</span></div>
<div class="text-white">  - Raspberry Pi + Camera Module + Custom Breadboard Logic</div>
<div class="text-white"><span class="text-magenta">[YOLOv8 Computer Vision]</span></div>
<div class="text-white">  - Real-time classification tracking cars, buses, trucks, and bikes</div>
<div class="text-white"><span class="text-magenta">[Adaptive Signal Control]</span></div>
<div class="text-white">  - Green-time algorithm dynamically adjusting to active lane density</div>
<br>
<div class="command-help">Type 'nav' and click '/iot' to dive into hardware specs.</div>
                `);
                break;
            case "devguide":
            case "dev guide":
                appendOutput(`
<div class="text-cyan">=========================================</div>
<div class="text-cyan">         DEVELOPER PLAYBOOK              </div>
<div class="text-cyan">=========================================</div>
<br>
<div class="text-white">This is my personal documentation and philosophy on software engineering.</div>
<br>
<div class="text-white">Topics covered include:</div>
<div class="text-white">  - <span class="text-magenta">Clean Code:</span> Naming conventions, SOLID principles, and refactoring techniques.</div>
<div class="text-white">  - <span class="text-magenta">Architecture:</span> Decoupling logic, component design, state management strategies.</div>
<div class="text-white">  - <span class="text-magenta">Performance:</span> Optimizing Core Web Vitals, memory leak debugging, caching.</div>
<div class="text-white">  - <span class="text-magenta">Workflow:</span> My exact VSCode setup, extensions, terminal aliases, and git flows.</div>
<br>
<div class="command-help">Type 'nav' and click '/devguide' to read the full manifesto.</div>
                `);
                break;
            case "contact":
                appendOutput(`
<pre class="ascii-art">
   _____ _      _   ___ _   _ 
  |     |_|___| |_|  _|_| |_| |
  | | | | |   | | |  _| | .  |
  |_|_|_|_|_|_|_|_|_| |_|___|
</pre>
<div class="text-cyan">=========================================</div>
<div class="text-cyan">         COMMUNICATION CHANNELS          </div>
<div class="text-cyan">=========================================</div>
<br>
<div class="text-white">I am always open to discussing new projects, creative ideas, or opportunities to be part of your visions.</div>
<br>
<div class="text-white"><span class="text-magenta">Email:</span>      vivekhr36.2007@gmail.com</div>
<div class="text-white"><span class="text-magenta">GitHub:</span>     <a href="https://github.com/vivek-rahagir07" target="_blank" style="color:#00ffff;text-decoration:none;">github.com/vivek-rahagir07</a></div>
<div class="text-white"><span class="text-magenta">LinkedIn:</span>   <a href="https://linkedin.com/in/vivek-yadav-1142213a0/" target="_blank" style="color:#00ffff;text-decoration:none;">linkedin.com/in/vivek-yadav-1142213a0</a></div>
<div class="text-white"><span class="text-magenta">Location:</span>   India (Available for Remote Worldwide)</div>
<br>
<div class="text-white">"Building real systems under real constraints."</div>
<br>
<div class="command-help">Type 'nav' and click '/contact' for the direct contact form.</div>
                `);
                break;
            case "nav":
                appendOutput(`
<div class="text-cyan">Select a destination to navigate:</div>
<div class="nav-links-grid">
    <div class="nav-item" onclick="window.location.href='index.html'"><span class="text-white">/home</span> - Main Page</div>
    <div class="nav-item" onclick="window.location.href='about.html'"><span class="text-white">/about</span> - About Me</div>
    <div class="nav-item" onclick="window.location.href='skills.html'"><span class="text-white">/skills</span> - My Skills</div>
    <div class="nav-item" onclick="window.location.href='projects.html'"><span class="text-white">/projects</span> - Works</div>
    <div class="nav-item" onclick="window.location.href='gallery.html'"><span class="text-white">/gallery</span> - Photo Gallery</div>
    <div class="nav-item" onclick="window.location.href='contact.html'"><span class="text-white">/contact</span> - Reach Out</div>
</div>
<div class="command-help">You can also type 'home' to quickly return to index.</div>
                `);
                break;
            case "clear":
                terminalBody.innerHTML = "";
                break;
            case "home":
                window.location.href = "index.html";
                break;
            case "github":
                appendOutput(`
<div class="text-cyan">Opening GitHub profile...</div>
<div class="text-white">Redirecting to: <a href="https://github.com/vivek-rahagir07" target="_blank" style="color:#00ffff;text-decoration:none;">github.com/vivek-rahagir07</a></div>
                `);
                githubOpened = true;
                if (githubOpened && linkedinOpened) {
                    unlockAchievement('social_butterfly');
                }
                setTimeout(() => {
                    window.open('https://github.com/vivek-rahagir07', '_blank');
                }, 1000);
                break;
            case "linkedin":
                appendOutput(`
<div class="text-cyan">Opening LinkedIn profile...</div>
<div class="text-white">Redirecting to: <a href="https://linkedin.com/in/vivek-yadav-1142213a0/" target="_blank" style="color:#00ffff;text-decoration:none;">linkedin.com/in/vivek-yadav-1142213a0</a></div>
                `);
                linkedinOpened = true;
                if (githubOpened && linkedinOpened) {
                    unlockAchievement('social_butterfly');
                }
                setTimeout(() => {
                    window.open('https://linkedin.com/in/vivek-yadav-1142213a0/', '_blank');
                }, 1000);
                break;
            case "joke":
                const jokes = [
                    "Why do programmers prefer dark mode? Because light attracts bugs!",
                    "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
                    "Why do Java developers wear glasses? Because they can't C#!",
                    "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
                    "A programmer goes to the store. His wife says 'Buy a loaf of bread, and if they have eggs, buy a dozen.' He returns with 13 loaves of bread.",
                    "Why do programmers always mix up Halloween and Christmas? Because Oct 31 = Dec 25!",
                    "What's a programmer's favorite hangout place? Foo Bar!",
                    "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
                    "How do you comfort a JavaScript bug? You console it!",
                    "What do you call a programmer from Finland? Nerdic!"
                ];
                const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
                appendOutput(`
<div class="text-cyan">😂 Developer Joke:</div>
<div class="text-white">${randomJoke}</div>
                `);
                jokesTold++;
                updateAchievementProgress('joke_master');
                break;
            case "ls":
                const currentDir = currentDirectory === '~' ? fileSystem['~'] : getDirectory(currentDirectory);
                if (currentDir && currentDir.type === 'dir') {
                    let output = '<div class="text-cyan">Contents of ' + currentDirectory + ':</div>';
                    for (const [name, item] of Object.entries(currentDir.contents)) {
                        const icon = item.type === 'dir' ? '📁' : '📄';
                        output += `<div class="text-white">${icon} ${name}</div>`;
                    }
                    appendOutput(output);
                    directoryLists++;
                    updateAchievementProgress('directory_master');
                } else {
                    appendOutput(`<div class="text-white">Error: Directory not found.</div>`);
                }
                break;
            case "cd":
                const targetDir = cmd.split(' ')[1] || '~';
                if (targetDir === '~' || targetDir === '') {
                    currentDirectory = '~';
                    appendOutput(`<div class="text-green">Changed to home directory (~)</div>`);
                } else if (targetDir === '..') {
                    if (currentDirectory !== '~') {
                        const parts = currentDirectory.split('/');
                        parts.pop();
                        currentDirectory = parts.join('/') || '~';
                        appendOutput(`<div class="text-green">Changed to ${currentDirectory}</div>`);
                        unlockAchievement('file_navigator');
                    } else {
                        appendOutput(`<div class="text-white">Already at root directory.</div>`);
                    }
                } else {
                    const parentDir = currentDirectory === '~' ? fileSystem['~'] : getDirectory(currentDirectory);
                    if (parentDir && parentDir.contents && parentDir.contents[targetDir]) {
                        if (parentDir.contents[targetDir].type === 'dir') {
                            currentDirectory = currentDirectory === '~' ? `~/${targetDir}` : `${currentDirectory}/${targetDir}`;
                            appendOutput(`<div class="text-green">Changed to ${currentDirectory}</div>`);
                            unlockAchievement('file_navigator');
                        } else {
                            appendOutput(`<div class="text-white">Error: ${targetDir} is not a directory.</div>`);
                        }
                    } else {
                        appendOutput(`<div class="text-white">Error: Directory ${targetDir} not found.</div>`);
                    }
                }
                break;
            case "cat":
                const fileName = cmd.split(' ')[1];
                if (!fileName) {
                    appendOutput(`<div class="text-white">Usage: cat [filename]</div>`);
                    break;
                }
                const dir = currentDirectory === '~' ? fileSystem['~'] : getDirectory(currentDirectory);
                if (dir && dir.contents && dir.contents[fileName]) {
                    if (dir.contents[fileName].type === 'file') {
                        const content = dir.contents[fileName].content.replace(/\n/g, '<br>');
                        appendOutput(`
<div class="text-cyan">Contents of ${fileName}:</div>
<div class="text-white">${content}</div>
                        `);
                        filesRead++;
                        updateAchievementProgress('file_reader');
                    } else {
                        appendOutput(`<div class="text-white">Error: ${fileName} is a directory, not a file.</div>`);
                    }
                } else {
                    appendOutput(`<div class="text-white">Error: File ${fileName} not found.</div>`);
                }
                break;
            default:
                appendOutput(`<div class="text-white">bash: ${cmd}: command not found. Type 'help' for available commands.</div>`);
                break;
        }
    }

    // Initialize features
    initMatrixRain();
    initTerminalMatrixRain();
    
    // Initialize boot sequence
    setTimeout(() => {
        appendOutput(bootSequence);
        appendOutput(`<div class="command-help">Type 'help' for commands...</div><br>`);
    }, 500);

    terminalInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !isTyping) {
            const command = terminalInput.value;
            if (command.trim()) {
                commandHistory.push(command);
                historyIndex = commandHistory.length;
            }
            printPrompt(command);
            processCommand(command);
            terminalInput.value = "";
            scrollToBottom();
        } else if (e.key === "Enter" && isTyping) {
            e.preventDefault();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                terminalInput.value = "";
            }
        }
    });

    // Window buttons functionality
    document.getElementById('closeBtn').addEventListener('click', () => {
        showPopup(
            '⚠️ SYSTEM SHUTDOWN',
            '<p>Are you sure you want to close the terminal?</p><p>This will redirect you to the homepage.</p>',
            () => {
                terminalWindow.style.animation = 'glitchText 0.3s infinite';
                terminalWindow.style.transform = 'scaleY(0.01) scaleX(1)';
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 400);
            }
        );
    });

    document.getElementById('minimizeBtn').addEventListener('click', () => {
        terminalWindow.classList.toggle('minimized');
        terminalWindow.classList.remove('maximized');
    });

    document.getElementById('maximizeBtn').addEventListener('click', () => {
        terminalWindow.classList.toggle('maximized');
        terminalWindow.classList.remove('minimized');
    });

    // Ensure input always has focus on click
    document.querySelector('.terminal-container').addEventListener('click', (e) => {
        if (!e.target.closest('.terminal-header') && !e.target.closest('.popup-modal')) {
            terminalInput.focus();
        }
    });

    // Easter egg: Konami code
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            showPopup(
                '🎮 KONAMI CODE ACTIVATED!',
                '<p class="success">CHEAT MODE ENABLED!</p><p>You found the secret easter egg!</p><p>+1000 points to your developer skills!</p>',
                () => {
                    appendOutput('<div class="text-magenta">🎮 Cheat mode enabled! You are now a legendary hacker!</div>');
                }
            );
        }
    });
});
