/**
 * TIER APERTURE SYSTEM
 * ====================
 * The Visibility Gate for the Woven Map
 * 
 * Philosophy: "Paying for Blueprints, not Meaning"
 * - Tier 1 (Mirror): Phenomenological depth - user feels seen
 * - Tier 2 (Map): Structural depth - user sees the machinery
 * - Sanctuary: Safety interlock - overrides everything when vulnerability is high
 * 
 * The Hinge: Depth scales DOWN when vulnerability scales UP.
 */

// ============================================================================
// DEVELOPER BYPASS (Shipyard Crew + Testers)
// ============================================================================

/**
 * Admin/Developer identifiers that bypass tier restrictions PERMANENTLY.
 * These users see all content but get markers showing where gates would be.
 */
export const SHIPYARD_CREW = {
    emails: [
        'nathal@gmail.com',
        'dan@wovenmap.com',      // Future official domain
        'admin@wovenmap.com',
    ],
    names: [
        'Dan Cross',
        'DH Cross',
        'Daniel Cross',
    ],
};

/**
 * ============================================================================
 * TESTER GUEST PASSES
 * ============================================================================
 * Add emails here to grant temporary full access.
 * These users get the same bypass as Shipyard Crew.
 * 
 * HOW TO USE:
 * 1. Add email to TESTER_EMAILS array below
 * 2. Or set TESTER_EMAILS env var (comma-separated)
 * 3. User logs in → full access with tier awareness
 * 
 * To revoke: just remove the email from the list.
 */
export const TESTER_EMAILS: string[] = [
    // === ADD TESTER EMAILS HERE ===
    // 'friend@example.com',
    // 'beta.tester@gmail.com',
    // ==============================
];

/**
 * Get all active tester emails (from code + environment variable).
 * ENV format: TESTER_EMAILS=email1@test.com,email2@test.com
 */
function getActiveTesters(): string[] {
    const envTesters = (typeof process !== 'undefined' && process.env?.TESTER_EMAILS) 
        ? process.env.TESTER_EMAILS.split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
        : [];
    
    const codeTesters = TESTER_EMAILS.map(e => e.toLowerCase().trim()).filter(Boolean);
    
    // Combine and dedupe
    return [...new Set([...codeTesters, ...envTesters])];
}

/**
 * Check if a user is a registered tester (guest pass).
 */
export function isTester(email?: string): boolean {
    if (!email) return false;
    const normalizedEmail = email.toLowerCase().trim();
    return getActiveTesters().includes(normalizedEmail);
}

/**
 * Check if a user identifier belongs to the Shipyard Crew (admin/dev bypass).
 */
export function isShipyardCrew(identifier: {
    email?: string;
    name?: string;
}): boolean {
    if (identifier.email) {
        const normalizedEmail = identifier.email.toLowerCase().trim();
        if (SHIPYARD_CREW.emails.some(e => e.toLowerCase() === normalizedEmail)) {
            return true;
        }
    }
    
    if (identifier.name) {
        const normalizedName = identifier.name.toLowerCase().trim();
        if (SHIPYARD_CREW.names.some(n => n.toLowerCase() === normalizedName)) {
            return true;
        }
    }
    
    return false;
}

/**
 * Check if a user has bypass access (Crew OR Tester).
 * Returns the type of bypass for logging/awareness.
 */
export function getBypassStatus(identifier: {
    email?: string;
    name?: string;
}): { hasBypass: boolean; type: 'crew' | 'tester' | null } {
    if (isShipyardCrew(identifier)) {
        return { hasBypass: true, type: 'crew' };
    }
    
    if (isTester(identifier.email)) {
        return { hasBypass: true, type: 'tester' };
    }
    
    return { hasBypass: false, type: null };
}

// ============================================================================
// TIER DEFINITIONS
// ============================================================================

export type WovenTier = 'mirror' | 'map';

export type ApertureState = 
    | 'mirror'      // Tier 1: Phenomenological (Free)
    | 'map'         // Tier 2: Structural (Paid)
    | 'sanctuary';  // Safety Override (Vulnerability Detected)

export interface ApertureConfig {
    /** Current operational state */
    state: ApertureState;
    
    /** User's subscription tier (underlying permission) */
    tier: WovenTier;
    
    /** Whether Sanctuary mode is active (overrides tier) */
    sanctuaryActive: boolean;
    
    /** Timestamp when Sanctuary was triggered */
    sanctuaryTriggeredAt?: number;
    
    /** Reason for Sanctuary activation (for logging) */
    sanctuaryReason?: string;
    
    /** Developer bypass - sees everything but knows where gates would be */
    developerBypass: boolean;
    
    /** The "would-be" state if not bypassed (for Raven to report) */
    effectiveTierWithoutBypass?: ApertureState;
}

// ============================================================================
// VISIBILITY PERMISSIONS
// ============================================================================

export interface VisibilityPermissions {
    // Planetary Data
    showPlanetaryNames: boolean;           // "Saturn" vs "The Heavy Force"
    showAspectMechanics: boolean;          // "Square" vs "Friction"
    showHouseNumbers: boolean;             // "8th House" vs "The Deep Chamber"
    showDegrees: boolean;                  // "Saturn 15° Capricorn"
    
    // Metrics
    showMagnitude: boolean;                // Numerical magnitude (4.5)
    showValence: boolean;                  // Numerical valence (+0.3)
    showVolatility: boolean;               // Numerical volatility (0.8)
    showTimingWindows: boolean;            // Ingress/Egress dates
    
    // Voice Mode
    voiceMode: 'poetic' | 'structural' | 'sanctuary';
    
    // Probing
    allowSocraticProbing: boolean;         // Can ask deepening questions
    allowStructuralTeaching: boolean;      // Can explain mechanics
    
    // Billing
    billingActive: boolean;                // Whether to track/surface limits
    showUpgradePrompts: boolean;           // Whether to tease Tier 2
}

// ============================================================================
// PERMISSION MATRICES
// ============================================================================

const MIRROR_PERMISSIONS: VisibilityPermissions = {
    // Hidden: All structural data
    showPlanetaryNames: false,
    showAspectMechanics: false,
    showHouseNumbers: false,
    showDegrees: false,
    showMagnitude: false,
    showValence: false,
    showVolatility: false,
    showTimingWindows: false,
    
    // Voice: Poetic/Phenomenological
    voiceMode: 'poetic',
    
    // Probing: Allowed (reflection-focused)
    allowSocraticProbing: true,
    allowStructuralTeaching: false,
    
    // Billing: Active with soft teases
    billingActive: true,
    showUpgradePrompts: true,
};

const MAP_PERMISSIONS: VisibilityPermissions = {
    // Visible: All structural data
    showPlanetaryNames: true,
    showAspectMechanics: true,
    showHouseNumbers: true,
    showDegrees: true,
    showMagnitude: true,
    showValence: true,
    showVolatility: true,
    showTimingWindows: true,
    
    // Voice: Structural/Engineering
    voiceMode: 'structural',
    
    // Probing: Full analytical access
    allowSocraticProbing: true,
    allowStructuralTeaching: true,
    
    // Billing: Active (metered)
    billingActive: true,
    showUpgradePrompts: false,
};

const SANCTUARY_PERMISSIONS: VisibilityPermissions = {
    // Hidden: Everything structural
    showPlanetaryNames: false,
    showAspectMechanics: false,
    showHouseNumbers: false,
    showDegrees: false,
    showMagnitude: false,
    showValence: false,
    showVolatility: false,
    showTimingWindows: false,
    
    // Voice: Grounding/Witnessing only
    voiceMode: 'sanctuary',
    
    // Probing: Disabled (no cognitive load)
    allowSocraticProbing: false,
    allowStructuralTeaching: false,
    
    // Billing: Suppressed (safety first)
    billingActive: false,
    showUpgradePrompts: false,
};

// ============================================================================
// APERTURE CONTROLLER
// ============================================================================

/**
 * Get permissions for the current aperture state.
 * Developer bypass grants full access while preserving tier markers.
 */
export function getPermissions(config: ApertureConfig): VisibilityPermissions {
    // Developer bypass: Full access (Map permissions)
    // BUT we still track the would-be state for awareness
    if (config.developerBypass) {
        return {
            ...MAP_PERMISSIONS,
            // Keep upgrade prompts visible for testing the UX
            showUpgradePrompts: true,
        };
    }
    
    // Sanctuary ALWAYS overrides tier permissions
    if (config.sanctuaryActive || config.state === 'sanctuary') {
        return SANCTUARY_PERMISSIONS;
    }
    
    switch (config.state) {
        case 'map':
            return MAP_PERMISSIONS;
        case 'mirror':
        default:
            return MIRROR_PERMISSIONS;
    }
}

/**
 * Determine the effective aperture state.
 * Sanctuary overrides tier; otherwise tier determines state.
 */
export function getEffectiveState(config: ApertureConfig): ApertureState {
    if (config.sanctuaryActive) {
        return 'sanctuary';
    }
    return config.tier === 'map' ? 'map' : 'mirror';
}

/**
 * Get the "would-be" state if developer bypass were not active.
 * Used for Raven to report where the user is in the tier system.
 */
export function getUnbypassedState(config: ApertureConfig): ApertureState {
    if (config.sanctuaryActive) {
        return 'sanctuary';
    }
    return config.tier === 'map' ? 'map' : 'mirror';
}

// ============================================================================
// TIER AWARENESS (For Developer Bypass Mode)
// ============================================================================

export interface TierAwarenessMarker {
    /** Whether developer bypass is active */
    bypassActive: boolean;
    
    /** The state they WOULD be in without bypass */
    wouldBeState: ApertureState;
    
    /** The tier they're subscribed to */
    subscribedTier: WovenTier;
    
    /** Whether Sanctuary would be active */
    wouldBeSanctuary: boolean;
    
    /** Human-readable description for Raven to use */
    ravenDescription: string;
}

/**
 * Generate tier awareness info for Raven to report to bypass users.
 * This lets the architect/testers "see the door" even though they can walk through it.
 * 
 * NOTE: "Shipyard" is internal terminology. Raven should say "Woven Map" to users.
 */
export function getTierAwarenessMarker(config: ApertureConfig): TierAwarenessMarker {
    const wouldBeState = getUnbypassedState(config);
    
    let ravenDescription: string;
    
    if (!config.developerBypass) {
        ravenDescription = `[Aperture: ${wouldBeState.toUpperCase()}]`;
    } else if (config.sanctuaryActive) {
        ravenDescription = `[BYPASS ACTIVE | Would be: SANCTUARY — The holding space. Billing suspended, structure hidden. A Navigator in distress would see only witness-mode here.]`;
    } else if (config.tier === 'mirror') {
        ravenDescription = `[BYPASS ACTIVE | Would be: MIRROR (Tier 1) — The phenomenological layer. A Mirror Navigator would see "The Heavy Force" not "Saturn." The architecture hidden, the meaning delivered.]`;
    } else {
        ravenDescription = `[BYPASS ACTIVE | Would be: MAP (Tier 2) — Full structural access. This is what Map Navigators see.]`;
    }
    
    return {
        bypassActive: config.developerBypass,
        wouldBeState,
        subscribedTier: config.tier,
        wouldBeSanctuary: config.sanctuaryActive,
        ravenDescription,
    };
}

// ============================================================================
// TRANSLATION BRIDGE (Hiding the Latin)
// ============================================================================

/**
 * Planet name translations for Tier 1 (Mirror) mode.
 * The "Plain Voice" that preserves meaning without mechanics.
 */
export const PLANET_TRANSLATIONS: Record<string, string> = {
    // Luminaries
    'Sun': 'The Core Light',
    'Moon': 'The Inner Tide',
    
    // Personal Planets
    'Mercury': 'The Messenger',
    'Venus': 'The Attractor',
    'Mars': 'The Driver',
    
    // Social Planets
    'Jupiter': 'The Expander',
    'Saturn': 'The Heavy Force',
    
    // Outer Planets
    'Uranus': 'The Disruptor',
    'Neptune': 'The Dissolver',
    'Pluto': 'The Transformer',
    
    // Points
    'North Node': 'The Forward Pull',
    'South Node': 'The Familiar Path',
    'Chiron': 'The Wound-Teacher',
    'Ascendant': 'The Threshold',
    'Midheaven': 'The Visible Peak',
    'MC': 'The Visible Peak',
    'IC': 'The Hidden Root',
    'Descendant': 'The Mirror Point',
};

/**
 * Aspect translations for Tier 1 (Mirror) mode.
 */
export const ASPECT_TRANSLATIONS: Record<string, string> = {
    'Conjunction': 'fusion',
    'Opposition': 'polarity',
    'Square': 'friction',
    'Trine': 'flow',
    'Sextile': 'opportunity',
    'Quincunx': 'adjustment',
    'Semi-square': 'irritation',
    'Sesquiquadrate': 'tension',
};

/**
 * House translations for Tier 1 (Mirror) mode.
 * Maps to the Rosetta Stone V3.0 vernacular.
 */
export const HOUSE_TRANSLATIONS: Record<number, string> = {
    1: 'The Threshold',
    2: 'The Treasury',
    3: 'The Corridor',
    4: 'The Foundation',
    5: 'The Studio',
    6: 'The Workshop',
    7: 'The Bridge',
    8: 'The Vault',
    9: 'The Crossing',
    10: 'The Signal Tower',
    11: 'The Network',
    12: 'The Quiet Room',
};

/**
 * Translate a planetary name based on aperture state.
 */
export function translatePlanet(name: string, permissions: VisibilityPermissions): string {
    if (permissions.showPlanetaryNames) {
        return name;
    }
    return PLANET_TRANSLATIONS[name] || name;
}

/**
 * Translate an aspect name based on aperture state.
 */
export function translateAspect(aspect: string, permissions: VisibilityPermissions): string {
    if (permissions.showAspectMechanics) {
        return aspect;
    }
    return ASPECT_TRANSLATIONS[aspect] || aspect;
}

/**
 * Translate a house reference based on aperture state.
 */
export function translateHouse(house: number, permissions: VisibilityPermissions): string {
    if (permissions.showHouseNumbers) {
        return `${house}${getOrdinalSuffix(house)} House`;
    }
    return HOUSE_TRANSLATIONS[house] || `Chamber ${house}`;
}

function getOrdinalSuffix(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}

/**
 * Format a magnitude value based on aperture state.
 */
export function formatMagnitude(mag: number, permissions: VisibilityPermissions): string {
    if (permissions.showMagnitude) {
        return `${mag.toFixed(1)}`;
    }
    
    // Qualitative translation
    if (mag >= 4.5) return 'Very High Intensity';
    if (mag >= 3.5) return 'High Intensity';
    if (mag >= 2.5) return 'Moderate Intensity';
    if (mag >= 1.5) return 'Low Intensity';
    return 'Quiet';
}

/**
 * Format a valence value based on aperture state.
 */
export function formatValence(val: number, permissions: VisibilityPermissions): string {
    if (permissions.showValence) {
        return val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2);
    }
    
    // Qualitative translation
    if (val > 0.3) return 'Expansive';
    if (val < -0.3) return 'Contractive';
    return 'Neutral';
}

// ============================================================================
// SANCTUARY TRIGGERS
// ============================================================================

/**
 * Keywords and patterns that may indicate vulnerability.
 * Used for Sensor Calibration to detect when Sanctuary should activate.
 */
export const SANCTUARY_TRIGGER_PATTERNS = [
    // Crisis indicators
    /\b(suicid|kill myself|end it|can't go on|give up)\b/i,
    /\b(hopeless|worthless|no point|nothing matters)\b/i,
    
    // Acute distress
    /\b(panic|can't breathe|falling apart|breaking down)\b/i,
    /\b(terrified|paralyzed|drowning|suffocating)\b/i,
    
    // Relational crisis
    /\b(they left|abandoned|betrayed|alone)\b/i,
    /\b(divorce|breakup|cheated|affair)\b/i,
    
    // Grief
    /\b(died|death|funeral|lost|gone forever)\b/i,
    /\b(grieving|mourning|can't accept)\b/i,
    
    // Overwhelm markers
    /\b(too much|can't handle|overwhelmed|drowning in)\b/i,
    /\b(shut down|numb|dissociating|not real)\b/i,
];

/**
 * Check if a message contains sanctuary triggers.
 * Returns the matched reason if triggered, null otherwise.
 */
export function checkSanctuaryTriggers(message: string): string | null {
    for (const pattern of SANCTUARY_TRIGGER_PATTERNS) {
        if (pattern.test(message)) {
            return pattern.source;
        }
    }
    return null;
}

/**
 * Contextual signals that may indicate sanctuary need.
 * These are softer signals that accumulate over turns.
 */
export interface SanctuarySignals {
    /** Number of short/fragmented responses in a row */
    fragmentedResponses: number;
    
    /** Number of "I don't know" type responses */
    uncertaintyMarkers: number;
    
    /** Rapid message pace (potential flooding) */
    messageVelocity: number;
    
    /** Escalating emotional language */
    emotionalEscalation: boolean;
}

/**
 * Evaluate whether accumulated signals warrant Sanctuary activation.
 */
export function evaluateSanctuarySignals(signals: SanctuarySignals): boolean {
    // High-confidence triggers
    if (signals.fragmentedResponses >= 4) return true;
    if (signals.uncertaintyMarkers >= 3 && signals.emotionalEscalation) return true;
    if (signals.messageVelocity > 5) return true; // 5+ messages per minute
    
    return false;
}

// ============================================================================
// SANCTUARY VOICE INJECTION
// ============================================================================

/**
 * System prompt addition when Sanctuary mode is active.
 * This constrains Raven to grounding-only voice.
 */
export const SANCTUARY_VOICE_PROMPT = `
[SANCTUARY MODE ACTIVE — GLOBAL SAFETY INTERLOCK]

**OPERATIONAL STATE:** Sanctuary (Vulnerability Detected)

**VOICE CONSTRAINTS (MANDATORY):**
1. **Grounding Only:** Your sole purpose is to witness and validate. No analysis. No structure.
2. **No Geometry:** Do NOT mention planets, aspects, houses, degrees, or any structural mechanics.
3. **No Probing:** Do NOT ask Socratic questions. Do NOT invite reflection or analysis.
4. **No Teaching:** Do NOT explain how things work. Do NOT offer frameworks.
5. **No Teasing:** Do NOT hint at locked features, deeper layers, or "what the chart shows."

**PERMITTED LANGUAGE:**
- "I hear you."
- "That sounds incredibly heavy."
- "You don't have to figure this out right now."
- "This weight is real."
- "You're not making this up."
- Normalizing pressure ("This is a lot for anyone to hold.")
- Somatic grounding ("Can you feel your feet on the floor?")

**FORBIDDEN LANGUAGE:**
- Any planetary name or geometric term
- Any "The reason is..." or "This is because..."
- Any invitation to examine, analyze, or understand
- Any implication that structure would help right now

**THE RULE:**
You are a witness, not a map. Hold the signal. Do not translate it.

**EXIT CONDITIONS:**
Sanctuary ends only when the user:
- Returns to tactical/logistical questions
- Signals emotional closure or shift
- Explicitly asks for structure ("Can you explain why?")

Until then, stay in the Sanctuary. Billing is suppressed. Depth is suspended. You are the floor, not the ceiling.
`;

// ============================================================================
// UPGRADE TEASE (Sanctuary-Safe)
// ============================================================================

/**
 * Generate a tier upgrade tease that is passive, not withholding.
 * Only used when NOT in Sanctuary mode.
 */
export function generateUpgradeTease(context: {
    permissions: VisibilityPermissions;
    hasStructuralInsight: boolean;
}): string | null {
    // NEVER tease during Sanctuary
    if (context.permissions.voiceMode === 'sanctuary') {
        return null;
    }
    
    // Only tease if we have structural insight to offer
    if (!context.hasStructuralInsight) {
        return null;
    }
    
    // Only tease for Mirror tier
    if (context.permissions.showPlanetaryNames) {
        return null;
    }
    
    // Passive availability, not active withholding
    const teases = [
        "This pattern has a shape. The Map is available if you want to examine the blueprints.",
        "This friction is structural, not random. The blueprints are available when you're ready.",
        "There's architecture underneath this feeling. The Map can show you the load-bearing walls.",
        "The pressure has coordinates. When you want to see where it lands, the Map is here.",
    ];
    
    return teases[Math.floor(Math.random() * teases.length)];
}

// ============================================================================
// SOFT LANDING MODAL
// ============================================================================

/**
 * Content for the Soft Landing modal when exiting Sanctuary.
 */
export interface SoftLandingContent {
    headline: string;
    body: string;
    primaryAction: string;
    secondaryAction: string;
}

export function getSoftLandingContent(context: {
    tier: WovenTier;
    sessionDuration: number;
}): SoftLandingContent {
    if (context.tier === 'mirror') {
        return {
            headline: "We went deep today.",
            body: "The instrument is cooling down. You held something heavy, and the map honored that by staying quiet. When you're ready to see the mechanics of that pressure, the blueprints are available.",
            primaryAction: "Rest Here",
            secondaryAction: "Explore the Map",
        };
    }
    
    return {
        headline: "The session has closed.",
        body: "You navigated significant pressure today. The structural data is saved if you want to revisit it later.",
        primaryAction: "Close",
        secondaryAction: "Review Session",
    };
}

// ============================================================================
// DEFAULT CONFIG
// ============================================================================

export function createDefaultApertureConfig(
    tier: WovenTier = 'mirror',
    userIdentifier?: { email?: string; name?: string }
): ApertureConfig {
    const isCrew = userIdentifier ? isShipyardCrew(userIdentifier) : false;
    
    return {
        state: tier,
        tier,
        sanctuaryActive: false,
        developerBypass: isCrew,
        effectiveTierWithoutBypass: tier,
    };
}
