import { getMeasurements, getPetProfile } from "@/services/dataService";
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
import { GlucoseChart } from "@/components/GlucoseChart";
import { MeasurementFormModal } from "@/components/MeasurementFormModal";
import { DeleteMeasurementButton } from "@/components/DeleteMeasurementButton";
import { DateFilter } from "@/components/DateFilter";
import { filterMeasurements, parseFiltersFromSearchParams, hasActiveFilters } from "@/utils/filters";
import { ReferenceRangeSettings } from "@/components/ReferenceRangeSettings";
import { PetProfileSettings } from "@/components/PetProfileSettings";
import { classifyGlucose, RANGE_STATUS_LABEL } from "@/utils/glucoseRange";
import { ExportButton } from "@/components/ExportButton";

export const dynamic = "force-dynamic";

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-2xl font-semibold text-[#252333]">{value}</p>
      <p className="text-sm text-[#6F6B78]">{sub ?? label}</p>
    </div>
  );
}

export default async function DashboardPage(props: PageProps<"/">) {
  const resolvedSearchParams = await props.searchParams;
  const filters = parseFiltersFromSearchParams(resolvedSearchParams);

  const [allMeasurements, pet] = await Promise.all([getMeasurements(), getPetProfile()]);
  const measurements = filterMeasurements(allMeasurements, filters);
  const sorted = [...measurements].sort(
    (a, b) => parseDateTime(b.dateTime) - parseDateTime(a.dateTime)
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
  const petName = pet?.name ?? allMeasurements[0]?.petName ?? "seu pet";
  const rangeMin = pet?.referenceRangeMin;
  const rangeMax = pet?.referenceRangeMax;
  const outOfRangeCount = measurements.filter((m) => {
    if (m.glucose === undefined) return false;
    const status = classifyGlucose(m.glucose, rangeMin, rangeMax);
    return status !== null && status !== "dentro";
  }).length;

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 bg-[#F8F7FC] px-4 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">🐶 GlicoPet</h1>
          <p className="text-[#6F6B78]">Monitoramento do {petName}</p>
        </div>
        <MeasurementFormModal mode="create" defaultPetName={petName} />
      </header>

      <DateFilter />
      <div className="mb-6 flex justify-end">
        <ExportButton measurements={sorted} />
      </div>
      <PetProfileSettings pet={pet} />
      <ReferenceRangeSettings min={rangeMin} max={rangeMax} />

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
            <div className="overflow-x-auto">
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
                                  className="h-2 w-2 rounded-full bg-[#F2B8C6]"
                                />
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

      <footer className="mt-8 text-center text-xs text-[#6F6B78]">
        Este aplicativo é uma ferramenta de acompanhamento e registro. Não substitui o
        acompanhamento do médico-veterinário.
      </footer>
    </main>
  );
}
