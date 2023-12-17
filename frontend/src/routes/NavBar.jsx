import { Link, useLocation } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className={`navbar-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Link to="/" className="navbar-link">Home</Link>
        </li>
        <li className={`navbar-item ${location.pathname === '/becas' ? 'active' : ''}`}>
          <Link to="/becas" className="navbar-link">Becas</Link>
        </li>
        <li className={`navbar-item ${location.pathname === '/postulacion/becas' ? 'active' : ''}`}>
          <Link to="/postulacion/becas" className="navbar-link">Postular</Link>
        </li>
        <li className={`navbar-item ${location.pathname === '/postulacion/estado' ? 'active' : ''}`}>
          <Link to="/postulacion/estado" className="navbar-link">Estado</Link>
        </li>
        <li className={`navbar-item ${location.pathname === '/postulacion/apelar' ? 'active' : ''}`}>
          <Link to="/postulacion/apelar" className="navbar-link">Apelar</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;