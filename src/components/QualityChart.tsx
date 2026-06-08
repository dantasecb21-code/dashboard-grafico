"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ReferenceLine,
} from "recharts";
import { StoreRow } from "@/types/sheets";

interface Props {
  stores: StoreRow[];
}

const METRICS = [
  { key: "slaPreparo", label: "SLA Preparo", target: 85, lowerIsBetter: false },
  { key: "slaEntrega", label: "SLA Entrega", target: 85, lowerIsBetter: false },
  { key: "tempoOn", label: "Tempo Online", target: 95, lowerIsBetter: false },
  { key: "cancelamento", label: "Cancelamento", target: 5, lowerIsBetter: true },
  { key: "nsu", label: "NSU", target: 12, lowerIsBetter: true },
  { key: "rupturaItem", label: "Ruptura Item", target: 5, lowerIsBetter: true },
];

function avg(stores: StoreRow[], key: keyof StoreRow): number {
  const vals = stores.map((s) => s[key] as number).filter((v) => v > 0);
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export default function QualityChart({ stores }: Props) {
  const data = METRICS.map((m) => {
    const average = avg(stores, m.key as keyof StoreRow);
    const ok = m.lowerIsBetter ? average <= m.target : average >= m.target;
    return {
      label: m.label,
      media: parseFloat(average.toFixed(1)),
      meta: m.target,
      ok,
      lowerIsBetter: m.lowerIsBetter,
    };
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600">
        Indicadores de Qualidade — Média das Lojas
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis unit="%" tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(v, name) => [
              `${Number(v)}%`,
              name === "media" ? "Média Lojas" : "Meta",
            ]}
            contentStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="media" radius={[4, 4, 0, 0]} name="media">
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.ok ? "#22c55e" : "#ef4444"} />
            ))}
          </Bar>
          <Bar dataKey="meta" fill="#94a3b8" radius={[4, 4, 0, 0]} name="meta" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 flex gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" /> Dentro da meta
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" /> Fora da meta
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> Meta alvo
        </span>
      </div>
    </div>
  );
}
