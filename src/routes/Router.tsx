import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CreateOrder from "../pages/CreateOrder";
import Dashboard from "../pages/Dashboard";
import AssignOrder from "../pages/AssignOrder";
import TrackOrderPage from "../pages/TrackOrderPage"; // 👈 Importa tu nueva página

const Router = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route path="/create-order" element={<CreateOrder />} />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />
        <Route
          path="/assign-order"
          element={isAuthenticated ? <AssignOrder /> : <Navigate to="/login" />}
        />
        <Route path="/seguimiento/:orderId" element={<TrackOrderPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
