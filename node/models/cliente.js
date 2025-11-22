
const mongoose = require("mongoose");

const ClienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true },
  mesa: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.models.Cliente || mongoose.model("Cliente", ClienteSchema);
