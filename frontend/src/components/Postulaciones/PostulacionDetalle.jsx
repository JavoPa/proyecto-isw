import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDocumentsById, getPostulacionById, getInformeById } from '../../services/estado.service';
import ActualizarMotivosModalForm from '../ActualizarMotivosModalForm.jsx';
import ActualizarPuntajeModalForm from '../ActualizarPuntajeModalform.jsx';
import ActualizarEstadoModalForm from '../ActualizarEstadoModalForm.jsx';

const DetallesPostulacion = () => {
  const { _id } = useParams();
  const [Postulacion, setPostulacion] = useState(null);
  const [Blobs, setBlobs] = useState([]);
  const [Informe, setInforme] = useState(null);
  const [showModalMotivos, setShowModalMotivos] = useState(false);
  const [showModalPuntaje, setShowModalPuntaje] = useState(false);
  const [showModalEstado, setShowModalEstado] = useState(false);

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
        console.log(Postulacion);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    if (Postulacion) {
      fetchFiles();
    }
  }, [_id, Postulacion]);

  useEffect(() => {
    const getInforme = async () => {
      try {
        const Informe = await getInformeById(_id);
        const InformeData = new Blob([Informe], { type: Informe.type });
        setInforme(InformeData);
      } catch (error) {
        console.error('Error al obtener los detalles de la Postulacion:', error);
      }
    };

    getInforme();
  }, [_id]);

  const openFileForDownload = (index) => {
    if (Blobs[index]) {
      const blob = Blobs[index];
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;

      const fileExtension = blob.type.split('/')[1];
      a.download = `file_${index + 1}.${fileExtension || 'bin'}`;

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    }
  };

  const handleInforme = (event) => {
    if (Informe) {
      event.preventDefault();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(Informe);
      a.download = 'Informe.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }
  };

  if (!Postulacion) {
    return <div>Cargando...</div>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options)
      .split('/').join('-'); // Replace slashes with dashes
    return formattedDate;
  };

  const handleModificarMotivo = (event) => {
    event.preventDefault(); //evitar que se comporte como un formulario y se cierre el modal
    setShowModalMotivos(true);
  };

  const handleModificarEstado = (event) => {
    event.preventDefault();
    setShowModalEstado(true);
  };

  const handleModificarPuntaje = (event) => {
    event.preventDefault();
    setShowModalPuntaje(true);
  };

  return (
    <>
      <ActualizarMotivosModalForm id={Postulacion._id} showModal={showModalMotivos} setShowModal={setShowModalMotivos} />
      <ActualizarPuntajeModalForm id={Postulacion._id} showModal={showModalPuntaje} setShowModal={setShowModalPuntaje} />
      <ActualizarEstadoModalForm id={Postulacion._id} showModal={showModalEstado} setShowModal={setShowModalEstado} />
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
              <td>{formatDate(Postulacion.fecha_recepcion)}</td>
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
              <td>{Postulacion.documentosFaltantes.map((doc) => doc + " ")}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ marginBottom: '10px' }}>Archivos de postulación</h2>
          {Blobs?.length > 0 ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              {Blobs.map((_, index) => (
                <button key={index} onClick={() => openFileForDownload(index)}>
                  📁 {index + 1}
                </button>
              ))}
            </div>
          ) : (
            <p>Esta postulación no tiene archivos</p>
          )}
        </div>
        <button onClick={(event) => handleInforme(event)}>Descargar informe</button>
        <button onClick={(event) => handleModificarMotivo(event)}>Modificar motivo</button>
        <button onClick={(event) => handleModificarEstado(event)}>Modificar estado</button>
        <button onClick={(event) => handleModificarPuntaje(event)}>Modificar puntaje</button>
      </form>
    </>
  );
};

export default DetallesPostulacion;