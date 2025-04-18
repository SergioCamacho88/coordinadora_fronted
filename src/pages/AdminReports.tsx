import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { fetchReports } from "../services/reportsService";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  formatTiempoEntrega,
  formatTiempoEntregaMinutos,
} from "../utils/formatters";

interface ReportEntry {
  orderId: number;
  estado: string;
  tiempoEntregaHoras: number;
  transportista: string;
  fechaCreacion: string;
  fechaEntrega: string;
}

interface TransporteResumen {
  transportista: string;
  entregados: number;
  enTransito: number;
  totalEntregas: number;
  tiempoTotalMinutos: number;
  tiempoPromedioMinutos: number;
}

const calcularResumenTransportistas = (
  reports: ReportEntry[]
): TransporteResumen[] => {
  const resumen: { [key: string]: TransporteResumen } = {};

  reports.forEach((r) => {
    const inicio = new Date(r.fechaCreacion);
    const fin = new Date(r.fechaEntrega);
    const diffMs = fin.getTime() - inicio.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (!resumen[r.transportista]) {
      resumen[r.transportista] = {
        transportista: r.transportista,
        entregados: 0,
        enTransito: 0,
        totalEntregas: 0,
        tiempoTotalMinutos: 0,
        tiempoPromedioMinutos: 0,
      };
    }

    if (r.estado === "Entregado") {
      resumen[r.transportista].entregados += 1;
    } else if (r.estado === "En tránsito") {
      resumen[r.transportista].enTransito += 1;
    }

    resumen[r.transportista].totalEntregas += 1;
    resumen[r.transportista].tiempoTotalMinutos += diffMins;
  });

  // Calcular promedio
  return Object.values(resumen).map((t) => ({
    ...t,
    tiempoPromedioMinutos:
      t.totalEntregas > 0
        ? Math.round(t.tiempoTotalMinutos / t.totalEntregas)
        : 0,
  }));
};

export default function AdminReports() {
  const { token } = useAuth();

  const [reports, setReports] = useState<ReportEntry[]>([]);
  const [filters, setFilters] = useState({
    fechaInicio: "",
    fechaFin: "",
    estado: "",
    transportistaId: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  const [pagina, setPagina] = useState(1);
  const [limite] = useState(10);

  const handleFetchReports = useCallback(
    async (paginaActual = pagina) => {
      setLoading(true);
      try {
        if (!token) {
          throw new Error("No hay token de autenticación");
        }
        const data = await fetchReports(filters, paginaActual, limite);
        setReports(data);
        setPagina(paginaActual);
      } catch (error) {
        console.error("Error fetching reports", error);
      } finally {
        setLoading(false);
      }
    },
    [filters, limite, pagina, token]
  );

  useEffect(() => {
    handleFetchReports();
  }, [handleFetchReports]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Reportes de Envíos</h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="date"
          name="fechaInicio"
          value={filters.fechaInicio}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Fecha inicio"
        />
        <input
          type="date"
          name="fechaFin"
          value={filters.fechaFin}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Fecha fin"
        />
        <select
          name="estado"
          value={filters.estado}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Todos los estados</option>
          <option value="En espera">En espera</option>
          <option value="En tránsito">En tránsito</option>
          <option value="Entregado">Entregado</option>
        </select>
        <input
          type="text"
          name="transportistaId"
          value={filters.transportistaId}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="ID Transportista"
        />
      </div>

      <button
        onClick={() => handleFetchReports()}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-8"
      >
        Buscar
      </button>

      {/* Tabla */}
      <div className="overflow-x-auto">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Fecha</th>
                <th className="py-2 px-4 border">Estado</th>
                <th className="py-2 px-4 border">Transportista</th>
                <th className="py-2 px-4 border">Horas Entrega</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.orderId}>
                  <td className="py-2 px-4 border">{r.orderId}</td>
                  <td className="py-2 px-4 border">
                    {new Date(r.fechaCreacion).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border">{r.estado}</td>
                  <td className="py-2 px-4 border">{r.transportista}</td>
                  <td className="py-2 px-4 border">
                    {formatTiempoEntrega(r.fechaCreacion, r.fechaEntrega)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Paginación */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          onClick={() => handleFetchReports(pagina - 1)}
          disabled={pagina === 1}
          className={`px-4 py-2 rounded ${
            pagina === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          Anterior
        </button>

        <span className="text-gray-700 font-semibold">Página {pagina}</span>

        <button
          onClick={() => handleFetchReports(pagina + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Siguiente
        </button>
      </div>
      {/* Nueva tabla: Resumen por Transportista */}
      <div className="my-10">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Resumen de Entregas por Transportista
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Transportista</th>
                <th className="py-2 px-4 border">Asigandos </th>
                <th className="py-2 px-4 border">En tránsito</th>
                <th className="py-2 px-4 border">Entregados</th>
                <th className="py-2 px-4 border">Tiempo Total</th>
                <th className="py-2 px-4 border">Tiempo Promedio</th>
              </tr>
            </thead>
            <tbody>
              {calcularResumenTransportistas(reports).map((t) => (
                <tr key={t.transportista}>
                  <td className="py-2 px-4 border">{t.transportista}</td>
                  <td className="py-2 px-4 border">{t.totalEntregas}</td>
                  <td className="py-2 px-4 border">{t.enTransito}</td>
                  <td className="py-2 px-4 border">{t.entregados}</td>
                  <td className="py-2 px-4 border">
                    {formatTiempoEntregaMinutos(t.tiempoTotalMinutos)}
                  </td>
                  <td className="py-2 px-4 border">
                    {formatTiempoEntregaMinutos(t.tiempoPromedioMinutos)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfico: Tiempo de Entrega por ID de Orden */}
      <div className="my-10">
        <h2 className="text-3xl font-bold mb-2 text-center">
          Tiempo de Entrega por Orden
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Duración de entrega individual por ID de orden
        </p>

        <ResponsiveContainer width="100%" height={600}>
          <BarChart
            layout="vertical" // 👈 Cambiar a gráfico horizontal
            data={reports}
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickFormatter={(value) => `${value} min`}
              label={{
                value: "Tiempo (minutos)",
                position: "insideBottom",
                offset: -5,
                style: { fontSize: 14 },
              }}
            />
            <YAxis
              type="category"
              dataKey="orderId" // 👈 Mostrar el ID de la orden aquí
              tick={{ fontSize: 12 }}
              label={{
                value: "ID Orden",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fontSize: 14 },
              }}
            />
            <Tooltip
              formatter={(value: number) => {
                const horas = Math.floor(value / 60);
                const minutos = value % 60;
                if (horas > 0 && minutos > 0)
                  return [`${horas}h ${minutos}m`, "Tiempo"];
                if (horas > 0 && minutos === 0) return [`${horas}h`, "Tiempo"];
                if (horas === 0 && minutos > 0)
                  return [`${minutos}m`, "Tiempo"];
                return ["Menos de 1 minuto", "Tiempo"];
              }}
            />
            <Bar
              dataKey={(entry) => {
                const inicio = new Date(entry.fechaCreacion);
                const fin = new Date(entry.fechaEntrega);
                const diffMs = fin.getTime() - inicio.getTime();
                const diffMins = Math.floor(diffMs / (1000 * 60));
                return diffMins;
              }}
              fill="#3b82f6"
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
