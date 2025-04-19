import { Outlet } from "react-router-dom"; // Para renderizar las rutas hijas
import SidebarMenu from "../components/SidebarMenu";

const MainLayout = () => {
  return (
    <div className=" h-screen">
      {/* Menú lateral */}
      <SidebarMenu />

      {/* Contenido principal */}
      <main className="">
        <Outlet /> {/* Aquí se renderizan las páginas dinámicas */}
      </main>
    </div>
  );
};

export default MainLayout;
