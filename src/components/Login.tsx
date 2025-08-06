import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChefHat, ShoppingCart, X } from 'lucide-react';

const Login: React.FC = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleCocineroLogin = () => {
    login('cocinero');
  };

  const handleJefeComprasLogin = () => {
    setShowPasswordModal(true);
    setError('');
    setPassword('');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (login(password)) {
      setPassword('');
      setShowPasswordModal(false);
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const closeModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="Vermuteria Don Tomás Gandia" 
            className="h-32 w-auto mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pedidos Cocina
          </h1>
          <p className="text-gray-600">
            Sistema de gestión de pedidos
          </p>
        </div>

        <div className="space-y-4">
          {/* Botón Cocinero */}
          <button
            onClick={handleCocineroLogin}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
          >
            <ChefHat className="w-6 h-6 mr-3" />
            <div className="text-left">
              <div className="font-semibold text-lg">Cocinero</div>
              <div className="text-sm opacity-90">Acceso directo sin contraseña</div>
            </div>
          </button>

          {/* Botón Jefe de Compras */}
          <button
            onClick={handleJefeComprasLogin}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
          >
            <ShoppingCart className="w-6 h-6 mr-3" />
            <div className="text-left">
              <div className="font-semibold text-lg">Jefe de Compras</div>
              <div className="text-sm opacity-90">Acceso con contraseña</div>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Selecciona tu rol para continuar</p>
        </div>
      </div>

      {/* Modal para contraseña del Jefe de Compras */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-green-600" />
                Jefe de Compras
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Ingresa la contraseña"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  Iniciar Sesión
                </button>
              </div>
            </form>

            
          </div>
        </div>
      )}
    </div>
  );
};

export default Login; 