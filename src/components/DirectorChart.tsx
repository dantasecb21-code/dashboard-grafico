"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { StoreRow } from "@/types/sheets";
import { formatCurrency } from "@/lib/sheets";

interface Props {
  stores: StoreRow[];
}

const COLORS = ["#3b82f6", "#8b5cf6", "#22c55e", "#f97316", "#ef4444"];

function firstName(name: string) {
  return name.split(" ")[0];
}

export default function DirectorChart({ stores }: Props) {
  const map = new Map<string, { fat: number; venda: number; meta: number; lojas: number }>();

  for (const s of stores) {
    const key = s.diretorDivisional.trim() || "Sem Diretor";
    const cur = map.get(key) ?? { fat: 0, venda: 0, meta: 0, lojas: 0 };
    map.set(key, {
      fat: cur.fat + s.fatMai,
      venda: cur.venda + s.venda,
      meta: cur.meta + s.meta,
      lojas: cur.lojas + 1,
    });
  }

  const data = Array.from(map.entries())
    .sort((a, b) => b[1].fat - a[1].fat)
    .map(([name, v]) => ({
      name: firstName(name),
      fullName: name,
      fat: v.fat,
      venda: v.venda,
      meta: v.meta,
      lojas: v.lojas,
      ating: v.meta > 0 ? Math.round((v.venda / v.meta) * 100) : 0,
    }));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600">
        Faturamento por Diretor Divisional
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={(v) => `R$${(v / 1e6).toFixed(0)}M`} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(v, name) => [
              formatCurrency(Number(v)),
              name === "fat" ? "Fat. Acumulado" : "Venda Período",
            ]}
            labelFormatter={(label) => {
              const item = data.find((d) => d.name === label);
              return item ? `${item.fullName} (${item.lojas} lojas)` : label;
            }}
            contentStyle={{ fontSize: 12 }}
          />
          <Legend formatter={(v) => (v === "fat" ? "Fat. Acumulado" : "Venda Período")} />
          <Bar dataKey="fat" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
          <Bar dataKey="venda" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
