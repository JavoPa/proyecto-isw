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
//import Apelar from './routes/Apelar.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicRoot />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      // {
      //   path: '/becas',
      //   element: <Becas />,
      // },
    ],
  },
  {
    path: '/postulacion',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'estado',
        element: <Estado />,
      },
      // {
      //   path: 'apelar',
      //   element: <Apelar />,
      // },
    ],
  },
  {
    path: '/gestion',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'apelaciones',
        element: <Apelaciones />,
      },
    ],
  },
  {
    path: '/auth',
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
