import '../App.css'
interface HeaderProps {
  mesa: string;
  abrirLogin: () => void; // ← CORRECTO
}

export default function Header({ mesa, abrirLogin }: HeaderProps) {
  return (
    <header className="header-sticky p-3 mb-4 shadow">
      <div className="container d-flex justify-content-between align-items-center">

        {/* LOGO + NOMBRE */}
        <div className="d-flex align-items-center gap-2">
          <img src="/logo.png" alt="Logo" width={50} />
          <h1 className="text-pink-700 fw-bold">Delicias Rápidas</h1>
        </div>

        {/* NAVEGACIÓN */}
        <div className="d-flex gap-3 align-items-center">
          <span className="fw-bold">Mesa: {mesa}</span>
          <nav className="d-flex gap-3">
            <a href="#" className="text-decoration-none text-pink-700 fw-semibold">Inicio</a>
            <a href="#" className="text-decoration-none text-pink-700 fw-semibold">Menú</a>
            <a href="#" className="text-decoration-none text-pink-700 fw-semibold">Contacto</a>
          </nav>
        </div>

        {/* ICONO LOGIN */}
        <div className="iconos-header">
          <i
            className="fa-solid fa-user fs-4"
            style={{ cursor: "pointer", color: "#d63384" }}
            onClick={abrirLogin}  
          ></i>
        </div>

      </div>
    </header>
  );
}
