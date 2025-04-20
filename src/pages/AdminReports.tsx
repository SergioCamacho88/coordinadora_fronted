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
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  formatTiempoEntrega,
  formatTiempoEntregaMinutos,
} from "../utils/formatters";
import { SelectChangeEvent } from "@mui/material/Select";

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
  const [pagina, setPagina] = useState(1);
  const [limite] = useState(10);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFetchReports = useCallback(
    async (paginaActual = pagina) => {
      setLoading(true);
      try {
        if (!token) throw new Error("No hay token de autenticación");
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
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Reportes de Envíos
      </Typography>

      {/* Filtros */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={6}>
        <TextField
          type="date"
          name="fechaInicio"
          label="Fecha Inicio"
          value={filters.fechaInicio}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          type="date"
          name="fechaFin"
          label="Fecha Fin"
          value={filters.fechaFin}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <Select
          name="estado"
          value={filters.estado}
          onChange={handleSelectChange}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">Todos los estados</MenuItem>
          <MenuItem value="En espera">En espera</MenuItem>
          <MenuItem value="En tránsito">En tránsito</MenuItem>
          <MenuItem value="Entregado">Entregado</MenuItem>
        </Select>
        <TextField
          name="transportistaId"
          label="ID Transportista"
          value={filters.transportistaId}
          onChange={handleInputChange}
          fullWidth
        />
      </Stack>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleFetchReports()}
        sx={{ mb: 6 }}
      >
        Buscar
      </Button>

      {/* Tabla */}
      {loading ? (
        <Box textAlign="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 8 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Transportista</TableCell>
                <TableCell>Horas Entrega</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.orderId}>
                  <TableCell>{r.orderId}</TableCell>
                  <TableCell>
                    {new Date(r.fechaCreacion).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{r.estado}</TableCell>
                  <TableCell>{r.transportista}</TableCell>
                  <TableCell>
                    {formatTiempoEntrega(r.fechaCreacion, r.fechaEntrega)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Paginación */}
      <Stack direction="row" justifyContent="center" spacing={2} mb={8}>
        <Button
          variant="contained"
          disabled={pagina === 1}
          onClick={() => handleFetchReports(pagina - 1)}
        >
          Anterior
        </Button>
        <Typography variant="body1">Página {pagina}</Typography>
        <Button
          variant="contained"
          onClick={() => handleFetchReports(pagina + 1)}
        >
          Siguiente
        </Button>
      </Stack>

      {/* Resumen por Transportista */}
      <Box mb={8}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={4}>
          Resumen de Entregas por Transportista
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transportista</TableCell>
                <TableCell>Asignados</TableCell>
                <TableCell>En tránsito</TableCell>
                <TableCell>Entregados</TableCell>
                <TableCell>Tiempo Total</TableCell>
                <TableCell>Tiempo Promedio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calcularResumenTransportistas(reports).map((t) => (
                <TableRow key={t.transportista}>
                  <TableCell>{t.transportista}</TableCell>
                  <TableCell>{t.totalEntregas}</TableCell>
                  <TableCell>{t.enTransito}</TableCell>
                  <TableCell>{t.entregados}</TableCell>
                  <TableCell>
                    {formatTiempoEntregaMinutos(t.tiempoTotalMinutos)}
                  </TableCell>
                  <TableCell>
                    {formatTiempoEntregaMinutos(t.tiempoPromedioMinutos)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Gráfico: Tiempo de Entrega por Orden */}
      <Box>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
          Análisis del Tiempo de Entrega por Orden
        </Typography>
        <Typography textAlign="center" color="text.secondary" mb={4}>
          Visualiza cuánto tiempo tomó completar la entrega de cada orden
          individual (en minutos).
        </Typography>

        <ResponsiveContainer width="100%" height={600}>
          <BarChart
            layout="vertical"
            data={reports}
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickFormatter={(value) => `${value} min`}
              label={{
                value: "Tiempo de Entrega (minutos)",
                position: "insideBottom",
                offset: -5,
                style: { fontSize: 14 },
              }}
            />
            <YAxis
              type="category"
              dataKey="orderId"
              tick={{ fontSize: 12 }}
              label={{
                value: "ID de Orden",
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
                if (horas > 0) return [`${horas}h`, "Tiempo"];
                if (minutos > 0) return [`${minutos}m`, "Tiempo"];
                return ["<1m", "Tiempo"];
              }}
            />
            <Bar
              dataKey={(entry) => {
                const inicio = new Date(entry.fechaCreacion);
                const fin = new Date(entry.fechaEntrega);
                const diffMs = fin.getTime() - inicio.getTime();
                return Math.floor(diffMs / (1000 * 60));
              }}
              fill="#3b82f6"
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
