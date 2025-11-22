
import type { Plato } from "../Types";

interface PropsDishCard {
  plato: Plato;
  onAdd: (plato: Plato) => void;
}

export default function DishCard({ plato, onAdd }: PropsDishCard) {
  return (
    <div className="card mb-3 shadow-sm">
      <img
        src={plato.imagen}
        className="card-img-top"
        alt={plato.nombre}
        style={{height: '200px', objectFit: 'cover'}}
      />
      <div className="card-body">
        <h5 className="card-title">{plato.nombre}</h5>
        <p className="card-text">{plato.descripcion}</p>
        <p className="fw-bold text-primary">S/ {plato.precio.toFixed(2)}</p>
        <button className="btn btn-pastel w-100" onClick={() => onAdd(plato)}>Añadir al carrito</button>
      </div>
    </div>
  );
}
