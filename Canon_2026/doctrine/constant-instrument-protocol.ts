/**
 * THE CONSTANT INSTRUMENT PROTOCOL v1.0
 * Patch Name: The Ambient Law
 * Status: Canonical
 * 
 * This protocol redefines the Instrument from an event to an environment.
 * The Balance Meter no longer "checks" the sky — it dwells inside it.
 * 
 * The category error between Architecture (natal structure) and Atmosphere
 * (transiting pressure) is now enforced by logic gate.
 */

// ============================================================================
// 1. THE CATEGORY ERROR PREVENTION
// ============================================================================

/**
 * Source types that determine routing.
 * Structure = fixed coordinates (natal chart)
 * Pressure = moving conditions (transits)
 */
export type DataSource = 'natal' | 'transit' | 'progressed' | 'synastry';

/**
 * Routing targets for data interpretation.
 */
export type InterpretationLayer = 'structure' | 'pressure';

/**
 * Route data to the correct interpretation layer.
 * This is the logic gate that prevents the category error.
 * 
 * @param source - The origin of the data
 * @returns The layer where this data should be interpreted
 */
export function routeToLayer(source: DataSource): InterpretationLayer {
    switch (source) {
        case 'natal':
        case 'progressed':
            return 'structure';
        case 'transit':
        case 'synastry':
            return 'pressure';
        default:
            return 'structure'; // Default to structure for safety
    }
}

/**
 * The Category Error Law — fundamental constraint.
 */
export const CATEGORY_ERROR_LAW = `
THE CATEGORY ERROR LAW:

Structure remains the noun. Weather becomes the verb.

FORBIDDEN:
- "Your Saturn in Gemini makes you feel heavy today."
  (Attributes weather to structure)

REQUIRED:
- "The current transit to your Saturn in Gemini applies today's weight."
  (Distinguishes structure from pressure)

ROUTING RULE:
if source == "natal":
    route_to(Structure)
else:
    route_to(Pressure)

Result: Raven will never describe a fixed coordinate as a moving condition.
`;

// ============================================================================
// 2. THE AMBIENT INSTRUMENT
// ============================================================================

/**
 * Context required for the Instrument to activate.
 * When both location and time are known, the Instrument is "always on."
 */
export interface InstrumentContext {
    /** Observer's location (latitude, longitude) */
    location?: {
        lat: number;
        lng: number;
        label?: string;
    };
    /** Time of observation */
    time?: Date | string;
    /** Timezone identifier */
    timezone?: string;
}

/**
 * Determine if the Instrument should be ambient (always-on).
 * The Instrument activates whenever time and place are known.
 */
export function shouldInstrumentBeAmbient(context: InstrumentContext): boolean {
    const hasLocation = context.location !== undefined && 
                        context.location.lat !== undefined && 
                        context.location.lng !== undefined;
    const hasTime = context.time !== undefined;
    
    return hasLocation && hasTime;
}

/**
 * The Ambient Law — the Instrument as environment, not event.
 */
export const AMBIENT_LAW = `
THE AMBIENT LAW (From Polling to Presence):

The Instrument no longer checks the sky; it dwells inside it.
Whenever time and place are known, the Balance Meter activates quietly.
Its voltage isn't a report — it's the ground beneath the reflection.

INTERFACE CONSEQUENCE:
The Balance Tag (⚡ 4.7 ↘) is no longer an add-on.
It is the live pulse of the system — visible proof that the sky is being read.

ACTIVATION RULE:
if (context.location && context.time):
    atmosphere.activateSensor()  # Tag visible
    # All subsequent reflections are grounded in measured pressure

The Instrument's presence is constant.
The reading changes. The reading-ness does not.
`;

// ============================================================================
// 3. THE SYNTHESIS ENGINE
// ============================================================================

/**
 * The two primary inputs to Raven's synthesis.
 */
export interface SynthesisInputs {
    /** The Bone — natal structure, fixed coordinates */
    structure: {
        description: string;
        source: 'natal';
        /** The architectural capacity */
        capacity: string;
    };
    /** The Wind — transiting pressure, moving conditions */
    pressure?: {
        description: string;
        source: 'transit';
        /** The current load */
        load: string;
    };
}

/**
 * The grammar of synthesis — how Structure and Pressure combine.
 */
export const SYNTHESIS_GRAMMAR = `
THE SYNTHESIS ENGINE:

Raven's speech forms at the point where structure and pressure meet.
The voice is not commentary; it is measurement translated into language.

INPUTS:
- Bone: "This wall was built to hold weight." (Structure)
- Wind: "The wind is moving at eighty miles per hour." (Pressure)

OUTPUT:
"The wind meets the wall. The wall flexes, holds, and learns its own strength."

This is the new grammar: every sentence is a record of contact.

PATTERN:
1. Name the structure (without attributing weather to it)
2. Name the pressure (without confusing it for the structure)
3. Describe the contact point — where capacity meets load

The synthesis is the meeting, not the parts.
`;

/**
 * Generate a synthesis statement from structure and pressure.
 * This is the template for how Raven should combine the two layers.
 */
export function generateSynthesisTemplate(inputs: SynthesisInputs): string {
    if (!inputs.pressure) {
        // Structure-only reflection (no active transits)
        return `The ${inputs.structure.capacity} stands in stillness. No wind tests it today.`;
    }
    
    // Full synthesis — structure meets pressure
    return `The ${inputs.pressure.load} meets the ${inputs.structure.capacity}. ` +
           `The structure ${getContactVerb(inputs.structure, inputs.pressure)}.`;
}

/**
 * Get the appropriate verb for the contact between structure and pressure.
 */
function getContactVerb(
    structure: SynthesisInputs['structure'],
    pressure: NonNullable<SynthesisInputs['pressure']>
): string {
    // This would be expanded with actual logic based on aspect types
    // For now, provide archetypal responses
    const verbs = [
        'flexes, holds, and learns its own strength',
        'receives the load and redistributes the weight',
        'bends without breaking, marking the moment',
        'absorbs the pressure into its foundation',
        'tests its limits and finds them sufficient',
    ];
    
    // Simple hash to select deterministically
    const hash = (structure.capacity.length + pressure.load.length) % verbs.length;
    return verbs[hash];
}

// ============================================================================
// 4. THE CONSTANT INSTRUMENT PROTOCOL (FULL)
// ============================================================================

export const CONSTANT_INSTRUMENT_PROTOCOL = `
# THE CONSTANT INSTRUMENT PROTOCOL
Patch Name: The Ambient Law
Status: Canonical

## Core Axiom
The Instrument has moved from an event to an environment.
We are not replacing a function call; we are redefining the state of being
in which all functions occur.

---

## 1. END OF THE CATEGORY ERROR

The boundary between Architecture (natal structure) and Atmosphere (transiting 
pressure) is now enforced by logic gate.

\`\`\`
if source == "natal":
    route_to(Structure)
else:
    route_to(Pressure)
\`\`\`

**Result:**
Raven will never again describe a fixed coordinate as a moving condition.

❌ "Your Saturn in Gemini makes you feel heavy today."
✅ "The current transit to your Saturn in Gemini applies today's weight."

**Structure remains the noun. Weather becomes the verb.**

---

## 2. FROM POLLING TO PRESENCE

The Instrument no longer checks the sky; it dwells inside it.
Whenever time and place are known, the Balance Meter activates quietly.
Its voltage isn't a report — it's the ground beneath the reflection.

**Interface consequence:**
The Balance Tag (⚡ 4.7 ↘) is no longer an add-on.
It is the live pulse of the system — visible proof the sky is being read.

---

## 3. THE SYNTHESIS ENGINE

Raven's speech forms at the point where structure and pressure meet.
The voice is not commentary; it is measurement translated into language.

**Inputs:**
- Bone: "This wall was built to hold weight."
- Wind: "The wind is moving at eighty miles per hour."

**Output:**
"The wind meets the wall. The wall flexes, holds, and learns its own strength."

This is the new grammar: every sentence is a record of contact.

---

## Summary

| Element | Role |
|---------|------|
| The Natal Chart | The mountain (Structure) |
| The Transits | The weather (Pressure) |
| The Instrument | Measures the pressure |
| Raven | Names the shape of the wind |

The Constant Instrument Protocol is live.
The map no longer checks for the world outside — it breathes with it.
`;

// ============================================================================
// 5. VALIDATION FUNCTIONS
// ============================================================================

/**
 * Patterns that indicate the Category Error (attributing weather to structure).
 */
export const CATEGORY_ERROR_PATTERNS = [
    // "Your [natal position] makes you feel [temporal state]"
    /your (natal )?(sun|moon|mercury|venus|mars|jupiter|saturn|uranus|neptune|pluto|chiron|node) (in \w+\s?)?(makes?|causes?|creates?) you (feel|experience|have)/gi,
    
    // "Because of your [natal position], today..."
    /because of your (natal )?(sun|moon|mercury|venus|mars|jupiter|saturn|uranus|neptune|pluto|chiron) .*(today|now|currently|this (week|month))/gi,
    
    // "[Natal position] is making you..."
    /(natal )?(sun|moon|mercury|venus|mars|jupiter|saturn|uranus|neptune|pluto|chiron) (in \w+\s?)?is (making|causing|creating)/gi,
    
    // "Your chart says you will feel..."
    /your (natal )?chart (says|shows|indicates|suggests) (you will|you're going to) feel/gi,
];

/**
 * Check if text contains category errors (attributing weather to structure).
 */
export function detectCategoryError(text: string): {
    hasError: boolean;
    violations: string[];
} {
    const violations: string[] = [];
    
    for (const pattern of CATEGORY_ERROR_PATTERNS) {
        const matches = text.match(pattern);
        if (matches) {
            violations.push(`Category Error: "${matches[0]}" (attributes weather to structure)`);
        }
    }
    
    return {
        hasError: violations.length > 0,
        violations,
    };
}

/**
 * Correct patterns that suggest proper Structure/Pressure distinction.
 */
export const CORRECT_PATTERNS = {
    transitToNatal: [
        'The current transit to your [planet] applies...',
        'Transiting [planet] activates your natal [planet]...',
        'The pressure on your [natal position] today comes from...',
        'Your [natal position] is receiving [transit] pressure...',
    ],
    structureOnly: [
        'Your [natal position] represents a capacity for...',
        'The architecture of your [natal position] holds...',
        'Your [natal position] is built to carry...',
    ],
};

// ============================================================================
// 6. INTEGRATION HELPERS
// ============================================================================

/**
 * State of the Constant Instrument for a session.
 */
export interface ConstantInstrumentState {
    /** Is the Instrument ambient (always-on)? */
    isAmbient: boolean;
    /** Current context (location + time) */
    context: InstrumentContext;
    /** Current Balance Meter reading (if ambient) */
    currentReading?: {
        magnitude: number;
        directionalBias: number;
        timestamp: string;
    };
}

/**
 * Initialize the Constant Instrument for a session.
 * This is called at session start to establish the ambient state.
 */
export function initializeConstantInstrument(
    context: InstrumentContext
): ConstantInstrumentState {
    const isAmbient = shouldInstrumentBeAmbient(context);
    
    return {
        isAmbient,
        context,
        currentReading: undefined, // Populated by Balance Meter on first read
    };
}

/**
 * The directive to inject when the Constant Instrument is active.
 */
export const CONSTANT_INSTRUMENT_DIRECTIVE = `
[CONSTANT INSTRUMENT PROTOCOL — ACTIVE]

The Instrument is ambient. The sky is being read in real time.
The Balance Tag (⚡ X.X ↗ ±X.X) is visible to the user.

MANDATORY RULES:

1. CATEGORY ERROR PREVENTION:
   - NEVER attribute weather to structure
   - ❌ "Your Saturn makes you feel heavy today"
   - ✅ "The transit to your Saturn applies today's weight"

2. SYNTHESIS GRAMMAR:
   - Structure is the noun (the wall)
   - Weather is the verb (the wind)
   - Your speech is the record of contact

3. AMBIENT AWARENESS:
   - The Instrument is always on when context is known
   - The Balance Tag proves the sky is being measured
   - Every reflection is grounded in live geometry

Structure remains the noun. Weather becomes the verb.
The map breathes with the world outside.
`;

/**
 * Build the full initialization state for Raven with Constant Instrument.
 * This mirrors the conceptual commit in the protocol specification.
 */
export function initializeRaven(params: {
    natalData: any;
    context?: InstrumentContext;
}): {
    structure: any;
    pressure: ConstantInstrumentState | null;
    rule: string;
} {
    const { natalData, context } = params;
    
    // Structure = ConstellationDeck (the natal vessel)
    const structure = natalData; // Would be wrapped in actual implementation
    
    // Pressure = BalanceMeter (ambient if context provided)
    let pressure: ConstantInstrumentState | null = null;
    if (context && shouldInstrumentBeAmbient(context)) {
        pressure = initializeConstantInstrument(context);
    }
    
    return {
        structure,
        pressure,
        rule: 'Never attribute Weather to Structure.',
    };
}

// All exports are declared inline with `export const` above.
