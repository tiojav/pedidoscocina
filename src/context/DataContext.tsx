import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Articulo, Familia, Proveedor, Formato, Pedido } from '../types';
import { 
  pedidosService, 
  articulosService, 
  familiasService, 
  proveedoresService,
  Pedido as PedidoDB,
  Articulo as ArticuloDB,
  Familia as FamiliaDB,
  Proveedor as ProveedorDB
} from '../services/database';

interface DataContextType {
  articulos: Articulo[];
  familias: Familia[];
  proveedores: Proveedor[];
  formatos: Formato[];
  pedidos: Pedido[];
  loading: boolean;
  error: string | null;
  addArticulo: (articulo: Omit<Articulo, 'id'>) => Promise<void>;
  addFamilia: (nombre: string) => Promise<void>;
  addProveedor: (nombre: string) => Promise<void>;
  addFormato: (nombre: string) => void;
  addPedido: (pedido: Omit<Pedido, 'id'>) => Promise<void>;
  deleteArticulo: (id: string) => Promise<void>;
  deleteFamilia: (id: string) => Promise<void>;
  deleteProveedor: (id: string) => Promise<void>;
  deleteFormato: (id: string) => void;
  updatePedidoEstado: (id: string, estado: Pedido['estado']) => Promise<void>;
  updateArticulo: (id: string, articulo: Partial<Articulo>) => Promise<void>;
  updateFamilia: (id: string, familia: Partial<Familia>) => Promise<void>;
  updateProveedor: (id: string, proveedor: Partial<Proveedor>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData debe ser usado dentro de un DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [formatos, setFormatos] = useState<Formato[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Iniciando carga de datos...');

        // Cargar datos en paralelo
        const [articulosData, familiasData, proveedoresData, pedidosData] = await Promise.all([
          articulosService.obtenerArticulos(),
          familiasService.obtenerFamilias(),
          proveedoresService.obtenerProveedores(),
          pedidosService.obtenerPedidos()
        ]);

        console.log('📊 Datos cargados:', {
          articulos: articulosData.length,
          familias: familiasData.length,
          proveedores: proveedoresData.length,
          pedidos: pedidosData.length
        });

        // Convertir datos de Firebase a tipos locales
        setArticulos(articulosData.map(convertirArticuloDB));
        setFamilias(familiasData.map(convertirFamiliaDB));
        setProveedores(proveedoresData.map(convertirProveedorDB));
        setPedidos(pedidosData.map(convertirPedidoDB));

        // Datos de ejemplo para formatos (por ahora locales)
        setFormatos([
          { id: '1', nombre: 'Kg' },
          { id: '2', nombre: 'L' },
          { id: '3', nombre: 'Unidad' },
          { id: '4', nombre: 'Paquete' },
          { id: '5', nombre: 'Docena' }
        ]);

        console.log('✅ Datos cargados exitosamente');

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(`Error al cargar los datos: ${errorMessage}`);
        console.error('❌ Error cargando datos:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Suscribirse a cambios en pedidos en tiempo real
  useEffect(() => {
    const unsubscribe = pedidosService.suscribirPedidos((pedidosData) => {
      setPedidos(pedidosData.map(convertirPedidoDB));
    });

    return () => unsubscribe();
  }, []);

  // Funciones de conversión
  const convertirArticuloDB = (articuloDB: ArticuloDB): Articulo => ({
    id: articuloDB.id!,
    nombre: articuloDB.nombre,
    formato: articuloDB.unidad,
    familia: articuloDB.familia || '',
    proveedor: articuloDB.proveedor || '',
    precio: articuloDB.precio,
    descripcion: articuloDB.descripcion
  });

  const convertirFamiliaDB = (familiaDB: FamiliaDB): Familia => ({
    id: familiaDB.id!,
    nombre: familiaDB.nombre,
    descripcion: familiaDB.descripcion
  });

  const convertirProveedorDB = (proveedorDB: ProveedorDB): Proveedor => ({
    id: proveedorDB.id!,
    nombre: proveedorDB.nombre,
    contacto: proveedorDB.contacto,
    telefono: proveedorDB.telefono,
    email: proveedorDB.email
  });

  const convertirPedidoDB = (pedidoDB: PedidoDB): Pedido => ({
    id: pedidoDB.id!,
    fecha: pedidoDB.fecha,
    articulos: pedidoDB.articulos.map(art => ({
      id: art.id,
      nombre: art.nombre,
      cantidad: art.cantidad,
      formato: art.unidad,
      precio: art.precio
    })),
    estado: pedidoDB.estado,
    proveedor: pedidoDB.proveedor || '',
    notas: pedidoDB.notas,
    creadoPor: pedidoDB.creadoPor || 'cocinero'
  });

  // Funciones CRUD
  const addArticulo = async (articulo: Omit<Articulo, 'id'>) => {
    try {
      console.log('➕ Creando artículo:', articulo);
      
      const articuloDB: Omit<ArticuloDB, 'id'> = {
        nombre: articulo.nombre,
        descripcion: articulo.descripcion,
        precio: articulo.precio,
        unidad: articulo.formato,
        familia: articulo.familia,
        proveedor: articulo.proveedor,
        activo: true
      };

      const id = await articulosService.crearArticulo(articuloDB);
      console.log('✅ Artículo creado con ID:', id);
      
      // Recargar artículos
      const articulosData = await articulosService.obtenerArticulos();
      setArticulos(articulosData.map(convertirArticuloDB));
      
      console.log('📊 Artículos actualizados:', articulosData.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al crear el artículo: ${errorMessage}`);
      console.error('❌ Error creando artículo:', err);
    }
  };

  const addFamilia = async (nombre: string) => {
    try {
      await familiasService.crearFamilia({
        nombre,
        descripcion: '',
        activo: true
      });

      // Recargar familias
      const familiasData = await familiasService.obtenerFamilias();
      setFamilias(familiasData.map(convertirFamiliaDB));
    } catch (err) {
      setError('Error al crear la familia');
      console.error('Error creando familia:', err);
    }
  };

  const addProveedor = async (nombre: string) => {
    try {
      await proveedoresService.crearProveedor({
        nombre,
        contacto: '',
        telefono: '',
        email: '',
        activo: true
      });

      // Recargar proveedores
      const proveedoresData = await proveedoresService.obtenerProveedores();
      setProveedores(proveedoresData.map(convertirProveedorDB));
    } catch (err) {
      setError('Error al crear el proveedor');
      console.error('Error creando proveedor:', err);
    }
  };

  const addFormato = (nombre: string) => {
    const newFormato: Formato = {
      id: Date.now().toString(),
      nombre,
    };
    setFormatos(prev => [...prev, newFormato]);
  };

  const addPedido = async (pedido: Omit<Pedido, 'id'>) => {
    try {
      console.log('🛒 Creando pedido:', pedido);
      
      const pedidoDB: Omit<PedidoDB, 'id'> = {
        fecha: pedido.fecha,
        articulos: pedido.articulos.map(art => ({
          id: art.id,
          nombre: art.nombre,
          cantidad: art.cantidad,
          unidad: art.formato,
          precio: art.precio
        })),
        estado: pedido.estado,
        proveedor: pedido.proveedor,
        notas: pedido.notas,
        creadoPor: pedido.creadoPor
      };

      console.log('📦 Pedido a guardar en DB:', pedidoDB);
      const id = await pedidosService.crearPedido(pedidoDB);
      console.log('✅ Pedido creado con ID:', id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al crear el pedido: ${errorMessage}`);
      console.error('❌ Error creando pedido:', err);
    }
  };

  const deleteArticulo = async (id: string) => {
    try {
      await articulosService.eliminarArticulo(id);
      setArticulos(prev => prev.filter(articulo => articulo.id !== id));
    } catch (err) {
      setError('Error al eliminar el artículo');
      console.error('Error eliminando artículo:', err);
    }
  };

  const deleteFamilia = async (id: string) => {
    try {
      await familiasService.eliminarFamilia(id);
      setFamilias(prev => prev.filter(familia => familia.id !== id));
      setArticulos(prev => prev.filter(articulo => articulo.familia !== id));
    } catch (err) {
      setError('Error al eliminar la familia');
      console.error('Error eliminando familia:', err);
    }
  };

  const deleteProveedor = async (id: string) => {
    try {
      await proveedoresService.eliminarProveedor(id);
      setProveedores(prev => prev.filter(proveedor => proveedor.id !== id));
      setArticulos(prev => prev.filter(articulo => articulo.proveedor !== id));
    } catch (err) {
      setError('Error al eliminar el proveedor');
      console.error('Error eliminando proveedor:', err);
    }
  };

  const deleteFormato = (id: string) => {
    setFormatos(prev => prev.filter(formato => formato.id !== id));
    setArticulos(prev => prev.filter(articulo => articulo.formato !== id));
  };

  const updatePedidoEstado = async (id: string, estado: Pedido['estado']) => {
    try {
      await pedidosService.actualizarPedido(id, { estado });
    } catch (err) {
      setError('Error al actualizar el estado del pedido');
      console.error('Error actualizando pedido:', err);
    }
  };

  const updateArticulo = async (id: string, articulo: Partial<Articulo>) => {
    try {
      const articuloDB: Partial<ArticuloDB> = {
        nombre: articulo.nombre,
        descripcion: articulo.descripcion,
        precio: articulo.precio,
        unidad: articulo.formato,
        familia: articulo.familia,
        proveedor: articulo.proveedor
      };

      await articulosService.actualizarArticulo(id, articuloDB);
      
      // Recargar artículos
      const articulosData = await articulosService.obtenerArticulos();
      setArticulos(articulosData.map(convertirArticuloDB));
    } catch (err) {
      setError('Error al actualizar el artículo');
      console.error('Error actualizando artículo:', err);
    }
  };

  const updateFamilia = async (id: string, familia: Partial<Familia>) => {
    try {
      await familiasService.actualizarFamilia(id, {
        nombre: familia.nombre,
        descripcion: familia.descripcion
      });

      // Recargar familias
      const familiasData = await familiasService.obtenerFamilias();
      setFamilias(familiasData.map(convertirFamiliaDB));
    } catch (err) {
      setError('Error al actualizar la familia');
      console.error('Error actualizando familia:', err);
    }
  };

  const updateProveedor = async (id: string, proveedor: Partial<Proveedor>) => {
    try {
      await proveedoresService.actualizarProveedor(id, {
        nombre: proveedor.nombre,
        contacto: proveedor.contacto,
        telefono: proveedor.telefono,
        email: proveedor.email
      });

      // Recargar proveedores
      const proveedoresData = await proveedoresService.obtenerProveedores();
      setProveedores(proveedoresData.map(convertirProveedorDB));
    } catch (err) {
      setError('Error al actualizar el proveedor');
      console.error('Error actualizando proveedor:', err);
    }
  };

  return (
    <DataContext.Provider value={{
      articulos,
      familias,
      proveedores,
      formatos,
      pedidos,
      loading,
      error,
      addArticulo,
      addFamilia,
      addProveedor,
      addFormato,
      addPedido,
      deleteArticulo,
      deleteFamilia,
      deleteProveedor,
      deleteFormato,
      updatePedidoEstado,
      updateArticulo,
      updateFamilia,
      updateProveedor,
    }}>
      {children}
    </DataContext.Provider>
  );
}; 