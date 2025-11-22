
import  { useEffect, useState } from "react";
import Header from "./componentes/Header";
import Menu from "./componentes/Menu";
import Carrito from "./componentes/Carrito";
import FormCliente from "./componentes/FormCliente";
import Factura from "./componentes/Factura";
import PedidoConfirmado from "./componentes/PedidoConfirmado";
import type { Plato, Pedido, Cliente } from "./Types";
import "./App.css";

const API = "http://localhost:4000";

function App() {
  const [misPlatos, setMisPlatos] = useState<Plato[]>([]);
  const [carrito, setCarrito] = useState<Plato[]>([]);
  const [vista, setVista] = useState<"menu" | "form" | "confirmado" | "factura">("menu");
  const [pedidoFinal, setPedidoFinal] = useState<Pedido | null>(null);
  const [mesa, setMesa] = useState("1");
  const [showModal, setShowModal] = useState(false);

  // inputs modal nuevo plato
  const [nombreProducto, setNombreProducto] = useState("");
  const [descripcionProducto, setDescripcionProducto] = useState("");
  const [precioProducto, setPrecioProducto] = useState<number | "">(0);
  const [urlProducto, setUrlProducto] = useState("");

  useEffect(() => {
    fetchPlatos();
  }, []);

  const fetchPlatos = async () => {
    try {
      const res = await fetch(`${API}/platos`);
      const data = await res.json();
      setMisPlatos(data);
    } catch (err) {
      console.error("Error fetch platos:", err);
    }
  };

  // agrega al carrito; si ya existe, incrementa cantidad
  const agregarAlCarrito = (plato: Plato) => {
    setCarrito(prev => {
      const idx = prev.findIndex(p => p._id === plato._id);
      if (idx >= 0) {
        const copia = [...prev];
        copia[idx] = { ...copia[idx], cantidad: (copia[idx].cantidad || 1) + 1 };
        return copia;
      }
      return [...prev, { ...plato, cantidad: 1 }];
    });
  };

  // quita completamente el item
  const quitarDelCarrito = (id: string) => {
    setCarrito(prev => prev.filter(p => p._id !== id));
  };

  // cambiar cantidad (usar desde Carrito)
  const cambiarCantidad = (id: string, cantidad: number) => {
    setCarrito(prev => {
      return prev
        .map(p => (p._id === id ? { ...p, cantidad: Math.max(1, cantidad) } : p))
        .filter(p => p.cantidad! > 0);
    });
  };

  // agregar nuevo plato al backend y actualizar lista
  const crearPlatoBackend = async () => {
    if (!nombreProducto || !descripcionProducto || !precioProducto || !urlProducto) {
      return alert("Completa todos los campos del producto.");
    }
    try {
      const nuevo = { nombre: nombreProducto, descripcion: descripcionProducto, precio: Number(precioProducto), imagen: urlProducto };
      const res = await fetch(`${API}/platos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo)
      });
      if (!res.ok) throw new Error("Error creando plato");
      const data = await res.json();
      // si el backend envía el plato creado:
      const platoCreado = data.plato || data;
      setMisPlatos(prev => [platoCreado, ...prev]);
      // limpiar modal
      setNombreProducto("");
      setDescripcionProducto("");
      setPrecioProducto(0);
      setUrlProducto("");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("No se pudo crear el plato");
    }
  };

  // finalizar pedido: recibe el cliente desde FormCliente
  const finalizarPedido = async (cliente: Cliente & { pagado?: number }) => {
    if (carrito.length === 0) return alert("El carrito está vacío");

    // calcular total
    const total = carrito.reduce((acc, p) => acc + p.precio * (p.cantidad || 1), 0);
    const pagado = cliente.pagado ?? 0;

    // preparar body: enviar cliente con mesa y arreglo de platos por _id y cantidad
    const platosParaEnviar = carrito.map(p => ({ _id: p._id, cantidad: p.cantidad || 1 }));

    const body = {
      cliente: { nombre: cliente.nombre, telefono: cliente.telefono, direccion: cliente.direccion, mesa },
      platos: platosParaEnviar,
      total,
      pagado,
      estado: pagado >= total ? "Pagado" : "Pendiente"
    };

    try {
      const res = await fetch(`${API}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Error backend:", err);
        return alert("Error guardando pedido: " + (err.error || res.statusText));
      }

      const nuevoPedido: Pedido = await res.json();
      setPedidoFinal(nuevoPedido);
      setVista("confirmado");
      setCarrito([]);
    } catch (err) {
      console.error("Error guardando pedido:", err);
      alert("Error al guardar el pedido");
    }
  };

  return (
    <div className="bg-pastel min-h-screen pb-24">
      <Header mesa={mesa} />
      <main className="max-w-6xl mx-auto px-3">
        {vista === "menu" && (
          <>
            <div className="d-flex justify-content-between align-items-center my-2">
              <div className="d-flex gap-2">
                <button className="btn btn-pink" onClick={() => setShowModal(true)}>Agregar producto</button>
                <input style={{width: 70}} value={mesa} onChange={e => setMesa(e.target.value)} className="form-control" />
              </div>
              <span className="fw-bold">Mesa: {mesa}</span>
            </div>

            <Menu platos={misPlatos} onAdd={agregarAlCarrito} />

            {carrito.length > 0 && (
              <Carrito
                items={carrito}
                onComprar={() => setVista("form")}
                onRemove={quitarDelCarrito}
                onChangeCantidad={cambiarCantidad}
              />
            )}

            {/* Modal Agregar Producto */}
            {showModal && (
              <div className="modal-backdrop">
                <div className="modal-content">
                  <h5>Agregar producto</h5>
                  <input
                    className="form-control mb-2"
                    placeholder="Nombre del producto"
                    value={nombreProducto}
                    onChange={e => setNombreProducto(e.target.value)}
                  />
                  <input
                    className="form-control mb-2"
                    placeholder="Descripción"
                    value={descripcionProducto}
                    onChange={e => setDescripcionProducto(e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Precio"
                    value={precioProducto}
                    onChange={e => setPrecioProducto(Number(e.target.value))}
                  />
                  <input
                    className="form-control mb-2"
                    placeholder="URL de la imagen"
                    value={urlProducto}
                    onChange={e => setUrlProducto(e.target.value)}
                  />
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-pastel" onClick={crearPlatoBackend}>Agregar</button>
                    <button className="btn btn-danger" onClick={() => setShowModal(false)}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {vista === "form" && carrito.length > 0 && (
          <FormCliente carrito={carrito} mesa={mesa} onFinalizar={finalizarPedido} onVolver={() => setVista("menu")} />
        )}

        {vista === "confirmado" && pedidoFinal && (
          <PedidoConfirmado pedido={pedidoFinal} onContinuar={() => setVista("factura")} />
        )}

        {vista === "factura" && pedidoFinal && (
          <Factura pedido={pedidoFinal} />
        )}
      </main>
    </div>
  );
}

export default App;
