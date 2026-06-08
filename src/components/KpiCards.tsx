"use client";

import { StoreRow } from "@/types/sheets";
import { formatCurrency, formatPercent } from "@/lib/sheets";

interface Props {
  stores: StoreRow[];
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
  const totalVenda = stores.reduce((s, r) => s + r.venda, 0);
  const totalMeta = stores.reduce((s, r) => s + r.meta, 0);
  const atingimento = totalMeta > 0 ? (totalVenda / totalMeta) * 100 : 0;
  const acimaMeta = stores.filter((r) => r.desvioMeta > 0).length;
  const abaixoMeta = stores.filter((r) => r.meta > 0 && r.desvioMeta <= 0).length;
  const avgTicket =
    stores.filter((r) => r.ticketMedio > 0).reduce((s, r) => s + r.ticketMedio, 0) /
    (stores.filter((r) => r.ticketMedio > 0).length || 1);

  const totalFatMai = stores.reduce((s, r) => s + r.fatMai, 0);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      <Card
        title="Fat. Acumulado (Mai)"
        value={formatCurrency(totalFatMai)}
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
      <Card
        title="Lojas vs Meta"
        value={`${acimaMeta} / ${acimaMeta + abaixoMeta}`}
        sub={`${abaixoMeta} abaixo da meta`}
        color="border-gray-200"
      />
    </div>
  );
}
