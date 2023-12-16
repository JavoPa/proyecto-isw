import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBecaById, updateBeca, getRequisitos } from '../../services/becas.service';

const ModificarBeca = () => {
  const { _id } = useParams();
  const [beca, setBeca] = useState(null);
  const [ErrorBecas, setErrorBecas] = useState(null);
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
            requisitos: becaData.requisitos.map((req) => req._id),
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

  const handleRequisitoToggle = (requisitoId) => {
    setNuevosDatos((prevDatos) => ({
      ...prevDatos,
      requisitos: prevDatos.requisitos.includes(requisitoId)
        ? prevDatos.requisitos.filter((reqId) => reqId !== requisitoId)
        : [...prevDatos.requisitos, requisitoId],
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); 
    handleModificarBeca();
  };

  const handleModificarBeca = async () => {
  try {
    // Aquí puedes realizar alguna validación de datos antes de enviar la actualización
    const requisitosArray = nuevosDatos.requisitos;
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
    console.error('Error al crear la beca:', error.response.data.message);
    setErrorBecas(error.response.data.message);
  }
};

  if (!beca || !requisitosOptions.length) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <h2 style={{ textAlign:'center' }}>MODIFICANDO  BECA</h2>        
        <label className="input-label" htmlFor="motivos"><strong>Nombre Beca</strong></label>
        <input
          type="text"
          name="nombre"
          value={nuevosDatos.nombre}
          onChange={handleInputChange}
        />
        <label className="input-label" htmlFor="motivos"><strong>Requisitos de la Beca</strong></label>
          {requisitosOptions.map((req) => (
            <div key={req._id}>
              <input
                type="checkbox"
                id={`req-${req._id}`}
                value={req.codigo}
                checked={nuevosDatos.requisitos.includes(req._id)}
                onChange={() => handleRequisitoToggle(req._id)}
              />
              <label htmlFor={`req-${req._id}`}>{req.descripcion}</label>
            </div>
           ))}

        <label className="input-label" htmlFor="motivos"><strong>Documentos</strong></label>
        <input
          type="text"
          name="documentos"
          value={nuevosDatos.documentos}
          onChange={handleInputChange}
        /> 

        <label className="input-label" htmlFor="motivos"><strong>Fecha de Inicio</strong></label>
        <input
          type="text"
          name="fecha_inicio"
          value={nuevosDatos.fecha_inicio}
          onChange={handleInputChange}
        />

        <label className="input-label" htmlFor="motivos"><strong>Fecha de Fin</strong></label>
        <input
          type="text"
          name="fecha_fin"
          value={nuevosDatos.fecha_fin}
          onChange={handleInputChange}
        />

        <label className="input-label" htmlFor="motivos"><strong>Dirigida</strong></label>
        <input
          type="text"
          name="dirigida"
          value={nuevosDatos.dirigida}
          onChange={handleInputChange}
        />

        <label className="input-label" htmlFor="motivos"><strong>Monto de pago</strong></label>
        <input
          type="number"
          name="monto"
          value={nuevosDatos.monto}
          onChange={handleInputChange}
        />

        <label className="input-label" htmlFor="motivos"><strong>Intervalo de Pagos</strong></label>
        <input
          type="text"
          name="tipo_pago"
          value={nuevosDatos.tipo_Pago}
          onChange={handleInputChange}
        />

        <div></div>
        <button type="submit">Guardar Cambios</button>
      </form>
    {ErrorBecas && <div className="error-banner">{ErrorBecas}</div>}
    </>    
  );
};
  export default ModificarBeca;