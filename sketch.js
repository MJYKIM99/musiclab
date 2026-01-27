/**
 * @file Ocean Loop - Audio Visual Experiment
 * @description An interactive generative art piece exploring particle systems,
 * collision detection, and audio-visual synthesis.
 * @author yijiayidesign
 * @version 1.1.0
 * @license MIT
 */

// Disable p5.js friendly error system for better performance
p5.disableFriendlyErrors = true;

/**
 * @type {Loop[]} Array of active particle loops
 */
let loops = [];

/**
 * @type {p5.Oscillator[]} Array of pre-allocated oscillators
 */
let oscillators = [];

/**
 * @type {p5.Envelope[]} Array of envelope generators
 */
let envelopes = [];

/**
 * @type {p5.Reverb} Reverb effect processor
 */
let reverb;

/**
 * @type {number} Preview radius for particle creation
 */
let radiusPreview = 100;

/**
 * @type {number} State for radius animation (-1: idle, 1: growing)
 */
let radiusState = -1;

// Audio settings
/** @constant {number} Maximum number of oscillators */
const MAX_OSCILLATORS = 40;

/** @constant {number} Base frequency in Hz */
const BASE_FREQUENCY = 200;

// Visual settings
/** @type {number} Background color value */
let backgroundColor = 0;

/** @type {number} Background alpha transparency */
let bgAlpha = 20;

/**
 * p5.js setup function - Initialize canvas, audio, and settings
 * @description Called once when the application starts. Sets up the canvas,
 * initializes audio components, and configures initial parameters.
 */
function setup() {
  // Create canvas that fills window
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-holder');

  // Set frame rate for consistent animation
  frameRate(30);

  // Initialize audio context
  initAudio();

  // Set initial mouse position to center
  mouseX = width / 2;
  mouseY = height / 2;

  // Use RGB color mode (default) to match Loop.js
  colorMode(RGB, 255, 255, 255, 255);

  console.log('Ocean Loop initialized');
  console.log('Click or tap to create particles');
}

/**
 * p5.js draw function - Main render loop
 * @description Called continuously (30 FPS by default). Updates and renders
 * all particles, handles audio playback, and manages the visual display.
 */
function draw() {
  // Calculate total audio amplitude from all oscillators
  let totalAmplitude = calculateTotalAmplitude();

  // Dynamic background based on audio and particle count
  bgAlpha = 20 + constrain(totalAmplitude * 30, 0, 60) + loops.length / 4;
  background(0, 0, 0, bgAlpha);

  // Update and display all loops
  for (let i = loops.length - 1; i >= 0; i--) {
    let loop = loops[i];

    // Only process visible loops for performance
    if (isLoopVisible(loop)) {
      // Get audio amplitude for this specific loop
      let amplitude = 0;
      if (i < oscillators.length && oscillators[i]) {
        amplitude = oscillators[i].amp().value || 0;
      }

      // Check collisions with other loops
      loop.checkCollisions(loops);

      // Trigger or stop sound based on collision state
      handleLoopAudio(loop, i);

      // Update physics
      loop.update();

      // Render visuals
      loop.display(loops, amplitude);

      // Remove dead particles
      if (loop.isDead()) {
        removeLoop(i);
      }
    }
  }

  // Draw radius preview circle at mouse position
  drawRadiusPreview();
}

/**
 * Initialize audio components
 * @description Sets up the reverb effect, master volume, and pre-allocates
 * all oscillators with envelopes for better performance.
 */
function initAudio() {
  // Create reverb effect
  reverb = new p5.Reverb();
  reverb.amp(0.5);

  // Set master volume using p5.sound function
  outputVolume(0.3);

  // Pre-create oscillators for better performance
  for (let i = 0; i < MAX_OSCILLATORS; i++) {
    createOscillatorWithEnvelope(i);
  }

  console.log(`Audio initialized with ${MAX_OSCILLATORS} oscillators`);
}

/**
 * Create an oscillator with envelope for smooth audio
 * @param {number} index - The oscillator index for frequency calculation
 * @description Creates a new oscillator with randomized waveform, calculates
 * frequency based on index, and attaches an envelope for smooth attack/release.
 */
function createOscillatorWithEnvelope(index) {
  // Create oscillator
  let osc = new p5.Oscillator();

  // Randomize waveform type for variety
  let waveTypes = ['sine', 'triangle', 'sawtooth', 'square'];
  osc.setType(waveTypes[index % waveTypes.length]);

  // Set frequency based on index
  let freq = BASE_FREQUENCY + (index * 50) % 800;
  osc.freq(freq);

  // Create envelope for smooth attack/release
  let env = new p5.Envelope();
  env.setADSR(0.5, 0.3, 0.4, 1.0);
  env.setRange(0.3, 0);

  // Connect to reverb
  reverb.process(osc);

  // Start oscillator but at 0 volume
  osc.amp(0);
  osc.start();

  oscillators[index] = osc;
  envelopes[index] = env;
}

/**
 * Handle audio playback for a loop based on its state
 * @param {Loop} loop - The loop particle to handle audio for
 * @param {number} index - The oscillator index associated with this loop
 * @description Determines if sound should play based on collision state,
 * calculates stereo panning, volume, and frequency modulation.
 */
function handleLoopAudio(loop, index) {
  if (index >= oscillators.length) return;

  let osc = oscillators[index];
  if (!osc) return;

  // Determine if sound should play
  let shouldPlay = (loop.collisions.length % 3 === 1 && loop.clock1 > 160) ||
                   loop.collisions.mouse;

  if (shouldPlay && isLoopVisible(loop)) {
    // Calculate stereo panning based on position
    let panning = constrain(
      map(width > height ? loop.pos.x : loop.pos.y,
          0,
          width > height ? width : height,
          -1.0, 1.0),
      -1, 1
    );
    osc.pan(panning);

    // Calculate volume based on radius
    let volume = map(loop.r, 50, (width + height) / 3, 0.1, 0.5);
    volume = loop.collisions.mouse ? volume * 1.5 : volume;

    osc.amp(volume, 0.3);

    // Modulate frequency based on size and position
    let freqMod = map(loop.r, 50, (width + height) / 3, 0.8, 1.5);
    osc.freq(BASE_FREQUENCY * freqMod + index * 30);

  } else {
    // Fade out
    osc.amp(0, 0.2);
  }
}

/**
 * Calculate total amplitude across all oscillators
 * @returns {number} The sum of all oscillator amplitudes (0.0 to 1.0+)
 * @description Iterates through all active oscillators and sums their
 * current amplitude values for dynamic background effects.
 */
function calculateTotalAmplitude() {
  let total = 0;
  for (let osc of oscillators) {
    if (osc) {
      total += osc.amp().value || 0;
    }
  }
  return total;
}

/**
 * Check if loop is visible in canvas
 * @param {Loop} loop - The loop to check
 * @returns {boolean} True if the loop is within or near the canvas bounds
 * @description Performs bounds checking with a 100px buffer to determine
 * if a loop should be rendered and processed.
 */
function isLoopVisible(loop) {
  return loop.pos.x > -100 && loop.pos.x < width + 100 &&
         loop.pos.y > -100 && loop.pos.y < height + 100;
}

/**
 * Draw the radius preview circle
 * @description Renders a semi-transparent blue circle at the mouse position
 * showing the size of particles that will be created.
 */
function drawRadiusPreview() {
  noStroke();
  fill(100, 200, 255, 30);  // Light blue, semi-transparent
  ellipse(mouseX, mouseY, calculateRadius(radiusState, 7));
}

/**
 * Calculate radius based on interaction state
 * @param {number} state - Current interaction state (-1: idle, 1: growing)
 * @param {number} speed - Growth speed increment
 * @returns {number} The calculated preview radius
 * @description Updates the preview radius based on user interaction state,
 * either growing or randomizing the value.
 */
function calculateRadius(state, speed) {
  if (state === 1) {
    radiusPreview += speed;
  } else {
    radiusPreview = 100 + random(50);
  }
  radiusPreview = constrain(radiusPreview, 100, (width + height) / 6);
  return radiusPreview;
}

/**
 * Create new loop particles at specified position
 * @param {number} x - X coordinate for particle creation
 * @param {number} y - Y coordinate for particle creation
 * @param {number} radius - Base radius for new particles
 * @description Creates 1-10 new particle loops with randomized sizes at the
 * specified position. Provides visual feedback and auto-resets if too many particles.
 */
function createLoops(x, y, radius) {
  // Visual feedback for large radius
  if (radius > 100) {
    background(random(50, 100), random(0, 50), random(100, 150), radius / 4);
  }

  // Create random number of particles (1-10)
  let numLoops = Math.ceil(Math.random() * 10);

  for (let i = 0; i < numLoops; i++) {
    let randomRadius = radius + random(-20, 20);
    let newLoop = new Loop(randomRadius, x, y);
    loops.push(newLoop);
  }

  // Auto-reset if too many particles (performance)
  if (loops.length > MAX_OSCILLATORS - 5) {
    resetAll();
  }

  console.log(`Created ${numLoops} loops. Total: ${loops.length}`);
}

/**
 * Remove a loop and clean up
 * @param {number} index - Array index of the loop to remove
 * @description Removes a loop from the active loops array at the specified index.
 */
function removeLoop(index) {
  loops.splice(index, 1);
}

/**
 * Reset all particles and audio
 * @description Clears all active particles, fades out all audio oscillators,
 * and resets the canvas to a clean state.
 */
function resetAll() {
  console.log('Resetting all particles');

  // Clear all loops
  loops.length = 0;

  // Stop all audio
  for (let osc of oscillators) {
    if (osc) {
      osc.amp(0, 0.1);
    }
  }

  // Clear background
  background(0);
}

/**
 * Handle window resize
 * @description Automatically called when the browser window is resized.
 * Updates canvas dimensions to fill the new window size.
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  console.log(`Canvas resized to ${windowWidth}x${windowHeight}`);
}
