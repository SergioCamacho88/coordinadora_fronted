import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/api";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Alert,
  Divider,
} from "@mui/material";

interface HistoryEntry {
  status: string;
  changed_at: string;
}

const TrackOrderPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [status, setStatus] = useState<string>("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await axios.get(`/orders/${orderId}/status`);
        setStatus(response.data.status);
      } catch (err) {
        console.error(err);
        setError("Error al obtener el estado de la orden.");
      }
    };

    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(`/orders/${orderId}/history`);
        setHistory(response.data.history);
      } catch (err) {
        console.error(err);
        setError("Error al obtener el historial de la orden.");
      }
    };

    const fetchAll = async () => {
      await fetchOrderStatus();
      await fetchOrderHistory();
    };

    fetchAll();

    const socket = new WebSocket("ws://localhost:3000");

    socket.addEventListener("open", () => {
      console.log("✅ WebSocket conectado");
    });

    socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);

        if (
          data.orderId.toString() === orderId &&
          typeof data.newStatus === "string" &&
          data.newStatus.trim() !== ""
        ) {
          console.log("📨 Actualizando estado:", data.newStatus);
          setStatus(data.newStatus);

          setHistory((prevHistory) => [
            ...prevHistory,
            {
              status: data.newStatus,
              changed_at: data.updatedAt || new Date().toISOString(),
            },
          ]);
        } else {
          console.warn("⚠️ WebSocket recibido sin status válido:", data);
        }
      } catch (error) {
        console.error("❌ Error procesando mensaje WebSocket:", error);
      }
    });

    socket.addEventListener("close", () => {
      console.log("🔌 WebSocket desconectado");
    });

    socket.addEventListener("error", (error) => {
      console.error("❌ Error en WebSocket:", error);
    });

    return () => {
      socket.close();
    };
  }, [orderId]);

  const getChipColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "en espera":
        return "warning";
      case "en tránsito":
        return "info";
      case "entregado":
        return "success";
      default:
        return "default";
    }
  };

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Seguimiento de Orden #{orderId}
      </Typography>

      <Typography variant="h6" mb={2}>
        Estado actual:
      </Typography>

      {status ? (
        <Chip
          label={status}
          color={getChipColor(status)}
          sx={{ fontWeight: "bold", mb: 4 }}
        />
      ) : (
        <Typography color="text.secondary">Sin estado</Typography>
      )}

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" mb={2}>
        Historial de estados:
      </Typography>

      {Array.isArray(history) && history.length > 0 ? (
        <Stack spacing={2}>
          {history.map((entry, index) => (
            <Box key={index} display="flex" alignItems="center" gap={2}>
              <Typography variant="body2" color="text.secondary">
                {new Date(entry.changed_at).toLocaleString()}
              </Typography>
              <Chip
                label={entry.status}
                color={getChipColor(entry.status)}
                size="small"
              />
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography>No hay historial disponible.</Typography>
      )}
    </Box>
  );
};

export default TrackOrderPage;
