"use client";

import type { Measurement } from "@/types/measurement";

const COLUMNS = [
  "Data/Hora",
  "Glicemia (mg/dL)",
  "Insulina (U)",
  "Alimentação (g)",
  "Contexto",
  "Observação",
  "Demonstração",
];

function toRow(m: Measurement): (string | number)[] {
  return [
    m.dateTime,
    m.glucose ?? "",
    m.insulin ?? "",
    m.food ?? "",
    m.context ?? "",
    m.notes ?? "",
    m.isDemo ? "Sim" : "Não",
  ];
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCsv(measurements: Measurement[], filename = "glicopet-medicoes.csv") {
  const rows = [COLUMNS, ...measurements.map(toRow)];
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
    .join("\r\n");
  // BOM no início garante acentuação correta ao abrir no Excel.
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename);
}

export async function exportToXlsx(measurements: Measurement[], filename = "glicopet-medicoes.xlsx") {
  // Import sob demanda: xlsx só é necessário quando o usuário realmente exporta,
  // não deve pesar no bundle carregado por toda visita ao dashboard.
  const XLSX = await import("xlsx");
  const rows = [COLUMNS, ...measurements.map(toRow)];
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Medições");
  XLSX.writeFile(workbook, filename);
}

export async function exportToPdf(measurements: Measurement[], filename = "glicopet-medicoes.pdf") {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("GlicoPet — Histórico de medições", 14, 16);
  autoTable(doc, {
    startY: 22,
    head: [COLUMNS],
    body: measurements.map(toRow),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [185, 160, 232] },
  });
  doc.save(filename);
}
