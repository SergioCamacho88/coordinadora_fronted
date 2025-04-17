import { useState, ReactNode } from "react";
import { AuthContext } from "./AuthContextObject";
import {
  getToken,
  removeToken,
  saveToken,
  getUser,
  saveUser,
  removeUser,
} from "../utils/token";
import { User } from "../types/User";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(getToken());
  const [user, setUser] = useState<User | null>(getUser());

  const login = (newToken: string, newUser: User) => {
    saveToken(newToken);
    saveUser(newUser);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    removeToken();
    removeUser();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
