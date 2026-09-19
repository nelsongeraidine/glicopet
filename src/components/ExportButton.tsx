"use client";

import { useEffect, useRef, useState } from "react";
import type { Measurement } from "@/types/measurement";
import { exportToCsv, exportToXlsx, exportToPdf } from "@/utils/export";

export function ExportButton({ measurements }: { measurements: Measurement[] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const disabled = measurements.length === 0;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function handle(format: "csv" | "xlsx" | "pdf") {
    if (format === "csv") exportToCsv(measurements);
    if (format === "xlsx") await exportToXlsx(measurements);
    if (format === "pdf") await exportToPdf(measurements);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-full border border-[#DCEBFA] bg-white px-4 py-2 text-sm font-semibold text-[#252333] shadow-sm disabled:opacity-50"
      >
        Exportar dados
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-10 mt-2 w-40 rounded-xl bg-white p-2 shadow-md">
          <button
            type="button"
            role="menuitem"
            onClick={() => handle("xlsx")}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#F8F7FC]"
          >
            Excel (.xlsx)
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => handle("csv")}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#F8F7FC]"
          >
            CSV
          </button>
          <button
            type="button"
            role="menuitem"
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
