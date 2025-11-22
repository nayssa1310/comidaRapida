
import DishCard from "./DishCard";
import type { Plato } from "../Types";

interface PropsMenu {
  platos: Plato[];
  onAdd: (plato: Plato) => void;
}

export default function Menu({ platos, onAdd }: PropsMenu) {
  if (!platos) return <p className="text-center mt-4">Cargando menú...</p>;
  if (platos.length === 0) return <p className="text-center mt-4 text-danger">No hay platos disponibles</p>;

  return (
    <div className="container row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
      {platos.map(p => (
        <div className="col" key={p._id}>
          <DishCard plato={p} onAdd={onAdd} />
        </div>
      ))}
    </div>
  );
}
