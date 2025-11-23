import { useEffect, useState } from "react";
import type { Pedido } from "../Types";

const API = "http://localhost:4000";

const MotorizadoPanel = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    try {
      setCargando(true);
      const res = await fetch(`${API}/pedidos`);
      const data = await res.json();

      // Solo mostrar pedidos que son para el motorizado
      const filtrados = data.filter(
        (p: Pedido) => p.estado === "Listo" || p.estado === "En Camino"
      );

      setPedidos(filtrados);
    } catch {
      alert("Error cargando pedidos");
    } finally {
      setCargando(false);
    }
  };

  const cambio = async (id: string, nuevo: string) => {
    try {
      await fetch(`${API}/pedidos/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevo }),
      });

      cargar();
    } catch {
      alert("Error cambiando estado");
    }
  };

  return (
    <div className="p-4">
      <h2 className="fw-bold mb-3">Panel Motorizado</h2>

      {cargando && <p>Cargando pedidos...</p>}

      {!cargando && pedidos.length === 0 && <p>No hay pedidos listos aún.</p>}

      {pedidos.map((p) => (
        <div key={p._id} className="card shadow p-3 mb-3 rounded">
          <h4 className="fw-bold">{p.cliente.nombre}</h4>
          <p>
            <strong>Dirección:</strong> {p.cliente.direccion}
          </p>
          <p>
            <strong>Total:</strong> S/ {p.total}
          </p>

          <select
            value={p.estado}
            className="form-select"
            onChange={(e) => cambio(p._id, e.target.value)}
          >
            <option value="Listo">Listo</option>
            <option value="En Camino">En Camino</option>
            <option value="Entregado">Entregado</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default MotorizadoPanel;
