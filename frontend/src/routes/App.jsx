import React from 'react';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Portal de Becas Municipales</h1>
      </header>
      <main>
        <h2>Bienvenido al portal de postulación a becas municipales</h2>
        <p>Aquí puedes encontrar y postular a las becas disponibles en tu municipio.</p>
        <Link className='home-button' to="/becas">Ver becas disponibles</Link>
        <Link className='home-button' to="/postulacion/becas">Postular a una beca</Link>
      </main>
    </div>
  );
}

export default App;
