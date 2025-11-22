
import type { Plato } from "../Types";

interface PropsCarrito {
  items: Plato[];
  onComprar: () => void;
  onRemove: (id: string) => void;
  onChangeCantidad?: (id: string, cantidad: number) => void;
}

export default function Carrito({ items, onComprar, onRemove, onChangeCantidad }: PropsCarrito) {
  const total = items.reduce((acc, el) => acc + el.precio * (el.cantidad || 1), 0);

  return (
    <div className="fixed-bottom bg-white shadow-lg p-3 border-top border-pink-200">
      <h5 className="text-gray-700 fw-bold">🛒 Carrito ({items.length})</h5>
      <ul className="list-group mb-2">
        {items.map(p => (
          <li key={p._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div>{p.nombre} - S/ {p.precio.toFixed(2)}</div>
              {onChangeCantidad && (
                <div className="d-flex gap-1 mt-1">
                  <button className="btn btn-sm btn-secondary" onClick={()=>onChangeCantidad(p._id, (p.cantidad||1)-1)}>-</button>
                  <span className="px-2">{p.cantidad||1}</span>
                  <button className="btn btn-sm btn-secondary" onClick={()=>onChangeCantidad(p._id, (p.cantidad||1)+1)}>+</button>
                </div>
              )}
            </div>
            <div className="d-flex gap-2 align-items-center">
              <strong>S/ {(p.precio * (p.cantidad || 1)).toFixed(2)}</strong>
              <button className="btn btn-sm btn-danger" onClick={()=>onRemove(p._id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="d-flex justify-content-between align-items-center">
        <strong>Total: S/ {total.toFixed(2)}</strong>
        <button className="btn btn-pastel" onClick={onComprar} disabled={items.length===0}>Confirmar Pedido</button>
      </div>
    </div>
  );
}
