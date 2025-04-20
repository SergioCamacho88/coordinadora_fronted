import { useEffect, useState } from "react";
import { getHistorialEnvios } from "../../services";
import { Envio } from "../../types/Envio";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Skeleton,
} from "@mui/material";

const HistorialUser = () => {
  const [historial, setHistorial] = useState<Envio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const data = await getHistorialEnvios();
        setHistorial(data);
      } catch (error) {
        console.error("Error al cargar historial de envíos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  if (loading) {
    return (
      <Box p={4}>
        <Typography variant="h5" mb={2}>
          Cargando historial...
        </Typography>
        <Skeleton variant="rectangular" height={300} />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Historial de Envíos
      </Typography>

      {historial.length === 0 ? (
        <Typography>No tienes envíos en tu historial.</Typography>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Fecha</strong></TableCell>
                <TableCell><strong>Destino</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell><strong>Producto</strong></TableCell>
                <TableCell><strong>Peso</strong></TableCell>
                <TableCell><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historial.map((envio) => (
                <TableRow key={envio.id}>
                  <TableCell>{envio.id}</TableCell>
                  <TableCell>
                    {new Date(envio.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{envio.destination_address}</TableCell>
                  <TableCell>{envio.status}</TableCell>
                  <TableCell>{envio.product_type}</TableCell>
                  <TableCell>{envio.weight} kg</TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/seguimiento/${envio.id}`}
                      variant="contained"
                      size="small"
                      color="primary"
                    >
                      Seguimiento
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default HistorialUser;
