import { useEffect, useState } from "react";
import axios from "../services/api";
import { Ruta } from "../services/routesService";

interface Order {
  id: number;
  weight: number;
  dimensions: string;
  productType: string;
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

    // 🚀 Conexión WebSocket
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

          setOrders((prevOrders) => {
            return prevOrders
              .map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
              )
              .filter((order) => order.status === "En espera");
          });
        }

        if (data.type === "new_order") {
          const { order } = data;

          if (order.status === "En espera") {
            setOrders((prevOrders) => [...prevOrders, order]);
          }
        }
      } catch (error) {
        console.error(
          "❌ Error procesando mensaje WebSocket en AdminDashboard:",
          error
        );
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
      fetchOrders(); // 🚀 Ya estaba
      fetchTransportistas(); // 🚀 AÑADIR ESTA LÍNEA para refrescar transportistas
    } catch (err) {
      console.error("Error al asignar:", err);
      setMessage("Error al asignar la orden.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6">
        Panel de Administración - Órdenes en Espera
      </h1>
      {message && <p className="text-green-600 mb-4">{message}</p>}

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">ID Orden</th>
            <th className="py-2">Peso</th>
            <th className="py-2">Dimensiones</th>
            <th className="py-2">Producto</th>
            <th className="py-2">Dirección</th>
            <th className="py-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="text-center">
              <td className="border p-2">{order.id}</td>
              <td className="border p-2">{order.weight} kg</td>
              <td className="border p-2">{order.dimensions}</td>
              <td className="border p-2">{order.productType}</td>
              <td className="border p-2">{order.destination_address}</td>
              <td className="border p-2">
                {assigningOrderId === order.id ? (
                  <div className="flex flex-col items-center">
                    <select
                      value={selectedTransportistas[order.id] || ""}
                      onChange={(e) =>
                        handleTransportistaSelectChange(
                          order.id,
                          e.target.value
                        )
                      }
                      className="border p-1 mb-2"
                      disabled={loadingTransportistas}
                    >
                      {loadingTransportistas ? (
                        <option>Cargando transportistas...</option>
                      ) : transportistas.length === 0 ? (
                        <option>No hay transportistas disponibles</option>
                      ) : (
                        <>
                          <option value="">Selecciona transportista</option>
                          {transportistas.map((transportista) => {
                            const isDisabled =
                              transportista.capacity < order.weight;
                            return (
                              <option
                                key={transportista.id}
                                value={transportista.id}
                                disabled={isDisabled}
                              >
                                {transportista.name} (Capacidad:{" "}
                                {transportista.capacity} kg){" "}
                                {isDisabled
                                  ? "[No disponible]"
                                  : "[Disponible]"}
                              </option>
                            );
                          })}
                        </>
                      )}
                    </select>

                    <select
                      value={selectedRutas[order.id] || ""}
                      onChange={(e) =>
                        handleRutaSelectChange(order.id, e.target.value)
                      }
                      className="border p-1 mb-2"
                      disabled={loadingRutas}
                    >
                      {loadingRutas ? (
                        <option>Cargando rutas...</option>
                      ) : rutas.length === 0 ? (
                        <option>No hay rutas disponibles</option>
                      ) : (
                        <>
                          <option value="">Selecciona ruta</option>
                          {rutas.map((ruta) => (
                            <option key={ruta.id} value={ruta.id}>
                              {ruta.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>

                    <button
                      onClick={() => handleAssign(order.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Confirmar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAssigningOrderId(order.id)}
                    className="bg-purple-500 text-white px-3 py-1 rounded"
                  >
                    Asignar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
