import type { Measurement } from "@/types/measurement";
import { parseDateTime } from "./calculations";

export type PeriodFilter = "7d" | "30d" | "90d" | "6m" | "all" | "custom";

export const PERIOD_OPTIONS: { value: PeriodFilter; label: string }[] = [
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "90d", label: "90 dias" },
  { value: "6m", label: "6 meses" },
  { value: "all", label: "Tudo" },
  { value: "custom", label: "Personalizado" },
];

export const CONTEXT_FILTER_OPTIONS = [
  "Todas",
  "Antes da alimentação",
  "Após a alimentação",
  "Antes da insulina",
  "Após a insulina",
  "Outro",
];

export interface MeasurementFilters {
  period: PeriodFilter;
  from?: string;
  to?: string;
  context?: string;
}

function periodStartDate(period: PeriodFilter, now: Date): Date | null {
  const start = new Date(now);
  switch (period) {
    case "7d":
      start.setDate(start.getDate() - 7);
      return start;
    case "30d":
      start.setDate(start.getDate() - 30);
      return start;
    case "90d":
      start.setDate(start.getDate() - 90);
      return start;
    case "6m":
      start.setMonth(start.getMonth() - 6);
      return start;
    default:
      return null;
  }
}

export function filterMeasurements(
  measurements: Measurement[],
  filters: MeasurementFilters,
  now: Date = new Date()
): Measurement[] {
  let result = measurements;

  if (filters.period === "custom") {
    const fromTime = filters.from ? new Date(`${filters.from}T00:00:00`).getTime() : null;
    const toTime = filters.to ? new Date(`${filters.to}T23:59:59`).getTime() : null;
    result = result.filter((m) => {
      const t = parseDateTime(m.dateTime);
      if (fromTime !== null && t < fromTime) return false;
      if (toTime !== null && t > toTime) return false;
      return true;
    });
  } else if (filters.period !== "all") {
    const start = periodStartDate(filters.period, now);
    if (start) {
      const startTime = start.getTime();
      result = result.filter((m) => parseDateTime(m.dateTime) >= startTime);
    }
  }

  if (filters.context && filters.context !== "Todas") {
    result = result.filter((m) => m.context === filters.context);
  }

  return result;
}

export function parseFiltersFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): MeasurementFilters {
  const rawPeriod = typeof searchParams.period === "string" ? searchParams.period : "all";
  const period = PERIOD_OPTIONS.some((o) => o.value === rawPeriod) ? (rawPeriod as PeriodFilter) : "all";

  return {
    period,
    from: typeof searchParams.from === "string" ? searchParams.from : undefined,
    to: typeof searchParams.to === "string" ? searchParams.to : undefined,
    context: typeof searchParams.context === "string" ? searchParams.context : undefined,
  };
}

export function hasActiveFilters(filters: MeasurementFilters): boolean {
  return filters.period !== "all" || Boolean(filters.context && filters.context !== "Todas");
}
