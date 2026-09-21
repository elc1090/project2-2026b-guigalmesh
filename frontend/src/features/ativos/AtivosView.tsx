import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { TabelaAtivos, AtivoResumo } from '../carteira/TabelaAtivos';
import { getPosicoes } from '../../services/carteiraService';

export function AtivosView() {
  const [filtroAtivo, setFiltroAtivo] = useState<'TUDO' | 'Ação' | 'FII' | 'Renda Fixa'>('TUDO');
  const [ativos, setAtivos] = useState<AtivoResumo[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Busca os dados reais do back-end ao carregar o ecrã
  useEffect(() => {
    getPosicoes()
      .then(setAtivos)
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  const ativosFiltrados = ativos.filter(ativo =>
    filtroAtivo === 'TUDO' ? true : ativo.tipo === filtroAtivo
  );

  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Ativos</h1>
          <p className="text-gray-500 mt-1">Visão detalhada da sua carteira de investimentos.</p>
        </div>
      </header>

      <div className="flex items-center gap-3">
        <div className="text-gray-400 p-2">
          <Filter size={20} />
        </div>

        <button
          onClick={() => setFiltroAtivo('TUDO')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filtroAtivo === 'TUDO' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Todos os Ativos
        </button>

        <button
          onClick={() => setFiltroAtivo('Ação')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filtroAtivo === 'Ação' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Ações
        </button>

        <button
          onClick={() => setFiltroAtivo('FII')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filtroAtivo === 'FII' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Fundos Imobiliários
        </button>

        <button
          onClick={() => setFiltroAtivo('Renda Fixa')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filtroAtivo === 'Renda Fixa' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Renda Fixa
        </button>
      </div>

      <div className="pt-2 relative">
        {carregando && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
            <span className="text-emerald-700 font-medium">A carregar ativos...</span>
          </div>
        )}
        <TabelaAtivos ativos={ativosFiltrados} />
      </div>

    </div>
  );
}
