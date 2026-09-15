import { useEffect, useState } from "react";

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
    <div className="text-red-500">
      <h1>Carteira de Investimentos</h1>
      <p>Status do backend: {status}</p>
      {/* TODO: dashboard, tabelas de operações, gráficos de rentabilidade */}
    </div>
  );
}
