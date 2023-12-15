import { useState, useEffect } from "react";
import { getEstado } from "../services/estado.service";
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";

function Estado() {
  const [postulacion, setPostulacion] = useState(null);
  const [apelacion, setApelacion] = useState(null);
  const location = useLocation(); // Para obtener el estado de la solicitud
  const success = location.state?.success;
  const [error, setError] = useState(null);

  useEffect(() => {
    getEstado().then((response) => {
      if(response.state === "Success") {
        setPostulacion(response.data.postulacion);
        if (response.data.apelacion) { //En caso de que exista apelacion
          setApelacion(response.data.apelacion);
        }
      }else{
        setError(response.message);
      }
    });
  }, []);

  return (
    <>
      {success && <div className="success-banner">{success}</div>}
      <div className="estado-container">
        <h2>Estado de la postulación</h2>
        {postulacion ? (
          <div className="estado-details">
            <p><strong>Estado:</strong> {postulacion.estado}</p>
            <p><strong>Motivos:</strong> {postulacion.motivos}</p>
            <p><strong>Beca:</strong> {postulacion.beca.nombre}</p>
            <p><strong>Fecha de postulación:</strong> {postulacion.fecha_de_recepcion}</p>
            {postulacion.estado==='Rechazada' && !apelacion && (
              <Link to="/postulacion/apelar">
                <button type="button">Apelar</button>
              </Link>
            )}
            {apelacion && (
              <div className="estado-apelacion">
                <h2>Estado de la apelación</h2>
                <p><strong>Estado:</strong> {apelacion.estado}</p>
                <p><strong>Motivos:</strong> {apelacion.motivos}</p>
                <p><strong>Fecha de apelación:</strong> {apelacion.fecha_de_apelacion}</p>
              </div>
            )}
          </div>
        ) : (
          <div>{error && <div className="error-banner">{error}</div>}</div>
        )}
      </div>
      {postulacion && 
        <div className="tracking-container">
          <div className={`node ${postulacion.estado === 'Enviada' ? 'enviada' : ''}`}>
            <div className="circle"></div>
            <p>Enviada</p>
          </div>
          <div className={`node ${postulacion.estado === 'Aprobada' ? 'aprobada' : ''}`}>
            <div className="circle"></div>
            <p>Aprobada</p>
          </div>
          <div className={`node ${postulacion.estado === 'Rechazada' && !apelacion ? 'rechazada' : ''}`}>
            <div className="circle"></div>
            <p>Rechazada</p>
          </div>
          <div className={`node ${apelacion?.estado === 'Pendiente' ? 'pendiente' : ''}`}>
            <div className="circle"></div>
            <p>Apelación en proceso</p>
          </div>
          <div className={`node ${apelacion?.estado === 'Aceptada' ? 'aprobada' : ''}`}>
            <div className="circle"></div>
            <p>Apelación aprobada</p>
          </div>
          <div className={`node ${apelacion?.estado === 'Rechazada' ? 'rechazada' : ''}`}>
            <div className="circle"></div>
            <p>Apelación rechazada</p>
          </div>
        </div>
      }
    </>
  );
}

export default Estado;