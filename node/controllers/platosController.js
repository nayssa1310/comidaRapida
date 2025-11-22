// server/controllers/platosController.js
const Plato = require("../models/Plato");

const getPlatos = async (req, res) => {
  try {
    const platos = await Plato.find().sort({ createdAt: -1 });
    res.json(platos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo platos" });
  }
};

const crearPlato = async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen } = req.body;
    if (!nombre || !precio) return res.status(400).json({ error: "Nombre y precio son requeridos" });

    const plato = new Plato({ nombre, descripcion, precio, imagen });
    await plato.save();
    res.status(201).json({ mensaje: "Plato creado", plato });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando plato" });
  }
};

module.exports = { getPlatos, crearPlato };
