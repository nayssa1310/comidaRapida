import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    telefono: { type: String, required: true },
    direccion: { type: String, required: true },
    mesa: { type: String },
    pagado: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Cliente', clienteSchema);
