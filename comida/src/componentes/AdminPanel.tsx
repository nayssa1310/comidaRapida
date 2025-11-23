import { useEffect, useState } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";

const API = "http://localhost:4000";

export default function AdminPanel() {
  const [vista, setVista] = useState<"productos" | "pedidos" | "clientes">(
    "productos"
  );

  const [productos, setProductos] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);

  // MODAL AGREGAR PRODUCTO
  const [showAdd, setShowAdd] = useState(false);
  const handleClose = () => setShowAdd(false);
  const handleShow = () => setShowAdd(true);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [imagen, setImagen] = useState("");

  // =======================================================
  // CARGAR PRODUCTOS
  // =======================================================
  const cProductos = async () => {
    const res = await fetch(`${API}/platos`);
    const data = await res.json();
    setProductos(data);
  };

  // =======================================================
  // CARGAR PEDIDOS
  // =======================================================
  const cPedidos = async () => {
    const res = await fetch(`${API}/pedidos`);
    const data = await res.json();
    setPedidos(data);
  };

  // =======================================================
  // CARGAR CLIENTES
  // =======================================================
  const cClientes = async () => {
    const res = await fetch(`${API}/clientes`);
    const data = await res.json();
    setClientes(data);
  };

  useEffect(() => {
    cProductos();
    cPedidos();
    cClientes();
  }, []);

  // =======================================================
  // CREAR PRODUCTO
  // =======================================================
  const agregarProducto = async () => {
    if (!nombre || !descripcion || !precio || !imagen) {
      return alert("Completa todos los campos");
    }

    const body = {
      nombre,
      descripcion,
      precio,
      imagen,
      stock,
    };

    const res = await fetch(`${API}/platos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) return alert("Error creando producto");

    await cProductos();

    setNombre("");
    setDescripcion("");
    setPrecio(0);
    setStock(0);
    setImagen("");

    handleClose();
  };

  return (
    <div className="container-fluid mt-3">
      <div className="row">

        {/* =======================================================
            SIDEBAR
        ======================================================= */}
        <div className="col-12 col-md-3 col-lg-2 bg-light p-3 rounded shadow-sm">
          <h4 className="text-center mb-4 text-primary fw-bold">Admin</h4>

          <Button
            className="mb-2 w-100"
            variant={vista === "productos" ? "primary" : "outline-primary"}
            onClick={() => setVista("productos")}
          >
            Productos
          </Button>

          <Button
            className="mb-2 w-100"
            variant={vista === "pedidos" ? "primary" : "outline-primary"}
            onClick={() => setVista("pedidos")}
          >
            Pedidos
          </Button>

          <Button
            className="mb-2 w-100"
            variant={vista === "clientes" ? "primary" : "outline-primary"}
            onClick={() => setVista("clientes")}
          >
            Clientes
          </Button>

          {vista === "productos" && (
            <Button className="mt-3 w-100" variant="success" onClick={handleShow}>
              + Agregar Producto
            </Button>
          )}
        </div>

        {/* =======================================================
            CONTENIDO
        ======================================================= */}
        <div className="col-12 col-md-9 col-lg-10">

          {/* =======================================================
              VISTA PRODUCTOS
          ======================================================= */}
          {vista === "productos" && (
            <>
              <h3 className="mt-3 mb-3">Productos</h3>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio (S/.)</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <img
                          src={p.imagen}
                          style={{ width: 80, height: 80, objectFit: "cover" }}
                        />
                      </td>
                      <td>{p.nombre}</td>
                      <td>{p.descripcion}</td>
                      <td>S/ {p.precio}</td>
                      <td>{p.stock ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          {/* =======================================================
              VISTA PEDIDOS
          ======================================================= */}
          {vista === "pedidos" && (
            <>
              <h3 className="mt-3 mb-3">Pedidos</h3>

              <Table bordered hover striped responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Mesa</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((p) => (
                    <tr key={p._id}>
                      <td>{p._id}</td>
                      <td>{p.cliente.nombre}</td>
                      <td>S/ {p.total}</td>
                      <td>{p.cliente.mesa}</td>
                      <td>{p.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          {/* =======================================================
              VISTA CLIENTES
          ======================================================= */}
          {vista === "clientes" && (
            <>
              <h3 className="mt-3 mb-3">Clientes Registrados</h3>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((c) => (
                    <tr key={c._id}>
                      <td>{c.nombre}</td>
                      <td>{c.telefono}</td>
                      <td>{c.direccion}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </div>
      </div>

      {/* =======================================================
          MODAL AGREGAR PRODUCTO
      ======================================================= */}
      <Modal show={showAdd} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar producto</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                value={precio}
                onChange={(e) => setPrecio(Number(e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>URL Imagen</Form.Label>
              <Form.Control
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="success" onClick={agregarProducto}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
