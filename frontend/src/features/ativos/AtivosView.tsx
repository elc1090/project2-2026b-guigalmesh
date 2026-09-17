import { useState } from 'react';
import { Filter } from 'lucide-react';
import { TabelaAtivos, AtivoResumo } from '../carteira/TabelaAtivos';

export function AtivosView() {
  // Estado para o filtro ativo
  const [filtroAtivo, setFiltroAtivo] = useState<'TUDO' | 'Ação' | 'FII' | 'Renda Fixa'>('TUDO');

  // Reutilizando o mesmo mock do dashboard para simular os dados da API
  const mockAtivos: AtivoResumo[] = [
    { ticker: 'ITUB4', tipo: 'Ação', quantidade: 300, precoMedio: 28.50, cotacaoAtual: 34.20, rentabilidade: 20.00 },
    { ticker: 'PETR4', tipo: 'Ação', quantidade: 500, precoMedio: 36.10, cotacaoAtual: 39.50, rentabilidade: 9.41 },
    { ticker: 'HGLG11', tipo: 'FII', quantidade: 120, precoMedio: 162.00, cotacaoAtual: 158.50, rentabilidade: -2.16 },
    { ticker: 'VALE3', tipo: 'Ação', quantidade: 200, precoMedio: 68.90, cotacaoAtual: 62.10, rentabilidade: -9.86 },
    { ticker: 'Tesouro IPCA+', tipo: 'Renda Fixa', quantidade: 5, precoMedio: 3100.00, cotacaoAtual: 3250.00, rentabilidade: 4.83 },
  ];

  // Lógica de filtragem
  const ativosFiltrados = mockAtivos.filter(ativo =>
    filtroAtivo === 'TUDO' ? true : ativo.tipo === filtroAtivo
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Cabeçalho */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Ativos</h1>
          <p className="text-gray-500 mt-1">Visão detalhada da sua carteira de investimentos.</p>
        </div>
      </header>

      {/* Barra de Filtros Minimalista */}
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

      {/* Renderizando a tabela criada anteriormente com a lista filtrada */}
      <div className="pt-2">
        <TabelaAtivos ativos={ativosFiltrados} />
      </div>

    </div>
  );
}
