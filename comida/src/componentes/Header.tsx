import { FaUser } from "react-icons/fa";
import "../App.css";

interface HeaderProps {
  mesa: string;
  abrirLogin: () => void;
}

export default function Header({ mesa, abrirLogin }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-container">

        {/* LOGO + NOMBRE */}
        <div className="header-left">
          <img src="/logo.png" alt="Logo" className="header-logo" />
          <h1 className="header-title">Delicias Rápidas</h1>
        </div>

        {/* MENÚ */}
        <nav className="header-nav">
          <a href="#" className="nav-link">Inicio</a>
          <a href="#" className="nav-link">Menú</a>
          <a href="#" className="nav-link">Contacto</a>
        </nav>

        {/* DERECHA */}
        <div className="header-right">
        

          <FaUser
            className="icon-login"
            onClick={abrirLogin}
          />
        </div>

      </div>
    </header>
  );
}
