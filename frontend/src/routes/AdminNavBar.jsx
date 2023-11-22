import { Link } from 'react-router-dom';

function AdminNavBar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/gestion" className="navbar-link">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/gestion/postulaciones" className="navbar-link">Postulaciones</Link>
        </li>
        <li className="navbar-item">
          <Link to="/gestion/becas" className="navbar-link">Becas</Link>
        </li>
        <li className="navbar-item">
          <Link to="/gestion/apelaciones" className="navbar-link">Apelaciones</Link>
        </li>
      </ul>
    </nav>
  );
}

export default AdminNavBar;