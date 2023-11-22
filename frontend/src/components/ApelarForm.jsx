import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { apelar } from '../services/apelacion.service';
import { useState } from 'react';

function ApelarForm() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Aquí puedes manejar la subida del archivo
    const file = data.archivoPDF[0];
    apelar(file).then((response) => {
      if (response.state === 'Success') {
        navigate('/postulacion/estado', { state: { success: response.data } });
      } else {
        setError(response.message);
      }
    });
  };

  return (
    <>
      {error && <div className="error-banner">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Formulario de Apelación</h2>
        <label className="input-label" htmlFor="archivoPDF"><strong>Subir documentos</strong></label>
        <input
          id="archivoPDF"
          name="archivoPDF"
          type="file"
          {...register('archivoPDF', { required: true })}
        />
        {errors.archivoPDF && <span>*Por favor, sube tus documentos</span>}
        <input type="submit" />
      </form>
    </>
  );
}

export default ApelarForm;