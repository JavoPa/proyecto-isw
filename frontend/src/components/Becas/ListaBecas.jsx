// ListaBecas.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBecas} from '../../services/becas.service';

const ListaBecas = () => {
  const [becas, setBecas] = useState([]);
  const navigate = useNavigate();

  const cargarBecas = async () => {
    try {
      const becasData = await getBecas();
      setBecas(becasData);
    } catch (error) {
      console.error('Error al obtener las becas:', error);
    }
  };

  useEffect(() => {
    cargarBecas();
  }, []);

  return (
    <div>
      <h1>Lista de Becas</h1>
      <ul>
        {/* Mapea las becas y muestra el nombre de cada una en una lista */}
        {becas.map((beca) => (
          <li key={beca.id}>
            {beca.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaBecas;