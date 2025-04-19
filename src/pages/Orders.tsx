import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "../services/api";
import { Link } from "react-router-dom";

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

  if (loading) return <div className="p-6">Cargando órdenes...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Órdenes</h1>

      {orders.length === 0 ? (
        <p>No hay órdenes disponibles.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Estado</th>
                <th className="text-left py-3 px-4">Fecha</th>
                <th className="text-left py-3 px-4">Destino</th>
                <th className="text-left py-3 px-4">Producto</th>
                <th className="text-left py-3 px-4">Peso</th>
                <th className="text-left py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="py-2 px-4">{order.id}</td>
                  <td className="py-2 px-4">{order.status}</td>
                  <td className="py-2 px-4">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">{order.destination_address}</td>
                  <td className="py-2 px-4">{order.product_type}</td>
                  <td className="py-2 px-4">{order.weight} kg</td>
                  <td className="py-2 px-4">
                    <Link
                      to={`/seguimiento/${order.id}`}
                      target="_blank"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Seguimiento
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
