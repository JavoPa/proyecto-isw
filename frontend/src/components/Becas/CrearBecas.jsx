import React, { useState, useEffect } from 'react';
import { createBeca, getRequisitos } from '../../services/becas.service';
import { useNavigate } from 'react-router-dom';

const CrearBecas = () => {
  const [nombre, setNombre] = useState('');
  const [requisitos, setRequisitos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [dirigida, setDirigida] = useState([]);
  const [monto, setMonto] = useState(0);
  const [tipoPago, setTipoPago] = useState('');
  const [requisitosOptions, setRequisitosOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequisitos();
  }, []);

  const fetchRequisitos = async () => {
    try {
      const response = await getRequisitos();
      const requisitosData = response.data; 
  
      // Verifica que requisitosData sea un array antes de mapear
      if (Array.isArray(requisitosData)) {
        const requisitosOptionsData = requisitosData.map((req) => ({ ...req, seleccionado: false }));
        setRequisitosOptions(requisitosOptionsData);
      } else {
        console.error('Los datos de requisitos no son un array:', requisitosData);
      }
    } catch (error) {
      console.error('Error al obtener requisitos:', error);
    }
  };
  
  const handleRequisitoToggle = (codigo) => {
    setRequisitosOptions((prevOptions) =>
      prevOptions.map((req) =>
        req.codigo === codigo ? { ...req, seleccionado: !req.seleccionado } : req
      )
    );
  };

  const handleCreateBeca = async () => {
    try {
      console.log("Beca Creada con exito")
      navigate('/gestion/becas');
    
    } catch (error) {
      console.error('Error al crear la beca:', error);
    }
  };

  return (
    <form onSubmit={handleCreateBeca}>
        <h2 style={{ textAlign:'center' }}>CREANDO BECA</h2>
            <label className="input-label" htmlFor="motivos"><strong>Nombre Beca</strong></label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
            placeholder=" Ejemplo: Beca Excelencia Academica " />  

            <label className="input-label" htmlFor="motivos"><strong>Requisitos de la Beca</strong></label>
            {requisitosOptions.map((req) => (
            <div key={req.codigo}>
              <input
                type="checkbox"
                id={req.codigo}
                checked={req.seleccionado}
                onChange={() => handleRequisitoToggle(req.codigo)}
              />
              <label htmlFor={req.codigo}>{req.descripcion}</label>
            </div>
              ))}

            <label className="input-label" htmlFor="motivos"><strong>Documentos</strong></label>
            <input type="text" value={documentos} onChange={(e) => setDocumentos(e.target.value.split(','))}
            placeholder=" Ingresa los documentos separados por comas: Carnet, Certificado " /> 
         
            <label className="input-label" htmlFor="motivos"><strong>Fecha de Inicio</strong></label>
            <input type="text" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} 
            placeholder=" Ejemplo: 01-01-2024 "/>

            <label className="input-label" htmlFor="motivos"><strong>Fecha de Fin</strong></label>
            <input type="text" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)}
            placeholder=" Ejemplo: 01-02-2024 " />
        
            <label className="input-label" htmlFor="motivos"><strong>Dirigida</strong></label>
            <input type="text" value={dirigida} onChange={(e) => setDirigida(e.target.value.split(','))} 
            placeholder=" Ingrese los beneficiados separados por comas: Chilenos, Estudiantes "/>
         
            <label className="input-label" htmlFor="motivos"><strong>Monto de pago</strong></label>
            <input type="number" value={monto} onChange={(e) => setMonto(e.target.value)}/>

            <label className="input-label" htmlFor="motivos"><strong>Intervalo de Pagos</strong></label>
            <input type="text" value={tipoPago} onChange={(e) => setTipoPago(e.target.value)}
            placeholder=" Ejemplo: Cada 3 meses "  /> 

      <button onClick={handleCreateBeca}>Crear Beca</button>
    </form>
  );
};

export default CrearBecas;