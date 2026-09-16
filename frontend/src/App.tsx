import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { DashboardResumo } from "./features/carteira/DashboardResumo";
import { SummaryCard } from "./components/SummaryCard";
import { Wallet, TrendingUp, Landmark } from 'lucide-react';

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
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Aqui, no futuro, o React Router vai decidir qual feature renderizar.
              Por enquanto, chamamos o Dashboard direto. */}
          <DashboardResumo />
        </div>
      </main>
    </div>
  );
}
