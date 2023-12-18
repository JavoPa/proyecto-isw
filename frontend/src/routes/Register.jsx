import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { registerUser } from '../services/auth.service';
import { useState } from 'react';

function Register() {
  const navigate = useNavigate();
  const [errorLogin, setErrorLogin] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    registerUser(data).then((response) => {
      data.rut = parseInt(data.rut);
      console.log(data)
      if (response.state === 'Success') {
        navigate('/auth', { state: { success: response.data } });
      } else {
        setErrorLogin(response.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errorLogin && <div className="error-banner">{errorLogin}</div>}
      <label>
        Nombres:
        <input name="nombres" {...register('nombres', { required: true })} />
      </label>
      <label>
        Apellidos:
        <input name="apellidos" {...register('apellidos', { required: true })} />
      </label>
      <label>
        RUT:
        <input name="rut" placeholder='123456789'{...register('rut', { required: true })} />
        <br />
        (sin puntos ni guión. Si es -k reemplace por 0)
      </label>
      <label>
        Contraseña:
        <input type="password" name="password" {...register('password', { required: true })} />
      </label>
      <label>
        Email:
        <input name="email" type="email" {...register('email', { required: true })} />
      </label>
      <label>
        Dirección:
        <input name="direccion" {...register('direccion', { required: true })} />
      </label>
      <label>
        Teléfono: +56
        <input name="telefono" {...register('telefono', { required: true })} />
      </label>
      <label>
        Fecha de Nacimiento:
        <input name="fecha_nacimiento" type="date" {...register('fecha_nacimiento', { required: true })} />
      </label>
      <label>
        Sexo:
        <select name="sexo" {...register('sexo', { required: true })}>
          <option value="">Select...</option>
          <option value="masculino">masculino</option>
          <option value="femenino">femenino</option>
        </select>
      </label>
      <label>
        Discapacidad:
        <select name="discapacidad" {...register('discapacidad', { required: true })}>
          <option value="">Select...</option>
          <option value="1">Sí</option>
          <option value="0">No</option>
        </select>
      </label>
      <label>
        Cuenta Bancaria:
        <input name="cuenta_bancaria" {...register('cuenta_bancaria', { required: true })} />
      </label>
      {errors.exampleRequired && <span>This field is required</span>}
      <input type="submit" />
    </form>
  );
}

export default Register;