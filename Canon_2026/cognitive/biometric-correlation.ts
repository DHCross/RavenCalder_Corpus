/**
 * BIOMETRIC CORRELATION ENGINE
 * 
 * Parses Apple Health exports (AutoExport format) and correlates them
 * with Symbolic Moment data to calculate the Uncanny Score.
 * 
 * "This is how symbolic load converts to biological signal —
 *  not prediction, but coherence made visible."
 * 
 * Supported inputs:
 * - AutoExport iOS app JSON exports
 * - Pasted health data in chat (simplified format)
 */

import { SymbolicMomentDashboard, DaySnapshot } from './symbolic-moment-schema';
import { calculateUncannyScore } from './symbolic-moment-doctrine';

// ============================================================================
// TYPES
// ============================================================================

/**
 * AutoExport JSON format (iOS app).
 */
export interface AutoExportData {
    data: {
        metrics: AutoExportMetric[];
        stateOfMind?: AppleStateOfMind[];
    };
}

/**
 * Apple State of Mind entry (from iOS Health app).
 */
export interface AppleStateOfMind {
    kind: 'daily_mood' | 'momentary_emotion';
    valence: number;                    // -1 to +1
    valenceClassification:
    | 'very_unpleasant'
    | 'unpleasant'
    | 'slightly_unpleasant'
    | 'neutral'
    | 'slightly_pleasant'
    | 'pleasant'
    | 'very_pleasant';
    labels: string[];                   // e.g., ["stressed", "worried", "drained"]
    associations: string[];             // e.g., ["work", "family", "health"]
    start: string;                      // ISO timestamp
    end: string;
    id: string;
}

export interface AutoExportMetric {
    name: string;
    units: string;
    data: AutoExportDataPoint[];
}

export interface AutoExportDataPoint {
    date: string;
    qty?: number;
    source?: string;
    // Heart rate has special fields
    Avg?: number;
    Min?: number;
    Max?: number;
}

/**
 * Normalized biometric data by date.
 */
export interface DailyBiometrics {
    date: string;
    heartRate?: { avg: number; min: number; max: number };
    hrv?: number;                    // Heart Rate Variability (ms)
    activeEnergy?: number;           // kcal
    mindfulMinutes?: number;
    bloodOxygen?: number;            // SpO2 %
    physicalEffort?: number;         // kcal/hr·kg
    sleepTemperature?: number;       // °F
    breathingDisturbances?: number;
    standHours?: number;
    exerciseMinutes?: number;

    // Apple State of Mind (self-reported)
    stateOfMind?: {
        valence: number;             // -1 to +1 (maps to our -5 to +5)
        valenceClassification: string;
        labels: string[];            // e.g., ["stressed", "worried"]
        associations: string[];      // e.g., ["work", "family"]
    };
}

/**
 * Correlation result for a single day.
 */
export interface DayCorrelation {
    date: string;

    // Symbolic metrics
    symbolic: {
        magnitude: number;
        directionalBias: number;
        volatility: number;
        phase: string;
    };

    // Biometric metrics
    biometric: DailyBiometrics;

    // Correlation signals
    signals: CorrelationSignal[];

    // Uncanny Score component
    uncannyComponent: number;
}

export interface CorrelationSignal {
    name: string;
    symbolicDriver: string;
    biometricEcho: string;
    correlation: 'positive' | 'negative' | 'neutral';
    strength: number;  // 0-1
}

/**
 * Full correlation report.
 */
export interface BiometricCorrelationReport {
    subject: string;
    dateRange: string;

    // Daily correlations
    timeline: DayCorrelation[];

    // Aggregate scores
    overallUncannyScore: number;
    overallCorrespondence: string;

    // Key findings
    findings: {
        title: string;
        symbolicPhase: string;
        calendarRange: string;
        physiologicalEcho: string;
        interpretation: string;
    }[];

    // Summary prose
    prose: string;
}

// ============================================================================
// AUTOEXPORT PARSER
// ============================================================================

/**
 * Parse AutoExport JSON into normalized daily biometrics.
 */
export function parseAutoExport(json: AutoExportData): Map<string, DailyBiometrics> {
    const byDate = new Map<string, DailyBiometrics>();

    // Parse metrics
    for (const metric of json.data.metrics) {
        for (const point of metric.data) {
            const dateKey = normalizeDate(point.date);

            if (!byDate.has(dateKey)) {
                byDate.set(dateKey, { date: dateKey });
            }

            const day = byDate.get(dateKey)!;

            switch (metric.name) {
                case 'heart_rate':
                    day.heartRate = {
                        avg: point.Avg || point.qty || 0,
                        min: point.Min || 0,
                        max: point.Max || 0,
                    };
                    break;
                case 'heart_rate_variability':
                    day.hrv = point.qty;
                    break;
                case 'active_energy':
                    day.activeEnergy = point.qty;
                    break;
                case 'mindful_minutes':
                    day.mindfulMinutes = point.qty;
                    break;
                case 'blood_oxygen_saturation':
                    day.bloodOxygen = point.qty;
                    break;
                case 'physical_effort':
                    day.physicalEffort = point.qty;
                    break;
                case 'apple_sleeping_wrist_temperature':
                    day.sleepTemperature = point.qty;
                    break;
                case 'breathing_disturbances':
                    day.breathingDisturbances = point.qty;
                    break;
                case 'apple_stand_hour':
                    day.standHours = point.qty;
                    break;
                case 'apple_exercise_time':
                    day.exerciseMinutes = point.qty;
                    break;
            }
        }
    }

    // Parse Apple State of Mind (self-reported mood)
    if (json.data.stateOfMind) {
        for (const entry of json.data.stateOfMind) {
            // Normalize ISO timestamp to date
            const dateKey = normalizeISODate(entry.start);

            if (!byDate.has(dateKey)) {
                byDate.set(dateKey, { date: dateKey });
            }

            const day = byDate.get(dateKey)!;
            day.stateOfMind = {
                valence: entry.valence,
                valenceClassification: entry.valenceClassification,
                labels: entry.labels,
                associations: entry.associations,
            };
        }
    }

    return byDate;
}

/**
 * Normalize date string to ISO date (YYYY-MM-DD).
 */
function normalizeDate(dateStr: string): string {
    // AutoExport format: "2025-12-23 00:00:00 -0600"
    const match = dateStr.match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : dateStr;
}

/**
 * Normalize ISO timestamp to date (YYYY-MM-DD).
 */
function normalizeISODate(isoStr: string): string {
    // ISO format: "2025-12-25T22:32:09Z"
    const match = isoStr.match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : isoStr;
}

/**
 * Map Apple valence (-1 to +1) to our valence scale (-5 to +5).
 */
export function mapAppleValenceToScale(appleValence: number): number {
    return appleValence * 5;
}

/**
 * Map Apple valence classification to our labels.
 */
export function mapAppleValenceClassification(classification: string): string {
    const mapping: Record<string, string> = {
        'very_unpleasant': 'Crisis',
        'unpleasant': 'Exhausted',
        'slightly_unpleasant': 'Stressed',
        'neutral': 'Steady',
        'slightly_pleasant': 'Good',
        'pleasant': 'Great',
        'very_pleasant': 'Peak',
    };
    return mapping[classification] || 'Steady';
}

// ============================================================================
// CORRELATION ENGINE
// ============================================================================

/**
 * Correlate Symbolic Moment data with Biometric data.
 */
export function correlateBiometrics(
    symbolicData: SymbolicMomentDashboard,
    biometricData: AutoExportData
): BiometricCorrelationReport {
    const biometrics = parseAutoExport(biometricData);
    const timeline: DayCorrelation[] = [];

    // Get symbolic timeline
    const symbolicTimeline = symbolicData.timeline?.subject_a ||
        symbolicData.person_a?.chart?.transitsByDate || {};

    // Align dates
    const allDates = new Set<string>();
    Object.keys(symbolicTimeline).forEach(d => allDates.add(d));
    biometrics.forEach((_, d) => allDates.add(d));

    const sortedDates = Array.from(allDates).sort();

    for (const date of sortedDates) {
        const symbolic = symbolicTimeline[date];
        const bio = biometrics.get(date);

        if (symbolic && bio) {
            const dayCorrelation = correlateSingleDay(date, symbolic, bio);
            timeline.push(dayCorrelation);
        }
    }

    // Calculate overall Uncanny Score
    const totalUncanny = timeline.reduce((sum, d) => sum + d.uncannyComponent, 0);
    const overallUncannyScore = timeline.length > 0
        ? Math.round(totalUncanny / timeline.length)
        : 0;

    // Generate findings
    const findings = generateFindings(timeline);

    // Generate prose
    const prose = generateCorrelationProse(timeline, findings, overallUncannyScore);

    return {
        subject: symbolicData.person_a.name,
        dateRange: `${sortedDates[0]} to ${sortedDates[sortedDates.length - 1]}`,
        timeline,
        overallUncannyScore,
        overallCorrespondence: getCorrespondenceLabel(overallUncannyScore),
        findings,
        prose,
    };
}

/**
 * Correlate a single day's data.
 */
function correlateSingleDay(
    date: string,
    symbolic: DaySnapshot,
    bio: DailyBiometrics
): DayCorrelation {
    const signals: CorrelationSignal[] = [];
    let uncannyComponent = 50; // Base score

    const { magnitude, directional_bias: bias, volatility } = symbolic.seismograph;
    const phase = classifyDayPhase(bias, volatility);

    // HRV ↔ Directional Bias correlation
    if (bio.hrv !== undefined) {
        // Low HRV correlates with inward bias (compression)
        const expectedLowHRV = bias < -1.5;
        const actualLowHRV = bio.hrv < 25;

        if (expectedLowHRV === actualLowHRV) {
            uncannyComponent += 15;
            signals.push({
                name: 'HRV-Bias Alignment',
                symbolicDriver: `Directional Bias: ${bias.toFixed(1)} (${bias < 0 ? 'inward' : 'outward'})`,
                biometricEcho: `HRV: ${bio.hrv.toFixed(0)}ms (${bio.hrv < 25 ? 'low' : 'normal'})`,
                correlation: 'positive',
                strength: 0.8,
            });
        }
    }

    // Heart Rate ↔ Magnitude correlation
    if (bio.heartRate?.avg !== undefined) {
        // High HR correlates with high magnitude
        const expectedHighHR = magnitude > 3.5;
        const actualHighHR = bio.heartRate.avg > 90;

        if (expectedHighHR === actualHighHR) {
            uncannyComponent += 10;
            signals.push({
                name: 'HR-Magnitude Alignment',
                symbolicDriver: `Magnitude: ${magnitude.toFixed(1)}`,
                biometricEcho: `Avg HR: ${bio.heartRate.avg.toFixed(0)} bpm`,
                correlation: 'positive',
                strength: 0.7,
            });
        }
    }

    // Mindful Minutes ↔ Reorganization Phase
    if (bio.mindfulMinutes !== undefined) {
        const inReorganization = phase === 'Reorganization' || phase === 'Recovery';
        const highMindfulness = bio.mindfulMinutes > 30;

        if (inReorganization && highMindfulness) {
            uncannyComponent += 10;
            signals.push({
                name: 'Mindfulness-Phase Alignment',
                symbolicDriver: `Phase: ${phase}`,
                biometricEcho: `Mindful Minutes: ${bio.mindfulMinutes.toFixed(0)}`,
                correlation: 'positive',
                strength: 0.75,
            });
        }
    }

    // Active Energy ↔ Volatility
    if (bio.activeEnergy !== undefined) {
        // High volatility often correlates with erratic energy patterns
        const highVolatility = volatility > 4;
        const lowEnergy = bio.activeEnergy < 150;

        if (highVolatility && lowEnergy) {
            uncannyComponent += 10;
            signals.push({
                name: 'Energy-Volatility Pattern',
                symbolicDriver: `Volatility: ${volatility.toFixed(1)} (chaotic)`,
                biometricEcho: `Active Energy: ${bio.activeEnergy.toFixed(0)} kcal (contracted)`,
                correlation: 'positive',
                strength: 0.6,
            });
        }
    }

    // Apple State of Mind ↔ Directional Bias (TRIPLE VALIDATION!)
    if (bio.stateOfMind) {
        // Map Apple valence (-1 to +1) to our scale (-5 to +5)
        const appleValenceScaled = bio.stateOfMind.valence * 5;

        // Check if self-reported valence matches symbolic bias direction
        const biasMatchesValence =
            (bias < -1 && appleValenceScaled < -1) ||  // Both negative
            (bias > 1 && appleValenceScaled > 1) ||    // Both positive
            (Math.abs(bias) <= 1 && Math.abs(appleValenceScaled) <= 1); // Both neutral

        if (biasMatchesValence) {
            uncannyComponent += 20; // High weight for self-report alignment
            signals.push({
                name: 'Self-Report Matches Geometry',
                symbolicDriver: `Directional Bias: ${bias.toFixed(1)} (${bias < 0 ? 'inward' : 'outward'})`,
                biometricEcho: `State of Mind: ${bio.stateOfMind.valenceClassification} (${bio.stateOfMind.labels.slice(0, 3).join(', ')})`,
                correlation: 'positive',
                strength: 0.95,
            });
        } else {
            // Mismatch — flag it but don't penalize heavily
            signals.push({
                name: 'Self-Report Diverges from Geometry',
                symbolicDriver: `Directional Bias: ${bias.toFixed(1)}`,
                biometricEcho: `State of Mind: ${bio.stateOfMind.valenceClassification}`,
                correlation: 'negative',
                strength: 0.5,
            });
        }
    }

    return {
        date,
        symbolic: {
            magnitude,
            directionalBias: bias,
            volatility,
            phase,
        },
        biometric: bio,
        signals,
        uncannyComponent: Math.min(100, Math.max(0, uncannyComponent)),
    };
}

/**
 * Classify a day's phase from metrics.
 */
function classifyDayPhase(bias: number, volatility: number): string {
    if (bias < -2) return 'Compression';
    if (bias < -0.5) return 'Integration';
    if (bias > 2) return 'Expression';
    if (bias > 0.5) return 'Expansion';
    if (volatility > 4) return 'Reorganization';
    return 'Equilibrium';
}

/**
 * Generate key findings from the timeline.
 */
function generateFindings(timeline: DayCorrelation[]): BiometricCorrelationReport['findings'] {
    const findings: BiometricCorrelationReport['findings'] = [];

    // Find compression → reorganization transitions
    const compressionDays: DayCorrelation[] = [];
    const reorganizationDays: DayCorrelation[] = [];

    for (const day of timeline) {
        if (day.symbolic.phase === 'Compression' || day.symbolic.phase === 'Integration') {
            compressionDays.push(day);
        }
        if (day.symbolic.phase === 'Reorganization' || day.symbolic.phase === 'Equilibrium') {
            reorganizationDays.push(day);
        }
    }

    if (compressionDays.length > 0 && reorganizationDays.length > 0) {
        const avgHRVCompression = average(compressionDays.map(d => d.biometric.hrv).filter(Boolean) as number[]);
        const avgHRVReorg = average(reorganizationDays.map(d => d.biometric.hrv).filter(Boolean) as number[]);

        findings.push({
            title: 'Compression → Reorganization Mirrors Physiological Load → Recovery',
            symbolicPhase: 'Compression',
            calendarRange: `${compressionDays[0]?.date} to ${reorganizationDays[reorganizationDays.length - 1]?.date}`,
            physiologicalEcho: avgHRVCompression && avgHRVReorg
                ? `HRV ${avgHRVCompression.toFixed(0)}ms → ${avgHRVReorg.toFixed(0)}ms`
                : 'HRV pattern aligned with phases',
            interpretation: 'Pressure that stops collapsing and begins to circulate.',
        });
    }

    // Find sleep pattern correlations
    const timelineWithSleep = timeline.filter(d => d.biometric.mindfulMinutes !== undefined);
    if (timelineWithSleep.length > 0) {
        const maxMindful = Math.max(...timelineWithSleep.map(d => d.biometric.mindfulMinutes || 0));
        const maxDay = timelineWithSleep.find(d => d.biometric.mindfulMinutes === maxMindful);

        if (maxDay && maxMindful > 50) {
            findings.push({
                title: 'Neptunian Rest Signature',
                symbolicPhase: maxDay.symbolic.phase,
                calendarRange: maxDay.date,
                physiologicalEcho: `Mindful Minutes peaked at ${maxMindful.toFixed(0)} min`,
                interpretation: 'Field cooling into shape as literal recuperation time.',
            });
        }
    }

    return findings;
}

function average(arr: number[]): number {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function getCorrespondenceLabel(score: number): string {
    if (score >= 85) return 'High Correspondence';
    if (score >= 70) return 'Moderate Correspondence';
    if (score >= 50) return 'Partial Match';
    return 'Low Correspondence';
}

/**
 * Generate prose summary of correlations.
 */
function generateCorrelationProse(
    timeline: DayCorrelation[],
    findings: BiometricCorrelationReport['findings'],
    overallScore: number
): string {
    let prose = `**Biometric Correlation Analysis**\n\n`;
    prose += `The alignment between Symbolic Moment data and physiological metrics shows `;
    prose += `${getCorrespondenceLabel(overallScore)} (Uncanny Score: ${overallScore}%).\n\n`;

    if (findings.length > 0) {
        prose += `**Key Correlations:**\n\n`;
        for (const finding of findings) {
            prose += `*${finding.title}*\n`;
            prose += `• Phase: ${finding.symbolicPhase} (${finding.calendarRange})\n`;
            prose += `• Physiological Echo: ${finding.physiologicalEcho}\n`;
            prose += `• Interpretation: ${finding.interpretation}\n\n`;
        }
    }

    prose += `---\n\n`;
    prose += `*"The numbers trace what the chart already described. `;
    prose += `This is how symbolic load converts to biological signal — `;
    prose += `not prediction, but coherence made visible."*`;

    return prose;
}

// ============================================================================
// SIMPLIFIED PARSER (for pasted data in chat)
// ============================================================================

/**
 * Parse simplified pasted health data format.
 * Example input:
 * "Date: 2026-01-03, HR: 93, HRV: 29, Energy: 203, Mindful: 77"
 */
export function parsePastedHealthData(text: string): Map<string, DailyBiometrics> {
    const byDate = new Map<string, DailyBiometrics>();
    const lines = text.split('\n').filter(l => l.trim());

    for (const line of lines) {
        const dateMatch = line.match(/Date:\s*(\d{4}-\d{2}-\d{2})/i) ||
            line.match(/(\d{4}-\d{2}-\d{2})/);
        if (!dateMatch) continue;

        const date = dateMatch[1];
        const bio: DailyBiometrics = { date };

        const hrMatch = line.match(/HR:\s*([\d.]+)/i);
        if (hrMatch) bio.heartRate = { avg: parseFloat(hrMatch[1]), min: 0, max: 0 };

        const hrvMatch = line.match(/HRV:\s*([\d.]+)/i);
        if (hrvMatch) bio.hrv = parseFloat(hrvMatch[1]);

        const energyMatch = line.match(/Energy:\s*([\d.]+)/i);
        if (energyMatch) bio.activeEnergy = parseFloat(energyMatch[1]);

        const mindfulMatch = line.match(/Mindful:\s*([\d.]+)/i);
        if (mindfulMatch) bio.mindfulMinutes = parseFloat(mindfulMatch[1]);

        byDate.set(date, bio);
    }

    return byDate;
}
