"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { StoreRow } from "@/types/sheets";
import { formatPercent } from "@/lib/sheets";

interface Props {
  stores: StoreRow[];
  topN?: number;
}

type View = "loja" | "gerente" | "diretor";

function groupByKey(stores: StoreRow[], key: keyof StoreRow): { name: string; cancelamento: number }[] {
  const map = new Map<string, number[]>();
  for (const s of stores) {
    if (s.cancelamento <= 0) continue;
    const k = String(s[key] || "N/A").split(" ").slice(0, 3).join(" ");
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(s.cancelamento);
  }
  return Array.from(map.entries())
    .map(([name, vals]) => ({
      name: name.slice(0, 20),
      cancelamento: parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)),
    }))
    .sort((a, b) => b.cancelamento - a.cancelamento);
}

export default function CancellationChart({ stores, topN = 20 }: Props) {
  const [view, setView] = useState<View>("loja");

  const byLoja = [...stores]
    .filter((s) => s.cancelamento > 0)
    .sort((a, b) => b.cancelamento - a.cancelamento)
    .slice(0, topN)
    .map((s) => ({
      name: s.nomeLoja.replace(" (Projeto Olimpo)", "").slice(0, 20),
      cancelamento: parseFloat(s.cancelamento.toFixed(1)),
      ok: s.cancelamento <= 5,
    }));

  const byGerente = groupByKey(stores, "gerenteRegional")
    .slice(0, topN)
    .map((d) => ({ ...d, ok: d.cancelamento <= 5 }));

  const byDiretor = groupByKey(stores, "diretorDivisional")
    .slice(0, topN)
    .map((d) => ({ ...d, ok: d.cancelamento <= 5 }));

  const data = view === "loja" ? byLoja : view === "gerente" ? byGerente : byDiretor;
  const chartHeight = Math.max(200, data.length * 28);

  const tabs: { key: View; label: string }[] = [
    { key: "loja", label: "Por Loja" },
    { key: "gerente", label: "Por Entregadores / Gerente" },
    { key: "diretor", label: "Por Diretor" },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
            Cancelamento — Ranking
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Meta: ≤ 5% · Verde = dentro da meta</p>
        </div>
        <div className="flex gap-1 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setView(t.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                view === t.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 40, top: 4, bottom: 4 }}>
          <XAxis type="number" unit="%" tick={{ fontSize: 11 }} domain={[0, "dataMax + 2"]} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={150} />
          <Tooltip
            formatter={(v) => [`${Number(v)}%`, "Cancelamento Médio"]}
            contentStyle={{ fontSize: 12 }}
          />
          <ReferenceLine
            x={5}
            stroke="#ef4444"
            strokeDasharray="4 2"
            label={{ value: "Meta 5%", fill: "#ef4444", fontSize: 10, position: "top" }}
          />
          <Bar dataKey="cancelamento" radius={[0, 4, 4, 0]} label={{ position: "right", formatter: (v: unknown) => `${v}%`, fontSize: 10 }}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.ok ? "#22c55e" : "#ef4444"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
