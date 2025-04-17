import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';

const CreateOrder = () => {
  const navigate = useNavigate();
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [productType, setProductType] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('/orders', {
        weight: parseFloat(weight),
        dimensions,
        productType,
        destinationAddress,
      });

      setSuccessMessage('Orden creada correctamente.');
      setErrorMessage('');
      // Opcional: limpiar el formulario
      setWeight('');
      setDimensions('');
      setProductType('');
      setDestinationAddress('');

      // Opcional: redireccionar al dashboard después de unos segundos
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Error al crear orden:', err);
      setErrorMessage('Error al crear la orden. Verifica los datos.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Crear Nueva Orden</h2>

        {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

        <input
          type="number"
          placeholder="Peso (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="border p-2 w-full mb-4"
          required
          min="0"
          step="0.01"
        />
        <input
          type="text"
          placeholder="Dimensiones (ej: 10x20x15 cm)"
          value={dimensions}
          onChange={(e) => setDimensions(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />
        <input
          type="text"
          placeholder="Tipo de producto"
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />
        <input
          type="text"
          placeholder="Dirección de destino"
          value={destinationAddress}
          onChange={(e) => setDestinationAddress(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />

        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">
          Crear Orden
        </button>
      </form>
    </div>
  );
};

export default CreateOrder;
