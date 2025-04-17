import { useState, ReactNode } from 'react';
import { AuthContext } from './AuthContextObject';  // 👈 Importar el context
import { getToken, removeToken, saveToken } from '../utils/token';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(getToken());

  const login = (newToken: string) => {
    saveToken(newToken);
    setToken(newToken);
  };

  const logout = () => {
    removeToken();
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user: null, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
