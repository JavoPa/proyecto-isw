// ListaBecas.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBecas, deleteBeca} from '../../services/becas.service';

const ListaBecas = () => {
  const [becas, setBecas] = useState([]);
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState(null);

  const cargarBecas = async () => {
    try {
      let becasData = await getBecas();
      if (busqueda) {
        becasData = becasData.filter((beca) =>
          beca.nombre.toLowerCase().includes(busqueda.toLowerCase())
        );
      }

      if (orden) {
        becasData.sort((a, b) => {
          if (orden === 'nombre') {
            return a.nombre.localeCompare(b.nombre);
          } else if (orden === 'inicio') {
            return new Date(a.fecha_de_inicio) - new Date(b.fecha_de_inicio);
          } else if (orden === 'fin') {
            return new Date(a.fecha_de_fin) - new Date(b.fecha_de_fin);
          }

          return 0;
        });
      }

      setBecas(becasData);
    } catch (error) {
      console.error('Error al obtener las becas:', error);
    }
  };

  useEffect(() => {
    cargarBecas();
  }, []);
  
  const handleBuscar = (e) => {
    setBusqueda(e.target.value);
  };

  const handleOrdenar = (criterio) => {
    setOrden(criterio);
    cargarBecas();
  };

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
    <form>
      <h1>Lista de Becas</h1>
      <div className='filtro-container'>
      <select value={orden} onChange={(e) => setOrden(e.target.value)}>
          <option value="">Defecto</option>
          <option value="nombre">Nombre</option>
          <option value="inicio">Fecha de Inicio</option>
          <option value="fin">Fecha de Fin</option>
        </select>
        <button type="button" onClick={handleOrdenar}>
          Ordenar
        </button>

        <input
          type="text"
          id="busqueda"
          value={busqueda}
          onChange={handleBuscar}
          placeholder='Buscar por Nombre'
        />
        <button type="button" onClick={cargarBecas}>
          Buscar
        </button>
      </div>
  
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
    </form>
  );
};

export default ListaBecas;

