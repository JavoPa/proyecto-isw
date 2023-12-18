import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createPostulacion } from '../services/postulacion.service';
import { useState, useEffect } from 'react';

function PostularForm( {selectedBecaId, becaDocumentos }) {
    
    const navigate = useNavigate();
    const [errorPostulacion, setErrorPostulacion] = useState(null);
    const beca_id = selectedBecaId
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    console.log("aca");
    console.log(becaDocumentos);
    console.log("aci");
    console.log(beca_id);
    console.log("aco");
    const onSubmit = (data) => {
        // Aquí puedes manejar la subida del archivo
        const comentario = data.comentario;
        const files = Object.keys(data)
            .filter(key => key.startsWith('archivoPDF'))
            .flatMap(key => Array.from(data[key]));

        if (!files) {
            setErrorPostulacion('Debe subir al menos un archivo');
            return;
        }
 
        createPostulacion(comentario, beca_id, files).then((response) => {
            if (response.state === 'Success') {
                navigate('/postulacion/becas', { state: { success: response.data } });
            } else {
                setErrorPostulacion(response.message);
            }
        });
    };

    //Obtencion de documentosFaltantes
    const [postulacion, setPostulacion] = useState(null);
    const [apelacion, setApelacion] = useState(null);
    const [errorEstado, setErrorEstado] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [fechaInicio, setFechaInicio] = useState(null);

 

    return (
        <>
            
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>Formulario de Postulacion</h2>
                    <label className="input-label" htmlFor="comentario"><strong>comentario de la postulacion</strong></label>
                    <input
                        id="comentario"
                        name="comentario"
                        type="text"
                        {...register('comentario', { required: true })}
                    />
                    <label><strong>Subir documentos</strong></label>
                    {becaDocumentos && becaDocumentos.length > 0 ? (
                        becaDocumentos.map((documento, index) => (
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
                        <p>No hay documentos para subir</p>
                    )}
                    <input type="submit" />
                </form>
                
        </>            
            )   }   
        
 
        



export default PostularForm;