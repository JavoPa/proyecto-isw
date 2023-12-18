import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { login } from '../services/auth.service';
import { useState } from 'react';

function LoginForm() {
  const navigate = useNavigate();
  const [errorLogin, setErrorLogin] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    login(data).then((response) => {
      if(response.state === 'Success'){
        const user = JSON.parse(localStorage.getItem('user')) || '';
        const firstRoleName = user.roles[0].name;
        console.log("rol:");
        console.log(firstRoleName);
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
    <form onSubmit={handleSubmit(onSubmit)}>
      {errorLogin && <div className="error-banner">{errorLogin}</div>}
      <input
        name="email"
        type="email"
        {...register('email', { required: true })}
      />
      <input
        type="password"
        name="password"
        {...register('password', { required: true })}
      />
      {errors.exampleRequired && <span>This field is required</span>}
      <input type="submit" />
    </form>
  );
}

export default LoginForm;
