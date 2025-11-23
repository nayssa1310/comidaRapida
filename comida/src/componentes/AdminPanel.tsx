import { useEffect, useState } from "react";
import type { Plato, Pedido } from "../Types";

const API = "http://localhost:4000";

const AdminPanel = () => {
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number | "">(0);
  const [imagen, setImagen] = useState("");

  useEffect(() => {
    cargarPlatos();
    cargarPedidos();
  }, []);

  const cargarPlatos = async () => {
    try {
      const res = await fetch(`${API}/platos`);
      const data = await res.json();
      setPlatos(data);
    } catch {
      alert("Error cargando platos");
    }
  };

  const cargarPedidos = async () => {
    try {
      const res = await fetch(`${API}/pedidos`);
      const data = await res.json();
      setPedidos(data);
    } catch {
      alert("Error cargando pedidos");
    }
  };

  const agregarPlato = async () => {
    if (!nombre || !descripcion || !precio || !imagen) {
      return alert("Completa todos los campos");
    }

    try {
      const res = await fetch(`${API}/platos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, precio, imagen }),
      });

      if (!res.ok) return alert("Error creando plato");

      const data = await res.json();

      // Agregar de forma optimizada
      setPlatos((prev) => [data, ...prev]);

      setShowAddModal(false);

      setNombre("");
      setDescripcion("");
      setPrecio(0);
      setImagen("");
    } catch {
      alert("Error creando plato");
    }
  };

  const cambiarEstado = async (id: string, nuevo: string) => {
    try {
      const res = await fetch(`${API}/pedidos/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevo }),
      });

      if (res.ok) {
        cargarPedidos();
      }
    } catch {
      alert("Error actualizando estado");
    }
  };

  return (
    <div className="p-4">
      <h2 className="fw-bold mb-4">Panel Administrador</h2>

      <button
        className="btn btn-pink mb-3"
        onClick={() => setShowAddModal(true)}
      >
        Agregar Producto
      </button>

      {/* Productos */}
      <h3 className="mt-4">Productos</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platos.map((p) => (
          <div key={p._id} className="card shadow p-3 rounded">
            <img src={p.imagen} className="w-full h-40 object-cover rounded" />
            <h4 className="mt-2 fw-bold">{p.nombre}</h4>
            <p>S/ {p.precio}</p>
          </div>
        ))}
      </div>

      {/* Pedidos */}
      <h3 className="mt-5">Pedidos</h3>
      <table className="table table-bordered bg-white text-center">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Mesa</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Cambiar</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p._id}>
              <td>{p.cliente.nombre}</td>
              <td>{p.cliente.mesa}</td>
              <td>S/ {p.total}</td>
              <td>{p.estado}</td>
              <td>
                <select
                  className="form-select"
                  value={p.estado}
                  onChange={(e) => cambiarEstado(p._id, e.target.value)}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Cocinando">Cocinando</option>
                  <option value="Listo">Listo</option>
                  <option value="Entregado">Entregado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal agregar producto */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h4 className="fw-bold mb-3">Nuevo Producto</h4>

            <input
              className="form-control mb-2"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              className="form-control mb-2"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            <input
              className="form-control mb-2"
              type="number"
              placeholder="Precio"
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
            />
            <input
              className="form-control mb-2"
              placeholder="URL imagen"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
            />

            <button className="btn btn-pink" onClick={agregarPlato}>
              Agregar
            </button>
            <button
              className="btn btn-danger ms-2"
              onClick={() => setShowAddModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
