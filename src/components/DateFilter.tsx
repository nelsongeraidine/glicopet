"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PERIOD_OPTIONS, CONTEXT_FILTER_OPTIONS, type PeriodFilter } from "@/utils/filters";

export function DateFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const period = (searchParams.get("period") as PeriodFilter) || "all";
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const context = searchParams.get("context") ?? "Todas";

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function handlePeriodClick(value: PeriodFilter) {
    if (value === "custom") {
      updateParams({ period: "custom" });
    } else {
      updateParams({ period: value, from: null, to: null });
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
            period === option.value ? "bg-[#B9A0E8] text-white" : "bg-[#F8F7FC] text-[#252333]"
          }`}
        >
          {option.label}
        </button>
      ))}

      {period === "custom" && (
        <>
          <input
            type="date"
            value={from}
            onChange={(e) => updateParams({ from: e.target.value })}
            className="rounded-lg border border-[#DCEBFA] p-1 text-sm"
          />
          <span className="text-sm text-[#6F6B78]">até</span>
          <input
            type="date"
            value={to}
            onChange={(e) => updateParams({ to: e.target.value })}
            className="rounded-lg border border-[#DCEBFA] p-1 text-sm"
          />
        </>
      )}

      <select
        value={context}
        onChange={(e) => updateParams({ context: e.target.value === "Todas" ? null : e.target.value })}
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
        onClick={() => router.push(pathname)}
        className="ml-auto text-sm text-[#6F6B78] underline decoration-dotted"
      >
        Limpar filtros
      </button>
    </div>
  );
}
