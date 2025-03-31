import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  nombre: string;
  email: string;
  es_miembro: number;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Usuario por defecto para desarrollo
  const defaultUser: User = {
    id: 1,
    nombre: 'Usuario Desarrollo',
    email: 'dev@example.com',
    es_miembro: 1
  };

  const [user, setUser] = useState<User | null>(defaultUser); // Inicializamos con el usuario por defecto

  useEffect(() => {
    // Comentamos la verificación del localStorage para mantener siempre el usuario por defecto
    /*const storedUser = localStorage.getItem('cliente');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }*/
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('cliente', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(defaultUser); // En lugar de null, volvemos al usuario por defecto
    localStorage.removeItem('token');
    localStorage.removeItem('cliente');
    sessionStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);