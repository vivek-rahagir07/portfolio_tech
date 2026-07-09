document.addEventListener("DOMContentLoaded", () => {
    const terminalBody = document.getElementById("terminal-body");
    const terminalInput = document.getElementById("terminal-input");

    const bootSequence = `
<div class="text-white">WELCOME TO VIVEK_YADAV TERMINAL v1.0.0</div>
<div class="text-white">-----------------------------------------</div>
<br>
<div class="text-magenta">[ VIVEK YADAV SYSTEM -- v1.0.0 ]</div>
<div class="text-cyan">-----------------------------------------</div>
<div class="text-cyan">SYSTEM: <span class="text-magenta">VivekYadav v.1.0.0</span></div>
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

    function scrollToBottom() {
        terminalBody.scrollTop = terminalBody.scrollHeight;
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
                
                if (word.trim() === '') {
                    typeNextWord(); // skip delay for whitespace
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
        
        // 50ms delay per word as requested
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
        div.innerHTML = `<span class="prompt">guest@vivekyadav:~$</span> <span class="text-white">${command}</span>`;
        terminalBody.appendChild(div);
    }

    function processCommand(cmd) {
        const normalizedCmd = cmd.trim().toLowerCase();
        
        if (normalizedCmd === "") return;
        
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
                `);
                break;
            case "about":
            case "about developer":
                appendOutput(`
<div class="dev-image-container">
    <img src="photos/image copy.png" alt="Vivek Yadav" class="dev-image">
</div>
<div class="text-cyan dev-desc">
    Vivek Yadav aka <span class="text-magenta">Rahagir</span>, is a self-driven <span class="text-green">full-stack developer</span> and products thinker who believes in building real systems under real constraints. His work sits at the intersection of web engineering, seamless UI/UX, and <span class="text-green">human-centric design</span>.
</div>
                `);
                break;
            case "skills":
                appendOutput(`
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
<div class="text-cyan">=========================================</div>
<div class="text-cyan">         FEATURED CASE STUDIES           </div>
<div class="text-cyan">=========================================</div>
<br>
<div class="text-white"><span class="text-green">1. CognitoAttend [Smart Attendance]</span></div>
<div class="text-white">   Full-stack attendance management platform with biometric integration, real-time tracking, and automated reporting.</div>
<div class="text-white">   - Stack: React, Node.js, MongoDB.</div>
<br>
<div class="text-white"><span class="text-green">2. NeoStream [Music Platform]</span></div>
<div class="text-white">   Modern music streaming service with personalized playlists and real-time audio processing.</div>
<div class="text-white">   - Stack: React, Next.js, Web Audio API.</div>
<br>
<div class="text-white"><span class="text-green">3. NeoRide [Bike Rental]</span></div>
<div class="text-white">   Modern bike rental and sharing platform with real-time availability tracking and fleet management.</div>
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
            default:
                appendOutput(`<div class="text-white">bash: ${cmd}: command not found. Type 'help' for available commands.</div>`);
                break;
        }
    }

    // Initialize boot sequence
    appendOutput(bootSequence);
    appendOutput(`<div class="command-help">Type 'help' for commands...</div><br>`);

    terminalInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !isTyping) {
            const command = terminalInput.value;
            printPrompt(command);
            processCommand(command);
            terminalInput.value = "";
            scrollToBottom();
        } else if (e.key === "Enter" && isTyping) {
            e.preventDefault(); // Prevent input while typing
        }
    });

    // Mac window buttons functionality
    const terminalWindow = document.querySelector('.terminal-window');
    
    document.querySelector('.btn.close').addEventListener('click', () => {
        // Shutdown animation
        terminalWindow.style.animation = 'glitchText 0.3s infinite';
        terminalWindow.style.transform = 'scaleY(0.01) scaleX(1)';
        setTimeout(() => {
            window.location.href = "index.html";
        }, 400);
    });

    document.querySelector('.btn.minimize').addEventListener('click', () => {
        terminalWindow.classList.toggle('minimized');
        terminalWindow.classList.remove('maximized');
    });

    document.querySelector('.btn.maximize').addEventListener('click', () => {
        terminalWindow.classList.toggle('maximized');
        terminalWindow.classList.remove('minimized');
    });

    // Ensure input always has focus on click, except when clicking the header
    document.querySelector('.terminal-container').addEventListener('click', (e) => {
        if (!e.target.closest('.terminal-header')) {
            terminalInput.focus();
        }
    });
});
