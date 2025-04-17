import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const AdminDashboard = () => (
  <div>
    <h1 className="text-3xl mb-4">Panel de Administrador</h1>
    {/* Aquí componentes para asignar rutas, ver reportes, etc. */}
  </div>
);

const UserDashboard = () => (
  <div>
    <h1 className="text-3xl mb-4">Panel de Usuario</h1>
    <div className="space-y-4">
      <Link
        to="/create-order"
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Crear Nueva Orden
      </Link>
      {/* Aquí componentes para seguimiento */}
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <p>Cargando...</p>;
  return user.role === "admin" ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;
