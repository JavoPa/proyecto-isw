import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getDocumentsById, getPostulacionById } from '../../services/estado.service';

const DetallesPostulacion = () => {
  const { _id } = useParams();
  const [Postulacion, setPostulacion] = useState(null);
  const [Blobs, setBlobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDetallesPostulacion = async () => {
      try {
        const Postulacion = await getPostulacionById(_id);
        setPostulacion(Postulacion.data);
      } catch (error) {
        console.error('Error al obtener los detalles de la Postulacion:', error);
      }
    };

    cargarDetallesPostulacion();
  }, [_id]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const blobs = await Promise.all(
          Array.from({ length: Postulacion?.documentosPDF.length || 0 }, async (_, i) => {
            const response = await getDocumentsById(_id, i);
            return new Blob([response], { type: response.type });
          })
        );
        setBlobs(blobs);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    if (Postulacion) {
      fetchFiles();
    }
  }, [_id, Postulacion]);

  const openFileInNewTab = (index, event) => {
    if (Blobs[index]) {
      event.preventDefault();
      const url = URL.createObjectURL(Blobs[index]);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    }
  };

  if (!Postulacion) {
    return <div>Cargando...</div>;
  }

  const handleModificar = (path) => {
    navigate(`/gestion/${path}/${_id}`);
  };

  return (
    <form>
      <h1>Detalles de la Postulacion</h1>
      <table className="lista-apelaciones">
        <tbody>
          <tr className='item-apelacion'>
            <td className='detalle-variable'>Nombre beca:</td>
            <td>{Postulacion.beca.nombre}</td>
          </tr>
          <tr className='item-apelacion'>
            <td className='detalle-variable'>Postulante:</td>
            <td>{Postulacion.postulante.nombres + ' ' + Postulacion.postulante.apellidos}</td>
          </tr>
          <tr className='item-apelacion'>
            <td className='detalle-variable'>Fecha de recepción</td>
            <td>{Postulacion.fecha_recepcion}</td>
          </tr>
          <tr className='item-apelacion'>
            <td className='detalle-variable'>Estado</td>
            <td>{Postulacion.estado}</td>
          </tr>
          <tr className='item-apelacion'>
            <td className='detalle-variable'>Motivos</td>
            <td>{Postulacion.motivos}</td>
          </tr>
          <tr className='item-apelacion'>
            <td className='detalle-variable'>Puntaje</td>
            <td>{Postulacion.puntaje}</td>
          </tr>
          <tr className='item-apelacion'>
            <td className='detalle-variable'>Documentos faltantes:</td>
            <td>{Postulacion.documentos_faltantes}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ marginBottom: '10px' }}>Archivos de postulación</h2>
        {Blobs?.length > 0 ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            {Blobs.map((_, index) => (
              <button key={index} onClick={(event) => openFileInNewTab(index, event)}>
                📁 {index + 1}
              </button>
            ))}
          </div>
        ) : (
          <p>Esta postulación no tiene archivos</p>
        )}
      </div>

      <button onClick={() => handleModificar('modificarMotivo')}>Modificar motivo</button>
      <button onClick={() => handleModificar('modificarEstado')}>Modificar estado</button>
      <button onClick={() => handleModificar('modificarPuntaje')}>Modificar puntaje</button>
    </form>
  );
};

export default DetallesPostulacion;