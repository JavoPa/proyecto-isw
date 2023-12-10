import ApelarForm from '../components/ApelarForm';
import { useNavigate } from 'react-router-dom';

function Apelar() {
  const navigate = useNavigate();

  if (localStorage.getItem('user')) {
    return (
      <div>
        <ApelarForm />
      </div>
    );
  }

  return (
    <div>
      <h2>Inicia sesion!</h2>
      <button onClick={() => navigate('/auth')}>Iniciar sesión</button>
      <button onClick={() => navigate('/')}>Volver a home</button>
    </div>
  );
}

export default Apelar;