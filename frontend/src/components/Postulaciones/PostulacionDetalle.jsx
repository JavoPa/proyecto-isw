import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getPostulacionById } from '../../services/estado.service';
import ActualizarMotivosModalForm from '../ActualizarMotivosModalForm.jsx';

const DetallesPostulacion = () => {
  const { _id } = useParams();
  const [Postulacion, setPostulacion] = useState(null);
  const navigate = useNavigate();
  const [showModalMotivos, setShowModalMotivos] = useState(false);

  useEffect(() => {
    const cargarDetallesPostulacion = async () => {
      try {
        const Postulacion = await getPostulacionById(_id);
        const PostulacionData = Postulacion.data; // Accede a la propiedad "data"
        setPostulacion(PostulacionData);
        console.log('Datos de la Postulacion:', PostulacionData);
      } catch (error) {
        console.error('Error al obtener los detalles de la Postulacion:', error);
      }
    };

    cargarDetallesPostulacion();
  }, [_id]);

  if (!Postulacion) {
    return <div>Cargando...</div>;
  }

  const handleModificarMotivo = (event) => {
    event.preventDefault(); //evitar que se comporte como un formulario y se cierre el modal
    setShowModalMotivos(true);
  };

  const handleModificarEstado = () => {
    navigate(`/gestion/modificarEstado/${_id}`);
  };

  const handleModificarPuntaje = () => {
    navigate(`/gestion/modificarPuntaje/${_id}`);
  };

  return (
    <>
    <ActualizarMotivosModalForm id={Postulacion._id} showModal={showModalMotivos} setShowModal={setShowModalMotivos}/>
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
        <button>Descargar archivos</button>
      </table>
      <button onClick={(event) => handleModificarMotivo(event)}>Modificar motivo</button>
      <button onClick={handleModificarEstado}>Modificar estado</button>
      <button onClick={handleModificarPuntaje}>Modificar puntaje</button>
    </form>
    </>
  );
};

export default DetallesPostulacion;