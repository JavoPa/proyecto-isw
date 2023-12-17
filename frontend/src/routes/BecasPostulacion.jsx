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
  const handleRadioChange = (id) => {
    setSelectedBecaId(id); // Update selected scholarship ID when radio button is clicked
  };

  const handlePostularClick = () => {
    if (selectedBecaId !== null) {
      // Redirect to another link passing the selected scholarship ID as a query parameter
      navigate(`/postulacion/postular/${selectedBecaId}`);
    } else {
      // Handle case when no scholarship is selected
      console.log('Please select a scholarship before postular.');
    }
  };

  return (
    <>
      <h1>Lista de becas</h1>
      <ul>
        {becas.length > 0 &&
          becas[0].map((beca) => (
            <li key={beca._id}>
              <input
                type="radio"
                name="becaSelection"
                onChange={() => handleRadioChange(beca._id)}
              />
              {beca.nombre}
            </li>
          ))}
      </ul>
      <button type="button" onClick={handlePostularClick}>
        Postular
      </button>
    </>
  );
};

export default BecasPostulacion;