//Formulario modal para que el encargado establezca los motivos del rechazo de una postulación y los documentos faltantes en caso de faltar alguno
//<ApelarForm id={id} ShowModal={showModal} />
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getPostulacionById, actualizarMotivos } from '../services/estado.service';

function ActualizarMotivosModalForm({id, showModal, setShowModal, docs, motivos}) {
    const [documentosFaltantes, setDocumentosFaltantes] = useState(['']);
    const [errorUpdate, setErrorUpdate] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [motivosEstado, setMotivosEstado] = useState("");

    const handleAddCampo = () => {
        setDocumentosFaltantes([...documentosFaltantes, '']);
    }

    const handleRemoveCampo = (index) => {
        setDocumentosFaltantes(documentosFaltantes.filter((_, idx) => idx !== index));
    }

    const handleInputChange = (index, event) => {
        const values = [...documentosFaltantes];
        values[index] = event.target.value;
        setDocumentosFaltantes(values);
    }
  
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();
  
    const onSubmit = (data) => {
      let updateData = { motivos: data.motivos };
      if (documentosFaltantes.length > 0) {
        updateData.documentosFaltantes = documentosFaltantes;
      }
      actualizarMotivos(id, updateData).then((response) => {
        if (response.state === 'Success') {
            setShowModal(false);
            setErrorUpdate(null);
            setSuccessMessage('Datos actualizados correctamente');
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
      setDocumentosFaltantes(docs);
      setMotivosEstado(motivos);
    }, []);

    return (
          <>
            {/* Muestra form de la postulacion seleccionada */}
            {errorUpdate && <div className="error-banner">{errorUpdate}</div>}
            {successMessage && <div className="success-banner">{successMessage}</div>}
                {showModal && postulacion ? (
                <div className="modal-background">
                <form className="modal" onSubmit={handleSubmit(onSubmit)}>
                <h2>Actualizar Motivos y Documentos Faltantes</h2>
                    <label className="input-label" htmlFor="motivos"><strong>Motivo del estado</strong></label>
                    <input
                        id="motivos"
                        name="motivos"
                        type="text"
                        {...register('motivos', { required: true })}
                        value={motivosEstado}
                    />
                    {errors.motivos && <span className='campo-obligatorio'>*Por favor, ingresa el motivo</span>}
                    {documentosFaltantes.map((documento, index) => (
                    <div key={index}>
                        <label htmlFor={`documento-${index}`} style={{ marginRight: '10px' }}><strong>Documento faltante {index + 1}</strong></label>
                        <input
                        id={`documento-${index}`}
                        name={`documento-${index}`}
                        type="text"
                        value={documento}
                        onChange={event => handleInputChange(index, event)}
                        style={{ marginRight: '10px' }}
                        required
                        />
                        <button type="button" onClick={() => handleRemoveCampo(index)}>Eliminar</button>
                        {errors[`documento-${index}`] && <span className='campo-obligatorio'>*Por favor, ingresa el documento faltante</span>}
                    </div>
                    ))}
                    <div><button type="button" onClick={handleAddCampo}>Agregar documento</button></div>
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

export default ActualizarMotivosModalForm;