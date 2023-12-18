import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  if (localStorage.getItem("user")) {
    return (
      <>
        <h2>Ya estas logeado!</h2>
        <button onClick={() => navigate("/")}>Ir a home</button>
      </>
    );
  }

  return (
    <div>
      <h2>Inicia sesion!</h2>
      <LoginForm />
      <button onClick={() => navigate("/")}>Volver a home</button>
      <div className="centrado">
        <h2>No tienes una cuenta? Regístrate!</h2>
        <button onClick={() => navigate("/register")}>Registrarse</button>
      </div>
    </div>
  );
}

export default Login;
