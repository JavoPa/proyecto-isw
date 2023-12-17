// ListaPostulaciones.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPostulaciones } from '../../services/estado.service';

const ListaPostulaciones = () => {
    const [Postulaciones, setPostulaciones] = useState([]);
    const navigate = useNavigate();
  
    const cargarPostulaciones = async () => {
      try {
        const PostulacionesData = await getPostulaciones();
        setPostulaciones(PostulacionesData);
      } catch (error) {
        console.error('Error al obtener los Postulaciones:', error);
      }
    };
  
    useEffect(() => {
      cargarPostulaciones();
    }, []);
  
    const handleVerPostulacion = (id) => {
      navigate(`/gestion/postulacion/${id}`);
    };

    let data = [];

    for (const i in Postulaciones.data) {
        data.push({
            _id: Postulaciones.data[i]._id,
            fechaRecepcion: Postulaciones.data[i].fecha_recepcion,
            estado: Postulaciones.data[i].estado,
            motivos: Postulaciones.data[i].motivos,
            nombreBeca: Postulaciones.data[i].beca.nombre,
            nombrePostulante: Postulaciones.data[i].postulante.nombres + ' ' + Postulaciones.data[i].postulante.apellidos,
            puntaje: Postulaciones.data[i].puntaje,
            documentosFaltantes: Postulaciones.data[i].documentosFaltantes
        });
    }

    return (
    <form>
      <div>
        <h1>Lista de Postulaciones</h1>
        <table className="lista-apelaciones">
          <thead>
            <tr>
              <th>Fecha recepción</th>
              <th>Estado</th>
              <th>Motivos</th>
              <th>Beca</th>
              <th>Postulante</th>
              <th>Puntaje</th>
              <th>Documentos faltantes</th>
              <th>Ver</th>
            </tr>
          </thead>
          <tbody>
            {data.map((postulacion) => (
              <tr key={postulacion._id} className='item-apelacion'>
                <td>{postulacion.fechaRecepcion}</td>
                <td>{postulacion.estado}</td>
                <td>{postulacion.motivos}</td>
                <td>{postulacion.nombreBeca}</td>
                <td>{postulacion.nombrePostulante}</td>
                <td>{postulacion.puntaje}</td>
                <td>{postulacion.documentosFaltantes}</td>
                <td className="actions">
                  <button className="ver-button" onClick={() => handleVerPostulacion(postulacion._id)}>
                  <span role="img" aria-label="Eye Icon">👁️</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
    );
  };
  
  export default ListaPostulaciones;
  
  