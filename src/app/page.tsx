import { getMeasurements, getPetProfile } from "@/services/dataService";
import { MeasurementFormModal } from "@/components/MeasurementFormModal";
import { ReferenceRangeSettings } from "@/components/ReferenceRangeSettings";
import { PetProfileSettings } from "@/components/PetProfileSettings";
import { Dashboard } from "@/components/Dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [allMeasurements, pet] = await Promise.all([getMeasurements(), getPetProfile()]);

  const petName = pet?.name ?? allMeasurements[0]?.petName ?? "seu pet";
  const rangeMin = pet?.referenceRangeMin;
  const rangeMax = pet?.referenceRangeMax;

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 bg-[#F8F7FC] px-4 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            <span aria-hidden="true">🐶</span> GlicoPet
          </h1>
          <p className="text-[#6F6B78]">Monitoramento do {petName}</p>
        </div>
        <MeasurementFormModal mode="create" defaultPetName={petName} />
      </header>

      <PetProfileSettings pet={pet} />
      <ReferenceRangeSettings min={rangeMin} max={rangeMax} />

      <Dashboard allMeasurements={allMeasurements} rangeMin={rangeMin} rangeMax={rangeMax} />

      <footer className="mt-8 text-center text-xs text-[#6F6B78]">
        Este aplicativo é uma ferramenta de acompanhamento e registro. Não substitui o
        acompanhamento do médico-veterinário.
      </footer>
    </main>
  );
}
