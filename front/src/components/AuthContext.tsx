import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  cedula: string;
  nombre: string;
  email: string;
  es_miembro: number;
  token: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string, remember: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Cargar datos de autenticación al iniciar
    const loadAuthData = () => {
      const storedUser = localStorage.getItem('cliente');
      const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    };
    
    loadAuthData();
  }, []);

  const login = (userData: User, authToken: string, remember: boolean) => {
    setUser(userData);
    setToken(authToken);
    
    localStorage.setItem('cliente', JSON.stringify(userData));
    
    if (remember) {
      localStorage.setItem('token', authToken);
    } else {
      sessionStorage.setItem('token', authToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cliente');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);