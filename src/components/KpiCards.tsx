"use client";

import { StoreRow } from "@/types/sheets";
import { formatCurrency, formatPercent } from "@/lib/sheets";

interface Props {
  stores: StoreRow[];
}

function avg(stores: StoreRow[], key: keyof StoreRow): number {
  const vals = stores.map((s) => s[key] as number).filter((v) => v > 0);
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function Card({
  title,
  value,
  sub,
  color,
}: {
  title: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className={`rounded-xl border ${color} bg-white p-5 shadow-sm`}>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export default function KpiCards({ stores }: Props) {
  const totalFat = stores.reduce((s, r) => s + r.fatMai, 0);
  const totalVenda = stores.reduce((s, r) => s + r.venda, 0);
  const totalMeta = stores.reduce((s, r) => s + r.meta, 0);
  const atingimento = totalMeta > 0 ? (totalVenda / totalMeta) * 100 : 0;
  const avgTicket = avg(stores, "ticketMedio");

  const avgCancelamento = avg(stores, "cancelamento");
  const avgRuptura = avg(stores, "rupturaItem");
  const avgTempoOn = avg(stores, "tempoOn");
  const avgNsu = avg(stores, "nsu");
  const avgSsla = avg(stores, "slaEntrega");

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 pl-1">
          Faturamento
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <Card
            title="Fat. Acumulado (Mai)"
            value={formatCurrency(totalFat)}
            sub="Faturamento acumulado"
            color="border-blue-200"
          />
          <Card
            title="Venda Período"
            value={formatCurrency(totalVenda)}
            sub="Soma de todas as lojas"
            color="border-indigo-200"
          />
          <Card
            title="Meta Período"
            value={formatCurrency(totalMeta)}
            sub="Meta consolidada"
            color="border-purple-200"
          />
          <Card
            title="Atingimento Meta"
            value={formatPercent(atingimento)}
            sub={atingimento >= 100 ? "✓ Acima da meta" : "Abaixo da meta"}
            color={atingimento >= 100 ? "border-green-300" : "border-red-300"}
          />
          <Card
            title="Ticket Médio"
            value={formatCurrency(avgTicket)}
            sub="Média das lojas"
            color="border-yellow-200"
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 pl-1">
          KPIs Operacionais
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <Card
            title="Cancelamento Médio"
            value={formatPercent(avgCancelamento)}
            sub={avgCancelamento <= 5 ? "✓ Dentro da meta (≤5%)" : "Acima da meta (5%)"}
            color={avgCancelamento <= 5 ? "border-green-300" : "border-red-300"}
          />
          <Card
            title="Ruptura Médio"
            value={formatPercent(avgRuptura)}
            sub={avgRuptura <= 5 ? "✓ Dentro da meta (≤5%)" : "Acima da meta (5%)"}
            color={avgRuptura <= 5 ? "border-green-300" : "border-red-300"}
          />
          <Card
            title="Tempo ON Médio"
            value={formatPercent(avgTempoOn)}
            sub={avgTempoOn >= 95 ? "✓ Dentro da meta (≥95%)" : "Abaixo da meta (95%)"}
            color={avgTempoOn >= 95 ? "border-green-300" : "border-red-300"}
          />
          <Card
            title="NSU Médio"
            value={formatPercent(avgNsu)}
            sub={avgNsu <= 12 ? "✓ Dentro da meta (≤12%)" : "Acima da meta (12%)"}
            color={avgNsu <= 12 ? "border-green-300" : "border-red-300"}
          />
          <Card
            title="SSLA (SLA Entrega)"
            value={formatPercent(avgSsla)}
            sub={avgSsla >= 85 ? "✓ Dentro da meta (≥85%)" : "Abaixo da meta (85%)"}
            color={avgSsla >= 85 ? "border-green-300" : "border-red-300"}
          />
        </div>
      </div>
    </div>
  );
}
