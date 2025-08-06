import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Articulo } from '../types';
import { Plus, Trash2, Edit } from 'lucide-react';

const Articulos: React.FC = () => {
  const { articulos, familias, proveedores, formatos, addArticulo, deleteArticulo } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    formato: '',
    familia: '',
    proveedor: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nombre && formData.formato && formData.familia && formData.proveedor) {
      addArticulo(formData);
      setFormData({ nombre: '', formato: '', familia: '', proveedor: '' });
      setShowForm(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      deleteArticulo(id);
    }
  };

  const getFamiliaName = (familiaId: string) => {
    return familias.find(f => f.id === familiaId)?.nombre || familiaId;
  };

  const getProveedorName = (proveedorId: string) => {
    return proveedores.find(p => p.id === proveedorId)?.nombre || proveedorId;
  };

  const getFormatoName = (formatoId: string) => {
    return formatos.find(f => f.id === formatoId)?.nombre || formatoId;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Artículos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Artículo
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Nuevo Artículo</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Artículo
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Formato
                </label>
                <select
                  value={formData.formato}
                  onChange={(e) => setFormData({ ...formData, formato: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar formato</option>
                  {formatos.map(formato => (
                    <option key={formato.id} value={formato.id}>
                      {formato.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Familia
                </label>
                <select
                  value={formData.familia}
                  onChange={(e) => setFormData({ ...formData, familia: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar familia</option>
                  {familias.map(familia => (
                    <option key={familia.id} value={familia.id}>
                      {familia.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proveedor
                </label>
                <select
                  value={formData.proveedor}
                  onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map(proveedor => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
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
          <h2 className="text-lg font-semibold">Artículos ({articulos.length})</h2>
        </div>
        <div className="divide-y">
          {articulos.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No hay artículos registrados
            </div>
          ) : (
            articulos.map(articulo => (
              <div key={articulo.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{articulo.nombre}</h3>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Formato:</span> {getFormatoName(articulo.formato)}
                      </div>
                      <div>
                        <span className="font-medium">Familia:</span> {getFamiliaName(articulo.familia)}
                      </div>
                      <div>
                        <span className="font-medium">Proveedor:</span> {getProveedorName(articulo.proveedor)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(articulo.id)}
                    className="ml-4 text-red-600 hover:text-red-800 transition-colors"
                    title="Eliminar artículo"
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

export default Articulos; 