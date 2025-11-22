import mongoose from "mongoose";

const PlatoSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  categoria: String,
  imagen: String,
});

export default mongoose.model("Plato", PlatoSchema);

