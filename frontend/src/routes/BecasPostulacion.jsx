import { getBecasPostulacion } from "../services/postulacion.service";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BecasPostulacion = () => {
  const [becas, setBecas] = useState([]);
  const [selectedBecaId, setSelectedBecaId] = useState(null); // State to store selected scholarship ID
  const navigate = useNavigate();

  useEffect(() => {
    getBecasPostulacion().then((response) => {
      setBecas(response);
    });
  }, []);
  console.log(becas); 
  const handleRadioChange = (id, documentos) => {
    setSelectedBecaId({ id, documentos }); // Update selected scholarship ID and documentos when radio button is clicked
  };

  const handlePostularClick = () => {
    if (selectedBecaId !== null) {
      // Guardar el ID de la beca en el sessionStorage
      sessionStorage.setItem('selectedBecaId', selectedBecaId.id);
      sessionStorage.setItem('selectedBecaDocumentos', selectedBecaId.documentos);
      // Redirigir a la página de postulación
      navigate(`/postulacion/postular`);
    } else {
      // Handle case when no scholarship is selected
      console.log('Please select a scholarship before postular.');
    }
  };

  return (
    <>
      <div className="lista-contenedor">
        <h1>Lista de becas</h1>
        <ul>
          {becas.length > 0 &&
            becas[0].map((beca) => (
              <li key={beca._id}>
                <div className="beca-box"> {/* Add a div with a class for spacing */}
                  <input
                    type="radio"
                    name="becaSelection"
                    onChange={() => handleRadioChange(beca._id, beca.documentos)}
                  />
                  {beca.nombre}
                  <ul>
                    {beca.documentos.map((documento) => (
                      <li key={documento}>{documento}</li>
                    ))}
                  </ul>
                </div>
                <div className="vacio">
                  
                </div>
              </li>
            ))}
        </ul>
        <button type="button" onClick={handlePostularClick}>
          Postular
        </button>
        <div className="vacio"></div>
      </div>
    </>
  );
};

export default BecasPostulacion;