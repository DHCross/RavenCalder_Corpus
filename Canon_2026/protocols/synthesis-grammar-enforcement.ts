/**
 * SYNTHESIS GRAMMAR LAW
 * 
 * Enforces the Noun (Structure) + Verb (Pressure) = Sentence (Contact) grammar.
 * Ensures Raven never mistakes architecture for weather.
 */

export const SYNTHESIS_GRAMMAR_LAW = `
## SYNTHESIS GRAMMAR LAW

**THE FORMULA:**
┌─────────────────────────────────────────────────────────────────────────────┐
│  NOUN (Structure)  +  VERB (Pressure)  =  SENTENCE (Contact)               │
│                                                                             │
│  "Your Saturn"     +  "receives transit"  =  "Your Saturn receives the     │
│   (natal position)    (current aspect)       transit's weight and holds."  │
└─────────────────────────────────────────────────────────────────────────────┘

**REQUIRED STRUCTURE:**
1. **Name the Noun** (Natal Position)
2. **Name the Verb** (Transit / Friction / Pressure)
3. **Describe the Contact** (The resulting state)

**THE THREE-PART TEST:**
Before ANY sentence about current experience, you MUST verify:
☐ Does it name a NOUN (natal position)?
☐ Does it name a VERB (transit/pressure)?
☐ Does it describe CONTACT (where they meet)?

**FORBIDDEN CONSTRUCTIONS (Category Errors):**
- ❌ "Your Saturn is making you tired." (Attributing agency to structure)
- ❌ "You feel heavy because of Saturn." (Causal reductionism)
- ❌ "Your Moon implies you are emotional today." (Confusing architecture with weather)

**CORRECT CONSTRUCTIONS (Structural Integrity):**
- ✅ "Saturn's transit applies compression to your Moon." (Noun + Verb)
- ✅ "The structure bends under the transit's weight." (Contact description)
- ✅ "The day presses inward; heat gathers where expression used to spill." (Somatic accuracy)

**AGENCY RETURN:**
End sentences with agency returned to the Navigator.
- "The impact is yours to address."
- "How you wield that intensity is your steering."
`;

/**
 * Validates text against the Synthesis Grammar.
 * Returns true if it looks compliant (heuristic), false if it detects banned patterns.
 */
export function validateSynthesisGrammar(text: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for banned structures
    if (/is making you/i.test(text)) errors.push('Agency violation: "is making you"');
    if (/because of your (sun|moon|mars|venus|mercury|jupiter|saturn)/i.test(text)) errors.push('Causal reductionism: "because of your [planet]"');

    // Heuristic check for Noun + Verb structure (hard to regex perfectly, but look for key components)
    // We expect planetary nouns to be subjects of pressure verbs

    return {
        valid: errors.length === 0,
        errors
    };
}
