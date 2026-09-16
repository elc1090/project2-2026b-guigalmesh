import { LayoutDashboard, Wallet, ArrowRightLeft, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function Sidebar() {
  const getLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
      isActive
        ? 'bg-emerald-50/50 text-emerald-700'
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <h2 className="text-xl font-bold text-gray-900">Carteira<span className="text-emerald-700">.</span></h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <NavLink to="/dashboard" className={getLinkClasses}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink to="/ativos" className={getLinkClasses}>
          <Wallet size={20} />
          Meus Ativos
        </NavLink>

        <NavLink to="/operacoes" className={getLinkClasses}>
          <ArrowRightLeft size={20} />
          Operações
        </NavLink>
      </nav>

      <div className="p-4 mb-4">
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
          <Settings size={20} />
          Configurações
        </a>
      </div>
    </aside>
  );
}
