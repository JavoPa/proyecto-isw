import { createContext, useContext } from 'react';
//AuthContext para paginas publicas (no logueadas y logeadas de postulantes)
const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

// eslint-disable-next-line react/prop-types
export function PublicAuthProvider({ children }) {

  const user = JSON.parse(localStorage.getItem('user')) || '';
  const isAuthenticated = user ? true : false;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
