import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Articulo, PedidoArticulo, Pedido } from '../types';
import { Plus, Trash2, Send, Eye, ChevronDown, ChevronRight, Minus, Calendar, Filter, SortAsc, SortDesc } from 'lucide-react';

const Pedidos: React.FC = () => {
  const { articulos, familias, proveedores, formatos, pedidos, addPedido, updatePedidoEstado } = useData();
  const { userRole } = useAuth();
  const [selectedFamilia, setSelectedFamilia] = useState<string>('');
  const [pedidoActual, setPedidoActual] = useState<PedidoArticulo[]>([]);
  const [showNuevoPedido, setShowNuevoPedido] = useState(false);
  const [expandedFamilias, setExpandedFamilias] = useState<Set<string>>(new Set());
  
  // Estados para filtros y ordenamiento
  const [filtroFechaInicio, setFiltroFechaInicio] = useState<string>('');
  const [filtroFechaFin, setFiltroFechaFin] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [ordenamiento, setOrdenamiento] = useState<'fecha' | 'estado' | 'proveedor'>('fecha');
  const [direccionOrden, setDireccionOrden] = useState<'asc' | 'desc'>('desc');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Agrupar artículos por familia
  const articulosPorFamilia = familias.reduce((acc, familia) => {
    acc[familia.id] = articulos.filter(articulo => articulo.familia === familia.id);
    return acc;
  }, {} as Record<string, Articulo[]>);

  const handleAddArticulo = (articulo: Articulo, cantidad: number = 1) => {
    const existingItem = pedidoActual.find(item => item.articuloId === articulo.id);
    
    if (existingItem) {
      setPedidoActual(prev => 
        prev.map(item => 
          item.articuloId === articulo.id 
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      );
    } else {
      setPedidoActual(prev => [...prev, {
        articuloId: articulo.id,
        cantidad: cantidad,
        nombre: articulo.nombre,
        formato: articulo.formato,
        familia: articulo.familia,
        proveedor: articulo.proveedor
      }]);
    }
  };

  const handleRemoveArticulo = (articuloId: string) => {
    setPedidoActual(prev => prev.filter(item => item.articuloId !== articuloId));
  };

  const handleUpdateCantidad = (articuloId: string, cantidad: number) => {
    if (cantidad <= 0) {
      handleRemoveArticulo(articuloId);
      return;
    }
    
    setPedidoActual(prev => 
      prev.map(item => 
        item.articuloId === articuloId 
          ? { ...item, cantidad }
          : item
      )
    );
  };

  const handleToggleFamilia = (familiaId: string) => {
    setExpandedFamilias(prev => {
      const newSet = new Set(prev);
      if (newSet.has(familiaId)) {
        newSet.delete(familiaId);
      } else {
        newSet.add(familiaId);
      }
      return newSet;
    });
  };

  const handleIncrementArticulo = (articulo: Articulo) => {
    handleAddArticulo(articulo, 1);
  };

  const handleDecrementArticulo = (articulo: Articulo) => {
    const existingItem = pedidoActual.find(item => item.articuloId === articulo.id);
    if (existingItem) {
      const newCantidad = existingItem.cantidad - 1;
      if (newCantidad <= 0) {
        handleRemoveArticulo(articulo.id);
      } else {
        handleUpdateCantidad(articulo.id, newCantidad);
      }
    }
  };

  const handleCrearPedido = () => {
    if (pedidoActual.length === 0) return;

    // Agrupar por proveedor
    const pedidosPorProveedor = pedidoActual.reduce((acc, item) => {
      if (!acc[item.proveedor]) {
        acc[item.proveedor] = [];
      }
      acc[item.proveedor].push(item);
      return acc;
    }, {} as Record<string, PedidoArticulo[]>);

    // Crear un pedido por cada proveedor
    Object.entries(pedidosPorProveedor).forEach(([proveedor, articulos]) => {
      addPedido({
        fecha: new Date(),
        articulos,
        estado: 'pendiente',
        proveedor
      });
    });

    setPedidoActual([]);
    setShowNuevoPedido(false);
  };

  const getProveedorName = (proveedorId: string) => {
    const proveedor = proveedores.find(p => p.id === proveedorId);
    return proveedor?.nombre || proveedorId;
  };

  const getFormatoName = (formatoId: string) => {
    const formato = formatos.find(f => f.id === formatoId);
    return formato?.nombre || formatoId;
  };

  // Función para filtrar y ordenar pedidos
  const pedidosFiltradosYOrdenados = useMemo(() => {
    let pedidosFiltrados = [...pedidos];

    // Filtrar por fechas
    if (filtroFechaInicio) {
      const fechaInicio = new Date(filtroFechaInicio);
      pedidosFiltrados = pedidosFiltrados.filter(pedido => 
        pedido.fecha >= fechaInicio
      );
    }

    if (filtroFechaFin) {
      const fechaFin = new Date(filtroFechaFin);
      fechaFin.setHours(23, 59, 59, 999); // Incluir todo el día
      pedidosFiltrados = pedidosFiltrados.filter(pedido => 
        pedido.fecha <= fechaFin
      );
    }

    // Filtrar por estado
    if (filtroEstado) {
      pedidosFiltrados = pedidosFiltrados.filter(pedido => 
        pedido.estado === filtroEstado
      );
    }

    // Ordenar pedidos
    pedidosFiltrados.sort((a, b) => {
      let valorA: any;
      let valorB: any;

      switch (ordenamiento) {
        case 'fecha':
          valorA = a.fecha;
          valorB = b.fecha;
          break;
        case 'estado':
          valorA = a.estado;
          valorB = b.estado;
          break;
        case 'proveedor':
          valorA = getProveedorName(a.proveedor);
          valorB = getProveedorName(b.proveedor);
          break;
        default:
          valorA = a.fecha;
          valorB = b.fecha;
      }

      if (valorA < valorB) {
        return direccionOrden === 'asc' ? -1 : 1;
      }
      if (valorA > valorB) {
        return direccionOrden === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return pedidosFiltrados;
  }, [pedidos, filtroFechaInicio, filtroFechaFin, filtroEstado, ordenamiento, direccionOrden]);

  const limpiarFiltros = () => {
    setFiltroFechaInicio('');
    setFiltroFechaFin('');
    setFiltroEstado('');
    setOrdenamiento('fecha');
    setDireccionOrden('desc');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {userRole === 'cocinero' ? 'Crear Pedidos' : 'Gestión de Pedidos'}
        </h1>
        {userRole === 'cocinero' && (
          <button
            onClick={() => setShowNuevoPedido(!showNuevoPedido)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Pedido
          </button>
        )}
      </div>

      {userRole === 'cocinero' && showNuevoPedido && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Nuevo Pedido</h2>
          
          {/* Selector de familia */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Familia
            </label>
            <select
              value={selectedFamilia}
              onChange={(e) => setSelectedFamilia(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Todas las familias</option>
              {familias.map(familia => (
                <option key={familia.id} value={familia.id}>
                  {familia.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Lista de artículos agrupados por familias */}
          <div className="space-y-4 mb-6">
            {familias
              .filter(familia => !selectedFamilia || familia.id === selectedFamilia)
              .map(familia => {
                const isExpanded = expandedFamilias.has(familia.id);
                const articulosFamilia = articulosPorFamilia[familia.id] || [];
                
                return (
                  <div key={familia.id} className="border rounded-lg overflow-hidden">
                    {/* Header de la familia */}
                    <button
                      onClick={() => handleToggleFamilia(familia.id)}
                      className="w-full p-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900">{familia.nombre}</h3>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                    
                    {/* Contenido desplegable */}
                    {isExpanded && (
                      <div className="p-4 space-y-3">
                        {articulosFamilia.length === 0 ? (
                          <p className="text-gray-500 text-sm">No hay artículos en esta familia</p>
                        ) : (
                          articulosFamilia.map(articulo => {
                            const existingItem = pedidoActual.find(item => item.articuloId === articulo.id);
                            const cantidad = existingItem?.cantidad || 0;
                            
                            return (
                              <div key={articulo.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                                <div className="flex-1">
                                  <div className="font-medium">{articulo.nombre}</div>
                                  <div className="text-sm text-gray-600">
                                    {getFormatoName(articulo.formato)} - {getProveedorName(articulo.proveedor)}
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleDecrementArticulo(articulo)}
                                    disabled={cantidad === 0}
                                    className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={cantidad}
                                    onChange={(e) => {
                                      const newCantidad = parseFloat(e.target.value) || 0;
                                      if (newCantidad === 0) {
                                        handleRemoveArticulo(articulo.id);
                                      } else {
                                        handleUpdateCantidad(articulo.id, newCantidad);
                                      }
                                    }}
                                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                                    placeholder="0"
                                  />
                                  
                                  <button
                                    onClick={() => handleIncrementArticulo(articulo)}
                                    className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Pedido actual */}
          {pedidoActual.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Pedido Actual</h3>
              <div className="space-y-3">
                {pedidoActual.map(item => (
                  <div key={item.articuloId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.nombre}</div>
                      <div className="text-sm text-gray-600">
                        {getFormatoName(item.formato)} - {getProveedorName(item.proveedor)}
                      </div>
                    </div>
                                         <div className="flex items-center space-x-2">
                       <button
                         onClick={() => handleDecrementArticulo({ id: item.articuloId, nombre: item.nombre, formato: item.formato, familia: item.familia, proveedor: item.proveedor } as Articulo)}
                         className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                       >
                         <Minus className="w-4 h-4" />
                       </button>
                       
                       <input
                         type="number"
                         min="0"
                         step="0.01"
                         value={item.cantidad}
                         onChange={(e) => {
                           const newCantidad = parseFloat(e.target.value) || 0;
                           if (newCantidad === 0) {
                             handleRemoveArticulo(item.articuloId);
                           } else {
                             handleUpdateCantidad(item.articuloId, newCantidad);
                           }
                         }}
                         className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                       />
                       
                       <button
                         onClick={() => handleIncrementArticulo({ id: item.articuloId, nombre: item.nombre, formato: item.formato, familia: item.familia, proveedor: item.proveedor } as Articulo)}
                         className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                       >
                         <Plus className="w-4 h-4" />
                       </button>
                       
                       <button
                         onClick={() => handleRemoveArticulo(item.articuloId)}
                         className="text-red-600 hover:text-red-800 ml-2"
                         title="Eliminar del pedido"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleCrearPedido}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Crear Pedido
                </button>
              </div>
            </div>
          )}
        </div>
      )}

             {/* Lista de pedidos */}
       <div className="bg-white rounded-lg shadow">
         <div className="px-6 py-4 border-b">
           <div className="flex justify-between items-center">
             <h2 className="text-lg font-semibold">Pedidos ({pedidosFiltradosYOrdenados.length})</h2>
             <div className="flex items-center space-x-2">
               <button
                 onClick={() => setMostrarFiltros(!mostrarFiltros)}
                 className="flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
               >
                 <Filter className="w-4 h-4 mr-1" />
                 Filtros
               </button>
               <button
                 onClick={() => setDireccionOrden(direccionOrden === 'asc' ? 'desc' : 'asc')}
                 className="flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                 title={`Ordenar ${direccionOrden === 'asc' ? 'descendente' : 'ascendente'}`}
               >
                 {direccionOrden === 'asc' ? (
                   <SortAsc className="w-4 h-4 mr-1" />
                 ) : (
                   <SortDesc className="w-4 h-4 mr-1" />
                 )}
                 Ordenar
               </button>
             </div>
           </div>
           
                       {/* Panel de filtros */}
            {mostrarFiltros && (
              <div className="px-6 py-4 bg-gray-50 border-b">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha Inicio
                    </label>
                    <input
                      type="date"
                      value={filtroFechaInicio}
                      onChange={(e) => setFiltroFechaInicio(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha Fin
                    </label>
                    <input
                      type="date"
                      value={filtroFechaFin}
                      onChange={(e) => setFiltroFechaFin(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      value={filtroEstado}
                      onChange={(e) => setFiltroEstado(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Todos los estados</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="enviado">Enviado</option>
                      <option value="recibido">Recibido</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ordenar por
                    </label>
                    <select
                      value={ordenamiento}
                      onChange={(e) => setOrdenamiento(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="fecha">Fecha</option>
                      <option value="estado">Estado</option>
                      <option value="proveedor">Proveedor</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={limpiarFiltros}
                      className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                    >
                      Limpiar Filtros
                    </button>
                  </div>
                </div>
              </div>
            )}
         </div>
         <div className="divide-y">
           {pedidosFiltradosYOrdenados.length === 0 ? (
             <div className="p-6 text-center text-gray-500">
               {pedidos.length === 0 ? 'No hay pedidos registrados' : 'No hay pedidos que coincidan con los filtros'}
             </div>
           ) : (
             pedidosFiltradosYOrdenados.map(pedido => (
              <div key={pedido.id} className="p-6">
                                 <div className="flex justify-between items-start mb-4">
                   <div>
                     <h3 className="font-semibold">Pedido #{pedido.id.slice(0, 8)}</h3>
                     <div className="text-sm text-gray-600 space-y-1">
                       <p>
                         <span className="font-medium">Creado:</span> {pedido.fecha.toLocaleDateString('es-ES')} - {pedido.fecha.toLocaleTimeString('es-ES')}
                       </p>
                       {pedido.fechaEnvio && (
                         <p>
                           <span className="font-medium">Enviado:</span> {pedido.fechaEnvio.toLocaleDateString('es-ES')} - {pedido.fechaEnvio.toLocaleTimeString('es-ES')}
                         </p>
                       )}
                     </div>
                   </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      pedido.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      pedido.estado === 'enviado' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {pedido.estado}
                    </span>
                    {userRole === 'jefe_compras' && (
                      <select
                        value={pedido.estado}
                        onChange={(e) => updatePedidoEstado(pedido.id, e.target.value as any)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="enviado">Enviado</option>
                        <option value="recibido">Recibido</option>
                      </select>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {pedido.articulos.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <div className="font-medium">{item.nombre}</div>
                        <div className="text-sm text-gray-600">
                          {getFormatoName(item.formato)} - {getProveedorName(item.proveedor)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{item.cantidad}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Pedidos; 