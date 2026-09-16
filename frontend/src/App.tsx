import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { DashboardResumo } from "./features/carteira/DashboardResumo";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OperacoesView } from './features/operacoes/OperacoesView';

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export default function App() {
  const [status, setStatus] = useState<string>("verificando...");

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("backend indisponível"));
  }, []);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50 font-sans">

        <Sidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Routes>
              {/* Redireciona a rota vazia para o dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route path="/dashboard" element={<DashboardResumo />} />
              <Route path="/operacoes" element={<OperacoesView />} />

              {/* Placeholder para quando formos fazer a tela de ativos */}
              <Route path="/ativos" element={
                <div className="text-gray-500 text-center mt-20">Tela de Ativos em construção...</div>
              } />
            </Routes>
          </div>
        </main>

      </div>
    </BrowserRouter>
  );
}
