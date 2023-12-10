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
  const [fechaFin, setFechaFin] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(null);

  useEffect(() => {
    getEstado().then((response) => {
      if(response.state === "Success") {
        if (response.data.postulacion.estado != "Rechazada") {
          setErrorEstado("No presentas una postulación rechazada");
          return;
        }else{
          setPostulacion(response.data.postulacion);
          setFechaFin(response.data.fecha_fin_apelacion);
          setFechaInicio(response.data.fecha_inicio_apelacion);
        }
        if (response.data.apelacion) { //En caso de que exista apelacion
          setApelacion(response.data.apelacion);
          setErrorEstado("Ya tienes una apelación en proceso");
        }
      }else{
        setErrorEstado(response.message);
      }
    });
  }, []);

  return (
    <>
      {errorApelacion && <div className="error-banner">{errorApelacion}</div>}
        {postulacion && !apelacion ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Formulario de Apelación</h2>
          <p><strong>Beca a apelar:</strong> {postulacion.beca.nombre}</p>
          <p><strong>Periodo de apelacion:</strong> Del {fechaInicio} al {fechaFin}</p>
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
            <>
            <p className='campo-obligatorio'>*El encargado no ha indicado documentos faltantes.</p>
            <label className="input-label" htmlFor="archivoPDF">Documento faltante</label>
            <input
              id="archivoPDF"
              name="archivoPDF"
              type="file"
              {...register('archivoPDF', { required: true })}
            />
            {errors.archivoPDF && <span>*Por favor, sube tus documentos</span>}
            </>
          )}
          <input type="submit" />
        </form>
        ) : (
          <>
            {errorEstado && <div className="error-banner">{errorEstado}</div>}
            <button className='boton-centrado' onClick={() => navigate('/postulacion/estado')}>Ver estado</button>
          </>
        )}
    </>
  );
}

export default ApelarForm;