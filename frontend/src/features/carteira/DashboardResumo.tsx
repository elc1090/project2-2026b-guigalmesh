import { Wallet, TrendingUp, Landmark } from 'lucide-react';
import { SummaryCard } from '../../components/SummaryCard';
import { GraficoRentabilidade, DataPoint } from './GraficoRentabilidade';
import { TabelaAtivos, AtivoResumo } from './TabelaAtivos';

const mockHistoricoPatrimonio: DataPoint[] = [
  { mes: 'Mar', patrimonio: 98000 },
  { mes: 'Abr', patrimonio: 105000 },
  { mes: 'Mai', patrimonio: 103500 },
  { mes: 'Jun', patrimonio: 112000 },
  { mes: 'Jul', patrimonio: 125000 },
  { mes: 'Ago', patrimonio: 138000 },
  { mes: 'Set', patrimonio: 142300.50 },
];

const mockAtivos: AtivoResumo[] = [
  { ticker: 'ITUB4', tipo: 'Ação', quantidade: 300, precoMedio: 28.50, cotacaoAtual: 34.20, rentabilidade: 20.00 },
  { ticker: 'PETR4', tipo: 'Ação', quantidade: 500, precoMedio: 36.10, cotacaoAtual: 39.50, rentabilidade: 9.41 },
  { ticker: 'HGLG11', tipo: 'FII', quantidade: 120, precoMedio: 162.00, cotacaoAtual: 158.50, rentabilidade: -2.16 },
  { ticker: 'VALE3', tipo: 'Ação', quantidade: 200, precoMedio: 68.90, cotacaoAtual: 62.10, rentabilidade: -9.86 },
  { ticker: 'Tesouro IPCA+', tipo: 'Renda Fixa', quantidade: 5, precoMedio: 3100.00, cotacaoAtual: 3250.00, rentabilidade: 4.83 },
];

export function DashboardResumo() {
  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
        <p className="text-gray-500 mt-1">Acompanhe o desempenho da sua carteira.</p>
      </header>

      {/* Grid de Cards */}
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

      {/* Gráfico injetado de forma limpa */}
      <GraficoRentabilidade data={mockHistoricoPatrimonio} />

      <TabelaAtivos ativos={mockAtivos} />

    </div>
  );
}
