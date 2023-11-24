import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { apelar } from '../services/apelacion.service';
import { useState, useEffect } from 'react';
import { getEstado } from "../services/estado.service";

function ApelarForm() {
  const navigate = useNavigate();
  const [errorApelacion, setErrorApelacion] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Aquí puedes manejar la subida del archivo
    const motivo = data.motivo;
    const files = Object.keys(data)
      .filter(key => key.startsWith('archivoPDF'))
      .flatMap(key => Array.from(data[key]));

    if (!files) {
      setErrorApelacion('Para apelar se deben subir los documentos faltantes');
      return;
    }
    if (!motivo) {
      setErrorApelacion('Para apelar se debe ingresar el motivo de la apelación');
      return;
    }
    apelar(motivo, files).then((response) => {
      if (response.state === 'Success') {
        navigate('/postulacion/estado', { state: { success: response.data } });
      } else {
        setErrorApelacion(response.message);
      }
    });
  };

  //Obtencion de documentosFaltantes
  const [postulacion, setPostulacion] = useState(null);
  const [apelacion, setApelacion] = useState(null);
  const [errorEstado, setErrorEstado] = useState(null);
  useEffect(() => {
    getEstado().then((response) => {
      if(response.state === "Success") {
        setPostulacion(response.data.postulacion);
        if (response.data.apelacion) { //En caso de que exista apelacion
          setApelacion(response.data.apelacion);
        }
      }else{
        console.log(response.message);
        setErrorEstado(response.message);
      }
    });
  }, []);

  return (
    <>
      {errorApelacion && <div className="error-banner">{errorApelacion}</div>}
        {postulacion ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Formulario de Apelación</h2>
          <p><strong>Beca a apelar:</strong> {postulacion.beca.nombre}</p>
          <label className="input-label" htmlFor="motivo"><strong>Motivo de la apelación</strong></label>
          <input
            id="motivo"
            name="motivo"
            type="text"
            {...register('motivo', { required: true })}
          />
          {errors.motivo && <span className='campo-obligatorio'>*Por favor, ingresa el motivo de la apelación</span>}
          <label><strong>Subir documentos</strong></label>
          {postulacion.documentosFaltantes && postulacion.documentosFaltantes.length > 0 ? (
            postulacion.documentosFaltantes.map((documento, index) => (
              <div key={index}>
                <label className="label-file" htmlFor={`archivoPDF${index}`}>
                  {documento}
                  <input
                    id={`archivoPDF${index}`}
                    name={`archivoPDF${index}`}
                    type="file"
                    className='input-file'
                    {...register(`archivoPDF${index}`, { required: true })}
                  />
                </label>
                {errors[`archivoPDF${index}`] && <span className='campo-obligatorio'>*Por favor, sube tus documentos</span>}
              </div>
            ))
          ) : (
            <p>No hay documentos faltantes para subir.</p>
          )}
          <input type="submit" />
        </form>
        ) : (
          <div>{errorEstado && <div className="error-banner">{errorEstado}</div>}</div>
        )}
    </>
  );
}

export default ApelarForm;