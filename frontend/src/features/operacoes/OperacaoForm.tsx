// src/features/operacoes/OperacaoForm.tsx
import { ArrowLeft, Save } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, FormEvent } from 'react';

interface FormData {
  tipo: 'COMPRA' | 'VENDA';
  ticker: string;
  data: string;
  quantidade: number | '';
  preco: number | '';
}

export function OperacaoForm() {
  const navigate = useNavigate();

  // O estado que guarda todos os campos do formulário
  const [formData, setFormData] = useState<FormData>({
    tipo: 'COMPRA',
    ticker: '',
    data: '',
    quantidade: '',
    preco: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      // Se for quantidade ou preço, converte para número (ou vazio se o usuário apagar)
      [name]: (name === 'quantidade' || name === 'preco')
        ? (value === '' ? '' : Number(value))
        : (name === 'ticker' ? value.toUpperCase() : value)
    }));
  };

  // Função disparada ao clicar em "Salvar"
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // Impede a página de recarregar

    // Aqui faremos o fetch() para a API Node.js
    console.log("Dados prontos para envio:", formData);

    alert('Operação salva com sucesso! (Simulação)');
    navigate('/operacoes');
  };

  return (
    <div className="space-y-8 max-w-2xl pb-12">
      <header className="flex items-center gap-4">
        <Link to="/operacoes" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Operação</h1>
          <p className="text-gray-500 mt-1">Registre uma compra ou venda na sua carteira.</p>
        </div>
      </header>

      {/* Trocamos a div form por um <form> real apontando para handleSubmit */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tipo de Operação</label>
            <select
              name="tipo" // name é crucial para o handleChange
              value={formData.tipo}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            >
              <option value="COMPRA">Compra</option>
              <option value="VENDA">Venda</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Código do Ativo</label>
            <input
              type="text"
              name="ticker"
              value={formData.ticker}
              onChange={handleChange}
              required
              placeholder="Ex: PETR4, HGLG11"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors uppercase"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Data da Operação</label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Quantidade</label>
            <input
              type="number"
              name="quantidade"
              value={formData.quantidade}
              onChange={handleChange}
              required
              min="1"
              step="1" // Força ser número inteiro (não dá pra comprar meia ação)
              placeholder="Ex: 100"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Preço Unitário (R$)</label>
            <input
              type="number"
              name="preco"
              value={formData.preco}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01" // Permite centavos
              placeholder="0,00"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        <hr className="border-gray-100" />

        <div className="flex justify-end gap-3 pt-2">
          <Link to="/operacoes" className="px-5 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-colors">
            Cancelar
          </Link>
          <button
            type="submit" // Trocado para submit para disparar o form
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Save size={20} />
            Salvar Operação
          </button>
        </div>
      </form>
    </div>
  );
}
