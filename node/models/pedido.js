import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    platos: [{ nombre: String, cantidad: Number, precio: Number }],
    total: { type: Number, required: true },
    estado: { type: String, enum: ['pendiente', 'entregado'], default: 'pendiente' },
    pagado: { type: Number, default: 0 },
    metodoPago: { type: String, enum: ['efectivo', 'tarjeta', 'paypal'], default: null }
}, { timestamps: true });

export default mongoose.model('Pedido', pedidoSchema);
