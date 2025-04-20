import api from "./api"; // tu instancia Axios correcta

export interface Ruta {
  id: number;
  name: string;
}

export const getAvailableRutas = async (): Promise<Ruta[]> => {
  const response = await api.get("/rutas");
  return response.data;
};
