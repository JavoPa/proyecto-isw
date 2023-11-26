import { useState, useEffect } from "react";
import { getApelaciones, getApelacionById } from "../services/apelacion.service";

function Apelaciones() {
  const [apelaciones, setApelaciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApelacion, setSelectedApelacion] = useState(null);
  const [errorApelaciones, setErrorApelaciones] = useState(null);
  const [errorApelacion, setErrorApelacion] = useState(null);

  useEffect(() => {
    getApelaciones().then((response) => {
      if (response.state === "Success"){
        setApelaciones(response.data);
      }else{
        setErrorApelaciones(response.message);
      }
    })
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

  return (
    <>
      <h1>Lista de apelaciones</h1>
      {apelaciones ? (
        <ul className="lista-apelaciones">
          {apelaciones.map((apelacion) => (
            <li key={apelacion._id} className="item-apelacion" onClick={() => handleClick(apelacion._id)}>
              {apelacion.postulacion.postulante.nombres} {apelacion.postulacion.postulante.apellidos} - {apelacion.postulacion.beca.nombre} - {apelacion.fecha_de_apelacion}
            </li>
          ))}
        </ul>
      ) : (
        <div>{errorApelaciones && <div className="error-banner">{errorApelaciones}</div>}</div>
      )}
      {showModal && selectedApelacion && (
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
          <h2>Apelación:</h2>
          <p>Motivo de apelación: {selectedApelacion.apelacion.motivo}</p>
          <p>Fecha de apelación: {selectedApelacion.apelacion.fecha_de_apelacion}</p>
          <button onClick={() => setShowModal(false)}>Cerrar</button>
        </div>
      )}
      <div>{errorApelacion && <div className="error-banner">{errorApelacion}</div>}</div>
    </>
  );
}

export default Apelaciones;
