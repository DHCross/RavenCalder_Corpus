/**
 * SYMBOLIC MOMENT SCHEMA v1.0
 * 
 * The canonical data format for all Symbolic Moment/Weather work.
 * This schema is the stable "language" that both the interpretive layer
 * (Raven's text generation) and the visual layer (Dynamic Poster) can read.
 * 
 * Format: mirror-symbolic-weather-v1
 * 
 * FIELD → MAP → VOICE Translation:
 * - FIELD: Transit aspects (measurable angular geometry)
 * - MAP: House chambers where pressure lands
 * - VOICE: Narrative interpretation of the diagnostic
 */

// ============================================================================
// CORE SCHEMA TYPES
// ============================================================================

/**
 * Root structure for a Symbolic Moment Dashboard export.
 */
export interface SymbolicMomentDashboard {
    // Metadata
    _format: 'mirror-symbolic-weather-v1';
    _version: string;
    _contains_transits: boolean;
    _contains_weather_data: boolean;
    _range_dates: [string, string];  // Start and end dates
    _transit_days: number;
    _natal_sections: number;
    _required_sections: string[];    // e.g., ['person_a']
    generated_at: string;            // ISO timestamp

    // Subject data
    person_a: SubjectData;
    person_b?: SubjectData;          // Optional for synastry

    // Aggregate metrics
    balance_meter: BalanceMeter;

    // Timeline data for phase-change recognition
    timeline: {
        subject_a: Record<string, DaySnapshot>;
        subject_b?: Record<string, DaySnapshot>;
    };
}

/**
 * Subject natal chart and transit data.
 */
export interface SubjectData {
    name: string;
    birth_data: BirthData;
    chart: ChartData;
}

/**
 * Birth coordinates and time data.
 */
export interface BirthData {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    latitude: string;
    longitude: string;
    timezone: string;
    city: string;
    country_code: string;
}

/**
 * Complete natal chart geometry.
 */
export interface ChartData {
    positions: Record<string, PlanetPosition>;
    angles: {
        ascendant: string;
        mc: string;
        descendant: string;
        ic: string;
    };
    houses: HouseChamber[];
    transitsByDate: Record<string, DaySnapshot>;
}

/**
 * Individual planet position.
 */
export interface PlanetPosition {
    sign: string;
    degree: number;
    house: number;
    retrograde: boolean;
}

/**
 * House chamber definition (The 12 Chambers).
 * Uses Woven Map naming conventions.
 */
export interface HouseChamber {
    house: number;
    label: WovenMapHouseName;
    signal_floor: 'low' | 'high';
    ruler: string;
    active_planets: string[];
    state: 'active' | 'ambient';
}

/**
 * Woven Map house names (Mythic Labels).
 * These anchor data to human experience.
 */
export type WovenMapHouseName =
    | 'The Gate'      // 1st - Interface & Vitality
    | 'The Store'     // 2nd - Fuel Tank & Resources
    | 'The Path'      // 3rd - Local Router & Daily Ritual
    | 'The Root'      // 4th - Anchor & Foundation
    | 'The Forge'     // 5th - Engine of Joy & Creative Output
    | 'The Field'     // 6th - Maintenance & Engine Room
    | 'The Mirror'    // 7th - The Other & Reflection
    | 'The Core'      // 8th - Fusion, Debt & Transformation
    | 'The Horizon'   // 9th - The Lens & Long-Range Navigation
    | 'The Canopy'    // 10th - The Roof & Public Legacy
    | 'The Grove'     // 11th - The Network & Community
    | 'The Shell';    // 12th - The Void & Dissolution

/**
 * House metadata with both Math (number) and Myth (name).
 * Follows the Law of Dual Grammar.
 */
export const HOUSE_DICTIONARY: Record<number, {
    mathLabel: string;
    mythLabel: WovenMapHouseName;
    ancestralName: string;
    natalFunction: string;
    weatherFunction: string;
}> = {
    1: {
        mathLabel: '1st House',
        mythLabel: 'The Gate',
        ancestralName: 'The Helm (Horoskopos)',
        natalFunction: 'The Interface. Where the chart steers itself.',
        weatherFunction: 'Vitality Check. Pressure on the hull.',
    },
    2: {
        mathLabel: '2nd House',
        mythLabel: 'The Store',
        ancestralName: 'Gate of Hades',
        natalFunction: 'Fuel Tank. What sustains the life but can be taken away.',
        weatherFunction: 'Resource Load. Do we have the fuel to sustain operations?',
    },
    3: {
        mathLabel: '3rd House',
        mythLabel: 'The Path',
        ancestralName: 'The Goddess (Dea)',
        natalFunction: 'Local Router. Daily ritual and short-range traffic.',
        weatherFunction: 'Signal Jam. Pressure on the nervous system.',
    },
    4: {
        mathLabel: '4th House',
        mythLabel: 'The Root',
        ancestralName: 'The Subterranean (Hypogeion)',
        natalFunction: 'The Anchor. The hidden foundation where the system recharges.',
        weatherFunction: 'Foundation Stress. Issues of security, home, or physical container.',
    },
    5: {
        mathLabel: '5th House',
        mythLabel: 'The Forge',
        ancestralName: 'Good Fortune (Bona Fortuna)',
        natalFunction: 'The Engine of Joy. Creative output, risk, and offspring.',
        weatherFunction: 'Ignition Surge. High creative or erotic pressure.',
    },
    6: {
        mathLabel: '6th House',
        mythLabel: 'The Field',
        ancestralName: 'Bad Fortune (Mala Fortuna)',
        natalFunction: 'Maintenance. Duty, illness, and the grind.',
        weatherFunction: 'System Drag. Friction in the gears, health issues.',
    },
    7: {
        mathLabel: '7th House',
        mythLabel: 'The Mirror',
        ancestralName: 'The Setting Place (Occas)',
        natalFunction: 'The Other. Optical physics where Self disappears into reflection.',
        weatherFunction: 'Relational Torque. Demand to calibrate to another\'s reality.',
    },
    8: {
        mathLabel: '8th House',
        mythLabel: 'The Core',
        ancestralName: 'The Idle Place (Epicataphora)',
        natalFunction: 'Fusion & Debt. High-pressure zone of shared resources.',
        weatherFunction: 'Metamorphic Load. Structural change through fusion or severance.',
    },
    9: {
        mathLabel: '9th House',
        mythLabel: 'The Horizon',
        ancestralName: 'The God (Deus)',
        natalFunction: 'The Lens. Philosophy, foreign travel, Long-Range Navigation.',
        weatherFunction: 'Expansion Vector. Pressure to widen the frame.',
    },
    10: {
        mathLabel: '10th House',
        mythLabel: 'The Canopy',
        ancestralName: 'The Midheaven (Mesourania)',
        natalFunction: 'The Roof. Public legacy, authority, visible summit.',
        weatherFunction: 'Visibility Stress. Burden of being seen or demand to lead.',
    },
    11: {
        mathLabel: '11th House',
        mythLabel: 'The Grove',
        ancestralName: 'Good Spirit (Bonus Spiritus)',
        natalFunction: 'The Network. Allies, hopes, and community support beam.',
        weatherFunction: 'Social Load. Weight of collective expectation or support.',
    },
    12: {
        mathLabel: '12th House',
        mythLabel: 'The Shell',
        ancestralName: 'Bad Spirit (Malus Spiritus)',
        natalFunction: 'The Void. Undoing, dissolution, and system sleep.',
        weatherFunction: 'Ghost Load. Invisible pressure, dreams, the repressed.',
    },
};

// ============================================================================
// SEISMOGRAPH / FIELD METRICS
// ============================================================================

/**
 * Seismograph reading for a single day.
 * The core field diagnostic metrics.
 */
export interface Seismograph {
    magnitude: number;           // 1-10: Volume/intensity of the field
    directional_bias: number;    // -10 to +10: Inward (−) vs Outward (+) tilt
    volatility: number;          // 1-10: Stability vs chaos
    sfd: number;                 // Symbolic Field Density (derived metric)
    drivers: string[];           // Most active aspects (e.g., "Neptune Square Saturn")

    // Separated layer metrics
    symbolicClimate: LayerMetrics;    // Slow movers (long-cycle transits)
    symbolicWeather: LayerMetrics;    // Fast movers (short-cycle transits)

    systemVoltage: number;       // Total energetic load (1-10)
}

/**
 * Metrics for a specific symbolic layer (Climate or Weather).
 */
export interface LayerMetrics {
    magnitude: number;
    valence: number;             // The charge (-/+)
    drivers: string[];           // Aspects driving this layer
}

/**
 * Single day snapshot within the timeline.
 */
export interface DaySnapshot {
    date: string;                // ISO date
    seismograph: Seismograph;
    drivers: string[];           // All active aspects
    event_count: number;         // Number of significant transit events
}

// ============================================================================
// BALANCE METER
// ============================================================================

/**
 * Aggregate Balance Meter for a time range.
 * This is the "at a glance" diagnostic summary.
 */
export interface BalanceMeter {
    magnitude: number;
    directional_bias: number;
    volatility: number;
    sfd: number;

    // Human-readable labels
    magnitude_label: 'Quiet' | 'Moderate' | 'Intense' | 'Peak';
    valence_label: 'Flow' | 'Friction' | 'Neutral';
    volatility_label: 'Stable' | 'Choppy' | 'Volatile' | 'Chaotic';

    // Narrative generation data
    narrative: BalanceNarrative;
}

/**
 * Narrative scaffolding for the Balance Meter.
 */
export interface BalanceNarrative {
    headline: string;            // e.g., "Strong field · Slight inward tilt"
    labelSubtitle: string;       // e.g., "Single-thread storyline"
    voiceLabel: string;          // e.g., "Structural Reset"

    pattern: {
        name: string;            // e.g., "Steady Flow"
        icon: string;            // e.g., "🌊🧘"
        description: string;
        signature: string;       // e.g., "Reliable, gentle progress"
        advice: string;
    };

    story: string;               // Full narrative paragraph

    dimensions: {
        magnitude: DimensionNarrative;
        valence: DimensionNarrative;
        volatility: DimensionNarrative;
    };

    paradox: {
        magnitude: ParadoxPair;
        valence: ParadoxPair;
    };
}

export interface DimensionNarrative {
    value: number;
    label: string;
    meaning: string;
}

export interface ParadoxPair {
    wb: string;     // "When balanced" interpretation
    abe: string;    // "At boundary/edge" interpretation
}

// ============================================================================
// TRANSIT ASPECT TYPES
// ============================================================================

/**
 * Parsed transit aspect with full metadata.
 */
export interface ParsedTransitAspect {
    planet1: string;
    planet2: string;
    aspectType: AspectType;
    orb: number;
    isApplying: boolean;

    // Symbolic classification
    symbolicCharge: 'high_voltage' | 'flow' | 'friction';
    layer: 'climate' | 'weather';    // Slow vs fast mover
}

export type AspectType =
    | 'conjunction'
    | 'opposition'
    | 'square'
    | 'trine'
    | 'sextile'
    | 'quincunx';

/**
 * Aspect symbols for parsing.
 */
export const ASPECT_SYMBOLS: Record<string, AspectType> = {
    '☌': 'conjunction',
    '☍': 'opposition',
    '□': 'square',
    '△': 'trine',
    '⚹': 'sextile',
    '⚻': 'quincunx',
    'Conjunction': 'conjunction',
    'Opposition': 'opposition',
    'Square': 'square',
    'Trine': 'trine',
    'Sextile': 'sextile',
    'Quincunx': 'quincunx',
};

/**
 * Slow movers (generate Symbolic Climate).
 * These form the background "climate" that persists for weeks/months.
 */
export const SLOW_MOVERS = ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Chiron'];

/**
 * Fast movers (generate Symbolic Weather).
 * These create the daily/weekly fluctuations.
 */
export const FAST_MOVERS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get human-readable house name from number.
 */
export function getHouseName(houseNumber: number): WovenMapHouseName {
    return HOUSE_DICTIONARY[houseNumber]?.mythLabel || 'The Gate';
}

/**
 * Get house metadata by number.
 */
export function getHouseMetadata(houseNumber: number) {
    return HOUSE_DICTIONARY[houseNumber];
}

/**
 * Determine if a planet is a slow mover (Climate) or fast mover (Weather).
 */
export function getPlanetLayer(planetName: string): 'climate' | 'weather' {
    return SLOW_MOVERS.includes(planetName) ? 'climate' : 'weather';
}

/**
 * Parse a driver string like "Neptune Square Saturn" into structured data.
 */
export function parseDriverString(driver: string): ParsedTransitAspect | null {
    const parts = driver.split(' ');
    if (parts.length < 3) return null;

    const planet1 = parts[0];
    const aspectStr = parts[1];
    const planet2 = parts.slice(2).join(' ');

    const aspectType = ASPECT_SYMBOLS[aspectStr];
    if (!aspectType) return null;

    const symbolicCharge =
        ['conjunction', 'opposition', 'square'].includes(aspectType) ? 'high_voltage' :
            ['trine', 'sextile'].includes(aspectType) ? 'flow' : 'friction';

    const layer = getPlanetLayer(planet1);

    return {
        planet1,
        planet2,
        aspectType,
        orb: 0, // Would need additional data for exact orb
        isApplying: true, // Would need additional data
        symbolicCharge,
        layer,
    };
}
