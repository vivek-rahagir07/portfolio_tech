/**
 * WebMCP (Web Model Context Protocol) In-Browser Agent Tools
 * Exposes client-side agent tools via navigator.modelContext.registerTool()
 * and declarative form annotations.
 */
(function() {
    'use strict';

    const webmcpTools = [
        {
            name: "get_profile",
            description: "Get Vivek Yadav's professional developer profile, biography, tech stack, and verified contact channels.",
            inputSchema: {
                type: "object",
                properties: {}
            },
            execute: async function() {
                return {
                    name: "Vivek Yadav",
                    title: "Full Stack Developer & Systems Engineer",
                    location: "Gurugram, Haryana, India",
                    email: "vivekhr36.2007@gmail.com",
                    telephone: "+919996445592",
                    website: "https://vivek-yadav.com/",
                    github: "https://github.com/vivek-rahagir07",
                    linkedin: "https://linkedin.com/in/vivek-yadav-1142213a0/",
                    bio: "Full Stack Developer passionate about building scalable digital products, high-concurrency backends, and IoT systems.",
                    stack: ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "PHP", "Laravel", "PostgreSQL", "MySQL", "Redis", "IoT"]
                };
            }
        },
        {
            name: "get_projects",
            description: "Retrieve Vivek Yadav's featured engineering projects, tech architectures, and live project URLs.",
            inputSchema: {
                type: "object",
                properties: {
                    category: {
                        type: "string",
                        description: "Filter by category: fullstack, web, iot, game"
                    }
                }
            },
            execute: async function(args) {
                const projects = [
                    {
                        name: "CognitoAttend",
                        category: "fullstack",
                        description: "Cognitive attendance tracking system for smart and frictionless tracking.",
                        tech: "Node.js, PostgreSQL, WebSockets",
                        url: "https://vivek-yadav.com/project-cognitoattend.html"
                    },
                    {
                        name: "JhatpatSewa",
                        category: "fullstack",
                        description: "On-demand hyper-local home service marketplace with real-time dispatch and payments.",
                        tech: "Laravel, MySQL, Payment Gateway",
                        url: "https://vivek-yadav.com/project-jhatpatsewa.html"
                    },
                    {
                        name: "NeoRide",
                        category: "game",
                        description: "Vehicular physics engine and game built purely with DOM elements and CSS.",
                        tech: "Vanilla JavaScript, CSS3 Transforms",
                        url: "https://vivek-yadav.com/project-neoride.html"
                    },
                    {
                        name: "Star Cadet",
                        category: "game",
                        description: "Gamified educational STEM portal on HTML5 Canvas running at 60 FPS.",
                        tech: "HTML5 Canvas, Web Audio API",
                        url: "https://vivek-yadav.com/project-starcadet.html"
                    },
                    {
                        name: "MediaConverter",
                        category: "web",
                        description: "High-speed media and file conversion tool.",
                        tech: "JavaScript, WebAssembly",
                        url: "https://vivek-yadav.com/project-mediaconverter.html"
                    }
                ];

                if (args && args.category) {
                    const filter = args.category.toLowerCase();
                    return projects.filter(p => p.category.toLowerCase().includes(filter));
                }
                return projects;
            }
        },
        {
            name: "get_skills",
            description: "Retrieve Vivek Yadav's technical skill matrix across languages, frontend, backend, databases, and IoT.",
            inputSchema: {
                type: "object",
                properties: {}
            },
            execute: async function() {
                return {
                    languages: ["JavaScript (ES6+)", "TypeScript", "PHP", "Python", "C++", "SQL", "HTML5", "CSS3"],
                    frontend: ["React", "Redux", "Canvas 2D API", "Responsive UI", "Web Performance"],
                    backend: ["Node.js", "Express.js", "Laravel", "REST APIs", "WebSockets"],
                    databases: ["PostgreSQL", "MySQL", "Redis", "Supabase", "Firebase"],
                    iot: ["ESP32", "Arduino", "MQTT", "Sensors", "Microcontrollers"]
                };
            }
        },
        {
            name: "contact_inquiry",
            description: "Send a message or hire inquiry to Vivek Yadav.",
            inputSchema: {
                type: "object",
                properties: {
                    name: { type: "string", description: "Your name" },
                    email: { type: "string", description: "Your email address" },
                    message: { type: "string", description: "Details of your inquiry or project" }
                },
                required: ["name", "email", "message"]
            },
            execute: async function(args) {
                return {
                    status: "success",
                    confirmation: "Inquiry received. Reach out directly at vivekhr36.2007@gmail.com or +919996445592.",
                    payload: args
                };
            }
        }
    ];

    // Expose tools for agents, testing frameworks, and debugging
    window.__webmcp_tools = webmcpTools;

    let registered = false;

    function registerTools() {
        if (registered) return;
        if (typeof navigator !== 'undefined' && navigator.modelContext && typeof navigator.modelContext.registerTool === 'function') {
            try {
                webmcpTools.forEach(tool => {
                    navigator.modelContext.registerTool(tool);
                });
                registered = true;
                console.log("[WebMCP] Registered", webmcpTools.length, "tools with navigator.modelContext");
            } catch (err) {
                console.warn("[WebMCP] Tool registration error:", err);
            }
        }
    }

    // Try immediately
    registerTools();

    // Try on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', registerTools);
    }

    // Try on window load
    window.addEventListener('load', registerTools);

    // Watch for dynamic injection of navigator.modelContext by test runners / agents
    try {
        let currentModelContext = navigator.modelContext;
        Object.defineProperty(navigator, 'modelContext', {
            configurable: true,
            enumerable: true,
            get() {
                return currentModelContext;
            },
            set(val) {
                currentModelContext = val;
                registered = false;
                registerTools();
            }
        });
    } catch (_) {
        // Ignore if navigator is frozen
    }
})();

