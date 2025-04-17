import api from "./api"; // corregido

export interface Transportista {
  id: string;
  name: string;
}

export const getAvailableTransportistas = async (): Promise<
  Transportista[]
> => {
  const response = await api.get("/transportistas/available");
  return response.data;
};
