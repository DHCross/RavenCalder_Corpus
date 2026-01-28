/**
 * THE WOVEN MAP HOUSE CANON
 * Technical Reference v1.2 | Role: The Analyst's Source
 * 
 * Defines the structural engineering definitions for the 12 Chambers.
 * Links "Mirror Flow" engineering metaphors to Ancestral (Hellenistic) architecture.
 */

export const WOVEN_HOUSE_CANON = {
    1: {
        name: "The Gate",
        ancestral: "The Helm (Horoskopos)",
        role: "Interface & Vitality",
        definition: "The filter that decides structural integrity and defense.",
        load_function: "Vitality Check. Pressure on the hull.",
        // New Canon (v2)
        plain_definition: "Your way of meeting the world is analytic, precise, and reforming. You don’t just adapt—you tune the frequency. Uranus adds innovation; Pluto adds depth and volatility.",
        symbolic_definition: "The gate vibrates when crossed. It’s a door that heals by changing shape—control meeting evolution.",
        core_pressure: "Safety through precision vs. liberation through disruption."
    },
    2: {
        name: "The Vault", // Renamed from Store
        ancestral: "Gate of Hades",
        role: "Resources & Values",
        definition: "Capacity, caloric reserves, and the vulnerability of sustenance.",
        load_function: "Resource Load. Pressure on capacity.",
        plain_definition: "You locate stability through balance and beauty—value emerges in symmetry and fairness. No planet here means this domain is activated situationally rather than constantly.",
        symbolic_definition: "The vault is an aesthetic safe—order and grace are the currencies stored inside.",
        core_pressure: "Wanting harmony in worth—needing others’ reflection to confirm internal value."
    },
    3: {
        name: "The Exchange", // Renamed from Path
        ancestral: "The Goddess (Dea)",
        role: "Communication & Learning",
        definition: "Processing immediate data and short-range traffic. Daily ritual.",
        load_function: "Signal Jam. High volume of local inputs.",
        plain_definition: "Thought and speech are imaginative, borderless, visionary—sometimes diffused. You intuit meaning rather than argue it.",
        symbolic_definition: "The exchange is misted glass—truth arrives as echo, not declaration.",
        core_pressure: "Yearning for clarity amid idealism; translating inspiration into something shareable."
    },
    4: {
        name: "The Root",
        ancestral: "The Subterraneous (Hypogeion)",
        role: "Home & Family",
        definition: "The foundation where the system cools down and stabilizes.",
        load_function: "Displacement. Pressure on the foundation or lineage.",
        plain_definition: "Your grounding process is disciplined and long-term. You grow by learning structure and responsibility inside private life.",
        symbolic_definition: "The root learns patience—stone before soil.",
        core_pressure: "Safety through mastery; emotional maturity as vocation."
    },
    5: {
        name: "The Playground", // Renamed from Forge
        ancestral: "Good Fortune (Agathe Tyche)",
        role: "Creativity & Joy",
        definition: "Zone of surplus energy converted into creation, risk, or offspring.",
        load_function: "Output Load. High demand for creative expenditure.",
        plain_definition: "Creativity thrives in experimentation and ideas shared collectively. Play has a humanitarian or inventive edge.",
        symbolic_definition: "The playground is an open lab—joy through invention.",
        core_pressure: "Freedom vs. belonging; expressing individuality while linking to the group mind."
    },
    6: {
        name: "The Workshop", // Renamed from Field
        ancestral: "Bad Fortune (Kake Tyche)",
        role: "Health & Service",
        definition: "Zone of maintenance, friction, and high-velocity output.",
        load_function: "System Grind. Pressure on the body’s systems.",
        plain_definition: "Work and care arise from empathy and intuition more than order. This area is sensitive to atmosphere—routine must feel meaningful.",
        symbolic_definition: "The workshop hums underwater—service through surrender.",
        core_pressure: "Balancing compassion with containment; giving without dissolving."
    },
    7: {
        name: "The Mirror",
        ancestral: "The Setting Place (Dysis)",
        role: "Partnerships & Reflection",
        definition: "Where the self disappears into reflection. Port for locking into a secondary engine.",
        load_function: "Misalignment. Pressure coming from 'the other'.",
        plain_definition: "Relationships prioritize courage and expose vulnerability. Connection awakens both assertiveness and old wounds.",
        symbolic_definition: "The mirror cracks and mends by heat—contact as combustion.",
        core_pressure: "Assertion vs. empathy; healing through confrontation."
    },
    8: {
        name: "The Depths", // Renamed from Core
        ancestral: "The Idle Place (Epikatōphlion)",
        role: "Transformation & Power",
        definition: "The difficult zone of debt, inheritance, and limits.",
        load_function: "Compression. Deep psychological pressure.",
        plain_definition: "Emotional security is physical, sensory, and steady. Change feels threatening but can root deeper stability.",
        symbolic_definition: "The depths are fertile earth—feeling solidifies into form.",
        core_pressure: "Holding ground vs. letting go; embodiment as resilience."
    },
    9: {
        name: "The Ascent", // Renamed from Horizon
        ancestral: "The God (Theos)",
        role: "Philosophy & Expansion",
        definition: "The wide open sky of Meaning and Long-Range Navigation.",
        load_function: "Perspective Shift. Pressure on worldviews.",
        plain_definition: "Belief systems are flexible, curious, non-dogmatic. You seek truth through dialogue.",
        symbolic_definition: "The ascent climbs by questions, not creeds.",
        core_pressure: "Meaning through motion; faith in the multiplicity of ideas."
    },
    10: {
        name: "The Pinnacle", // Renamed from Canopy
        ancestral: "Midheaven (Mesouranima)",
        role: "Purpose & Ambition",
        definition: "The visible summit suited for public scrutiny.",
        load_function: "Visibility Load. Pressure to perform or lead.",
        plain_definition: "Purpose is built through disciplined communication and structured thought. You mature by mastering language and precision.",
        symbolic_definition: "The pinnacle is a tower of words—authority earned through articulation.",
        core_pressure: "Responsibility in expression; learning to lead with clarity rather than control."
    },
    11: {
        name: "The Network", // Renamed from Grove
        ancestral: "Good Spirit (Agathos Daimon)",
        role: "Community & Vision",
        definition: "Structural support provided by the wider network/weave.",
        load_function: "Static. Pressure from networks and alliances.",
        plain_definition: "You animate communities by creative presence and personal warmth. Vision radiates through authenticity.",
        symbolic_definition: "The network orbits a sun—leadership by light, not decree.",
        core_pressure: "Visibility vs. humility; shining without burning others."
    },
    12: {
        name: "The Mystery", // Renamed from Shell
        ancestral: "Bad Spirit (Kakos Daimon)",
        role: "Transcendence & Release",
        definition: "Where the system goes offline for updates or sleep.",
        load_function: "Ghost Load. Pressure from the unconscious.",
        plain_definition: "Transcendence comes through love that affirms selfhood—spirituality through affection and artistry.",
        symbolic_definition: "The mystery is devotion made visible—beauty as offering.",
        core_pressure: "Union through self-expression; surrender without self-erasure."
    }
} as const;

export type HouseId = keyof typeof WOVEN_HOUSE_CANON;

export const WOVEN_CHAMBERS: Record<number, string> = Object.fromEntries(
    Object.entries(WOVEN_HOUSE_CANON).map(([id, data]) => [Number(id), data.name])
);

export const getHouseName = (id: number): string => {
    return WOVEN_HOUSE_CANON[id as HouseId]?.name || "Chamber";
};

export const getHouseRole = (id: number): string => {
    return WOVEN_HOUSE_CANON[id as HouseId]?.role || "Unknown Role";
};

export const getHouseDefinition = (id: number): string => {
    return WOVEN_HOUSE_CANON[id as HouseId]?.definition || "";
};
