import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContextObject"; // Corregir la ruta

const SidebarMenu = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems =
    user?.role === "admin"
      ? [
          { name: "Dashboard", path: "/admin/dashboard" },
          { name: "Asignar Rutas", path: "/admin/asignar" },
          { name: "Seguimiento de Envíos", path: "/admin/ordenes" },
          { name: "Reportes", path: "/admin/reportes" },
        ]
      : [
          { name: "Dashboard", path: "/user/dashboard" },
          { name: "Crear Envío", path: "/user/create-order" },
          { name: "Historial", path: "/user/historial" },
        ];

  return (
    <aside className="w-64 h-screen bg-white shadow-md p-6 flex flex-col">
      <div className="mb-10 text-2xl font-bold text-gray-800">
        {user?.role === "admin" ? "Bienvenido Admin " : "Bienvenido usuario "}
        {user?.email}
      </div>
      <nav className="flex-1">
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="block py-2 px-4 rounded hover:bg-gray-100 text-gray-700 font-medium"
              >
                {item.name}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left py-2 px-4 rounded hover:bg-red-100 text-red-600 font-medium"
            >
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarMenu;
