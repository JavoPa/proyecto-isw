import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBecaById, updateBeca, getRequisitos } from '../../services/becas.service';

const ModificarBeca = () => {
  const { _id } = useParams();
  const [beca, setBeca] = useState(null);
  const [nuevosDatos, setNuevosDatos] = useState({
    nombre: '',
    requisitos: [],
    documentos: [],
    fecha_inicio: '',
    fecha_fin: '',
    dirigida: [],
    monto: 0,
    tipo_pago: '',
    // Otros campos según sea necesario
  });
  const [requisitosOptions, setRequisitosOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const cargarDetallesBeca = async () => {
      try {
        const becaData = await getBecaById(_id);
        setBeca(becaData);

        if (becaData && becaData.requisitos) {
          setNuevosDatos({
            nombre: becaData.nombre,
            requisitos: becaData.requisitos.map((req) => req.codigo),
            documentos: becaData.documentos,
            fecha_inicio: becaData.fecha_inicio,
            fecha_fin: becaData.fecha_fin,
            dirigida: becaData.dirigida,
            monto: becaData.monto,
            tipo_pago: becaData.tipo_pago,
            // Otros campos según sea necesario
          });
        }
      } catch (error) {
        console.error('Error al obtener los detalles de la beca:', error);
      }
    };

    const fetchRequisitos = async () => {
      // Aquí deberías llamar a tu servicio para obtener la lista de requisitos
      // reemplaza `getRequisitos()` con tu función de servicio adecuada
      const requisitosData = await getRequisitos();
      setRequisitosOptions(requisitosData.data);
    };

    cargarDetallesBeca();
    fetchRequisitos();
  }, [_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevosDatos((prevDatos) => ({
      ...prevDatos,
      [name]: value,
    }));
  };

  const handleRequisitoToggle = (codigo) => {
    setNuevosDatos((prevDatos) => ({
      ...prevDatos,
      requisitos: prevDatos.requisitos.includes(codigo)
        ? prevDatos.requisitos.filter((req) => req !== codigo)
        : [...prevDatos.requisitos, codigo],
    }));
  };

  const handleModificarBeca = async () => {
  try {
    // Aquí puedes realizar alguna validación de datos antes de enviar la actualización
    const requisitosArray = nuevosDatos.requisitos.map((req) => Number(req));
    const documentosArray = Array.isArray(nuevosDatos.documentos) ? nuevosDatos.documentos : nuevosDatos.documentos.split(', ');
    const dirigidaArray = Array.isArray(nuevosDatos.dirigida) ? nuevosDatos.dirigida : nuevosDatos.dirigida.split(', ');

    console.log('Datos a enviar:', {
      ...nuevosDatos,
      requisitos: requisitosArray,
      documentos: documentosArray,
      dirigida: dirigidaArray,
    });

    await updateBeca(_id, {
      ...nuevosDatos,
      requisitos: requisitosArray,
      documentos: documentosArray,
      dirigida: dirigidaArray,
    });

    navigate('/gestion/becas'); // Redirige a la lista de becas después de la modificación
  } catch (error) {
    console.error('Error al modificar la beca:', error);
  }
};

  if (!beca || !requisitosOptions.length) {
    return <div>Cargando...</div>;
  }
  return (
    <div>
      <div>
        <h1>Modificar Beca</h1>
        <label>Nombre de la beca:</label>
        <input
          type="text"
          name="nombre"
          value={nuevosDatos.nombre}
          onChange={handleInputChange}
        />
      </div>
      <label>Requisitos:</label>
      {requisitosOptions.map((req) => (
        <div key={req.codigo}>
          <input
            type="checkbox"
            id={`req-${req.codigo}`}
            value={req.codigo}
            checked={nuevosDatos.requisitos.includes(req.codigo)}
            onChange={() => handleRequisitoToggle(req.codigo)}
          />
          <label htmlFor={`req-${req.codigo}`}>{req.descripcion}</label>
        </div>
      ))}
      <div>
        <label>Documentos (separados por coma):</label>
        <input
          type="text"
          name="documentos"
          value={nuevosDatos.documentos}
          onChange={handleInputChange}
        /> 
      </div>

        <label>Fecha de inicio:</label>
        <input
          type="text"
          name="fecha_inicio"
          value={nuevosDatos.fecha_inicio}
          onChange={handleInputChange}
        />
        <div>
        <label>Fecha de fin:</label>
        <input
          type="text"
          name="fecha_fin"
          value={nuevosDatos.fecha_fin}
          onChange={handleInputChange}
        />
        </div>
        <label>Dirigida a (separados por coma):</label>
        <input
          type="text"
          name="dirigida"
          value={nuevosDatos.dirigida}
          onChange={handleInputChange}
        />
        <div>
        <label>Monto:</label>
        <input
          type="number"
          name="monto"
          value={nuevosDatos.monto}
          onChange={handleInputChange}
        />
        </div>
        <label>Tipo de pago:</label>
        <input
          type="text"
          name="tipo_pago"
          value={nuevosDatos.tipo_Pago}
          onChange={handleInputChange}
        />
        <div></div>
      <button onClick={handleModificarBeca}>Guardar Cambios</button>
    </div>
  );
};
  export default ModificarBeca;