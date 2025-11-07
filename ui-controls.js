/**
 * UI Controls for Ocean Loop
 * dat.GUI control panel implementation
 */

// Global GUI instance
let gui;

// Control parameters - these will be exposed to the GUI
const controls = {
  // Particle settings
  maxParticles: 40,
  particleSpeed: 3,
  particleLifetime: 200,
  particleGrowthRate: 0.1,

  // Visual settings
  theme: '🌊 Ocean',
  showTrails: false,
  trailLength: 30,
  backgroundAlpha: 20,
  glowIntensity: 1.0,

  // Audio settings
  volume: 0.3,
  reverbAmount: 0.5,
  baseFrequency: 200,
  musicMode: 'Random',

  // Physics settings
  gravity: 0,
  friction: 0,
  bounceWalls: false,

  // Actions
  randomGenerate: function() {
    for (let i = 0; i < 5; i++) {
      createLoops(random(width), random(height), random(100, 200));
    }
  },

  shrinkAll: function() {
    for (let loop of loops) {
      loop.shrink = true;
    }
  },

  clearAll: function() {
    resetAll();
  },

  saveScene: function() {
    saveSceneToStorage();
    alert('Scene saved!');
  },

  loadScene: function() {
    if (loadSceneFromStorage()) {
      alert('Scene loaded!');
    } else {
      alert('No saved scene found.');
    }
  },

  screenshot: function() {
    save(`ocean-loop-${Date.now()}.png`);
  }
};

/**
 * Initialize the dat.GUI control panel
 */
function initGUI() {
  gui = new dat.GUI({ width: 300 });
  gui.domElement.id = 'dat-gui-container';

  // Particle controls folder
  const particleFolder = gui.addFolder('🎨 Particle Settings');
  particleFolder.add(controls, 'maxParticles', 10, 100, 1)
    .name('Max Particles')
    .onChange(updateMaxParticles);
  particleFolder.add(controls, 'particleSpeed', 0.5, 10, 0.5)
    .name('Speed')
    .onChange(updateParticleSpeed);
  particleFolder.add(controls, 'particleLifetime', 140, 300, 10)
    .name('Lifetime')
    .onChange(updateParticleLifetime);
  particleFolder.add(controls, 'showTrails')
    .name('Show Trails')
    .onChange(toggleTrails);
  particleFolder.add(controls, 'trailLength', 10, 100, 5)
    .name('Trail Length');
  particleFolder.open();

  // Visual controls folder
  const visualFolder = gui.addFolder('🌈 Visual Settings');
  visualFolder.add(controls, 'theme', getThemeDisplayNames())
    .name('Theme')
    .onChange(changeTheme);
  visualFolder.add(controls, 'backgroundAlpha', 0, 100, 5)
    .name('Background Fade');
  visualFolder.add(controls, 'glowIntensity', 0, 2, 0.1)
    .name('Glow Intensity');
  visualFolder.open();

  // Audio controls folder
  const audioFolder = gui.addFolder('🎵 Audio Settings');
  audioFolder.add(controls, 'volume', 0, 1, 0.05)
    .name('Volume')
    .onChange(updateVolume);
  audioFolder.add(controls, 'reverbAmount', 0, 1, 0.1)
    .name('Reverb')
    .onChange(updateReverb);
  audioFolder.add(controls, 'baseFrequency', 100, 500, 50)
    .name('Base Frequency');
  audioFolder.add(controls, 'musicMode', ['Random', 'C Major', 'A Minor', 'Pentatonic'])
    .name('Music Mode');
  audioFolder.open();

  // Physics controls folder
  const physicsFolder = gui.addFolder('⚡ Physics Settings');
  physicsFolder.add(controls, 'gravity', -0.5, 0.5, 0.05)
    .name('Gravity');
  physicsFolder.add(controls, 'friction', 0, 0.1, 0.01)
    .name('Friction');
  physicsFolder.add(controls, 'bounceWalls')
    .name('Bounce Walls');

  // Actions folder
  const actionsFolder = gui.addFolder('🎮 Actions');
  actionsFolder.add(controls, 'randomGenerate').name('🎲 Random Generate');
  actionsFolder.add(controls, 'shrinkAll').name('📉 Shrink All');
  actionsFolder.add(controls, 'clearAll').name('🗑️ Clear All');
  actionsFolder.add(controls, 'saveScene').name('💾 Save Scene');
  actionsFolder.add(controls, 'loadScene').name('📂 Load Scene');
  actionsFolder.add(controls, 'screenshot').name('📸 Screenshot');
  actionsFolder.open();

  console.log('GUI initialized');
}

/**
 * Update handlers for control changes
 */

function updateMaxParticles(value) {
  // This will be used in sketch.js to limit particle creation
  console.log(`Max particles set to: ${value}`);
}

function updateParticleSpeed(value) {
  // Update velocity of existing particles
  for (let loop of loops) {
    loop.velocity.mult(value / controls.particleSpeed);
  }
}

function updateParticleLifetime(value) {
  // Adjust existing particles' clock values
  for (let loop of loops) {
    if (loop.clock1 < value) {
      loop.clock1 = Math.min(loop.clock1 + 10, value);
    }
  }
}

function toggleTrails(value) {
  // Trail rendering will be handled in Loop.js
  console.log(`Trails ${value ? 'enabled' : 'disabled'}`);
}

function changeTheme(themeName) {
  // Convert display name to theme key
  const themeKeys = getThemeNames();
  const themeDisplayNames = getThemeDisplayNames();
  const index = themeDisplayNames.indexOf(themeName);

  if (index >= 0) {
    setTheme(themeKeys[index]);

    // Update background color
    const bgColor = getThemeBackground();
    backgroundColor = color(bgColor[0], bgColor[1], bgColor[2]);
  }
}

function updateVolume(value) {
  outputVolume(value);
  console.log(`Volume set to: ${value}`);
}

function updateReverb(value) {
  if (reverb) {
    reverb.amp(value);
    console.log(`Reverb set to: ${value}`);
  }
}

/**
 * Save scene to localStorage
 */
function saveSceneToStorage() {
  const scene = {
    version: '2.0',
    timestamp: Date.now(),
    controls: controls,
    theme: currentTheme,
    particles: loops.map(loop => ({
      pos: { x: loop.pos.x, y: loop.pos.y },
      velocity: { x: loop.velocity.x, y: loop.velocity.y },
      r: loop.r,
      rInit: loop.rInit,
      clock: loop.clock,
      clock1: loop.clock1,
      shrink: loop.shrink,
      bigger: loop.bigger,
      hue: loop.hue
    }))
  };

  try {
    localStorage.setItem('oceanLoopScene', JSON.stringify(scene));
    console.log('Scene saved to localStorage');
    return true;
  } catch (e) {
    console.error('Failed to save scene:', e);
    return false;
  }
}

/**
 * Load scene from localStorage
 */
function loadSceneFromStorage() {
  try {
    const sceneData = localStorage.getItem('oceanLoopScene');
    if (!sceneData) {
      return false;
    }

    const scene = JSON.parse(sceneData);

    // Clear current loops
    loops = [];

    // Restore theme
    if (scene.theme) {
      setTheme(scene.theme);
      controls.theme = themes[scene.theme].name;
    }

    // Restore controls
    if (scene.controls) {
      Object.assign(controls, scene.controls);
    }

    // Restore particles
    if (scene.particles) {
      for (let pData of scene.particles) {
        let loop = new Loop(pData.rInit, pData.pos.x, pData.pos.y);
        loop.pos.set(pData.pos.x, pData.pos.y);
        loop.velocity.set(pData.velocity.x, pData.velocity.y);
        loop.r = pData.r;
        loop.clock = pData.clock;
        loop.clock1 = pData.clock1;
        loop.shrink = pData.shrink;
        loop.bigger = pData.bigger;
        loop.hue = pData.hue;
        loops.push(loop);
      }
    }

    // Update GUI
    gui.updateDisplay();

    console.log(`Loaded scene from ${new Date(scene.timestamp).toLocaleString()}`);
    return true;
  } catch (e) {
    console.error('Failed to load scene:', e);
    return false;
  }
}

/**
 * Close/hide the GUI
 */
function toggleGUI() {
  if (gui) {
    gui.closed ? gui.open() : gui.close();
  }
}
