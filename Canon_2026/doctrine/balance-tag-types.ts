/**
 * BALANCE TAG TYPES v1.1
 * 
 * Type definitions for the Conditional Balance Tag system.
 * The Balance Tag is a compact diagnostic glyph that appears only when
 * Raven's interpretation has been quantitatively shaped by the Instrument.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * THE UX CONSTITUTION:
 * 
 *   "The tag speaks the math.
 *    The dots speak the scope.
 *    The voice stays focused on meaning."
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Implements:
 * - "Coherence Signal Protocol" — measuring where structure reorganizes into coherence
 * - "Constant Instrument Protocol" — the Instrument as environment, not event
 * - "Symbolic Scope Indicator" — showing whose skies are being measured
 * 
 * The Balance Tag is the live pulse of the system — visible proof that
 * the sky is being read in real time.
 */

// ============================================================================
// CORE TAG DATA TYPES
// ============================================================================

/**
 * The primary data structure for the Balance Tag.
 * Contains all values needed to render the compact diagnostic glyph.
 */
export interface BalanceTagData {
    /** Magnitude: 0–5 scale measuring intensity of the field */
    magnitude: number;
    /** Directional Bias: −5 to +5 scale (inward ↔ outward) */
    directionalBias: number;
    /** Coherence Index: Support ÷ Friction ratio (optional) */
    coherenceIndex?: number;
    /** Human-readable tier label: Low / Moderate / High / Intense */
    tierLabel: MagnitudeTier;
    /** Human-readable bias label: Inward / Balanced / Outward */
    biasLabel: BiasLabel;
    /** Source of the instrument data */
    instrumentSource?: string;
    /** Timestamp or date range of the reading */
    timestamp?: string;
    /** Date range for multi-day readings */
    dateRange?: { start: string; end: string };
    /** Whether this is aggregated data (mean/peak) */
    isAggregated?: boolean;
    /** Aggregation method used */
    aggregationMethod?: 'mean' | 'peak';
}

/**
 * Magnitude tier labels for qualitative display mode.
 */
export type MagnitudeTier = 'Low' | 'Moderate' | 'High' | 'Intense';

/**
 * Bias direction labels for qualitative display mode.
 */
export type BiasLabel = 'Inward' | 'Balanced' | 'Outward';

/**
 * Display modes for the Balance Tag.
 */
export type BalanceTagDisplayMode = 'numeric' | 'qualitative';

// ============================================================================
// INSTRUMENT INVOCATION TRACKING
// ============================================================================

/**
 * Tracks whether the Instrument (astrology API) has been invoked
 * and whether its data has influenced the current output.
 * 
 * Under the Constant Instrument Protocol, the Instrument is "ambient" —
 * always on when location and time are known. The tag becomes the
 * visible proof that the sky is being read in real time.
 */
export interface InstrumentInvocationState {
    /** Whether the Instrument has been called for this reading */
    dataInvoked: boolean;
    /** Whether the Balance Meter processed the data */
    balanceMeterInvoked: boolean;
    /** Which layers were influenced by the Balance Meter output */
    outputUsedIn: OutputLayer[];
    /** The actual data if available */
    data?: BalanceTagData;
    /** 
     * Ambient mode: Instrument is always-on when context is known.
     * Under the Constant Instrument Protocol, this should be true
     * whenever location and time are available.
     */
    isAmbient?: boolean;
    /** The context that enables ambient mode */
    ambientContext?: {
        location?: { lat: number; lng: number; label?: string };
        time?: string;
    };
}

/**
 * The layers that can be influenced by Balance Meter data.
 */
export type OutputLayer = 'MAP' | 'VOICE' | 'FIELD';

/**
 * Activation rule result — determines if the tag should render.
 */
export interface BalanceTagActivation {
    /** Whether the tag should be rendered */
    shouldRender: boolean;
    /** Reason for the activation decision */
    reason: BalanceTagActivationReason;
    /** The tag data if activation is true */
    tagData?: BalanceTagData;
}

/**
 * Reasons why the Balance Tag may or may not activate.
 */
export type BalanceTagActivationReason =
    | 'instrument_active_balance_used'
    | 'instrument_idle'
    | 'balance_meter_not_invoked'
    | 'no_layer_influence'
    | 'static_natal_reflection'
    | 'subject_coordinates_unknown'
    | 'archetypal_mode'
    | 'external_subject_no_data';

// ============================================================================
// TAG MODE (Context-Aware Display)
// ============================================================================

/**
 * The mode the Balance Tag operates in, based on what Raven is describing.
 * 
 * The tag tracks the *subject* being discussed:
 * - If the subject's coordinates are known → Live mode (instrument measuring)
 * - If coordinates are unknown/irrelevant → Neutral mode (static marker)
 */
export type BalanceTagMode =
    | 'live'        // Instrument is measuring live geometry for this subject
    | 'natal'       // Natal context only — no weather measurement needed
    | 'archetypal'  // Conceptual/timeless pattern — no living coordinates
    | 'external'    // Discussing another person without their coordinates
    | 'hidden';     // No tag should appear

/**
 * Configuration for neutral/placeholder tags when instrument isn't measuring.
 */
export interface NeutralTagConfig {
    mode: Exclude<BalanceTagMode, 'live' | 'hidden'>;
    /** Display text for the neutral marker */
    label: string;
    /** Icon/symbol for the marker */
    symbol: string;
}

/**
 * Neutral tag configurations for each non-live mode.
 */
export const NEUTRAL_TAG_CONFIGS: Record<Exclude<BalanceTagMode, 'live' | 'hidden'>, NeutralTagConfig> = {
    natal: {
        mode: 'natal',
        label: 'Natal Context',
        symbol: '◎',
    },
    archetypal: {
        mode: 'archetypal',
        label: 'Archetypal Mode',
        symbol: '∿',
    },
    external: {
        mode: 'external',
        label: 'Static Reference',
        symbol: '○',
    },
};

/**
 * Subject context — who/what is Raven describing?
 */
export interface SubjectContext {
    /** The type of subject being discussed */
    type: 'self' | 'other_person' | 'archetypal' | 'historical' | 'conceptual';
    /** Whether coordinates (location + time) are known for this subject */
    coordinatesKnown: boolean;
    /** If coordinates are known, is the time "now" or a specific moment? */
    temporalContext?: 'live' | 'specific_date' | 'timeless';
    /** Optional label for the subject */
    label?: string;
    /** Unique identifier for this subject (for multi-subject tracking) */
    id?: string;
}

// ============================================================================
// SYMBOLIC SCOPE INDICATOR (Multi-Subject Tracking)
// ============================================================================

/**
 * Tracks multiple subjects in a conversation for the Scope Indicator.
 * 
 * When a reflection involves more than one subject, Raven may have complete
 * Instrument data for some but not all of them. The dot array shows at a glance
 * whose skies are actually being measured.
 * 
 * Visual syntax:
 * - Filled dot (•) → Instrument data present (coordinates known)
 * - Hollow dot (○) → Instrument data missing or irrelevant
 */
export interface SymbolicScope {
    /** All subjects referenced in the current reflection */
    subjects: SubjectContext[];
    /** Count of subjects with active Instrument data */
    activeCount: number;
    /** Total count of subjects */
    totalCount: number;
}

/**
 * Individual subject status for scope tracking.
 */
export interface ScopedSubject {
    /** Subject identifier or label */
    id: string;
    /** Display label (e.g., "You", "Partner", "Friend") */
    label: string;
    /** Whether the Instrument has data for this subject */
    instrumentActive: boolean;
    /** The subject's context */
    context: SubjectContext;
}

/**
 * Configuration for the Scope Indicator display.
 */
export interface ScopeIndicatorConfig {
    /** Whether to show the scope indicator */
    show: boolean;
    /** Active (filled) dot count */
    activeCount: number;
    /** Total dot count */
    totalCount: number;
    /** The subjects with their status */
    subjects: ScopedSubject[];
}

/**
 * Extract and evaluate subjects from conversation context.
 * Returns the scope configuration for the dot indicator.
 */
export function evaluateSymbolicScope(subjects: SubjectContext[]): ScopeIndicatorConfig {
    if (!subjects || subjects.length === 0) {
        return {
            show: false,
            activeCount: 0,
            totalCount: 0,
            subjects: [],
        };
    }

    const scopedSubjects: ScopedSubject[] = subjects.map((subject, index) => ({
        id: subject.id || `subject_${index}`,
        label: subject.label || (subject.type === 'self' ? 'You' : `Subject ${index + 1}`),
        instrumentActive: subject.coordinatesKnown,
        context: subject,
    }));

    const activeCount = scopedSubjects.filter(s => s.instrumentActive).length;
    const totalCount = scopedSubjects.length;

    return {
        // Only show dots when more than one subject is referenced
        show: totalCount > 1,
        activeCount,
        totalCount,
        subjects: scopedSubjects,
    };
}

/**
 * Quick helper to create a scope config from simple counts.
 * Use when you don't need full subject details.
 */
export function createScopeFromCounts(activeCount: number, totalCount: number): ScopeIndicatorConfig {
    // Generate placeholder subjects
    const subjects: ScopedSubject[] = [];
    for (let i = 0; i < totalCount; i++) {
        subjects.push({
            id: `subject_${i}`,
            label: i === 0 ? 'Primary' : `Subject ${i + 1}`,
            instrumentActive: i < activeCount,
            context: {
                type: i === 0 ? 'self' : 'other_person',
                coordinatesKnown: i < activeCount,
            },
        });
    }

    return {
        show: totalCount > 1,
        activeCount,
        totalCount,
        subjects,
    };
}

// ============================================================================
// COHERENCE SIGNAL PROTOCOL
// ============================================================================

/**
 * Coherence state indicators.
 * The Balance Tag measures three ascending states of integration.
 */
export type CoherenceState =
    | 'none'                    // No coherence detected
    | 'coherence_coordinates'   // High Mag + Bias shifting toward +
    | 'positive_integration'    // Support > Friction (net positive)
    | 'emergent_silence';       // Storm passes without nervous system reaction

/**
 * Coherence metrics derived from Balance Meter data.
 */
export interface CoherenceMetrics {
    /** Current coherence state */
    state: CoherenceState;
    /** Support ÷ Friction ratio */
    coherenceIndex: number;
    /** Is the system in Constructive Flow? (Bias > 0 && Mag ≥ 3) */
    isConstructiveFlow: boolean;
    /** Descriptive label for the coherence state */
    label: string;
}

// ============================================================================
// VISUAL STATE
// ============================================================================

/**
 * Visual styling states for the Balance Tag.
 */
export interface BalanceTagVisualState {
    /** Primary accent color */
    accentColor: 'default' | 'gold' | 'indigo';
    /** Whether to animate the tag */
    shouldAnimate: boolean;
    /** Animation type if animated */
    animationType?: 'pulse' | 'glow' | 'shimmer';
    /** Border style */
    borderStyle: 'default' | 'highlight';
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Determine magnitude tier from numeric value.
 */
export function getMagnitudeTier(magnitude: number): MagnitudeTier {
    if (magnitude < 1.5) return 'Low';
    if (magnitude < 3.0) return 'Moderate';
    if (magnitude < 4.0) return 'High';
    return 'Intense';
}

/**
 * Determine bias label from numeric value.
 */
export function getBiasLabel(bias: number): BiasLabel {
    if (bias < -1.0) return 'Inward';
    if (bias > 1.0) return 'Outward';
    return 'Balanced';
}

/**
 * Calculate coherence index from support and friction values.
 * Returns 1.0 when balanced, >1 when support dominates, <1 when friction dominates.
 */
export function calculateCoherenceIndex(support: number, friction: number): number {
    if (friction === 0) return support > 0 ? Infinity : 1.0;
    return support / friction;
}

/**
 * Determine coherence state from magnitude and bias.
 */
export function getCoherenceState(
    magnitude: number,
    bias: number,
    coherenceIndex?: number
): CoherenceState {
    // Emergent Silence: High expected pressure but calm response
    // (Would need historical data to fully implement)

    // Positive Integration: Support > Friction
    if (coherenceIndex !== undefined && coherenceIndex > 1.0) {
        return 'positive_integration';
    }

    // Coherence with Coordinates: High Mag but positive bias
    if (magnitude >= 3.0 && bias > 0) {
        return 'coherence_coordinates';
    }

    return 'none';
}

/**
 * Get coherence metrics from balance meter data.
 * 
 * TRUE ACCELEROMETER DOCTRINE:
 * Coherence is not a displayed number. It is a visual state (Gold Accent).
 * Trigger: Bias > 0 AND Magnitude >= 3.
 */
export function getCoherenceMetrics(
    magnitude: number,
    bias: number,
    support?: number,
    friction?: number
): CoherenceMetrics {
    const coherenceIndex = (support !== undefined && friction !== undefined)
        ? calculateCoherenceIndex(support, friction)
        : (bias > 0 ? 1 + (bias / 5) : 1 / (1 + Math.abs(bias) / 5));

    const state = getCoherenceState(magnitude, bias, coherenceIndex);
    const isConstructiveFlow = bias > 0 && magnitude >= 3.0;

    let label: string;
    switch (state) {
        case 'positive_integration':
            label = 'Positive Integration';
            break;
        case 'coherence_coordinates':
            label = 'Coherence Active';
            break;
        case 'emergent_silence':
            label = 'Integrated Passage';
            break;
        default:
            label = 'Standard State';
    }

    return { state, coherenceIndex, isConstructiveFlow, label };
}

/**
 * Determine visual state based on tag data.
 */
export function getVisualState(data: BalanceTagData): BalanceTagVisualState {
    const coherence = getCoherenceMetrics(data.magnitude, data.directionalBias);

    // Positive Integration: gold accent with subtle animation
    if (coherence.isConstructiveFlow || data.directionalBias > 0) {
        return {
            accentColor: 'gold',
            shouldAnimate: coherence.isConstructiveFlow,
            animationType: coherence.isConstructiveFlow ? 'shimmer' : undefined,
            borderStyle: 'highlight',
        };
    }

    // High magnitude: indigo accent
    if (data.magnitude >= 4.0) {
        return {
            accentColor: 'indigo',
            shouldAnimate: false,
            borderStyle: 'default',
        };
    }

    return {
        accentColor: 'default',
        shouldAnimate: false,
        borderStyle: 'default',
    };
}

/**
 * Determine the tag mode based on subject context.
 * 
 * The key insight: the tag tracks the *subject* being described.
 * If the subject's coordinates are known, the Instrument can measure.
 * If not, the tag switches to a neutral marker.
 */
export function determineTagMode(subject: SubjectContext): BalanceTagMode {
    // If coordinates are unknown, we can't measure live geometry
    if (!subject.coordinatesKnown) {
        switch (subject.type) {
            case 'archetypal':
            case 'historical':
            case 'conceptual':
                return 'archetypal';
            case 'other_person':
                return 'external';
            case 'self':
            default:
                return 'natal';
        }
    }

    // Coordinates are known — check temporal context
    if (subject.temporalContext === 'timeless') {
        return 'archetypal';
    }

    // Live or specific date — instrument can measure
    return 'live';
}

/**
 * Activation result with mode information.
 */
export interface BalanceTagActivationResult extends BalanceTagActivation {
    /** The mode the tag should operate in */
    mode: BalanceTagMode;
    /** Neutral tag config if not in live mode */
    neutralConfig?: NeutralTagConfig;
}

/**
 * Evaluate the activation rule for the Balance Tag.
 * 
 * Raven uses the Balance Tag whenever the Instrument can measure what she's describing.
 * If she can't locate the subject in time and space — or if it's not necessary —
 * she switches to a calm, neutral marker instead of pretending to measure.
 */
export function evaluateActivationRule(
    state: InstrumentInvocationState,
    subject?: SubjectContext
): BalanceTagActivationResult {
    // Determine the mode based on subject context
    const mode = subject ? determineTagMode(subject) : 'live';

    // If mode is hidden, don't render anything
    if (mode === 'hidden') {
        return {
            shouldRender: false,
            reason: 'instrument_idle',
            mode: 'hidden',
        };
    }

    // If mode is not live, show neutral tag instead
    if (mode !== 'live') {
        return {
            shouldRender: true,
            reason: mode === 'natal' ? 'static_natal_reflection'
                : mode === 'archetypal' ? 'archetypal_mode'
                    : 'subject_coordinates_unknown',
            mode,
            neutralConfig: NEUTRAL_TAG_CONFIGS[mode],
        };
    }

    // Live mode — apply full activation rules

    // Rule 1: Instrument must have provided data
    if (!state.dataInvoked) {
        return {
            shouldRender: false,
            reason: 'instrument_idle',
            mode: 'hidden',
        };
    }

    // Rule 2: Balance Meter must have been invoked
    if (!state.balanceMeterInvoked) {
        return {
            shouldRender: false,
            reason: 'balance_meter_not_invoked',
            mode: 'hidden',
        };
    }

    // Rule 3: Output must have influenced MAP or VOICE
    const hasLayerInfluence = state.outputUsedIn.some(
        layer => layer === 'MAP' || layer === 'VOICE'
    );

    if (!hasLayerInfluence) {
        return {
            shouldRender: false,
            reason: 'no_layer_influence',
            mode: 'hidden',
        };
    }

    // All conditions met — show live tag
    return {
        shouldRender: true,
        reason: 'instrument_active_balance_used',
        tagData: state.data,
        mode: 'live',
    };
}

/**
 * Simple helper for common case: user discussing themselves with known context.
 */
export function evaluateForSelfSubject(state: InstrumentInvocationState): BalanceTagActivationResult {
    return evaluateActivationRule(state, {
        type: 'self',
        coordinatesKnown: state.isAmbient ?? state.dataInvoked,
        temporalContext: 'live',
    });
}

/**
 * Format tag data for display.
 */
export function formatTagData(
    data: BalanceTagData,
    mode: BalanceTagDisplayMode = 'numeric'
): { magnitude: string; bias: string; label: string } {
    const coherence = getCoherenceMetrics(data.magnitude, data.directionalBias);

    if (mode === 'numeric') {
        const biasPrefix = data.directionalBias >= 0 ? '+' : '';
        return {
            magnitude: data.magnitude.toFixed(1),
            bias: `${biasPrefix}${data.directionalBias.toFixed(1)}`,
            label: coherence.label,
        };
    }

    // Qualitative mode
    return {
        magnitude: data.tierLabel,
        bias: data.biasLabel,
        label: coherence.label,
    };
}

/**
 * Aggregate multiple days of Balance Tag data.
 */
export function aggregateTagData(
    dailyData: BalanceTagData[],
    method: 'mean' | 'peak' = 'mean'
): BalanceTagData {
    if (dailyData.length === 0) {
        return {
            magnitude: 0,
            directionalBias: 0,
            tierLabel: 'Low',
            biasLabel: 'Balanced',
            isAggregated: true,
            aggregationMethod: method,
        };
    }

    let magnitude: number;
    let directionalBias: number;

    if (method === 'mean') {
        magnitude = dailyData.reduce((sum, d) => sum + d.magnitude, 0) / dailyData.length;
        directionalBias = dailyData.reduce((sum, d) => sum + d.directionalBias, 0) / dailyData.length;
    } else {
        // Peak: use maximum magnitude and its corresponding bias
        const peakDay = dailyData.reduce((max, d) => d.magnitude > max.magnitude ? d : max);
        magnitude = peakDay.magnitude;
        directionalBias = peakDay.directionalBias;
    }

    return {
        magnitude,
        directionalBias,
        tierLabel: getMagnitudeTier(magnitude),
        biasLabel: getBiasLabel(directionalBias),
        isAggregated: true,
        aggregationMethod: method,
        dateRange: dailyData.length > 1 ? {
            start: dailyData[0].timestamp || '',
            end: dailyData[dailyData.length - 1].timestamp || '',
        } : undefined,
    };
}

/**
 * Generate hover tooltip content for the Balance Tag.
 */
export function generateTooltipContent(data: BalanceTagData): string {
    const parts: string[] = [];

    if (data.instrumentSource) {
        parts.push(`Source: ${data.instrumentSource}`);
    }

    if (data.dateRange) {
        parts.push(`Range: ${data.dateRange.start} → ${data.dateRange.end}`);
    } else if (data.timestamp) {
        parts.push(`Timestamp: ${data.timestamp}`);
    }

    if (data.isAggregated) {
        parts.push(`Aggregation: ${data.aggregationMethod || 'mean'}`);
    }

    parts.push(`Magnitude: ${data.magnitude.toFixed(2)}`);
    parts.push(`Directional Bias: ${data.directionalBias >= 0 ? '+' : ''}${data.directionalBias.toFixed(2)}`);

    if (data.coherenceIndex !== undefined) {
        parts.push(`Coherence Index: ${data.coherenceIndex.toFixed(2)}`);
    }

    const coherence = getCoherenceMetrics(data.magnitude, data.directionalBias);
    if (coherence.isConstructiveFlow) {
        parts.push('State: Constructive Flow');
    }

    return parts.join(' | ');
}
