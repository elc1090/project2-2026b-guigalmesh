import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createOperacao } from "../../services/operacoesService";
import { ApiError } from "../../services/api";
import type { ClasseAtivo, TipoOperacao } from "../../types/operacao";

interface FormData {
  tipo: TipoOperacao;
  ticker: string;
  data: string;
  quantidade: number | '';
  preco: number | '';
  custos: number | '';
}

const CLASSES: { value: ClasseAtivo; label: string }[] = [
  { value: 'ACAO', label: 'Ação' },
  { value: 'FII', label: 'FII' },
  { value: 'RENDA_FIXA', label: 'Renda Fixa' },
];

export function OperacaoForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    tipo: 'COMPRA',
    ticker: '',
    data: '',
    quantidade: '',
    preco: '',
    custos: '',
  });

  const [precisaClasse, setPrecisaClasse] = useState(false);
  const [classe, setClasse] = useState<ClasseAtivo | ''>('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);

    if (precisaClasse && !classe) {
      setErro('Selecione a classe do ativo para continuar.');
      return;
    }

    setEnviando(true);
    try {
      await createOperacao({
        ticker: formData.ticker,
        tipo: formData.tipo,
        data: formData.data,
        quantidade: Number(formData.quantidade),
        preco: Number(formData.preco),
        custos: formData.custos === '' ? 0 : Number(formData.custos),
        ...(precisaClasse && classe ? { classe } : {}),
      });
      navigate('/operacoes');
    } catch (err) {
      if (err instanceof ApiError && err.codigo === 'ATIVO_DESCONHECIDO') {
        setPrecisaClasse(true);
        setErro('Esse ticker ainda não está cadastrado. Selecione a classe abaixo e envie de novo.');
      } else if (err instanceof ApiError) {
        setErro(err.message);
      } else {
        setErro('Não foi possível conectar ao servidor.');
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-xl border border-green-100 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Nova operação</h2>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => setFormData((f) => ({ ...f, tipo: 'COMPRA' }))}
          className={`py-2 rounded-lg text-sm font-medium border ${formData.tipo === 'COMPRA' ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-200'}`}>
          Compra
        </button>
        <button type="button" onClick={() => setFormData((f) => ({ ...f, tipo: 'VENDA' }))}
          className={`py-2 rounded-lg text-sm font-medium border ${formData.tipo === 'VENDA' ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-200'}`}>
          Venda
        </button>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Ticker</label>
        <input type="text" value={formData.ticker}
          onChange={(e) => setFormData((f) => ({ ...f, ticker: e.target.value.toUpperCase() }))}
          placeholder="PETR4"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Quantidade</label>
          <input type="number" step="any" value={formData.quantidade}
            onChange={(e) => setFormData((f) => ({ ...f, quantidade: e.target.value === '' ? '' : Number(e.target.value) }))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            required />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Preço unitário</label>
          <input type="number" step="any" value={formData.preco}
            onChange={(e) => setFormData((f) => ({ ...f, preco: e.target.value === '' ? '' : Number(e.target.value) }))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Data</label>
          <input type="date" value={formData.data}
            onChange={(e) => setFormData((f) => ({ ...f, data: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            required />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Custos (opcional)</label>
          <input type="number" step="any" value={formData.custos}
            onChange={(e) => setFormData((f) => ({ ...f, custos: e.target.value === '' ? '' : Number(e.target.value) }))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
        </div>
      </div>

      {precisaClasse && (
        <div>
          <label className="block text-sm text-gray-600 mb-1">Classe do ativo</label>
          <select value={classe} onChange={(e) => setClasse(e.target.value as ClasseAtivo)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600">
            <option value="">Selecione...</option>
            {CLASSES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      )}

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <button type="submit" disabled={enviando}
        className="w-full py-2.5 rounded-lg bg-green-700 text-white text-sm font-medium disabled:opacity-50">
        {enviando ? 'Enviando...' : 'Registrar operação'}
      </button>
    </form>
  );
}
