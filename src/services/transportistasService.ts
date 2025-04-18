import api from "./api"; // corregido

export interface Transportista {
  id: string;
  name: string;
  capacity: number;
}

export const getAvailableTransportistas = async (): Promise<
  Transportista[]
> => {
  const response = await api.get("/transportistas/available");
  return response.data;
};

