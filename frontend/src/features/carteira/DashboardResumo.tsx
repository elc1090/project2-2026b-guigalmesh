import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, Landmark } from 'lucide-react';
import { SummaryCard } from '../../components/SummaryCard';
import { GraficoRentabilidade, DataPoint } from './GraficoRentabilidade';
import { TabelaAtivos, AtivoResumo } from './TabelaAtivos';
import { getPosicoes, getEvolucaoPatrimonial } from '../../services/carteiraService';


export function DashboardResumo() {
  const [ativos, setAtivos] = useState<AtivoResumo[]>([]);
  const [historico, setHistorico] = useState<DataPoint[]>([]); // NOVO ESTADO
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Dispara as duas requisições ao mesmo tempo
    Promise.all([
      getPosicoes(),
      getEvolucaoPatrimonial()
    ])
    .then(([dadosAtivos, dadosHistorico]) => {
      setAtivos(dadosAtivos);
      setHistorico(dadosHistorico);
    })
    .catch(console.error)
    .finally(() => setCarregando(false));
  }, []);

  // Cálculos dinâmicos baseados no banco de dados
  const valorInvestido = ativos.reduce((acc, ativo) => acc + (ativo.quantidade * ativo.precoMedio), 0);
  const patrimonioTotal = ativos.reduce((acc, ativo) => acc + (ativo.quantidade * ativo.cotacaoAtual), 0);
  const rentabilidadeTotal = patrimonioTotal - valorInvestido;
  const rentabilidadePercentual = valorInvestido > 0 ? (rentabilidadeTotal / valorInvestido) * 100 : 0;
  const isPositiva = rentabilidadeTotal >= 0;

  const formatarMoeda = (valor: number) =>
    `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
        <p className="text-gray-500 mt-1">Acompanhe o desempenho da sua carteira.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Patrimônio Total"
          value={formatarMoeda(patrimonioTotal)}
          icon={<Wallet size={20} />}
        />
        <SummaryCard
          title="Valor Investido"
          value={formatarMoeda(valorInvestido)}
          icon={<Landmark size={20} />}
        />
        <SummaryCard
          title="Rentabilidade Total"
          value={formatarMoeda(rentabilidadeTotal)}
          icon={<TrendingUp size={20} />}
          trend={{
            value: `${Math.abs(rentabilidadePercentual).toFixed(2).replace('.', ',')}%`,
            isPositive: isPositiva
          }}
        />
      </div>

      <GraficoRentabilidade data={historico} />

      <div className="relative">
        {carregando && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
            <span className="text-emerald-700 font-medium">Atualizando posições...</span>
          </div>
        )}
        <TabelaAtivos ativos={ativos} />
      </div>
    </div>
  );
}
