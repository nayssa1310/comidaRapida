interface HeaderProps {
  mesa: string;
}

export default function Header({ mesa }: HeaderProps) {
  return (
    <header className="header-sticky p-3 mb-4 shadow">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <img src="/logo.png" alt="Logo" width={50} />
          <h1 className="text-pink-700 fw-bold">Delicias Rápidas</h1>
        </div>

        <div className="d-flex gap-3 align-items-center">
          <span className="fw-bold">Mesa: {mesa}</span>
          <nav className="d-flex gap-3">
            <a href="#" className="text-decoration-none text-pink-700 fw-semibold">Inicio</a>
            <a href="#" className="text-decoration-none text-pink-700 fw-semibold">Menú</a>
            <a href="#" className="text-decoration-none text-pink-700 fw-semibold">Contacto</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
