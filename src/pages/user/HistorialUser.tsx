import { useEffect, useState } from "react";
import { getHistorialEnvios } from "../../services";
import { Envio } from "../../types/Envio";
import { Link } from "react-router-dom";

const HistorialUser = () => {
  const [historial, setHistorial] = useState<Envio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const data = await getHistorialEnvios(); // Llamada a API
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
    return <div className="text-center py-10">Cargando historial...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Historial de Envíos</h1>
      {historial.length === 0 ? (
        <p>No tienes envíos en tu historial.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Fecha</th>
                <th className="text-left py-3 px-4">Destino</th>
                <th className="text-left py-3 px-4">Estado</th>
                <th className="text-left py-3 px-4">Producto</th>
                <th className="text-left py-3 px-4">Peso</th>
                <th className="text-left py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((envio) => (
                <tr key={envio.id} className="border-t">
                  <td className="py-2 px-4">{envio.id}</td>
                  <td className="py-2 px-4">
                    {new Date(envio.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">{envio.destination_address}</td>
                  <td className="py-2 px-4">{envio.status}</td>
                  <td className="py-2 px-4">{envio.product_type}</td>
                  <td className="py-2 px-4">{envio.weight} kg</td>
                  <td className="py-2 px-4">
                    <Link
                      to={`/seguimiento/${envio.id}`}
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

export default HistorialUser;
