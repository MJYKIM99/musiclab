/**
 * @file Object Pool System
 * @description High-performance object pooling for particle management to reduce
 * garbage collection pressure and improve frame rate stability.
 * @version 1.0.0
 */

/**
 * Object Pool for Loop particles
 * @class
 * @description Manages a pool of reusable Loop objects to minimize GC overhead.
 * Particles are recycled instead of created/destroyed repeatedly.
 */
class LoopPool {
  /**
   * Create a new object pool
   * @param {number} initialSize - Initial number of pre-allocated objects
   * @param {number} maxSize - Maximum pool size (default: 100)
   * @description Initializes the pool with pre-allocated Loop objects.
   */
  constructor(initialSize = 20, maxSize = 100) {
    /** @type {Loop[]} Array of available objects in the pool */
    this.available = [];

    /** @type {Loop[]} Array of active objects currently in use */
    this.active = [];

    /** @type {number} Maximum pool size */
    this.maxSize = maxSize;

    /** @type {number} Total number of objects created */
    this.totalCreated = 0;

    // Pre-allocate initial objects
    for (let i = 0; i < initialSize; i++) {
      const obj = this._createObject();
      this.available.push(obj);
    }

    console.log(`LoopPool initialized with ${initialSize} objects (max: ${maxSize})`);
  }

  /**
   * Acquire an object from the pool
   * @param {number} radius - Initial radius for the Loop
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {Loop} A configured Loop object ready for use
   * @description Returns an available object from the pool or creates a new one
   * if the pool is empty and hasn't reached max size.
   */
  acquire(radius, x, y) {
    let obj;

    if (this.available.length > 0) {
      // Reuse existing object
      obj = this.available.pop();
      this._resetObject(obj, radius, x, y);
    } else if (this.active.length < this.maxSize) {
      // Create new object if under max size
      obj = this._createObject();
      this._resetObject(obj, radius, x, y);
      this.totalCreated++;
    } else {
      // Pool exhausted, recycle oldest active object
      console.warn('LoopPool exhausted, recycling oldest object');
      obj = this.active.shift();
      this._resetObject(obj, radius, x, y);
    }

    this.active.push(obj);
    return obj;
  }

  /**
   * Release an object back to the pool
   * @param {Loop} obj - The object to release
   * @description Returns an object to the available pool for reuse.
   * Objects are cleaned before being returned to the pool.
   */
  release(obj) {
    const index = this.active.indexOf(obj);
    if (index !== -1) {
      this.active.splice(index, 1);
      this._cleanObject(obj);
      this.available.push(obj);
    }
  }

  /**
   * Release multiple objects at once
   * @param {Loop[]} objects - Array of objects to release
   * @description Efficiently releases multiple objects back to the pool.
   */
  releaseMultiple(objects) {
    for (const obj of objects) {
      this.release(obj);
    }
  }

  /**
   * Get current pool statistics
   * @returns {Object} Statistics object with pool metrics
   * @description Returns current pool state including available, active,
   * and total created counts.
   */
  getStats() {
    return {
      available: this.available.length,
      active: this.active.length,
      total: this.available.length + this.active.length,
      totalCreated: this.totalCreated,
      utilization: (this.active.length / this.maxSize * 100).toFixed(1) + '%'
    };
  }

  /**
   * Clear all active objects
   * @description Releases all active objects back to the pool.
   */
  clear() {
    while (this.active.length > 0) {
      const obj = this.active.pop();
      this._cleanObject(obj);
      this.available.push(obj);
    }
  }

  /**
   * Create a new Loop object (internal)
   * @private
   * @returns {Loop} A new Loop instance
   * @description Internal method for creating new Loop objects.
   */
  _createObject() {
    // Create with default values, will be reset on acquire
    return new Loop(100, 0, 0);
  }

  /**
   * Reset an object for reuse (internal)
   * @private
   * @param {Loop} obj - Object to reset
   * @param {number} radius - New radius
   * @param {number} x - New X position
   * @param {number} y - New Y position
   * @description Resets object properties for reuse without creating new instance.
   */
  _resetObject(obj, radius, x, y) {
    obj.pos.set(x, y);
    obj.velocity = createVector(random(-3, 3), random(-3, 3));
    obj.r = radius;
    obj.rInit = radius;
    obj.shrink = false;
    obj.bigger = false;
    obj.clock = random(140, 240);
    obj.clock1 = obj.clock;
    obj.collisions = [];
    obj.startTime = millis();
    obj.hue = random(360);
  }

  /**
   * Clean an object before returning to pool (internal)
   * @private
   * @param {Loop} obj - Object to clean
   * @description Performs cleanup tasks on object before pooling.
   */
  _cleanObject(obj) {
    obj.collisions = [];
    obj.shrink = false;
    obj.bigger = false;
  }
}

/**
 * Audio Pool for managing oscillators
 * @class
 * @description Pre-allocates and manages audio oscillators for better performance.
 */
class AudioPool {
  /**
   * Create a new audio pool
   * @param {number} size - Number of oscillators to pre-allocate
   * @description Pre-creates oscillators with envelopes for immediate use.
   */
  constructor(size = 40) {
    /** @type {p5.Oscillator[]} Array of oscillators */
    this.oscillators = [];

    /** @type {p5.Envelope[]} Array of envelopes */
    this.envelopes = [];

    /** @type {number} Pool size */
    this.size = size;

    /** @type {number} Next available index */
    this.nextIndex = 0;

    this._initialize();
  }

  /**
   * Initialize the audio pool
   * @private
   * @description Creates all oscillators and envelopes upfront.
   */
  _initialize() {
    const BASE_FREQUENCY = 200;
    const waveTypes = ['sine', 'triangle', 'sawtooth', 'square'];

    for (let i = 0; i < this.size; i++) {
      const osc = new p5.Oscillator();
      osc.setType(waveTypes[i % waveTypes.length]);
      osc.freq(BASE_FREQUENCY + (i * 50) % 800);
      osc.amp(0);
      osc.start();

      const env = new p5.Envelope();
      env.setADSR(0.5, 0.3, 0.4, 1.0);
      env.setRange(0.3, 0);

      this.oscillators.push(osc);
      this.envelopes.push(env);
    }

    console.log(`AudioPool initialized with ${size} oscillators`);
  }

  /**
   * Get the next available oscillator
   * @returns {Object} Object containing oscillator and envelope
   * @description Returns the next available oscillator in a round-robin fashion.
   */
  getNext() {
    const index = this.nextIndex;
    this.nextIndex = (this.nextIndex + 1) % this.size;

    return {
      oscillator: this.oscillators[index],
      envelope: this.envelopes[index],
      index: index
    };
  }

  /**
   * Get oscillator at specific index
   * @param {number} index - Oscillator index
   * @returns {p5.Oscillator|null} The oscillator at index or null
   * @description Direct access to a specific oscillator by index.
   */
  getOscillator(index) {
    if (index >= 0 && index < this.oscillators.length) {
      return this.oscillators[index];
    }
    return null;
  }

  /**
   * Stop all oscillators
   * @description Fades out all oscillators to silence.
   */
  stopAll() {
    for (const osc of this.oscillators) {
      osc.amp(0, 0.1);
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LoopPool, AudioPool };
}
