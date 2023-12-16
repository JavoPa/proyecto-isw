// ListaPostulantes.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPostulantes } from '../../services/postulantes.service';

const ListaPostulantes = () => {
    const [Postulantes, setPostulantes] = useState([]);
    const navigate = useNavigate();
  
    const cargarPostulantes = async () => {
      try {
        const PostulantesData = await getPostulantes();
        setPostulantes(PostulantesData);
      } catch (error) {
        console.error('Error al obtener los Postulantes:', error);
      }
    };
  
    useEffect(() => {
      cargarPostulantes();
    }, []);
  
    const handleVerPostulante = (id) => {
      navigate(`/gestion/postulante/${id}`);
    };

    return (
    <form>
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
  
  