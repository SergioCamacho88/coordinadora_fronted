import api from "./api";
import { Envio } from "../types/Envio";

export const getHistorialEnvios = async (): Promise<Envio[]> => {
  try {
    const response = await api.get("/orders/history");
    return response.data;
  } catch (error) {
    console.error("Error al obtener historial de envíos:", error);
    throw error;
  }
};
