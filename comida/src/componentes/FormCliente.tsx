
import  { useState } from "react";
import type { Plato, Cliente } from "../Types";

interface PropsFormCliente {
  carrito: Plato[];
  mesa: string;
  onFinalizar: (cliente: Cliente & { pagado?: number }) => void;
  onVolver: () => void;
}

const FormCliente = ({ carrito, mesa, onFinalizar, onVolver }: PropsFormCliente) => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [pagado, setPagado] = useState<number | "">("");

  const total = carrito.reduce((acc, p) => acc + p.precio * (p.cantidad || 1), 0);

  const handleFinalizar = () => {
    if (!nombre || !telefono || !direccion) return alert("Completa todos los campos");
    onFinalizar({ nombre, telefono, direccion, mesa, pagado: Number(pagado || 0) });
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md my-6">
      <h3 className="text-xl font-bold mb-4 text-center">Datos del Cliente</h3>

      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input type="text" className="form-control" placeholder="Nombre del cliente" value={nombre} onChange={e => setNombre(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Teléfono</label>
        <input type="text" className="form-control" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Dirección</label>
        <input type="text" className="form-control" placeholder="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Pagado</label>
        <input type="number" className="form-control" placeholder={`Total S/ ${total.toFixed(2)}`} value={pagado} onChange={e => setPagado(Number(e.target.value))} />
      </div>

      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={onVolver}>Volver</button>
        <button className="btn btn-primary" onClick={handleFinalizar}>Finalizar Pedido</button>
      </div>
    </div>
  );
};

export default FormCliente;

