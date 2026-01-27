/**
 * @file Audio Worker
 * @description Web Worker for offloading audio calculations from the main thread.
 * Improves performance by processing audio effects in parallel.
 * @version 1.0.0
 */

// Worker state
/** @type {Object[]} Array of active audio nodes */
let audioNodes = [];

/** @type {Object} Audio context parameters */
let audioParams = {
  baseFrequency: 200,
  masterVolume: 0.3,
  reverbAmount: 0.5
};

/**
 * Handle incoming messages from main thread
 * @param {MessageEvent} e - Message event from main thread
 */
self.onmessage = function(e) {
  const { type, data } = e.data;

  switch (type) {
    case 'INITIALIZE':
      initializeAudio(data);
      break;

    case 'UPDATE_PARAMS':
      updateParams(data);
      break;

    case 'CALCULATE_AUDIO':
      calculateAudio(data);
      break;

    case 'PROCESS_BATCH':
      processBatch(data);
      break;

    case 'GET_STATS':
      getStats();
      break;

    default:
      console.warn('Unknown message type:', type);
  }
};

/**
 * Initialize audio system
 * @param {Object} config - Audio configuration
 */
function initializeAudio(config) {
  audioParams = { ...audioParams, ...config };
  console.log('Audio Worker initialized:', audioParams);

  postMessage({
    type: 'INITIALIZED',
    data: { success: true, params: audioParams }
  });
}

/**
 * Update audio parameters
 * @param {Object} params - New parameters
 */
function updateParams(params) {
  audioParams = { ...audioParams, ...params };

  postMessage({
    type: 'PARAMS_UPDATED',
    data: audioParams
  });
}

/**
 * Calculate audio for a single particle
 * @param {Object} particleData - Particle data for audio calculation
 * @description Calculates frequency, volume, and panning based on particle state.
 */
function calculateAudio(particleData) {
  const {
    index,
    radius,
    position,
    collisions,
    canvasSize,
    totalLoops
  } = particleData;

  // Calculate frequency based on size and index
  const freqMod = mapRange(
    radius,
    50,
    (canvasSize.width + canvasSize.height) / 3,
    0.8,
    1.5
  );
  const frequency = audioParams.baseFrequency * freqMod + index * 30;

  // Calculate volume based on radius and collisions
  let volume = mapRange(
    radius,
    50,
    (canvasSize.width + canvasSize.height) / 3,
    0.1,
    0.5
  );
  volume = collisions.mouse ? volume * 1.5 : volume;

  // Calculate stereo panning
  const isLandscape = canvasSize.width > canvasSize.height;
  const panValue = isLandscape ? position.x : position.y;
  const maxPan = isLandscape ? canvasSize.width : canvasSize.height;

  const panning = constrainValue(
    mapRange(panValue, 0, maxPan, -1.0, 1.0),
    -1,
    1
  );

  // Determine if sound should play
  const shouldPlay = (collisions.length % 3 === 1 && collisions.clock1 > 160) ||
                     collisions.mouse;

  postMessage({
    type: 'AUDIO_CALCULATED',
    data: {
      index,
      frequency,
      volume,
      panning,
      shouldPlay
    }
  });
}

/**
 * Process batch of audio calculations
 * @param {Object[]} batch - Array of particle data to process
 * @description Efficiently processes multiple particles in one operation.
 */
function processBatch(batch) {
  const results = [];

  for (const particleData of batch) {
    const {
      index,
      radius,
      position,
      collisions,
      canvasSize
    } = particleData;

    const freqMod = mapRange(
      radius,
      50,
      (canvasSize.width + canvasSize.height) / 3,
      0.8,
      1.5
    );
    const frequency = audioParams.baseFrequency * freqMod + index * 30;

    let volume = mapRange(
      radius,
      50,
      (canvasSize.width + canvasSize.height) / 3,
      0.1,
      0.5
    );
    volume = collisions.mouse ? volume * 1.5 : volume;

    const isLandscape = canvasSize.width > canvasSize.height;
    const panValue = isLandscape ? position.x : position.y;
    const maxPan = isLandscape ? canvasSize.width : canvasSize.height;

    const panning = constrainValue(
      mapRange(panValue, 0, maxPan, -1.0, 1.0),
      -1,
      1
    );

    const shouldPlay = (collisions.length % 3 === 1 && collisions.clock1 > 160) ||
                       collisions.mouse;

    results.push({
      index,
      frequency,
      volume,
      panning,
      shouldPlay
    });
  }

  postMessage({
    type: 'BATCH_PROCESSED',
    data: results
  });
}

/**
 * Get worker statistics
 */
function getStats() {
  postMessage({
    type: 'STATS',
    data: {
      audioNodes: audioNodes.length,
      params: audioParams
    }
  });
}

/**
 * Map value from one range to another
 * @param {number} value - Input value
 * @param {number} inMin - Input range minimum
 * @param {number} inMax - Input range maximum
 * @param {number} outMin - Output range minimum
 * @param {number} outMax - Output range maximum
 * @returns {number} Mapped value
 */
function mapRange(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

/**
 * Constrain value within range
 * @param {number} value - Input value
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Constrained value
 */
function constrainValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Clean up worker resources
 */
self.onclose = function() {
  console.log('Audio Worker closing');
  // Cleanup if needed
};
