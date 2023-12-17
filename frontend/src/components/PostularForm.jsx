import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createPostulacion, getMyUser } from '../services/postulacion.service';
import { useState, useEffect } from 'react';


function PostularForm({ becaId }) {
  const navigate = useNavigate();
  const [errorPostulacion, setErrorPostulacion] = useState(null);
  const [userData, setUserData] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const comentario = data.comentario;
    const files = Object.keys(data)
      .filter(key => key.startsWith('archivoPDF'))
      .flatMap(key => Array.from(data[key]));

    if (!files) {
      setErrorPostulacion('Para apelar se deben subir los documentos faltantes');
      return;
    }
    if (!comentario) {
      comentario = "";
    }
    createPostulacion(comentario, files).then((response) => {
      if (response.state === 'Success') {
        navigate('/postulacion/becas', { state: { success: response.data } });
      } else {
        setErrorPostulacion(response.message);
      }
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getMyUser(); // Use the service function to get user data
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      
        {userData ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          
          <label className="input-label" htmlFor="comentario"><strong>comentario de la postulacion</strong></label>
          <input
            id="comentario"
            name="comentario"
            type="text"
            {...register('comentario')}
          />
          <label><strong>Subir documentos</strong></label>
          {userData ?  (
            
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
              </div>
            
          ) : (true)}
          <input type="submit" />
        </form>
        ) : (true)}
    </>
  );
}

export default PostularForm;