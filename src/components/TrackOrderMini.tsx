import { useEffect, useState } from "react";
import axios from "../services/api";
import { Box, Typography, Chip, Stack, CircularProgress } from "@mui/material";

interface Props {
  orderId: number;
}

interface HistoryEntry {
  status: string;
  changed_at: string;
}

const TrackOrderMini = ({ orderId }: Props) => {
  const [status, setStatus] = useState<string>("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resStatus = await axios.get(`/orders/${orderId}/status`);
        const resHistory = await axios.get(`/orders/${orderId}/history`);

        setStatus(resStatus.data.status);
        setHistory(resHistory.data.history);
      } catch (error) {
        console.error("Error al cargar seguimiento de la orden:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  if (loading) {
    return (
      <Box p={2} textAlign="center">
        <CircularProgress />
        <Typography mt={2}>Cargando seguimiento...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle1" mb={1}>
        Estado actual:
      </Typography>

      {status ? (
        <Chip label={status} color="primary" sx={{ mb: 3 }} />
      ) : (
        <Typography color="text.secondary">Sin estado disponible</Typography>
      )}

      <Typography variant="subtitle1" mb={1}>
        Historial de estados:
      </Typography>

      {history.length > 0 ? (
        <Stack spacing={1}>
          {history.map((entry, idx) => (
            <Typography key={idx} variant="body2" color="text.secondary">
              {new Date(entry.changed_at).toLocaleString()} - {entry.status}
            </Typography>
          ))}
        </Stack>
      ) : (
        <Typography color="text.secondary">
          No hay historial disponible.
        </Typography>
      )}
    </Box>
  );
};

export default TrackOrderMini;
