import { Outlet } from "react-router-dom"; // Para renderizar las rutas hijas
import SidebarMenu from "../components/SidebarMenu";

const MainLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Menú lateral */}
      <SidebarMenu />

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <Outlet /> {/* Aquí se renderizan las páginas dinámicas */}
      </main>
    </div>
  );
};

export default MainLayout;
