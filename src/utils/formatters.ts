export const formatTiempoEntrega = (
  fechaInicio: string,
  fechaFin: string
): string => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  const diffMs = fin.getTime() - inicio.getTime();
  if (diffMs < 0) {
    return "Tiempo inválido";
  }

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const horas = Math.floor(diffMins / 60);
  const minutos = diffMins % 60;

  if (horas > 0 && minutos > 0) {
    return `${horas} horas ${minutos} minutos`;
  }
  if (horas > 0 && minutos === 0) {
    return `${horas} horas`;
  }
  if (horas === 0 && minutos > 0) {
    return `${minutos} minutos`;
  }
  return "Menos de 1 minuto";
};

export const formatTiempoEntregaHoras = (
  horas: number | null | undefined
): string => {
  if (horas === null || horas === undefined) {
    return "N/A";
  }
  if (horas === 0) {
    return "Menos de 1 hora";
  }
  if (horas === 1) {
    return "1 hora";
  }
  return `${horas} horas`;
};

export const formatTiempoEntregaMinutos = (
  minutos: number | null | undefined
): string => {
  if (minutos === null || minutos === undefined) {
    return "N/A";
  }
  if (minutos <= 0) {
    return "Menos de 1 minuto";
  }

  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;

  if (horas > 0 && minutosRestantes > 0) {
    return `${horas} horas ${minutosRestantes} minutos`;
  }
  if (horas > 0 && minutosRestantes === 0) {
    return `${horas} horas`;
  }
  return `${minutosRestantes} minutos`;
};
