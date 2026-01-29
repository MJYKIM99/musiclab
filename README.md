# Ocean Loop - Audio Visual Experiment

An interactive generative art piece exploring particle systems, collision detection, and audio-visual synthesis. Inspired by ocean plastic pollution and the chaotic movement of particles in water.

![Ocean Loop Preview](preview.jpg)

## 🌊 Overview

Ocean Loop is an experimental web-based artwork that creates mesmerizing audio-visual patterns through user interaction. Each click generates animated particles that move, collide, and produce generative sounds, creating a unique experience every time.

## ✨ Features

- **Generative Particle System**: Dynamic particles with 6 unique visual modes
- **Interactive Audio Synthesis**: Real-time audio generation using Web Audio API
- **Collision Detection**: Particles interact with each other and respond to mouse/touch
- **Responsive Design**: Works on desktop and mobile devices
- **Multiple Interaction Modes**: Click, drag, keyboard shortcuts, and multi-touch gestures
- **Live Status HUD**: Loop count, audio state, and FPS overlay

## 🎮 Controls

### Mouse/Touch
- **Click/Tap**: Create new particles at cursor position
- **Drag**: Modify existing particles (grow/shrink)
- **Hold Click**: Increase spawn radius
- **Double Click**: Create large particle cluster
- **Mouse Wheel**: Adjust preview radius

### Keyboard Shortcuts
- **Space**: Take screenshot
- **Backspace**: Reset all particles
- **B**: Shrink all particles
- **R**: Create random particles across canvas
- **F**: Toggle fullscreen mode
- **H**: Hide/show info panel
- **M**: Mute/unmute audio
- **1-9**: Quick spawn (number = particle groups)
- **HUD**: Shows loop count, audio state, FPS

### Mobile Gestures
- **Two Finger Touch**: Take screenshot
- **Three Finger Touch**: Shrink all particles

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (for loading local files)

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd ocean-loop-project
   ```

2. **Start a local web server**

   Using Python 3:
   ```bash
   python -m http.server 8000
   ```

   Using Python 2:
   ```bash
   python -m SimpleHTTPServer 8000
   ```

   Using Node.js (with http-server):
   ```bash
   npx http-server -p 8000
   ```

   Using PHP:
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Running Without a Server

Some browsers allow running local HTML files directly:
1. Open `index.html` in your browser
2. If you see errors, use one of the server methods above

## 📁 Project Structure

```
ocean-loop-project/
├── index.html          # Main HTML file with UI
├── sketch.js          # Main p5.js sketch (setup/draw loop)
├── Loop.js            # Particle class definition
├── interactions.js    # User interaction handlers
├── assets/            # Assets folder (currently empty)
└── README.md          # This file
```

## 🎨 Technical Details

### Technologies Used
- **p5.js**: Creative coding library for graphics
- **p5.sound**: Audio synthesis and processing
- **Web Audio API**: Real-time audio generation
- **HTML5 Canvas**: 2D rendering

### Architecture

#### Loop Class (`Loop.js`)
- Represents individual particles
- Handles physics, collision detection, and rendering
- 6 mathematical modes for visual variety
- Manages particle lifecycle (growth, shrinking, death)

#### Main Sketch (`sketch.js`)
- Initializes canvas and audio system
- Main draw loop (30 FPS)
- Audio synthesis with oscillators and reverb
- Particle management and cleanup

#### Interactions (`interactions.js`)
- Mouse, touch, and keyboard event handlers
- Gesture recognition (multi-touch)
- User feedback and controls

### Visual Modes

The particle shapes cycle through 6 different mathematical patterns:

1. **Spinning Sine Wave**: Smooth rotating circles
2. **Noise Antenna**: Organic antenna-like structures
3. **Noise Dots**: Scattered points with lines
4. **Pure Noise**: Chaotic organic shapes
5. **Complex Noise**: Layered noise patterns
6. **Tangent Organic**: Flowing natural forms

### Audio System

- **40 Pre-created Oscillators**: Four waveform types (sine, triangle, sawtooth, square)
- **Stereo Panning**: Based on particle position
- **Dynamic Volume**: Controlled by particle size
- **Reverb Processing**: Spatial audio effect
- **Collision Triggers**: Audio plays on particle interactions

## 🎯 Customization

### Adjust Particle Count
Edit `sketch.js`:
```javascript
const CONFIG = { maxOscillators: 40 }; // Change max particles
```

### Change Colors
Edit `sketch.js`:
```javascript
colorMode(HSB, 360, 100, 100, 100); // Modify color mode
```

### Adjust Audio
Edit `sketch.js`:
```javascript
const BASE_FREQUENCY = 200; // Change base pitch
masterVolume(0.3); // Adjust master volume
```

### Modify Particle Behavior
Edit `Loop.js`:
```javascript
this.velocity = createVector(random(-3, 3), random(-3, 3)); // Speed
this.r = radius; // Initial size
```

## 🐛 Troubleshooting

### No Audio
- Click anywhere on the page to activate audio context (browser autoplay policy)
- Check if browser is muted
- Press 'M' to unmute
- Try refreshing the page

### Slow Performance
- Reset particles with Backspace
- Reduce `MAX_OSCILLATORS` in sketch.js
- Close other browser tabs
- Use a modern browser

### Particles Not Appearing
- Check browser console for errors (F12)
- Ensure all JavaScript files are loaded
- Try clearing browser cache

## 📝 License

This project is open source and available for educational and artistic purposes.

## 🙏 Credits

Inspired by:
- Original Ocean Loop by Sikai Li (https://skyl.fr/play/ocean-loop)
- p5.js community and examples
- Generative art pioneers

## 🔗 Resources

- [p5.js Documentation](https://p5js.org/reference/)
- [p5.sound Reference](https://p5js.org/reference/#/libraries/p5.sound)
- [Web Audio API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Generative Art Techniques](https://generativeartistry.com/)

## 📧 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the code comments
3. Experiment with the parameters

---

**Enjoy creating your own Ocean Loops!** 🌊✨
