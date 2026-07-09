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
