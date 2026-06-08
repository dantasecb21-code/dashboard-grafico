"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { StoreRow } from "@/types/sheets";
import { formatCurrency } from "@/lib/sheets";

interface Props {
  stores: StoreRow[];
  topN?: number;
}

const COLORS = [
  "#3b82f6","#6366f1","#8b5cf6","#a855f7","#ec4899",
  "#ef4444","#f97316","#eab308","#22c55e","#14b8a6",
  "#06b6d4","#0ea5e9","#64748b","#6b7280","#9ca3af",
];

export default function RevenueChart({ stores, topN = 15 }: Props) {
  const sorted = [...stores]
    .filter((s) => s.fatMai > 0)
    .sort((a, b) => b.fatMai - a.fatMai)
    .slice(0, topN);

  const data = sorted.map((s) => ({
    name: s.nomeLoja.replace(" (Projeto Olimpo)", "").slice(0, 22),
    fat: s.fatMai,
    meta: s.meta,
  }));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600">
        Top {topN} Lojas — Faturamento Acumulado (Mai)
      </h2>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 32, top: 4, bottom: 4 }}>
          <XAxis
            type="number"
            tickFormatter={(v) => `R$${(v / 1e6).toFixed(1)}M`}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={160}
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            formatter={(v) => [formatCurrency(Number(v)), "Faturamento"]}
            contentStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="fat" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
