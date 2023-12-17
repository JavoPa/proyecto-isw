// ListaPostulantes.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPostulantes } from '../../services/postulantes.service';

const ListaPostulantes = () => {
  const [Postulantes, setPostulantes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [busquedaType, setBusquedaType] = useState('nombres'); // Default search type
  const navigate = useNavigate();

  const cargarPostulantes = async () => {
    try {
      let Postulantes = await getPostulantes();

      if (busqueda) {
        console.log(busqueda, busquedaType);

        switch (busquedaType) {
          case 'rut':
            Postulantes = Postulantes.filter((postulante) =>
              postulante[busquedaType] === parseInt(busqueda)
            );
            break;
          default:
            Postulantes = Postulantes.filter((postulante) =>
              postulante[busquedaType].toLowerCase().includes(busqueda.toLowerCase())
            );
            break;
        }
      }

      setPostulantes(Postulantes);
    } catch (error) {
      console.error('Error al obtener los Postulantes:', error);
    }
  };

  useEffect(() => {
    cargarPostulantes();
  }, []);

  const handleBuscar = () => {
    cargarPostulantes();
  };

  const handleBuscarTypeChange = (e) => {
    setBusquedaType(e.target.value);
  };

  const handleVerPostulante = (id) => {
    navigate(`/gestion/postulante/${id}`);
  };

  return (
    <form>
      <div className='filtro-container'>
        <select
          value={busquedaType}
          onChange={handleBuscarTypeChange}
        >
          <option value="nombres">Nombres</option>
          <option value="apellidos">Apellidos</option>
          <option value="rut">RUT</option>
          <option value="email">Email</option>
        </select>
        <input
          type="text"
          id="busqueda"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder='Busqueda'
        />
        <button type="button" onClick={handleBuscar}>
          Buscar
        </button>
      </div>
      <div>
        <h1>Lista de Postulantes</h1>
        <table className="lista-apelaciones">
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>RUT</th>
              <th>Email</th>
              <th>Ver</th>
            </tr>
          </thead>
          <tbody>
            {Postulantes.map((postulante) => (
              <tr key={postulante._id} className='item-apelacion'>
                <td>{postulante.nombres}</td>
                <td>{postulante.apellidos}</td>
                <td>{postulante.rut}</td>
                <td>{postulante.email}</td>
                <td className="actions">
                  <button className="ver-button" onClick={() => handleVerPostulante(postulante._id)}>
                    <span role="img" aria-label="Eye Icon">👁️</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
};

export default ListaPostulantes;

