import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

const Welcome: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box
      minHeight="100vh"
      bgcolor="#f0f4f8"
      py={8}
      px={6}
      display="flex"
      flexDirection="column"
    >
      <Box maxWidth="1600px" mx="auto">
        <Box mb={8}>
          <Typography
            variant="h3"
            fontWeight="bold"
            color="primary.main"
            gutterBottom
          >
            Coordinadora - Sistema de Gestión Logística
          </Typography>
          <Typography variant="h6" color="text.secondary" maxWidth="700px">
            Plataforma integral para gestión de envíos, asignación de rutas
            logísticas y seguimiento de órdenes en tiempo real.
          </Typography>
        </Box>

        <Grid container columns={12} spacing={4} mb={8}>
          <Grid xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="primary.dark"
                  gutterBottom
                >
                  📦 Gestión de Envíos
                </Typography>
                <Box component="ul" sx={{ pl: 2, color: "text.secondary" }}>
                  <li>Creación y seguimiento de órdenes de envío</li>
                  <li>Asignación inteligente de rutas a transportistas</li>
                  <li>Seguimiento en tiempo real del estado de los envíos</li>
                  <li>Notificaciones automáticas por correo electrónico</li>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="primary.dark"
                  gutterBottom
                >
                  📊 Reportes y Métricas
                </Typography>
                <Box component="ul" sx={{ pl: 2, color: "text.secondary" }}>
                  <li>
                    Consulta avanzada de envíos con filtros personalizados
                  </li>
                  <li>Métricas de desempeño logístico</li>
                  <li>Análisis de tiempos de entrega por transportista</li>
                  <li>Visualización de datos en gráficos interactivos</li>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ mb: 8 }}>
          <CardContent>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="primary.dark"
              gutterBottom
            >
              🛠️ Tecnologías Principales
            </Typography>
            <Grid container columns={12} spacing={2}>
              {[
                "Node.js + TypeScript",
                "Express",
                "MySQL",
                "Redis",
                "WebSocket",
                "JWT",
                "React",
                "Material-UI",
              ].map((tech) => (
                <Grid xs={6} md={3} key={tech}>
                  <Box
                    bgcolor="#e3f2fd"
                    p={2}
                    textAlign="center"
                    borderRadius={2}
                  >
                    <Typography fontWeight="medium">{tech}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Box mb={8}>
          {isAuthenticated ? (
            <Button
              component={Link}
              to="/dashboard"
              variant="contained"
              color="primary"
              size="large"
            >
              Ir al Dashboard
            </Button>
          ) : (
            <Box display="flex" gap={2}>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
                size="large"
              >
                Iniciar Sesión
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                color="success"
                size="large"
              >
                Registrarse
              </Button>
            </Box>
          )}
        </Box>

        <Box color="text.secondary" fontSize="0.875rem" pb={4}>
          <Typography>Desarrollado por Sergio Camacho - Abril 2025</Typography>
          <Typography>Prueba Técnica Fullstack - Coordinadora</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Welcome;
