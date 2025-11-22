
const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente", required: true },
  platos: [{
    plato: { type: mongoose.Schema.Types.ObjectId, ref: "Plato", required: true },
    cantidad: { type: Number, required: true, default: 1 }
  }],
  total: { type: Number, required: true, default: 0 },
  pagado: { type: Number, required: true, default: 0 },
  estado: { type: String, required: true, default: "Pendiente" },
  tiempo: { type: Number, default: 300 },
}, { timestamps: true });

PedidoSchema.methods.toPopulatedObject = async function() {
  return this.populate("cliente").populate("platos.plato").execPopulate();
};

module.exports = mongoose.models.Pedido || mongoose.model("Pedido", PedidoSchema);
