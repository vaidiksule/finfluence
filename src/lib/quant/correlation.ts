import { PriceSeries } from './eventStudy';

export interface LaggedCorrelationResult {
  best_lag: number; // 0 to 5
  best_corr: number; // -1 to 1
  correlations: { [lag: number]: number };
}

/**
 * Compute Pearson correlation between two arrays of numbers.
 */
export function pearsonCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 5) return 0;

  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
  }
  const meanX = sumX / n;
  const meanY = sumY / n;

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  const den = Math.sqrt(denX * denY);
  if (den === 0) return 0;
  return parseFloat((num / den).toFixed(4));
}

/**
 * Compute rolling lagged correlation between source and target returns
 * over rollingWindow days (default 90) across lags 0 to maxLag (default 5).
 */
export function computeLaggedCorrelation(
  sourceSeries: PriceSeries,
  targetSeries: PriceSeries,
  rollingWindow: number = 90,
  maxLag: number = 5
): LaggedCorrelationResult {
  const sReturns = sourceSeries.returns;
  const tReturns = targetSeries.returns;
  const n = Math.min(sReturns.length, tReturns.length);

  if (n < 30) {
    return {
      best_lag: 0,
      best_corr: 0,
      correlations: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  // Use the most recent rollingWindow days
  const startIdx = Math.max(0, n - rollingWindow);
  const correlations: { [lag: number]: number } = {};
  let bestLag = 0;
  let maxAbsCorr = -1;
  let bestCorr = 0;

  for (let lag = 0; lag <= maxLag; lag++) {
    // source at t, target at t + lag
    const x: number[] = [];
    const y: number[] = [];

    for (let t = startIdx; t < n - lag; t++) {
      x.push(sReturns[t]);
      y.push(tReturns[t + lag]);
    }

    const r = pearsonCorrelation(x, y);
    correlations[lag] = r;

    if (Math.abs(r) > maxAbsCorr) {
      maxAbsCorr = Math.abs(r);
      bestLag = lag;
      bestCorr = r;
    }
  }

  return {
    best_lag: bestLag,
    best_corr: bestCorr,
    correlations
  };
}
