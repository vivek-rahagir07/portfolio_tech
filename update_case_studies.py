import re

files_data = {
    "project-neoride.html": {
        "title": "NeoRide",
        "subtitle": "UI Limits Experiment Game",
        "video_src": "projects/Neoride.mp4",
        "overview": "NeoRide was an interactive game made purely for enjoyment to see how far I could push myself with UI elements without using any external graphics. It was an experiment in pure CSS and DOM manipulation.",
        "architecture": "Instead of relying on Canvas or WebGL, the entire visual experience was built using standard DOM elements, heavily styled with CSS transitions and animations.",
        "features": [
            "<strong>Zero External Graphics:</strong> Every visual element is pure CSS.",
            "<strong>Interactive Gameplay:</strong> Fluid mechanics built without traditional game engines.",
            "<strong>DOM Optimization:</strong> Managing hundreds of DOM nodes smoothly."
        ],
        "tech": ["HTML5", "CSS3", "Vanilla JavaScript"],
        "challenges": "The biggest challenge was creating engaging game visuals relying completely on native HTML/CSS elements without causing browser reflow lag, pushing the boundaries of raw CSS styling."
    },
    "project-cognitoattend.html": {
        "title": "CognitoAttend",
        "subtitle": "Cognitive Attendance System",
        "video_src": "projects/Cognito attend.mp4",
        "overview": "CognitoAttend was conceived as a cognitive attendance system built to track attendance seamlessly using advanced integrations, providing a frictionless experience for both users and administrators.",
        "architecture": "The system utilizes real-time WebSocket connections and a robust Node.js backend to process cognitive tracking data instantaneously.",
        "features": [
            "<strong>Smart Tracking:</strong> Frictionless logging of user presence.",
            "<strong>Real-time Dashboard:</strong> Instant synchronization of data.",
            "<strong>Automated Reporting:</strong> Generates comprehensive attendance insights."
        ],
        "tech": ["React", "Node.js", "WebSockets", "MongoDB"],
        "challenges": "Ensuring the cognitive data was processed and synchronized across all clients in real-time required a highly optimized WebSocket architecture."
    },
    "project-neostream.html": {
        "title": "NeoMusic",
        "subtitle": "Immersive Music Experience",
        "video_src": "projects/neostream.mp4",
        "overview": "NeoMusic is a music website born from the desire to deliver a truly great and immersive experience in music listening, moving beyond standard audio players.",
        "architecture": "Built with modern web audio APIs to ensure crisp playback and dynamic audio visualizations.",
        "features": [
            "<strong>Immersive Audio:</strong> High-fidelity streaming playback.",
            "<strong>Custom Player:</strong> Completely tailored audio controls and UI.",
            "<strong>Fluid Visuals:</strong> Animations that react to the music."
        ],
        "tech": ["React", "Web Audio API", "Next.js"],
        "challenges": "Managing the state of the audio player across different routes without interrupting the music playback required a complex global state architecture."
    },
    "project-mediaconverter.html": {
        "title": "Media Converter",
        "subtitle": "Browser-based MKV to MP4 Converter",
        "video_src": "projects/Stuck in mkv files.mp4",
        "overview": "This project was born purely out of frustration. I was trying to convert my MKV video lectures to MP4 so I could watch them on my MacBook, but all the online compilers I tried were incredibly slow and terrible. I got fed up and decided to build something crazy: a localized converter that runs entirely in the browser.",
        "architecture": "By leveraging FFmpeg.wasm, the conversion process happens completely client-side. No huge video files need to be uploaded to a server, completely eliminating network bottlenecks.",
        "features": [
            "<strong>Client-Side Processing:</strong> Converts files directly in the browser.",
            "<strong>Zero Uploads:</strong> Absolute privacy and speed.",
            "<strong>Format Support:</strong> Handles heavy MKV files effortlessly."
        ],
        "tech": ["JavaScript", "FFmpeg.wasm", "Web Workers"],
        "challenges": "Handling massive MKV files in the browser without crashing the tab required careful implementation of Web Workers to offload the heavy WebAssembly processing from the main UI thread."
    }
}

template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | Case Study</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .case-study-hero {{ padding: 8rem 5% 4rem; text-align: center; max-width: 1000px; margin: 0 auto; }}
        .case-study-hero h1 {{ font-size: 3.5rem; color: var(--primary-color); margin-bottom: 1rem; }}
        .case-study-hero p {{ font-size: 1.2rem; color: #ccc; margin-bottom: 2rem; }}
        .case-study-video {{ width: 100%; border-radius: 12px; overflow: hidden; margin-bottom: 3rem; border: 1px solid rgba(255,255,255,0.1); }}
        .case-study-video video {{ width: 100%; display: block; }}
        .content-section {{ max-width: 800px; margin: 0 auto 4rem; color: #ccc; line-height: 1.8; }}
        .content-section h2 {{ color: white; font-size: 2rem; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; }}
        .content-section h3 {{ color: var(--primary-color); margin-top: 2rem; margin-bottom: 1rem; }}
        .tech-tags {{ display: flex; flex-wrap: wrap; gap: 10px; margin-top: 1rem; }}
        .tech-tags span {{ background: rgba(0, 255, 0, 0.1); color: var(--primary-color); padding: 5px 15px; border-radius: 20px; border: 1px solid rgba(0, 255, 0, 0.2); }}
    </style>
</head>
<body>
    <nav>
        <div class="logo"><a href="index.html"><img src="photos/logo.png" alt="VY Logo"></a></div>
        <ul class="nav-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="projects.html">Projects</a></li>
        </ul>
    </nav>

    <main id="main-content">
        <section class="case-study-hero page-transition fade-in-up">
            <h1>{title}</h1>
            <p>{subtitle}</p>
            <div class="case-study-video glass-card">
                <video src="{video_src}" autoplay loop muted playsinline></video>
            </div>
        </section>

        <section class="content-section page-transition fade-in-up delay-1">
            <h2>Overview & Problem Statement</h2>
            <p>{overview}</p>
        </section>

        <section class="content-section page-transition fade-in-up delay-2">
            <h2>Solution Architecture</h2>
            <p>{architecture}</p>
            <h3>Key Features</h3>
            <ul>
                {features_html}
            </ul>
        </section>

        <section class="content-section page-transition fade-in-up delay-3">
            <h2>Technology Stack</h2>
            <div class="tech-tags">
                {tech_html}
            </div>
        </section>

        <section class="content-section page-transition fade-in-up delay-4">
            <h2>Challenges Overcome</h2>
            <p>{challenges}</p>
        </section>
    </main>

    <footer>
        <p>Designed and Built by Vivek Yadav &copy; 2026</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>
"""

import os

for filename, data in files_data.items():
    if not os.path.exists(filename):
        continue
    
    features_html = "\n                ".join([f"<li>{f}</li>" for f in data["features"]])
    tech_html = "\n                ".join([f"<span>{t}</span>" for t in data["tech"]])
    
    html = template.format(
        title=data["title"],
        subtitle=data["subtitle"],
        video_src=data["video_src"],
        overview=data["overview"],
        architecture=data["architecture"],
        features_html=features_html,
        tech_html=tech_html,
        challenges=data["challenges"]
    )
    
    with open(filename, "w", encoding="utf-8") as f:
        f.write(html)
        
print("Case study files updated!")
