import "./LoginModal.css";
import { useState } from "react";

interface PropsLogin {
  visible: boolean;
  onClose: () => void;
  onLogin: (role: "admin" | "motorizado") => void;
}

export default function LoginModal({ visible, onClose, onLogin }: PropsLogin) {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  if (!visible) return null;

  const validar = () => {
    if (usuario === "admin" && clave === "1234") {
      onLogin("admin");
      onClose();
    } else if (usuario === "moto" && clave === "1234") {
      onLogin("motorizado");
      onClose();
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal-content">
        <h2>Iniciar Sesión</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />

        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>

          <button className="btn-login" onClick={validar}>
            Ingresar
          </button>
        </div>
      </div>
    </div>
  );
}
