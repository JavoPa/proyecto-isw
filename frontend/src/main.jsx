import ReactDOM from 'react-dom/client';
import App from './routes/App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root.jsx';
import ErrorPage from './routes/ErrorPage.jsx';
import Login from './routes/Login.jsx';
import Apelaciones from './routes/Apelaciones.jsx';
import Estado from './routes/Estado.jsx';
import PublicRoot from './routes/PublicRoot.jsx';
import Apelar from './routes/Apelar.jsx';
import ListaBecas from './components/Becas/ListaBecas.jsx';
import BecaDetalle from './components/Becas/BecaDetalle.jsx';
import AdminRoot from './routes/AdminRoot.jsx';

const router = createBrowserRouter([
  { // Rutas publicas
    path: '/',
    element: <PublicRoot />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <App />,
      },
    ],
  },
  {
    path: '/becas',
    element: <ListaBecas />,
  },
  {
    path:"/beca/:_id", 
    element:<BecaDetalle />,
  },
  { // Rutas privadas de postulacion por parte del postulante
    path: '/postulacion',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'estado',
        element: <Estado />,
      },
      {
        path: 'apelar',
        element: <Apelar />,
      },
    ],
  },
  { // Rutas privadas de gestion por parte del encargado
    path: '/gestion',
    element: <AdminRoot />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'apelaciones',
        element: <Apelaciones />,
      },
    ],
  },
  { // Ruta de login
    path: '/auth',
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
