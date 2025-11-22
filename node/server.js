// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// -------------------------
// Config ES Modules
// -------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------
// Modelos
// -------------------------
const PlatoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: { type: Number, required: true },
  imagen: String,
}, { timestamps: true });

const ClienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true },
  mesa: { type: String, required: true },
}, { timestamps: true });

const PedidoSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente", required: true },
  platos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Plato", required: true }],
  total: { type: Number, required: true },
  pagado: { type: Number, required: true },
  estado: { type: String, required: true },
  tiempo: { type: Number, default: 300 }
}, { timestamps: true });

const Plato = mongoose.model("Plato", PlatoSchema);
const Cliente = mongoose.model("Cliente", ClienteSchema);
const Pedido = mongoose.model("Pedido", PedidoSchema);

// -------------------------
// Carpeta PDFs
// -------------------------
const BOLETAS_DIR = path.join(__dirname, "boletas");
if (!fs.existsSync(BOLETAS_DIR)) fs.mkdirSync(BOLETAS_DIR);

// -------------------------
// App
// -------------------------
const app = express();
app.use(cors());
app.use(bodyParser.json());

// -------------------------
// Conexión MongoDB
// -------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error("Error Mongo:", err));

// -------------------------
// Endpoints Platos
// -------------------------
app.get("/platos", async (req, res) => {
  try {
    const platos = await Plato.find();
    res.json(platos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo platos" });
  }
});

app.post("/platos", async (req, res) => {
  try {
    const plato = new Plato(req.body);
    await plato.save();
    res.status(201).json(plato);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo guardar el plato" });
  }
});

// -------------------------
// Endpoints Pedidos
// -------------------------
app.post("/pedidos", async (req, res) => {
  try {
    const { cliente: clienteData, platos: platosData, total, pagado, estado } = req.body;

    if (!clienteData || !clienteData.nombre || !clienteData.telefono || !clienteData.direccion || !clienteData.mesa) {
      return res.status(400).json({ error: "Datos de cliente incompletos" });
    }

    if (!platosData || !platosData.length) {
      return res.status(400).json({ error: "No se seleccionaron platos" });
    }

    // Guardar cliente
    const cliente = new Cliente(clienteData);
    await cliente.save();

    // Guardar pedido
    const pedido = new Pedido({
      cliente: cliente._id,
      platos: platosData.map(p => p._id), // Enviar objetos con _id desde el frontend
      total,
      pagado,
      estado
    });
    await pedido.save();

    // Poblar datos para frontend
    const pedidoPop = await Pedido.findById(pedido._id)
      .populate("cliente")
      .populate("platos");

    // ---------------- PDF opcional ----------------
    const pdfPath = path.join(BOLETAS_DIR, `${pedido._id}.pdf`);
    const doc = new PDFDocument({ margin: 30 });
    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(20).text("🧾 Boleta Delicias Rápidas", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Mesa: ${pedidoPop.cliente.mesa}`);
    doc.text(`Cliente: ${pedidoPop.cliente.nombre}`);
    doc.text(`Teléfono: ${pedidoPop.cliente.telefono}`);
    doc.text(`Dirección: ${pedidoPop.cliente.direccion}`);
    doc.moveDown();

    doc.text("Platos:", { underline: true });
    pedidoPop.platos.forEach((p, i) => {
      doc.text(`${i + 1}. ${p.nombre} - S/ ${p.precio.toFixed(2)}`);
    });
    doc.moveDown();
    doc.text(`Total: S/ ${pedidoPop.total.toFixed(2)}`);
    doc.text(`Pagado: S/ ${pedidoPop.pagado.toFixed(2)}`);
    doc.text(`Pendiente: S/ ${(pedidoPop.total - pedidoPop.pagado).toFixed(2)}`);
    doc.text(`Estado: ${pedidoPop.estado}`);
    doc.end();

    // Agregar pdfPath a la respuesta
    const pedidoObj = pedidoPop.toObject();
    pedidoObj.pdfPath = `/boletas/${pedido._id}.pdf`;

    res.status(201).json(pedidoObj);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar pedido" });
  }
});

// Servir PDFs
app.use("/boletas", express.static(BOLETAS_DIR));

app.get("/", (req, res) => res.send("Servidor funcionando en ES Modules"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

