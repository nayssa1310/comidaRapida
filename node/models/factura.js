import mongoose from "mongoose";

const FacturaSchema = new mongoose.Schema({
  pedido: { type: mongoose.Schema.Types.ObjectId, ref: "Pedido", required: true },
  pdfPath: String,
  creado_en: { type: Date, default: Date.now },
});

export default mongoose.model("Factura", FacturaSchema);
