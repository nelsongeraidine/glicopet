// Etapas 1 e 2 do CLAUDE.md: cria a estrutura de colunas na planilha e insere os dados de demonstração (PRD seção 33).
// Uso: node --env-file=.env.local scripts/seed.mjs

import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

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
];

const DEMO_MEASUREMENTS = [
  { petName: "Thor", date: "06/07/2026", time: "07:30", dateTime: "06/07/2026 07:30", glucose: 135, insulin: 2, food: 80 },
  { petName: "Thor", date: "06/07/2026", time: "18:20", dateTime: "06/07/2026 18:20", glucose: 138, insulin: 2, food: 80 },
  { petName: "Thor", date: "07/07/2026", time: "07:45", dateTime: "07/07/2026 07:45", glucose: 128, insulin: 2, food: 80 },
];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Variável de ambiente ${name} não configurada.`);
  return value;
}

async function main() {
  const email = requireEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const key = requireEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");
  const sheetId = requireEnv("GOOGLE_SHEET_ID");

  const auth = new JWT({
    email,
    key,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file",
    ],
  });

  const doc = new GoogleSpreadsheet(sheetId, auth);
  await doc.loadInfo();
  console.log(`Conectado à planilha: ${doc.title}`);

  let sheet = doc.sheetsByTitle["Medições"];
  if (!sheet) {
    sheet = await doc.addSheet({ title: "Medições", headerValues: HEADERS });
    console.log('Aba "Medições" criada com o cabeçalho.');
  } else {
    console.log('Aba "Medições" já existia, reaproveitando.');
  }

  const existingRows = await sheet.getRows();
  if (existingRows.length > 0) {
    console.log(`Já existem ${existingRows.length} registros. Nenhum dado de demonstração foi inserido (evita duplicar).`);
    return;
  }

  const rows = DEMO_MEASUREMENTS.map((m, index) => ({
    ID: String(index + 1),
    "Nome do Pet": m.petName,
    Data: m.date,
    Hora: m.time,
    "Data/Hora": m.dateTime,
    "Glicemia (mg/dL)": m.glucose,
    "Insulina (U)": m.insulin,
    "Alimentação (g)": m.food,
    Contexto: "",
    Observação: "",
    Demonstração: "Sim",
  }));

  await sheet.addRows(rows);
  console.log(`${rows.length} registros de demonstração inseridos.`);
}

main().catch((err) => {
  console.error("Falha ao executar o seed:", err.message);
  process.exit(1);
});
