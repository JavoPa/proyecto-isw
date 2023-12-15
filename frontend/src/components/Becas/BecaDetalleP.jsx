import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getBecaById } from '../../services/becas.service';

const DetallesBeca = () => {
  const { _id } = useParams();
  const [beca, setBeca] = useState(null);

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
  return (
    <form>
      <h1>Detalles de la Beca</h1>
      <table className="lista-apelaciones">
        <tbody>
          <tr className='item-apelacion'>
            <td className='detalle-variable'>Nombre:</td>
            <td>{beca.nombre}</td>
          </tr>
          <tr className='item-apelacion'>
            <td className='detalle-variable'>Requisitos:</td>
            <td>{beca.requisitos.join(', ')}</td>
          </tr>
          <tr className='item-apelacion'>
            <td className='detalle-variable'>Documentos:</td>
            <td>{beca.documentos.join(', ')}</td>
          </tr>
          <tr className='item-apelacion'>
            <td className='detalle-variable'>Fecha de inicio:</td>
            <td>{beca.fecha_de_inicio}</td>
          </tr>
          <tr className='item-apelacion'>
            <td className='detalle-variable'>Fecha de fin:</td>
            <td>{beca.fecha_de_fin}</td>
          </tr>
          <tr className='item-apelacion'>
            <td className='detalle-variable'>Dirigida a:</td>
            <td>{beca.dirigida.join(', ')}</td>
          </tr>
          <tr className='item-apelacion'>
            <td className='detalle-variable'>Monto de Pago:</td>
            <td>{beca.monto}</td>
          </tr>
          <tr className='item-apelacion'>
            <td className='detalle-variable'>Fechas de Pago:</td>
            <td>{beca.tipo_pago}</td>
          </tr>
        </tbody>
      </table>

    </form>
  );
};

export default DetallesBeca;