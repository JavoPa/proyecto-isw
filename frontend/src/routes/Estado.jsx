import { useState, useEffect } from "react";
import { getEstado } from "../services/estado.service";

function Estado() {
  const [postulacion, setPostulacion] = useState(null);
  const [apelacion, setApelacion] = useState(null);

  useEffect(() => {
    getEstado().then((data) => {
      setPostulacion(data.postulacion);
      if (data.apelacion) {
        setApelacion(data.apelacion);
      }
    });
  }, []);

  return (
    <div className="estado-container">
      <h2>Estado de la postulación</h2>
      {postulacion ? (
        <div className="estado-details">
          <p><strong>Estado:</strong> {postulacion.estado}</p>
          <p><strong>Motivos:</strong> {postulacion.motivos}</p>
          <p><strong>Beca:</strong> {postulacion.beca.nombre}</p>
          <p><strong>Fecha de postulación:</strong> {postulacion.fecha_de_recepcion}</p>
          {apelacion && (
            <div className="estado-apelacion">
              <h2>Estado de la apelación</h2>
              <p><strong>Estado:</strong> {apelacion.estado}</p>
              <p><strong>Fecha de apelación:</strong> {apelacion.fecha_de_apelacion}</p>
            </div>
          )}
        </div>
      ) : (
        <div>Cargando...</div>
      )}
    </div>
  );
}

export default Estado;