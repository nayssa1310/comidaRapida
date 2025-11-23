import { useState } from "react";
import "./Login.css";

interface Props {
  cerrar: () => void;
  setRol: (rol: "cliente" | "admin" | "motorizado") => void;
}

export default function Login({ cerrar, setRol }: Props) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const manejarLogin = () => {
    // LOGIN SUPER SIMPLE PARA ROL (puedes luego conectar con BD)
    if (usuario === "admin" && password === "123") {
      setRol("admin");
      cerrar();
    } else if (usuario === "moto" && password === "123") {
      setRol("motorizado");
      cerrar();
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-modal">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>

        <input 
          type="text" 
          placeholder="Usuario" 
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={manejarLogin}>Entrar</button>
        <button className="cerrar" onClick={cerrar}>Cerrar</button>
      </div>
    </div>
  );
}
