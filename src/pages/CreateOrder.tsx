import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Stack,
  Paper,
} from "@mui/material";

const CreateOrder = () => {
  const navigate = useNavigate();
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [productType, setProductType] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/orders", {
        weight: parseFloat(weight),
        dimensions,
        productType,
        destinationAddress,
      });

      setSuccessMessage("Orden creada correctamente.");
      setErrorMessage("");
      // Opcional: limpiar el formulario
      setWeight("");
      setDimensions("");
      setProductType("");
      setDestinationAddress("");

      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error("Error al crear orden:", err);
      setErrorMessage("Error al crear la orden. Verifica los datos.");
      setSuccessMessage("");
    }
  };

  return (
    <Box
      minHeight="calc(100vh - 64px)"
      bgcolor="#f0f4f8"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={2}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 800 }}>
        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          mb={3}
          textAlign="center"
        >
          Crear Nueva Orden
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Peso (kg)"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              label="Dimensiones (ej: 10x20x15 cm)"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              required
            />
            <TextField
              label="Tipo de producto"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              required
            />
            <TextField
              label="Dirección de destino"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              Crear Orden
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateOrder;
