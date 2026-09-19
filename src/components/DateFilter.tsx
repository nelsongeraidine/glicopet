"use client";

import { PERIOD_OPTIONS, CONTEXT_FILTER_OPTIONS, type MeasurementFilters, type PeriodFilter } from "@/utils/filters";

export function DateFilter({
  filters,
  onChange,
}: {
  filters: MeasurementFilters;
  onChange: (filters: MeasurementFilters) => void;
}) {
  const { period, from = "", to = "", context = "Todas" } = filters;

  function handlePeriodClick(value: PeriodFilter) {
    if (value === "custom") {
      onChange({ ...filters, period: "custom" });
    } else {
      onChange({ ...filters, period: value, from: undefined, to: undefined });
    }
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3 shadow-sm">
      {PERIOD_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => handlePeriodClick(option.value)}
          className={`rounded-full px-3 py-1 text-sm ${
            period === option.value ? "bg-[#7C5FC4] text-white" : "bg-[#F8F7FC] text-[#252333]"
          }`}
        >
          {option.label}
        </button>
      ))}

      {period === "custom" && (
        <>
          <input
            type="date"
            aria-label="Data inicial"
            value={from}
            onChange={(e) => onChange({ ...filters, from: e.target.value })}
            className="rounded-lg border border-[#DCEBFA] p-1 text-sm"
          />
          <span className="text-sm text-[#6F6B78]">até</span>
          <input
            type="date"
            aria-label="Data final"
            value={to}
            onChange={(e) => onChange({ ...filters, to: e.target.value })}
            className="rounded-lg border border-[#DCEBFA] p-1 text-sm"
          />
        </>
      )}

      <select
        aria-label="Filtrar por contexto"
        value={context}
        onChange={(e) => onChange({ ...filters, context: e.target.value === "Todas" ? undefined : e.target.value })}
        className="rounded-lg border border-[#DCEBFA] p-1 text-sm"
      >
        {CONTEXT_FILTER_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => onChange({ period: "all" })}
        className="ml-auto text-sm text-[#6F6B78] underline decoration-dotted"
      >
        Limpar filtros
      </button>
    </div>
  );
}
