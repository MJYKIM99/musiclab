/**
 * Type definitions for Ocean Loop project
 * @description Global type definitions and interfaces for the project
 */

/**
 * Collision information object
 */
interface CollisionInfo {
  mouse: boolean;
  [key: string]: any;
}

/**
 * Loop particle interface
 * @description Represents a single animated particle with physics and audio properties
 */
interface LoopInterface {
  /** Position vector */
  pos: p5.Vector;
  /** Velocity vector */
  velocity: p5.Vector;
  /** Current radius */
  r: number;
  /** Initial radius */
  rInit: number;
  /** Whether the particle is shrinking */
  shrink: boolean;
  /** Whether the particle is growing */
  bigger: boolean;
  /** Animation clock value */
  clock: number;
  /** Secondary animation clock value */
  clock1: number;
  /** Array of collision references */
  collisions: (LoopInterface | CollisionInfo)[];
  /** Creation timestamp */
  startTime: number;
  /** Color hue value */
  hue: number;
}

/**
 * Audio oscillator configuration
 */
interface OscillatorConfig {
  oscillator: p5.Oscillator;
  envelope: p5.Envelope;
  index: number;
}

/**
 * Global state interface
 */
interface GlobalState {
  loops: LoopInterface[];
  oscillators: p5.Oscillator[];
  envelopes: p5.Envelope[];
  reverb: p5.Reverb;
  radiusPreview: number;
  radiusState: number;
}

/**
 * Audio settings constants
 */
interface AudioSettings {
  MAX_OSCILLATORS: number;
  BASE_FREQUENCY: number;
}

/**
 * Visual settings constants
 */
interface VisualSettings {
  backgroundColor: number;
  bgAlpha: number;
}

/**
 * Shape calculation parameters
 */
interface ShapeParams {
  r: number;
  angle: number;
  clock1: number;
  clock: number;
  totalLoops: number;
  amp: number;
}

/**
 * Shape calculation result
 */
type ShapeResult = number;

/**
 * Shape mode enum
 */
enum ShapeMode {
  SPINNING_SINE = 0,
  NOISE_ANTENNA = 1,
  NOISE_DOTS = 2,
  PURE_NOISE = 3,
  COMPLEX_NOISE = 4,
  TANGENT_ORGANIC = 5
}

/**
 * Waveform type
 */
type WaveformType = 'sine' | 'triangle' | 'sawtooth' | 'square';

/**
 * Color mode
 */
type ColorMode = 'RGB' | 'HSB' | 'HSL';

/**
 * Event handler types
 */
type EventHandler = () => void | boolean;
type KeyEventHandler = (key: string, keyCode: number) => void | boolean;
type MouseEventHandler = (event: MouseEvent) => void | boolean;
type TouchEventHandler = (event: TouchEvent) => void | boolean;

/**
 * File extension declarations for p5.js
 */
declare module 'p5' {
  export default class p5 {
    sound: any;
  }
}

declare module 'p5/global' {
  import p5 from 'p5';
  export const p5: p5;
}

/**
 * Global type declarations
 */
declare global {
  /** Array of active loop particles */
  const loops: LoopInterface[];

  /** Array of pre-allocated oscillators */
  const oscillators: p5.Oscillator[];

  /** Array of envelope generators */
  const envelopes: p5.Envelope[];

  /** Reverb effect processor */
  const reverb: p5.Reverb;

  /** Preview radius for particle creation */
  let radiusPreview: number;

  /** State for radius animation */
  let radiusState: number;

  /** Maximum number of oscillators */
  const MAX_OSCILLATORS: number;

  /** Base frequency in Hz */
  const BASE_FREQUENCY: number;

  /** Background color value */
  let backgroundColor: number;

  /** Background alpha transparency */
  let bgAlpha: number;
}

export {};
