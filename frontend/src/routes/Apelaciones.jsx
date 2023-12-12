import { useState, useEffect } from "react";
import { getApelaciones, getApelacionById, actualizarEstado } from "../services/apelacion.service";

function Apelaciones() {
  const [apelaciones, setApelaciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApelacion, setSelectedApelacion] = useState(null);
  const [errorApelaciones, setErrorApelaciones] = useState(null);
  const [errorApelacion, setErrorApelacion] = useState(null);
  const [errorEstado, setErrorEstado] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [motivos, setMotivos] = useState('');
  const [filtroNombre, setFiltro] = useState('');
  const [filtroApellido, setFiltroApellido] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroRut, setFiltroRut] = useState('');

  const fetchApelaciones = () => {
    getApelaciones().then((response) => {
      if(response.state === "Success"){
        setApelaciones(response.data);
      }else{
        setErrorApelaciones(response.message);
      }
    });
  };
  
  useEffect(() => {
    fetchApelaciones();
  }, []);
  
  const handleClick = (id) => {
    getApelacionById(id).then((response) => {
      if(response.state === "Success"){
        setSelectedApelacion(response.data);
        setShowModal(true);
      }else{
        setErrorApelacion(response.message);
      }
    });
  }
  
  const handleEstadoAprobar = (id, motivos) => {
    if(!motivos){ motivos = "Apelacion aprobada" }
    actualizarEstado(id, {estado: "Aceptada", motivos:motivos}).then((response) => {
      if(response.state === "Success"){
        setShowModal(false);
        setSelectedApelacion(null);
        setErrorEstado(null);
        setSuccessMessage('Apelación aprobada correctamente');
        fetchApelaciones();
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      }else{
        setErrorEstado(response.message);
      }
    });
  }
  const handleEstadoRechazar = (id, motivos) => {
    actualizarEstado(id, {estado: "Rechazada", motivos: motivos}).then((response) => {
      if(response.state === "Success"){
        setShowModal(false);
        setSelectedApelacion(null);
        setErrorEstado(null);
        setSuccessMessage('Apelación rechazada correctamente');
        fetchApelaciones();
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      }else{
        setErrorEstado(response.message);
      }
    });
  }

  return (
    <>
      {successMessage && <div className="success-banner">{successMessage}</div>}
      <h1>Lista de apelaciones</h1>
      <div className="filtro-container">
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="">Todas</option>
          <option value="pendiente">Pendiente</option>
          <option value="aceptada">Aprobado</option>
          <option value="rechazada">Rechazado</option>
        </select>
        <input type="text" value={filtroRut} onChange={e => setFiltroRut(e.target.value)} placeholder="Filtrar por RUT" />
        <input type="text" value={filtroNombre} onChange={e => setFiltro(e.target.value)} placeholder="Filtrar por nombres" />
        <input type="text" value={filtroApellido} onChange={e => setFiltroApellido(e.target.value)} placeholder="Filtrar por apellidos" />
      </div>
      {apelaciones ? (
        <table className="lista-apelaciones">
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Beca</th>
              <th>Fecha de Apelación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {apelaciones
            .sort((a, b) => new Date(a.fecha_apelacion) - new Date(b.fecha_apelacion))
            .filter(apelacion => 
              apelacion.postulacion.postulante.nombres.toLowerCase().includes(filtroNombre.toLowerCase()) &&
              apelacion.postulacion.postulante.apellidos.toLowerCase().includes(filtroApellido.toLowerCase()) &&
              apelacion.postulacion.postulante.rut.toString().includes(filtroRut) &&
              (filtroEstado === '' || apelacion.estado.toLowerCase() === filtroEstado.toLowerCase())
            ).map((apelacion) => (
              <tr key={apelacion._id} className="item-apelacion" onClick={() => handleClick(apelacion._id)}>
                <td>{apelacion.postulacion.postulante.nombres}</td>
                <td>{apelacion.postulacion.postulante.apellidos}</td>
                <td>{apelacion.postulacion.beca.nombre}</td>
                <td>{apelacion.fecha_de_apelacion}</td>
                <td>{apelacion.estado}</td>
                <td>
                  <button style={{ marginLeft: '10px' }} onClick={() => handleClick(apelacion._id)}>Ver detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>{errorApelaciones && <div className="error-banner">{errorApelaciones}</div>}</div>
      )}
      {showModal && selectedApelacion && (
        <div className="modal-background">
          <div className="modal">
            {/* Muestra la información de la apelación seleccionada */}
            <h2>Postulante:</h2>
            <p>Nombres: {selectedApelacion.postulante.nombres} {selectedApelacion.postulante.apellidos}</p>
            <p>Rut: {selectedApelacion.postulante.rut}</p>
            <p>Correo: {selectedApelacion.postulante.email}</p>
            <h2>Beca:</h2>
            <p>Nombre: {selectedApelacion.beca.nombre}</p>
            <p>Documentos:</p> {selectedApelacion.beca.documentos.map((documento, index) => (<p key={index}>- {documento}</p>))}
            <h2>Postulación:</h2>
            <p>Estado: {selectedApelacion.postulacion.estado}</p>
            <p>Motivos: {selectedApelacion.postulacion.motivos}</p>
            <p>Documentos faltantes: </p>
              {selectedApelacion.postulacion.documentosFaltantes && selectedApelacion.postulacion.documentosFaltantes.length > 0 ? (
                selectedApelacion.postulacion.documentosFaltantes.map((documento, index) => {
                  if (!selectedApelacion.apelacion.documentosPDF[index]) {
                    return <p key={index}>- {documento} - No se ha recibido archivo</p>;;
                  }
                  const fileBuffer = new Uint8Array(selectedApelacion.apelacion.documentosPDF[index].contenido.data).buffer;
                  const fileName = selectedApelacion.apelacion.documentosPDF[index].nombre;
                  const fileExtension = fileName.split('.').pop().toLowerCase();
                  let blob;
                
                  if (fileExtension === 'pdf') {
                    blob = new Blob([fileBuffer], { type: 'application/pdf' });
                  } else if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
                    blob = new Blob([fileBuffer], { type: 'image/' + fileExtension });
                  } else {
                    return <p key={index}>- {documento} - *Formato de archivo no soportado</p>;
                  }
                
                  const url = URL.createObjectURL(blob);

                  return (
                    <div key={index}>
                      <p>- {documento}</p>
                      <a className="button" href={url} target="_blank" rel="noopener noreferrer">Ver</a>
                      <a className="button" href={url} download={selectedApelacion.apelacion.documentosPDF[index].nombre}>Descargar</a>
                    </div>
                  );
                })
              ) : (
                <p className='campo-obligatorio'>No se ha indicado documentos faltantes.</p>
              )}
            <h2>Apelación:</h2>
            <p>Estado: {selectedApelacion.apelacion.estado}</p>
            <p>Motivos de estado: {selectedApelacion.apelacion.motivos}</p>
            <p>Motivo de apelación: {selectedApelacion.apelacion.motivo}</p>
            <p>Fecha de apelación: {selectedApelacion.apelacion.fecha_de_apelacion}</p>
            <label htmlFor="motivos" style={{marginRight: '10px'}}>Motivos:</label>
            <input
              id="motivos"
              type="text"
              value={motivos}
              onChange={event => setMotivos(event.target.value)}
            />
            <button onClick={() => handleEstadoAprobar(selectedApelacion.apelacion._id, motivos)}>Aprobar</button>
            <button onClick={() => handleEstadoRechazar(selectedApelacion.apelacion._id, motivos)}>Rechazar</button>
            <div>{errorEstado && <div className="error-banner">{errorEstado}</div>}</div>
            <button onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
      <div>{errorApelacion && <div className="error-banner">{errorApelacion}</div>}</div>
    </>
  );
}

export default Apelaciones;
