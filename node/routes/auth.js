import express from "express";
import Usuario from "../models/usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET = "DELIVERY123";


// REGISTRO SOLO CLIENTES
router.post("/register", async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        const existe = await Usuario.findOne({ correo });
        if (existe) return res.status(400).json({ error: "Correo ya registrado" });

        const hash = await bcrypt.hash(password, 10);

        const nuevo = await Usuario.create({
            nombre,
            correo,
            password: hash,
            rol: "cliente"
        });

        res.json({ msg: "Cliente registrado", usuario: nuevo });

    } catch (e) {
        res.status(500).json({ error: "Error registrando usuario" });
    }
});


// LOGIN (todos los roles)
router.post("/login", async (req, res) => {
    try {
        const { correo, password } = req.body;

        const user = await Usuario.findOne({ correo });
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(400).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign({ id: user._id, rol: user.rol }, SECRET, { expiresIn: "7d" });

        res.json({
            msg: "Login correcto",
            token,
            usuario: {
                nombre: user.nombre,
                correo: user.correo,
                rol: user.rol
            }
        });

    } catch (e) {
        res.status(500).json({ error: "Error en login" });
    }
});

export default router;
