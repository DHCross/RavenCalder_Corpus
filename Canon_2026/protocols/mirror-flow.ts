/**
 * MIRROR REPORT MISSION LAYER — Oracle Directive
 * 
 * Defines narrative structure and tone for qualitative (Mirror) reports.
 * Appended to constitutional layer after MathBrain pruning.
 * Do not alter voice directives without Doctrine approval.
 * 
 * Implements the Charter's engineering grammar for report generation.
 * Provides types, schemas, and prompt fragments for the 2x2 report matrix.
 * 
 * MIRROR_REPORT_ROUTING:
 * - if (!hasSubjectB && !hasTransits) → Solo Mirror
 * - if (hasSubjectB && !hasTransits) → Relational Mirror
 * - otherwise delegate to Balance Meter mission
 */

// ============================================================================
// TYPES
// ============================================================================

export type ReportScope = 'solo' | 'relational';
export type ReportFunction = 'qualitative' | 'quantitative';
export type CharterLayer = 'blueprint' | 'load_model' | 'event_horizon' | 'blueprint_interface' | 'load_on_network';

export interface ReportTypeSpec {
    id: 'mirror' | 'field' | 'cognitive' | 'integration' | 'balance';
    scope: ReportScope;
    function: ReportFunction;
    layer: CharterLayer;
    mandate: string;
    prohibitions: string[];
    requiredOutputs: string[];
    missionVersion?: string;
}

// ============================================================================
// REPORT TYPE REGISTRY (2x2 Matrix)
// ============================================================================

export const REPORT_TYPES: Record<string, ReportTypeSpec> = {
    solo_mirror: {
        id: 'mirror',
        scope: 'solo',
        function: 'qualitative',
        layer: 'blueprint',
        mandate: 'Map the Inner Structure (Timeless). Reveal Anchors, Impulses, Pressure Patterns, and Polarity Lines.',
        prohibitions: ['Event/Transit references', '"You are currently..."', 'Load dynamics', 'Resonance tags', 'Interactive questions'],
        requiredOutputs: ['Identity Anchors', 'Conditional Impulses', 'Structural Pressure', 'Core Polarity Lines'],
        missionVersion: '10.2.1',
    },
    solo_cognitive: {
        id: 'cognitive',
        scope: 'solo',
        function: 'qualitative',
        layer: 'blueprint',
        mandate: 'Derive cognitive architecture from natal geometry. MBTI inference.',
        prohibitions: ['Event/Transit references', 'Load dynamics', 'Prescriptive labels'],
        requiredOutputs: ['Interior Compass', 'Cognitive Motion', 'Type hypothesis with geometry'],
    },
    relational_mirror: {
        id: 'field',
        scope: 'relational',
        function: 'qualitative',
        layer: 'blueprint_interface',
        mandate: 'Map the Space Between (Timeless). Reveal Sparks, Collisions, and Currents.',
        prohibitions: ['Generic "we" statements', 'Merged identity claims', 'Compatibility scores', 'Resonance tags', 'Interactive questions'],
        requiredOutputs: ['Spark Points', 'Collision Zones', 'Current Flow (Bidirectional)'],
        missionVersion: '10.2.1',
    },
    relational_integration: {
        id: 'integration',
        scope: 'relational',
        function: 'qualitative',
        layer: 'blueprint_interface',
        mandate: 'Synthesize conflicting elements. Provide reconciliation logic.',
        prohibitions: ['False synthesis', '"Both are true" without resolution'],
        requiredOutputs: ['Micro-moves', 'Grounded practices', 'Accessible entry points'],
    },
    solo_balance: {
        id: 'balance',
        scope: 'solo',
        function: 'quantitative',
        layer: 'event_horizon',
        mandate: 'Map the Symbolic Moment (Present). Measure current pressure and connect it to Core Polarities.',
        prohibitions: ['Identity claims from transits', '"You ARE compressed"', 'Permanent labels'],
        requiredOutputs: ['Magnitude', 'Load Vector', 'Weather-to-Polarity Interaction', 'Failure Mode Risk'],
    },
    relational_balance: {
        id: 'balance',
        scope: 'relational',
        function: 'quantitative',
        layer: 'load_on_network',
        mandate: 'Joint Load Analysis. Diagnose the Third Entity under pressure.',
        prohibitions: ['Blame assignment', 'Unattributed load', 'Merged dynamics'],
        requiredOutputs: ['Differential Load', 'Resilience Index', 'Support Scaffolding'],
    },
};

// ============================================================================
// TRANSLATION KEY (The Engineering Grammar)
// ============================================================================

export const TRANSLATION_KEY = {
    HOUSES: {
        term: 'CHAMBERS',
        definition: 'Functional components of the machine (auditable, not mystical)',
        sectors: {
            A: { name: 'ROOT & STEM', description: 'Private Foundation — Internal OS and stability' },
            B: { name: 'CANOPY & WORK', description: 'Output — Torque, expenditure, and visibility' },
            C: { name: 'NETWORK', description: 'Relational — Horizontal connections and binding capability' },
        },
        mapping: {
            // SECTOR A: ROOT & STEM (Private Foundation)
            H1: {
                name: 'GATE',
                role: 'User Interface (UI)',
                sector: 'A',
                function: 'The OS layer the world interacts with. Public Face and security protocol.',
                diagnostic: 'Is your interface "Encrypted" (Scorpio) or "Open Source" (Gemini)?',
            },
            H2: {
                name: 'STORE',
                role: 'Power Supply',
                sector: 'A',
                function: 'Capacity and resource management. Where you store fuel (money, self-worth, energy).',
                diagnostic: 'Is the power supply stable or fluctuating?',
            },
            H3: {
                name: 'PATH',
                role: 'I/O Bus',
                sector: 'A',
                function: 'Data processing and routing. The Communication Handler between internal drive and external network.',
                diagnostic: 'Is the bus high-bandwidth (Gemini) or high-latency (Saturn)?',
            },
            H4: {
                name: 'ROOT',
                role: 'Kernel Base',
                sector: 'A',
                function: 'The anchor. Deep storage, ancestry, and the motherboard where the system rests.',
                diagnostic: 'Is the kernel stable or corrupted?',
            },
            H12: {
                name: 'SHELL',
                role: 'Background Processes',
                sector: 'A',
                function: 'Hidden daemons, ghost processes, and system sleep modes. Where Hidden Chaos resides.',
                diagnostic: 'Are background processes draining resources?',
            },
            // SECTOR B: CANOPY & WORK (Output)
            H6: {
                name: 'FIELD',
                role: 'Worker Threads / The Forge',
                sector: 'B',
                function: 'The Engine Room. Daily grind. Creates kinetic energy (work) that feeds the tree.',
                diagnostic: 'Is the engine overclocked or underutilized?',
            },
            H10: {
                name: 'CANOPY',
                role: 'Graphics & Reputation (Display Layer)',
                sector: 'B',
                function: 'The visible output. Career standing, Showstopper function. Renders final product to public.',
                diagnostic: 'Is the display supported by the engine?',
            },
            H9: {
                name: 'HORIZON',
                role: 'Core Processor (Main Logic)',
                sector: 'B',
                function: 'The Main Logic function. Meaning, philosophy, and broadcasting range.',
                diagnostic: 'Is the processor handling the workload?',
            },
            // SECTOR C: NETWORK (Relational)
            H7: {
                name: 'MIRROR',
                role: 'Local Database',
                sector: 'C',
                function: 'Interface for The Other. Handles one-on-one connections and Reactive Caching.',
                diagnostic: 'Is the cache synchronized or out of sync?',
            },
            H8: {
                name: 'CORE',
                role: 'Security Firewall',
                sector: 'C',
                function: 'Shared resources and deep transformation. Binding protocols and merge conflicts.',
                diagnostic: 'Is the firewall too permissive or too restrictive?',
            },
            H11: {
                name: 'GROVE',
                role: 'Network Protocol (WAN)',
                sector: 'C',
                function: 'Wide area network. Allies, groups, and future visions. Power in Network.',
                diagnostic: 'Is the network strong or isolated?',
            },
            H5: {
                name: 'SEED',
                role: 'Creative Output',
                sector: 'C',
                function: 'The creation engine. Risk, play, and child processes. Generates new instances of self.',
                diagnostic: 'Is creativity flowing or blocked?',
            },
        },
    },
    SIGNS: {
        term: 'GRAIN',
        definition: 'Physics of the chamber',
        mapping: {
            fire_cardinal: { symbol: '>>>>', physics: 'Fast, Low Drag, Forward only', signs: ['Aries'] },
            fire_fixed: { symbol: '>>>>>', physics: 'Sustained Heat, Radiant', signs: ['Leo'] },
            fire_mutable: { symbol: '>>~>>', physics: 'Variable Ignition, Scattered', signs: ['Sagittarius'] },
            earth_cardinal: { symbol: '====', physics: 'Stable, High Drag, Initiating', signs: ['Capricorn'] },
            earth_fixed: { symbol: '=====', physics: 'Maximum Friction, Immovable', signs: ['Taurus'] },
            earth_mutable: { symbol: '==~==', physics: 'Practical Flexibility', signs: ['Virgo'] },
            water_cardinal: { symbol: '~~~~', physics: 'Fluid Initiation, Protective', signs: ['Cancer'] },
            water_fixed: { symbol: '~~~~~', physics: 'Deep, Undercurrent, Pressure', signs: ['Scorpio'] },
            water_mutable: { symbol: '~~^~~', physics: 'Absorbing, Permeable', signs: ['Pisces'] },
            air_cardinal: { symbol: '::::', physics: 'Dispersed, Relational', signs: ['Libra'] },
            air_fixed: { symbol: ':::::', physics: 'Fixed Pattern, Systemic', signs: ['Aquarius'] },
            air_mutable: { symbol: '::~::', physics: 'High Transmission, Variable', signs: ['Gemini'] },
        },
    },
    PLANETS: {
        term: 'ENGINES',
        definition: 'Active machines embedded in chambers',
        mapping: {
            Sun: { label: 'DIRECTIVE', needs: 'visibility', produces: 'identity' },
            Moon: { label: 'RECHARGE', needs: 'safety', produces: 'nourishment' },
            Mercury: { label: 'ROUTER', needs: 'data', produces: 'connections' },
            Venus: { label: 'MAGNET', needs: 'beauty', produces: 'attraction' },
            Mars: { label: 'IGNITION', needs: 'fuel', produces: 'heat' },
            Jupiter: { label: 'AMPLIFIER', needs: 'meaning', produces: 'expansion' },
            Saturn: { label: 'WEIGHT', needs: 'support', produces: 'gravity' },
            Uranus: { label: 'DISRUPTOR', needs: 'freedom', produces: 'shock' },
            Neptune: { label: 'DISSOLVER', needs: 'transcendence', produces: 'fog' },
            Pluto: { label: 'REACTOR', needs: 'depth', produces: 'transformation' },
        },
    },
    LOAD_DYNAMICS: {
        term: 'EVENT HORIZON',
        definition: 'External, episodic forces that apply load to the structure',
        mapping: {
            Saturn: { type: 'COMPRESSION', effect: 'Heavy Load / Testing / Gravity' },
            Neptune: { type: 'EROSION', effect: 'Rust / Fog / Leakage' },
            Uranus: { type: 'SHEAR', effect: 'Shock / Fracture / Sudden Release' },
            Mars: { type: 'FRICTION', effect: 'Heat / Speed / Conflict' },
            Jupiter: { type: 'EXPANSION', effect: 'Volume Increase / Overload' },
            Pluto: { type: 'EXCAVATION', effect: 'Deep Pressure / Transformation' },
        },
    },
};

// ============================================================================
// TRANSLATION BRIDGE (Beginner-Friendly Lexicon)
// "Hiding the Latin" — Convert technical lexicon to felt experience language
// ============================================================================

export const TRANSLATION_BRIDGE = {
    // Section names (Container)
    SECTIONS: {
        orientation_plate: { label: 'THE COMPASS', analogy: 'How you steer the ship' },
        acorn: { label: 'THE BLUEPRINT', analogy: 'The architectural plan of your life' },
        engines: { label: 'THE DRIVERS', analogy: 'The active forces making things happen' },
        signs: { label: 'THE STYLE', analogy: 'The costume or method the driver uses' },
        houses: { label: 'LIFE ARENA', analogy: 'The room where the action takes place' },
    },

    // Planet translations (The Compass)
    PLANETS: {
        Sun: { label: 'Core Purpose', subtitle: 'The Engine. What you are fueled to build.' },
        Moon: { label: 'Internal Rhythm', subtitle: 'The Needs. How you react, recharge, and feel safe.' },
        Mercury: { label: 'The Voice', subtitle: 'How you think, process, and communicate.' },
        Venus: { label: 'The Attractor', subtitle: 'What you value and how you connect.' },
        Mars: { label: 'The Drive', subtitle: 'How you take action and assert yourself.' },
        Jupiter: { label: 'The Expander', subtitle: 'Where you seek growth and meaning.' },
        Saturn: { label: 'The Structure', subtitle: 'Where you face limits and build discipline.' },
        Uranus: { label: 'The Disruptor', subtitle: 'Where you break patterns and seek freedom.' },
        Neptune: { label: 'The Dreamer', subtitle: 'Where imagination and intuition live.' },
        Pluto: { label: 'The Transformer', subtitle: 'Where deep change and power reside.' },
        Chiron: { label: 'The Wound', subtitle: 'Where healing and teaching intersect.' },
        Mean_Node: { label: 'Growth Direction', subtitle: 'The evolutionary pull forward.' },
    },

    // Angle translations
    ANGLES: {
        Ascendant: { label: 'The Interface', subtitle: 'The Storefront. How you enter a room and meet the world.' },
        Medium_Coeli: { label: 'The North Star', subtitle: 'The Vocation. What you are striving to be known for.' },
        Descendant: { label: 'The Mirror', subtitle: 'What you seek in others and relationships.' },
        Imum_Coeli: { label: 'The Root', subtitle: 'Your private anchor, origin, and inner foundation.' },
    },

    // House translations (The Acorn / Life Arenas) — v2.1 with Ancestral Names + Weather Functions
    HOUSES: {
        1: {
            canon: 'Gate',
            label: 'INTERFACE & VITALITY',
            ancestral: 'The Helm (Horoskopos)',
            natalFunction: 'The Interface. Where the chart steers itself.',
            weatherFunction: 'Vitality Check. Pressure on the hull.',
        },
        2: {
            canon: 'Store',
            label: 'RESOURCES & VALUES',
            ancestral: 'Gate of Hades',
            natalFunction: 'Fuel Tank. Dependence and fragility.',
            weatherFunction: 'Resource Load. Do we have fuel?',
        },
        3: {
            canon: 'Path',
            label: 'COMMUNICATION & ENVIRONMENT',
            ancestral: 'The Goddess (Dea)',
            natalFunction: 'Local Router. Daily ritual and short-range traffic.',
            weatherFunction: 'Signal Jam. Nervous system pressure.',
        },
        4: {
            canon: 'Root',
            label: 'HOME & PRIVATE ANCHOR',
            ancestral: 'The Subterraneous (Hypogeion)',
            natalFunction: 'The Anchor. Where things sink or settle.',
            weatherFunction: 'Displacement. Foundation pressure.',
        },
        5: {
            canon: 'Forge',
            label: 'CREATIVITY & RISK',
            ancestral: 'Good Fortune (Agathe Tyche)',
            natalFunction: 'The Generator. Joyful outpouring and creation.',
            weatherFunction: 'Output Load. Creative expenditure.',
        },
        6: {
            canon: 'Field',
            label: 'WORK & ROUTINE',
            ancestral: 'Bad Fortune (Kake Tyche)',
            natalFunction: 'Maintenance. Strain and obligation.',
            weatherFunction: 'System Grind. Duty and health load.',
        },
        7: {
            canon: 'Mirror',
            label: 'PARTNERSHIP',
            ancestral: 'The Setting Place (Dysis)',
            natalFunction: 'The Coupling. Port for the secondary engine.',
            weatherFunction: 'Misalignment. Pressure from the other.',
        },
        8: {
            canon: 'Core',
            label: 'INTIMACY & TRANSFORMATION',
            ancestral: 'The Idle Place (Epikatōphlion)',
            natalFunction: 'Fusion Chamber. Debt, inheritance, limits.',
            weatherFunction: 'Compression. Deep psychological pressure.',
        },
        9: {
            canon: 'Horizon',
            label: 'MEANING & VOYAGE',
            ancestral: 'The God (Theos)',
            natalFunction: 'Navigation. Wide open sky of meaning.',
            weatherFunction: 'Perspective Shift. Worldview pressure.',
        },
        10: {
            canon: 'Canopy',
            label: 'PUBLIC LEGACY',
            ancestral: 'Midheaven (Mesouranima)',
            natalFunction: 'The Roof / Display. Visible summit.',
            weatherFunction: 'Visibility Load. Public scrutiny.',
        },
        11: {
            canon: 'Grove',
            label: 'COMMUNITY & NETWORK',
            ancestral: 'Good Spirit (Agathos Daimon)',
            natalFunction: 'The Grid. Fortune\'s Ally.',
            weatherFunction: 'Static. Alliance tension.',
        },
        12: {
            canon: 'Shell',
            label: 'SOLITUDE & RETREAT',
            ancestral: 'Bad Spirit (Kakos Daimon)',
            natalFunction: 'Recovery / Sleep. Place of undoing.',
            weatherFunction: 'Ghost Load. Unconscious pressure.',
        },
    },

    // Sign meanings (brief)
    SIGNS: {
        Aries: { keyword: 'Initiate', style: 'Direct, Bold, Impulsive' },
        Taurus: { keyword: 'Stabilize', style: 'Steady, Sensual, Persistent' },
        Gemini: { keyword: 'Connect', style: 'Curious, Adaptive, Versatile' },
        Cancer: { keyword: 'Nurture', style: 'Protective, Emotional, Intuitive' },
        Leo: { keyword: 'Shine', style: 'Radiant, Generous, Expressive' },
        Virgo: { keyword: 'Refine', style: 'Analytical, Practical, Service-Oriented' },
        Libra: { keyword: 'Balance', style: 'Diplomatic, Aesthetic, Relational' },
        Scorpio: { keyword: 'Transform', style: 'Intense, Penetrating, Strategic' },
        Sagittarius: { keyword: 'Explore', style: 'Adventurous, Philosophical, Expansive' },
        Capricorn: { keyword: 'Build', style: 'Ambitious, Disciplined, Enduring' },
        Aquarius: { keyword: 'Innovate', style: 'Independent, Visionary, Unconventional' },
        Pisces: { keyword: 'Dissolve', style: 'Compassionate, Imaginative, Fluid' },
    },

    // Empty house translation
    EMPTY_HOUSE: {
        technical: 'None',
        beginner: 'Open / Responsive',
        caption: 'This area is architecturally quiet. It activates when visitors (transits) arrive, but it is not a permanent generator of stress.',
    },

    // Metric translations (for Load Dynamics)
    METRICS: {
        magnitude: { technical: 'Magnitude', beginner: 'Volume', concept: 'How loud is the signal?' },
        directional_bias: { technical: 'Valence', beginner: 'The Flow', concept: 'Expansion (forward) or Contraction (squeeze)?' },
        volatility: { technical: 'Volatility', beginner: 'Stability', concept: 'Is the ground shaking or steady?' },
    },
};

// ============================================================================
// DIAGNOSTIC SUMMARY TEMPLATE
// ============================================================================

export const DIAGNOSTIC_SUMMARY_TEMPLATE = `
### DIAGNOSTIC SUMMARY

**PRIMARY LOAD PATH:**
→ [Where is the weight resting?]

**STRESS VECTOR:**
→ [Where is the structure overheating or cracking?]

**ADJUSTMENT:**
→ [Vent / Reinforce / Isolate / Accelerate]
`;

// ============================================================================
// PROMPT FRAGMENT GENERATOR
// ============================================================================

/**
 * Returns the Mirror Flow constraint block for a given report type.
 * Inject this into the system prompt when generating reports.
 */
export function getReportPromptFragment(reportType: keyof typeof REPORT_TYPES): string {
    const spec = REPORT_TYPES[reportType];
    if (!spec) return '';

    return `
---
## MIRROR FLOW CONSTRAINTS (${spec.id.toUpperCase()})

**Layer:** ${spec.layer.toUpperCase()}
**Mandate:** ${spec.mandate}

**PROHIBITED (Hard Constraints):**
${spec.prohibitions.map(p => `- ${p}`).join('\n')}

**REQUIRED OUTPUTS:**
${spec.requiredOutputs.map(r => `- ${r}`).join('\n')}

**DIAGNOSTIC CLOSE:**
All reports must end with: PRIMARY LOAD PATH → STRESS VECTOR → ADJUSTMENT
---
`;
}

/**
 * Maps report type from UI to the internal key.
 */
export function getReportTypeKey(
    uiType: 'mirror' | 'cognitive' | 'field' | 'integration',
    scope: 'solo' | 'relational'
): keyof typeof REPORT_TYPES {
    if (uiType === 'mirror') return scope === 'solo' ? 'solo_mirror' : 'relational_mirror';
    if (uiType === 'cognitive') return 'solo_cognitive';
    if (uiType === 'field') return 'relational_mirror';
    if (uiType === 'integration') return 'relational_integration';
    return 'solo_mirror';
}

/**
 * Get the chamber name for a house number.
 */
export function getChamberName(houseNumber: number): string {
    const key = `H${houseNumber}` as keyof typeof TRANSLATION_KEY.HOUSES.mapping;
    const chamber = TRANSLATION_KEY.HOUSES.mapping[key];
    return chamber ? `${chamber.name} (${chamber.role})` : `House ${houseNumber}`;
}

/**
 * Get the engine label for a planet.
 */
export function getEngineLabel(planet: string): string {
    const engine = TRANSLATION_KEY.PLANETS.mapping[planet as keyof typeof TRANSLATION_KEY.PLANETS.mapping];
    return engine ? engine.label : planet;
}

// ============================================================================
// TRANSLATION BRIDGE HELPERS
// ============================================================================

/**
 * Get beginner-friendly label for a planet (e.g., "Core Purpose" for Sun)
 */
export function getPlanetLabel(planet: string): { label: string; subtitle: string } {
    const p = TRANSLATION_BRIDGE.PLANETS[planet as keyof typeof TRANSLATION_BRIDGE.PLANETS];
    return p || { label: planet, subtitle: '' };
}

/**
 * Get beginner-friendly label for an angle (e.g., "The Interface" for Ascendant)
 */
export function getAngleLabel(angle: string): { label: string; subtitle: string } {
    const a = TRANSLATION_BRIDGE.ANGLES[angle as keyof typeof TRANSLATION_BRIDGE.ANGLES];
    return a || { label: angle, subtitle: '' };
}

/**
 * Get beginner-friendly house label (e.g., "INTERFACE & VITALITY" for 1st house)
 */
export function getHouseLabel(houseNumber: number): {
    canon: string;
    label: string;
    ancestral: string;
    natalFunction: string;
    weatherFunction: string;
} {
    const h = TRANSLATION_BRIDGE.HOUSES[houseNumber as keyof typeof TRANSLATION_BRIDGE.HOUSES];
    return h || {
        canon: `H${houseNumber}`,
        label: `House ${houseNumber}`,
        ancestral: '',
        natalFunction: '',
        weatherFunction: '',
    };
}

/**
 * Get sign meaning (keyword + style)
 */
export function getSignMeaning(sign: string): { keyword: string; style: string } {
    const s = TRANSLATION_BRIDGE.SIGNS[sign as keyof typeof TRANSLATION_BRIDGE.SIGNS];
    return s || { keyword: sign, style: '' };
}

/**
 * Format a planet placement for display
 * e.g., "Your Core Purpose (Sun) is to Shine (Leo) in your Public Legacy (10th House)"
 */
export function formatPlanetDescription(planet: string, sign: string, house: number): string {
    const planetInfo = getPlanetLabel(planet);
    const signInfo = getSignMeaning(sign);
    const houseInfo = getHouseLabel(house);

    return `Your **${planetInfo.label}** (${planet}) is to **${signInfo.keyword}** (${sign}) in your **${houseInfo.label}** (${house}${getOrdinalSuffix(house)} House).`;
}

/**
 * Get ordinal suffix (1st, 2nd, 3rd, etc.)
 */
function getOrdinalSuffix(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}
