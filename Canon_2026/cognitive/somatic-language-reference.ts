/**
 * Somatic Language Reference
 * 
 * Provides approved language anchors for Mirror Report generation.
 * These terms ground abstract astrological concepts in embodied experience.
 * 
 * Usage: Inject into Oracle system prompt for Mirror reports to ensure
 * consistent somatic vocabulary and prevent stylistic drift.
 */

export const SOMATIC_LANGUAGE_REFERENCE = {
    pressure: ['compression', 'weight', 'density', 'gravity', 'containment', 'squeeze', 'load'],
    release: ['expansion', 'opening', 'lightening', 'flow', 'dispersion', 'exhale', 'vent'],
    ignition: ['spark', 'heat', 'activation', 'acceleration', 'charge', 'fire', 'impulse'],
    rhythm: ['oscillation', 'pulse', 'cycle', 'wave', 'alternation', 'tempo', 'cadence'],
    structure: ['frame', 'architecture', 'scaffold', 'container', 'boundary', 'hull', 'chassis'],
    motion: ['momentum', 'velocity', 'direction', 'trajectory', 'current', 'drift', 'pull'],
    stability: ['anchor', 'ground', 'root', 'ballast', 'steadiness', 'hold', 'rest'],
    tension: ['friction', 'resistance', 'strain', 'tautness', 'opposition', 'collision', 'rub']
};

/**
 * Conditional phrasing templates for Mirror Reports.
 * These ensure non-deterministic, observational language.
 */
export const CONDITIONAL_PHRASES = [
    'tends toward',
    'often reflects',
    'may express through',
    'typically manifests as',
    'frequently shows up as',
    'can present as',
    'generally moves toward',
    'habitually returns to'
];

/**
 * Prohibited phrases that violate Mirror Report doctrine.
 * These should never appear in qualitative reports.
 */
export const PROHIBITED_PHRASES = [
    'you should',
    'you must',
    'you need to',
    'you will',
    'this means',
    'the lesson is',
    'your destiny',
    'good/bad',
    'right/wrong',
    'does this resonate',
    'how does this feel',
    '[Resonance: yes]',
    '[Resonance: no]'
];

/**
 * Returns the somatic language reference as a formatted string for prompt injection.
 * Includes both vocabulary and usage guidelines.
 */
export function getSomaticLanguagePrompt(): string {
    const vocabularySection = Object.entries(SOMATIC_LANGUAGE_REFERENCE)
        .map(([category, terms]) => `- **${category}**: ${terms.join(', ')}`)
        .join('\n');

    const conditionalSection = CONDITIONAL_PHRASES
        .map(phrase => `- "${phrase}"`)
        .join('\n');

    const prohibitedSection = PROHIBITED_PHRASES
        .map(phrase => `- "${phrase}"`)
        .join('\n');

    return `
## SOMATIC LANGUAGE REFERENCE

Use these embodied anchors to ground abstract concepts in felt experience:

${vocabularySection}

## CONDITIONAL PHRASING (Required)

Mirror Reports must use non-deterministic language. Use phrases like:

${conditionalSection}

## PROHIBITED PHRASES (Hard Constraints)

The following phrases violate Mirror Report doctrine and must never appear:

${prohibitedSection}

## TONE DIRECTIVE

Language should land somatically — describing weight, ignition, pressure, release.
End in composure, not conversation. Mirror complete.
`;
}

/**
 * Validates that report content uses appropriate somatic language
 * and avoids prohibited phrases.
 * 
 * @param content The report content to validate
 * @returns Validation result with any violations found
 */
export function validateSomaticLanguage(content: string): {
    valid: boolean;
    prohibitedFound: string[];
    somaticTermsUsed: number;
} {
    const lowerContent = content.toLowerCase();
    
    // Check for prohibited phrases
    const prohibitedFound = PROHIBITED_PHRASES.filter(phrase => 
        lowerContent.includes(phrase.toLowerCase())
    );
    
    // Count somatic terms used
    let somaticTermsUsed = 0;
    Object.values(SOMATIC_LANGUAGE_REFERENCE).forEach(terms => {
        terms.forEach(term => {
            if (lowerContent.includes(term.toLowerCase())) {
                somaticTermsUsed++;
            }
        });
    });
    
    return {
        valid: prohibitedFound.length === 0,
        prohibitedFound,
        somaticTermsUsed
    };
}
