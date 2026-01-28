/**
 * Adaptive Poetic Index Card Types
 * Version: 5.3-A
 * 
 * Design Principle: STRUCTURE, NOT VOCABULARY
 * 
 * The schema defines ROLES and FUNCTIONS, not fixed labels.
 * Each generation invents fresh language while preserving architectural grammar.
 * 
 * The card is not a "forecast." It is a mirror for situational geometry —
 * a brief narrative that allows the user to sense alignment, pressure, and possibility.
 * 
 * DISTINCTION NOTE:
 * Poetic Index Cards are distinct from "Insight Cards."
 * While they serve a similar resonant function, Poetic Index Cards are specific
 * architectural objects governed by the Woven Map geometry and this schema (5.3-A).
 */

// ─── VISIBLE LAYER ROLES ───────────────────────────────────────────────────────

/**
 * The visible layer contains roles that must be filled, not fixed terms.
 * The AI generates fresh vocabulary for each card.
 */
export interface VisibleLayer {
  /** 
   * ROLE: Title Layer
   * PURPOSE: Names the central archetypal motion or dilemma
   * GUIDANCE: Mythic or symbolic, not literal. Invent fresh metaphors.
   */
  title: {
    text: string;
    role: 'title_layer';
  };
  
  /** 
   * ROLE: Opening Line (Field Tone)
   * PURPOSE: Creates emotional atmosphere — first sensory impression
   * GUIDANCE: Imagery or rhythm to establish mood. Avoid explanation.
   */
  opening_line: {
    text: string;
    role: 'field_tone';
  };
  
  /** 
   * ROLE: Reflective Question (Voice)
   * PURPOSE: Invites recognition through curiosity
   * GUIDANCE: Open question tuned to geometry. Never command.
   */
  reflective_question: {
    text: string;
    role: 'voice';
  };
  
  /** 
   * ROLE: Integration Cue
   * PURPOSE: Contextualizes within cyclical time or larger framework
   * GUIDANCE: Temporal framing ("During this phase...", "At the hinge...")
   */
  integration_cue: {
    text: string;
    role: 'integration';
  };
  
  /** 
   * ROLE: Visual Symbol (Talisman)
   * PURPOSE: Minimal drawing expressing motion or pressure
   * GUIDANCE: stable→vertical, emotional→fluid, mental→geometric, urgent→dynamic
   */
  visual_symbol: {
    description: string;
    role: 'talisman';
    symbol_logic?: SymbolLogic;
  };
  
  /**
   * ROLE: Shadow Invitation (Optional)
   * PURPOSE: Names the Unclaimed Efficacy — the rejected energy that operates autonomously
   * GUIDANCE: Every light has its shadow. This is not darkness, but displaced voltage.
   * 
   * ARCHITECTURAL PHILOSOPHY:
   * Shadow is NOT "dark side" — it is Unclaimed Efficacy.
   * Energy cannot be destroyed, only displaced. Rejected geometry becomes autonomous.
   * It operates from the basement (12th House) or projects onto others (7th House).
   */
  shadow_invitation?: {
    /** The prompt that names what is being tested */
    prompt: string;
    /** The shadow echo — the part hoping the structure fails */
    echo: string;
    /** The integration path — re-assigning the shadow a job */
    integration_path?: string;
    role: 'shadow_layer';
  };
}

// ─── SYMBOL AND TONE TYPES ────────────────────────────────────────────────────

export type SymbolLogic = 'stable' | 'fluid' | 'geometric' | 'transitional';
export type LoadQuality = 'compressive' | 'expansive' | 'oscillating' | 'neutral';
export type ForceTempo = 'slow' | 'fast';

/**
 * Tone derivation from geometry.
 * The AI interprets data to select appropriate tone.
 */
export type ToneDerivation = 
  | 'compression'   // High magnitude, negative bias
  | 'expansion'     // High magnitude, positive bias
  | 'transition'    // Mixed signals, threshold moments
  | 'stillness'     // Low magnitude, neutral
  | 'oscillation';  // High volatility, rapid changes

// ─── DATA LAYER (Hidden Metadata) ──────────────────────────────────────────────

/**
 * Force distinction: slow structural movement vs. fast activation.
 * Names are placeholders - AI may rephrase dynamically.
 * 
 * Possible naming pairs:
 * - Deep Force / Immediate Force
 * - Root / Branch  
 * - Core / Crest
 * - Tectonic / Surface
 * - Foundation / Trigger
 * - Bass Line / Melody
 */
export interface ForceReading {
  /** The aspect or configuration (e.g., "Neptune Square Saturn") */
  aspect: string;
  /** Magnitude on 0-5 scale */
  magnitude: number;
  /** Whether this is slow-moving (outer) or fast-moving (inner) */
  tempo: ForceTempo;
}

/**
 * System load measurement.
 */
export interface SystemLoad {
  /** Overall energetic pressure (0-10 scale) */
  value: number;
  /** Directional quality of the pressure */
  quality: LoadQuality;
}

/**
 * The data layer ensures traceability and falsifiability.
 * It holds the technical readings that produced the poetic translation.
 */
export interface DataLayer {
  /** Date of the reading */
  date: string;
  /** 
   * Foundational Force: Long-term, slow-moving geometry
   * (outer-planet or systemic influence)
   */
  foundational_force: ForceReading;
  /** 
   * Immediate Force: Short-term activation
   * (inner-planet or rapid cycle) — optional
   */
  immediate_force?: ForceReading;
  /** 
   * System Load: Overall energetic pressure
   */
  system_load: SystemLoad;
  /** Raw geometric sources for falsifiability */
  source_aspects: string[];
  /**
   * Shadow Geometry: The geometric source of the Shadow Invitation
   * (12th House planets, Hard Moon aspects, Oppositions)
   * 
   * SHADOW LOCATION PROTOCOL:
   * - 12th House = "Underwater" (can't see it, only bubbles)
   * - Hard Moon Aspects = Safety system under attack
   * - Oppositions = Projection Engine
   */
  shadow_geometry?: string;
}

// ─── COMPLETE CARD ────────────────────────────────────────────────────────────

export type CardStatus = 
  | 'DRAFT'
  | 'CANONICAL_EXEMPLAR'
  | 'PUBLISHED'
  | 'ARCHIVED';

/**
 * The complete Poetic Index Card.
 * 
 * A modular symbolic object that translates measured geometric data
 * into an emotionally resonant experience.
 */
export interface PoeticIndexCard {
  /** Unique identifier: PIC-{YYYYMMDD}-{SLUG} */
  card_id: string;
  /** Schema version for evolution tracking */
  schema_version: '5.3-A';
  /** Generation timestamp */
  generated_at: string;
  /** Workflow status */
  status?: CardStatus;
  /** Optional note for exemplar cards */
  note?: string;
  /** The poetic translation layer (user-facing) */
  visible: VisibleLayer;
  /** The technical data layer (hidden/fine print) */
  data: DataLayer;
}

// ─── GENERATION INPUT ─────────────────────────────────────────────────────────

/**
 * Input data for card generation from geometric analysis.
 */
export interface CardGenerationInput {
  /** Target date */
  date: string;
  /** All detected aspects */
  source_aspects: string[];
  /** Primary slow-moving geometry */
  foundational_force: {
    aspect: string;
    magnitude: number;
  };
  /** Optional fast-moving trigger */
  immediate_force?: {
    aspect: string;
    magnitude: number;
  };
  /** Overall system pressure */
  system_load: {
    value: number;
    quality: LoadQuality;
  };
  /** Optional user profile for personalization */
  profile?: {
    name?: string;
    sun?: string;
    moon?: string;
  };
}

// ─── ADAPTIVE CONSTANTS ───────────────────────────────────────────────────────

/**
 * Symbol logic mapping based on elemental quality.
 */
export const SYMBOL_LOGIC_MAP = {
  earth: 'stable' as const,      // Vertical, grounded, architectural
  water: 'fluid' as const,       // Flowing, organic, emotional
  air: 'geometric' as const,     // Angular, circuit-like, mental
  fire: 'transitional' as const, // Dynamic, transformative, urgent
};

/**
 * Voice calibration based on magnitude.
 */
export const VOICE_CALIBRATION = {
  low: 'soft, spacious, unhurried',
  moderate: 'present, clear, observational',
  high: 'concise, urgent, pointed',
} as const;

/**
 * Tone derivation rules.
 */
export const TONE_DERIVATION_RULES = {
  compression: { condition: 'High magnitude + negative bias', quality: 'Dense, weighted, pressing' },
  expansion: { condition: 'High magnitude + positive bias', quality: 'Open, lifting, wide' },
  transition: { condition: 'Mixed signals, threshold moments', quality: 'Hinge-like, liminal' },
  stillness: { condition: 'Low magnitude, neutral', quality: 'Spacious, quiet, observational' },
  oscillation: { condition: 'High volatility', quality: 'Flickering, unstable, rapid' },
} as const;

/**
 * Verbs of perception and movement for vocabulary generation.
 */
export const MOVEMENT_VERBS = [
  'drift', 'hum', 'anchor', 'fracture', 'pulse', 'settle', 
  'crack', 'bloom', 'erode', 'rise', 'dissolve', 'crystallize',
  'press', 'lift', 'contract', 'expand', 'oscillate', 'still'
] as const;
