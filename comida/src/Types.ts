// Types.ts
export interface Plato {
  _id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  cantidad?: number; // Para el pedido
  imagen?: string;
}

export interface Cliente {
  _id?: string;
  nombre: string;
  telefono: string;
  direccion: string;
  mesa: string;
}

export interface Pedido {
  _id: string;
  cliente: Cliente;
  platos: Plato[];
  total: number;
  pagado: number;
  estado: string;
  tiempo?: number;
  pdfPath?: string; 
}
