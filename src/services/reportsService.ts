import { Filters } from "../types/Filters";
import api from "./api";

export const fetchReports = async (filters: Filters, pagina = 1, limite = 10) => {
  const cleanFilters: Record<string, string | number> = {};

  if (filters.fechaInicio) cleanFilters.fechaInicio = filters.fechaInicio;
  if (filters.fechaFin) cleanFilters.fechaFin = filters.fechaFin;
  if (filters.estado) cleanFilters.estado = filters.estado;
  if (filters.transportistaId) cleanFilters.transportistaId = filters.transportistaId;

  cleanFilters.pagina = pagina;
  cleanFilters.limite = limite;

  try {
    const { data } = await api.get(`/reportes/envios`, {
      params: cleanFilters,
    });
    return data;
  } catch (error: unknown) {
    console.error("Error fetching reports:", error);
    throw new Error("Error fetching reports");
  }
};
