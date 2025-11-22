
const Cliente = require("../models/cliente");
const Pedido = require("../models/pedido");
const Plato = require("../models/Plato");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const BOLETAS_DIR = path.resolve(__dirname, "..", "boletas");

if (!fs.existsSync(BOLETAS_DIR)) fs.mkdirSync(BOLETAS_DIR);

const crearPedido = async (req, res) => {
    try {
        const { cliente: clienteData, platos: platosEnviado, total = 0, pagado = 0, estado = "Pendiente" } = req.body;

        if (!clienteData || !clienteData.nombre || !clienteData.telefono || !clienteData.direccion || !clienteData.mesa) {
            return res.status(400).json({ error: "Datos de cliente incompletos" });
        }
        if (!platosEnviado || !Array.isArray(platosEnviado) || platosEnviado.length === 0) {
            return res.status(400).json({ error: "No se seleccionaron platos" });
        }

        // Guardar cliente
        const cliente = new Cliente(clienteData);
        await cliente.save();

        // Convertir platos enviados a formato { plato: ObjectId, cantidad }
        // Aceptamos que cada item sea { _id, cantidad } o simplemente string id
        const platosArray = [];
        for (const item of platosEnviado) {
            const id = item._id || item.plato || item;
            const cantidad = item.cantidad || item.cant || 1;
            // Verificar que exista el plato en BD
            const platoBD = await Plato.findById(id);
            if (!platoBD) {
                return res.status(400).json({ error: `Plato no existe: ${id}` });
            }
            platosArray.push({ plato: platoBD._id, cantidad });
        }

        // Crear pedido
        const nuevoPedido = new Pedido({
            cliente: cliente._id,
            platos: platosArray,
            total,
            pagado,
            estado
        });

        await nuevoPedido.save();

        // Poblar datos para enviar al frontend (platos poblados)
        const pedidoPop = await Pedido.findById(nuevoPedido._id)
            .populate("cliente")
            .populate("platos.plato")
            .exec();

        // Generar PDF (opcional)
        const pdfPath = path.join(BOLETAS_DIR, `${pedidoPop._id}.pdf`);
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
            // p.plato es el documento Plato poblado
            const platoDoc = p.plato;
            doc.text(`${i + 1}. ${platoDoc.nombre} x ${p.cantidad} - S/ ${(platoDoc.precio * p.cantidad).toFixed(2)}`);
        });

        doc.moveDown();
        doc.text(`Total: S/ ${pedidoPop.total.toFixed(2)}`);
        doc.text(`Pagado: S/ ${pedidoPop.pagado.toFixed(2)}`);
        doc.text(`Pendiente: S/ ${(pedidoPop.total - pedidoPop.pagado).toFixed(2)}`);
        doc.text(`Estado: ${pedidoPop.estado}`);
        doc.end();

        // Devolver pedido poblado y ruta al pdf
        const respuesta = {
            ...pedidoPop.toObject(),
            pdfPath: `/boletas/${pedidoPop._id}.pdf`
        };

        res.status(201).json(respuesta);
    } catch (error) {
        console.error("ERROR AL GUARDAR PEDIDO:", error);
        res.status(500).json({ error: "No se pudo guardar el pedido" });
    }
};

const obtenerPedidoPorId = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id).populate("cliente").populate("platos.plato").exec();
        if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });
        res.json(pedido);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener pedido" });
    }
};

module.exports = { crearPedido, obtenerPedidoPorId };
