# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Start the Server

**Option A - Using the script (recommended):**
```bash
./start.sh
```

**Option B - Manual start:**
```bash
# Python 3
python3 -m http.server 8000

# Or Node.js
npx http-server -p 8000

# Or NPM script
npm start
```

### 2. Open in Browser
Navigate to: **http://localhost:8000**

### 3. Start Creating!
- Click anywhere to create particles
- Hold and release to adjust size
- Drag to modify existing particles

## 🎮 Essential Controls

| Action | Effect |
|--------|--------|
| **Click/Tap** | Create particles |
| **Drag** | Modify particles |
| **Space** | Screenshot |
| **Backspace** | Reset all |
| **H** | Hide/show help |
| **M** | Mute/unmute |

## 🎨 Quick Tips

1. **Audio Not Working?** Click anywhere on the page first (browser policy)
2. **Slow Performance?** Press Backspace to reset, or reduce MAX_OSCILLATORS in sketch.js
3. **Want More Control?** Use number keys 1-9 for quick spawn
4. **Mobile Users:** Use two/three finger gestures for special actions

## 📁 Project Files

```
ocean-loop-project/
├── index.html         # Main page
├── sketch.js         # Core logic
├── Loop.js           # Particle class
├── interactions.js   # User controls
└── README.md         # Full documentation
```

## 🔧 Customization

Edit `sketch.js` to change:
- `MAX_OSCILLATORS = 40` → Max particles
- `BASE_FREQUENCY = 200` → Audio pitch
- `masterVolume(0.3)` → Volume level

## 💡 Examples

**Create a cluster:**
```
1. Hold mouse button
2. Wait for circle to grow
3. Release to spawn
```

**Random art:**
```
Press R key several times
Watch the chaos!
```

**Save your work:**
```
Press Space to screenshot
Files saved as PNG
```

## ❓ Troubleshooting

**No audio?** → Click the page, press M to unmute

**Laggy?** → Press Backspace to reset

**Can't see particles?** → Check browser console (F12)

---

**Ready to explore?** Run `./start.sh` and start creating! 🌊
