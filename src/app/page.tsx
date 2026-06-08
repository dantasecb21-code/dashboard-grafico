"use client";

import { useEffect, useState } from "react";
import { fetchDashboardData } from "@/lib/sheets";
import { DashboardData } from "@/types/sheets";
import KpiCards from "@/components/KpiCards";
import RevenueChart from "@/components/RevenueChart";
import DirectorChart from "@/components/DirectorChart";
import QualityChart from "@/components/QualityChart";
import StoresTable from "@/components/StoresTable";

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData()
      .then(setData)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500" />
          <p className="text-sm">Carregando dados da planilha...</p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-md rounded-xl border border-amber-200 bg-amber-50 p-8 text-center shadow">
          <div className="text-4xl mb-3">⚙️</div>
          <h1 className="text-lg font-bold text-amber-800 mb-2">Configuração necessária</h1>
          <p className="text-sm text-amber-700 mb-4">
            Defina a variável{" "}
            <code className="rounded bg-amber-100 px-1 font-mono">NEXT_PUBLIC_APPS_SCRIPT_URL</code>{" "}
            no arquivo{" "}
            <code className="rounded bg-amber-100 px-1 font-mono">.env.local</code> com a URL do seu
            Google Apps Script publicado como Web App.
          </p>
          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded p-2 mt-2 font-mono">{error}</p>
          )}
          <p className="text-xs text-amber-600 mt-3">
            Veja o arquivo <strong>appscript/Code.gs</strong> para instruções de deploy.
          </p>
        </div>
      </main>
    );
  }

  const { stores, updatedAt } = data;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard de Lojas</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {stores.length} lojas · Atualizado:{" "}
            {new Date(updatedAt).toLocaleString("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            setData(null);
            fetchDashboardData()
              .then(setData)
              .catch((e) => setError(String(e)))
              .finally(() => setLoading(false));
          }}
          className="text-xs rounded-full bg-green-100 text-green-700 px-3 py-1 font-medium hover:bg-green-200 transition-colors"
        >
          ↺ Atualizar
        </button>
      </header>

      <div className="mx-auto max-w-[1600px] px-6 py-6 space-y-6">
        <KpiCards stores={stores} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <RevenueChart stores={stores} topN={15} />
          <DirectorChart stores={stores} />
        </div>

        <QualityChart stores={stores} />

        <StoresTable stores={stores} />
      </div>
    </main>
  );
}
