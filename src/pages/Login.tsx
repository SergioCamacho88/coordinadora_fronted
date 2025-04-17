import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom'; // 👈 Importa useNavigate
import axios from '../services/api';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // 👈 Inicializa navigate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/auth/login', { email, password });

      if (response.data && response.data.token) {
        login(response.data.token);
        navigate('/dashboard'); // 👈 Redirige al Dashboard después de login
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Credenciales inválidas o error de conexión.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4">Iniciar Sesión</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

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
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
