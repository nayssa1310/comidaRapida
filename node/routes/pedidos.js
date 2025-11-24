import { Router } from "express";
import Pedido from "../models/pedido";
import Cliente from "../models/cliente"; 
import auth from "../middleware/auth";

const router = Router();

// Obtener todos los pedidos según rol

router.get("/", auth(["admin", "motorizado"]), async (req, res) => {
    try {
        const pedidos = await Pedido.find()
            .populate("clienteId")
            .populate("platos.platoId");
        res.json(pedidos);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Registrar un nuevo pedido

router.post("/registrar", auth(["admin"]), async (req, res) => {
    try {
        const { nombre, telefono, direccion, mesa, platos } = req.body;

        // Crear cliente
        const cliente = new Cliente({ nombre, telefono, direccion, mesa });
        await cliente.save();

        // Calcular total
        const total = platos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

        // Crear pedido
        const pedido = new Pedido({
            clienteId: cliente._id,
            platos,
            total,
            estado: "pendiente",
            pagado: 0,
        });
        await pedido.save();

        res.status(201).json({ mensaje: "Pedido registrado correctamente", pedido });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put("/pago/:id", auth(["admin", "motorizado"]), async (req, res) => {
    try {
        const { pagado, metodoPago } = req.body;
        const pedido = await Pedido.findById(req.params.id);

        if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });

        pedido.pagado += pagado;
        pedido.metodoPago = metodoPago;

        if (pedido.pagado >= pedido.total) pedido.estado = "pagado";

        await pedido.save();
        res.json({ mensaje: "Pago registrado", pedido });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.put("/estado/:id", auth(["admin", "motorizado"]), async (req, res) => {
    try {
        const pedido = await Pedido.findByIdAndUpdate(
            req.params.id,
            { estado: req.body.estado },
            { new: true }
        );
        res.json({ mensaje: "Estado actualizado", pedido });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
