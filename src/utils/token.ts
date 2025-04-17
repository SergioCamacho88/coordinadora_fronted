import type { User } from "../types/User";

export const saveToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const removeToken = (): void => {
  localStorage.removeItem("token");
};

export const saveUser = (user: User): void => {
  if (!user) {
    console.error("Intento de guardar un usuario undefined o null");
    return;
  }
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = (): User | null => {
  try {
    const json = localStorage.getItem("user");
    if (!json || json === "undefined" || json === "null") {
      return null;
    }
    return JSON.parse(json) as User;
  } catch (e) {
    console.error("Error al parsear el usuario desde localStorage:", e);
    return null;
  }
};

export const removeUser = (): void => {
  localStorage.removeItem("user");
};
