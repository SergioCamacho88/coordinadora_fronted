import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';

const AssignOrder = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [transportistaId, setTransportistaId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`/orders/${orderId}/assign`, {
        transportistaId: parseInt(transportistaId),
      });

      setSuccessMessage('Orden asignada correctamente.');
      setErrorMessage('');
      setOrderId('');
      setTransportistaId('');

      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Error al asignar orden:', err);
      setErrorMessage('Error al asignar la orden. Verifica los datos o la disponibilidad.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Asignar Orden a Transportista</h2>

        {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

        <input
          type="text"
          placeholder="ID de la Orden"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />
        <input
          type="text"
          placeholder="ID del Transportista"
          value={transportistaId}
          onChange={(e) => setTransportistaId(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />

        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">
          Asignar Orden
        </button>
      </form>
    </div>
  );
};

export default AssignOrder;
