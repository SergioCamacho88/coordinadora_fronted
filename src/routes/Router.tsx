import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CreateOrder from "../pages/CreateOrder";
import Dashboard from "../pages/Dashboard";

import TrackOrderPage from "../pages/TrackOrderPage";
import AdminReports from "../pages/AdminReports";
import HistorialUser from "../pages/user/HistorialUser";
import Welcome from "../pages/welcome";
import AdminDashboard from "../pages/AdminDashboard";
import Orders from "../pages/Orders";

const Router = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas dentro del MainLayout */}
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="user/create-order"
            element={
              isAuthenticated ? <CreateOrder /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/user/historial"
            element={
              isAuthenticated ? <HistorialUser /> : <Navigate to="/login" />
            }
          />

          <Route
            path="admin/asignar"
            element={
              isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="admin/ordenes"
            element={isAuthenticated ? <Orders /> : <Navigate to="/login" />}
          />

          <Route
            path="/seguimiento/:orderId"
            element={
              isAuthenticated ? <TrackOrderPage /> : <Navigate to="/login" />
            }
          />

          {/* Rutas de administrador */}
          {user?.role === "admin" && (
            <Route path="/admin/reportes" element={<AdminReports />} />
          )}
        </Route>

        {/* Ruta por defecto */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
