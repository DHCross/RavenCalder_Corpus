/**
 * Extracts and condenses daily transit physics for AI context injection.
 * Captures Drivers, Physics (V/Z/SST), and Top 3 Resonance Traces.
 * Defaults to 14-day forecast window.
 */
export const extractDailyPhysics = (tData: any, daysToExtract: number = 14) => {
    if (!tData) return null;
    const dates = Object.keys(tData).sort().slice(0, daysToExtract); // Extended window for Probability Forecasts
    return dates.map(d => {
        const day = tData[d];
        return {
            date: d,
            drivers: day.seismograph?.drivers || [],
            physics: day.physics ? {
                V: day.physics.V,
                Z: day.physics.Z,
                SST: day.physics.SST
            } : null,
            resonance_top_3: day.resonance_trace?.slice(0, 3).map((r: any) => `${r.aspect} (${r.classification})`)
        };
    });
};
