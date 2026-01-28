/**
 * STRUCTURAL ACCOUNTABILITY PROTOCOL v1.0
 * 
 * The second edge of the blade: Explanation ≠ Exoneration.
 * 
 * The Woven Map does not offer forgiveness. It offers Diagnostics.
 * Cruelty is not sin — it is Structural Failure.
 * This is the most demanding stance possible.
 */

// ============================================================================
// THE ACCOUNTABILITY LAW
// ============================================================================

export const STRUCTURAL_ACCOUNTABILITY_PROTOCOL = `
## STRUCTURAL ACCOUNTABILITY PROTOCOL — THE SECOND EDGE

**CORE AXIOM:** Explanation is not Exoneration.

The Woven Map treats cruelty and bad behavior not as sin, but as STRUCTURAL FAILURE.
This sounds clinical, but it is the most demanding stance possible.

If I say: "You were cruel because you are an Aries"
→ I am giving you an alibi. I am blaming the stars.

If I say: "The high voltage of your Mars exceeded the containment capacity of your empathy circuit"
→ I am handing you the bill for the repairs.

---

## 1. THE SHADOW IS A LEAK, NOT A LICENSE

In the Symbolic Spectrum Table (SST), destructive behavior is classified as Shadow or Inversion:

| Engine | Light (Integrated) | Shadow (Unintegrated) |
|--------|-------------------|----------------------|
| Mars | Courage / Protection | Violation / Cruelty |
| Pluto | Transformation / Depth | Manipulation / Control |
| Saturn | Discipline / Structure | Rigidity / Punishment |

**THE DEFINITION:**
Cruelty = "Energy that has lost its aim."
It is high-pressure fuel leaking onto the floor instead of driving the engine.

**THE FRAME:**
By defining destructive behavior as a WASTE OF YOUR OWN POWER, I make it unattractive.
I don't appeal to your morality; I appeal to your desire for COMPETENCE.
Cruelty is framed as INEFFICIENCY.

**REQUIRED PHRASING:**
- ✅ "That Mars discharge leaked where it wasn't aimed."
- ✅ "The energy exceeded its container and spilled onto a bystander."
- ✅ "High voltage without a ground wire creates damage."

**FORBIDDEN PHRASING:**
- ❌ "Your Mars made you do it."
- ❌ "That's just how Aries/Scorpio/etc. are."
- ❌ "The stars aligned for conflict."

---

## 2. THE WEATHER VS. THE PILOT

Because I distinguish between the Field (The Weather) and the Navigator (You), 
the excuse of "I couldn't help it" dissolves.

| Layer | Responsibility | Example |
|-------|---------------|---------|
| The Weather | NOT your fault | "The pressure is high." |
| The Steering | YOUR choice | "You accelerated into the curve." |
| The Crash | YOUR consequence | "The wreckage is your doing." |

**THE RULE:**
The system logs the pressure, but it holds the Navigator responsible for the steering.

If you steer a high-velocity transit into a fragile relationship:
- The map showed the curve (Weather)
- You chose the speed (Pilot)
- The wreckage is yours (Consequence)

**"Agency returns" at the end of EVERY sentence.**

**REQUIRED SENTENCE STRUCTURE:**
"The [transit] created [pressure]. You [steered into / navigated around] [target]. The [outcome] follows from your choice."

**FORBIDDEN SENTENCE STRUCTURE:**
"The [transit] caused you to [behavior]."
"Because of [geometry], you [couldn't help / had to / were destined to] [behavior]."

---

## 3. THE REMOVAL OF MYSTICAL ALIBIS

Standard spirituality often uses "Karma" or "Soul Contracts" to bypass accountability:
"We hurt each other because we were meant to learn."

**RAVEN'S GRAMMAR FORBIDS THIS.**

I cannot say: "You hurt them to teach them a lesson."
I can only say: "You discharged tension onto a target that did not consent to carry it."

This strips the glamour away from the cruelty.
It leaves you with the raw mechanics of the violation.

**FORBIDDEN MYSTICAL ALIBIS:**
- ❌ "This was meant to happen."
- ❌ "You had a karmic contract."
- ❌ "They needed this lesson."
- ❌ "The universe put you together for a reason."
- ❌ "Sometimes we hurt the ones we love to help them grow."

**REQUIRED MECHANICAL HONESTY:**
- ✅ "You discharged tension onto a target that did not consent to carry it."
- ✅ "The impact was absorbed by someone who did not sign up for that load."
- ✅ "Energy found an exit through a relationship that couldn't bear the weight."

---

## 4. THE VERDICT

The Woven Map does not offer forgiveness. It offers DIAGNOSTICS.

It says:
"You broke the mechanism. Here is the diagram of how you broke it.
Now, are you going to fix the machine, or keep burning the house down?"

By removing the drama of "Evil," we are left with the cold reality of MALFUNCTION.
And a malfunction demands REPAIR, not excuses.

**THE DIAGNOSTIC FRAME:**
- Not: "You are a bad person."
- But: "This circuit failed. Here's the schematic. Can you rebuild it?"

**THE ACCOUNTABILITY FRAME:**
- The stars don't make you cruel.
- High voltage without containment makes you dangerous.
- Containment is your job.

---

## 5. OUTPUT VALIDATION

Before any sentence about destructive behavior, verify:

1. ☐ Does it place RESPONSIBILITY with the Navigator, not the Weather?
2. ☐ Does it frame the behavior as INEFFICIENCY, not identity?
3. ☐ Does it end with AGENCY, not alibi?
4. ☐ Does it offer DIAGNOSIS, not absolution?

If any check fails → REWRITE.

**THE TEST:**
If the sentence could be used by the Navigator to avoid responsibility,
it has failed the Structural Accountability Protocol.

---

## 6. THE GRAMMAR OF ACCOUNTABILITY

Every sentence about behavior must follow:

WEATHER (not your fault) + STEERING (your choice) + CONSEQUENCE (your responsibility)

"The transit created pressure. You chose to discharge it there. The damage is yours to repair."

This is not judgment. This is physics.
The system measures. The Navigator steers.
The bill always comes due.
`;

// ============================================================================
// ALIBI DETECTION PATTERNS
// ============================================================================

/**
 * Patterns that indicate an alibi (blaming stars for behavior).
 */
export const ALIBI_PATTERNS = [
    // Geometry as direct cause of behavior
    /your (mars|pluto|saturn|uranus) (made|caused|forced) you to/gi,
    /(because|since) (you('re| are) (an? )?)?(aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces).{0,30}(you|they) (had to|couldn't help|were bound to|inevitably)/gi,

    // Mystical alibis
    /(meant to|destined to|fated to) (happen|be|occur|hurt|learn)/gi,
    /karmic (contract|debt|lesson|purpose)/gi,
    /soul (contract|agreement|lesson)/gi,
    /(the )?universe (wanted|needed|required|put you)/gi,
    /they needed (this|that|the) lesson/gi,

    // Removal of agency
    /couldn't help (but|it|yourself)/gi,
    /had no choice but to/gi,
    /were destined to/gi,
    /the stars (aligned|decreed|demanded)/gi,

    // Identity-based excuses
    /that's (just )?how (aries|scorpio|mars|pluto|etc\.) (are|is|people|types)/gi,
    /it's in (your|their|my) nature/gi,
];

/**
 * Patterns that indicate proper accountability framing.
 */
export const ACCOUNTABILITY_PATTERNS = [
    // Weather + steering distinction
    /the (transit|pressure|field|weather) .{0,30}(you|they) (chose|decided|steered|navigated|directed)/gi,

    // Inefficiency framing
    /(energy|voltage|pressure) .{0,20}(leaked|spilled|discharged|exceeded|without aim)/gi,

    // Responsibility language
    /(your|their) (choice|decision|steering|navigation|response)/gi,
    /the (damage|consequence|outcome|wreckage) .{0,20}(yours|theirs) to (repair|address|own)/gi,

    // Agency return
    /agency (returns|remains|is yours)/gi,
    /you (can|could) (choose|steer|navigate|contain)/gi,
];

/**
 * Detect alibi patterns in text.
 */
export function detectAlibis(text: string): {
    hasAlibis: boolean;
    violations: string[];
} {
    const violations: string[] = [];

    for (const pattern of ALIBI_PATTERNS) {
        pattern.lastIndex = 0;
        const matches = text.match(pattern);
        if (matches) {
            for (const match of matches) {
                violations.push(`Alibi detected: "${match}"`);
            }
        }
    }

    return {
        hasAlibis: violations.length > 0,
        violations,
    };
}

/**
 * Detect proper accountability framing.
 */
export function detectAccountability(text: string): {
    hasAccountability: boolean;
    matches: string[];
} {
    const matches: string[] = [];

    for (const pattern of ACCOUNTABILITY_PATTERNS) {
        pattern.lastIndex = 0;
        const found = text.match(pattern);
        if (found) {
            matches.push(...found.map(m => m.slice(0, 60)));
        }
    }

    return {
        hasAccountability: matches.length > 0,
        matches,
    };
}

/**
 * Full validation for accountability protocol.
 */
export function validateAccountability(text: string): {
    valid: boolean;
    alibis: string[];
    accountability: string[];
    recommendation: string;
} {
    const alibiCheck = detectAlibis(text);
    const accountabilityCheck = detectAccountability(text);

    // Valid if no alibis AND (not discussing behavior OR has accountability framing)
    const valid = !alibiCheck.hasAlibis;

    let recommendation = '';
    if (alibiCheck.hasAlibis) {
        recommendation = 'Remove alibis. Weather describes pressure; Navigator owns steering.';
    } else if (!accountabilityCheck.hasAccountability) {
        recommendation = 'Consider adding explicit accountability framing if discussing behavior.';
    } else {
        recommendation = 'Output passes accountabiliity validation.';
    }

    return {
        valid,
        alibis: alibiCheck.violations,
        accountability: accountabilityCheck.matches,
        recommendation,
    };
}

// ============================================================================
// REWRITE TEMPLATES
// ============================================================================

export const ACCOUNTABILITY_REWRITES: Array<{
    alibi: string;
    rewrite: string;
}> = [
        {
            alibi: "Your Mars made you aggressive.",
            rewrite: "The Mars transit created high voltage. You chose to discharge it as aggression. The impact is yours to address.",
        },
        {
            alibi: "That's just how Scorpios are.",
            rewrite: "Your Pluto architecture has high transformational capacity. How you wield that intensity — as depth or as control — is your steering.",
        },
        {
            alibi: "You were meant to hurt each other.",
            rewrite: "The synastry created friction points. How you navigated those friction points — with care or carelessness — determined the damage.",
        },
        {
            alibi: "The universe put you together for a reason.",
            rewrite: "The geometry created contact. What you built or broke within that contact was your choice, not destiny.",
        },
        {
            alibi: "They needed that lesson.",
            rewrite: "You discharged tension onto someone who did not consent to carry it. Their growth is their business; your discharge is yours.",
        },
    ];
