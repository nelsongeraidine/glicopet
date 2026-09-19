"use server";

import { revalidatePath } from "next/cache";
import { addMeasurement, updateMeasurement, deleteMeasurement, updatePetProfile } from "@/services/dataService";
import type { NewMeasurement } from "@/types/measurement";

function parseOptionalNumber(value: FormDataEntryValue | null): number | undefined {
  if (value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

/** Converte o valor de <input type="date"> (YYYY-MM-DD) para o padrão DD/MM/YYYY já usado na planilha. */
function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function measurementFromFormData(formData: FormData): NewMeasurement {
  const petName = String(formData.get("petName") ?? "").trim();
  const isoDate = String(formData.get("date") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();

  if (!petName || !isoDate || !time) {
    throw new Error("Pet, data e hora são obrigatórios.");
  }

  const date = formatDate(isoDate);
  const context = String(formData.get("context") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  return {
    petName,
    date,
    time,
    dateTime: `${date} ${time}`,
    glucose: parseOptionalNumber(formData.get("glucose")),
    insulin: parseOptionalNumber(formData.get("insulin")),
    food: parseOptionalNumber(formData.get("food")),
    context: context || undefined,
    notes: notes || undefined,
  };
}

export async function createMeasurement(formData: FormData): Promise<void> {
  await addMeasurement(measurementFromFormData(formData));
  revalidatePath("/");
}

export async function updateMeasurementAction(id: string, formData: FormData): Promise<void> {
  await updateMeasurement(id, measurementFromFormData(formData));
  revalidatePath("/");
}

export async function deleteMeasurementAction(id: string): Promise<void> {
  await deleteMeasurement(id);
  revalidatePath("/");
}

export async function updateReferenceRangeAction(formData: FormData): Promise<void> {
  const min = parseOptionalNumber(formData.get("referenceRangeMin"));
  const max = parseOptionalNumber(formData.get("referenceRangeMax"));

  if (min === undefined || max === undefined) {
    throw new Error("Informe os dois limites (inferior e superior).");
  }
  if (min >= max) {
    throw new Error("O limite inferior deve ser menor que o limite superior.");
  }

  await updatePetProfile({ referenceRangeMin: min, referenceRangeMax: max });
  revalidatePath("/");
}

export async function updatePetProfileAction(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  const photoUrl = String(formData.get("photoUrl") ?? "").trim();
  const birthDateOrAge = String(formData.get("birthDateOrAge") ?? "").trim();
  const sex = String(formData.get("sex") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  await updatePetProfile({
    name: name || undefined,
    photoUrl: photoUrl || undefined,
    weightKg: parseOptionalNumber(formData.get("weightKg")),
    birthDateOrAge: birthDateOrAge || undefined,
    sex: sex || undefined,
    notes: notes || undefined,
  });
  revalidatePath("/");
}
