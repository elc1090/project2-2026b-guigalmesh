import { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon?: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function SummaryCard({ title, value, icon, trend }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col gap-4">
      <div className="flex items-center justify-between text-gray-500">
        <h3 className="text-sm font-medium">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold text-gray-900">{value}</span>
      </div>

      {trend && (
        <div className={`text-sm font-medium flex items-center gap-1 ${
          trend.isPositive ? 'text-emerald-700' : 'text-red-600'
        }`}>
          <span>{trend.isPositive ? '↑' : '↓'}</span>
          <span>{trend.value}</span>
          <span className="text-gray-400 font-normal ml-1">no último mês</span>
        </div>
      )}
    </div>
  );
}
