import { StoreRow, SheetResponse, DashboardData } from "@/types/sheets";

function parseCurrency(val: unknown): number {
  if (val === null || val === undefined || val === "") return 0;
  const s = String(val)
    .replace(/R\$\s?/g, "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();
  if (s === "-" || s === "" || s.startsWith("#")) return 0;
  return parseFloat(s) || 0;
}

function parsePercent(val: unknown): number {
  if (val === null || val === undefined || val === "") return 0;
  const s = String(val).replace("%", "").replace(",", ".").trim();
  if (s === "-" || s === "" || s.startsWith("#")) return 0;
  return parseFloat(s) || 0;
}

function parseRow(row: (string | number)[]): StoreRow {
  return {
    diretorDivisional: String(row[0] ?? "").trim(),
    dirRegional: String(row[1] ?? "").trim(),
    gerenteRegional: String(row[2] ?? "").trim(),
    codigoLoja: String(row[3] ?? "").trim(),
    nomeLoja: String(row[4] ?? "").trim(),
    cidade: String(row[5] ?? "").trim(),
    uf: String(row[6] ?? "").trim(),
    fatJan: parseCurrency(row[7]),
    fatFev: parseCurrency(row[8]),
    desFev: parsePercent(row[9]),
    fatMar: parseCurrency(row[10]),
    desMar: parsePercent(row[11]),
    fatAbr: parseCurrency(row[12]),
    desAbr: parsePercent(row[13]),
    fatMai: parseCurrency(row[14]),
    desMai: parsePercent(row[15]),
    meta: parseCurrency(row[16]),
    venda: parseCurrency(row[17]),
    desvioMeta: parseCurrency(row[18]),
    desempenho: parsePercent(row[19]),
    participacao: parsePercent(row[20]),
    ticketMedio: parseCurrency(row[21]),
    cancelamento: parsePercent(row[22]),
    slaPreparo: parsePercent(row[23]),
    nsu: parsePercent(row[24]),
    rupturaItem: parsePercent(row[25]),
    slaEntrega: parsePercent(row[26]),
    tempoOn: parsePercent(row[27]),
  };
}

export async function fetchDashboardData(sheetName?: string): Promise<DashboardData> {
  const base =
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_APPS_SCRIPT_URL
      : process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? process.env.APPS_SCRIPT_URL;

  if (!base) {
    throw new Error("NEXT_PUBLIC_APPS_SCRIPT_URL nao configurada. Veja .env.local.example");
  }

  const url = sheetName ? `${base}?sheet=${encodeURIComponent(sheetName)}` : base;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Erro ao buscar dados: ${res.status}`);
  }

  const json: SheetResponse = await res.json();

  const stores = (json.rows ?? [])
    .filter((row) => row.length >= 8 && String(row[4] ?? "").trim() !== "")
    .map(parseRow);

  return {
    stores,
    sheets: json.sheets ?? [],
    updatedAt: json.updatedAt ?? new Date().toISOString(),
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
