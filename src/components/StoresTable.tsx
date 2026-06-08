"use client";

import { useState, useMemo } from "react";
import { StoreRow } from "@/types/sheets";
import { formatCurrency, formatPercent } from "@/lib/sheets";

interface Props {
  stores: StoreRow[];
}

type SortKey = keyof StoreRow;

function badge(value: number, target: number, lowerIsBetter = false) {
  const ok = lowerIsBetter ? value <= target : value >= target;
  if (value === 0) return <span className="text-gray-300">—</span>;
  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${
        ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {formatPercent(value)}
    </span>
  );
}

export default function StoresTable({ stores }: Props) {
  const [search, setSearch] = useState("");
  const [dirFilter, setDirFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("fatMai");
  const [sortAsc, setSortAsc] = useState(false);

  const directors = useMemo(
    () => Array.from(new Set(stores.map((s) => s.diretorDivisional).filter(Boolean))).sort(),
    [stores]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return stores.filter((s) => {
      const matchSearch =
        !q ||
        s.nomeLoja.toLowerCase().includes(q) ||
        s.cidade.toLowerCase().includes(q) ||
        s.uf.toLowerCase().includes(q) ||
        s.codigoLoja.includes(q) ||
        s.gerenteRegional.toLowerCase().includes(q);
      const matchDir = !dirFilter || s.diretorDivisional === dirFilter;
      return matchSearch && matchDir;
    });
  }, [stores, search, dirFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortAsc ? av - bv : bv - av;
      }
      return sortAsc
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [filtered, sortKey, sortAsc]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  }

  function Th({ label, k }: { label: string; k: SortKey }) {
    return (
      <th
        onClick={() => handleSort(k)}
        className="cursor-pointer select-none whitespace-nowrap px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500 hover:text-gray-800"
      >
        {label}
        {sortKey === k && <span className="ml-1">{sortAsc ? "↑" : "↓"}</span>}
      </th>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mr-2">
          Lojas ({sorted.length})
        </h2>
        <input
          type="text"
          placeholder="Buscar loja, cidade, UF, gerente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 w-64"
        />
        <select
          value={dirFilter}
          onChange={(e) => setDirFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-400"
        >
          <option value="">Todos os Diretores</option>
          {directors.map((d) => (
            <option key={d} value={d}>{d.split(" ")[0]}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <Th label="#" k="codigoLoja" />
              <Th label="Loja" k="nomeLoja" />
              <Th label="Cidade/UF" k="cidade" />
              <Th label="Gerente" k="gerenteRegional" />
              <Th label="Fat. Mai" k="fatMai" />
              <Th label="Meta" k="meta" />
              <Th label="Venda" k="venda" />
              <Th label="Desvio" k="desvioMeta" />
              <Th label="Ticket" k="ticketMedio" />
              <Th label="Cancelam." k="cancelamento" />
              <Th label="Ruptura" k="rupturaItem" />
              <Th label="NSU" k="nsu" />
              <Th label="SLA Prep." k="slaPreparo" />
              <Th label="SSLA Entr." k="slaEntrega" />
              <Th label="Tempo On" k="tempoOn" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((s) => (
              <tr key={s.codigoLoja + s.nomeLoja} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2 font-mono text-xs text-gray-400">{s.codigoLoja}</td>
                <td className="px-3 py-2 font-medium text-gray-800 max-w-[200px] truncate">
                  {s.nomeLoja.replace(" (Projeto Olimpo)", "")}
                </td>
                <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                  {s.cidade ? `${s.cidade.slice(0, 12)} / ${s.uf}` : s.uf}
                </td>
                <td className="px-3 py-2 text-gray-500 max-w-[140px] truncate">
                  {s.gerenteRegional.split(" ").slice(0, 2).join(" ")}
                </td>
                <td className="px-3 py-2 font-medium text-gray-800 whitespace-nowrap">
                  {s.fatMai > 0 ? formatCurrency(s.fatMai) : "—"}
                </td>
                <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                  {s.meta > 0 ? formatCurrency(s.meta) : "—"}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {s.venda > 0 ? (
                    <span className={s.desvioMeta >= 0 ? "text-green-700 font-medium" : "text-red-600 font-medium"}>
                      {formatCurrency(s.venda)}
                    </span>
                  ) : "—"}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {s.meta > 0 ? (
                    <span className={`text-xs font-medium ${s.desvioMeta >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {s.desvioMeta >= 0 ? "+" : ""}{formatCurrency(s.desvioMeta)}
                    </span>
                  ) : "—"}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                  {s.ticketMedio > 0 ? formatCurrency(s.ticketMedio) : "—"}
                </td>
                <td className="px-3 py-2">{badge(s.cancelamento, 5, true)}</td>
                <td className="px-3 py-2">{badge(s.rupturaItem, 5, true)}</td>
                <td className="px-3 py-2">{badge(s.nsu, 12, true)}</td>
                <td className="px-3 py-2">{badge(s.slaPreparo, 85)}</td>
                <td className="px-3 py-2">{badge(s.slaEntrega, 85)}</td>
                <td className="px-3 py-2">{badge(s.tempoOn, 95)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">Nenhuma loja encontrada.</p>
        )}
      </div>
    </div>
  );
}
