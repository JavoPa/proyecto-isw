import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/" className="navbar-link">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/becas" className="navbar-link">Becas</Link>
        </li>
        <li className="navbar-item">
          <Link to="/postular" className="navbar-link">Postular</Link>
        </li>
        <li className="navbar-item">
          <Link to="/postulacion/estado" className="navbar-link">Estado</Link>
        </li>
        <li className="navbar-item">
          <Link to="/postulacion/apelar" className="navbar-link">Apelar</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;