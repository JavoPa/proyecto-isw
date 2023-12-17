import React from 'react';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Portal de Becas Municipales</h1>
      </header>
      <main>
        <h2>Bienvenido al portal de gestión de becas municipales</h2>
        <p>Aquí puedes gestionar las becas disponibles en tu municipio.</p>
        <Link className='home-button' to="/gestion/becas">Gestionar becas</Link>
        <Link className='home-button' to="/gestion/postulaciones">Gestionar postulaciones</Link>
        <Link className='home-button' to="/gestion/postulantes">Gestionar postulantes</Link>
        <Link className='home-button' to="/gestion/apelaciones">Gestionar apelaciones</Link>
      </main>
    </div>
  );
}

export default App;
