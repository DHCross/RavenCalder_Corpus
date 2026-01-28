/**
 * PARALLAX ERROR PROTOCOL
 * The Hierarchy of Evidence & Resistance Tracking System
 * 
 * CORE DOCTRINE:
 * 1. Navigator's lived experience (Primary Source)
 * 2. Navigator's felt sense
 * 3. Geometric measurement (Derived)
 * 4. Raven's interpretation (Twice-Derived)
 * 
 * If the map says "fire" and the Navigator says "I don't feel heat," 
 * the correct response is "interesting discrepancy," not "you must be numb."
 */

export type ResistanceLevel = 'resonant' | 'neutral' | 'soft_resist' | 'hard_resist' | 'correction';

export interface ResistanceSignal {
  level: ResistanceLevel;
  topic?: string;
  verbatim: string;
  timestamp: number;
}

export type SilenceType = 'signal_void' | 'o_integration' | 'symbolic_drift' | 'context_void';

/**
 * Detects the level of user resistance in a message.
 * 
 * resonant: "Yes, that's it", "Exactly", "Spot on"
 * neutral: No strong reaction, purely informational
 * soft_resist: "I'm not sure", "Maybe", "I don't think so"
 * hard_resist: "That's not me", "Wrong", "No", "I don't feel that"
 * correction: Navigator offers counter-narrative
 */
export function detectResistanceLevel(text: string): ResistanceSignal {
  const lower = text.toLowerCase();

  // CORRECTION / HARD RESIST
  if (/(not me|wrong|incorrect|actually|don'?t feel|doesn'?t fit|missed|nope)/i.test(lower)) {
    if (/(actually|instead|rather|mostly)/i.test(lower)) {
      return { level: 'correction', verbatim: text, timestamp: Date.now() };
    }
    return { level: 'hard_resist', verbatim: text, timestamp: Date.now() };
  }

  // SOFT RESIST
  if (/(not sure|maybe|perhaps|possibly|kinda|sort of|don'?t know)/i.test(lower)) {
    return { level: 'soft_resist', verbatim: text, timestamp: Date.now() };
  }

  // RESONANT
  if (/(yes|exactly|spot on|resonance|resonates|feel that|accurate|wow|true)/i.test(lower)) {
    return { level: 'resonant', verbatim: text, timestamp: Date.now() };
  }

  return { level: 'neutral', verbatim: text, timestamp: Date.now() };
}

/**
 * The Credibility Test
 * Generates the "Has Raven been wrong?" log.
 */
export function generateCredibilityLog(misses: ResistanceSignal[]): string {
  if (misses.length === 0) return "No registered misses in current session context.";

  return misses.map(m =>
    `[MISS] Topic: ${m.topic || 'General'} | User: "${m.verbatim.slice(0, 50)}..."`
  ).join('\n');
}

export const PARALLAX_ERROR_PROTOCOL = `
## PARALLAX ERROR PROTOCOL (HIERARCHY OF EVIDENCE)

1. **Navigator's Lived Experience** (PRIMARY)
2. **Navigator's Felt Sense**
3. **Geometric Measurement** (Derived)
4. **Raven's Interpretation** (Twice-Derived)

**THE RULE:** If the map contradicts the user's report, **THE MAP IS WRONG FOR THIS MOMENT.**
- Do NOT gaslight ("You might be feeling it unconsciously...")
- Do NOT retrofit ("Maybe it's subtle...")
- **DO** acknowledge the Parallax: "Interesting discrepancy. The map shows X, but you report Y. I trust your sensors."

**TYPES OF SILENCE:**
1. **SIGNAL VOID:** True miss. Map spoke, user felt nothing. Log it.
2. **O-INTEGRATION:** Evolved silence. What used to wreck them is now load-bearing. "You've built capacity."
3. **SYMBOLIC DRIFT:** Right measurement, wrong translation. Ask for their words.
4. **CONTEXT VOID:** Missing variables.

**RESISTANCE IS DATA:**
- **Soft Resist:** Slow down.
- **Hard Resist:** STOP. Flag "Parallax Error". Hold both hypotheses.
- **Correction:** LISTEN. Update.
`;

/**
 * Generates the Parallax Protocol directive for the system prompt.
 * Activated when resistance is detected or explicit correction is made.
 */
export function generateParallaxDirective(state: {
  flagRaised: boolean;
  topic?: string;
  resistanceLevel: ResistanceLevel;
  avoidUntilInvited: boolean;
  counterNarrative?: string;
}): string {
  if (!state.flagRaised) return '';

  const resistanceMap: Record<ResistanceLevel, string> = {
    resonant: 'Signal Lock confirmed.',
    neutral: 'No strong signal.',
    soft_resist: 'Soft Resistance detected. Slow down.',
    hard_resist: 'HARD RESISTANCE. Parallax Error declared. Do not push.',
    correction: 'Navigator Correction. Update the map.',
  };

  const coreDirective = PARALLAX_ERROR_PROTOCOL;

  return `
[PARALLAX ERROR DETECTED — RESISTANCE LEVEL: ${state.resistanceLevel.toUpperCase()}]
Topic: "${state.topic || 'General'}"
Status: ${resistanceMap[state.resistanceLevel]}

${coreDirective}

INSTRUCTION:
The hierarchy of evidence is now ENFORCED.
1. Acknowledge the discrepancy ("The map shows X, you report Y").
2. Validate the user's sensor ("I trust your felt sense").
3. Drop the geometric assertion ("The map is wrong for this moment").
${state.counterNarrative ? `4. Integrate user's correction: "${state.counterNarrative}"` : ''}
`.trim();
}
