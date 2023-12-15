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
        console.error('Error al obtener los detalles de la Postulante:', error);
      }
    };

    cargarDetallesPostulante();
  }, [_id]);

  if (!Postulante) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Detalles de la Postulante</h1>
      <p>Nombres: {Postulante.nombres}</p>
      <p>Apellidos: {Postulante.apellidos}</p>
      <p>RUT: {Postulante.rut}</p>
      <p>Email: {Postulante.email}</p>
    </div>
  );
};

export default DetallesPostulante;