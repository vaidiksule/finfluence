import { EventStudyWindow } from '../types';

export interface PriceSeries {
  dates: string[];
  prices: number[];
  returns: number[]; // daily percentage returns (e.g. 0.052 for +5.2%)
}

/**
 * Identify shock trigger dates where source asset daily return move exceeds threshold_sigma (default 2.0σ)
 * over trailing historical trading days (default 252).
 * Direction aware: positive spikes vs negative drops.
 * Merges overlapping triggers within mergeWindowDays (default 10) to avoid double counting.
 */
export function identifyTriggers(
  sourceSeries: PriceSeries,
  direction: 'positive' | 'negative' | 'ambiguous' = 'positive',
  thresholdSigma: number = 2.0,
  trailingDays: number = 252,
  mergeWindowDays: number = 10
): number[] {
  const { returns } = sourceSeries;
  const n = returns.length;
  if (n < 30) return [];

  const triggerIndices: number[] = [];

  for (let i = 20; i < n; i++) {
    const windowStart = Math.max(0, i - trailingDays);
    const windowReturns = returns.slice(windowStart, i);
    if (windowReturns.length < 20) continue;

    // Trailing mean and standard deviation
    const mean = windowReturns.reduce((acc, v) => acc + v, 0) / windowReturns.length;
    const variance =
      windowReturns.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (windowReturns.length - 1);
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) continue;

    const r_i = returns[i];
    const zScore = (r_i - mean) / stdDev;

    let isTrigger = false;
    if (direction === 'positive' && zScore >= thresholdSigma) {
      isTrigger = true;
    } else if (direction === 'negative' && zScore <= -thresholdSigma) {
      isTrigger = true;
    } else if (direction === 'ambiguous' && Math.abs(zScore) >= thresholdSigma) {
      isTrigger = true;
    }

    if (isTrigger) {
      // Merge overlapping events within mergeWindowDays
      if (
        triggerIndices.length === 0 ||
        i - triggerIndices[triggerIndices.length - 1] > mergeWindowDays
      ) {
        triggerIndices.push(i);
      }
    }
  }

  return triggerIndices;
}

/**
 * Standard Normal / Student-t two-tailed p-value calculation.
 * Uses exact Abramowitz and Stegun approximation for the cumulative normal distribution,
 * suitable for financial event study sample sizes.
 */
export function calculatePValue(tStat: number, degreesOfFreedom: number): number {
  if (isNaN(tStat) || !isFinite(tStat) || degreesOfFreedom < 1) return 1.0;
  const absT = Math.abs(tStat);

  // If df >= 30, t-distribution converges to standard normal
  // For small samples, apply Hill's approximation to Student-t CDF
  let x = absT;
  if (degreesOfFreedom < 30) {
    // Normalizing transformation for Student-t
    x = absT * (1 - 1 / (4 * degreesOfFreedom));
  }

  // Complementary error function approximation
  const b1 = 0.31938153;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const p = 0.2316419;

  const t = 1.0 / (1.0 + p * x);
  const z = (1.0 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
  const oneTail = z * ((((b5 * t + b4) * t + b3) * t + b2) * t + b1) * t;

  const twoTail = Math.min(1.0, Math.max(0.0001, 2.0 * oneTail));
  return parseFloat(twoTail.toFixed(4));
}

/**
 * Compute Cumulative Abnormal Returns (CAR) for target asset around trigger dates.
 * Estimation window: baselineWindow (default 60 days) ending gapDays (default 5) before trigger.
 * Abnormal return = target return minus baseline mean return.
 */
export function computeEventStudyWindow(
  targetSeries: PriceSeries,
  triggerIndices: number[],
  windowDays: number,
  expectedDirection: 'positive' | 'negative' | 'ambiguous',
  baselineWindow: number = 60,
  gapDays: number = 5
): EventStudyWindow {
  const { returns } = targetSeries;
  const nTriggers = triggerIndices.length;

  if (nTriggers === 0) {
    return {
      n: 0,
      hits: 0,
      hit_rate: 0,
      mean_car: 0,
      p_value: 1.0,
      significance: 'insignificant'
    };
  }

  const cars: number[] = [];
  let hits = 0;

  for (const trigIdx of triggerIndices) {
    // Baseline estimation window
    const baseEnd = Math.max(0, trigIdx - gapDays);
    const baseStart = Math.max(0, baseEnd - baselineWindow);
    const baseReturns = returns.slice(baseStart, baseEnd);

    const normalReturn =
      baseReturns.length > 0
        ? baseReturns.reduce((acc, v) => acc + v, 0) / baseReturns.length
        : 0;

    // Event window: trigIdx to trigIdx + windowDays
    const eventEnd = Math.min(returns.length, trigIdx + windowDays);
    let car = 0;
    for (let k = trigIdx; k < eventEnd; k++) {
      car += returns[k] - normalReturn;
    }
    cars.push(car);

    // Direction hit test
    if (expectedDirection === 'positive' && car > 0) hits++;
    else if (expectedDirection === 'negative' && car < 0) hits++;
    else if (expectedDirection === 'ambiguous' && Math.abs(car) > 0.005) hits++;
  }

  const validN = cars.length;
  if (validN === 0) {
    return {
      n: 0,
      hits: 0,
      hit_rate: 0,
      mean_car: 0,
      p_value: 1.0,
      significance: 'insignificant'
    };
  }

  const meanCar = cars.reduce((acc, v) => acc + v, 0) / validN;
  const hitRate = parseFloat((hits / validN).toFixed(3));

  // Sample standard error & one-sample t-test
  let stdDev = 0;
  if (validN > 1) {
    const sumSq = cars.reduce((acc, v) => acc + Math.pow(v - meanCar, 2), 0);
    stdDev = Math.sqrt(sumSq / (validN - 1));
  }
  const stdError = validN > 1 ? stdDev / Math.sqrt(validN) : 0.01;
  const tStat = stdError > 0 ? meanCar / stdError : 0;
  const pValue = validN > 1 ? calculatePValue(tStat, validN - 1) : 1.0;

  let significance: 'insignificant' | 'suggestive' | 'significant' = 'insignificant';
  if (pValue < 0.05) significance = 'significant';
  else if (pValue < 0.10) significance = 'suggestive';

  // Median CAR
  const sortedCars = [...cars].sort((a, b) => a - b);
  const medianCar =
    validN % 2 === 0
      ? (sortedCars[validN / 2 - 1] + sortedCars[validN / 2]) / 2
      : sortedCars[Math.floor(validN / 2)];

  return {
    n: validN,
    hits,
    hit_rate: hitRate,
    mean_car: parseFloat(meanCar.toFixed(4)),
    median_car: parseFloat(medianCar.toFixed(4)),
    std_error: parseFloat(stdError.toFixed(4)),
    p_value: pValue,
    significance
  };
}
