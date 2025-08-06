import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Trash2 } from 'lucide-react';

const Formatos: React.FC = () => {
  const { formatos, addFormato, deleteFormato } = useData();
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim()) {
      addFormato(nombre.trim());
      setNombre('');
      setShowForm(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este formato? Esto también eliminará todos los artículos asociados.')) {
      deleteFormato(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Formatos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Formato
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Nuevo Formato</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Formato
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Kg, L, Unidad, Paquete..."
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setNombre('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Formatos ({formatos.length})</h2>
        </div>
        <div className="divide-y">
          {formatos.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No hay formatos registrados
            </div>
          ) : (
            formatos.map(formato => (
              <div key={formato.id} className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{formato.nombre}</h3>
                    <p className="text-sm text-gray-600">ID: {formato.id}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(formato.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Eliminar formato"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Formatos; 