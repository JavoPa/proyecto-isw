import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { login } from '../services/auth.service';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  const [errorLogin, setErrorLogin] = useState(null);
  const location = useLocation();
  const successData = location.state && location.state.success;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    login(data).then((response) => {
      if(response.state === 'Success'){
        console.log("roli");
        const user = JSON.parse(localStorage.getItem('user')) || '';
        console.log("rola");
        const firstRoleName = user.roles[0].name;
        console.log("rol:");
        console.log(firstRoleName);
        console.log("rolb");
        if(firstRoleName == "postulante"){
          navigate('/');
        }else if(firstRoleName == "encargado"){  
          navigate('/gestion');
        }
      }else{
        setErrorLogin(response.message);
      }
    });
  };

  return (
    <>{successData && (
      <div className="success-banner">
        <p>Cuenta creada con éxito</p>
      </div>
    )}
    <form onSubmit={handleSubmit(onSubmit)}>
      {errorLogin && <div className="error-banner">{errorLogin}</div>}
      <input
        name="email"
        type="email"
        placeholder='Ingrese su email'
        {...register('email', { required: true })}
      />
      <input
        type="password"
        name="password"
        placeholder='Ingrese su clave'
        {...register('password', { required: true })}
      />
      {errors.exampleRequired && <span>This field is required</span>}
      <input type="submit" />
    </form>
    </>
  );
}

export default LoginForm;
