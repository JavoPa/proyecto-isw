import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getPostulanteById } from '../../services/postulantes.service';

const DetallesPostulante = () => {
  const { _id } = useParams();
  const [Postulante, setPostulante] = useState(null);

  useEffect(() => {
    const cargarDetallesPostulante = async () => {
      try {
        const response = await getPostulanteById(_id);
        const PostulanteData = response.data; // Accede a la propiedad "data"
        setPostulante(PostulanteData);
        console.log('Datos del Postulante:', PostulanteData);
      } catch (error) {
        console.error('Error al obtener los detalles del Postulante:', error);
      }
    };

    cargarDetallesPostulante();
  }, [_id]);

  if (!Postulante) {
    return <div>Cargando...</div>;
  }

  return (
    <form>
      <h1>Detalles del Postulante</h1>
      <table className="lista-apelaciones">
        <tbody>
          <tr className='item-apelacion'>
            <td className='detalle-variable'>Nombres:</td>
            <td>{Postulante.nombres}</td>
          </tr>
          <tr className='item-apelacion'>
            <td className='detalle-variable'>Apellidos:</td>
            <td>{Postulante.apellidos}</td>
          </tr>
          <tr className='item-apelacion'>
            <td className='detalle-variable'>RUT:</td>
            <td>{Postulante.rut}</td>
          </tr>
          <tr className='item-apelacion'>
            <td className='detalle-variable'>Email:</td>
            <td>{Postulante.email}</td>
          </tr>
        </tbody>
      </table>
    </form>
  );
};

export default DetallesPostulante;