
import "../App.css";

interface LoginModalProps {
  abrir: boolean;
  cerrar: () => void;
}

export default function LoginModal({ abrir, cerrar }: LoginModalProps) {
  if (!abrir) return null;

  return (
    <div className="modal-overlay" onClick={cerrar}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={cerrar}>
          &times;
        </button>
        <h2>Login</h2>
        <form>
          <div className="form-group">
            <label>Usuario</label>
            <input type="text" placeholder="Nombre de usuario" />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" placeholder="Contraseña" />
          </div>
          <button type="submit" className="btn-login">Ingresar</button>
        </form>
      </div>
    </div>
  );
}
