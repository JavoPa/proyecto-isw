import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getBecaById } from '../../services/becas.service';

const DetallesBeca = () => {
  const { _id } = useParams();
  const [beca, setBeca] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDetallesBeca = async () => {
      try {
        const response = await getBecaById(_id);
        const becaData = response.data; // Accede a la propiedad "data"
        setBeca(becaData);
        console.log('Datos de la beca:', becaData);
      } catch (error) {
        console.error('Error al obtener los detalles de la beca:', error);
      }
    };

    cargarDetallesBeca();
  }, [_id]);

  if (!beca) {
    return <div>Cargando...</div>;
  }

  const handleModificarBeca = () => {
    navigate(`/gestion/modificar/${_id}`);
  };

  return (
    <div>
      <h1>Detalles de la Beca</h1>
      <p>Nombre: {beca.nombre}</p>
      <p>Requisitos: {beca.requisitos.join(', ')}</p>
      <p>Documentos: {beca.documentos.join(', ')}</p>
      <p>Fecha de inicio: {beca.fecha_de_inicio}</p>
      <p>Fecha de fin: {beca.fecha_de_fin}</p>
      <p>Dirigida a: {beca.dirigida.join(', ')}</p>
      <p>Monto: {beca.monto}</p>
      <p>Pagos: {beca.tipo_pago}</p>

      <button onClick={handleModificarBeca}>Modificar Beca</button>
    </div>
  );
};

export default DetallesBeca;