# Troubleshooting Guide

## 🔧 Common Issues & Solutions

### Issue 1: 502 Bad Gateway Error

**Symptoms:**
- Browser shows "502 Bad Gateway"
- Page won't load

**Solutions:**

**A. Clean up and restart:**
```bash
# Kill all Python servers
pkill -f http.server
pkill -f SimpleHTTP

# Start fresh
./start.sh
```

**B. Try different port:**
```bash
# Edit serve.py and change PORT = 8080 to PORT = 9000
python3 serve.py
```

**C. Use alternative server:**
```bash
# Using Node.js
npx http-server -p 8080

# Using PHP
php -S localhost:8080
```

---

### Issue 2: "Address Already in Use"

**Symptoms:**
- Error: `OSError: [Errno 48] Address already in use`

**Solution:**
```bash
# Find and kill the process using port 8080
lsof -ti:8080 | xargs kill -9

# Or use the cleanup script
pkill -f "http.server"

# Then restart
./start.sh
```

---

### Issue 3: No Audio Playing

**Symptoms:**
- Visual works but no sound
- Console shows audio context warnings

**Solutions:**

**A. Browser autoplay policy:**
```
1. Click anywhere on the page first
2. Check if browser is muted
3. Press 'M' key to unmute
```

**B. Check audio context:**
```javascript
// Open browser console (F12)
// Type this:
getAudioContext().state
// Should return "running"

// If it returns "suspended", click the page
```

**C. Volume settings:**
```
- Press M to toggle mute
- Check system volume
- Check browser tab isn't muted
```

---

### Issue 4: Blank White Screen

**Symptoms:**
- Page loads but nothing appears
- No particles or canvas

**Solutions:**

**A. Check browser console (F12):**
```
Look for errors like:
- "Cannot read property 'createCanvas'"
- "p5 is not defined"
- Script loading errors
```

**B. Verify files loaded:**
```bash
# Open test.html first
http://localhost:8080/test.html

# This will show which files failed to load
```

**C. Clear browser cache:**
```
Chrome/Edge: Ctrl+Shift+Delete
Firefox: Ctrl+Shift+Delete
Safari: Cmd+Option+E

Then refresh (Ctrl+F5)
```

---

### Issue 5: JavaScript Errors

**Common errors and fixes:**

**"p5 is not defined"**
```html
<!-- Check index.html has this BEFORE other scripts: -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
```

**"Uncaught ReferenceError: createCanvas is not defined"**
```
Solution: Wait for p5.js to fully load
- Open browser console
- Check for CDN loading errors
- Try offline: download p5.js locally
```

**"AudioContext was not allowed to start"**
```javascript
// This is normal - click the page to start audio
// Browser security prevents auto-playing audio
```

---

### Issue 6: Poor Performance / Lag

**Symptoms:**
- Low frame rate
- Choppy animations
- Browser freezing

**Solutions:**

**A. Reduce particle count:**
```javascript
// Edit sketch.js
const MAX_OSCILLATORS = 20;  // Reduce from 40
```

**B. Lower frame rate:**
```javascript
// Edit sketch.js
frameRate(20);  // Reduce from 30
```

**C. Reset frequently:**
```
Press Backspace to clear particles
Don't let too many accumulate
```

**D. Close other tabs:**
```
- Close unused browser tabs
- Close other applications
- Use Chrome for best performance
```

---

### Issue 7: Can't Save Screenshots

**Symptoms:**
- Pressing Space doesn't save image
- Download doesn't start

**Solutions:**

**A. Check browser permissions:**
```
1. Browser may block downloads
2. Allow downloads in browser settings
3. Check Downloads folder
```

**B. Try different method:**
```javascript
// Open browser console (F12)
// Type this:
saveCanvas('my-ocean-loop', 'png');
```

**C. Manual screenshot:**
```
- macOS: Cmd+Shift+4 (select area)
- Windows: Win+Shift+S
- Linux: Use screenshot tool
```

---

### Issue 8: Mobile/Touch Issues

**Symptoms:**
- Touch doesn't create particles
- Gestures not working

**Solutions:**

**A. Refresh and try again:**
```
- Reload the page
- Try single tap first
- Wait for page to fully load
```

**B. Check touch events:**
```javascript
// Browser console (F12)
document.addEventListener('touchstart', (e) => {
  console.log('Touch detected:', e.touches.length);
});
// Tap screen - should see console messages
```

---

### Issue 9: Files Not Found (404)

**Symptoms:**
- Console shows "404 Not Found"
- Scripts fail to load

**Solutions:**

**A. Verify file structure:**
```bash
ls -la
# Should see:
# index.html
# sketch.js
# Loop.js
# interactions.js
```

**B. Check case sensitivity:**
```
- Make sure filenames match exactly
- JavaScript is case-sensitive
- Loop.js ≠ loop.js
```

**C. Verify you're in correct directory:**
```bash
pwd
# Should end with: /ocean-loop-project

cd ocean-loop-project
./start.sh
```

---

## 🧪 Diagnostic Tools

### Test Page
```bash
# Open test page to check system
http://localhost:8080/test.html
```

### Browser Console
```
Press F12 to open developer tools
Check:
- Console tab: for errors
- Network tab: for failed requests
- Application tab: for storage issues
```

### Verify Server
```bash
# Test if server is responding
curl http://localhost:8080/

# Should return HTML content
```

### Check JavaScript Syntax
```bash
# Install Node.js, then:
node --check sketch.js
node --check Loop.js
node --check interactions.js
```

---

## 🆘 Still Having Issues?

### Debug Checklist
- [ ] Server is running (check terminal)
- [ ] Port 8080 is accessible
- [ ] Browser console shows no errors
- [ ] All files exist in directory
- [ ] Using modern browser (Chrome/Firefox/Safari)
- [ ] JavaScript is enabled
- [ ] No ad-blockers interfering
- [ ] Clicked page to enable audio

### Get Help
1. Open browser console (F12)
2. Copy all error messages
3. Check which file/line has error
4. Try test.html for diagnostics

### Alternative: Direct Open
```bash
# Some browsers allow direct file opening
open index.html
# or
firefox index.html
# or
chrome index.html
```

---

## 📝 Error Code Reference

| Code | Meaning | Solution |
|------|---------|----------|
| 502 | Bad Gateway | Restart server |
| 404 | File Not Found | Check file paths |
| 500 | Server Error | Check Python version |
| CORS | Cross-Origin | Use proper server (not file://) |

---

**Still stuck? Try the minimal test:**
```bash
# Create simple test
echo '<!DOCTYPE html><html><body><h1>Test</h1></body></html>' > test-basic.html

# Start server
python3 -m http.server 8080

# Open browser
# http://localhost:8080/test-basic.html

# If this works, issue is with the project files
# If this fails, issue is with the server/network
```
