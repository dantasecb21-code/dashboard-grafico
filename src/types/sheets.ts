export interface StoreRow {
  diretorDivisional: string;
  dirRegional: string;
  gerenteRegional: string;
  codigoLoja: string;
  nomeLoja: string;
  cidade: string;
  uf: string;
  fatJan: number;
  fatFev: number;
  desFev: number;
  fatMar: number;
  desMar: number;
  fatAbr: number;
  desAbr: number;
  fatMai: number;
  desMai: number;
  meta: number;
  venda: number;
  desvioMeta: number;
  desempenho: number;
  participacao: number;
  ticketMedio: number;
  cancelamento: number;
  slaPreparo: number;
  nsu: number;
  rupturaItem: number;
  slaEntrega: number;
  tempoOn: number;
}

export interface SheetResponse {
  sheet: string;
  sheets: string[];
  headers: string[];
  rows: (string | number)[][];
  updatedAt: string;
}

export interface DashboardData {
  stores: StoreRow[];
  sheets: string[];
  updatedAt: string;
}
