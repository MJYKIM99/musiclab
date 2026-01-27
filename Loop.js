/**
 * @file Loop Class - Particle System
 * @description Represents a particle with visual and audio properties.
 * Each Loop object is an animated shape that interacts with other loops
 * and responds to mouse/touch input.
 * @version 1.1.0
 */

/**
 * Loop Class - Animated particle with collision detection
 * @class
 * @description Creates and manages animated particle loops with physics,
 * collision detection, and dynamic visual rendering based on mathematical patterns.
 */
class Loop {
  /**
   * Create a new Loop particle
   * @param {number} radius - Initial radius of the particle
   * @param {number} x - X coordinate position
   * @param {number} y - Y coordinate position
   * @description Initializes a new particle with random velocity, size,
   * animation clocks, and collision tracking.
   */
  constructor(radius, x, y) {
    // Position and movement
    this.pos = createVector(x, y);
    this.velocity = createVector(random(-3, 3), random(-3, 3));

    // Size properties
    this.r = radius;
    this.rInit = radius;
    this.shrink = false;
    this.bigger = false;

    // Visual animation clocks
    this.clock = random(140, 240);
    this.clock1 = this.clock;

    // Collision tracking
    this.collisions = [];

    // Timing
    this.startTime = millis();

    // Color (for variation)
    this.hue = random(360);
  }

  /**
   * Update particle state - movement, growth, shrinking
   * @description Updates the particle's physics including position, size,
   * and boundary conditions. Handles shrinking, growth, and movement timing.
   */
  update() {
    // Check if particle is out of bounds
    if (!(this.pos.x > 0 && this.pos.x < width &&
          this.pos.y > 0 && this.pos.y < height)) {
      this.shrink = true;
    }

    // Shrink if too large
    if (this.r > (width + height) / 3 - 50) {
      this.shrink = true;
    }

    // Handle shrinking
    if (this.shrink) {
      this.collisions.length = 0;
      if (this.r > 0.9) {
        this.r -= 1 * this.clock1 / 180;
      }
      this.collisions.mouse = false;
    }

    // Handle growth
    if (this.bigger) {
      this.r += 3;
    }

    // Move particle after initial period or many collisions
    if (this.clock1 < 170 ||
        this.collisions.length > 13 ||
        millis() - this.startTime > 7000) {
      this.pos.add(this.velocity);
    }
  }

  /**
   * Display the particle with dynamic shape based on clock state
   * @param {Loop[]} allLoops - Array of all active loops for context
   * @param {number} audioAmplitude - Current audio amplitude for visual effects
   * @description Renders the particle with dynamic colors, shapes, and effects
   * based on collision state, audio amplitude, and animation clock.
   */
  display(allLoops, audioAmplitude) {
    push();

    // Fill settings based on size
    if (this.r < width / 6) {
      fill(255, 1);
    } else {
      noFill();
    }

    // Stroke color based on collision state
    if ((this.collisions.length % 3 === 1 && this.clock1 > 160) ||
        this.collisions.mouse) {
      // Colorful when colliding
      stroke(
        random(0, 255),
        random(0, 255),
        random(0, 255),
        this.clock1 / 1.5 + 30 + audioAmplitude * 150
      );
    } else {
      // White when normal
      if (this.shrink) {
        stroke(255, this.clock1 / 10 + 30);
      } else {
        stroke(255, this.r / 2 + audioAmplitude * 150 + 20);
      }
    }

    // Draw the shape
    beginShape();
    translate(this.pos.x, this.pos.y);

    for (let i = 0; i < TWO_PI; i += 0.07) {
      this.clock += 0.0002 * this.clock1 / 200;

      // Rotate when clock is high
      if (this.clock1 > 180) {
        rotate(noise(this.clock / 5, i) / 10 + this.clock1 / 3 + audioAmplitude / 100);
      }

      // Grow slightly while young
      if (this.clock1 < 170 && Math.random() > 0.5) {
        this.r += 0.1;
      }

      // Calculate point position using shape function
      let x = this.calculateShape(this.r, i, this.clock1, this.clock, allLoops.length, audioAmplitude);
      let y = this.r * sin(i);

      // Add vertices conditionally
      if (this.clock1 < 150 && noise(this.clock, i) > 0.8) {
        vertex(y, x);
      }

      // Draw points with dynamic stroke weight
      strokeWeight(
        1.5 / 1000 * (width + height) / 2 *
        this.clock1 / 255 * pixelDensity() *
        map(this.clock1, 140, 240, 0.7, 1.3)
      );
      point(x + i, y + i);

      // Add noisy vertices when clock is high
      if (this.clock1 > 200) {
        vertex(y + noise(i, this.clock) * 5, x + noise(i) * 100);
      }
    }

    if (Math.random() > 0.2) {
      strokeWeight(1);
    }
    endShape();
    pop();
  }

  /**
   * Calculate shape based on different mathematical patterns
   * @param {number} r - Radius of the particle
   * @param {number} angle - Current angle in the shape calculation
   * @param {number} clock1 - Primary animation clock value
   * @param {number} clock - Secondary animation clock value
   * @param {number} totalLoops - Total number of active loops
   * @param {number} amp - Audio amplitude for modulation
   * @returns {number} Calculated shape offset value
   * @description Implements 6 different mathematical pattern modes for
   * visual variety including sine waves, noise patterns, and organic shapes.
   */
  calculateShape(r, angle, clock1, clock, totalLoops, amp) {
    let mode = Math.floor(clock1 + totalLoops / 2) % 6;

    switch (mode) {
      case 0: // Spinning sine wave circle
        return angle / TWO_PI * clock1 / 5 +
               r * sin(frameCount / (800 * amp + 1) * totalLoops + clock) * cos(angle);

      case 1: // Noise antenna
        return angle / TWO_PI * clock1 / 5 * r *
               noise(clock / 500, angle / 50) * noise(angle / 50);

      case 2: // Noise dots and lines
        return angle / TWO_PI * clock1 / 6 +
               noise(clock / 5) * r * sin(frameCount / clock1 + clock) * cos(angle);

      case 3: // Pure noise shape
        return noise(angle) * r * sin(frameCount / 40 + clock) * cos(angle);

      case 4: // Complex noise pattern
        return noise(angle, clock) * pow(r / 2, 2) * cos(clock / 1000) * angle;

      case 5: // Tangent-based organic shape
        return noise(sin(angle), cos(angle)) * (r / 4) * pow(angle, 2) * tan(clock + 1);

      default:
        return r * cos(angle);
    }
  }

  /**
   * Check for collisions with other loops and mouse
   * @param {Loop[]} allLoops - Array of all loops to check against
   * @description Detects and tracks collisions with other particles and
   * the mouse cursor. Updates the collisions array for audio triggering.
   */
  checkCollisions(allLoops) {
    for (let i = 0; i < allLoops.length; i++) {
      if (this !== allLoops[i]) {
        let distance = p5.Vector.dist(this.pos, allLoops[i].pos);

        // Check mouse collision
        this.collisions.mouse = p5.Vector.dist(
          this.pos,
          createVector(mouseX, mouseY)
        ) < this.r;

        // Check loop-to-loop collision
        if (distance < this.r + allLoops[i].r &&
            this.collisions.indexOf(allLoops[i]) === -1 &&
            distance > 5) {
          this.collisions.push(allLoops[i]);
        }
      }
    }
  }

  /**
   * Check if particle should be removed
   * @returns {boolean} True if particle radius is below 0.5
   * @description Determines if a particle has shrunk small enough to be
   * removed from the simulation and recycled.
   */
  isDead() {
    return this.r < 0.5;
  }
}
