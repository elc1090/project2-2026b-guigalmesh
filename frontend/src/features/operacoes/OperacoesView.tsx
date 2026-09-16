import { Plus, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export function OperacoesView() {
  // Mock para simular o visual do histórico de operações
  const mockHistorico = [
    { id: 1, tipo: 'COMPRA', ativo: 'ITUB4', data: '15 Set 2026', quantidade: 100, preco: 34.15, total: 3415.00 },
    { id: 2, tipo: 'VENDA', ativo: 'PETR4', data: '12 Set 2026', quantidade: 50, preco: 39.80, total: 1990.00 },
    { id: 3, tipo: 'COMPRA', ativo: 'Tesouro IPCA+', data: '01 Set 2026', quantidade: 1, preco: 3250.00, total: 3250.00 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Cabeçalho com Botão de Ação */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operações</h1>
          <p className="text-gray-500 mt-1">Gerencie suas compras e vendas.</p>
        </div>
        <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm">
          <Plus size={20} />
          Nova Operação
        </button>
      </header>

      {/* Histórico Recente */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Histórico Recente</h3>
        </div>

        <div className="divide-y divide-gray-50">
          {mockHistorico.map((op) => {
            const isCompra = op.tipo === 'COMPRA';

            return (
              <div key={op.id} className="p-4 pl-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">

                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${isCompra ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                    {isCompra ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{op.ativo}</h4>
                    <p className="text-sm text-gray-500">{op.data} • {isCompra ? 'Compra' : 'Venda'}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    R$ {op.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {op.quantidade} cotas a R$ {op.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
