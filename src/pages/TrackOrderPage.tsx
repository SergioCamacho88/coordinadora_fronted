import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/api";

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

          // 🚀 Añadir nueva entrada al historial localmente
          setHistory((prevHistory) => [
            ...prevHistory,
            {
              status: data.newStatus,
              changed_at: data.updatedAt || new Date().toISOString(), // Usamos updatedAt si viene
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

  const getBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "en espera":
        return "bg-yellow-400 text-black";
      case "en tránsito":
        return "bg-blue-400 text-white";
      case "entregado":
        return "bg-green-400 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-6">Seguimiento de Orden #{orderId}</h1>
      <p className="text-lg mb-6 flex items-center gap-2">
        Estado actual:
        {status ? (
          <span
            className={`px-2 py-1 rounded-full text-sm font-semibold ${getBadgeColor(
              status
            )}`}
          >
            {status}
          </span>
        ) : (
          <span className="text-gray-500">Sin estado</span>
        )}
      </p>

      <h2 className="text-xl mb-4">Historial de estados:</h2>
      <ul className="list-disc list-inside">
        {Array.isArray(history) && history.length > 0 ? (
          history.map((entry, index) => (
            <li key={index} className="flex items-center gap-2">
              <span>{new Date(entry.changed_at).toLocaleString()} -</span>
              <span
                className={`px-2 py-1 rounded-full text-sm font-semibold ${getBadgeColor(
                  entry.status
                )}`}
              >
                {entry.status}
              </span>
            </li>
          ))
        ) : (
          <li>No hay historial disponible.</li>
        )}
      </ul>
    </div>
  );
};

export default TrackOrderPage;
