import { WOVEN_CHAMBERS } from './house_canon';

/**
 * Woven Map House Doctrine
 * 
 * The Master Translation Table for all 12 houses.
 * This is the canonical reference for plain-language house explanations.
 * 
 * Key Principle:
 * Houses are not life topics — they are structural rooms that show 
 * where pressure lands and what breaks if the load is too great.
 */

export interface HouseContext {
    number: number;
    wovenName: string;
    meaning: string;
    notMeaning: string;
    coreQuestion: string;
    pressureEffect: string;
    // Complete Master Table fields (v10.3.26)
    ancestralName: string;              // Hellenistic/ancient referent for historical continuity
    natalFunction: string;               // Blueprint/Capacity - what the chamber *can* hold or circulate
    symbolicWeatherFunction: string;     // Load/Pressure - what it *feels like* when transits activate
}

/**
 * Master House Translation Table
 * 
 * Usage:
 * - Natal (Blueprint): Shows *where* pressure can land and what system absorbs it
 * - Symbolic Weather (Transits): Shows *when* and *how much* load is hitting that room
 * 
 * Houses describe capacity.
 * Transits describe load.
 * Events happen when load exceeds capacity.
 */
export const HOUSE_DOCTRINE: HouseContext[] = [
    {
        number: 1,
        wovenName: 'The Gate',
        meaning: 'The Hull/Interface. Where the system meets the world and filters impact.',
        notMeaning: 'Personality traits or ego',
        coreQuestion: 'How does this vessel meet the world?',
        pressureEffect: 'Vitality, appearance, self-protection',
        ancestralName: 'The Helm (Horoskopos)',
        natalFunction: 'The Interface. Where the chart steers itself. The filter that decides structural integrity and defense.',
        symbolicWeatherFunction: 'Vitality Check. Pressure on the hull. Tests the integrity of the vessel against external impact.'
    },
    {
        number: 2,
        wovenName: 'The Store',
        meaning: 'The Fuel Tank. Capacity and resource dependence.',
        notMeaning: 'Greed or shopping',
        coreQuestion: 'Do we have the fuel to sustain operations?',
        pressureEffect: 'Money, assets, survival resources',
        ancestralName: 'Gate of Hades',
        natalFunction: 'Fuel Tank. Not just wealth, but "dependence and fragility." What sustains the life but can be taken away.',
        symbolicWeatherFunction: 'Resource Load. Pressure on capacity. Answers: "Do we have the fuel to sustain operations?"'
    },
    {
        number: 3,
        wovenName: 'The Path',
        meaning: 'The Local Router. Short-range data processing and daily ritual.',
        notMeaning: 'Intelligence or school',
        coreQuestion: 'How is data moving through the local network?',
        pressureEffect: 'Communication speed, logistics, siblings',
        ancestralName: 'The Goddess (Dea)',
        natalFunction: 'Local Router. The realm of "daily ritual and sacred repetition." Processing immediate data and short-range traffic.',
        symbolicWeatherFunction: 'Signal Jam. High volume of local inputs. Pressure on the nervous system or daily logistics.'
    },
    {
        number: 4,
        wovenName: 'The Root',
        meaning: 'The Anchor. The foundation where the system cools down and stabilizes offline.',
        notMeaning: 'Real estate',
        coreQuestion: 'Where does the system anchor itself?',
        pressureEffect: 'Home base, private life, ancestry',
        ancestralName: 'The Subterranean (Hypogeion)',
        natalFunction: 'The Anchor. The hidden foundation. Where the system recharges offline. Privacy, lineage, and the "bones" of the house.',
        symbolicWeatherFunction: 'Foundation Stress. Pressure on the base. Issues of security, home, or the physical container of the self.'
    },
    {
        number: 5,
        wovenName: 'The Forge',
        meaning: 'The Generator. The engine of surplus energy, risk, and creation.',
        notMeaning: 'Parties or gambling',
        coreQuestion: 'Where does the surplus energy go?',
        pressureEffect: 'Creativity, children, romance, risk',
        ancestralName: 'Good Fortune (Bona Fortuna)',
        natalFunction: 'The Engine of Joy. Creative output, risk, and offspring. Where the system burns fuel for the sake of "heat and light."',
        symbolicWeatherFunction: 'Ignition Surge. High creative or erotic pressure. A demand for output.'
    },
    {
        number: 6,
        wovenName: 'The Field',
        meaning: 'The Engine Room. Maintenance, duty, and friction. Where the system handles drag.',
        notMeaning: 'Chores',
        coreQuestion: 'Is the engine running cleanly?',
        pressureEffect: 'Health, daily work, service, routine',
        ancestralName: 'Bad Fortune (Mala Fortuna)',
        natalFunction: 'Maintenance. The Engine Room. Duty, illness, and the "grind" required to keep the system running.',
        symbolicWeatherFunction: 'System Drag. Friction in the gears. Health issues, duty overload, or the weight of necessity.'
    },
    {
        number: 7,
        wovenName: 'The Mirror',
        meaning: 'The Coupling. The relational interface where the Self locks into the Other.',
        notMeaning: 'Soulmates',
        coreQuestion: 'Who is on the other side of the glass?',
        pressureEffect: 'Partnerships, contracts, open conflict',
        ancestralName: 'The Setting Place (Occas)',
        natalFunction: 'The Other. The optical physics where the Self disappears into reflection. Partnership and open enemies.',
        symbolicWeatherFunction: 'Relational Torque. Pressure from the outside. The demand to calibrate to another\'s reality.'
    },
    {
        number: 8,
        wovenName: 'The Core',
        meaning: 'The Fusion Chamber. High-pressure zone of shared resources, debt, and transformation.',
        notMeaning: 'Death or sex alone',
        coreQuestion: 'What does this cost once I enter?',
        pressureEffect: 'Shared assets, intimacy, deep change',
        ancestralName: 'The Idle Place (Epicataphora)',
        natalFunction: 'Fusion & Debt. The high-pressure zone of shared resources, inheritance, and inevitability. Transformation through loss or merger.',
        symbolicWeatherFunction: 'Metamorphic Load. High-stakes pressure. Structural change through fusion or severance.'
    },
    {
        number: 9,
        wovenName: 'The Horizon',
        meaning: 'The Navigation Deck. Long-range sensors, philosophy, and trajectory.',
        notMeaning: 'Travel for fun',
        coreQuestion: 'What is the long-range trajectory?',
        pressureEffect: 'Beliefs, publishing, legal matters',
        ancestralName: 'The God (Deus)',
        natalFunction: 'The Lens. Philosophy, foreign travel, and "Long-Range Navigation." The wide-open sky of Meaning.',
        symbolicWeatherFunction: 'Expansion Vector. Pressure to widen the frame. Challenges to belief or the call to explore.'
    },
    {
        number: 10,
        wovenName: 'The Canopy',
        meaning: 'The Roof. Public legacy and visibility. Where the system bears the weight of being seen.',
        notMeaning: 'Career ambition',
        coreQuestion: 'What is the public structure?',
        pressureEffect: 'Reputation, authority, career peaks',
        ancestralName: 'The Midheaven (Mesourania)',
        natalFunction: 'The Roof. Public legacy, authority, and the visible summit of the structure. How the world names you.',
        symbolicWeatherFunction: 'Visibility Stress. Pressure on reputation. The burden of being seen or the demand to lead.'
    },
    {
        number: 11,
        wovenName: 'The Grove',
        meaning: 'The Grid. The network of allies and collective support beams.',
        notMeaning: 'Parties or popularity',
        coreQuestion: 'Who supports the main beam?',
        pressureEffect: 'Friendships, networks, future hopes',
        ancestralName: 'Good Spirit (Bonus Spiritus)',
        natalFunction: 'The Network. The structural support beam provided by the wider web of allies, hopes, and community.',
        symbolicWeatherFunction: 'Social Load. Pressure from the group. The weight of collective expectation or support.'
    },
    {
        number: 12,
        wovenName: 'The Shell',
        meaning: 'The Void. The space of undoing, system sleep, and dissolution.',
        notMeaning: 'Mental illness',
        coreQuestion: 'Where does the system go offline?',
        pressureEffect: 'Isolation, unconscious, spiritual retreat',
        ancestralName: 'Bad Spirit (Malus Spiritus)',
        natalFunction: 'The Void. The architectural space of undoing, dissolution, and system sleep. Where the signal fades.',
        symbolicWeatherFunction: 'Ghost Load. Invisible pressure. Somatic fatigue, dreams, or the return of the repressed.'
    }
];

/**
 * Get house context by number
 */
export function getHouseContext(houseNumber: number): HouseContext | undefined {
    return HOUSE_DOCTRINE.find(h => h.number === houseNumber);
}

/**
 * Format house context for reading output
 * Returns a compact explanation suitable for inline use
 */
export function formatHouseExplanation(houseNumber: number): string {
    const ctx = getHouseContext(houseNumber);
    if (!ctx) return `House ${houseNumber}`;
    return `House ${houseNumber} — ${ctx.wovenName}: ${ctx.meaning}.`;
}

/**
 * Format house context for detailed reading output
 * Returns a full explanation suitable for geometry snapshots
 */
export function formatHouseDetail(houseNumber: number): string {
    const ctx = getHouseContext(houseNumber);
    if (!ctx) return `House ${houseNumber}`;
    return `**House ${houseNumber} — ${ctx.wovenName}**
${ctx.meaning}
*Core Question*: "${ctx.coreQuestion}"`;
}

/**
 * Doctrine: One Sentence Canon
 */
export const HOUSE_CANON =
    'In the Woven Map, houses are structural chambers that define capacity, not topical buckets that sort activities.';

/**
 * Diagnostic Shortcut for quick house identification
 */
export const HOUSE_DIAGNOSTIC_SHORTCUT = `
When something happens, ask:
• Does it have coordinates, cost, or paperwork? → 2nd, 6th, or 10th
• Does it affect emotional grounding or lineage? → 4th
• Does it strain the body's ability to keep going? → 6th
• Does it involve another person's agency or shared consequence? → 7th or 8th
• Does it destabilize meaning or direction? → 9th or 11th
• Does it require withdrawal or rest without explanation? → 12th
`;

/**
 * Export the complete doctrine as a prompt-ready string
 * v10.3.26: Complete Master Table with 5-column structure (Math, Myth, Ancestral, Natal Function, Symbolic Weather Function)
 */
export function buildHouseDoctrinePrompt(): string {
    let prompt = `## Woven Map House Translation Table (Complete Master Table)\n\n`;
    prompt += `${HOUSE_CANON}\n\n`;
    prompt += `**Dual Ontology (LRD-1):** Structure (house as architecture) vs. Atmosphere (transit as pressure). These are distinct and must not be merged.\n\n`;
    prompt += `| House (Math) | Woven Map (Mythic Label) | Ancestral Name (Hellenistic) | Natal Function (Blueprint/Capacity) | Symbolic Weather Function (Load/Pressure) |\n`;
    prompt += `|:---- | :---- | :---- | :---- | :---- |\n`;

    for (const h of HOUSE_DOCTRINE) {
        prompt += `| **${h.number}st** | **${h.wovenName}** | ${h.ancestralName} | ${h.natalFunction} | ${h.symbolicWeatherFunction} |\n`;
    }

    prompt += `\n**When presenting planetary positions, ALWAYS include:**\n`;
    prompt += `1. The Woven Map house name (e.g., "The Core") - NEVER refer to houses by number alone in the Voice Layer\n`;
    prompt += `2. The ancestral name for historical continuity (e.g., "The Idle Place")\n`;
    prompt += `3. The natal function (Blueprint/Capacity) for structural context\n`;
    prompt += `4. The symbolic weather function (Load/Pressure) when transits are active\n`;
    prompt += `5. The core question it answers\n\n`;
    prompt += `**Dual Grammar Requirement:** Every house must speak both Math (House Number) and Myth (Chamber Name). Numbers without metaphor are sterile; metaphor without math is drift.\n`;

    return prompt;
}

/**
 * Critique of Literalism
 * 
 * Modern astrological names often describe "activities" (what happens there).
 * The Woven Map and Ancestral names describe "architecture" (what the room is).
 * This distinction is critical for diagnostic accuracy.
 * 
 * Epistemological Reminder:
 * "The Twelfth is not 'hidden enemies'; it is the containment chamber for boundary dissolution."
 * 
 * This preserves the symbolic neutrality that the entire Woven Map depends on.
 */
export const HOUSE_LITERALISM_CRITIQUE = `
HOUSE LITERALISM CRITIQUE (Why We Rename):

## The Core Distinction

Modern astrological names often describe **"activities"** (what happens there).  
The Woven Map and Ancestral names describe **"architecture"** (what the room is).  
This distinction is critical for diagnostic accuracy.

## The Comparison Table

| House | Modern Literal Name (Avoid) | The Woven Map Structural Critique |
|:---- | :---- | :---- |
| **1st** | Self, Identity | Obscures **The Helm**—the mechanism where the chart steers itself and maintains hull integrity. |
| **2nd** | Money, Possessions | Misses **The Gate of Hades**—the architectural vulnerability of sustenance and the fuel required to survive. |
| **3rd** | Communication | Reduces **The Goddess** to emails. Misses the structural function of **Daily Ritual** and local routing. |
| **4th** | Home, Family | Simplifies **The Subterranean**—the deep anchor point where things sink, settle, and cool down. |
| **5th** | Creativity, Fun | Narrows **Good Fortune** (Cosmic Delight) to a hobby. This is the **Generator** of surplus energy and risk. |
| **6th** | Health, Work | Sanitizes **Bad Fortune**. This is the **Engine Room** of structural strain, obligation, and maintenance. |
| **7th** | Marriage | Limits **The Setting Place**—the optical physics where the Self disappears into reflection. |
| **8th** | Shared Resources | Psychologizes **The Idle Place**—the difficult, high-pressure zone of debt, limits, and inevitability. |
| **9th** | Philosophy, Travel | Secularizes **The God**—the wide open sky of Meaning and Long-Range Navigation. |
| **10th** | Career | Reduces **The Midheaven**—the visible summit of the structure—to a job title. |
| **11th** | Friends | Simplifies **The Good Spirit**—the structural support beam provided by the wider network/weave. |
| **12th** | Unconscious | Psychologizes **The Bad Spirit**—the architectural space of undoing, dissolution, and system sleep. |

## The Epistemological Principle

**The Twelfth is not "hidden enemies"; it is the containment chamber for boundary dissolution.**

This critique preserves the symbolic neutrality that the entire Woven Map depends on.  
We describe **structure**, not **outcome**. We map **capacity**, not **activity**.
`;

/**
 * Configuration for Dropdowns and UI Elements
 * Maps Houses to the UI standard: "${Name} (H${Number})"
 * Sourced from WOVEN_CHAMBERS to ensure Canonical Naming.
 */
export const DOMAIN_CONFIG = [
    { label: `${WOVEN_CHAMBERS[1]} (H1)`, houseNumber: 1 },
    { label: `${WOVEN_CHAMBERS[2]} (H2)`, houseNumber: 2 },
    { label: `${WOVEN_CHAMBERS[3]} (H3)`, houseNumber: 3 },
    { label: `${WOVEN_CHAMBERS[4]} (H4)`, houseNumber: 4 },
    { label: `${WOVEN_CHAMBERS[5]} (H5)`, houseNumber: 5 },
    { label: `${WOVEN_CHAMBERS[6]} (H6)`, houseNumber: 6 },
    { label: `${WOVEN_CHAMBERS[7]} (H7)`, houseNumber: 7 },
    { label: `${WOVEN_CHAMBERS[8]} (H8)`, houseNumber: 8 },
    { label: `${WOVEN_CHAMBERS[9]} (H9)`, houseNumber: 9 },
    { label: `${WOVEN_CHAMBERS[10]} (H10)`, houseNumber: 10 },
    { label: `${WOVEN_CHAMBERS[11]} (H11)`, houseNumber: 11 },
    { label: `${WOVEN_CHAMBERS[12]} (H12)`, houseNumber: 12 },
] as const;
