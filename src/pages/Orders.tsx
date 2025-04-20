import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "../services/api";
import TrackOrderMini from "../components/TrackOrderMini"; // ajusta la ruta si es necesario

import {
  Box,
  Dialog,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert,
  Skeleton,
} from "@mui/material";

interface Order {
  id: number;
  status: string;
  created_at: string;
  destination_address: string;
  product_type: string;
  weight: number;
}

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!isAuthenticated) {
          throw new Error("No hay token de autenticación");
        }

        const response = await axios.get("/orders");
        setOrders(response.data);
      } catch (err: unknown) {
        console.error("Error fetching orders", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <Box p={4}>
        <Typography variant="h5" mb={2}>
          Cargando órdenes...
        </Typography>
        <Skeleton variant="rectangular" height={300} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">Error: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Órdenes
      </Typography>

      {orders.length === 0 ? (
        <Typography>No hay órdenes disponibles.</Typography>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Estado</strong>
                </TableCell>
                <TableCell>
                  <strong>Fecha</strong>
                </TableCell>
                <TableCell>
                  <strong>Destino</strong>
                </TableCell>
                <TableCell>
                  <strong>Producto</strong>
                </TableCell>
                <TableCell>
                  <strong>Peso</strong>
                </TableCell>
                <TableCell>
                  <strong>Acciones</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.destination_address}</TableCell>
                  <TableCell>{order.product_type}</TableCell>
                  <TableCell>{order.weight} kg</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => {
                        setSelectedOrderId(order.id);
                        setOpenDialog(true);
                      }}
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
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <Box p={3}>
          <Typography variant="h6" mb={2}>
            Seguimiento de Orden #{selectedOrderId}
          </Typography>

          {selectedOrderId ? (
            <TrackOrderMini orderId={selectedOrderId} />
          ) : (
            <Typography color="text.secondary">
              Selecciona una orden para ver su seguimiento.
            </Typography>
          )}

          <Box mt={3} textAlign="right">
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cerrar
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Orders;
