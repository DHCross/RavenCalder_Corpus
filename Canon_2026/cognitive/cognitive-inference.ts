/**
 * COGNITIVE ARCHITECTURE INFERENCE ENGINE
 * 
 * Implements MBTI INFERENCE PROTOCOL v1.5 (Sealed Architecture)
 * Derives cognitive architecture from natal chart geometry.
 * 
 * "We do not ask the patient to calibrate the MRI. We just run the scan."
 * 
 * ALLOWED INPUTS (Interior Compass):
 * - Moon (all) - Primary for E/I and T/F
 * - Saturn - Secondary bias for E/I, J/P  
 * - Sun element/modality - For N/S and J/P (NOT expression)
 * - Mercury element - For N/S (NOT tempo)
 * - MC/IC tone, 4th/8th/12th houses (future)
 * 
 * FORBIDDEN INPUTS (Contact Resonance - firewalled):
 * - Ascendant (never for type)
 * - Sun charisma/expression
 * - Mars ignition
 * - Mercury tempo
 * 
 * Output is stored in profile.cognitiveArchitecture but NEVER shown to users as letters.
 * Raven uses this to guide interpretation without naming MBTI codes.
 */

export type ElementType = 'Fire' | 'Earth' | 'Air' | 'Water';
export type ModalityType = 'Cardinal' | 'Fixed' | 'Mutable';
export type SignId = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 
                     'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

// Confidence levels per v1.5 - includes HINGE state
export type AxisConfidence = 'strong' | 'clear' | 'soft' | 'hinge';

interface ChartPositions {
    Sun?: { sign: SignId };
    Moon?: { sign: SignId };
    Mercury?: { sign: SignId; retrograde?: boolean };
    Venus?: { sign: SignId };
    Mars?: { sign: SignId };
    Saturn?: { sign: SignId };
    // Ascendant intentionally NOT used for type (Contact Resonance firewall)
}

export interface CognitiveArchitecture {
    // Primary axis tensions (Raven's language, not MBTI letters)
    orientationBias: 'inward' | 'outward';        // I vs E - Where energy sources
    perceptionMode: 'concrete' | 'abstract';       // S vs N - How info is gathered
    decisionAxis: 'systematic' | 'values-driven';  // T vs F - How conclusions form
    temporalStance: 'structured' | 'emergent';     // J vs P - How time is held
    
    // Per-axis confidence with HINGE support
    axisConfidence: {
        orientation: AxisConfidence;  // E/I
        perception: AxisConfidence;   // N/S
        decision: AxisConfidence;     // T/F
        temporal: AxisConfidence;     // J/P
    };
    
    // Raven's diagnostic language
    processingSpeed: 'deliberate' | 'rapid' | 'variable';
    emotionalBase: 'stable' | 'mobile' | 'depth' | 'expansive';
    structureStyle: 'container' | 'catalyst' | 'mediator' | 'anchor';
    
    // Internal only - never shown to user
    internalCode: string;  // e.g., "INFJ" - for Raven's internal reasoning
    confidence: 'high' | 'medium' | 'low';
    derivedFrom: string;   // Audit trail of which placements drove the inference
    
    // Hinge descriptions for Raven's voice when axis is uncollapsed
    hingeDescriptions: {
        orientation?: string;
        perception?: string;
        decision?: string;
        temporal?: string;
    };
}

// Element mappings
const SIGN_ELEMENT: Record<SignId, ElementType> = {
    Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
    Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
    Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
    Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
};

const SIGN_MODALITY: Record<SignId, ModalityType> = {
    Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
    Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
    Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable'
};

// Water signs for the N/S override rule
const WATER_SIGNS: SignId[] = ['Cancer', 'Scorpio', 'Pisces'];

function getElement(sign: SignId): ElementType {
    return SIGN_ELEMENT[sign] || 'Earth';
}

function getModality(sign: SignId): ModalityType {
    return SIGN_MODALITY[sign] || 'Fixed';
}

function isWaterSign(sign: SignId): boolean {
    return WATER_SIGNS.includes(sign);
}

// ============================================================================
// v1.5 PROTOCOL SCORING FUNCTIONS
// ============================================================================

/**
 * E/I AXIS - Outward-first vs Inward-first
 * 
 * v1.5 Protocol:
 * Sources: Moon element (primary) + Saturn bias (secondary)
 * Scoring: Moon Fire/Air=1.0, Earth/Water=0.0 | Saturn Fire/Air=+0.15, Earth/Water=-0.15
 * Decision: ≥0.6=E | ≤0.4=I | Hinge=soft call
 */
interface AxisResult {
    value: 'inward' | 'outward' | 'concrete' | 'abstract' | 'systematic' | 'values-driven' | 'structured' | 'emergent';
    score: number;
    confidence: AxisConfidence;
    hingeDescription?: string;
}

function inferOrientationAxis(positions: ChartPositions): AxisResult {
    let score = 0.5; // Baseline
    
    // Moon element (primary) - 1.0 range
    if (positions.Moon?.sign) {
        const moonElement = getElement(positions.Moon.sign);
        if (moonElement === 'Fire' || moonElement === 'Air') {
            score = 1.0;
        } else {
            score = 0.0;
        }
    }
    
    // Saturn bias (secondary) - ±0.15
    if (positions.Saturn?.sign) {
        const satElement = getElement(positions.Saturn.sign);
        if (satElement === 'Fire' || satElement === 'Air') {
            score += 0.15;
        } else {
            score -= 0.15;
        }
    }
    
    // Clamp score
    score = Math.max(0, Math.min(1.15, score));
    
    // Decision thresholds per v1.5
    let value: 'inward' | 'outward';
    let confidence: AxisConfidence;
    let hingeDescription: string | undefined;
    
    if (score >= 0.6) {
        value = 'outward';
        confidence = score >= 0.9 ? 'strong' : 'clear';
    } else if (score <= 0.4) {
        value = 'inward';
        confidence = score <= 0.1 ? 'strong' : 'clear';
    } else {
        // HINGE state - 0.4 < score < 0.6
        value = score >= 0.5 ? 'outward' : 'inward'; // Soft call
        confidence = 'hinge';
        hingeDescription = "The geometry holds two viable orientations—ignition through contact AND depth before movement. Both are active.";
    }
    
    return { value, score, confidence, hingeDescription };
}

/**
 * N/S AXIS - Pattern-first vs Concrete-first
 * 
 * v1.5 Protocol:
 * Sources: Sun element + Mercury element + WATER MOON OVERRIDE
 * Scoring: Fire/Air=1.0, Earth/Water=0.0 | Water Moon=+1.5 N
 * Decision: ≥1.2=N | ≤0.8=S | Hinge
 * 
 * CRITICAL: Water Moon (Cancer/Scorpio/Pisces) overrides Earth Sun/Mercury for N
 */
function inferPerceptionAxis(positions: ChartPositions): AxisResult {
    let score = 0;
    
    // Sun element (0 or 1)
    if (positions.Sun?.sign) {
        const sunElement = getElement(positions.Sun.sign);
        if (sunElement === 'Fire' || sunElement === 'Air') {
            score += 1.0;
        }
    }
    
    // Mercury element (0 or 1)
    if (positions.Mercury?.sign) {
        const mercElement = getElement(positions.Mercury.sign);
        if (mercElement === 'Fire' || mercElement === 'Air') {
            score += 1.0;
        }
    }
    
    // WATER MOON OVERRIDE - +1.5 toward N (CRITICAL v1.5 rule)
    if (positions.Moon?.sign && isWaterSign(positions.Moon.sign)) {
        score += 1.5;
    }
    
    // Decision thresholds per v1.5 (range 0-3.5)
    let value: 'concrete' | 'abstract';
    let confidence: AxisConfidence;
    let hingeDescription: string | undefined;
    
    if (score >= 1.2) {
        value = 'abstract';
        confidence = score >= 2.0 ? 'strong' : 'clear';
    } else if (score <= 0.8) {
        value = 'concrete';
        confidence = score <= 0.2 ? 'strong' : 'clear';
    } else {
        // HINGE state
        value = score >= 1.0 ? 'abstract' : 'concrete';
        confidence = 'hinge';
        hingeDescription = "The geometry supports both pattern-first AND concrete-first perception. Neither dominates.";
    }
    
    return { value, score, confidence, hingeDescription };
}

/**
 * T/F AXIS - Structure-led vs Resonance-led
 * 
 * v1.5 Protocol:
 * PRIMARY: Moon element (element > house)
 * Sources: Moon element + Venus–Moon/Saturn harmony + MC/IC tone
 * Scoring: Moon Fire/Water=1.5 (F), Earth/Air=0.5 (T) | Venus harmony=+0.2F | Saturn dominance=-0.2 | MC/IC=±0.15
 * Decision: ≥1.3=F | ≤0.7=T | Hinge
 */
function inferDecisionAxis(positions: ChartPositions): AxisResult {
    let score = 0;
    
    // Moon element (PRIMARY) - Fire/Water=1.5F, Earth/Air=0.5T
    if (positions.Moon?.sign) {
        const moonElement = getElement(positions.Moon.sign);
        if (moonElement === 'Fire' || moonElement === 'Water') {
            score = 1.5; // Feeling bias
        } else {
            score = 0.5; // Thinking bias
        }
    } else {
        score = 1.0; // Neutral if no Moon
    }
    
    // Venus harmony modifier (+0.2 toward F if Venus in Water/Fire)
    if (positions.Venus?.sign) {
        const venusElement = getElement(positions.Venus.sign);
        if (venusElement === 'Water' || venusElement === 'Fire') {
            score += 0.2;
        }
    }
    
    // Saturn dominance modifier (-0.2 toward T if Saturn in Earth/Air)
    if (positions.Saturn?.sign) {
        const satElement = getElement(positions.Saturn.sign);
        if (satElement === 'Earth' || satElement === 'Air') {
            score -= 0.2;
        }
    }
    
    // Decision thresholds per v1.5
    let value: 'systematic' | 'values-driven';
    let confidence: AxisConfidence;
    let hingeDescription: string | undefined;
    
    if (score >= 1.3) {
        value = 'values-driven';
        confidence = score >= 1.6 ? 'strong' : 'clear';
    } else if (score <= 0.7) {
        value = 'systematic';
        confidence = score <= 0.4 ? 'strong' : 'clear';
    } else {
        // HINGE state
        value = score >= 1.0 ? 'values-driven' : 'systematic';
        confidence = 'hinge';
        hingeDescription = "The geometry supports both structure-led AND resonance-led evaluation. The decision axis is tensioned.";
    }
    
    return { value, score, confidence, hingeDescription };
}

/**
 * J/P AXIS - Closure vs Open-form
 * 
 * v1.5 Protocol:
 * Three-layer precedence: Blueprint(Sun modality) > Engine(Moon modality + Saturn) > Contact(firewalled)
 * Scoring:
 *   Sun modality: Cardinal/Fixed = +1.5, Mutable = -1.5
 *   Moon modality: Cardinal/Fixed = +0.5, Mutable = -0.5
 *   Saturn bias: Earth/Water = +0.15, Fire/Air = -0.15
 * Decision: ≥1.0=J(strong) | 0.5-1.0=J(soft) | -0.5 to 0.5=Hinge | <-0.5=P
 */
function inferTemporalAxis(positions: ChartPositions): AxisResult {
    let score = 0;
    
    // Sun modality (PRIMARY - ±1.5)
    if (positions.Sun?.sign) {
        const sunMod = getModality(positions.Sun.sign);
        if (sunMod === 'Cardinal' || sunMod === 'Fixed') {
            score += 1.5;
        } else {
            score -= 1.5;
        }
    }
    
    // Moon modality (±0.5)
    if (positions.Moon?.sign) {
        const moonMod = getModality(positions.Moon.sign);
        if (moonMod === 'Cardinal' || moonMod === 'Fixed') {
            score += 0.5;
        } else {
            score -= 0.5;
        }
    }
    
    // Saturn bias (±0.15)
    if (positions.Saturn?.sign) {
        const satElement = getElement(positions.Saturn.sign);
        if (satElement === 'Earth' || satElement === 'Water') {
            score += 0.15;
        } else {
            score -= 0.15;
        }
    }
    
    // Decision thresholds per v1.5
    let value: 'structured' | 'emergent';
    let confidence: AxisConfidence;
    let hingeDescription: string | undefined;
    
    if (score >= 1.0) {
        value = 'structured';
        confidence = 'strong';
    } else if (score >= 0.5) {
        value = 'structured';
        confidence = 'soft';
    } else if (score <= -0.5) {
        value = 'emergent';
        confidence = score <= -1.0 ? 'strong' : 'clear';
    } else {
        // HINGE state (-0.5 < score < 0.5)
        value = score >= 0 ? 'structured' : 'emergent';
        confidence = 'hinge';
        hingeDescription = "The geometry supports both closure-seeking AND improvisational motion. Neither rhythm dominates.";
    }
    
    return { value, score, confidence, hingeDescription };
}

/**
 * Derive emotional base from Moon element (Raven's voice layer)
 */
function inferEmotionalBase(moonSign?: SignId): CognitiveArchitecture['emotionalBase'] {
    if (!moonSign) return 'stable';
    const element = getElement(moonSign);
    
    switch (element) {
        case 'Earth': return 'stable';      // Taurus, Virgo, Capricorn - grounded
        case 'Fire': return 'expansive';    // Aries, Leo, Sagittarius - moving outward
        case 'Air': return 'mobile';        // Gemini, Libra, Aquarius - shifting, variable
        case 'Water': return 'depth';       // Cancer, Scorpio, Pisces - deep currents
        default: return 'stable';
    }
}

/**
 * Derive structure style from Saturn element (Raven's voice layer)
 */
function inferStructureStyle(saturnSign?: SignId): CognitiveArchitecture['structureStyle'] {
    if (!saturnSign) return 'anchor';
    const element = getElement(saturnSign);
    
    switch (element) {
        case 'Earth': return 'anchor';      // Holds ground, stabilizes
        case 'Fire': return 'catalyst';     // Pushes change, initiates
        case 'Air': return 'mediator';      // Connects, translates
        case 'Water': return 'container';   // Holds emotion, protects
        default: return 'anchor';
    }
}

/**
 * Derive processing speed from Mercury + retrograde status
 */
function inferProcessingSpeed(positions: ChartPositions): CognitiveArchitecture['processingSpeed'] {
    const mercurySign = positions.Mercury?.sign;
    const isRetrograde = positions.Mercury?.retrograde;
    
    if (isRetrograde) return 'deliberate'; // Retrograde Mercury processes more slowly/internally
    
    if (mercurySign) {
        const modality = getModality(mercurySign);
        if (modality === 'Mutable') return 'rapid';      // Quick adapting
        if (modality === 'Fixed') return 'deliberate';   // Steady, methodical
        return 'variable';                                // Cardinal - depends on context
    }
    
    return 'variable';
}

/**
 * Convert derived axes to internal MBTI code
 */
function deriveInternalCode(
    orientation: 'inward' | 'outward',
    perception: 'concrete' | 'abstract',
    decision: 'systematic' | 'values-driven',
    temporal: 'structured' | 'emergent'
): string {
    const E_I = orientation === 'outward' ? 'E' : 'I';
    const S_N = perception === 'concrete' ? 'S' : 'N';
    const T_F = decision === 'systematic' ? 'T' : 'F';
    const J_P = temporal === 'structured' ? 'J' : 'P';
    
    return `${E_I}${S_N}${T_F}${J_P}`;
}

/**
 * MAIN INFERENCE FUNCTION - v1.5 Protocol Implementation
 * 
 * Takes chart positions and returns complete CognitiveArchitecture.
 * This should be called when a profile is created or chart is fetched,
 * then stored in profile.cognitiveArchitecture.
 * 
 * Implements deterministic scoring per MBTI Inference Protocol v1.5.
 * Supports HINGE states for uncollapsed axes.
 */
export function inferCognitiveArchitecture(positions: ChartPositions): CognitiveArchitecture {
    // Run v1.5 axis scoring
    const orientationResult = inferOrientationAxis(positions);
    const perceptionResult = inferPerceptionAxis(positions);
    const decisionResult = inferDecisionAxis(positions);
    const temporalResult = inferTemporalAxis(positions);
    
    const orientation = orientationResult.value as 'inward' | 'outward';
    const perception = perceptionResult.value as 'concrete' | 'abstract';
    const decision = decisionResult.value as 'systematic' | 'values-driven';
    const temporal = temporalResult.value as 'structured' | 'emergent';
    
    const internalCode = deriveInternalCode(orientation, perception, decision, temporal);
    
    // Build audit trail
    const derivedFrom = [
        positions.Moon?.sign ? `Moon:${positions.Moon.sign}` : null,
        positions.Sun?.sign ? `Sun:${positions.Sun.sign}` : null,
        positions.Mercury?.sign ? `Mercury:${positions.Mercury.sign}${positions.Mercury.retrograde ? 'R' : ''}` : null,
        positions.Saturn?.sign ? `Saturn:${positions.Saturn.sign}` : null,
        positions.Venus?.sign ? `Venus:${positions.Venus.sign}` : null,
    ].filter(Boolean).join(', ');
    
    // Count hinges for overall confidence
    const hingeCount = [
        orientationResult.confidence,
        perceptionResult.confidence,
        decisionResult.confidence,
        temporalResult.confidence
    ].filter(c => c === 'hinge').length;
    
    const overallConfidence = hingeCount === 0 ? 'high' : hingeCount <= 1 ? 'medium' : 'low';
    
    // Build hinge descriptions for Raven's voice
    const hingeDescriptions: CognitiveArchitecture['hingeDescriptions'] = {};
    if (orientationResult.hingeDescription) hingeDescriptions.orientation = orientationResult.hingeDescription;
    if (perceptionResult.hingeDescription) hingeDescriptions.perception = perceptionResult.hingeDescription;
    if (decisionResult.hingeDescription) hingeDescriptions.decision = decisionResult.hingeDescription;
    if (temporalResult.hingeDescription) hingeDescriptions.temporal = temporalResult.hingeDescription;
    
    return {
        orientationBias: orientation,
        perceptionMode: perception,
        decisionAxis: decision,
        temporalStance: temporal,
        axisConfidence: {
            orientation: orientationResult.confidence,
            perception: perceptionResult.confidence,
            decision: decisionResult.confidence,
            temporal: temporalResult.confidence
        },
        processingSpeed: inferProcessingSpeed(positions),
        emotionalBase: inferEmotionalBase(positions.Moon?.sign),
        structureStyle: inferStructureStyle(positions.Saturn?.sign),
        internalCode,
        confidence: overallConfidence,
        derivedFrom,
        hingeDescriptions
    };
}

/**
 * Helper to convert API chart response to positions format for inference
 */
export function extractPositionsForInference(chartData: any): ChartPositions {
    const positions: ChartPositions = {};
    
    const rawPositions = chartData?.positions || chartData?.chart?.positions || chartData;
    
    if (rawPositions?.Sun) positions.Sun = { sign: rawPositions.Sun.sign };
    if (rawPositions?.Moon) positions.Moon = { sign: rawPositions.Moon.sign };
    if (rawPositions?.Mercury) positions.Mercury = { 
        sign: rawPositions.Mercury.sign,
        retrograde: rawPositions.Mercury.retrograde 
    };
    if (rawPositions?.Venus) positions.Venus = { sign: rawPositions.Venus.sign };
    if (rawPositions?.Mars) positions.Mars = { sign: rawPositions.Mars.sign };
    if (rawPositions?.Saturn) positions.Saturn = { sign: rawPositions.Saturn.sign };
    // Note: Ascendant intentionally NOT extracted - Contact Resonance firewall
    
    return positions;
}

/**
 * Generate the v1.5 Required Output Template for Raven's voice
 * 
 * This is the formatted output Raven should use when discussing cognitive architecture.
 * Never names MBTI letters unless explicitly asked.
 */
export function generateCognitiveVoiceTemplate(arch: CognitiveArchitecture): string {
    const hinges = Object.keys(arch.hingeDescriptions).length;
    
    // Map values to Raven's voice language
    const orientationVoice = arch.orientationBias === 'outward' 
        ? 'ignition through contact' 
        : 'depth before movement';
    const perceptionVoice = arch.perceptionMode === 'abstract' 
        ? 'meaning before detail' 
        : 'verification through touch';
    const decisionVoice = arch.decisionAxis === 'values-driven' 
        ? 'decision by resonance' 
        : 'decision by structure';
    const temporalVoice = arch.temporalStance === 'structured' 
        ? 'directional motion' 
        : 'improvisational motion';
    
    let template = `Your interior compass—Moon, Saturn, and relational core—points toward ${orientationVoice}, ${perceptionVoice}, ${decisionVoice}, and ${temporalVoice}.`;
    
    if (hinges > 0) {
        template += `\n\nThe geometry holds some uncollapsed tension:`;
        for (const [axis, desc] of Object.entries(arch.hingeDescriptions)) {
            template += `\n• ${desc}`;
        }
    }
    
    template += `\n\nIf your quiet-day inner experience contradicts this, tell me; we log the correction and revise. The map serves you, not the other way around.`;
    
    return template;
}
