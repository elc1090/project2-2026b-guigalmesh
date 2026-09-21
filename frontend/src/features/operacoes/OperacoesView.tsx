import { Plus, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { listOperacoes } from '../../services/operacoesService';
import { Operacao } from '../../types/operacao';

export function OperacoesView() {
  const [operacoes, setOperacoes] = useState<Operacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listOperacoes();
        setOperacoes(dados);
      } catch (err: any) {
        setErro(err.message || 'Erro ao carregar operações');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operações</h1>
          <p className="text-gray-500 mt-1">Gerencie suas compras e vendas.</p>
        </div>
        <Link
          to="/operacoes/nova"
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Nova Operação
        </Link>
      </header>

      <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Histórico Recente</h3>
        </div>

        {carregando ? (
          <div className="p-8 text-center text-gray-500">Carregando operações...</div>
        ) : erro ? (
          <div className="p-8 text-center text-red-500">{erro}</div>
        ) : operacoes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nenhuma operação registrada ainda.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {operacoes.map((op) => {
              const isCompra = op.tipo === 'COMPRA';
              // Convertendo strings do Postgres para números
              const quantidade = Number(op.quantidade);
              const precoUnitario = Number(op.preco_unitario);
              const total = quantidade * precoUnitario;

              // Formatando a data que vem do banco (ex: "2026-09-16T00:00:00.000Z")
              const dataFormatada = new Date(op.data_operacao).toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'short', year: 'numeric'
              });

              return (
                <div key={op.id} className="p-4 pl-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${isCompra ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                      {isCompra ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{op.ticker}</h4>
                      <p className="text-sm text-gray-500 capitalize">{dataFormatada} • {op.tipo.toLowerCase()}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-500">
                      {quantidade} cotas a R$ {precoUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
