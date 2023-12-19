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
  const [orden, setOrden] = useState('antiguo');

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
    setErrorEstado(null);
    setMotivos('');
  }, [showModal]);
  
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
      <div className="lista-contenedor">
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
          <label htmlFor="orden">Ordenar por:</label>
          <select id="orden" value={orden} onChange={e => setOrden(e.target.value)}>
            <option value="antiguo">Mas antiguo</option>
            <option value="nuevo">Mas nuevo</option>
            <option value="nombre">Nombres</option>
            <option value="apellido">Apellidos</option>
            <option value="beca">Beca</option>
            <option value="estado">Estado</option>
          </select>
        </div>
        {apelaciones.length > 0 ? (
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
              .sort((a, b) => {
                switch (orden) {
                  case 'nombre':
                    return a.postulacion.postulante.nombres.localeCompare(b.postulacion.postulante.nombres);
                  case 'apellido':
                    return a.postulacion.postulante.apellidos.localeCompare(b.postulacion.postulante.apellidos);
                  case 'beca':
                    return a.postulacion.beca.nombre.localeCompare(b.postulacion.beca.nombre);
                  case 'estado':
                    return a.estado.localeCompare(b.estado);
                  case 'nuevo':
                    return new Date(b.fecha_apelacion) - new Date(a.fecha_apelacion);
                  default: // 'Mas antiguo'
                    return new Date(a.fecha_apelacion) - new Date(b.fecha_apelacion);
                }
              })
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
      </div>
      {showModal && selectedApelacion && (
        <div className="modal-background">
          <div className="modal">
            {/* Muestra la información de la apelación seleccionada */}
            <h2>Postulante</h2>
              <table className="lista-apelaciones">
              <tbody>
              <tr className='item-apelacion'>
                <td className='detalle-variable'>Nombres:</td>
                <td>{selectedApelacion.postulante.nombres} {selectedApelacion.postulante.apellidos}</td>
              </tr>
              <tr className='item-apelacion'>
                <td className='detalle-variable'>Rut:</td>
                <td>{selectedApelacion.postulante.rut}</td>
              </tr>
              <tr className='item-apelacion'>
                <td className='detalle-variable'>Correo:</td>
                <td>{selectedApelacion.postulante.email}</td>
              </tr>
              </tbody>
              </table>
            <h2>Beca</h2>
              <table className="lista-apelaciones">
                <tbody>
                <tr className='item-apelacion'>
                  <td className='detalle-variable'>Nombre:</td>
                  <td>{selectedApelacion.postulante.nombres} {selectedApelacion.postulante.apellidos}</td>
                </tr>
                <tr className='item-apelacion'>
                  <td className='detalle-variable'>Documentos:</td>
                  <td>{selectedApelacion.beca.documentos.map((documento, index) => (<p key={index}>- {documento}</p>))}</td>
                </tr>
                </tbody>
              </table>
            <h2>Postulación</h2>
            <table className="lista-apelaciones">
                <tbody>
                <tr className='item-apelacion'>
                  <td className='detalle-variable'>Estado:</td>
                  <td>{selectedApelacion.postulacion.estado}</td>
                </tr>
                <tr className='item-apelacion'>
                  <td className='detalle-variable'>Motivos:</td>
                  <td>{selectedApelacion.postulacion.motivos}</td>
                </tr>
                <tr className='item-apelacion'>
                  <td className='detalle-variable'>Documentos faltantes:</td>
                  <td>
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
                  </td>
                </tr>
                </tbody>
              </table>
            <h2>Apelación</h2>
              <table className="lista-apelaciones">
              <tbody>
              <tr className='item-apelacion'>
                <td className='detalle-variable'>Estado:</td>
                <td>{selectedApelacion.apelacion.estado}</td>
              </tr>
              <tr className='item-apelacion'>
                <td className='detalle-variable'>Motivos de estado:</td>
                <td>{selectedApelacion.apelacion.motivos}</td>
              </tr>
              <tr className='item-apelacion'>
                <td className='detalle-variable'>Motivos de apelación:</td>
                <td>{selectedApelacion.apelacion.motivo}</td>
              </tr>
              <tr className='item-apelacion'>
                <td className='detalle-variable'>Fecha de apelación:</td>
                <td>{selectedApelacion.apelacion.fecha_de_apelacion}</td>
              </tr>
              </tbody>
              </table>
            <h2>Gestionar apelación</h2>
            <label htmlFor="motivos" style={{marginRight: '10px'}}><strong>Motivos:</strong></label>
            <input
              id="motivos"
              type="text"
              value={motivos}
              onChange={event => setMotivos(event.target.value)}
            />
            <button style={{ backgroundColor: 'green', color: 'white' }} onClick={() => handleEstadoAprobar(selectedApelacion.apelacion._id, motivos)}>Aprobar</button>
            <button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => handleEstadoRechazar(selectedApelacion.apelacion._id, motivos)}>Rechazar</button>
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
