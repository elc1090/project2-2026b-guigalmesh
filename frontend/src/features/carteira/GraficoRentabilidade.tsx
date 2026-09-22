import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export interface DataPoint {
  mes: string;
  patrimonio: number;
}

interface GraficoRentabilidadeProps {
  data: DataPoint[];
}

export function GraficoRentabilidade({ data }: GraficoRentabilidadeProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] h-[400px] w-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Evolução Patrimonial</h3>
        <p className="text-sm text-gray-500">Acompanhamento dos últimos 6 meses</p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            {/* Gradiente verde para a área abaixo da linha (estilo clean) */}
            <defs>
              <linearGradient id="colorPatrimonio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#047857" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#047857" stopOpacity={0}/>
              </linearGradient>
            </defs>

            {/* Linhas de grade horizontais super sutis */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />

            <XAxis
              dataKey="mes"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={(value: number) => `R$ ${(value / 1000)}k`} // Formata para R$ 100k
              dx={-10}
            />

            {/* Tooltip ao passar o mouse */}
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: any) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Patrimônio']}
              labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
            />

            <Area
              type="monotone"
              dataKey="patrimonio"
              stroke="#047857" /* Verde escuro (emerald-700) */
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPatrimonio)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
