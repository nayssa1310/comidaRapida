import { Router } from "express";
import Plato from "../models/Plato";
import auth from "../middleware/auth";

const router = Router();

// Crear plato (admin)
router.post("/", auth(["admin"]), async (req, res) => {
    try {
        const plato = new Plato(req.body);
        await plato.save();
        res.status(201).json(plato);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Editar plato
router.put("/:id", auth(["admin"]), async (req, res) => {
    try {
        const plato = await Plato.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(plato);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Eliminar plato
router.delete("/:id", auth(["admin"]), async (req, res) => {
    try {
        await Plato.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "Plato eliminado" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Obtener todos los platos
router.get("/", async (req, res) => {
    try {
        const platos = await Plato.find();
        res.json(platos);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
