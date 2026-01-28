# Symbolic Atmosphere Taxonomy

**Purpose**: Canonical reference for Climate (slow planets) vs Weather (fast planets) classification in the Woven Map system.

**Architecture Principle**: Symbolic language must never be interwoven with Blueprint prose.

---

## Core Definitions

### Climate
- **Definition**: Slow-planet structural currents that describe long-term archetypal patterns
- **Duration**: Years to decades per sign/house
- **Planets**: Jupiter, Saturn, Uranus, Neptune, Pluto
- **Allowed In**: Both Mirror Flow AND Balance Meter (optional in both)
- **Integration**: Must render as separate section with explicit header

### Weather  
- **Definition**: Fast-planet transits that describe time-bound operating conditions
- **Duration**: Hours to months
- **Planets**: Sun, Moon, Mercury, Venus, Mars
- **Allowed In**: Balance Meter ONLY (forbidden in Mirror Flow)
- **Integration**: Must render as separate section, requires sampling window

---

## Planet Classification

### Climate Planets (Slow / Structural)

| Planet | Orbital Period | Symbolic Domain | Example Phrase |
|--------|---------------|-----------------|----------------|
| **Jupiter** | ~12 years | Expansion, philosophy, growth | "Philosophical expansion through {domain}" |
| **Saturn** | ~29 years | Structure, limits, mastery | "Structural compression in {domain}" |
| **Uranus** | ~84 years | Innovation, disruption, breakthrough | "Disruptive innovation targeting {domain}" |
| **Neptune** | ~165 years | Dissolution, vision, permeability | "Boundary dissolution in {domain}" |
| **Pluto** | ~248 years | Transformation, power, regeneration | "Power transformation anchored in {domain}" |

### Weather Planets (Fast / Transiting)

| Planet | Orbital Period | Symbolic Domain | Example Phrase |
|--------|---------------|-----------------|----------------|
| **Sun** | 1 year | Visibility, vitality, purpose | "Visibility surge in {domain}" |
| **Moon** | ~28 days | Emotional rhythm, needs, recharge | "Emotional tide shifting through {domain}" |
| **Mercury** | ~88 days | Communication, processing, data | "Information flow accelerating in {domain}" |
| **Venus** | ~225 days | Attraction, values, aesthetics | "Relational magnetism active in {domain}" |
| **Mars** | ~2 years | Action, drive, ignition | "Kinetic activation in {domain}" |

---

## Integration Policy: `separate_sections`

### Blueprint Section (Always First)

```markdown
## 🏗️ Constitutional Blueprint

**Pure geometry and capacity language. No symbolic metaphors.**

- Sun Leo (H9): Core purpose channels through horizon expansion
- Moon Taurus (H7): Emotional engine requires tangible stability in mirrored partnerships
- Ascendant Scorpio: Interface operates via permeability + intensity filters

*This describes what the system IS BUILT TO DO, not what it IS DOING now.*
```

### Separator (Required)

```markdown
---

## 🌍 Symbolic Atmosphere

> **Note**: The following section uses symbolic language to describe archetypal currents and transiting conditions. It is independent of the Blueprint above and never interwoven with capacity descriptions.
```

### Climate Section (Optional)

```markdown
### Climate Currents (Slow Planets)

**Jupiter in Gemini (H8)**
Philosophical expansion through binding depths and shared resources. The hunger for meaning seeks expression through merger and exchange.

**Saturn in Gemini (H8)**
Structural limits test communication in intimate exchange. The demand for precision confronts the complexity of shared language.
```

### Weather Section (Balance Meter Only)

```markdown
### Weather Patterns (Fast Planets - Time-Bound)

**2025-12-15**

**Sun ☌ Mercury (2° orb)**: Visibility and processing align. Mental clarity peaks; communication flows with solar authority.

**Moon ☍ Saturn (1° orb)**: Emotional needs encounter structural limits. The requirement for safety conflicts with external containment.
```

---

## Validation Rules

### Mirror Flow
```json
{
  "report_kind": "Mirror Flow",
  "symbolic_atmosphere": {
    "enabled": true,
    "include_climate": true,     // ✅ Allowed
    "include_weather": false,    // ❌ Forbidden
    "integration_policy": "separate_sections"
  }
}
```

### Balance Meter
```json
{
  "report_kind": "Balance Meter",
  "symbolic_atmosphere": {
    "enabled": true,
    "include_climate": true,     // ✅ Optional
    "include_weather": true,     // ✅ Allowed (requires sampling window)
    "integration_policy": "separate_sections"
  }
}
```

---

## Language Guidelines

### Blueprint Language (Engineering Grammar)

**Allowed**:
- "System requires X to function"
- "When Y is absent, system experiences Z"
- "Chamber operates via {mechanism}"
- "Engine ignites through {channel}"
- "Threshold exceeded triggers withdrawal"

**Forbidden**:
- "You are feeling..."
- "Currently experiencing..."
- "You tend to..."
- State claims without verified load data

### Climate Language (Symbolic - Structural)

**Allowed**:
- "Philosophical expansion through..."
- "Structural compression in..."  
- "Disruptive innovation targeting..."
- "Power transformation anchored in..."

**Forbidden**:
- Predictions ("will become...")
- Urgency framing ("must do now...")
- Behavioral prescriptions ("should...")

### Weather Language (Symbolic - Transiting)

**Allowed** (Balance Meter only):
- "Visibility surge in..."
- "Emotional tide shifting through..."
- "Kinetic activation in..."
- Always conditioned on specific dates/times

**Forbidden**:
- Predictions beyond sampling window
- State claims about permanent capacity
- Blending with Blueprint prose

---

## Backend Implementation

### Taxonomy Constants

```typescript
export const CLIMATE_PLANETS = [
  'Jupiter',
  'Saturn', 
  'Uranus',
  'Neptune',
  'Pluto'
] as const;

export const WEATHER_PLANETS = [
  'Sun',
  'Moon',
  'Mercury',
  'Venus',
  'Mars'
] as const;

export type ClimatePlanet = typeof CLIMATE_PLANETS[number];
export type WeatherPlanet = typeof WEATHER_PLANETS[number];

export function isClimatePlanet(planet: string): boolean {
  return CLIMATE_PLANETS.includes(planet as ClimatePlanet);
}

export function isWeatherPlanet(planet: string): boolean {
  return WEATHER_PLANETS.includes(planet as WeatherPlanet);
}
```

### Integration Policy Validator

```typescript
export function validateAtmosphereIntegration(
  config: SymbolicAtmosphereConfig,
  reportKind: 'Mirror Flow' | 'Balance Meter'
): ValidationResult {
  const errors: string[] = [];

  // Rule 1: Weather forbidden in Mirror Flow
  if (reportKind === 'Mirror Flow' && config.include_weather) {
    errors.push('Weather not allowed in Mirror Flow reports');
  }

  // Rule 2: Integration policy must be separate_sections
  if (config.integration_policy !== 'separate_sections') {
    errors.push('Integration policy must be "separate_sections"');
  }

  // Rule 3: Weather requires sampling window
  if (config.include_weather && !hasSamplingWindow()) {
    errors.push('Weather requires sampling window (range_start, range_end, anchor_time)');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
```

---

## Example: Full Report with Atmosphere

### Blueprint Section

```markdown
# Constitutional Blueprint: Dan Cross

## 🏗️ Core Architecture

**Sun Leo (H9)**: Purpose engine channels through expansion and horizon-seeking.

**Moon Taurus (H7)**: Emotional regulator requires tangible, predictable stability in relational port.

**Mars Aries (H5)**: Ignition system operates via direct, surplus-driven activation.

*No transits. This describes permanent capacity, not current state.*
```

### Atmosphere Section (Separated)

```markdown
---

## 🌍 Symbolic Atmosphere

> **Note**: Symbolic language describing archetypal currents. Independent of Blueprint above.

### Climate Currents

**Saturn in Gemini (H8)**: Structural discipline tests communication in depths. The demand for precision confronts complexity of merger language.

**Neptune in Sagittarius (H2)**: Visionary dissolution affects resource stability. The drive for transcendence encounters material ground.

### Weather Patterns (2025-12-15)

**Sun ☌ Mercury**: Communication authorityclarified. Mental processing aligns with public visibility.

**Mars ☍ Saturn**: Drive meets limit. Activation impulse encounters structural resistance.
```

---

**Status**: Taxonomy Locked.  
**Enforcement**: JSON Schema + Validator + Template Compliance.
