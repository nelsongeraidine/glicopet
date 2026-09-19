"use client";

import { useState } from "react";
import type { Measurement } from "@/types/measurement";
import { exportToCsv, exportToXlsx, exportToPdf } from "@/utils/export";

export function ExportButton({ measurements }: { measurements: Measurement[] }) {
  const [open, setOpen] = useState(false);
  const disabled = measurements.length === 0;

  function handle(format: "csv" | "xlsx" | "pdf") {
    if (format === "csv") exportToCsv(measurements);
    if (format === "xlsx") exportToXlsx(measurements);
    if (format === "pdf") exportToPdf(measurements);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="rounded-full border border-[#DCEBFA] bg-white px-4 py-2 text-sm font-semibold text-[#252333] shadow-sm disabled:opacity-50"
      >
        Exportar dados
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-40 rounded-xl bg-white p-2 shadow-md">
          <button
            type="button"
            onClick={() => handle("xlsx")}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#F8F7FC]"
          >
            Excel (.xlsx)
          </button>
          <button
            type="button"
            onClick={() => handle("csv")}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#F8F7FC]"
          >
            CSV
          </button>
          <button
            type="button"
            onClick={() => handle("pdf")}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#F8F7FC]"
          >
            PDF
          </button>
        </div>
      )}
    </div>
  );
}
