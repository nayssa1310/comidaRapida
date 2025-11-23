import { useEffect, useState } from "react";
import Header from "./componentes/Header";
import Menu from "./componentes/Menu";
import Carrito from "./componentes/Carrito";
import FormCliente from "./componentes/FormCliente";
import Factura from "./componentes/Factura";
import PedidoConfirmado from "./componentes/PedidoConfirmado";
import AdminPanel from "./componentes/AdminPanel";
import MotorizadoPanel from "./componentes/MotorizadoPanel";
import Registro from "./componentes/Registro";
import type { Plato, Pedido, Cliente } from "./Types";
import "./App.css";

const API = "http://localhost:4000";

function App() {
  const [misPlatos, setMisPlatos] = useState<Plato[]>([]);
  const [carrito, setCarrito] = useState<Plato[]>([]);
  const [vista, setVista] = useState<"menu" | "form" | "confirmado" | "factura">("menu");
  const [pedidoFinal, setPedidoFinal] = useState<Pedido | null>(null);
  const [mesa, setMesa] = useState("1");

  // LOGIN MODAL
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [rol, setRol] = useState<"cliente" | "admin" | "motorizado">("cliente");
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [logged, setLogged] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);


  // Modal de agregar producto
  const [showModal, setShowModal] = useState(false);
  const [nombreProducto, setNombreProducto] = useState("");
  const [descripcionProducto, setDescripcionProducto] = useState("");
  const [precioProducto, setPrecioProducto] = useState<number>(0);
  const [urlProducto, setUrlProducto] = useState("");

  // Cargar platos
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

  // LOGIN REAL
  const login = () => {
    if (loginUser === "admin" && loginPass === "1234") {
      setRol("admin");
      setLogged(true);
      setMostrarLogin(false);
      return;
    }
    if (loginUser === "moto" && loginPass === "1234") {
      setRol("motorizado");
      setLogged(true);
      setMostrarLogin(false);
      return;
    }
    alert("Usuario o contraseña incorrectos");
  };

  // CARRITO
  const agregarAlCarrito = (plato: Plato) => {
    setCarrito(prev => {
      const idx = prev.findIndex(p => p._id === plato._id);
      if (idx >= 0) {
        const copia = [...prev];
        copia[idx] = {
          ...copia[idx],
          cantidad: (copia[idx].cantidad || 1) + 1,
        };
        return copia;
      }
      return [...prev, { ...plato, cantidad: 1 }];
    });
  };

  const quitarDelCarrito = (id: string) => {
    setCarrito(prev => prev.filter(p => p._id !== id));
  };

  const cambiarCantidad = (id: string, cantidad: number) => {
    setCarrito(prev =>
      prev.map(p =>
        p._id === id ? { ...p, cantidad: Math.max(1, cantidad) } : p
      )
    );
  };

  const crearPlatoBackend = async () => {
    if (!nombreProducto || !descripcionProducto || !precioProducto || !urlProducto) {
      return alert("Completa todos los campos del producto.");
    }
    try {
      const nuevo = {
        nombre: nombreProducto,
        descripcion: descripcionProducto,
        precio: precioProducto,
        imagen: urlProducto,
      };

      const res = await fetch(`${API}/platos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo),
      });

      if (!res.ok) throw new Error("Error creando plato");
      const data = await res.json();
      const platoCreado = data.plato || data;

      setMisPlatos(prev => [platoCreado, ...prev]);
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

  const finalizarPedido = async (cliente: Cliente & { pagado?: number }) => {
    if (carrito.length === 0) return alert("El carrito está vacío");

    const total = carrito.reduce(
      (acc, p) => acc + p.precio * (p.cantidad || 1),
      0
    );

    const pagado = cliente.pagado ?? 0;

    const platosEnviar = carrito.map(p => ({
      _id: p._id,
      cantidad: p.cantidad || 1,
    }));

    const body = {
      cliente: {
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        mesa,
      },
      platos: platosEnviar,
      total,
      pagado,
      estado: pagado >= total ? "Pagado" : "Pendiente",
    };

    try {
      const res = await fetch(`${API}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        return alert("Error guardando pedido: " + err.error);
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

      {/* HEADER */}
      <Header mesa={mesa} abrirLogin={() => setMostrarLogin(true)} />

      {/* LOGIN MODAL */}
      
      {mostrarLogin && (
  <div className="login-modal">
    <div className="login-box">
      <h3>Iniciar sesión</h3>

      <input
        className="form-control mb-2"
        placeholder="Usuario"
        value={loginUser}
        onChange={(e) => setLoginUser(e.target.value)}
      />
      <input
        className="form-control mb-2"
        placeholder="Contraseña"
        type="password"
        value={loginPass}
        onChange={(e) => setLoginPass(e.target.value)}
      />

      <button className="btn btn-pink w-100" onClick={login}>
        Ingresar
      </button>

      <button
        className="btn btn-secondary mt-2 w-100"
        onClick={() => setMostrarLogin(false)}
      >
        Cancelar
      </button>

      <button
  className="btn btn-outline-primary mt-2 w-100"
  onClick={() => setMostrarRegistro(true)}
>
  Registrarse
</button>

    </div>
  </div>
  
  
)}

{mostrarRegistro && (
  <Registro onClose={() => setMostrarRegistro(false)} />
)}


      <main className="max-w-6xl mx-auto px-3">

        {/* MODAL AGREGAR PRODUCTO */}
{showModal && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setShowModal(false)}>
        &times;
      </button>
      <h2>Agregar Producto</h2>
      <input
        type="text"
        placeholder="Nombre del producto"
        value={nombreProducto}
        onChange={(e) => setNombreProducto(e.target.value)}
        className="form-control mb-2"
      />
      <input
        type="text"
        placeholder="Descripción"
        value={descripcionProducto}
        onChange={(e) => setDescripcionProducto(e.target.value)}
        className="form-control mb-2"
      />
      <input
        type="number"
        placeholder="Precio"
        value={precioProducto}
        onChange={(e) => setPrecioProducto(Number(e.target.value))}
        className="form-control mb-2"
      />
      <input
        type="text"
        placeholder="URL Imagen"
        value={urlProducto}
        onChange={(e) => setUrlProducto(e.target.value)}
        className="form-control mb-2"
      />
      <button className="btn btn-pink w-100" onClick={crearPlatoBackend}>
        Agregar
      </button>
    </div>
  </div>
)}


        {/* ROLES */}
        {logged && rol === "admin" && <AdminPanel />}
        {logged && rol === "motorizado" && <MotorizadoPanel />}

        {/* CLIENTE */}
        {(!logged || rol === "cliente") && (
          <>
            {vista === "menu" && (
              <>
                <div className="d-flex justify-content-between align-items-center my-2">
                  <input
                    style={{ width: 70 }}
                    value={mesa}
                    onChange={(e) => setMesa(e.target.value)}
                    className="form-control"
                  />

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
              </>
            )}

            {vista === "form" && carrito.length > 0 && (
              <FormCliente
                carrito={carrito}
                mesa={mesa}
                onFinalizar={finalizarPedido}
                onVolver={() => setVista("menu")}
              />
            )}

            {vista === "confirmado" && pedidoFinal && (
              <PedidoConfirmado
                pedido={pedidoFinal}
                onContinuar={() => setVista("factura")}
              />
            )}

            {vista === "factura" && pedidoFinal && <Factura pedido={pedidoFinal} />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
