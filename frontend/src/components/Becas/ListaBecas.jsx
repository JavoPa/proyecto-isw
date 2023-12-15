// ListaBecas.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBecas, deleteBeca} from '../../services/becas.service';

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


  const handleVerBeca = (id) => {
    navigate(`/gestion/beca/${id}`);
  };

  const handleDeleteBeca = async (id) => {
    try {
      await deleteBeca(id);

      const updatedBecas = becas.filter((beca) => beca._id !== id);
      setBecas(updatedBecas);
    } catch (error) {
      console.error('Error al eliminar la beca:', error);
    }
  };

  const redirectToCrearBeca = () => {
    navigate('/gestion/crear');
  };

  return (
    <div>
      <h1>Lista de Becas</h1>
      <table className="lista-apelaciones">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Ver</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {becas.map((beca) => (
            <tr key={beca._id} className='item-apelacion'>
              <td>{beca.nombre}</td>
              <td>{beca.fecha_de_inicio}</td>
              <td>{beca.fecha_de_fin}</td>
              <td className="actions">
                <button className="ver-button" onClick={() => handleVerBeca(beca._id)}>
                <span role="img" aria-label="Eye Icon">👁️</span>
                </button>
              </td>
              <td className="actions">
                <button className="eliminar-button" onClick={() => handleDeleteBeca(beca._id)}>
                <span role="img" aria-label="Trash Icon">🗑️</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={redirectToCrearBeca}>Crear Beca</button>
    </div>
  );
};

export default ListaBecas;

