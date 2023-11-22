import { useState, useEffect } from "react";
import { getApelaciones } from "../services/apelacion.service";

function Apelaciones() {
  const [apelaciones, setApelaciones] = useState([]);
  useEffect(() => {
    getApelaciones().then((data) => {
      setApelaciones(data);
    })
  }, []);
  
  return (
    <>
      <div>Lista de apelaciones</div>
      {apelaciones ? (
        <ul className="lista-apelaciones">
          {apelaciones.map((apelacion) => (
            <li key={apelacion._id} className="item-apelacion">
              {apelacion.postulacion.postulante.nombres} {apelacion.postulacion.postulante.apellidos} - {apelacion.fecha_de_apelacion} - {apelacion.postulacion.beca.nombre}
            </li>
          ))}
        </ul>
      ) : (
        <div>Cargando...</div>
      )}
    </>
  );
}

export default Apelaciones;
