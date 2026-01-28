/**
 * Insight Card Types
 * Version: 3.1 (Raven Calder System)
 * 
 * Frontstage Instrument: The Studio
 * Purpose: Translate symbolic geometry into emotionally legible language.
 * Aesthetic: Wire & Paper
 */

import type { SymbolLogic } from '@/lib/raven/poetic-codex/types';

export type InsightDomain = 'spark' | 'tide' | 'anchor' | 'light';
export type KineticMode = 'vector' | 'current' | 'gravity' | 'aperture';
export type InsightType = 'natal' | 'transit';

// Coherence levels (Vessel Law: Signal Integrity)
export type CoherenceLevel = '🜔' | '🜔🜔' | '🜔🜔🜔';
// Orientation (Vessel Law: Structural Design)
export type Orientation = 'expansive' | 'contractive' | 'steady' | 'reflective';

export interface InsightCard {
  id: string;
  domain: InsightDomain;
  kinetic_mode: KineticMode;
  content: {
    text: string; // ≤ 40 words, second person, present tense
    voice_keyword: string; // e.g., "You begin...", "You feel..."
  };
  footnote: {
    type?: InsightType; // Defaults to 'natal' if undefined
    field: string; // Natal aspect e.g., "Saturn ☍ Venus" OR Transit aspect
    class: KineticMode; // Kinetic archetype

    // BLUEPRINT METRICS (Natal)
    orientation?: Orientation; // Structural design (Expansive/Contractive)
    coherence?: CoherenceLevel; // Signal integrity (🜔/🜔🜔/🜔🜔🜔)

    // WEATHER METRICS (Transit)
    magnitude?: number; // 0-5
    bias?: number; // -5 to +5
    scope?: 'single' | 'multi';

    tone_band: number; // Fidelity measure 0.0-1.0 (for Resonance Trace)
    author_note?: string; // Optional: synthesis note for provenance
    /**
     * Shadow Signature: Optional detection of Unclaimed Efficacy
     * Only populated when the field geometry indicates shadow material:
     * - 12th House placements ("underwater")
     * - Hard Moon aspects ("safety system under attack")
     * - Oppositions ("projection engine")
     * 
     * NOTE: Insight Cards are distinct from Poetic Index Cards.
     * - Insight Cards are real-time resonance captures from conversation.
     * - Poetic Index Cards are architectural mirrors of specific Woven Map geometry.
     * Both may contain shadow material, but Poetic Index Cards include full Shadow Invitations.
     */
    shadow_signature?: {
      location: '12th_house' | 'moon_aspect' | 'opposition' | 'saturn_prominence' | 'neptune_prominence' | 'uranus_tension';
      inversion_type?: 'competence_trap' | 'martyr_loop' | 'volatility_leak';
    };
  };
  timestamp: string;
}

export const DOMAIN_MAPPINGS: Record<InsightDomain, {
  mode: KineticMode;
  element: string;
  focus: string;
  keyword: string;
  color_logic: string; // Reference to Color Ecology
  symbol_logic_bridge: SymbolLogic; // Maps to Poetic Codex logic
}> = {
  spark: {
    mode: 'vector',
    element: 'fire',
    focus: 'Impulse, Ignition, Action, Risk',
    keyword: 'You begin...',
    color_logic: 'Amber-gold',
    symbol_logic_bridge: 'transitional' // Fire
  },
  tide: {
    mode: 'current',
    element: 'water',
    focus: 'Emotion, Rhythm, Release, Grief',
    keyword: 'You feel...',
    color_logic: 'Sage-green',
    symbol_logic_bridge: 'fluid' // Water
  },
  anchor: {
    mode: 'gravity',
    element: 'earth',
    focus: 'Structure, Body, Endurance, Wait',
    keyword: 'You hold...',
    color_logic: 'Coral-black',
    symbol_logic_bridge: 'stable' // Earth
  },
  light: {
    mode: 'aperture',
    element: 'air',
    focus: 'Perception, Clarity, Witness, Idea',
    keyword: 'You see...',
    color_logic: 'Blue-gray',
    symbol_logic_bridge: 'geometric' // Air
  }
};

// Map Kinetic Modes to visual/sculptural symbols (for UI)
export const KINETIC_SYMBOLS: Record<KineticMode, {
  function: string;
  sculptural_symbol: string; // Description for UI implementation
  tone: string;
}> = {
  aperture: {
    function: 'Observation / Reception',
    sculptural_symbol: 'Unclosed circle',
    tone: 'Spacious, receptive'
  },
  vector: {
    function: 'Direction / Intention',
    sculptural_symbol: 'Counterweighted line',
    tone: 'Leaning, decisive'
  },
  gravity: {
    function: 'Containment / Centering',
    sculptural_symbol: 'Stone or nested circles',
    tone: 'Grounded, anchoring'
  },
  current: {
    function: 'Integration / Movement',
    sculptural_symbol: 'Bent wire',
    tone: 'Flowing, continuous'
  }
};
