import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth.service';
import { AuthProvider, useAuth } from '../context/AuthContext';
import NavBar from './NavBar';

function Root() {
  return (
    <AuthProvider>
      <PageRoot />
    </AuthProvider>
  );
}

function PageRoot() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const { user } = useAuth();

  return (
    <div>
      <NavBar />
      <div className="user-info">
        <p>Has iniciado como:<br /> <strong>{user.email}</strong></p>
        <button onClick={handleLogout}>Cerrar sesion</button>
      </div>
      <footer>
        <p>© 2023 - Municipalidad</p>
      </footer>
      <Outlet />
    </div>
  );
}

export default Root;
