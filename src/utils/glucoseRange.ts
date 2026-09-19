export type GlucoseRangeStatus = "abaixo" | "dentro" | "acima";

export function classifyGlucose(
  value: number,
  min?: number,
  max?: number
): GlucoseRangeStatus | null {
  if (min === undefined || max === undefined) return null;
  if (value < min) return "abaixo";
  if (value > max) return "acima";
  return "dentro";
}

export const RANGE_STATUS_LABEL: Record<GlucoseRangeStatus, string> = {
  abaixo: "Abaixo da faixa",
  dentro: "Dentro da faixa",
  acima: "Acima da faixa",
};

export const RANGE_STATUS_COLOR: Record<GlucoseRangeStatus, string> = {
  abaixo: "#F2B8C6",
  dentro: "#DDF1E7",
  acima: "#F2B8C6",
};
