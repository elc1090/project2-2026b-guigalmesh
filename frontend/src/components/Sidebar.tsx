// src/components/Sidebar.tsx
import { LayoutDashboard, Wallet, ArrowRightLeft, Settings } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Logotipo / Título */}
      <div className="p-8">
        <h2 className="text-xl font-bold text-gray-900">Carteira<span className="text-emerald-700">.</span></h2>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 px-4 space-y-2">
        {/* Item Ativo (Dashboard) */}
        <a href="#" className="flex items-center gap-3 px-4 py-3 bg-emerald-50/50 text-emerald-700 rounded-xl font-medium transition-colors">
          <LayoutDashboard size={20} />
          Dashboard
        </a>

        {/* Itens Inativos */}
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
          <Wallet size={20} />
          Meus Ativos
        </a>

        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
          <ArrowRightLeft size={20} />
          Operações
        </a>
      </nav>

      {/* Rodapé do Menu (Configurações) */}
      <div className="p-4 mb-4">
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
          <Settings size={20} />
          Configurações
        </a>
      </div>
    </aside>
  );
}
