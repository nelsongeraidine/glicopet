import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import type { Measurement, NewMeasurement } from "@/types/measurement";
import type { Pet } from "@/types/pet";

const SHEET_TITLE = "Medições";
const PROFILE_SHEET_TITLE = "Perfil";

const HEADERS = [
  "ID",
  "Nome do Pet",
  "Data",
  "Hora",
  "Data/Hora",
  "Glicemia (mg/dL)",
  "Insulina (U)",
  "Alimentação (g)",
  "Contexto",
  "Observação",
  "Demonstração",
] as const;

const PROFILE_HEADERS = [
  "Nome",
  "Foto",
  "Peso (kg)",
  "Nascimento/Idade",
  "Sexo",
  "Observações",
  "Faixa Mínima (mg/dL)",
  "Faixa Máxima (mg/dL)",
] as const;

let cachedDoc: GoogleSpreadsheet | null = null;

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error(
      "Credenciais do Google Sheets ausentes. Configure GOOGLE_SERVICE_ACCOUNT_EMAIL e GOOGLE_PRIVATE_KEY em .env.local."
    );
  }

  return new JWT({
    email,
    key: rawKey.replace(/\\n/g, "\n"),
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file",
    ],
  });
}

async function getDoc(): Promise<GoogleSpreadsheet> {
  if (cachedDoc) return cachedDoc;

  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID ausente. Configure em .env.local.");
  }

  const doc = new GoogleSpreadsheet(sheetId, getAuth());
  await doc.loadInfo();
  cachedDoc = doc;
  return doc;
}

/**
 * Retorna a aba pelo título, criando-a com o cabeçalho atual se não existir. Se já existir
 * mas faltar alguma coluna (schema evoluiu depois da aba criada), completa o cabeçalho sem
 * apagar dados existentes.
 */
async function getOrCreateSheet(
  title: string,
  headers: readonly string[]
): Promise<GoogleSpreadsheetWorksheet> {
  const doc = await getDoc();
  const existing = doc.sheetsByTitle[title];
  if (!existing) {
    return doc.addSheet({ title, headerValues: [...headers] });
  }

  await existing.loadHeaderRow();
  const missingHeaders = headers.filter((h) => !existing.headerValues.includes(h));
  if (missingHeaders.length > 0) {
    await existing.setHeaderRow([...existing.headerValues, ...missingHeaders]);
  }

  return existing;
}

async function getMeasurementsSheet(): Promise<GoogleSpreadsheetWorksheet> {
  return getOrCreateSheet(SHEET_TITLE, HEADERS);
}

async function getProfileSheet(): Promise<GoogleSpreadsheetWorksheet> {
  return getOrCreateSheet(PROFILE_SHEET_TITLE, PROFILE_HEADERS);
}

function toNumberOrUndefined(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  // A planilha usa localização pt-BR e formata decimais com vírgula (ex: "2,9");
  // Number() só entende ponto, então normaliza antes de converter.
  const normalized = typeof value === "string" ? value.replace(",", ".") : value;
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function rowToMeasurement(row: Record<string, unknown>): Measurement {
  return {
    id: String(row["ID"] ?? ""),
    petName: String(row["Nome do Pet"] ?? ""),
    date: String(row["Data"] ?? ""),
    time: String(row["Hora"] ?? ""),
    dateTime: String(row["Data/Hora"] ?? ""),
    glucose: toNumberOrUndefined(row["Glicemia (mg/dL)"]),
    insulin: toNumberOrUndefined(row["Insulina (U)"]),
    food: toNumberOrUndefined(row["Alimentação (g)"]),
    context: row["Contexto"] ? String(row["Contexto"]) : undefined,
    notes: row["Observação"] ? String(row["Observação"]) : undefined,
    isDemo: row["Demonstração"] === "Sim",
  };
}

function measurementToRow(measurement: Measurement): Record<string, string | number> {
  return {
    ID: measurement.id,
    "Nome do Pet": measurement.petName,
    Data: measurement.date,
    Hora: measurement.time,
    "Data/Hora": measurement.dateTime,
    "Glicemia (mg/dL)": measurement.glucose ?? "",
    "Insulina (U)": measurement.insulin ?? "",
    "Alimentação (g)": measurement.food ?? "",
    Contexto: measurement.context ?? "",
    Observação: measurement.notes ?? "",
    Demonstração: measurement.isDemo ? "Sim" : "Não",
  };
}

export async function getMeasurements(): Promise<Measurement[]> {
  const sheet = await getMeasurementsSheet();
  const rows = await sheet.getRows();
  return rows.map((row) => rowToMeasurement(row.toObject()));
}

export async function addMeasurement(data: NewMeasurement): Promise<Measurement> {
  const sheet = await getMeasurementsSheet();
  const existingRows = await sheet.getRows();
  // Sheets converte strings puramente numéricas para número, descartando zero à esquerda;
  // não adianta usar padStart aqui.
  const nextId = String(existingRows.length + 1);
  const measurement: Measurement = { id: nextId, ...data };
  await sheet.addRow(measurementToRow(measurement));
  return measurement;
}

export async function updateMeasurement(
  id: string,
  data: Partial<NewMeasurement>
): Promise<Measurement> {
  const sheet = await getMeasurementsSheet();
  const rows = await sheet.getRows();
  const row = rows.find((r) => String(r.get("ID")) === id);

  if (!row) {
    throw new Error(`Medição com ID ${id} não encontrada.`);
  }

  const current = rowToMeasurement(row.toObject());
  const updated: Measurement = { ...current, ...data, id };
  row.assign(measurementToRow(updated));
  await row.save();
  return updated;
}

export async function deleteMeasurement(id: string): Promise<void> {
  const sheet = await getMeasurementsSheet();
  const rows = await sheet.getRows();
  const row = rows.find((r) => String(r.get("ID")) === id);

  if (!row) {
    throw new Error(`Medição com ID ${id} não encontrada.`);
  }

  await row.delete();
}

function petFromRow(row: Record<string, unknown>): Pet {
  const name = row["Nome"];
  return {
    name: name ? String(name) : undefined,
    photoUrl: row["Foto"] ? String(row["Foto"]) : undefined,
    weightKg: toNumberOrUndefined(row["Peso (kg)"]),
    birthDateOrAge: row["Nascimento/Idade"] ? String(row["Nascimento/Idade"]) : undefined,
    sex: row["Sexo"] ? String(row["Sexo"]) : undefined,
    notes: row["Observações"] ? String(row["Observações"]) : undefined,
    referenceRangeMin: toNumberOrUndefined(row["Faixa Mínima (mg/dL)"]),
    referenceRangeMax: toNumberOrUndefined(row["Faixa Máxima (mg/dL)"]),
  };
}

export async function getPetProfile(): Promise<Pet | null> {
  const sheet = await getProfileSheet();
  const rows = await sheet.getRows();
  if (rows.length === 0) return null;
  return petFromRow(rows[0].toObject());
}

export async function updatePetProfile(data: Partial<Pet>): Promise<Pet> {
  const sheet = await getProfileSheet();
  const rows = await sheet.getRows();
  const current = rows[0]?.toObject() ?? {};

  // Usa "!== undefined" (não "??"): campo ausente em `data` preserva o valor atual,
  // mas string vazia explícita ("") é um pedido de limpar o campo e deve prevalecer.
  function pick<T>(newVal: T | undefined, currentVal: unknown): T | string {
    return newVal !== undefined ? newVal : ((currentVal as T) ?? "");
  }

  const merged: Record<string, string | number> = {
    Nome: pick(data.name, current["Nome"]),
    Foto: pick(data.photoUrl, current["Foto"]),
    "Peso (kg)": pick(data.weightKg, current["Peso (kg)"]),
    "Nascimento/Idade": pick(data.birthDateOrAge, current["Nascimento/Idade"]),
    Sexo: pick(data.sex, current["Sexo"]),
    Observações: pick(data.notes, current["Observações"]),
    "Faixa Mínima (mg/dL)": pick(data.referenceRangeMin, current["Faixa Mínima (mg/dL)"]),
    "Faixa Máxima (mg/dL)": pick(data.referenceRangeMax, current["Faixa Máxima (mg/dL)"]),
  };

  if (rows[0]) {
    rows[0].assign(merged);
    await rows[0].save();
  } else {
    await sheet.addRow(merged);
  }

  return petFromRow(merged);
}
