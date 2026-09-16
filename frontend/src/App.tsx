import { useEffect, useState } from "react";
import { SummaryCard } from "./components/SummaryCard";
import { Wallet, TrendingUp, Landmark } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export default function App() {
  const [status, setStatus] = useState<string>("verificando...");

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("backend indisponível"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Cabeçalho */}
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
          <p className="text-gray-500 mt-1">Acompanhe o desempenho da sua carteira.</p>
        </header>

        {/* Grid de Cards com Ícones Aplicados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            title="Patrimônio Total"
            value="R$ 142.300,50"
            icon={<Wallet size={20} />}
            trend={{ value: "2.4%", isPositive: true }}
          />
          <SummaryCard
            title="Valor Investido"
            value="R$ 120.000,00"
            icon={<Landmark size={20} />}
          />
          <SummaryCard
            title="Rentabilidade Total"
            value="R$ 22.300,50"
            icon={<TrendingUp size={20} />}
            trend={{ value: "18.58%", isPositive: true }}
          />
        </div>

        {/* Espaço para o Gráfico */}
        <div className="bg-white rounded-xl border border-gray-100 h-96 flex flex-col items-center justify-center text-gray-400">
          <TrendingUp size={48} className="text-gray-200 mb-4" />
          Área reservada para o Gráfico de Evolução Patrimonial
        </div>

      </div>
    </div>
  );
}
