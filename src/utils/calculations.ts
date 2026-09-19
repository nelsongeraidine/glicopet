import type { Measurement } from "@/types/measurement";

function glucoseValues(measurements: Measurement[]): number[] {
  return measurements
    .map((m) => m.glucose)
    .filter((v): v is number => v !== undefined);
}

export function averageGlucose(measurements: Measurement[]): number | null {
  const values = glucoseValues(measurements);
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function minGlucose(measurements: Measurement[]): number | null {
  const values = glucoseValues(measurements);
  return values.length === 0 ? null : Math.min(...values);
}

export function maxGlucose(measurements: Measurement[]): number | null {
  const values = glucoseValues(measurements);
  return values.length === 0 ? null : Math.max(...values);
}

export function lastMeasurement(measurements: Measurement[]): Measurement | null {
  const withGlucose = measurements.filter((m) => m.glucose !== undefined);
  if (withGlucose.length === 0) return null;
  // A planilha não garante ordenação; comparar por Data/Hora textual (DD/MM/YYYY HH:mm) exige parse.
  return [...withGlucose].sort((a, b) => parseDateTime(b.dateTime) - parseDateTime(a.dateTime))[0];
}

export function glucoseAmplitude(measurements: Measurement[]): number | null {
  const min = minGlucose(measurements);
  const max = maxGlucose(measurements);
  return min === null || max === null ? null : max - min;
}

function averageOf(values: number[]): number | null {
  return values.length === 0 ? null : values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function averageInsulin(measurements: Measurement[]): number | null {
  return averageOf(measurements.map((m) => m.insulin).filter((v): v is number => v !== undefined));
}

export function averageFood(measurements: Measurement[]): number | null {
  return averageOf(measurements.map((m) => m.food).filter((v): v is number => v !== undefined));
}

/** Intervalo médio, em horas, entre registros consecutivos (qualquer tipo de medição). */
export function averageIntervalHours(measurements: Measurement[]): number | null {
  if (measurements.length < 2) return null;
  const sortedTimes = [...measurements]
    .map((m) => parseDateTime(m.dateTime))
    .sort((a, b) => a - b);

  const gaps = sortedTimes.slice(1).map((t, i) => t - sortedTimes[i]);
  const avgMs = averageOf(gaps);
  return avgMs === null ? null : avgMs / (1000 * 60 * 60);
}

const TREND_MIN_POINTS = 4;
const TREND_HIGH_VARIATION_CV = 0.25;
const TREND_DIRECTION_THRESHOLD_MGDL = 5;

export type GlucoseTrend =
  | "Os registros apresentam tendência de aumento no período."
  | "Os registros apresentam tendência de redução no período."
  | "Os valores apresentam grande variação entre as medições."
  | "Não há dados suficientes para identificar uma tendência.";

/** Estatística descritiva simples (PRD seção 23). Nunca interpretar como orientação médica. */
export function glucoseTrend(measurements: Measurement[]): GlucoseTrend {
  const withGlucose = [...measurements]
    .filter((m) => m.glucose !== undefined)
    .sort((a, b) => parseDateTime(a.dateTime) - parseDateTime(b.dateTime));

  if (withGlucose.length < TREND_MIN_POINTS) {
    return "Não há dados suficientes para identificar uma tendência.";
  }

  const values = withGlucose.map((m) => m.glucose as number);
  const mean = averageOf(values) as number;
  const variance = averageOf(values.map((v) => (v - mean) ** 2)) as number;
  const coefficientOfVariation = Math.sqrt(variance) / mean;

  if (coefficientOfVariation > TREND_HIGH_VARIATION_CV) {
    return "Os valores apresentam grande variação entre as medições.";
  }

  const half = Math.floor(values.length / 2);
  const firstHalfMean = averageOf(values.slice(0, half)) as number;
  const secondHalfMean = averageOf(values.slice(values.length - half)) as number;
  const diff = secondHalfMean - firstHalfMean;

  if (diff > TREND_DIRECTION_THRESHOLD_MGDL) {
    return "Os registros apresentam tendência de aumento no período.";
  }
  if (diff < -TREND_DIRECTION_THRESHOLD_MGDL) {
    return "Os registros apresentam tendência de redução no período.";
  }
  return "Não há dados suficientes para identificar uma tendência.";
}

function parseDateTime(value: string): number {
  const [datePart, timePart] = value.split(" ");
  if (!datePart) return 0;
  const [day, month, year] = datePart.split("/").map(Number);
  const [hour, minute] = (timePart ?? "00:00").split(":").map(Number);
  return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1, hour ?? 0, minute ?? 0).getTime();
}

export { parseDateTime };
