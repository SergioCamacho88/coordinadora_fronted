import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('/auth/register', { name, email, password });

      // Después de registro exitoso, redirigir al Login
      navigate('/login');
    } catch (err) {
      console.error('Error en registro:', err);
      setError('Error al registrarse. Verifica los datos.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4">Registrarse</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />

        <button type="submit" className="bg-green-500 text-white p-2 w-full rounded">
          Registrarse
        </button>
      </form>
      <div className="mt-4 text-center">
  <a href="/login" className="text-blue-500 hover:underline">¿Ya tienes cuenta? Inicia sesión</a>
</div>

    </div>
  );
};

export default Register;
