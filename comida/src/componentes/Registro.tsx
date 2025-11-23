import { useState } from "react";

export default function Registro({ onClose }: { onClose: () => void }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const registrar = async () => {
    const res = await fetch("http://localhost:4000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, password }),
    });

    const data = await res.json();

    if (!res.ok) return alert(data.error);
    alert("Registrado correctamente");
    onClose();
  };

  return (
    <div className="login-modal">
      <div className="login-box">
        <h3>Registro de Cliente</h3>

        <input
          className="form-control mb-2"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-pink w-100" onClick={registrar}>
          Registrarse
        </button>

        <button className="btn btn-secondary mt-2 w-100" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
