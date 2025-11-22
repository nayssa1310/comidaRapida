import type { Pedido } from "../Types";

interface PropsPedidoConfirmado {
  pedido: Pedido;
}

export default function PedidoConfirmado({ pedido }: PropsPedidoConfirmado) {
  return (
    <div className="card shadow p-3">
      <h5 className="text-green-600 fw-bold">Pedido realizado - Mesa {pedido.cliente.mesa}</h5>
      <p>Cliente: {pedido.cliente.nombre}</p>
      <p>Total: S/ {pedido.total.toFixed(2)}</p>
      <p>Pagado: S/ {pedido.pagado.toFixed(2)} - Estado: {pedido.estado}</p>
    </div>
  );
}
