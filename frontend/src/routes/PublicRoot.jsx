import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth.service';
import { PublicAuthProvider, useAuth } from '../context/PublicAuthContext';
import NavBar from './NavBar';
//Pagina de inicio publica para postulantes no logueados y logeados
function PublicRoot() {
    return (
      <PublicAuthProvider>
        <PageRoot />
      </PublicAuthProvider>
    );
  }
function PageRoot() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleLogin = () => {
    navigate('/auth');
  };
  const { user } = useAuth();
  return (
    <div>
      <NavBar />
      <div className="user-info">
        {user ? (
          <>
            <p>Estás logueado como: {user.email}</p>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <button onClick={handleLogin}>Iniciar sesión</button>
        )}
      </div>
      <Outlet />
    </div>
  );
}

export default PublicRoot;