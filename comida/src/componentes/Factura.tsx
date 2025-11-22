import type { Pedido } from "../Types";

interface Props {
  pedido: Pedido & { pdfPath?: string }; // <-- agregamos pdfPath opcional
}

const Factura = ({ pedido }: Props) => {
  if (!pedido) return null;

  const total = pedido.total ?? 0;
  const pagado = pedido.pagado ?? 0;
  const pendiente = total - pagado;

  // Usamos pdfPath si existe, si no, usamos fallback
  const pdfUrl = pedido.pdfPath ?? `/boletas/${pedido._id}.pdf`;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md my-6">
      <h3 className="text-xl font-bold mb-4 text-center">🧾 Factura</h3>
      <div className="mb-2"><strong>Mesa:</strong> {pedido.cliente?.mesa || "N/A"}</div>
      <div className="mb-2"><strong>Cliente:</strong> {pedido.cliente?.nombre || "N/A"}</div>
      <div className="mb-2"><strong>Teléfono:</strong> {pedido.cliente?.telefono || "N/A"}</div>
      <div className="mb-2"><strong>Dirección:</strong> {pedido.cliente?.direccion || "N/A"}</div>

      <h4 className="mt-4 mb-2 font-semibold">Platos:</h4>
      <ul className="mb-4 list-disc list-inside">
        {pedido.platos.map((p) => (
          <li key={p._id}>
            {p.nombre} - {p.cantidad ? `${p.cantidad} x ` : ""}S/ {p.precio.toFixed(2)}
          </li>
        ))}
      </ul>

      <div className="mb-2"><strong>Total:</strong> S/ {total.toFixed(2)}</div>
      <div className="mb-2"><strong>Pagado:</strong> S/ {pagado.toFixed(2)}</div>
      <div className="mb-2"><strong>Pendiente:</strong> S/ {pendiente.toFixed(2)}</div>

      <div className="mt-4 text-center">
        <a
          href={pdfUrl} 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-pink-600 text-white font-semibold rounded hover:bg-pink-700 transition-colors"
        >
          Descargar Boleta
        </a>
      </div>
    </div>
  );
};

export default Factura;
