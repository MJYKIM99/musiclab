/**
 * Theme System for Ocean Loop
 * Manages color themes and visual presets
 */

const themes = {
  ocean: {
    name: '🌊 Ocean',
    background: [0, 10, 30],
    particleColors: [
      [0, 150, 255],    // Deep blue
      [0, 200, 200],    // Cyan
      [100, 220, 255],  // Light blue
      [0, 100, 180]     // Navy
    ],
    glowColor: [100, 200, 255],
    description: 'Calm ocean atmosphere with blue tones'
  },

  fire: {
    name: '🔥 Fire',
    background: [30, 5, 0],
    particleColors: [
      [255, 100, 0],    // Orange
      [255, 50, 0],     // Red-orange
      [255, 200, 0],    // Yellow
      [200, 0, 0]       // Dark red
    ],
    glowColor: [255, 150, 0],
    description: 'Energetic fire with warm colors'
  },

  galaxy: {
    name: '🌌 Galaxy',
    background: [10, 0, 20],
    particleColors: [
      [150, 0, 255],    // Purple
      [255, 0, 150],    // Pink
      [100, 0, 200],    // Deep purple
      [200, 100, 255]   // Light purple
    ],
    glowColor: [180, 100, 255],
    description: 'Cosmic galaxy with purple and pink'
  },

  forest: {
    name: '🌲 Forest',
    background: [5, 20, 5],
    particleColors: [
      [0, 200, 100],    // Green
      [100, 255, 100],  // Light green
      [0, 150, 50],     // Dark green
      [150, 200, 0]     // Yellow-green
    ],
    glowColor: [100, 255, 150],
    description: 'Natural forest with green tones'
  },

  sunset: {
    name: '🌅 Sunset',
    background: [30, 15, 25],
    particleColors: [
      [255, 100, 150],  // Pink
      [255, 150, 0],    // Orange
      [200, 50, 100],   // Purple-pink
      [255, 200, 100]   // Peach
    ],
    glowColor: [255, 150, 100],
    description: 'Beautiful sunset colors'
  },

  monochrome: {
    name: '⚫ Mono',
    background: [0, 0, 0],
    particleColors: [
      [255, 255, 255],  // White
      [200, 200, 200],  // Light gray
      [150, 150, 150],  // Gray
      [100, 100, 100]   // Dark gray
    ],
    glowColor: [200, 200, 200],
    description: 'Classic black and white'
  }
};

// Current theme state
let currentTheme = 'ocean';

/**
 * Get the current theme object
 */
function getCurrentTheme() {
  return themes[currentTheme];
}

/**
 * Set the current theme
 */
function setTheme(themeName) {
  if (themes[themeName]) {
    currentTheme = themeName;
    console.log(`Theme changed to: ${themes[themeName].name}`);
    return true;
  }
  console.error(`Theme not found: ${themeName}`);
  return false;
}

/**
 * Get a random particle color from current theme
 */
function getThemeParticleColor() {
  const theme = getCurrentTheme();
  const colors = theme.particleColors;
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Get theme background color
 */
function getThemeBackground() {
  return getCurrentTheme().background;
}

/**
 * Get theme glow color
 */
function getThemeGlowColor() {
  return getCurrentTheme().glowColor;
}

/**
 * Get all theme names for dropdown
 */
function getThemeNames() {
  return Object.keys(themes);
}

/**
 * Get all theme display names
 */
function getThemeDisplayNames() {
  return Object.keys(themes).map(key => themes[key].name);
}
