
import type { Pedido } from "../Types";
import '../App.css';
interface Props {
  pedido: Pedido;
  onContinuar: () => void;
}

const PedidoConfirmado = ({ pedido, onContinuar }: Props) => {
  if (!pedido) return null;

  const total = Number(pedido.total) || 0;
  const pagado = Number(pedido.pagado) || 0;
  const pendiente = total - pagado;
  const mesa = pedido.cliente?.mesa || "N/A";

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md my-6">
      <h3 className="text-xl font-bold mb-4 text-center">Pedido realizado exitosamente</h3>

      <div className="mb-2"><strong>Mesa:</strong> {mesa}</div>
      <div className="mb-2"><strong>ID Pedido:</strong> {pedido._id}</div>
      <div className="mb-2"><strong>Estado:</strong> {pedido.estado}</div>
      <div className="mb-2"><strong>Total:</strong> S/ {total.toFixed(2)}</div>
      <div className="mb-2"><strong>Pagado:</strong> S/ {pagado.toFixed(2)}</div>
      <div className="mb-4"><strong>Pendiente:</strong> S/ {pendiente.toFixed(2)}</div>

      <button className="btn btn-primary w-full" onClick={onContinuar}>Continuar</button>
    </div>
  );
};

export default PedidoConfirmado;
