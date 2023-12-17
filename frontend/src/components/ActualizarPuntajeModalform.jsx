import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getPostulacionById, actualizarPuntaje } from '../services/estado.service';

function ActualizarPuntajeModalForm({id, showModal, setShowModal}) {
    const [errorUpdate, setErrorUpdate] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
  
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();
  
    const onSubmit = (data) => {
      let updateData = { puntaje: data.puntaje };

     actualizarPuntaje(id, updateData).then((response) => {
        if (response.state === 'Success') {
            setShowModal(false);
            setErrorUpdate(null);
            setSuccessMessage('Puntaje actualizado correctamente');
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000); // Desaparece después de 5 segundos
        } else {
          setErrorUpdate(response.message);
        }
      });
    };
  
    //Obtencion de postulacion
    const [postulacion, setPostulacion] = useState(null);
    const [errorPostulacion, setErrorPostulacion] = useState(null);

    useEffect(() => {
      getPostulacionById(id).then((response) => {
        if(response.state === "Success") {
          setPostulacion(response.data);
        }else{
          setErrorPostulacion(response.message);
        }
      });
    }, []);

    return (
          <>
            {/* Muestra form de la postulacion seleccionada */}
            {errorUpdate && <div className="error-banner">{errorUpdate}</div>}
            {successMessage && <div className="success-banner">{successMessage}</div>}
                {showModal && postulacion ? (
                <div className="modal-background">
                <form className="modal" onSubmit={handleSubmit(onSubmit)}>
                <h2>Actualizar puntaje</h2>
                    <label className="input-label" htmlFor="puntaje"><strong>Puntaje</strong></label>
                    <input
                        id="puntaje"
                        name="puntaje"
                        type="text"
                        {...register('puntaje', { required: true })}
                    />
                    {errors.puntaje && <span className='campo-obligatorio'>*Por favor, ingrese un puntaje</span>}
                <input type="submit" />
                <div><button type="button" onClick={() => setShowModal(false)}>Cerrar</button></div>
                </form>
                </div>
                ) : (
                <div>{errorPostulacion && <div className="error-banner">{errorPostulacion}</div>}</div>
                )}
            </>
    );
}

export default ActualizarPuntajeModalForm;