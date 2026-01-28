import { AspectType } from './mathbrain/synastry-types';

/**
 * RTMS v2.0.1 - Relational Target Mapping System (Natal Architecture Edition)
 * 
 * CORE DOCTRINE:
 * Measures structural compatibility between two Constitutional Blueprints.
 * Strictly excludes weather, transits, and temporal triggers.
 * Domain: Architecture of potential resonance.
 */

// ============================================================================
// 1. DATA STRUCTURES & DOMAIN MODEL
// ============================================================================

export type ResonanceClass = 'WB' | 'ABE' | 'OSR'; // Within Boundary, At Boundary Edge, Outside Symbolic Range

export type ChamberID =
    | '01' | '02' | '03' | '04' | '05' | '06'
    | '07' | '08' | '09' | '10' | '11' | '12';

export const CHAMBER_FUNCTIONS: Record<ChamberID, string> = {
    '01': 'Motor Drive',
    '02': 'Stability / Resource Rhythm',
    '03': 'Communication Circuit',
    '04': 'Emotional Infrastructure',
    '05': 'Creative Self / Ego Expression',
    '06': 'Refinement / System Maintenance',
    '07': 'Relational Orientation',
    '08': 'Depth / Fusion Threshold',
    '09': 'Ideation / Expansion Logic',
    '10': 'Authority / Structural Output',
    '11': 'Innovation / Group Logic',
    '12': 'Dissolution / Boundary Permeability'
};

export type PlanetId = 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto' | 'Ascendant' | 'Midheaven' | 'NorthNode';
export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';
export type Modality = 'Cardinal' | 'Fixed' | 'Mutable';
export type SignId = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export interface PlanetaryPosition {
    id: PlanetId;
    sign: SignId;
    degree: number; // 0-30 within sign
    absoluteDegree: number; // 0-360 zodiacal longitude
}

export interface ConstitutionalBlueprint {
    name: string;
    positions: PlanetaryPosition[];
    // Future: house cusps (optional for now per Minimum Viable Input rules)
}

// Relational Vector: The atomic unit of structural resonance
export interface RelationalVector {
    chamberId: ChamberID;
    resonanceClass: ResonanceClass; // WB / ABE / OSR
    vectorType: 'Reinforcement' | 'Polarity Complement' | 'Structural Dissonance';
    magnitude: number; // 0-5 strength of this specific vector
    primaryContact?: string; // e.g. "Sun-Moon Conjunction"
}

export interface RelationalOverlay {
    chartA: string;
    chartB: string;
    vectors: Record<ChamberID, RelationalVector>;
    metrics: {
        magnitude: number; // 0-5
        directionalBias: number; // -5 to +5
    };
    reflection: {
        hook: string;
        summary: string;
        question: string;
    };
}

// ============================================================================
// 2. HELPERS & LOOKUPS
// ============================================================================

const SIGN_DATA: Record<SignId, { element: Element; modality: Modality }> = {
    'Aries': { element: 'Fire', modality: 'Cardinal' },
    'Taurus': { element: 'Earth', modality: 'Fixed' },
    'Gemini': { element: 'Air', modality: 'Mutable' },
    'Cancer': { element: 'Water', modality: 'Cardinal' },
    'Leo': { element: 'Fire', modality: 'Fixed' },
    'Virgo': { element: 'Earth', modality: 'Mutable' },
    'Libra': { element: 'Air', modality: 'Cardinal' },
    'Scorpio': { element: 'Water', modality: 'Fixed' },
    'Sagittarius': { element: 'Fire', modality: 'Mutable' },
    'Capricorn': { element: 'Earth', modality: 'Cardinal' },
    'Aquarius': { element: 'Air', modality: 'Fixed' },
    'Pisces': { element: 'Water', modality: 'Mutable' }
};

const OPPOSITES: Record<SignId, SignId> = {
    'Aries': 'Libra', 'Libra': 'Aries',
    'Taurus': 'Scorpio', 'Scorpio': 'Taurus',
    'Gemini': 'Sagittarius', 'Sagittarius': 'Gemini',
    'Cancer': 'Capricorn', 'Capricorn': 'Cancer',
    'Leo': 'Aquarius', 'Aquarius': 'Leo',
    'Virgo': 'Pisces', 'Pisces': 'Virgo'
};

const CHAMBER_MAP: Record<ChamberID, SignId> = {
    '01': 'Aries', '02': 'Taurus', '03': 'Gemini', '04': 'Cancer',
    '05': 'Leo', '06': 'Virgo', '07': 'Libra', '08': 'Scorpio',
    '09': 'Sagittarius', '10': 'Capricorn', '11': 'Aquarius', '12': 'Pisces'
};

// Weights for "Highest Magnitude Wins" rule (Appendix A)
const PLANET_WEIGHTS: Record<PlanetId, number> = {
    'Sun': 3.0, 'Moon': 3.0, 'Ascendant': 3.0,
    'Midheaven': 2.0, 'Mercury': 2.0, 'Venus': 2.0, 'Mars': 2.0,
    'Jupiter': 1.5, 'Saturn': 1.5,
    'Uranus': 1.0, 'Neptune': 1.0, 'Pluto': 1.0, 'NorthNode': 1.0
};

// ============================================================================
// 3. CORE LOGIC: calculateOverlay
// ============================================================================

export function calculateOverlay(
    chartA: ConstitutionalBlueprint,
    chartB: ConstitutionalBlueprint
): RelationalOverlay {

    // 1. Calculate Vectors for each Chamber
    const vectors: Record<ChamberID, RelationalVector> = {} as any;
    const aspectHits: Array<{ weight: number; elementA: Element; elementB: Element }> = [];

    // Iterate through all 12 chambers (Archetypal method if houses are unknown)
    // We treat the "Chamber" as the domain governed by its natural ruler (Aries=1st, etc)
    // This allows chart comparison even without accurate birth times for Houses.
    // Ideally, if we have houses, we map planets into ACTUAL houses.
    // For V2.0 MVP (Minimum Viable Input), we use Natural Houses (Aries=1).

    (Object.keys(CHAMBER_MAP) as ChamberID[]).forEach(chamberId => {
        const naturalSign = CHAMBER_MAP[chamberId];

        // Find planets in this sign for both charts
        const planetsA = chartA.positions.filter(p => p.sign === naturalSign);
        const planetsB = chartB.positions.filter(p => p.sign === naturalSign);

        // Also check if Chart B has planets in the OPPOSITE sign (Polarity)
        const oppositeSign = OPPOSITES[naturalSign];
        const planetsBOpposite = chartB.positions.filter(p => p.sign === oppositeSign);

        // Assess Resonance
        vectors[chamberId] = assessChamberResonance(chamberId, planetsA, planetsB, planetsBOpposite);

        // Collect hits for metrics calculation (if planets exist involved in the vector)
        // We do a simplified n^2 check for aspects across the whole chart for magnitude
    });

    // 2. Calculate Global Metrics (Full Chart Aspects)
    // We re-run a full n^2 absoluteDegree check to get accurate Magnitude
    chartA.positions.forEach(pA => {
        chartB.positions.forEach(pB => {
            const diff = Math.abs(pA.absoluteDegree - pB.absoluteDegree);
            const dist = Math.min(diff, 360 - diff);

            // Check for major aspects
            let aspectWeight = 0;
            if (dist <= 10) aspectWeight = 3.0; // Conjunction (loose orb for structural resonance)
            else if (dist >= 170 && dist <= 190) aspectWeight = 3.0; // Opposition
            else if (dist >= 80 && dist <= 100) aspectWeight = 1.5; // Square
            else if (dist >= 110 && dist <= 130) aspectWeight = 2.0; // Trine
            else if (dist >= 50 && dist <= 70) aspectWeight = 1.0; // Sextile

            if (aspectWeight > 0) {
                const combinedWeight = (PLANET_WEIGHTS[pA.id] + PLANET_WEIGHTS[pB.id]) / 2 * aspectWeight;
                const elA = SIGN_DATA[pA.sign].element;
                const elB = SIGN_DATA[pB.sign].element;
                aspectHits.push({ weight: combinedWeight, elementA: elA, elementB: elB });
            }
        });
    });

    const metrics = calculateStructuralMetrics(aspectHits);
    const reflection = generatePlainVoiceReflection(metrics, vectors);

    return {
        chartA: chartA.name,
        chartB: chartB.name,
        vectors,
        metrics,
        reflection
    };
}

// ============================================================================
// 4. VECTOR LOGIC
// ============================================================================

function assessChamberResonance(
    chamberId: ChamberID,
    planetsA: PlanetaryPosition[],
    planetsB: PlanetaryPosition[],
    planetsBOpposite: PlanetaryPosition[]
): RelationalVector {
    // 1. Reinforcement (Conjunctions/Same Sign)
    let maxReinforcement = 0;
    if (planetsA.length > 0 && planetsB.length > 0) {
        // High Reinforcement
        maxReinforcement = 4.0 + (planetsA.length + planetsB.length);
    } else if (planetsA.length > 0 || planetsB.length > 0) {
        // One-sided activation (Lower reinforcement)
        maxReinforcement = 1.0;
    }

    // 2. Polarity (Oppositions)
    let maxPolarity = 0;
    if (planetsA.length > 0 && planetsBOpposite.length > 0) {
        maxPolarity = 4.5 + (planetsA.length + planetsBOpposite.length);
    }

    // 3. Dominance Rule (Highest Magnitude Wins)
    if (maxPolarity > maxReinforcement && maxPolarity > 2.0) {
        return {
            chamberId,
            resonanceClass: 'ABE',
            vectorType: 'Polarity Complement',
            magnitude: Math.min(maxPolarity, 5),
            primaryContact: 'Axial Activation'
        };
    } else if (maxReinforcement > 2.0) {
        return {
            chamberId,
            resonanceClass: 'WB',
            vectorType: 'Reinforcement',
            magnitude: Math.min(maxReinforcement, 5),
            primaryContact: 'Co-Presence'
        };
    }

    // Default: If no major activity, it's neutral, but if we need a classification:
    // We check purely elemental affinity mapping of the charts' luminaries generally?
    // For MVP, if a chamber is empty in both, it's Low Magnitude WB (Neutral).
    return {
        chamberId,
        resonanceClass: 'WB',
        vectorType: 'Reinforcement', // Default assumption of empty space = peace
        magnitude: 0.5,
        primaryContact: 'Quiet Zone'
    };
}

// ============================================================================
// 5. METRICS CALCULATION (Appendix A)
// ============================================================================

function calculateStructuralMetrics(hits: Array<{ weight: number; elementA: Element; elementB: Element }>) {
    // 1. Magnitude Calculation
    const totalWeight = hits.reduce((acc, hit) => acc + hit.weight, 0);
    // Normalization: Divider chosen to map typical synastry scores to 0-5 range
    // A "busy" chart pair might have 100+ raw weight.
    // Fixed saturation issue (flatline at 5.0) by increasing divisor from 25 to 45
    const magnitude = Math.min(totalWeight / 45, 5.0);

    // 2. Directional Bias Calculation
    let biasTotal = 0;
    hits.forEach(hit => {
        const isExpansive = (el: Element) => el === 'Fire' || el === 'Air';
        const valA = isExpansive(hit.elementA) ? 1 : -1;
        const valB = isExpansive(hit.elementB) ? 1 : -1;

        // If elements agree, stronger push in that direction
        // If they disagree, they behave neutrally (0)
        if (valA === valB) {
            biasTotal += valA * (hit.weight / 10); // Scale by weight
        }
    });

    // Clamp Bias -5 to +5
    const directionalBias = Math.max(-5, Math.min(5, biasTotal));

    return {
        magnitude: parseFloat(magnitude.toFixed(1)),
        directionalBias: parseFloat(directionalBias.toFixed(1))
    };
}

// ============================================================================
// 6. VOICE SYNTHESIS (Plain Mirror)
// ============================================================================

function generatePlainVoiceReflection(
    metrics: { magnitude: number; directionalBias: number },
    vectors: Record<ChamberID, RelationalVector>
): { hook: string; summary: string; question: string } {

    // Hook Logic based on Bias & Magnitude
    let hook = "";
    const friction = metrics.magnitude > 3.5 ? "high-torque" : "steady-state";
    const biasType = metrics.directionalBias > 0 ? "outward projection" : "internal cohesion";

    hook = `Shared geometry emphasizes ${friction} interaction under ${biasType}.`;

    // Summary Logic based on Magnitude
    let summary = "";
    if (metrics.magnitude > 4.0) {
        summary = " The structural density is high, creating a 'locked-in' feel where every movement registers.";
    } else if (metrics.magnitude < 2.0) {
        summary = " The structural density is spacious, allowing both systems to move without constant friction.";
    } else {
        summary = " The structural contacts are steady—neither overwhelming nor distant.";
    }

    // Question Logic - SUPPRESSED for Static Reports
    const question = "";

    return { hook, summary, question };
}
