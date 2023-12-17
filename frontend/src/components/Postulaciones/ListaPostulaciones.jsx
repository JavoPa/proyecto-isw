import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPostulaciones, getInforme } from '../../services/estado.service';

const ListaPostulaciones = () => {
    const [Postulaciones, setPostulaciones] = useState([]);
    const [Informe, setInforme] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [busquedaType, setBusquedaType] = useState('estado'); // Default search type
    const navigate = useNavigate();

    const cargarPostulaciones = async () => {
        try {
            const Postulaciones = await getPostulaciones();
            let data = [];
            for (const i in Postulaciones.data) {
                data.push({
                    _id: Postulaciones.data[i]._id,
                    fechaRecepcion: Postulaciones.data[i].fecha_recepcion,
                    estado: Postulaciones.data[i].estado,
                    motivos: Postulaciones.data[i].motivos,
                    nombreBeca: Postulaciones.data[i].beca.nombre,
                    nombrePostulante: Postulaciones.data[i].postulante.nombres + ' ' + Postulaciones.data[i].postulante.apellidos,
                    puntaje: parseInt(Postulaciones.data[i].puntaje),
                    documentosFaltantes: Postulaciones.data[i].documentosFaltantes
                });
            }

            if (busqueda) {
                console.log(busqueda, busquedaType);
    
                switch (busquedaType) {
                    case 'puntaje':
                        data = data.filter((postulacion) =>
                            postulacion[busquedaType] === parseInt(busqueda)
                        );
                        break;
                    default:
                        data = data.filter((postulacion) =>
                            postulacion[busquedaType].toLowerCase().includes(busqueda.toLowerCase())
                        );
                        break;
                }
            }
            
            setPostulaciones(data);
        } catch (error) {
            console.error('Error al obtener los Postulaciones:', error);
        }
    };

    useEffect(() => {
        cargarPostulaciones();
    }, [])

    const handleBuscar = () => {
        cargarPostulaciones();
    };

    useEffect(() => {
        const getInformeGeneral = async () => {
            try {
                const Informe = await getInforme();
                const InformeData = new Blob([Informe], { type: Informe.type });
                setInforme(InformeData);
            } catch (error) {
                console.error('Error al obtener los detalles de la Postulacion:', error);
            }
        };

        getInformeGeneral();
    }, [])

    const handleBuscarTypeChange = (e) => {
        setBusquedaType(e.target.value);
    };

    const handleInforme = (event) => {
        if (Informe) {
            event.preventDefault();
            const a = document.createElement('a');
            a.href = URL.createObjectURL(Informe);
            a.download = 'InformeGeneral.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        }
    };

    const handleVerPostulacion = (id) => {
        navigate(`/gestion/postulacion/${id}`);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedDate = new Date(dateString).toLocaleDateString(undefined, options)
            .split('/').join('-'); // Replace slashes with dashes
        return formattedDate;
    };

    return (
        <form>

            <div className='filtro-container'>
                <select
                    value={busquedaType}
                    onChange={handleBuscarTypeChange}
                >
                    <option value="estado">Estado</option>
                    <option value="nombrePostulante">Postulante</option>
                    <option value="puntaje">Puntaje</option>
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
                <h1>Lista de Postulaciones</h1>
                <table className="lista-apelaciones">
                    <thead>
                        <tr>
                            <th>Fecha recepción</th>
                            <th>Estado</th>
                            <th>Motivos</th>
                            <th>Beca</th>
                            <th>Postulante</th>
                            <th>Puntaje</th>
                            <th>Documentos faltantes</th>
                            <th>Ver</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Postulaciones.map((postulacion) => (
                            <tr key={postulacion._id} className='item-apelacion'>
                                <td>{formatDate(postulacion.fechaRecepcion)}</td>
                                <td>{postulacion.estado}</td>
                                <td>{postulacion.motivos}</td>
                                <td>{postulacion.nombreBeca}</td>
                                <td>{postulacion.nombrePostulante}</td>
                                <td>{postulacion.puntaje}</td>
                                <td>{postulacion.documentosFaltantes.map((doc) => doc + " ")}</td>
                                <td className="actions">
                                    <button className="ver-button" onClick={() => handleVerPostulacion(postulacion._id)}>
                                        <span role="img" aria-label="Eye Icon">👁️</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <button onClick={(event) => handleInforme(event)}>Informe</button>
            </div>
        </form>
    );
};

export default ListaPostulaciones;