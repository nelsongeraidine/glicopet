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
  abaixo: "#DCEBFA",
  dentro: "#DDF1E7",
  acima: "#F2B8C6",
};

// Símbolo visível junto da cor: hipo/hiperglicemia não podem depender só de cor (WCAG 1.4.1).
export const RANGE_STATUS_ICON: Record<GlucoseRangeStatus, string> = {
  abaixo: "▼",
  dentro: "",
  acima: "▲",
};
