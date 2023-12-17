// ListaBecas.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getBecas, deleteBeca, getRequisitos, deleteRequisito, createRequisito} from '../../services/becas.service';

const ListaBecas = () => {
  const [becas, setBecas] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState(null);
  const { state } = location;
  const [success, setSuccess] = useState(null);
  const [modifySuccess, setModifySuccess] = useState(null);
  const [mostrarRequisitos, setMostrarRequisitos] = useState(false);
  const [requisitos, setRequisitos] = useState([]);
  const [nuevoRequisito, setNuevoRequisito] = useState('');

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
          } else if (orden === 'fin') {
            const dateA = convertirFormatoFecha(a.fecha_de_fin);
            const dateB = convertirFormatoFecha(b.fecha_de_fin);
            return dateA.localeCompare(dateB);
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
    if (location.state && location.state.success) {
      setSuccess('La beca se ha creado con éxito');
    }

    if (location.state && location.state.modifySuccess) {
      setModifySuccess('La beca se ha modificado con éxito');
    }
  }, [location.state]);

  useEffect(() => {
    const fetchRequisitos = async () => {
      try {
        const response = await getRequisitos();
        if (response.state === 'Success') {
          const requisitosData = response.data;
          setRequisitos(requisitosData);
        } else {
          console.error('Error al obtener los requisitos:', response);
        }
      } catch (error) {
        console.error('Error al obtener los requisitos:', error);
      }
    };
  
    fetchRequisitos();
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

  const handleBorrarRequisito = async (requisitoId) => {
    try {
      await deleteRequisito(requisitoId);
        setRequisitos((prevRequisitos) =>
        prevRequisitos.filter((requisito) => requisito._id !== requisitoId)
      );  
    } catch (error) {
      console.error('Error al borrar el requisito:', error);
    }
  };

  const handleAgregarRequisito = async () => {
    try {
      await createRequisito({ descripcion: nuevoRequisito });
      const response = await getRequisitos();
      if (response.state === 'Success') {
          const requisitosData = response.data;
          setRequisitos(requisitosData);
      } else {
        console.error('Error al obtener los requisitos:', response);
      }
  
      setNuevoRequisito('');
    } catch (error) {
      console.error('Error al agregar requisito:', error);
    }
  };

  const handleDeleteBeca = async (id) => {
    try {
      await deleteBeca(id);
      const updatedBecas = becas.filter((beca) => beca._id !== id);
      setBecas(updatedBecas);
      setSuccess('¡La beca se ha eliminado con éxito!');
    } catch (error) {
      console.error('Error al eliminar la beca:', error);
    }
  };

  const redirectToCrearBeca = () => {
    navigate('/gestion/crear');
  };

  const handleMostrarRequisitos = () => {
    setMostrarRequisitos(true);
  };

  return (
    <>
      {success && <div className="success-banner">{success}</div>}
      {modifySuccess && <div className="success-banner">{modifySuccess}</div>}
      <form>
        <h1>Lista de Becas</h1>
        <div className="filtro-container">
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
            placeholder="Buscar por Nombre"
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
              <tr key={beca._id} className="item-apelacion">
                <td>{beca.nombre}</td>
                <td>{beca.fecha_de_inicio}</td>
                <td>{beca.fecha_de_fin}</td>
                <td className="actions">
                  <button
                    className="ver-button"
                    onClick={() => handleVerBeca(beca._id)}
                  >
                    <span role="img" aria-label="Eye Icon">
                      👁️
                    </span>
                  </button>
                </td>
                <td className="actions">
                  <button
                    className="eliminar-button"
                    onClick={() => handleDeleteBeca(beca._id)}
                  >
                    <span role="img" aria-label="Trash Icon">
                      🗑️
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={redirectToCrearBeca}>Crear Beca</button>
        <button type="button" onClick={handleMostrarRequisitos}>
          Ver Requisitos
        </button>

        {mostrarRequisitos && (
        <div className="requisitos-form">
          <h2>Requisitos Existentes</h2>
          <table className="lista-apelaciones">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {requisitos.map((requisito) => (
                <tr key={requisito._id}>
                  <td>{requisito.descripcion}</td>
                  <td className="actions">
                    <button
                      className="eliminar-button"
                      onClick={() => handleBorrarRequisito(requisito._id)}
                    >
                      <span role="img" aria-label="Trash Icon">
                        🗑️
                      </span>
                    </button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
          <label>
            Nuevo Requisito:
            <input
              type="text"
              value={nuevoRequisito}
              onChange={(e) => setNuevoRequisito(e.target.value)}
            />
          </label>
          <button type="button" onClick={handleAgregarRequisito}>
            Agregar Requisito
          </button>
          <div> <button onClick={() => setMostrarRequisitos(false)}>Cerrar</button></div>
        </div>      
      )}
      </form>
    </>
  );
};

export default ListaBecas;