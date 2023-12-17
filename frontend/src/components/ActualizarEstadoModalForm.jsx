import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getPostulacionById, actualizarEstado } from '../services/estado.service';

function ActualizarEstadoModalForm({id, showModal, setShowModal}) {
    const [errorUpdate, setErrorUpdate] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
  
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();
  
    const onSubmit = (data) => {
      let updateData = { estado: data.estado };

     actualizarEstado(id, updateData).then((response) => {
        if (response.state === 'Success') {
            setShowModal(false);
            setErrorUpdate(null);
            setSuccessMessage('estado actualizado correctamente');
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
                <h2>Actualizar estado</h2>
                    <label className="input-label" htmlFor="estado"><strong>Estado</strong></label>
                    <input
                        id="estado"
                        name="estado"
                        type="text"
                        {...register('estado', { required: true })}
                    />
                    {errors.estado && <span className='campo-obligatorio'>*Por favor, ingrese un estado</span>}
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

export default ActualizarEstadoModalForm;