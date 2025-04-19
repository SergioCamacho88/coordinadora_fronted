import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Welcome: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
            🚚 Coordinadora - Sistema de Gestión Logística
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plataforma integral para gestión de envíos, asignación de rutas logísticas y seguimiento de órdenes en tiempo real.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">📦 Gestión de Envíos</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Creación y seguimiento de órdenes de envío
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Asignación inteligente de rutas a transportistas
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Seguimiento en tiempo real del estado de los envíos
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Notificaciones automáticas por correo electrónico
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">📊 Reportes y Métricas</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Consulta avanzada de envíos con filtros personalizados
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Métricas de desempeño logístico
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Análisis de tiempos de entrega por transportista
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Visualización de datos en gráficos interactivos
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-12">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">🛠️ Tecnologías Principales</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded text-center">
              <span className="font-semibold">Node.js + TypeScript</span>
            </div>
            <div className="bg-blue-50 p-3 rounded text-center">
              <span className="font-semibold">Express</span>
            </div>
            <div className="bg-blue-50 p-3 rounded text-center">
              <span className="font-semibold">MySQL</span>
            </div>
            <div className="bg-blue-50 p-3 rounded text-center">
              <span className="font-semibold">Redis</span>
            </div>
            <div className="bg-blue-50 p-3 rounded text-center">
              <span className="font-semibold">WebSocket</span>
            </div>
            <div className="bg-blue-50 p-3 rounded text-center">
              <span className="font-semibold">JWT</span>
            </div>
            <div className="bg-blue-50 p-3 rounded text-center">
              <span className="font-semibold">React</span>
            </div>
            <div className="bg-blue-50 p-3 rounded text-center">
              <span className="font-semibold">Tailwind CSS</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Ir al Dashboard
            </Link>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Desarrollado por Sergio Camacho - Abril 2025</p>
          <p>Prueba Técnica Fullstack - Coordinadora</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
