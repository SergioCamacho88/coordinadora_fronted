import { useEffect, useState } from "react";
import axios from "../services/api";
import { Ruta } from "../services/routesService";
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
  Select,
  MenuItem,
  Button,
  Stack,
  Alert,
} from "@mui/material";

interface Order {
  id: number;
  weight: number;
  dimensions: string;
  product_type: string;
  destination_address: string;
  status: string;
}

interface Transportista {
  id: number;
  name: string;
  capacity: number;
}

const AdminDashboard = () => {
  const [loadingRutas, setLoadingRutas] = useState(false);
  const [loadingTransportistas, setLoadingTransportistas] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [assigningOrderId, setAssigningOrderId] = useState<number | null>(null);
  const [selectedTransportistas, setSelectedTransportistas] = useState<{
    [key: number]: string;
  }>({});
  const [selectedRutas, setSelectedRutas] = useState<{ [key: number]: string }>(
    {}
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchTransportistas();
    fetchRutas();

    const socket = new WebSocket("ws://localhost:3000");

    socket.addEventListener("open", () => {
      console.log("✅ WebSocket conectado en AdminDashboard");
    });

    socket.addEventListener("message", (event) => {
      console.log("📨 Mensaje WebSocket recibido:", event.data);
      try {
        const data = JSON.parse(event.data);

        if (data.type === "status_update") {
          const { orderId, newStatus } = data;

          setOrders((prevOrders) =>
            prevOrders
              .map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
              )
              .filter((order) => order.status === "En espera")
          );
        }

        if (data.type === "new_order") {
          const { order } = data;

          if (order.status === "En espera") {
            setOrders((prevOrders) => [...prevOrders, order]);
          }
        }
      } catch (error) {
        console.error("❌ Error procesando mensaje WebSocket:", error);
      }
    });

    socket.addEventListener("close", () => {
      console.log("🔌 WebSocket desconectado en AdminDashboard");
    });

    socket.addEventListener("error", (error) => {
      console.error("❌ Error en WebSocket en AdminDashboard:", error);
    });

    return () => {
      socket.close();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/orders", {
        params: { status: "En espera" },
      });
      const orders = Array.isArray(response.data)
        ? response.data
        : response.data.data;
      setOrders(orders);
    } catch (err) {
      console.error("Error al cargar órdenes:", err);
    }
  };

  const fetchTransportistas = async () => {
    try {
      setLoadingTransportistas(true);
      const response = await axios.get("/transportistas/available");
      const transportistas = Array.isArray(response.data)
        ? response.data
        : response.data.data;
      setTransportistas(transportistas);
    } catch (err) {
      console.error("Error al cargar transportistas:", err);
    } finally {
      setLoadingTransportistas(false);
    }
  };

  const fetchRutas = async () => {
    try {
      setLoadingRutas(true);
      const response = await axios.get("/rutas");
      const rutas = Array.isArray(response.data)
        ? response.data
        : response.data.data;
      setRutas(rutas);
    } catch (err) {
      console.error("Error al cargar rutas:", err);
    } finally {
      setLoadingRutas(false);
    }
  };

  const handleTransportistaSelectChange = (
    orderId: number,
    transportistaId: string
  ) => {
    setSelectedTransportistas((prev) => ({
      ...prev,
      [orderId]: transportistaId,
    }));
  };

  const handleRutaSelectChange = (orderId: number, rutaId: string) => {
    setSelectedRutas((prev) => ({
      ...prev,
      [orderId]: rutaId,
    }));
  };

  const handleAssign = async (orderId: number) => {
    const transportistaId = selectedTransportistas[orderId];
    const rutaId = selectedRutas[orderId];

    if (!transportistaId || !rutaId) {
      setMessage("Selecciona un transportista y una ruta.");
      return;
    }

    try {
      await axios.post(`/orders/${orderId}/assign`, {
        transportistaId: parseInt(transportistaId),
        rutaId: parseInt(rutaId),
      });

      setMessage("Orden asignada correctamente.");
      setAssigningOrderId(null);
      fetchOrders();
      fetchTransportistas();
    } catch (err) {
      console.error("Error al asignar:", err);
      setMessage("Error al asignar la orden.");
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Panel de Administración - Órdenes en Espera
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 4 }}>
          {message}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Orden</TableCell>
              <TableCell>Peso</TableCell>
              <TableCell>Dimensiones</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.weight} kg</TableCell>
                <TableCell>{order.dimensions}</TableCell>
                <TableCell>{order.product_type}</TableCell>
                <TableCell>{order.destination_address}</TableCell>
                <TableCell>
                  {assigningOrderId === order.id ? (
                    <Stack spacing={2}>
                      <Select
                        value={selectedTransportistas[order.id] || ""}
                        onChange={(e) =>
                          handleTransportistaSelectChange(
                            order.id,
                            e.target.value
                          )
                        }
                        size="small"
                        fullWidth
                        disabled={loadingTransportistas}
                      >
                        {loadingTransportistas ? (
                          <MenuItem disabled>
                            Cargando transportistas...
                          </MenuItem>
                        ) : (
                          [
                            <MenuItem key="placeholder" value="">
                              Selecciona transportista
                            </MenuItem>,
                            ...transportistas.map((t) => (
                              <MenuItem
                                key={t.id}
                                value={t.id}
                                disabled={t.capacity < order.weight}
                              >
                                {t.name} ({t.capacity} kg){" "}
                                {t.capacity < order.weight
                                  ? "[No disponible]"
                                  : "[Disponible]"}
                              </MenuItem>
                            )),
                          ]
                        )}
                      </Select>

                      <Select
                        value={selectedRutas[order.id] || ""}
                        onChange={(e) =>
                          handleRutaSelectChange(order.id, e.target.value)
                        }
                        size="small"
                        fullWidth
                        disabled={loadingRutas}
                      >
                        {loadingRutas ? (
                          <MenuItem disabled>Cargando rutas...</MenuItem>
                        ) : (
                          [
                            <MenuItem key="placeholder" value="">
                              Selecciona ruta
                            </MenuItem>,
                            ...rutas.map((ruta) => (
                              <MenuItem key={ruta.id} value={ruta.id}>
                                {ruta.name}
                              </MenuItem>
                            )),
                          ]
                        )}
                      </Select>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAssign(order.id)}
                        fullWidth
                      >
                        Confirmar
                      </Button>
                    </Stack>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => setAssigningOrderId(order.id)}
                      fullWidth
                    >
                      Asignar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminDashboard;
