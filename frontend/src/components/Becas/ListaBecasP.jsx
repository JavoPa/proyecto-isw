// ListaBecas.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBecas} from '../../services/becas.service';

const ListaBecas = () => {
  const [becas, setBecas] = useState([]);
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState(null);

  const convertirFormatoFecha = (fecha) => {
    const [day, month, year] = fecha.split('-');
    return `${year}-${month}-${day}`;
  };

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
              const dateA = convertirFormatoFecha(a.fecha_de_inicio);
              const dateB = convertirFormatoFecha(b.fecha_de_inicio);
              return dateA.localeCompare(dateB);
          }else if (orden === 'fin') {
              const dateA = convertirFormatoFecha(a.fecha_de_fin);
              const dateB = convertirFormatoFecha(b.fecha_de_fin);
              return dateA.localeCompare(dateB);
          }
            return 0;
          });
        }
  ;
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
    navigate(`/beca/${id}`);
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
            </tr>
          ))}
        </tbody>
      </table>
    </form>
  );
};

export default ListaBecas;

