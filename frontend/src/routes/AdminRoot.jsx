import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth.service';
import { AuthProvider, useAuth } from '../context/AuthContext';
import AdminNavBar from './AdminNavBar';

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
      <AdminNavBar />
      <div className="user-info">
        <p>Has iniciado como:<br /> <strong>{user.email}</strong></p>
        <button onClick={() => navigate('/gestion')}>Gestionar</button>
        <button onClick={handleLogout}>Cerrar sesion</button>
      </div>
      <Outlet />
    </div>
  );
}

export default Root;
