"use client";

import { useMemo, useState } from "react";
import type { Measurement } from "@/types/measurement";
import {
  averageGlucose,
  minGlucose,
  maxGlucose,
  lastMeasurement,
  parseDateTime,
  glucoseAmplitude,
  averageInsulin,
  averageFood,
  averageIntervalHours,
  glucoseTrend,
} from "@/utils/calculations";
import { filterMeasurements, hasActiveFilters, type MeasurementFilters } from "@/utils/filters";
import { classifyGlucose, RANGE_STATUS_LABEL, RANGE_STATUS_ICON, RANGE_STATUS_COLOR } from "@/utils/glucoseRange";
import { GlucoseChart } from "@/components/GlucoseChart";
import { MeasurementFormModal } from "@/components/MeasurementFormModal";
import { DeleteMeasurementButton } from "@/components/DeleteMeasurementButton";
import { DateFilter } from "@/components/DateFilter";
import { ExportButton } from "@/components/ExportButton";

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-2xl font-semibold text-[#252333]">{value}</p>
      <p className="text-sm text-[#6F6B78]">{sub ?? label}</p>
    </div>
  );
}

export function Dashboard({
  allMeasurements,
  rangeMin,
  rangeMax,
}: {
  allMeasurements: Measurement[];
  rangeMin?: number;
  rangeMax?: number;
}) {
  const [filters, setFilters] = useState<MeasurementFilters>({ period: "all" });

  // Filtrar no cliente evita o round-trip ao servidor a cada clique: os dados já
  // vieram todos na carga inicial, então trocar de filtro é só recálculo local.
  const measurements = useMemo(() => filterMeasurements(allMeasurements, filters), [allMeasurements, filters]);
  const sorted = useMemo(
    () => [...measurements].sort((a, b) => parseDateTime(b.dateTime) - parseDateTime(a.dateTime)),
    [measurements]
  );

  const avg = averageGlucose(measurements);
  const min = minGlucose(measurements);
  const max = maxGlucose(measurements);
  const last = lastMeasurement(measurements);
  const amplitude = glucoseAmplitude(measurements);
  const avgInsulin = averageInsulin(measurements);
  const avgFood = averageFood(measurements);
  const avgIntervalHours = averageIntervalHours(measurements);
  const trend = glucoseTrend(measurements);
  const outOfRangeCount = measurements.filter((m) => {
    if (m.glucose === undefined) return false;
    const status = classifyGlucose(m.glucose, rangeMin, rangeMax);
    return status !== null && status !== "dentro";
  }).length;

  return (
    <>
      <DateFilter filters={filters} onChange={setFilters} />
      <div className="mb-6 flex justify-end">
        <ExportButton measurements={sorted} />
      </div>

      {allMeasurements.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-[#6F6B78]">Você ainda não possui medições registradas.</p>
        </div>
      ) : measurements.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-[#6F6B78]">
            Nenhuma medição encontrada para o período/contexto selecionado.
            {hasActiveFilters(filters) && " Tente limpar os filtros."}
          </p>
        </div>
      ) : (
        <>
          {outOfRangeCount > 0 && (
            <div className="mb-8 rounded-2xl bg-[#F2B8C6]/40 p-4 text-sm text-[#252333] shadow-sm">
              {outOfRangeCount === 1
                ? "1 medição fora da faixa de referência configurada."
                : `${outOfRangeCount} medições fora da faixa de referência configurada.`}
            </div>
          )}

          <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
            <MetricCard
              label="Média do período"
              value={avg !== null ? `${avg.toFixed(0)} mg/dL` : "-"}
            />
            <MetricCard
              label="Última medição"
              value={last?.glucose !== undefined ? `${last.glucose} mg/dL` : "-"}
              sub={last ? last.dateTime : "Última medição"}
            />
            <MetricCard label="Menor" value={min !== null ? `${min} mg/dL` : "-"} />
            <MetricCard label="Maior" value={max !== null ? `${max} mg/dL` : "-"} />
            <MetricCard
              label="medições registradas"
              value={String(measurements.length)}
            />
          </section>

          <section className="mb-8 rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Evolução da Glicemia</h2>
            <div className="overflow-x-auto">
              <div className="min-w-[560px]">
                <GlucoseChart
                  measurements={measurements}
                  referenceRangeMin={rangeMin}
                  referenceRangeMax={rangeMax}
                />
              </div>
            </div>
          </section>

          <section className="mb-8 rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Resumo do período</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <MetricCard label="Amplitude glicêmica" value={amplitude !== null ? `${amplitude} mg/dL` : "-"} />
              <MetricCard label="Média de insulina" value={avgInsulin !== null ? `${avgInsulin.toFixed(1)} U` : "-"} />
              <MetricCard label="Média de alimentação" value={avgFood !== null ? `${avgFood.toFixed(0)} g` : "-"} />
              <MetricCard
                label="Intervalo médio entre registros"
                value={avgIntervalHours !== null ? `${avgIntervalHours.toFixed(1)} h` : "-"}
              />
            </div>
            <p className="mt-4 text-sm text-[#6F6B78]">{trend}</p>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold">Histórico de medições</h2>
            {measurements.some((m) => m.isDemo) && (
              <p className="mb-3 text-xs text-[#6F6B78]">
                Registros marcados como <span className="font-semibold">Demonstração</span> são dados
                fictícios de exemplo, não medições reais.
              </p>
            )}

            {/* Mobile: lista de cards empilhados, com alvo de toque cheio para Editar/Excluir. */}
            <ul className="space-y-3 sm:hidden">
              {sorted.map((m) => (
                <li key={m.id} className="rounded-xl border border-[#F8F7FC] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                      {m.dateTime}
                      {m.isDemo && (
                        <span className="rounded-full bg-[#DCEBFA] px-1.5 py-0.5 text-[10px] font-semibold text-[#252333]">
                          Demonstração
                        </span>
                      )}
                    </span>
                    {m.glucose !== undefined && (
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                        {m.glucose} mg/dL
                        {(() => {
                          const status = classifyGlucose(m.glucose, rangeMin, rangeMax);
                          if (!status || status === "dentro") return null;
                          return (
                            <span
                              title={RANGE_STATUS_LABEL[status]}
                              className="inline-flex items-center gap-1 text-xs text-[#6F6B78]"
                            >
                              <span
                                aria-hidden="true"
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: RANGE_STATUS_COLOR[status] }}
                              />
                              {RANGE_STATUS_ICON[status]}
                            </span>
                          );
                        })()}
                      </span>
                    )}
                  </div>
                  <dl className="mb-2 grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-[#6F6B78]">
                    <div className="flex justify-between gap-2">
                      <dt>Insulina</dt>
                      <dd>{m.insulin !== undefined ? `${m.insulin} U` : "-"}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt>Alimentação</dt>
                      <dd>{m.food !== undefined ? `${m.food} g` : "-"}</dd>
                    </div>
                    <div className="col-span-2 flex justify-between gap-2">
                      <dt>Contexto</dt>
                      <dd className="text-right">{m.context ?? "-"}</dd>
                    </div>
                    {m.notes && (
                      <div className="col-span-2 flex justify-between gap-2">
                        <dt>Observação</dt>
                        <dd className="text-right">{m.notes}</dd>
                      </div>
                    )}
                  </dl>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <MeasurementFormModal mode="edit" measurement={m} fullWidth />
                    </div>
                    <div className="flex-1">
                      <DeleteMeasurementButton id={m.id} fullWidth />
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Desktop/tablet: tabela completa. */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-[#6F6B78]">
                    <th className="py-2 pr-4">Data/Hora</th>
                    <th className="py-2 pr-4">Glicemia</th>
                    <th className="py-2 pr-4">Insulina</th>
                    <th className="py-2 pr-4">Alimentação</th>
                    <th className="py-2 pr-4">Contexto</th>
                    <th className="py-2 pr-4">Observação</th>
                    <th className="py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((m) => (
                    <tr key={m.id} className="border-t border-[#F8F7FC]">
                      <td className="py-2 pr-4">
                        <span className="inline-flex items-center gap-1.5">
                          {m.dateTime}
                          {m.isDemo && (
                            <span className="rounded-full bg-[#DCEBFA] px-1.5 py-0.5 text-[10px] font-semibold text-[#252333]">
                              Demonstração
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        {m.glucose !== undefined ? (
                          <span className="inline-flex items-center gap-1.5">
                            {m.glucose} mg/dL
                            {(() => {
                              const status = classifyGlucose(m.glucose, rangeMin, rangeMax);
                              if (!status || status === "dentro") return null;
                              return (
                                <span
                                  title={RANGE_STATUS_LABEL[status]}
                                  className="inline-flex items-center gap-1 text-xs text-[#6F6B78]"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: RANGE_STATUS_COLOR[status] }}
                                  />
                                  {RANGE_STATUS_ICON[status]}
                                </span>
                              );
                            })()}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-2 pr-4">
                        {m.insulin !== undefined ? `${m.insulin} U` : "-"}
                      </td>
                      <td className="py-2 pr-4">
                        {m.food !== undefined ? `${m.food} g` : "-"}
                      </td>
                      <td className="py-2 pr-4">{m.context ?? "-"}</td>
                      <td className="py-2 pr-4">{m.notes ?? "-"}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-3">
                          <MeasurementFormModal mode="edit" measurement={m} />
                          <DeleteMeasurementButton id={m.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}
