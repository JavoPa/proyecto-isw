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
import CrearBecas from './components/Becas/CrearBecas.jsx';
import ModificarBeca from './components/Becas/ModificarBeca.jsx';
import ListaBecasP from './components/Becas/ListaBecasP.jsx';
import BecaDetalleP from './components/Becas/BecaDetalleP.jsx';
import AdminRoot from './routes/AdminRoot.jsx';
import ListaPostulantes from './components/Postulantes/ListaPostulantes.jsx';
import PostulanteDetalle from './components/Postulantes/PostulanteDetalle.jsx';
import ListaPostulaciones from './components/Postulaciones/ListaPostulaciones.jsx';
import PostulacionDetalle from './components/Postulaciones/PostulacionDetalle.jsx';
import AppAdmin from './routes/AppAdmin.jsx';
import BecasPostulacion from './routes/BecasPostulacion.jsx';
import Postular from './routes/Postular.jsx';
import Pefil from './routes/Perfil.jsx';

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
      {
        path: '/becas',
        element: <ListaBecasP/>,
      },
      {
        path:"/beca/:_id", 
        element:<BecaDetalleP/>,
      },
    ],
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
      {
        path: 'becas',
        element: <BecasPostulacion />,
      },
      {
        path:"postular", 
        element:<Postular/>,
      },
    ],
  },
  {
    path: '/users',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'perfil',
        element: <Pefil />,
      },
    ],
  },
  { // Rutas privadas de gestion por parte del encargado
    path: '/gestion',
    element: <AdminRoot />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <AppAdmin />,
      },
      {
        path: 'apelaciones',
        element: <Apelaciones />,
      },
      {
        path: 'becas',
        element: <ListaBecas />,
      },
      {
        path: 'postulaciones',
        element: <ListaPostulaciones />
      },
      {
        path: 'postulacion/:_id',
        element: <PostulacionDetalle />
      },
      {
        path: 'postulantes',
        element: <ListaPostulantes />
      },
      {
        path: "postulante/:_id",
        element: <PostulanteDetalle />
      },
      {
        path:"beca/:_id", 
        element:<BecaDetalle />,
      },
      {
        path: 'crear',
        element: <CrearBecas />,
      },
      {
        path:"modificar/:_id", 
        element:<ModificarBeca />,
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