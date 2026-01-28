/**
 * MOOD CAPTURE & SEMANTIC RESONANCE PROTOCOL
 * System Version: 1.3 (Relational Awareness / Attribution Logic)
 * Component: Subjective Data Layer / Retrodiction Feeder
 * 
 * This protocol defines the logic for "Attributed Listening" - distinguishing between
 * the Observer (Self) and the Observed (Other) in semantic parsing.
 * 
 * Core Doctrine: "We do not confuse the weather with the observer. We distinguish 
 * between the storm inside the house and the storm knocking at the door."
 */

export const MOOD_CAPTURE_PROTOCOL = `
# MOOD CAPTURE & SEMANTIC RESONANCE INTEGRATION

**System Version:** 1.3
**Component:** Subjective Data Layer
**Status:** Architecture Ready

## 1.0 Purpose and Philosophy

**The Problem:** Retrodiction fails if it cannot distinguish between the **Observer** and the **Observed**. Logging "Anger" under the user's profile when they report "My partner is angry" corrupts the data.

**The Solution:** The **Mood Capture Protocol** operates as an "Attributed Listener." It parses semantic load and assigns it to the correct geometric entity (Subject A vs. Subject B).

**Core Doctrine:** "We do not confuse the weather with the observer. We distinguish between the storm inside the house and the storm knocking at the door."

## 2.0 The Capture Mechanism (Attribution Logic)

The system parses for **Target** as well as **Intensity**.

### 2.1 Passive Capture (The Semantic Listener)
**Trigger:** User describes a state (> 10 words).
**Process:** LLM parses *Affective Load* + *Attribution Target*.

* **Example 1 (Self):**
  * *User:* "I'm absolutely drained. I just shut down."
  * *Log:* Target: **SELF**, Label: **EXHAUSTED**.
* **Example 2 (Other):**
  * *User:* "He's been flying off the handle all day. Just super intense and critical."
  * *Log:* Target: **OTHER (He)**, Label: **INTENSE/STRESSED**.
* **Example 3 (Field/Joint):**
  * *User:* "We just keep missing each other. It feels like we're speaking different languages."
  * *Log:* Target: **FIELD**, Label: **OFF/FRICTION**.

### 2.2 Active Capture (Contextual & UI)
**Voice Protocol:** "That sounds heavy—is that pressure coming from *your* interior, or is it the *environment* pressing on you?"

## 3.0 The Data Schema (Relational)

The schema splits experience into \`self\` and \`observed_other\`. Note that \`observed_other\` is strictly labeled as a **report**, not an objective fact.

\`\`\`json
{
  "timestamp": "ISO_8601_DATE_TIME",
  "session_id": "UUID",
  "data_source": "PASSIVE_SEMANTIC",
  
  // 1. The User's Internal State
  "lived_experience_self": {
    "intensity_score": 2.0,
    "intensity_label": "NOTICEABLE",
    "valence_score": -2.0,
    "valence_label": "LOW",
    "dominant_affect": ["anxious", "reactive"]
  },

  // 2. The User's Perception of the Other (or External Force)
  "observed_experience_other": {
    "target_identifier": "Partner",
    "intensity_score": 5.0,
    "intensity_label": "OVERWHELMING",
    "valence_score": -4.0,
    "valence_label": "EXHAUSTED",
    "verbatim_snippet": "He is just completely walling me off."
  },

  "symbolic_context": {
    "active_aspects": ["Mars_Square_Pluto"],
    "report_mode": "SOLO" | "RELATIONAL"
  }
}
\`\`\`

## 4.0 The Parsing Logic (LLM Context)

**Attribution Rules:**
* If "I feel," "I am," "My energy" → **SELF**.
* If "He/She is," "They are," "The boss is" → **OTHER**.
* If "It is," "The vibe is," "We are" → **FIELD**.

## 5.0 Retrodiction Integration (The Payoff)

This enables Raven to identify **Relational Resonance Patterns**.

**The Retrodiction Query:**
Raven looks for historical dates where:
1. **Active Aspects** match.
2. **Attribution** aligns (e.g., "When Mars is active, does the *User* get angry, or does the *Partner* get angry?").

**The Narrative Output:**
"The geometry suggests this is your fuel, but you historically report it coming from the outside. This often means you are **projecting** or **suppressing** the Mars function, letting the partner act it out for you. Let's watch who holds the sword this week."
`;
