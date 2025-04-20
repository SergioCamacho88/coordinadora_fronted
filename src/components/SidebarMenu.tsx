import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContextObject";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const SidebarMenu = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDrawer = () => {
    setOpen(!open);
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
    <>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ backgroundColor: "#1565c0" }}>
        <Toolbar>
          {/* Icono de Menú */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Título */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {user?.role === "admin" ? "Panel Admin" : "Panel Usuario"}
          </Typography>

          {/* Email */}
          <Typography variant="body2">{user?.email} </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": { width: 260, padding: 2 },
        }}
      >
        <Box display="flex" flexDirection="column" height="100%">
          <Box mb={2}>
            <Typography variant="h6" fontWeight="bold">
              Menú
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Lista */}
          <Box flexGrow={1}>
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    onClick={toggleDrawer}
                  >
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Button
              sx={{ mt: 1, p: 1 }}
              variant="contained"
              color="error"
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              fullWidth
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Espaciador para bajar el contenido */}
      <Box component="main" sx={{ mt: 8, p: 3 }}>
        {children}
      </Box>
    </>
  );
};

export default SidebarMenu;
