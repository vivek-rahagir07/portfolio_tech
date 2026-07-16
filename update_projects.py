import os

files_to_update = ['projects.html', 'index.html', 'terminal.js']

replacements = {
    # NeoRide
    'Bike Rental Platform': 'UI Graphics Experiment Game',
    'Modern bike rental and sharing platform with real-time availability tracking and fleet management.': 'A game made purely for enjoyment to test the limits of what I could build with UI elements alone, without using any graphics.',
    'NeoRide - Bike Rental Platform': 'NeoRide - UI Limits Game',
    'Modern bike rental and sharing platform with real-time availability tracking and fleet management': 'A game made purely for enjoyment to test the limits of what I could build with UI elements alone, without using any graphics',
    
    # CognitoAttend
    'Smart Attendance System': 'Cognitive Attendance System',
    'Full-stack attendance management platform with biometric integration, real-time tracking, and automated reporting.': 'A cognitive attendance system designed for smart, frictionless tracking.',
    
    # NeoMusic / NeoStream
    'NeoStream': 'NeoMusic',
    'Music Streaming Platform': 'Immersive Music Experience',
    'Modern music streaming service with personalized playlists and real-time audio processing.': 'A music website built specifically to deliver a great, immersive experience in music listening.',
    
    # Media Converter
    'Video Processing Tool': 'Crazy Fast Media Converter',
    'Browser-based video conversion and processing tool with format conversion and compression capabilities.': 'Built out of frustration. I was converting my MKV lectures to MP4 for my MacBook using online compilers and they sucked, so I decided to build something crazy myself.',
}

for file in files_to_update:
    if not os.path.exists(file):
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updates completed.")
