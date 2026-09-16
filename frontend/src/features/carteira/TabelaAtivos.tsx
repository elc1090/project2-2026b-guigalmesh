export interface AtivoResumo {
  ticker: string;
  tipo: 'Ação' | 'FII' | 'Renda Fixa';
  quantidade: number;
  precoMedio: number;
  cotacaoAtual: number;
  rentabilidade: number;
}

interface TabelaAtivosProps {
  ativos: AtivoResumo[];
}

export function TabelaAtivos({ ativos }: TabelaAtivosProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">

      {/* Cabeçalho da Seção */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Meus Ativos</h3>
          <p className="text-sm text-gray-500">Composição atual da carteira</p>
        </div>
        <button className="text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors">
          Ver todos →
        </button>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
              <th className="font-medium p-4 pl-6">Ativo</th>
              <th className="font-medium p-4">Tipo</th>
              <th className="font-medium p-4">Qtd.</th>
              <th className="font-medium p-4">Preço Médio</th>
              <th className="font-medium p-4">Cotação Atual</th>
              <th className="font-medium p-4 pr-6 text-right">Rentabilidade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ativos.map((ativo) => {
              // Lógica para definir a cor da rentabilidade
              const isPositive = ativo.rentabilidade > 0;
              const isNegative = ativo.rentabilidade < 0;

              return (
                <tr key={ativo.ticker} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-gray-900">{ativo.ticker}</td>
                  <td className="p-4 text-sm text-gray-500">
                    <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-medium">
                      {ativo.tipo}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-900">{ativo.quantidade}</td>
                  <td className="p-4 text-sm text-gray-500">
                    R$ {ativo.precoMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-sm text-gray-900">
                    R$ {ativo.cotacaoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`p-4 pr-6 text-sm font-medium text-right ${
                    isPositive ? 'text-emerald-700' : isNegative ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {isPositive ? '+' : ''}{ativo.rentabilidade.toFixed(2).replace('.', ',')}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
