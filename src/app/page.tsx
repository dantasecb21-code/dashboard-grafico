import { fetchDashboardData } from "@/lib/sheets";
import KpiCards from "@/components/KpiCards";
import RevenueChart from "@/components/RevenueChart";
import DirectorChart from "@/components/DirectorChart";
import QualityChart from "@/components/QualityChart";
import StoresTable from "@/components/StoresTable";

export const revalidate = 300;

async function getData() {
  try {
    return await fetchDashboardData();
  } catch {
    return null;
  }
}

export default async function Home() {
  const data = await getData();

  if (!data) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-md rounded-xl border border-amber-200 bg-amber-50 p-8 text-center shadow">
          <div className="text-4xl mb-3">⚙️</div>
          <h1 className="text-lg font-bold text-amber-800 mb-2">Configuração necessária</h1>
          <p className="text-sm text-amber-700 mb-4">
            Defina a variável{" "}
            <code className="rounded bg-amber-100 px-1 font-mono">APPS_SCRIPT_URL</code> no arquivo{" "}
            <code className="rounded bg-amber-100 px-1 font-mono">.env.local</code> com a URL do seu
            Google Apps Script publicado como Web App.
          </p>
          <p className="text-xs text-amber-600">
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
        <span className="text-xs rounded-full bg-green-100 text-green-700 px-3 py-1 font-medium">
          ● Ao vivo
        </span>
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
