import { useRouteError, Link, useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const isEncargado = user.roles && user.roles.length > 0 && user.roles[0].name === 'encargado';
  const isPostulante = user.roles && user.roles.length > 0 && user.roles[0].name === 'postulante';

  const handleButtonClick = () => {
    if (isEncargado) {
      navigate('/gestion');
    } else if (isPostulante) {
      navigate('/');
    }
  };

  console.error({
    status: error.status,
    statusText: error.statusText,
    message: error.message ? error.message : 'No message',
  });

  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, un error inesperado ha ocurrido.</p>
      <button onClick={handleButtonClick}>Volver a Inicio</button>
    </div>
  );
};

export default ErrorPage;
