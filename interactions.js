/**
 * Interaction Handlers
 * Mouse, touch, and keyboard interactions
 */

const SCREENSHOT_COOLDOWN_MS = 1200;
let lastScreenshotAt = 0;

function canTakeScreenshot() {
  const now = millis();
  if (now - lastScreenshotAt < SCREENSHOT_COOLDOWN_MS) return false;
  lastScreenshotAt = now;
  return true;
}

/**
 * Ensure audio context is running (browser autoplay policy)
 */
function ensureAudioContext() {
  const ctx = getAudioContext();
  if (ctx && ctx.state !== 'running') {
    ctx.resume();
  }
}

/**
 * Mouse/Touch Press
 * Start growing the radius preview
 */
function mousePressed() {
  radiusState = 1;
  ensureAudioContext();
  return false; // Prevent default
}

/**
 * Mouse/Touch Drag
 * Modify existing loops under cursor
 */
function mouseDragged() {
  radiusState = 1;

  loops.forEach(loop => {
    if (loop.collisions.mouse) {
      // Randomly toggle between growing and shrinking
      if (Math.random() > 0.8) {
        loop.bigger = !loop.bigger;
      } else {
        loop.shrink = !loop.shrink;
      }
    }
  });

  return false; // Prevent default
}

/**
 * Mouse/Touch Release
 * Create new loops at cursor position
 */
function mouseReleased() {
  radiusState = 0;
  createLoops(mouseX, mouseY, radiusPreview);
  return false; // Prevent default
}

/**
 * Touch Started (Mobile)
 */
function touchStarted() {
  radiusState = 1;
  ensureAudioContext();
  return false; // Prevent default
}

/**
 * Touch Moved (Mobile)
 */
function touchMoved() {
  radiusState = 1;

  loops.forEach(loop => {
    if (loop.collisions.mouse) {
      loop.shrink = !loop.shrink;
    }
  });

  // Multi-touch gestures
  if (touches.length === 2) {
    // Two finger touch: take screenshot
    if (canTakeScreenshot()) {
      saveCanvas('ocean-loop-' + frameCount, 'png');
      console.log('Screenshot saved');
    }
  }

  if (touches.length === 3) {
    // Three finger touch: shrink all
    loops.forEach(loop => {
      loop.shrink = true;
    });
  }

  return false; // Prevent default
}

/**
 * Touch Ended (Mobile)
 */
function touchEnded() {
  radiusState = 0;

  // Create loops at touch position
  if (touches.length === 0) {
    createLoops(mouseX, mouseY, radiusPreview);
  }

  return false; // Prevent default
}

/**
 * Keyboard Controls
 */
function keyPressed() {
  // Space - Save screenshot
  if (key === ' ') {
    if (canTakeScreenshot()) {
      saveCanvas('ocean-loop-' + frameCount, 'png');
      console.log('Screenshot saved');
    }
    return false;
  }

  // Backspace - Reset all
  if (keyCode === BACKSPACE || keyCode === DELETE) {
    resetAll();
    return false;
  }

  // B - Shrink all loops
  if (key === 'b' || key === 'B') {
    loops.forEach(loop => {
      loop.shrink = true;
    });
    console.log('Shrinking all particles');
    return false;
  }

  // R - Add random loops
  if (key === 'r' || key === 'R') {
    for (let i = 0; i < 5; i++) {
      createLoops(
        random(width),
        random(height),
        random(100, 300)
      );
    }
    console.log('Created random particles');
    return false;
  }

  // F - Toggle fullscreen
  if (key === 'f' || key === 'F') {
    let fs = fullscreen();
    fullscreen(!fs);
    return false;
  }

  // H - Toggle info panel
  if (key === 'h' || key === 'H') {
    let info = document.getElementById('info');
    info.classList.toggle('hidden');
    return false;
  }

  // M - Toggle master volume
  if (key === 'm' || key === 'M') {
    let currentVol = outputVolume();
    if (currentVol > 0) {
      outputVolume(0);
      console.log('Audio muted');
    } else {
      outputVolume(0.3);
      console.log('Audio unmuted');
    }
    return false;
  }

  // 1-9 - Quick spawn presets
  if (key >= '1' && key <= '9') {
    let count = parseInt(key);
    for (let i = 0; i < count; i++) {
      createLoops(mouseX, mouseY, random(50, 200));
    }
    console.log(`Created ${count} particle groups`);
    return false;
  }
}

/**
 * Double Click - Create large cluster
 */
function doubleClicked() {
  createLoops(mouseX, mouseY, random(200, 400));
  console.log('Large cluster created');
  return false;
}

/**
 * Mouse Wheel - Adjust preview radius
 */
function mouseWheel(event) {
  radiusPreview += event.delta * 2;
  radiusPreview = constrain(radiusPreview, 50, (width + height) / 4);
  console.log('Preview radius:', Math.floor(radiusPreview));
  return false;
}

// Prevent default touch behaviors on mobile
document.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, { passive: false });

console.log('Interaction handlers loaded');
console.log('Controls:');
console.log('  Click/Drag: Create particles');
console.log('  Space: Screenshot');
console.log('  Backspace: Reset');
console.log('  B: Shrink all');
console.log('  R: Random particles');
console.log('  F: Fullscreen');
console.log('  H: Hide info');
console.log('  M: Mute/Unmute');
console.log('  1-9: Quick spawn');
