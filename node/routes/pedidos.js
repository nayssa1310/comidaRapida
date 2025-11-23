import { Router } from "express";
import Pedido from "../models/Pedido";
import auth from "../middleware/auth";

const router = Router();

// Obtener pedidos según rol
router.get("/", auth(["admin", "motorizado"]), async (req, res) => {
    try {
        const pedidos = await Pedido.find().populate("clienteId").populate("platos.platoId");
        res.json(pedidos);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Actualizar estado del pedido
router.put("/:id", auth(["admin", "motorizado"]), async (req, res) => {
    try {
        const pedido = await Pedido.findByIdAndUpdate(req.params.id, { estado: req.body.estado }, { new: true });
        res.json(pedido);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
