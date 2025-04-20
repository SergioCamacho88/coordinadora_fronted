import { useAuth } from "../hooks/useAuth";
import AdminDashboard from "./AdminDashboard";
import SidebarMenu from "../components/SidebarMenu";

// const AdminDashboard = () => (
//   <div>
//     <h1 className="text-3xl mb-4">Panel de Administrador</h1>
//     <a href="/assign-order" className="bg-purple-500 text-white p-2 rounded">
//       Asignar Orden a Transportista
//     </a>
//   </div>
// );

const UserDashboard = () => (
  <SidebarMenu>
    <h1>Panel de Usuario</h1>
    <p>Bienvenido a tu panel. Aquí podrás:</p>
    <ul>
      <li>Crear nuevas órdenes de envío de paquetes.</li>
      <li>
        Consultar y hacer seguimiento en tiempo real al estado de tus envíos.
      </li>
      <li>Visualizar el historial de actualizaciones de cada pedido.</li>
    </ul>
  </SidebarMenu>
);

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <p>Cargando...</p>;
  return user.role === "admin" ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;
