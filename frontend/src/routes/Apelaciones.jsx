import { useState, useEffect } from "react";
import { getApelaciones, getApelacionById } from "../services/apelacion.service";

function Apelaciones() {
  const [apelaciones, setApelaciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApelacion, setSelectedApelacion] = useState(null);

  useEffect(() => {
    getApelaciones().then((data) => {
      setApelaciones(data);
    })
  }, []);
  
  const handleClick = (id) => {
    getApelacionById(id).then((data) => {
      console.log(data);
      setSelectedApelacion(data);
      setShowModal(true);
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
        <div>Cargando...</div>
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
          <p>Documentos: {selectedApelacion.beca.documentos.map((documento, index) => (<p key={index}>- {documento}</p>))}</p>
          <h2>Postulación:</h2>
          <p>Estado: {selectedApelacion.postulacion.estado}</p>
          <p>Motivos: {selectedApelacion.postulacion.motivos}</p>
          <h2>Apelación:</h2>
          <p>Fecha de apelación: {selectedApelacion.apelacion.fecha_de_apelacion}</p>
          <button onClick={() => setShowModal(false)}>Cerrar</button>
        </div>
      )}
    </>
  );
}

export default Apelaciones;
