import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ["cliente", "admin", "motorizado"], default: "cliente" }
});

export default mongoose.model("Usuario", UsuarioSchema);
